#!/usr/bin/env ts-node

import * as cp from 'child_process';
import chalk from 'chalk';
import * as path from 'path';
import * as commander from 'commander';

const [, , commandWithArgs] = process.argv;

const [command, ...args] = commandWithArgs.split(' ');

commander
  .option('-s, --scope <package>', 'Package to execute command in')
  .option(
    '-p, --prefix <path>',
    'Prefix to prepend to package name',
    'packages',
  )
  .parse(process.argv);

const { scope, prefix } = commander;

const spawnedCommand = cp.spawn(command, args, {
  cwd: path.join(__dirname, prefix, scope),
});

spawnedCommand.stdout.on('data', data => console.log(chalk.italic(data)));

spawnedCommand.stderr.on('data', data => console.error(chalk.red(data)));

spawnedCommand.on('close', () =>
  console.info(chalk.green(`✔ Command: '${command}', Args: '${args}'`)),
);
