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

## Installation

NPM:

```bash
npm i firestore-rulez --save-dev
```

yarn:

```bash
yarn add firestore-rulez --dev
```

# Basic Usage

1. Create a subfolder called `/rules`.

2. Add as many .rules files to the folder as you like.

3. Generate firestore.rules via the following command in your console:

```bash
firestore-rulez
```

# Advanced Usage

1. Create [config file](#configuration-file-syntax) at project root

2. Generate .rules files and helper functions inline with config file

3. Generate firestore.rules via the following command in your console:

```bash
firestore-rulez
```

## Generate rules file

You can run Firestore-Rulez by hitting `firestore-rulez` in your CLI.

```bash
firestore-rulez
```

This will create the firestore.rules file combining your files in the following way:

```js
service cloud.firestore {
	match /databases/{database}/documents {

    // -> LIBRARY HELPER FUNCTIONS, if enabled

    // -> YOUR HELPER FUNCTIONS, if enabled

    // -> YOUR RULES FILES

  }
}
```

# Configuration File Syntax

Firestore-Rulez can be configured by adding a rulez.config.js file to the `project root` or `./rules` folders.

The file is to export a object with the following syntax:

| Field | Default Value | Type | Description |
| ----- | --------------- | ----- | ------------- |
| helpers | `["authUserEmail", "authUserEmailIsVerified", "authUserUid", "existingData", "hasAmtOfWriteFields", "incomingData", "isAuthenticated"]` | array(strings) \| boolean | used to add helper functions to the output, this can be `true` to include all helper functions or `false` to include non of the helper functions or an array of the [function names](#helper-functions) |
| custom_helpers_folder | `null` | `null` \| string | path to user defined helper functions |
| rules_version | `"1"` | `"1"` \| `"2"` \| `1` \| `2` | which version is the rules written in |
| rules_folder | `"rules"` | string | folder where the rule fragments can be found |
| rules_output | `"firestore.rules"` | string  | name of the file to output to |
| use_firebase_config | `false` | boolean | use the firebase config file `firebase.json` to get the rules output file name and location |

## Default Configuration File

```js
module.exports = {
  helpers: [
    "authUserEmail",
    "authUserEmailIsVerified",
    "authUserUid",
    "existingData",
    "hasAmtOfWriteFields",
    "incomingData",
    "isAuthenticated",
  ],
  custom_helpers_folder: null,
  rules_version: 1,
  rules_folder: "rules",
  rules_output: "firestore.rules",
  use_firebase_config: false,
};
```

# Helper Functions

The following helper functions are present, if the helpers option is enabled or the function is included:
| name | description |
| --- | ---|
| isAuthenticated | Checks if user is authenticated |
| authUserUid | Returns Current Auth User's Uid |
| authUserEmail | Returns Current Auth User's Email |
| authUserEmailIsVerified | Returns wether Current Auth User's Email is verified |
| existingData | Returns the existing data |
| incomingData | Returns the incoming data |
| hasAmtOfWriteFields | Checks if the request has X write fields |

Use the name of the functionin the rules files and in the configuration file to enable them in the configuration or set the helpers function to true to include them all.

## isAuthenticated

```js
// Checks if user is authenticated
function isAuthenticated() {
  return request.auth != null;
}
```

## authUserUid

```js
// Returns Current Auth User's Uid
function authUserUid() {
  return request.auth.uid;
}
```

## authUserEmail

```js
// Returns Current Auth User's Email
function authUserEmail() {
  return request.auth.token.email;
}
```

## authUserEmailIsVerified

```js
// Returns wether Current Auth User's Email is verified
function authUserEmailIsVerified() {
  return request.auth.token.email_verified;
}
```

## existingData

```js
// Returns the existing data
function existingData() {
  return resource.data;
}
```

## incomingData

```js
// Returns the incoming data
function incomingData() {
  return request.resource.data;
}
```

## hasAmtOfWriteFields

```js
// Checks if the request has X write fields
function hasAmtOfWriteFields(size) {
  return request.writeFields.size() == size;
}
```

# Credits

Thanks to [OneLunch Man](https://stackoverflow.com/users/10747134/onelunch-man) for inspiring me to build this module on Stack Overflow and to [Bullfrog1234](https://github.com/Bullfrog1234) for the amazing pull-request [#5](https://github.com/lupas/firestore-rulez/pull/5) making this module rule(z) even more!
