# Run Scoped

## Usage

See how to set up a monorepo using lerna [here](https://github.com/lerna/lerna/)

Imagine the following setup

### package.json

```json
{
  "scripts": {
    "prelog:env": "cross-env FOO=prelog printenv FOO",
    "log:env": "cross-env FOO=log printenv FOO",
    "postlog:env": "cross-env FOO=postlog printenv FOO"
  }
}
```

### packages

```txt
packages
├── common
└── greet

```

```sh
rs log --scope greet
# or run-scoped log --scope greet
```

Outputs

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
