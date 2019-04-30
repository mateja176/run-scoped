#!/usr/bin/env ts-node

import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import chalk from 'chalk';
import * as glob from 'glob';

// parse args
const {
  argv: {
    scope = '*',
    prefix = 'packages',
    _: [scriptName],
    $0,
    ...argsObject
  },
} = yargs;

// read package.json
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

const runScriptWithArgs = (args: string) => (packagePath: string) => (
  scriptToRun: string,
) => {
  const scriptWithArgs = scriptToRun.concat(args);

  console.log(chalk.underline(packagePath));
  console.log(chalk.italic(scriptWithArgs));

  cp.execSync(scriptWithArgs, {
    cwd: packagePath,
    stdio: 'inherit',
  });
};

const runScript = runScriptWithArgs('');

type Args = { [key: string]: string };

const formatArgs = (args: Args) =>
  (Object.entries(args) as string[][])
    .map(([key, value]) => [
      key.length === 1 ? '-'.concat(key) : '--'.concat(key),
      value,
    ])
    .reduce((argsArray, argEntry) => argsArray.concat(argEntry), [])
    .join(' ');

const runScriptTrio = (args: string) => (packagePath: string) => {
  if (prescript) {
    runScript(packagePath)(prescript);
  }

  runScriptWithArgs(args)(packagePath)(script);

  if (postscript) {
    runScript(packagePath)(postscript);
  }
};

const formattedArgs = formatArgs(argsObject as Args);

glob(
  path.join(prefix as string, scope as string),
  { absolute: true },
  (err, paths) => {
    if (err) {
      throw new Error(
        `Error while searching for packages with scope '${scope}'`,
      );
    }

    paths.forEach(runScriptTrio(formattedArgs));
  },
);
