# Reddit User PDF

## Requirements

- Node 12.13.0 or later
- [GhostScript](https://www.ghostscript.com/)

## Install

`reddit-user-pdf` is a command line tool that should be installed globally

- `npm install --~global reddit-user-pdf` or `yarn global add reddit-user-pdf`

## Usage

Assuming you've installed it for command line run the command,

`reddit-user-pdf REDDIT_USERNAME`

Wait several minutes for it to make the PDF at `REDDIT_USERNAME-MERGED.pdf`. There will also be `urls-REDDIT_USERNAME.json` with some metadata.

## Dev Install

- [Install NVM](https://github.com/nvm-sh/nvm)
- `nvm use`
- `npm install` or `yarn install`
  `node ./cli.js REDDIT_USERNAME`
