#!/usr/bin/env node
const concat = require("concat");
const glob = require("glob");
const fs = require("fs");
const chalk = require("chalk");
const figlet = require("figlet");
const logger = require("./logger");
const err = console.error;

const standardErrorMessage =
  "❌ " + chalk.redBright("Creating firestore.rules failed.");
const execPath = process.cwd();

const compileFirestoreRules = async function () {
  logger(
    chalk.red(
      figlet.textSync("Firestore  Rulez", {
        horizontalLayout: "full",
      })
    )
  );

  const config = await require(`./getConfig`)(execPath);
  // Check if config is valid
  if (config.err !== undefined) {
    if (config.type === "validation") {
      return err(standardErrorMessage, "(Reason: Invalid Configuration)");
    } else return err(standardErrorMessage, config.obj);
  }

  // Check if Rules folder exists
  logger(
    chalk.blue.bold("Checking ") + `for rules folder: ${config.rules_folder}`
  );
  if (!fs.existsSync(`${execPath}/${config.rules_folder}/`)) {
    return err(
      standardErrorMessage,
      "(Reason: Could not find the rules folder '" +
        config.rules_folder +
        "', the folder needs to be a subfolder of the scripts execution folder.)"
    );
  }

  //Check if rules_version property is correct and its header template exists
  logger(chalk.blue.bold("Checking ") + `Rules Version`);
  if (
    !fs.existsSync(
      `${__dirname}/templates/header-version-${config.rules_version}.rules`
    )
  ) {
    //Should fail before this line but remains as a just in case
    return err(
      standardErrorMessage,
      `(Reason: Make sure you have given the correct version in rules_version property ('1' or '2') in your rulez.config.js. current value is ${config.rules_version})`
    );
  }

  // Read all .rules files in the ./rules directory and subdirectories
  logger(
    chalk.magenta.bold("Adding ") + `rules from folder: ${config.rules_folder}`,
    true
  );
  let filesArray = [];
  try {
    filesArray = glob.sync(`${execPath}/${config.rules_folder}/**/*.rules`);
  } catch (e) {
    err(standardErrorMessage, e);
  }

  // Add Custom Helper Functions to 2nd position of array
  logger(
    chalk.magenta.bold("Adding ") +
      `custom helper functions from folder: ${config.custom_helpers_folder}`
  );
  if (config.custom_helpers_folder) {
    filesArray = glob
      .sync(`${execPath}/${config.custom_helpers_folder}/**/*.rules`)
      .concat(filesArray);
  }

  // Add Helper Functions to 2nd position of array
  logger(chalk.magenta.bold("Adding ") + `helper functions`);
  if (config.helpers.length > 0) {
    config.helpers.forEach((item) => {
      filesArray.unshift(`${__dirname}/helperFunctions/${item}.rules`);
    });
  }

  logger(chalk.blue.bold("Formating ") + `rules`, true);
  // Add Header to 1st postion of array
  filesArray.unshift(
    `${__dirname}/templates/header-version-${config.rules_version}.rules`
  );
  // Add Footer to lastz position of array
  filesArray.push(`${__dirname}/templates/footer.rules`);
  logger(chalk.blue.bold("Saving ") + `rules to: ${config.rules_output}`, true);
  try {
    concat(filesArray, config.rules_output);
  } catch (e) {
    err(standardErrorMessage, e);
  }

  logger(
    chalk.green.bold("SUCCESS ") + `rules created at ${config.rules_output}`,
    true,
    true
  );
};

compileFirestoreRules();
