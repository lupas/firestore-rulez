#!/usr/bin/env node
var concat = require('concat')
const fs = require('fs')

// Read all files in current directory
const rulesSrc = './test'
const filesArray = []
fs.readdirSync(rulesSrc).forEach(file => {
  filesArray.push(`${rulesSrc}/${file}`)
})

// Add Header to 2nd position of array
filesArray.unshift('helperFunctions/index.rules')
// Add Header to 1st postion of array
filesArray.unshift('templates/header.rules')
// Add Footer to lastz position of array
filesArray.push('templates/footer.rules')

concat(filesArray, 'firestore.rules')
