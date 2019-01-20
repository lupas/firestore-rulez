#!/usr/bin/env node
var concat = require('concat')
const fs = require('fs')

// Read all files in current directory
const rulesSrc = './rules'
const filesArray = []
fs.readdirSync(rulesSrc).forEach(file => {
  filesArray.push(`${rulesSrc}/${file}`)
})

// Add Header to start of array
filesArray.unshift('templates/header.rules')
// Add Footer to end of array
filesArray.push('templates/footer.rules')

concat(filesArray, 'firestore.rules')
