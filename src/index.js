#!/usr/bin/env node
const concat = require('concat')
const glob = require('glob')
const fs = require('fs')

const standardErrorMessage = '❌ Creating firestore.rules failed.'
const execPath = process.cwd()

const compileFirestoreRules = function() {
  // Check if Rules folder exists
  if (!fs.existsSync(`${execPath}/rules/`)) {
    return console.error(
      standardErrorMessage,
      '(Reason: Could not find folder ./rules, the folder needs to be a subfolder of the scripts execution folder.)'
    )
  }

  // Get Config
  let helpersEnabled = false
  try {
    const config = require(`${execPath}/rules/rulez.config.js`)
    helpersEnabled = config.helpers
  } catch (e) {
    console.info(`ℹ️ No rulez.config.js file found.`)
  }

  // Read all .rules files in the ./rules directory and subdirectories
  let filesArray = []
  try {
    filesArray = glob.sync(`${execPath}/rules/**/*.rules`)
  } catch (e) {
    console.error(standardErrorMessage, e)
  }

  // Add Helper Functions to 2nd position of array
  if (helpersEnabled) {
    filesArray.unshift(`${__dirname}/helperFunctions/index.rules`)
  }

  // Add Header to 1st postion of array
  filesArray.unshift(`${__dirname}/templates/header.rules`)
  // Add Footer to lastz position of array
  filesArray.push(`${__dirname}/templates/footer.rules`)

  try {
    concat(filesArray, 'firestore.rules')
  } catch (e) {
    console.error(standardErrorMessage, e)
  }
  console.info(`✅ firestore.rules file compiled successfully.`)
}

compileFirestoreRules()
