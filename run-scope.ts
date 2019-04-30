#!/usr/bin/env ts-node

import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import chalk from 'chalk';

// parse args
const {
  argv: {
    scope,
    prefix = 'packages',
    _: [scriptName],
    $0,
    ...argsObject
  },
} = yargs;

// todo make scope a glob pattern
if (!scope) {
  throw new Error('Please provide a scope argument i.e. "--scope <myPackage>"');
}

const packageJSONPath = path.join(__dirname, 'package.json');

const packageJSON = fs.readFileSync(packageJSONPath, {
  encoding: 'UTF-8',
});

// get scripts
const {
  scripts: {
    ['pre'.concat(scriptName)]: prescript,
    [scriptName]: script,
    ['post'.concat(scriptName)]: postscript,
  },
} = JSON.parse(packageJSON);

// throw if no script found
if (!script) {
  throw new Error(`'${scriptName}' not found in ${packageJSONPath}`);
}

const packagePath = path.join(__dirname, prefix as string, scope as string);

const runScriptWithArgs = (args: string) => (scriptToRun: string) => {
  const scriptWithArgs = scriptToRun.concat(args);

  console.log(chalk.blue(`🏁 '${scriptWithArgs}'`));

  cp.execSync(scriptWithArgs, {
    cwd: packagePath,
    stdio: 'inherit',
  });
};

const runScript = runScriptWithArgs('');

if (prescript) {
  runScript(prescript);
}

// format additional arguments
const argsString = (Object.entries(argsObject) as string[][])
  .map(([key, value]) => [
    key.length === 1 ? '-'.concat(key) : '--'.concat(key),
    value,
  ])
  .reduce((args, argEntry) => args.concat(argEntry), [])
  .join(' ');

// script
runScriptWithArgs(argsString)(script);

// postscript
if (postscript) {
  runScript(postscript);
}
