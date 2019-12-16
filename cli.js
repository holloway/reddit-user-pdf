#!/usr/bin/env node

const { mirror } = require("./index");

const [, , ...args] = process.argv;

if (args.length === 0) {
  console.error("Expected a single argument of their Reddit username");
} else {
  const username = args[0];
  mirror({ username });
}
