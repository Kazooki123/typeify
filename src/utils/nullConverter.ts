import ts from "typescript";

export function addNullableTypes(sourceCode: string): string {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node, context: ts.TransformationContext): ts.Node {
    if (ts.isVariableDeclaration(node)) {
      if (!node.type && !node.initializer) {
        return ts.factory.updateVariableDeclaration(
          node,
          node.name,
          node.exclamationToken,
          ts.factory.createUnionTypeNode([
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            ts.factory.createLiteralTypeNode(ts.factory.createNull()),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          ]),
          node.initializer
        );
      }
    } else if (ts.isParameter(node)) {
      if (!node.type && !node.initializer) {
        // If the parameter has no type annotation and no default value, it's potentially nullable
        return ts.factory.updateParameterDeclaration(
          node,
          node.decorators,
          ts.getModifiers(node),
          node.dotDotDotToken,
          node.name,
          node.questionToken,
          ts.factory.createUnionTypeNode([
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            ts.factory.createLiteralTypeNode(ts.factory.createNull()),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          ]),
          node.initializer
        );
      }
    }
    return ts.visitEachChild(node, (child) => visit(child, context), context);
  }

  const result = ts.transform(sourceFile, [
    (context: ts.TransformationContext) => (rootNode: ts.Node) =>
      visit(rootNode, context),
  ]);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printFile(result.transformed[0] as ts.SourceFile);
}
