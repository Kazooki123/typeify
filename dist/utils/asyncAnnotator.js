"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAsyncReturnTypes = void 0;
const typescript_1 = __importDefault(require("typescript"));
function addAsyncReturnTypes(sourceCode) {
    const sourceFile = typescript_1.default.createSourceFile('temp.ts', sourceCode, typescript_1.default.ScriptTarget.Latest, true);
    function visit(node, context) {
        var _a;
        if (typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isArrowFunction(node) || typescript_1.default.isMethodDeclaration(node)) {
            if ((_a = node.modifiers) === null || _a === void 0 ? void 0 : _a.some(modifier => modifier.kind === typescript_1.default.SyntaxKind.AsyncKeyword)) {
                const returnType = node.type;
                if (!returnType || !isPromiseType(returnType)) {
                    const newReturnType = typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier('Promise'), returnType ? [returnType] : [typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.AnyKeyword)]);
                    if (typescript_1.default.isFunctionDeclaration(node)) {
                        return typescript_1.default.factory.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, newReturnType, node.body);
                    }
                    else if (typescript_1.default.isArrowFunction(node)) {
                        return typescript_1.default.factory.updateArrowFunction(node, node.modifiers, node.typeParameters, node.parameters, newReturnType, node.equalsGreaterThanToken, node.body);
                    }
                    else if (typescript_1.default.isMethodDeclaration(node)) {
                        return typescript_1.default.factory.updateMethodDeclaration(node, node.decorators, typescript_1.default.getModifiers(node), node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, newReturnType, node.body);
                    }
                }
            }
        }
        return typescript_1.default.visitEachChild(node, child => visit(child, context), context);
    }
    function isPromiseType(typeNode) {
        if (typescript_1.default.isTypeReferenceNode(typeNode)) {
            const typeName = typeNode.typeName;
            return typescript_1.default.isIdentifier(typeName) && typeName.text === 'Promise';
        }
        return false;
    }
    const result = typescript_1.default.transform(sourceFile, [(context) => (rootNode) => visit(rootNode, context)]);
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    return printer.printFile(result.transformed[0]);
}
exports.addAsyncReturnTypes = addAsyncReturnTypes;
