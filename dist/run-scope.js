#!/usr/bin/env ts-node
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var yargs = require("yargs");
var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var chalk_1 = require("chalk");
var glob = require("glob");
// parse args
var _a = yargs.argv, _b = _a.scope, scope = _b === void 0 ? '*' : _b, _c = _a.prefix, prefix = _c === void 0 ? 'packages' : _c, scriptName = _a._[0], $0 = _a.$0, argsObject = __rest(_a, ["scope", "prefix", "_", "$0"]);
// read package.json
var packageJSONPath = path.join(__dirname, 'package.json');
var packageJSON = fs.readFileSync(packageJSONPath, {
    encoding: 'UTF-8'
});
// get scripts
var _d = JSON.parse(packageJSON).scripts, _e = 'pre'.concat(scriptName), prescript = _d[_e], _f = scriptName, script = _d[_f], _g = 'post'.concat(scriptName), postscript = _d[_g];
// throw if no script found
if (!script) {
    throw new Error("'" + scriptName + "' not found in " + packageJSONPath);
}
var runScriptWithArgs = function (args) { return function (packagePath) { return function (scriptToRun) {
    var scriptWithArgs = scriptToRun.concat(args);
    console.log(chalk_1["default"].underline(packagePath));
    console.log(chalk_1["default"].italic(scriptWithArgs));
    cp.execSync(scriptWithArgs, {
        cwd: packagePath,
        stdio: 'inherit'
    });
}; }; };
var runScript = runScriptWithArgs('');
var formatArgs = function (args) {
    return Object.entries(args)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return [
            key.length === 1 ? '-'.concat(key) : '--'.concat(key),
            value,
        ];
    })
        .reduce(function (argsArray, argEntry) { return argsArray.concat(argEntry); }, [])
        .join(' ');
};
var runScriptTrio = function (args) { return function (packagePath) {
    if (prescript) {
        runScript(packagePath)(prescript);
    }
    runScriptWithArgs(args)(packagePath)(script);
    if (postscript) {
        runScript(packagePath)(postscript);
    }
}; };
var formattedArgs = formatArgs(argsObject);
glob(path.join(prefix, scope), { absolute: true }, function (err, paths) {
    if (err) {
        throw new Error("Error while searching for packages with scope '" + scope + "'");
    }
    paths.forEach(runScriptTrio(formattedArgs));
});
