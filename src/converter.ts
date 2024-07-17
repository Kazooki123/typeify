import * as fs from "fs";
import * as path from "path";

export const convertFile = (filePath: string): void => {
  try {
    // Reads the file
    const content = fs.readFileSync(filePath, "utf8");

    // Performs a basic conversion
    const convertedContent = basicConvert(content);

    // Writes a converted content to a new .ts file
    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath, ".js");
    const newFilePath = path.join(dirName, `${baseName}.ts`);
    fs.writeFileSync(newFilePath, convertedContent);

    console.log(`Converted ${filePath} to ${newFilePath}`);
  } catch (error) {
    console.error(`Error converting file: ${error}`);
  }
};

const basicConvert = (content: string): string => {
    let convertedContent = content;

    // Fix invalid variable declarations and uses
    convertedContent = convertedContent.replace(
        /\b(var|let)\b(?=\s*=|[^a-zA-Z0-9_])/g,
        (match, p1, offset, string) => {
            // Check if it's a declaration
            if (string.slice(0, offset).trim().endsWith('let')) {
                return 'myVar';
            }
            // It's an invalid use or declaration
            return 'let myVar';
        }
    );

    // Add basic type annotations
    convertedContent = convertedContent.replace(
        /let\s+(\w+)(\s*=\s*)(".*"|\d+)/g,
        (match, varName, equals, value) => {
            const type = value.startsWith('"') ? 'string' : 'number';
            return `let ${varName}: ${type}${equals}${value}`;
        }
    );

    return convertedContent;
};