import ts from "typescript";

export function addGenerics(sourceCode: string): string {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node, context: ts.TransformationContext): ts.Node {
    if (ts.isFunctionDeclaration(node) && node.parameters.length > 0) {
      const paramTypes = new Set<string>();
      node.parameters.forEach((param) => {
        if (
          param.type &&
          ts.isTypeReferenceNode(param.type) &&
          ts.isIdentifier(param.type.typeName)
        ) {
          paramTypes.add(param.type.typeName.text);
        }
      });

      if (paramTypes.size > 1) {
        const typeParams = Array.from(paramTypes).map((t) =>
          ts.factory.createTypeParameterDeclaration(
            undefined,
            t,
            undefined,
            undefined
          )
        );

        return ts.factory.updateFunctionDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.asteriskToken,
          node.name,
          typeParams,
          node.parameters,
          node.type,
          node.body
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
