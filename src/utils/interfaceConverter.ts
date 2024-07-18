import { inferType } from "./typeInference";

export function convertToInterface(obj: any, name: string): string {
  let interfaceString = `interface ${name} {\n`;
  for (const [key, value] of Object.entries(obj)) {
    const type = inferType(value);
    if (typeof value === "function") {
      const params = value.toString().match(/\(([^)]*)\)/)?.[1] || "";
      interfaceString += `    ${key}(${params}): ${type};\n`;
    } else {
      interfaceString += `    ${key}: ${type};\n`;
    }
  }
  interfaceString += "}\n";
  return interfaceString;
}

export function findAndConvertInterfaces(content: string): string {
  const objectRegex = /const\s+(\w+)\s*=\s*({[^}]+})/g;
  let match;
  let convertedContent = content;

  while ((match = objectRegex.exec(content)) !== null) {
    const [fullMatch, name, objectLiteral] = match;
    try {
      const obj = eval(`(${objectLiteral})`);
      const interfaceString = convertToInterface(obj, `${name}`);
      convertedContent = convertedContent.replace(
        fullMatch,
        interfaceString + fullMatch
      );
    } catch (error) {
      console.error(`Error converting object ${name}: ${error}`);
    }
  }

  return convertedContent;
}
