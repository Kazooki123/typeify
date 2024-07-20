"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNullableTypes = void 0;
const typescript_1 = __importDefault(require("typescript"));
function addNullableTypes(sourceCode) {
    const sourceFile = typescript_1.default.createSourceFile("temp.ts", sourceCode, typescript_1.default.ScriptTarget.Latest, true);
    function visit(node, context) {
        if (typescript_1.default.isVariableDeclaration(node)) {
            if (!node.type && !node.initializer) {
                return typescript_1.default.factory.updateVariableDeclaration(node, node.name, node.exclamationToken, typescript_1.default.factory.createUnionTypeNode([
                    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.AnyKeyword),
                    typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createNull()),
                    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.UndefinedKeyword),
                ]), node.initializer);
            }
        }
        else if (typescript_1.default.isParameter(node)) {
            if (!node.type && !node.initializer) {
                // If the parameter has no type annotation and no default value, it's potentially nullable
                return typescript_1.default.factory.updateParameterDeclaration(node, node.decorators, typescript_1.default.getModifiers(node), node.dotDotDotToken, node.name, node.questionToken, typescript_1.default.factory.createUnionTypeNode([
                    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.AnyKeyword),
                    typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createNull()),
                    typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.UndefinedKeyword),
                ]), node.initializer);
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
exports.addNullableTypes = addNullableTypes;
