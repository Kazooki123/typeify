#!/usr/bin/env node

import { convertFile } from '../converter';
import * as path from 'path';

const main = () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Please provide a JavaScript file to convert');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    convertFile(filePath);
};

main();