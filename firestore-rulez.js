#!/usr/bin/env node
const concat = require('concat')
const fs = require('fs')

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
fs.readdirSync(rulesSrc).forEach(file => {
  if (file.includes('.rules')) {
    filesArray.push(`${rulesSrc}/${file}`)
  }
})

// Add Helper Functions to 2nd position of array
if (helpersEnabled) {
  filesArray.unshift(`${__dirname}/helperFunctions/index.rules`)
}

// Add Header to 1st postion of array
filesArray.unshift(`${__dirname}/templates/header.rules`)
// Add Footer to lastz position of array
filesArray.push(`${__dirname}/templates/footer.rules`)

concat(filesArray, 'firestore.rules')
