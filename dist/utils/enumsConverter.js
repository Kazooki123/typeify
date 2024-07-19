"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndConvertEnums = exports.convertToEnum = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const enumNamesPath = path_1.default.join(__dirname, "enumNames.json");
const enumNamesData = JSON.parse(fs_1.default.readFileSync(enumNamesPath, "utf8"));
const enumNames = enumNamesData.names;
let currentEnumNameIndex = 0;
function getNextEnumName() {
    if (currentEnumNameIndex >= enumNames.length) {
        currentEnumNameIndex = 0;
    }
    return enumNames[currentEnumNameIndex++];
}
function convertToEnum(originalName, objectContent) {
    const newEnumName = getNextEnumName();
    const pairs = objectContent.replace(/[{}]/g, "").split(",");
    let enumString = `enum ${newEnumName} {\n`;
    pairs.forEach((pair) => {
        const [key, value] = pair.split(":").map((item) => item.trim());
        enumString += `    ${key}${value ? ` = ${value}` : ""},\n`;
    });
    enumString += "}\n";
    // Add a comment to show the original name
    enumString = `// Original name: ${originalName}\n${enumString}`;
    return enumString;
}
exports.convertToEnum = convertToEnum;
function findAndConvertEnums(content) {
    const enumRegex = /const\s+(\w+)\s*=\s*({[\s\n]*(?:[\w]+\s*:\s*(?:['"][\w-]+['"]|\d+)\s*,?\s*)+})\s*(as\s+const)?;?/g;
    let match;
    while ((match = enumRegex.exec(content)) !== null) {
        const [fullMatch, enumName, enumContent] = match;
        const enumString = convertToEnum(enumName, enumContent);
        content = content.replace(fullMatch, enumString);
    }
    return content;
}
exports.findAndConvertEnums = findAndConvertEnums;
