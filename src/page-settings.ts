// Paramètres de page prédéfinis et constantes pour la mise en page des documents composr.
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

import { PageSettings } from "./types";

import {
    convertInchesToTwip,
    convertMillimetersToTwip,
} from "docx";

const POCKET_BOOK : PageSettings = {
    size: {
        width: convertMillimetersToTwip(106), // 10.6 cm
        height: convertMillimetersToTwip(174), // 17.4 cm
    },
    margin: {
        left: convertMillimetersToTwip(8), // 0.8 cm
        right: convertMillimetersToTwip(8), // 0.8 cm
        top: convertMillimetersToTwip(15), // 1.5 cm
        bottom: convertMillimetersToTwip(20), // 2.0 cm
        gutter: convertMillimetersToTwip(5), // 0.5 cm
    },
    fontName: "Amazon Endure Book",
    fontSize: 10, // in points
    titleFontName: "Arial",
    titleFontSize: 15, // in points
};

const HALF_LETTER : PageSettings = {
    size: {
        width: convertInchesToTwip(5.5), // 13.97 cm
        height: convertInchesToTwip(8.5), // 21.59 cm
    },
    margin: {
        left: convertMillimetersToTwip(16), // 1.6 cm
        right: convertMillimetersToTwip(16), // 1.6 cm
        top: convertMillimetersToTwip(19), // 1.9 cm
        bottom: convertMillimetersToTwip(24), // 2.4 cm
        gutter: convertMillimetersToTwip(3), // 0.3 cm
    },
    fontName: "Amazon Endure Book",
    fontSize: 10, // in points
    titleFontName: "Arial",
    titleFontSize: 15, // in points
};

const SIX_BY_NINE : PageSettings = {
    size: {
        width: convertInchesToTwip(6), // 15,24 cm
        height: convertInchesToTwip(9), // 22,86 cm
    },
    margin: {
        left: convertMillimetersToTwip(16), // 1.6 cm
        right: convertMillimetersToTwip(16), // 1.6 cm
        top: convertMillimetersToTwip(19), // 1.9 cm
        bottom: convertMillimetersToTwip(24), // 2.4 cm
        gutter: convertMillimetersToTwip(3), // 0.3 cm
    },
    fontName: "Amazon Endure Book",
    fontSize: 10, // in points
    titleFontName: "Arial",
    titleFontSize: 15, // in points
};

const A4 : PageSettings = {
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
};

export const pageType = {
    POCKET_BOOK,
    HALF_LETTER,
    A4,
    SIX_BY_NINE
};

export const MarginSettings = {
    NORMAL: 0,
    OPPOSING_PAGES: 1
};

export const PageNumbersSettings = {
    NONE: 0,
    BOTTOM: 1,
}
