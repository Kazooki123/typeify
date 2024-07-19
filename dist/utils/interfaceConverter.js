"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndConvertInterfaces = exports.convertToInterface = void 0;
const typeInference_1 = require("./typeInference");
function convertToInterface(obj, name) {
    var _a;
    let interfaceString = `interface ${name} {\n`;
    for (const [key, value] of Object.entries(obj)) {
        const type = (0, typeInference_1.inferType)(value);
        if (typeof value === "function") {
            const params = ((_a = value.toString().match(/\(([^)]*)\)/)) === null || _a === void 0 ? void 0 : _a[1]) || "";
            interfaceString += `    ${key}(${params}): ${type};\n`;
        }
        else {
            interfaceString += `    ${key}: ${type};\n`;
        }
    }
    interfaceString += "}\n";
    return interfaceString;
}
exports.convertToInterface = convertToInterface;
function findAndConvertInterfaces(content) {
    // Look for objects that are not enum-like
    const objectRegex = /const\s+(\w+)\s*=\s*({[^}]+})/g;
    let match;
    let convertedContent = content;
    while ((match = objectRegex.exec(content)) !== null) {
        const [fullMatch, name, objectLiteral] = match;
        // Check if it's not an enum-like object
        if (!objectLiteral.match(/{\s*(?:[\w]+\s*:\s*(?:['"][\w-]+['"]|\d+)\s*,?\s*)+}/)) {
            try {
                const obj = eval(`(${objectLiteral})`);
                const interfaceString = convertToInterface(obj, `${name}`);
                convertedContent = convertedContent.replace(fullMatch, interfaceString + fullMatch);
            }
            catch (error) {
                console.error(`Error converting object ${name}: ${error}`);
            }
        }
    }
    return convertedContent;
}
exports.findAndConvertInterfaces = findAndConvertInterfaces;
