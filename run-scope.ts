#!/usr/bin/env ts-node

import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import chalk from 'chalk';

const {
  argv: {
    scope,
    prefix = 'packages',
    _: [scriptName],
    $0,
    ...additionalArgs
  },
} = yargs;

if (!scope) {
  throw new Error('Please provide a scope argument i.e. --scope myPackage');
}

const packageJSON = fs.readFileSync(path.join(__dirname, 'package.json'), {
  encoding: 'UTF-8',
});

const { scripts } = JSON.parse(packageJSON);

const script = scripts[scriptName];

if (!script) {
  throw new Error(`'${scriptName}' not found in package.json`);
}

const [command, ...args] = script.split(' ');

const spawnedCommand = cp.spawn(
  command,
  args.concat(Object.entries(additionalArgs)),
  {
    cwd: path.join(__dirname, prefix as string, scope as string),
  },
);

spawnedCommand.stdout.on('data', data => console.log(chalk.italic(data)));

spawnedCommand.stderr.on('data', data => console.error(chalk.red(data)));

spawnedCommand.on('close', () =>
  console.info(chalk.green(`✔ Command: '${command}', Args: '${args}'`)),
);
