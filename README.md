# Reddit User PDF

## Requirements

- Node 12.13.0 or later
- [GhostScript](https://www.ghostscript.com/)

## Install

`reddit-user-pdf` is a command line tool that should be installed globally

- `npm install --global reddit-user-pdf`

or if you prefer Yarn

- `yarn global add reddit-user-pdf`

## Usage

Assuming you've installed it for command line run the command,

`reddit-user-pdf REDDIT_USERNAME`

Where `REDDIT_USERNAME` is the username you want.

Depending on the amount of posts that user has made it can take several minutes (perhaps up to 10 minutes) to make the PDF.

When complete it the PDF will be available at `REDDIT_USERNAME-MERGED.pdf`. There will also be `urls-REDDIT_USERNAME.json` with some metadata. There will also be PDFs for each page that you can delete.

## Dev Install

- [Install NVM](https://github.com/nvm-sh/nvm)
- `nvm use`
- `npm install` or `yarn install`
  `node ./cli.js REDDIT_USERNAME`
