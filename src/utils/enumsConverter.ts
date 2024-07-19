export function convertToEnum(
  objectName: string,
  objectContent: string
): string {
  const pairs = objectContent.replace(/[{}]/g, "").split(",");

  let enumString = `enum ${objectName} {\n`;

  pairs.forEach((pair) => {
    const [key, value] = pair.split(":").map((item) => item.trim());
    // If the value is a number, use it as is. Otherwise, use the key as the value.
    enumString += `    ${key}${
      value && !isNaN(Number(value)) ? ` = ${value}` : ""
    },\n`;
  });

  enumString += "}\n";

  return enumString;
}

export function findAndConvertEnums(content: string): string {
  const enumRegex = /const\s+(\w+)\s*=\s*({[^}]+})\s*as\s+const/g;
  let match;

  while ((match = enumRegex.exec(content)) !== null) {
    const [fullMatch, enumName, enumContent] = match;
    const enumString = convertToEnum(enumName, enumContent);
    content = content.replace(fullMatch, enumString);
  }

  return content;
}
