#!/usr/bin/env ts-node
"use strict";
exports.__esModule = true;
var cp = require("child_process");
var chalk_1 = require("chalk");
var path = require("path");
var commander = require("commander");
var _a = process.argv, commandWithArgs = _a[2];
var _b = commandWithArgs.split(' '), command = _b[0], args = _b.slice(1);
commander
    .option('-s, --scope <package>', 'Package to execute command in')
    .option('-p, --prefix <path>', 'Prefix to prepend to package name', 'packages')
    .parse(process.argv);
var scope = commander.scope, prefix = commander.prefix;
var spawnedCommand = cp.spawn(command, args, {
    cwd: path.join(__dirname, prefix, scope)
});
spawnedCommand.stdout.on('data', function (data) { return console.log(chalk_1["default"].italic(data)); });
spawnedCommand.stderr.on('data', function (data) { return console.error(chalk_1["default"].red(data)); });
spawnedCommand.on('close', function () {
    return console.info(chalk_1["default"].green("\u2714 Command: '" + command + "', Args: '" + args + "'"));
});
