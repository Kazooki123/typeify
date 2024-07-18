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
const interfaceConverter_1 = require("./utils/interfaceConverter");
const convertFile = (filePath) => {
    try {
        // Read the file
        let content = fs.readFileSync(filePath, "utf8");
        content = (0, interfaceConverter_1.findAndConvertInterfaces)(content);
        content = basicConvert(content);
        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath, ".js");
        const newFilePath = path.join(dirName, `${baseName}.ts`);
        fs.writeFileSync(newFilePath, content);
        console.log(`Converted ${filePath} to ${newFilePath}`);
    }
    catch (error) {
        console.error(`Error converting file: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.convertFile = convertFile;
const basicConvert = (content) => {
    let convertedContent = content;
    convertedContent = convertedContent.replace(/^\s*(var|let)\s*(\w+)?\s*=\s*(".*"|\d+|true|false)/gm, (match, keyword, varName, value) => {
        const type = value.startsWith('"')
            ? "string"
            : /^\d+$/.test(value)
                ? "number"
                : "boolean";
        return `let ${varName || "myVar"}: ${type} = ${value}`;
    });
    convertedContent = convertedContent.replace(/\bvar\b/g, "let");
    convertedContent = convertedContent.replace(/\b(?<!(let|\.))var\b(?!\s*=)/g, "myVar");
    convertedContent = convertedContent.replace(/function\s+(\w+)\s*\((.*?)\)/g, (match, funcName, params) => {
        const typedParams = params
            .split(",")
            .map((param) => `${param.trim()}: any`)
            .join(", ");
        return `function ${funcName}(${typedParams}): any`;
    });
    return convertedContent;
};
