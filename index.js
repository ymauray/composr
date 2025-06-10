const fs = require("fs");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { compose } = require("./src/compose.js");
const { MarginSettings, PageNumbersSettings, pageSettings } = require("./src/page-settings.js");
const { Settings } = require("./src/settings.js");

// Entry point

const argv = yargs(hideBin(process.argv))
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

/**
 * @type {Settings} settings
 */

const { settings } = require(argv.settings);

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

main();

async function main() {
    // Paperback 
    await compose(settings, pageSettings.HALF_LETTER, MarginSettings.OPPOSING_PAGES, PageNumbersSettings.BOTTOM, settings.output.replace('.docx', '-paperback.docx'));

    // Regular half-letter (for PDF export)
    await compose(settings, pageSettings.HALF_LETTER, MarginSettings.NORMAL, PageNumbersSettings.BOTTOM, settings.output.replace('.docx', '-half-letter.docx'));

    // Regular A4 (for PDF export)
    await compose(settings, pageSettings.A4, MarginSettings.NORMAL, PageNumbersSettings.BOTTOM, settings.output.replace('.docx', '-a4.docx'));

    // A4 (for epub export)
    await compose(settings, pageSettings.A4, MarginSettings.NORMAL, PageNumbersSettings.NONE, settings.output.replace('.docx', '-epub.docx'));
}
