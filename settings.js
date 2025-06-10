const { Settings } = require('./src/settings');

const settings = new Settings({
    source: 'source.docx',
    output: 'output.docx',
    authors: ["Sandrine Kohler", "Amaury Bennett"],
    title: "Memory Corp",
    fontName: "Amazon Endure Book",
    fontSize: 10 // in points
});

module.exports = { settings };
