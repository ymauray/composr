// Définitions des types et classes de base pour la structure des documents imposr.
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

export class TagElement {
    tag: string = '';
    text: string = '';
}

export class Section {
    title: TagElement;
    children: TagElement[] = [];

    constructor(title: TagElement) {
        this.title = title;
    }
}

export class PageSettings {
    size: { width: number; height: number } = { width: 0, height: 0 }; // Page size in points
    margin: { left: number; right: number; top: number; bottom: number; gutter?: number } = { left: 0, right: 0, top: 0, bottom: 0 };
    fontName: string = '';
    fontSize: number = 0; // in points
    titleFontName: string = ''; // Font for the title
    titleFontSize: number = 0; // in points
}