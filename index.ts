// Point d'entrée principal du programme imposr : lecture des paramètres, génération des documents et gestion du workflow.
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
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Settings } from './src/settings';
import { readSourceFile } from './src/file-utils';
import { MarginSettings, PageNumbersSettings, pageType } from './src/page-settings';
import { compose } from './src/compose';
import { buildEpub } from './src/epub';
import { convertToPdf } from './src/pdf';

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('settings', {
            alias: 's',
            type: 'string',
            description: 'Fichier de configuration',
            requiresArg: true,
        })
        .demandOption('settings', 'Le chemin du fichier de configuration est requis.')
        .help()
        .argv;

    if (!fs.existsSync(argv.settings)) {
        console.error(`Le fichier de configuration n'existe pas : ${argv.settings}`);
        process.exit(1);
    }

    const { settings } = await import(argv.settings) as { settings: Settings };

    // Sanity checks
    if (!settings.source || !fs.existsSync(settings.source)) {
        console.error(`Le fichier source n'existe pas : ${settings.source}`);
        process.exit(1);
    }

    if (!settings.output) {
        console.error("Le chemin de sortie n'est pas défini dans les paramètres.");
        process.exit(1);
    }

    if (!settings.authors || settings.authors.length === 0) {
        console.error("La liste des auteurs est vide dans les paramètres.");
        process.exit(1);
    }

    if (!settings.title) {
        console.error("Le titre n'est pas défini dans les paramètres.");
        process.exit(1);
    }

    const sourcefile = await readSourceFile(settings.source);

    // sourcefile ne doit contenir que des tag h1 et p
    const validTags = ['h1', 'p'];
    const filteredSource = sourcefile.filter(el => validTags.includes(el.tag));
    if (filteredSource.length === 0) {
        console.error("Le fichier source ne contient pas de balises valides (h1, p).");
        process.exit(1);
    }

    const isWindows = process.platform === 'win32';

    // Paperback 
    var outputPath = settings.output.replace('.docx', '-paperback.docx')
    await compose(filteredSource, settings, pageType.HALF_LETTER, MarginSettings.OPPOSING_PAGES, PageNumbersSettings.BOTTOM, outputPath);
    isWindows && await convertToPdf(outputPath);

    // Regular half-letter (for PDF export)
    outputPath = settings.output.replace('.docx', '-half-letter.docx');
    await compose(filteredSource, settings, pageType.HALF_LETTER, MarginSettings.NORMAL, PageNumbersSettings.BOTTOM, outputPath);
    isWindows && await convertToPdf(outputPath);

    // Regular A4 (for PDF export)
    outputPath = settings.output.replace('.docx', '-a4.docx');
    const document = await compose(filteredSource, settings, pageType.A4, MarginSettings.NORMAL, PageNumbersSettings.BOTTOM, outputPath);
    isWindows && await convertToPdf(outputPath);

    await buildEpub(filteredSource, settings, pageType.HALF_LETTER, MarginSettings.NORMAL, PageNumbersSettings.NONE, settings.output.replace('.docx', '.epub'));
}

main();

