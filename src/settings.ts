// Définition de la classe Settings pour la configuration principale du projet composr.
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

export class Settings {
    source: string = ''; // Source file path, e.g., 'sources/mybook/My Book.docx'
    cover: string = ''; // Cover image path, e.g., 'sources/mybook/cover.jpg'
    output: string = ''; // Output file path, e.g., 'output/mybook.docx'
    title: string = ''; // Title of the document, e.g., 'My awesome book'
    authors: string[] = []; // List of authors, e.g., ['Alice Smith', 'Bob Johnson', 'Charlie Brown']
    publisher: string = ''; // Publisher name, e.g., 'My Publisher Name'
    lang: string = ''; // Language of the document, e.g., 'fr' for French, 'en' for English
    tocTitle: string = ''; // Title for the table of contents, e.g., 'Table des matières' in French, 'Table of Contents' in English
}
