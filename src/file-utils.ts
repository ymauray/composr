import fs from 'fs';
import mammoth from "mammoth";
import path from "path";
import { load as cheerioLoad } from 'cheerio';
import { TagElement } from "./types";

const readSourceFile = async (filePath: string) => {
    const cheminFichier = path.resolve(filePath);

    // Lire le fichier en tant que buffer
    const data = fs.readFileSync(cheminFichier);
    const source = await mammoth.convertToHtml({ buffer: data });
    
    const $ = cheerioLoad(`<div>${source.value}</div>`);
    const elements: TagElement[] = [];
    $('div').children().each((index, element) => {
        const $el = $(element);
        elements.push({
            tag: element.tagName.toLowerCase(),
            text: $el.text().trim()
        });
    });

    return elements;
}

export { readSourceFile };
