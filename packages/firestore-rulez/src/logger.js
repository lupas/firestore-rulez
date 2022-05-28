const log = console.log;
const blankLine = log;
const error = console.error;
const warn = console.warn;
const info = console.info;

module.exports = function (
  text,
  blankBefore = false,
  blankAfter = false,
  type
) {
  if (blankBefore) blankLine();
  switch (type) {
    case "error":
      error(text);
    case "warn":
      warn(text);
    case "info":
      info(text);
    case "log":
    default:
      log(text);
  }
  if (blankAfter) blankLine();
};
