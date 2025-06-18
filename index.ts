// Point d'entrée principal du programme composr : lecture des paramètres, génération des documents et gestion du workflow.
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
import { CoverSettings, PdfSettings } from './src/types';

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('settings', {
            type: 'string',
            description: 'Fichier de configuration',
            requiresArg: true,
        })
        .option('source', {
            type: 'string',
            description: 'Source à utiliser pour la génération, le fichier de configuration sera ./sources/<source>/settings.ts',
            requiresArg: true,
        })
        .option('with-pdf', {
            type: 'boolean',
            description: 'Générer également un PDF à partir du document DOCX',
            default: false,
        })
        .help()
        .argv;

    if (!argv.settings && !argv.source) {
        console.error("Veuillez spécifier un fichier de configuration avec --settings ou une source avec --source.");
        process.exit(1);
    }

    if (argv.source) {
        // Si une source est spécifiée, on construit le chemin du fichier de configuration
        argv.settings = `./sources/${argv.source}/settings.ts`;
    }

    if (!fs.existsSync(argv.settings!)) {
        console.error(`Le fichier de configuration n'existe pas : ${argv.settings}`);
        process.exit(1);
    }

    const { settings } = await import(argv.settings!) as { settings: Settings };

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

    for (let outputFormat of settings.outputFormats) {
        let outputPath = settings.output.replace('.docx', `-${outputFormat.pageSettings.name.toLowerCase().replace('_', '-')}.docx`);
        await compose(filteredSource, settings, outputFormat.pageSettings, outputFormat.marginSettings, PageNumbersSettings.BOTTOM, outputFormat.coverSettings, outputPath);
        if (outputFormat.pdfSetting == PdfSettings.WITH_PDF)
            await convertToPdf(outputPath);
    }

    // Epub
    await buildEpub(filteredSource, settings, settings.output.replace('.docx', '.epub'));
}

main();
