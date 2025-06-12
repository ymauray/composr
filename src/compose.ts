// Génération des documents DOCX à partir de la structure imposr et des paramètres utilisateur.
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

import { AlignmentType, convertInchesToTwip, convertMillimetersToTwip, Document, Footer, HeadingLevel, ImageRun, ISectionOptions, Packer, PageNumber, Paragraph, ParagraphChild, SectionType, TextRun } from "docx";
import { Settings } from "./settings";
import { PageSettings, TagElement } from "./types";
import { MarginSettings, PageNumbersSettings } from "./page-settings";
import fs from "fs";

const legalNotice = [
    "Ce texte est une fiction. Les noms et les événements qui y sont décrits sont issus de l’imagination de l’auteur, et toute ressemblance avec des personnages, des personnes, ou des situations existantes ou ayant existé ne pourrait être que pure coïncidence.",
    "Les erreurs qui peuvent subsister sont le fait de l’auteur.",
    "Le piratage prive l’auteur ainsi que les personnes ayant travaillé sur ce livre de leurs droits.",
];

async function titlePage(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<ISectionOptions> {

    const authors: ParagraphChild[] = [];

    // Add authors
    settings.authors.forEach((author, index) => {
        // Add "et" before the last author, if there is more than one author
        if (index > 0 && index == settings.authors.length - 1) {
            authors.push(new TextRun({
                text: "et",
                break: 1
            }));
        }

        // Add the author's name
        // Add a line break before if it's not the first author
        authors.push(new TextRun({
            text: author,
            break: index > 0 ? 1 : 0,
            size: (pageSettings.fontSize * 1.4) * 2, // Author names are 1.4 times larger
        }));

        // Add a comma after the author if there are 3 or more, and it's not the last one
        if (index < settings.authors.length - 2) {
            authors.push(new TextRun({
                text: ",",
            }));
        }
    });

    return {
        properties: {
            type: SectionType.ODD_PAGE,
            page: {
                ...pageSettings,
                ...((marginSettings == MarginSettings.NORMAL) && { margin: { ...pageSettings.margin, gutter: 0 } }),
            },
        },
        children: [
            new Paragraph({
                children: authors,
                alignment: AlignmentType.CENTER,
                indent: {
                    firstLine: 0,
                },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: settings.title,
                        bold: true,
                        size: (pageSettings.fontSize * 2) * 2, // Title is 2 times larger
                    }),
                ],
                alignment: AlignmentType.CENTER,
                indent: {
                    firstLine: 0,
                },
                spacing: {
                    before: pageSettings.size.height / 3 - pageSettings.margin.top, // 1/4 of the page height
                },
            }),
        ]
    };
}

async function copyrightPage(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<ISectionOptions> {
    const newSection: ISectionOptions = {
        properties: {
            type: SectionType.NEXT_PAGE,
            page: {
                ...pageSettings,
                ...((marginSettings == MarginSettings.NORMAL) && { margin: { ...pageSettings.margin, gutter: 0 } }),
            },
        },
        children: legalNotice.map((line) =>
            new Paragraph({
                children: [
                    new TextRun({
                        text: line,
                    }),
                ],
                spacing: {
                    after: pageSettings.fontSize * 20, // in twips
                }
            }))
    };

    return newSection;
}

async function addFrontMatter(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<ISectionOptions[]> {
    const frontMatter: ISectionOptions[] = [
        await titlePage(settings, pageSettings, marginSettings),
        await copyrightPage(settings, pageSettings, marginSettings),
    ];

    return frontMatter;
}

export async function compose(source: TagElement[], settings: Settings, pageSettings: PageSettings, marginSettings: number, pageNumbersSettings: number, outputPath: string): Promise<ISectionOptions[]> {

    const internalSections = [] as { title: TagElement; children: TagElement[] }[];
    for (const el of source) {
        if (el.tag === 'h1') {
            internalSections.push({
                title: el,
                children: [],
            });
        } else {
            internalSections[internalSections.length - 1].children.push(el);
        }
    }

    const sections: ISectionOptions[] = [{
        properties: {
            page: {
                ...pageSettings,
                ...{ margin: { ...pageSettings.margin, gutter: 0 } }
            },
        },
        children: [
            new Paragraph({
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(settings.cover),
                        transformation: {
                            width: (pageSettings.size.width / convertInchesToTwip(100) * 100) * 96,
                            height: (pageSettings.size.height / convertInchesToTwip(100) * 100) * 96,
                        },
                        floating: {
                            horizontalPosition: {
                                align: "center",
                            },
                            verticalPosition: {
                                align: "top",
                            },
                        },
                    })
                ],
                alignment: AlignmentType.CENTER,
            }),
        ]
    }];

    sections.push(...await addFrontMatter(settings, pageSettings, marginSettings));

    var startNumbering = true;

    sections.push(...internalSections.map((internalSection): ISectionOptions => {
        const section = {
            properties: {
                type: marginSettings == MarginSettings.OPPOSING_PAGES ? SectionType.ODD_PAGE : SectionType.NEXT_PAGE,
                page: {
                    ...pageSettings,
                    ...(marginSettings == MarginSettings.NORMAL) && { margin: { ...pageSettings.margin, gutter: 0 } },
                    ...startNumbering && { pageNumbers: { start: 1, }, }
                },
            },
            ...(pageNumbersSettings == PageNumbersSettings.BOTTOM) && {
                footers: {
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
                                indent: {
                                    firstLine: 0,
                                }
                            }),
                        ],
                    })
                }
            },
            children: [
                new Paragraph({
                    children: [
                        new TextRun(internalSection.title.text),
                    ],
                    heading: HeadingLevel.HEADING_1,
                }),
                ...internalSection.children.map(child =>
                    new Paragraph({
                        children: [
                            new TextRun(child.text),
                        ],
                    }))
            ]
        };

        startNumbering = false; // Only the first section should start numbering

        return section;
    }));

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

    return sections;
}
