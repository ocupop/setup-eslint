#!/usr/bin/env node
const fs = require('fs')
const yargs = require('yargs')
const childProccess = require('child_process')

yargs
  .help('h')
  .alias('h', 'help')
  .option('remove', {
    describe: 'Remove eslint from application',
    type: 'boolean',
    alias: 'rm',
    default: false
  })
  .option('upgrade', {
    describe: 'Upgrade eslint config',
    type: 'boolean',
    alias: 'up',
    default: false
  })

const argv = yargs.argv

// Validate we have a package json to work with. If not we can't do much
if (!fs.existsSync('package.json')) {
  console.error(
    'No package.json found. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.'
  )
  process.exit(1)
}

const lintPackage = '@ocupop/eslint-config'

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
packageJson.scripts = packageJson.scripts || {}

// Write eslint config files
const CONFIG_FILES = {
  '.eslintrc': `\
/**
* @type { import("eslint").Options }
*/
{
  "extends": [
    "${lintPackage}"
  ]
  // Override other rules here...
}
`
}

/**
 * Adds Linter to the project
 */
function addLinter() {
  // Write files
  Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, contents, 'utf8')
    } else {
      console.warn(
        `skipping over writing ${fileName} because it already exists`
      )
    }
  })

  packageJson.scripts.lint = "eslint '**/*.js' --ignore-pattern node_modules/"
  packageJson.scripts.lintFix =
    "eslint --fix '**/*.js' --ignore-pattern node_modules/"

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8')

  // add packages to the project
  childProccess.execSync(
    `npm install --save-dev ${lintPackage}`,
    {
      stdio: 'inherit'
    }
  )
}

/**
 * Updates the linter packages
 */
function upgradeLinter() {
  childProccess.execSync(`npm update ${lintPackage}`, {
    stdio: 'inherit'
  })
}

/**
 * Removes Linter from the project
 */
function removeLinter() {
  // Remove files
  Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
    // validate file exists
    if (fs.existsSync(fileName)) {
      fs.unlink(fileName, (error) => {
        // supress the error
      })
    }
  })

  // clean package.json scripts
  delete packageJson.scripts.lint
  delete packageJson.scripts.lintFix

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8')

  // remove the packages
  childProccess.execSync(`npm uninstall ${lintPackage}`, {
    stdio: 'inherit'
  })
}

/**
 * Main entry point for the application
 */
async function init() {
  // Check against arugments passed in
  if (argv.remove) {
    removeLinter()
  } else if (argv.upgrade) {
    upgradeLinter()
  } else {
    addLinter()
  }
  //   // validate we really want to remove everything
  //   await inquirer
  //     .prompt([
  //       {
  //         type: 'confirm',
  //         name: 'shouldClean',
  //         message: 'This will remove all linter configs, continue?'
  //       }
  //     ])
  //     .then(value => {
  //       if (value.shouldClean) {
  //         removeLinter()
  //       }
  //     })
  // } else if (argv.upgrade) {
  //   upgradeLinter()
  // } else {
  //   addLinter()
  // }
}

init()
