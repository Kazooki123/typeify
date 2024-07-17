#!/usr/bin/env node

import { convertFile } from "../converter";
import * as path from "path";

const printHelp = () => {
  console.log(`
Typeify - Convert JavaScript files to TypeScript :D

Usage:
  typeify <file.js>
  typeify <folder>/<file.js>

Options:
  --help    Show this help message

Example:
  typeify yourfile.js
`);
};

const main = () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const filePath = path.resolve(args[0]);
  const fileExtension = path.extname(filePath).toLowerCase();

  if (fileExtension === ".ts") {
    console.log("Oops, that's a TypeScript file. We don't convert those.");
    process.exit(1);
  }

  if (fileExtension !== ".js") {
    console.log("Please provide a JavaScript (.js) file to convert.");
    process.exit(1);
  }

  convertFile(filePath);
};

main();
