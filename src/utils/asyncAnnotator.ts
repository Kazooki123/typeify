import ts from 'typescript';

export function addAsyncReturnTypes(sourceCode: string): string {
  const sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);

  function visit(node: ts.Node, context: ts.TransformationContext): ts.Node {
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node)) {
      if (node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword)) {
        const returnType = node.type;
        if (!returnType || !isPromiseType(returnType)) {
          const newReturnType = ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier('Promise'),
            returnType ? [returnType] : [ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)]
          );

          if (ts.isFunctionDeclaration(node)) {
            return ts.factory.updateFunctionDeclaration(
              node,
              node.decorators,
              node.modifiers,
              node.asteriskToken,
              node.name,
              node.typeParameters,
              node.parameters,
              newReturnType,
              node.body
            );
          } else if (ts.isArrowFunction(node)) {
            return ts.factory.updateArrowFunction(
              node,
              node.modifiers,
              node.typeParameters,
              node.parameters,
              newReturnType,
              node.equalsGreaterThanToken,
              node.body
            );
          } else if (ts.isMethodDeclaration(node)) {
            return ts.factory.updateMethodDeclaration(
              node,
              node.decorators,
              ts.getModifiers(node),
              node.asteriskToken,
              node.name,
              node.questionToken,
              node.typeParameters,
              node.parameters,
              newReturnType,
              node.body
            );
          }
        }
      }
    }
    return ts.visitEachChild(node, child => visit(child, context), context);
  }

  function isPromiseType(typeNode: ts.TypeNode): boolean {
    if (ts.isTypeReferenceNode(typeNode)) {
      const typeName = typeNode.typeName;
      return ts.isIdentifier(typeName) && typeName.text === 'Promise';
    }
    return false;
  }

  const result = ts.transform(sourceFile, [(context: ts.TransformationContext) => (rootNode: ts.Node) => visit(rootNode, context)]);
  
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printFile(result.transformed[0] as ts.SourceFile);
}