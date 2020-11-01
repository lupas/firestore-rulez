const fs = require("fs");
const yup = require("yup");
const chalk = require("chalk");
const logger = require("./logger");

const allHelpers = [
  "authUserEmail",
  "authUserEmailIsVerified",
  "authUserUid",
  "existingData",
  "hasAmtOfWriteFields",
  "incomingData",
  "isAuthenticated",
];

const defaultConfig = {
  helpers: allHelpers,
  custom_helpers_folder: null,
  rules_version: 1,
  rules_folder: "rules",
  rules_output: "firestore.rules",
  use_firebase_config: false,
};

const configSchema = yup.object().shape({
  helpers: yup.array().of(yup.mixed().oneOf(allHelpers)),
  custom_helpers_folder: yup.string().nullable(true),
  rules_version: yup.mixed().oneOf([1, 2, "1", "2"]),
  rules_folder: yup.string(),
  rules_output: yup.string(),
  use_firebase_config: yup.boolean(),
});

function mergeConfig(config) {
  logger(chalk.blue.bold("Loading ") + "Remaining default values into config");
  var c = Object.assign({}, defaultConfig, config);
  if (typeof c.helpers === "boolean") {
    if (c.helpers) {
      c.helpers = defaultConfig.helpers;
    } else {
      c.helpers = [];
    }
  }
  return c;
}

async function validateConfig(config, execPath) {
  logger(chalk.blue.bold("Validating ") + "Config File");
  return await configSchema
    .validate(config, { abortEarly: false, strict: true })
    .then((data) => {
      //Log Config Valid
      logger(chalk.green.bold("Config File Valid"), true, true);
      return data;
    })
    .then((data) => {
      //Get Firebase Settings if use_firebase_config is true
      if (data.use_firebase_config) {
        //Does Firebase JSON exist
        if (fs.existsSync(`${execPath}/firebase.json`)) {
          //Load firebase.json
          const firebase = require("./firebase.json");

          //Is Firestore configured
          if (firebase.firestore) {
            data.rules_output = firebase.firestore.rules || data.rules_output;
          } else {
            //Warn when not configured and return default output path
            logger(
              chalk.red.bold("Warning ") +
                `Firestore not configured in firebase.json, reverting to default output file {${defaultConfig.rules_output}}`
            );
            data.rules_output = defaultConfig.rules_output;
          }
        } else {
          logger(
            chalk.red.bold("Warning ") +
              `firebase.json not found, reverting to default output file {${defaultConfig.rules_output}}`
          );
          data.rules_output = defaultConfig.rules_output;
        }
      }
      return data;
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        logger(chalk.red.bold("Config Errors:"), false, true);

        Object.keys(defaultConfig).forEach((item) => {
          if (err.inner.some((v) => v.path.startsWith(item))) {
            logger(chalk.red.bold("ERROR ") + item);
          } else {
            logger(chalk.green.bold("VALID ") + item);
          }
        });
        logger(chalk.blue.bold("See readme for config schema:"), true);
        logger("https://github.com/lupas/firestore-rulez", false, true);
        return { err: true, type: "validation" };
      } else {
        return { err: true, type: "other", obj: err };
      }
    });
}
//Get config file or use defaults
async function getConfig(execPath) {
  logger(chalk.blue.bold("Loading ") + "Config File");
  if (fs.existsSync(`${execPath}/rulez.config.js`)) {
    logger(chalk.green.bold("Using ") + "/rulez.config.js");

    return await validateConfig(
      mergeConfig(require(`${execPath}/rulez.config.js`)),
      execPath
    );
  } else if (fs.existsSync(`${execPath}/rules/rulez.config.js`)) {
    logger(chalk.green.bold("Using ") + "/rules/rulez.config.js");

    return await validateConfig(
      mergeConfig(require(`${execPath}/rules/rulez.config.js`)),
      execPath
    );
  } else {
    logger(chalk.red.bold("Warning ") + "No rulez.config.js file found");
    logger(chalk.green.bold("Using ") + "default values");
    return defaultConfig;
  }
}
module.exports = getConfig;
