// Génération de fichiers EPUB à partir de la structure de livre imposr et des paramètres utilisateur.
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

import Epub, { Options } from 'epub-gen';
import path from 'path';

import { AlignmentType, convertMillimetersToTwip, Document, Footer, HeadingLevel, ISectionOptions, Packer, PageNumber, Paragraph, ParagraphChild, SectionType, TextRun } from "docx";
import { Settings } from "./settings";
import { PageSettings, TagElement } from "./types";
import fs from "fs";
import ejs from 'ejs';
import { legalNotice } from './compose';

type Content = { title?: string; author?: string; data: string, excludeFromToc?: boolean, beforeToc?: boolean, filename?: string };

async function titlePage(settings: Settings): Promise<string> {

    var titlePageContent = "<div class='authors'>\n";

    // Add authors
    settings.authors.forEach((author, index) => {
        // Add "et" before the last author, if there is more than one author
        if (index > 0 && index == settings.authors.length - 1) {
            titlePageContent += "<div class='and'>et</div>\n";
        }

        var authorText = `<div class='author'>${author}`;

        // Add a comma after the author if there are 3 or more, and it's not the last one
        if (index < settings.authors.length - 2) {
            authorText += ',';
        }
        authorText += '</div>\n';
        titlePageContent += authorText;
    });

    titlePageContent += `</div>\n<div class='title'>${settings.title}</div>\n`;

    return titlePageContent;
}

async function copyrightPage(): Promise<string> {

    var copyrightPageContent = legalNotice.map(line => `<p>${line}</p>`).join('\n');

    return copyrightPageContent;
}

async function addFrontMatter(settings: Settings): Promise<Content[]> {
    const frontMatter: Content[] = [
        { title: 'Frontispice', data: await titlePage(settings), beforeToc: true },
        { title: 'Mentions légales', data: await copyrightPage(), beforeToc: true },
    ];

    return frontMatter;
}

export async function buildEpub(source: TagElement[], settings: Settings, outputPath: string): Promise<void> {

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

    const content = await addFrontMatter(settings);

    content.push(...internalSections.map(internalSection => {
        return {
            title: internalSection.title.text,
            data: `<h1>${internalSection.title.text}</h1>\n${internalSection.children.map(child => `<p>${child.text}</p>`).join('\n')}`
        };
    }));

    const options = {
        title: settings.title,
        author: settings.authors,
        publisher: settings.publisher,
        lang: settings.lang,
        tocTitle: settings.tocTitle,
        customNcxTocTemplatePath: 'assets/toc.ncx.ejs',
        customHtmlTocTemplatePath: 'assets/toc.xhtml.ejs',
        customOpfTemplatePath: 'assets/content.opf.ejs',
        css: fs.readFileSync('assets/style.css', 'utf8'),
        cover: settings.cover,
        appendChapterTitles: false,
        tempDir: './temp',
        content
    } as Options;

    new Epub(options, outputPath);
}
