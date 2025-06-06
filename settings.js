const {
    convertInchesToTwip,
    convertMillimetersToTwip,
} = require("docx");

settings = {

    // Things that are likely to change

    authors: ["Sandrine Kohler", "Amaury Bennett"],
    title: "Anya",
    mirrorMargins: true,

    // Things that are unlikely to change

    fontName: "Amazon Endure Book",
    fontSize: 10, // in points
};

pageSettings = {
    size: {
        width: convertInchesToTwip(5.5), // 13.97 cm
        height: convertInchesToTwip(8.5), // 21.59 cm
    },
    margin: {
        left: convertMillimetersToTwip(16), // 1.6 cm
        right: convertMillimetersToTwip(16), // 1.6 cm
        top: convertMillimetersToTwip(19), // 1.9 cm
        bottom: convertMillimetersToTwip(19), // 1.9 cm
        gutter: convertMillimetersToTwip(3), // 0.3 cm
    },
}


module.exports = { settings, pageSettings }
