import * as fs from "fs";
import * as path from "path";
import { findAndConvertInterfaces } from './utils/interfaceConverter';

export const convertFile = (filePath: string): void => {
  try {
    // Reads the file
    let content = fs.readFileSync(filePath, "utf8");

    content = findAndConvertInterfaces(content);

    content = basicConvert(content);

    // Writes a converted content to a new .ts file
    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath, ".js");
    const newFilePath = path.join(dirName, `${baseName}.ts`);
    fs.writeFileSync(newFilePath, content);

    console.log(`Converted ${filePath} to ${newFilePath}`);
  } catch (error) {
    console.error(`Error converting file: ${error}`);
  }
};

const basicConvert = (content: string): string => {
  let convertedContent = content;

  // Fix invalid variable declarations
  convertedContent = convertedContent.replace(
    /^\s*(var)\s*=\s*(".*"|\d+)/gm,
    "let myVar: any = $2"
  );

  // Convert remaining var to let
  convertedContent = convertedContent.replace(/\bvar\b/g, "let");

  // Replace invalid variable uses, but not 'let' itself
  convertedContent = convertedContent.replace(
    /\b(?<!(let|\.))var\b(?!\s*=)/g,
    "myVar"
  );

  // Add basic type annotations to string variables
  convertedContent = convertedContent.replace(
    /let\s+(\w+)\s*=\s*"([^"]*)"/g,
    'let $1: string = "$2"'
  );

  // Add basic type annotations to number variables
  convertedContent = convertedContent.replace(
    /let\s+(\w+)\s*=\s*(\d+)/g,
    "let $1: number = $2"
  );

  return convertedContent;
};