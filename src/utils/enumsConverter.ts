import fs from "fs";
import path from "path";

const enumNamesPath = path.join(__dirname, "enumNames.json");
const enumNamesData = JSON.parse(fs.readFileSync(enumNamesPath, "utf8"));
const enumNames = enumNamesData.names;
let currentEnumNameIndex = 0;

function getNextEnumName(): string {
  if (currentEnumNameIndex >= enumNames.length) {
    currentEnumNameIndex = 0;
  }
  return enumNames[currentEnumNameIndex++];
}

export function convertToEnum(
  originalName: string,
  objectContent: string
): string {
  const newEnumName = getNextEnumName();
  const pairs = objectContent.replace(/[{}]/g, "").split(",");

  let enumString = `enum ${newEnumName} {\n`;

  pairs.forEach((pair) => {
    const [key, value] = pair.split(":").map((item) => item.trim());
    enumString += `    ${key}${value ? ` = ${value}` : ""},\n`;
  });

  enumString += "}\n";

  // Add a comment to show the original name
  enumString = `// Original name: ${originalName}\n${enumString}`;

  return enumString;
}

export function findAndConvertEnums(content: string): string {
  const enumRegex =
    /const\s+(\w+)\s*=\s*({[\s\n]*(?:[\w]+\s*:\s*(?:['"][\w-]+['"]|\d+)\s*,?\s*)+})\s*(as\s+const)?;?/g;
  let match;

  while ((match = enumRegex.exec(content)) !== null) {
    const [fullMatch, enumName, enumContent] = match;
    const enumString = convertToEnum(enumName, enumContent);
    content = content.replace(fullMatch, enumString);
  }

  return content;
}
