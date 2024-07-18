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
exports.writeFile = exports.readFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    }
    catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
};
exports.readFile = readFile;
const writeFile = (filePath, content) => {
    try {
        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath, '.js');
        const newFilePath = path.join(dirName, `${baseName}.ts`);
        fs.writeFileSync(newFilePath, content);
        console.log(`File written successfully: ${newFilePath}`);
    }
    catch (error) {
        throw new Error(`Error writing file: ${error}`);
    }
};
exports.writeFile = writeFile;
