const {
    convertInchesToTwip,
    convertMillimetersToTwip,
} = require("docx");

class PageSettings {
    /**
     * @param {Object} options - The page settings options.
     * @param {Object} options.size - The size of the page.
     * @param {number} options.size.width - The width of the page in twips.
     * @param {number} options.size.height - The height of the page in twips.
     * @param {Object} options.margin - The margins of the page.
     * @param {number} options.margin.left - The left margin in twips.
     * @param {number} options.margin.right - The right margin in twips.
     * @param {number} options.margin.top - The top margin in twips.
     * @param {number} options.margin.bottom - The bottom margin in twips.
     * @param {number} options.margin.gutter - The gutter margin in twips.
     * @param {string} options.fontName - The font name to use.
     * @param {number} options.fontSize - The font size in points.
     * @param {string} options.titleFontName - The font name for the title.
     * @param {number} options.titleFontSize - The font size for the title in points.
     * @constructor
     */
    constructor({ size, margin, fontName, fontSize, titleFontName, titleFontSize }) {
        this.size = size;
        this.margin = margin;
        this.fontName = fontName;
        this.fontSize = fontSize; // in points
        this.titleFontName = titleFontName;
        this.titleFontSize = titleFontSize; // in points
    }
}

const pageSettings = {
    HALF_LETTER: new PageSettings({
        size: {
            width: convertInchesToTwip(5.5), // 13.97 cm
            height: convertInchesToTwip(8.5), // 21.59 cm
        },
        margin: {
            left: convertMillimetersToTwip(16), // 1.6 cm
            right: convertMillimetersToTwip(16), // 1.6 cm
            top: convertMillimetersToTwip(19), // 1.9 cm
            bottom: convertMillimetersToTwip(24), // 1.9 cm
            gutter: convertMillimetersToTwip(3), // 0.3 cm
        },
        fontName: "Amazon Endure Book",
        fontSize: 10, // in points
        titleFontName: "Arial",
        titleFontSize: 15, // in points
    }),
    A4: new PageSettings({
        size: {
            width: convertMillimetersToTwip(210), // 21.0 cm
            height: convertMillimetersToTwip(297), // 29.7 cm
        },
        margin: {
            left: convertMillimetersToTwip(24), // 2.4 cm
            right: convertMillimetersToTwip(24), // 2.4 cm
            top: convertMillimetersToTwip(26), // 2.6 cm
            bottom: convertMillimetersToTwip(26), // 2.6 cm
            gutter: convertMillimetersToTwip(4.5), // 0.45 cm
        },
        fontName: "Bookerly",
        fontSize: 12, // in points
        titleFontName: "Montserrat",
        titleFontSize: 18, // in points
    }),
};

const MarginSettings = {
    NORMAL: 0,
    OPPOSING_PAGES: 1
};

const PageNumbersSettings = {
    NONE: 0,
    BOTTOM: 1,
}

module.exports = { MarginSettings, PageNumbersSettings, PageSettings, pageSettings };
