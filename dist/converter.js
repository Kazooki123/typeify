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
exports.convertFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const convertFile = (filePath) => {
    try {
        // Reads the file
        const content = fs.readFileSync(filePath, "utf8");
        // Performs a basic conversion
        const convertedContent = basicConvert(content);
        // Writes a converted content to a new .ts file
        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath, ".js");
        const newFilePath = path.join(dirName, `${baseName}.ts`);
        fs.writeFileSync(newFilePath, convertedContent);
        console.log(`Converted ${filePath} to ${newFilePath}`);
    }
    catch (error) {
        console.error(`Error converting file: ${error}`);
    }
};
exports.convertFile = convertFile;
const basicConvert = (content) => {
    let convertedContent = content;
    // Fix invalid variable declarations
    convertedContent = convertedContent.replace(/^\s*(var)\s*=\s*(".*"|\d+)/gm, "let myVar: any = $2");
    // Convert remaining var to let
    convertedContent = convertedContent.replace(/\bvar\b/g, "let");
    // Replace invalid variable uses, but not 'let' itself
    convertedContent = convertedContent.replace(/\b(?<!(let|\.))var\b(?!\s*=)/g, "myVar");
    // Add basic type annotations to string variables
    convertedContent = convertedContent.replace(/let\s+(\w+)\s*=\s*"([^"]*)"/g, 'let $1: string = "$2"');
    // Add basic type annotations to number variables
    convertedContent = convertedContent.replace(/let\s+(\w+)\s*=\s*(\d+)/g, "let $1: number = $2");
    return convertedContent;
};
