# Run Scoped

## Motivation

Avoid duplicating scripts in a monorepo

Manage your scripts in a centralized way using `run-scoped`

## Description

Run arbitrary script from `package.json` in any sub-directory or package

\* See how to set up a monorepo using lerna [here](https://github.com/lerna/lerna/)

## Options

```sh
rs [--scope packageNameGlob="*"] [--prefix pathToPackages="packages"]

```

## Usage

### Example Setup

#### package.json

```json
{
  "scripts": {
    "prelog:env": "cross-env FOO=prelog printenv FOO",
    "log:env": "cross-env FOO=log printenv FOO",
    "postlog:env": "cross-env FOO=postlog printenv FOO"
  }
}
```

#### packages

```txt
packages
├── common
└── greet

```

### Using run-scoped

```sh
rs log --scope greet
```

#### Outputs

<u>path-your-project/packages/greet</u>

_cross-env FOO=prelog printenv FOO_

prelog

---

<u>path-your-project/packages/greet</u>

_cross-env FOO=log printenv FOO_

log

---

<u>path-your-project/packages/greet</u>

_cross-env FOO=postlog printenv FOO_

postlog

---
