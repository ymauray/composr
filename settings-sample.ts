// Exemple de fichier de configuration Settings pour un projet composr.
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

import { MarginSettings, pageType } from './src/page-settings';
import { Settings } from './src/settings';
import { CoverSettings } from './src/types';

export const settings: Settings = {
    source: 'sources/mybook/My Book.docx',
    cover: 'sources/mybook/cover.jpg',
    output: 'output.docx',
    outputFormats: [
        { pageSettings: pageType.A4, marginSettings: MarginSettings.NORMAL, coverSettings: CoverSettings.WITH_COVER },
        { pageSettings: pageType.POCKET_BOOK, marginSettings: MarginSettings.OPPOSING_PAGES, coverSettings: CoverSettings.NO_COVER },
    ],
    title: "My Book Title",
    authors: ["Alice Smith", "Bob Johnson", "Charlie Brown"],
    copyright: 2023,
    isbn: '978-3-16-148410-0',
};
