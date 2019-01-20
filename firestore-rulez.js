#!/usr/bin/env node
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const concat = require('concat')
const fs = require('fs')

// Read all files in current directory
const rulesSrc = './rules'
const filesArray = []
fs.readdirSync(rulesSrc).forEach(file => {
  filesArray.push(`${rulesSrc}/${file}`)
})

// Add Header to 2nd position of array
filesArray.unshift(`${__dirname}/helperFunctions/index.rules`)
// Add Header to 1st postion of array
filesArray.unshift(`${__dirname}/templates/header.rules`)
// Add Footer to lastz position of array
filesArray.push(`${__dirname}/templates/footer.rules`)

concat(filesArray, 'firestore.rules')
