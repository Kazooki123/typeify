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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var convertFile = function (filePath) {
    try {
        // Reads the file
        var content = fs.readFileSync(filePath, "utf8");
        // Performs a basic conversion
        var convertedContent = basicConvert(content);
        // Writes a converted content to a new .ts file
        var dirName = path.dirname(filePath);
        var baseName = path.basename(filePath, ".js");
        var newFilePath = path.join(dirName, "".concat(baseName, ".ts"));
        fs.writeFileSync(newFilePath, convertedContent);
        console.log("Converted ".concat(filePath, " to ").concat(newFilePath));
    }
    catch (error) {
        console.error("Error converting file: ".concat(error));
    }
};
exports.convertFile = convertFile;
var basicConvert = function (content) {
    var convertedContent = content;
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
