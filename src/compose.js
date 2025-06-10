const {
    AlignmentType,
    Document,
    Footer,
    HeadingLevel,
    Packer,
    PageNumber,
    Paragraph,
    SectionType,
    TextRun,
    convertMillimetersToTwip,
} = require("docx");

const cheerio = require('cheerio');
const fs = require("fs");
const mammoth = require("mammoth");
const path = require("path");

const { addFrontMatter } = require('./front-matter');
const { Settings } = require('./settings');
const { MarginSettings, PageNumbersSettings } = require("./page-settings");

/**
 * @param {Settings} settings
 * @param {PageSetting} pageSettings 
 * @param {number} marginSettings 
 * @param {number} pageNumbersSettings
 * @param {string} outputPath 
 */
async function compose(settings, pageSettings, marginSettings, pageNumbersSettings, outputPath) {
    const cheminFichier = path.resolve(settings.source);

    // Lire le fichier en tant que buffer
    const data = fs.readFileSync(cheminFichier);
    const source = await mammoth.convertToHtml({ buffer: data });

    const $ = cheerio.load(`<div>${source.value}</div>`);
    const elements = [];
    $('div').children().each((index, element) => {
        const $el = $(element);
        elements.push({
            tag: element.tagName.toLowerCase(),
            text: $el.text().trim()
        });
    });

    var section = {};
    var sections = [];

    addFrontMatter(sections, settings, pageSettings, marginSettings);

    // Adding sections. Need rewrite for typescript conversion...

    var startNumbering = true;

    elements.forEach((element) => {
        if (element.tag === 'h1') {
            const newSection = {
                properties: {
                    type: marginSettings == MarginSettings.OPPOSING_PAGES ? SectionType.ODD_PAGE : SectionType.NEXT_PAGE,
                    page: {
                        ...pageSettings, 
                        ...(marginSettings == MarginSettings.NORMAL) && { margin: { ...pageSettings.margin, gutter: 0 }},
                        ...startNumbering && { pageNumbers: { start: 1, }, }
                    },
                },
                ...(pageNumbersSettings == PageNumbersSettings.BOTTOM) && { footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        font: pageSettings.fontName,
                                        size: pageSettings.fontSize * 2, // in half-points
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    })
                }},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(element.text),
                        ],
                        heading: HeadingLevel.HEADING_1,
                    }),
                ]
            };
            const index = sections.push(newSection);
            section = sections[index - 1];
            startNumbering = false; // Disable numbering after the first section
        } else if (element.tag === 'p') {
            section.children.push(new Paragraph({
                children: [
                    new TextRun(element.text),
                ],
            }));
        }
    });

    const doc = new Document({
        mirrorMargins: marginSettings === MarginSettings.OPPOSING_PAGES,
        styles: {
            default: {
                heading1: {
                    run: {
                        font: pageSettings.titleFontName,
                        size: pageSettings.titleFontSize * 2, // in half-points
                        bold: true,
                    },
                    paragraph: {
                        spacing: {
                            after: convertMillimetersToTwip(20),
                        },
                    },
                },
            },
            paragraphStyles: [
                {
                    id: "normal",
                    name: "Normal",
                    next: "Normal",
                    run: {
                        font: pageSettings.fontName,
                        size: pageSettings.fontSize * 2, // in half-points
                    },
                    paragraph: {
                        spacing: {
                            line: (pageSettings.fontSize + 4) * 20, // in twips (1 twip = 1/20 of a point),
                            after: 0, // in twips
                            before: 0, // in twips
                        },
                        indent: {
                            firstLine: convertMillimetersToTwip(10),
                            left: 0,
                            right: 0,
                        },
                        alignment: AlignmentType.JUSTIFIED,
                    },
                },
            ],
        },
        sections: sections
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
}

module.exports = { compose };
