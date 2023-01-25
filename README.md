# Ocupop Linter Config
Sets up [ESLint](https://eslint.org/) config within `npx` across projects

## Setup
Run the following `npx` command to install ESLint

```
npx @ocupop/eslint-config
```

### Options
```
  --version        Show version number                                 [boolean]
  -h, --help       Show help                                           [boolean]
  --remove, --rm   Remove eslint from application   [boolean] [default: false]
  --upgrade, --up  Upgrade eslint config            [boolean] [default: false]
  ```

## Using
### Files
Once installed, the package will add a new file `.eslintrc` where we can add additional [rules](https://eslint.org/docs/rules/), or override [rules](https://eslint.org/docs/rules/) values.

### Scripts
Within `package.json` two new scrips are installed.
```
$ yarn checkLint  # will run eslint and validate files
$ yarn lint       # formats all files (with specified extensions) 
```

### ESLint Extension
By default we do not require that the eslint extension be installed. Simply running `yarn lint` will run eslint within our code base. We can install the [eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) which will help format and point out errors as you develop.

## Publishing
```
$ npm login <login with ocupop creds>
# [ ] Make sure to push changes to git first
# [ ] Make sure to bump the version number
$ npm publish
```