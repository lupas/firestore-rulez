#!/usr/bin/env node
const concat = require('concat')
const fs = require('fs')

const standardErrorMessage = '❌ Creating firestore.rules failed.'

const compileFirestoreRules = () => {
  // Get Config
  let helpersEnabled = false
  try {
    const config = require('./rules/rulez.config.js')
    helpersEnabled = config.helpers
  } catch {
    // no config available
  }

  // Read all files in current directory
  const rulesSrc = './rules'
  const filesArray = []
  try {
    fs.readdirSync(rulesSrc).forEach(file => {
      if (file.includes('.rules')) {
        filesArray.push(`${rulesSrc}/${file}`)
      }
    })
  } catch (e) {
    if (e.message.includes('./rules')) {
      console.error(
        standardErrorMessage,
        '(Error: Could not find folder ./rules, did you create it in the right place?)'
      )
      return
    }
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
  console.info(`✅ firestore.rules created successfully.`)
}

compileFirestoreRules()
