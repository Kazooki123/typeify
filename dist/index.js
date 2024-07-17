#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
const path = __importStar(require("path"));
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
    if (args.length === 0 || args.includes('--help')) {
        printHelp();
        process.exit(0);
    }
    const filePath = path.resolve(args[0]);
    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension === '.ts') {
        console.log("Oops, that's a TypeScript file. We don't convert those.");
        process.exit(1);
    }
    if (fileExtension !== '.js') {
        console.log("Please provide a JavaScript (.js) file to convert.");
        process.exit(1);
    }
    (0, converter_1.convertFile)(filePath);
};
main();
