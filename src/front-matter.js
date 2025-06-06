const {
    SectionType, Paragraph, TextRun, AlignmentType, FrameAnchorType, BorderStyle, HorizontalPositionAlign,
} = require("docx");

const { settings, pageSettings } = require('../settings.js');

/**
 * Creates a title page section for the document.
 * @returns {Object} A section object representing the title page.
 * @private
 */
_titlePage = () => {

    const children = [];

    if (!settings.authors)
        throw new Error("Authors are not defined in settings");

    if (settings.authors.length === 0)
        throw new Error("Authors list is empty in settings");

    // Add authors

    settings.authors.forEach((author, index) => {

        // Add "et" before the last author
        if (index == settings.authors.length - 1) {
            children.push(new TextRun({
                text: "et",
                break: 1
            }));
        }

        // Add the author's name
        // Add a line break before if it's not the first author
        children.push(new TextRun({
            text: author,
            break: index > 0 ? 1 : 0,
            size: (settings.fontSize * 1.4) * 2, // Author names are 1.4 times larger
        }));

        // Add a comma after the author if there are 3 or more, and it's not the last one
        if (index < settings.authors.length - 2) {
            children.push(new TextRun({
                text: ",",
            }));
        }
    });

    const newSection = {
        properties: {
            type: SectionType.ODD_PAGE,
            page: pageSettings,
        },
        children: [
            new Paragraph({
                children: children,
                style: "corp",
                alignment: AlignmentType.CENTER,
                indent: {
                    firstLine: 0,
                },
            }),

            new Paragraph({
                frame: {
                    type: "alignment",
                    anchor: {
                        horizontal: FrameAnchorType.PAGE,
                        vertical: FrameAnchorType.PAGE,
                    },
                    alignment: {
                        x: HorizontalPositionAlign.CENTER,
                        y: HorizontalPositionAlign.CENTER,
                    }
                },
                children: [
                    new TextRun({
                        text: settings.title,
                        bold: true,
                        size: (settings.fontSize * 2) * 2, // Author names are 1.4 times larger
                    }),
                ],
                alignment: AlignmentType.CENTER,
                style: "corp",
            }),
        ]
    };

    return newSection;
}

/**
 * Creates a copyright page section for the document.
 * @returns {Object} A section object representing the copyright page.
 * @private
 */
_copyrightPage = () => {
    const newSection = {
        properties: {
            type: SectionType.NEXT_PAGE,
            page: pageSettings,
        },
        children: [
            new Paragraph({
                style: "corp",
                children: [
                    new TextRun({
                        text: "Ce texte est une fiction. Les noms et les événements qui y sont décrits sont issus de l’imagination de l’auteur, et toute ressemblance avec des personnages, des personnes, ou des situations existantes ou ayant existé ne pourrait être que pure coïncidence.",
                    }),
                ],
                spacing: {
                    after: settings.fontSize * 20, // in twips
                }
            }),
            new Paragraph({
                style: "corp",
                children: [
                    new TextRun({
                        text: "Les erreurs qui peuvent subsister sont le fait de l’auteur.",
                    }),
                ],
                spacing: {
                    after: settings.fontSize * 20, // in twips
                }
            }),
            new Paragraph({
                style: "corp",
                children: [
                    new TextRun({
                        text: "Le piratage prive l’auteur ainsi que les personnes ayant travaillé sur ce livre de leurs droits.",
                    }),
                ],
                spacing: {
                    after: settings.fontSize * 20, // in twips
                }
            }),
        ]
    };

    return newSection;
}

/** 
 * @param {Array} sections 
 * @param {Object} settings
 */
addFrontMatter = (sections) => {
    sections.push(_titlePage());
    sections.push(_copyrightPage());
};

module.exports = {
    addFrontMatter
};
