# Cardinal X Squads Program Upgrade Github Action

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>

<div align="center">
    <img src="./assets/banner.png" />
</div>

Use this github action to automate Solana program deployments straight from Github to a governance proposal to upgrade via Squads multisig.

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: actions/squads-program-upgrade@v0.2.1
with:
  network-url: 'https://api.devnet.solana.com'
  program-multisig: '8QC4Lv3YNAHUmacepqxBKCJY5zx7yrDtQLo9sNFsNnqB'
  program-id: 'prgCo6HJ2bP8xPJ3zwVnfVbqhBbBgY8t7moykr7wzCx'
  program-index: '1'
  buffer: '3eoQzgrBcpVCRUksfTYRh7xJUcq1XwwgycT5AXUQmu1f'
  spill-address: 'depThGTDB9Krh5wd3u23Fbr7gtNVn43X5VLr7c2jbew'
  authority: '7CLWzQ3pGwk9TCBnNFVq2p79NGQ8WyhSrrjfXiPN4L9m'
  name: 'TEST'
  keypair: ${{ env.DEPLOYER_KEYPAIR }}
```

## Development

Install the dependencies

```bash
yarn
```

Build

```bash
yarn build
```

Run the tests :heavy_check_mark:

```bash
$ yar test
 PASS  tests/main.test.ts (7.477 s)
  ✓ wait 500 ms (504 ms)
  ✓ test runs (6433 ms)
...
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml.

Packaging assembles the code into one file in the dist folder that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Run package

```bash
yarn package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

See the [actions tab](https://github.com/actions/squads-program-upgrade/actions) for runs of this action! :rocket:
