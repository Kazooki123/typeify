"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGenerics = void 0;
const typescript_1 = __importDefault(require("typescript"));
function addGenerics(sourceCode) {
    const sourceFile = typescript_1.default.createSourceFile("temp.ts", sourceCode, typescript_1.default.ScriptTarget.Latest, true);
    function visit(node, context) {
        if (typescript_1.default.isFunctionDeclaration(node) && node.parameters.length > 0) {
            const paramTypes = new Set();
            node.parameters.forEach((param) => {
                if (param.type &&
                    typescript_1.default.isTypeReferenceNode(param.type) &&
                    typescript_1.default.isIdentifier(param.type.typeName)) {
                    paramTypes.add(param.type.typeName.text);
                }
            });
            if (paramTypes.size > 1) {
                const typeParams = Array.from(paramTypes).map((t) => typescript_1.default.factory.createTypeParameterDeclaration(undefined, t, undefined, undefined));
                return typescript_1.default.factory.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, node.name, typeParams, node.parameters, node.type, node.body);
            }
        }
        return typescript_1.default.visitEachChild(node, (child) => visit(child, context), context);
    }
    const result = typescript_1.default.transform(sourceFile, [
        (context) => (rootNode) => visit(rootNode, context),
    ]);
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    return printer.printFile(result.transformed[0]);
}
exports.addGenerics = addGenerics;
