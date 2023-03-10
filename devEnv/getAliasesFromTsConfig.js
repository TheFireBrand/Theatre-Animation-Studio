const path = require('path')

const monorepoRoot = path.resolve(__dirname, '../')

function getAliasesFromTsConfigForESLint() {
  const tsConfigPaths = require('../tsconfig.base.json').compilerOptions.paths

  const aliases = []

  for (const [key, value] of Object.entries(tsConfigPaths)) {
    aliases.push({
      name: key.replace(/\/\*$/, ''),
      path: value[0].replace(/\/\*$/, ''),
    })
  }

  return aliases
}

module.exports.getAliasesFromTsConfigForESLint = getAliasesFromTsConfigForESLint

function getAliasesFromTsConfigForJest() {
  const tsConfigPaths = require('../tsconfig.base.json').compilerOptions.paths

  const aliases = {}

  for (let [key, value] of Object.entries(tsConfigPaths)) {
    if (key.match(/\/\*$/)) {
      key = key.replace(/\/\*$/, '/(.*)')
    } else {
      key = key + '$'
    }
    aliases[key] = path.join('<rootDir>', value[0].replace(/\/\*$/, '/$1'))
  }

  return aliases
}

module.exports.getAliasesFromTsConfigForJest = getAliasesFromTsConfigForJest

function getAliasesFromTsConfigForRollup() {
  const tsConfigPaths = require('../tsconfig.base.json').compilerOptions.paths

  const aliases = []

  for (let [key, value] of Object.entries(tsConfigPaths)) {
    // like '@theatre/core/*'
    if (key.match(/\/\*$/)) {
      key = key.replace(/\/\*$/, '/(.*)')
    } else {
      // like '@theatre/core'
      key = key + '$'
    }
    aliases.push({
      find: new RegExp(key),
      replacement: path.join(monorepoRoot, value[0].replace(/\/\*$/, '/$1')),
    })
  }

  return aliases
}

module.exports.getAliasesFromTsConfigForRollup = getAliasesFromTsConfigForRollup
