const {
    AlignmentType,
    convertMillimetersToTwip,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
    Footer,
    PageNumber,
    SectionType
} = require("docx");

const mammoth = require("mammoth");

const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
const { settings, pageSettings } = require("./settings.js");
const { addFrontMatter } = require("./src/front-matter.js"); 

async function main() {
    const cheminFichier = path.resolve("./source.docx");
    if (!fs.existsSync(cheminFichier)) {
        throw new Error(`Le fichier n'existe pas : ${cheminFichier}`);
    }

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

    addFrontMatter(sections, settings);

    var startNumbering = true;

    elements.forEach((element) => {
        if (element.tag === 'h1') {
            const newSection = {
                properties: {
                    type: SectionType.ODD_PAGE,
                    page: {
                        ...pageSettings, 
                        ...(startNumbering && { pageNumbers: { start: 1, }, })
                    },
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    })
                },
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
                style: "corp",
            }));
        }
    });

    const doc = new Document({
        mirrorMargins: settings.mirrorMargins ?? false,
        styles: {
            default: {
                heading1: {
                    run: {
                        font: "Arial",
                        size: (settings.fontSize * 1.5) * 2, // in half-points
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
                    id: "corp",
                    name: "Corp",
                    basedOn: "Normal",
                    next: "Corp",
                    run: {
                        font: settings.fontName,
                        size: settings.fontSize * 2, // in half-points
                    },
                    paragraph: {
                        spacing: {
                            line: (settings.fontSize + 4) * 20, // in twips (1 twip = 1/20 of a point),
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
    fs.writeFileSync("output.docx", buffer);
}

main();
