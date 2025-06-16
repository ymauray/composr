// Génération des documents DOCX à partir de la structure composr et des paramètres utilisateur.
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

export const legalNotice = [
    "Ce livre est une œuvre de fiction. Toute ressemblance avec des personnes existantes ou ayant existé, des événements ou des lieux réels ne saurait être que fortuite.",
    "Les personnages, situations et dialogues sont issus de l’imagination de l’auteur.",
    "La copie ou le piratage de ce livre porte préjudice à l’auteur et à l’ensemble des personnes ayant contribué à sa réalisation. Merci de respecter leur travail.",
    "Tous droits de reproduction, d’adaptation et de traduction, intégrale ou partielle réservés pour tous pays. L’auteur ou l’éditeur est seul propriétaire des droits et responsable du contenu de ce livre. Le Code de la propriété intellectuelle interdit les copies ou reproductions destinées à une utilisation collective. Toute représentation ou reproduction intégrale ou partielle faite par quelque procédé que ce soit, sans le consentement de l’auteur ou de ses ayants droit ou ayants cause, est illicite et constitue une contrefaçon, aux termes des articles L.335-2 et suivants du Code de la propriété intellectuelle.",
    "L’auteur a apporté le plus grand soin à la correction du texte, mais des erreurs peuvent subsister. Toute remarque constructive est la bienvenue.",
];

export const aboutTheAuthor = [
    "Originaire de Normandie, Amaury a découvert la fantaisie et le fantastique à travers les jeux de rôles. Bercé par les univers de R.A. Salvatore et Margaret Weis, il a commencé par écrire des scénarios et des récits courts qui racontaient les aventures vécues avec ses compagnons de jeu.",
    "Au début des années 2000, son intérêt s'est tourné vers la fantaisie urbaine. Ce qui l'a séduit ? Cette alchimie fascinante entre notre réalité contemporaine et familière d'un côté, et les mystères de la magie et des créatures fantastiques de l'autre.",
    "Il y a quelques années, Amaury a découvert le genre de la dystopie, et a été captivé par la manière dont les auteurs explorent les dérives de notre société actuelle à travers des récits sombres et intrigants.",
    "En août 2024, son amie Sandrine Kholer lui a confié qu'elle avait entamé l'écriture d'une histoire dix ans auparavant — un projet qu'elle pensait ne jamais achever.",
    "À cette époque, Amaury nourrissait déjà l'envie d'écrire quelque chose de plus ambitieux qu'une simple nouvelle. Le petit texte de Sandrine a fait tilt dans son esprit créatif. Il lui a alors proposé un marché : il écrirait son histoire, et en échange, ils partageraient le statut de coauteurs.",
    "C'est ainsi qu'Amaury s'est lancé dans cette belle aventure. Il a suivi une formation à l'Institut des carrières littéraires, pendant qu'il écrivait le premier jet de son premier roman. En parallèle, il a continué à écrire des nouvelles afin d'explorer différents genres littéraires et techniques d'écriture.",
    "",
    "Pour suivre les aventures d'Amaury, vous pouvez vous abonner à sa newsletter sur son site web (https://amaurybennet.ch), le rejoindre sur Instagram (@amaurybennet), ou le suivre sur Twitch (@amaurybennet) pour de sessions de coworking.",
]
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
            type: marginSettings == MarginSettings.OPPOSING_PAGES ? SectionType.ODD_PAGE : SectionType.NEXT_PAGE,
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
        children: [
            ...legalNotice.map((line) =>
                new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                        }),
                    ],
                    indent: {
                        firstLine: 0,
                    },
                    spacing: {
                        after: pageSettings.fontSize * 20, // in twips
                    }
                })),
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'Autoédition Amaury Bennett',
                    }),
                ],
                indent: {
                    firstLine: 0,
                },
                spacing: {
                    before: (pageSettings.fontSize * 3) * 20, // in twips
                }
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'autoedition@amaurybennett.ch',
                    }),
                ],
                indent: {
                    firstLine: 0,
                },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: `© ${settings.copyright} Amaury Bennett`,
                    }),
                ],
                indent: {
                    firstLine: 0,
                },
            }),
            ...(settings.isbn ? [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `ISBN: ${settings.isbn!}`,
                        }),
                    ],
                    indent: {
                        firstLine: 0,
                    },
                    spacing: {
                        before: pageSettings.fontSize * 20, // in twips
                    }
                })
            ] : []),
        ]
    };

    return newSection;
}

async function about(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<ISectionOptions> {
    const newSection: ISectionOptions = {
        properties: {
            type: SectionType.ODD_PAGE,
            page: {
                ...pageSettings,
                ...((marginSettings == MarginSettings.NORMAL) && { margin: { ...pageSettings.margin, gutter: 0 } }),
            },
        },
        children: [
            new Paragraph({
                    children: [
                        new TextRun({
                            text: "A propos de l'auteur",
                        }),
                    ],
                    heading: HeadingLevel.HEADING_1,
                    indent: {
                        firstLine: 0,
                    },
                    spacing: {
                        after: pageSettings.fontSize * 20, // in twips
                    }
                }),
            ...aboutTheAuthor.map((line) =>
                new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                        }),
                    ],
                    indent: {
                        firstLine: 0,
                    },
                })),
        ]
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

async function addBackMatter(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<ISectionOptions[]> {
    const backMatter: ISectionOptions[] = [
        await about(settings, pageSettings, marginSettings),
    ];

    return backMatter;
}

export async function compose(source: TagElement[], settings: Settings, pageSettings: PageSettings, marginSettings: number, pageNumbersSettings: number, addCover: boolean, outputPath: string): Promise<ISectionOptions[]> {

    console.log(`Génération de ${outputPath}`);

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
        children: addCover ? [
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
        ] : []
    }];

    sections.push(...await addFrontMatter(settings, pageSettings, marginSettings));

    let startNumbering = true;

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
                        ...(child.text == '***') && {
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                before: pageSettings.fontSize * 20, // in twips
                                after: pageSettings.fontSize * 20, // in twips
                            },
                            indent: {
                                firstLine: 0,
                            }
                        },
                    }))
            ]
        };

        startNumbering = false; // Only the first section should start numbering

        return section;
    }));

    sections.push(...await addBackMatter(settings, pageSettings, marginSettings));

    // If there is a "dedication.txt" file next to the source file, read it line by line and add it as a section
    const dedicationPath = `${settings.source.replace('.docx', '.txt')}`;
    if (fs.existsSync(dedicationPath)) {
        const dedicationContent = fs.readFileSync(dedicationPath, 'utf-8');
        const dedicationLines = dedicationContent.split('\n').map(line => line.trim());

        if (dedicationLines.length > 0) {
            sections.push({
                properties: {
                    type: SectionType.ODD_PAGE,
                    page: {
                        ...pageSettings,
                        ...((marginSettings == MarginSettings.NORMAL) && { margin: { ...pageSettings.margin, gutter: 0 } }),
                    },
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Remerciements",
                            }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        indent: {
                            firstLine: 0,
                        },
                        spacing: {
                            after: pageSettings.fontSize * 20, // in twips
                        }
                    }),
                    ...dedicationLines.map(line =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                }),
                            ],
                            indent: {
                                firstLine: 0,
                            },
                            spacing: {
                                after: pageSettings.fontSize * 20, // in twips
                            }
                        }))
                ]
            });
        }
    }

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
