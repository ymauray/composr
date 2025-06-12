// Fonctions utilitaires pour la lecture et la conversion des fichiers source DOCX en éléments imposr.
// Copyright (C) 2025 Yannick Mauray
//
// Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le modifier
// selon les termes de la Licence Publique Générale GNU publiée par la Free Software Foundation,
// soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.
//
// Ce programme est distribué dans l'espoir qu'il sera utile,
// mais SANS AUCUNE GARANTIE : sans même la garantie implicite de
// QUALITÉ MARCHANDE ou D'ADÉQUATION À UN USAGE PARTICULIER. Voir la
// Licence Publique Générale GNU pour plus de détails.
//
// Vous devriez avoir reçu une copie de la Licence Publique Générale GNU
// avec ce programme. Si ce n'est pas le cas, voir <https://www.gnu.org/licenses/>.

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
