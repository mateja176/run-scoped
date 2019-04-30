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

const allArgs = args.concat(Object.entries(additionalArgs));

const packagePath = path.join(__dirname, prefix as string, scope as string);

const envKeys = Object.keys(process.env);

const env = Object.entries(process.env)
  .map(([key, value]) => [
    key,
    value.includes(__dirname) ? value.replace(__dirname, packagePath) : value,
  ])
  .reduce<NodeJS.ProcessEnv>(
    (tempEnv, [key, value]) => ({ ...tempEnv, [key]: value }),
    {},
  );

const argsWithEnv = allArgs.map((arg: string) => {
  const argWithout$ = arg.slice(1);

  return envKeys.includes(argWithout$) ? env[argWithout$] : arg;
});

const spawnedCommand = cp.spawn(command, argsWithEnv, {
  cwd: path.join(packagePath),
});

spawnedCommand.stdout.on('data', data => console.log(chalk.italic(data)));

spawnedCommand.stderr.on('data', data => console.error(chalk.red(data)));

spawnedCommand.on('close', () =>
  console.info(chalk.green(`✔ Command: '${command}', Args: '${args}'`)),
);
