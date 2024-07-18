import * as fs from 'fs';
import * as path from 'path';

export const readFile = (filePath: string): string => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
};

export const writeFile = (filePath: string, content: string): void => {
    try {
        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath, '.js');
        const newFilePath = path.join(dirName, `${baseName}.ts`);
        fs.writeFileSync(newFilePath, content);
        console.log(`File written successfully: ${newFilePath}`);
    } catch (error) {
        throw new Error(`Error writing file: ${error}`);
    }
};