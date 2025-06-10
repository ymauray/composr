class Settings {
    /**
     * @param {Object} options - The settings options.
     * @param {string} options.source - The source file path.
     * @param {string} options.output - The output file path.
     * @param {Array<string>} options.authors - The list of authors.
     * @param {string} options.title - The title of the document.
     * @constructor
     */
    constructor({ source, output, authors, title }) {
        this.source = source;
        this.output = output;
        this.authors = authors;
        this.title = title;
    }
};

module.exports = { Settings };
