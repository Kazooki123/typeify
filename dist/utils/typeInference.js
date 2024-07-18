"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferType = void 0;
const inferType = (value) => {
    if (typeof value === "string")
        return "string";
    if (typeof value === "number")
        return "number";
    if (typeof value === "boolean")
        return "boolean";
    if (Array.isArray(value))
        return "any[]";
    if (value === null)
        return "null";
    if (value === undefined)
        return "undefined";
    if (typeof value === "object")
        return "object";
    return "any";
};
exports.inferType = inferType;
