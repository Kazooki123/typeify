import * as fs from "fs";
import * as path from "path";
import { findAndConvertInterfaces } from './utils/interfaceConverter';
import { findAndConvertEnums } from './utils/enumsConverter';
import { addAsyncReturnTypes } from './utils/asyncAnnotator';

export const convertFile = (filePath: string): void => {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, "utf8");

    content = findAndConvertInterfaces(content);

    content = findAndConvertEnums(content);

    content = addAsyncReturnTypes(content);

    content = basicConvert(content);

    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath, ".js");
    const newFilePath = path.join(dirName, `${baseName}.ts`);
    fs.writeFileSync(newFilePath, content);

    console.log(`Converted ${filePath} to ${newFilePath}`);
  } catch (error) {
    console.error(`Error converting file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const basicConvert = (content: string): string => {
  let convertedContent = content;

  convertedContent = convertedContent.replace(
    /^\s*(var|let)\s*(\w+)?\s*=\s*(".*"|\d+|true|false)/gm,
    (
      match: string,
      keyword: string,
      varName: string | undefined,
      value: string
    ) => {
      const type = value.startsWith('"')
        ? "string"
        : /^\d+$/.test(value)
        ? "number"
        : "boolean";
      return `let ${varName || "myVar"}: ${type} = ${value}`;
    }
  );

  convertedContent = convertedContent.replace(/\bvar\b/g, "let");

  convertedContent = convertedContent.replace(
    /\b(?<!(let|\.))var\b(?!\s*=)/g,
    "myVar"
  );

  convertedContent = convertedContent.replace(
    /function\s+(\w+)\s*\((.*?)\)/g,
    (match: string, funcName: string, params: string) => {
      const typedParams = params
        .split(",")
        .map((param: string) => `${param.trim()}: any`)
        .join(", ");
      return `function ${funcName}(${typedParams}): any`;
    }
  );

  return convertedContent;
};