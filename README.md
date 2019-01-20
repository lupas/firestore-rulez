# 🔥 Firestore Rulez 🔥

<p align="center">
  <a href="https://www.npmjs.com/package/firestore-rulez"><img src="https://badgen.net/npm/dm/firestore-rulez" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/firestore-rulez"><img src="https://badgen.net/npm/v/firestore-rulez" alt="Version"></a>
  <a href="https://www.npmjs.com/package/firestore-rulez"><img src="https://badgen.net/npm/license/firestore-rulez" alt="License"></a>
 </p>
</p>

> Takes working with Firestore Security Rules to the next level.

This Node.js modules let's you split up your Firestore Security Rules firestore.rules file into **multiple files**. The module will combine the files, and if you wish, even add useful **helpers functions** to the mix so you don't have to define them yourself.

Give it a go and feel free to add additional helper functions to the repository!

## Requirements

Make sure you have Node.js installed on your system (the newer, the better).

## Setup

1. Install firestore-rulez in the folder where your firestore.rules file needs to be generated:

```bash
npm i firestore-rulez
```

2. Create a subfolder called `/rules`.

3. Add as many .rules files to the folder as you like.

## Run

## Generate firestore.rules file

You can run Firestore-Rulez by hitting `firestore-rulez` in your CLI.

```bash
firestore-rulez
```

This will create the firestore.rules file combining your files in the following way:

```js
service cloud.firestore {
	match /databases/{database}/documents {

    // -> HELPER FUNCTIONS, if enabled

    // -> YOUR FILES

  }
}
```

## Config

Firestore-Rulez can be configured by adding a rulez.config.js file to the `./rules` folder. At this point, the file can contain following settings:

```js
module.exports = {
  // Enables helper functions as specified below
  helpers: false
}
```

# Helper Functions

The following helper functions are present, if the helpers option is enabled:

```js
// Checks if user is authenticated
function isAuthenticated() {
  return request.auth != null
}

// Returns Current Auth User's Uid
function currentUserUid() {
  return request.auth.uid
}

// Returns Current Auth User's Email
function currentUserEmail() {
  return request.auth.token.email
}

// Returns wether Current Auth User's Email is verified
function emailVerified() {
  return request.auth.token.email_verified
}

// Returns the existing data
function existingData() {
  return resource.data
}

// Returns the incoming data
function incomingData() {
  return request.resource.data
}

// Returns the amount of write fields of a request
function hasAmtOfWriteFields(size) {
  return request.writeFields.size() == size
}
```

### Credits

Thanks to [OneLunch Man](https://stackoverflow.com/users/10747134/onelunch-man) for inspiring me to build this module on Stack Overflow.
