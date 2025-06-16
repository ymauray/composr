// Génération de fichiers EPUB à partir de la structure de livre composr et des paramètres utilisateur.
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

import { Settings } from "./settings";
import { TagElement } from "./types";
import fs from "fs";
import { legalNotice, aboutTheAuthor } from './compose';

type Content = { title?: string; author?: string; data: string, excludeFromToc?: boolean, beforeToc?: boolean, filename?: string };

async function titlePage(settings: Settings): Promise<string> {

    let titlePageContent = "<div class='authors'>\n";

    // Add authors
    settings.authors.forEach((author, index) => {
        // Add "et" before the last author, if there is more than one author
        if (index > 0 && index == settings.authors.length - 1) {
            titlePageContent += "<div class='and'>et</div>\n";
        }

        let authorText = `<div class='author'>${author}`;

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

async function copyrightPage(settings: Settings): Promise<string> {

    const copyrightPageContent = [
        ...legalNotice.map(line => `<p>${line}</p>`),
        `<p class="publisher">Autoédition Amaury Bennett</p>`,
        `<p class="publisher-address">autoedition@amaurybennett.ch</p>`,
        `<p class="copyright">© ${settings.copyright} Amaury Bennett</p>`,
    ].join('\n');
    
    return copyrightPageContent;
}

async function about(settings: Settings): Promise<string> {
    const aboutContent = [
        `<h1>A propos de l'auteur</h1>`,
        ...aboutTheAuthor.map(line => `<p>${line === '' ? '&nbsp;' : line}</p>`),
    ].join('\n');

    return aboutContent;
}


async function addFrontMatter(settings: Settings): Promise<Content[]> {
    const frontMatter: Content[] = [
        { title: 'Frontispice', data: await titlePage(settings), beforeToc: true },
        { title: 'Mentions légales', data: await copyrightPage(settings), beforeToc: true },
    ];

    return frontMatter;
}

async function addBackMatter(settings: Settings): Promise<Content[]> {
    const backMatter: Content[] = [
        { title: "A propos de l'auteur", data: await about(settings), beforeToc: false },
    ];

    return backMatter;
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
            data: `<h1>${internalSection.title.text}</h1>\n${internalSection.children.map(child => `<p${child.text === "***" ? ' class="elipsis"':''}>${child.text}</p>`).join('\n')}`
        };
    }));

    content.push(...await addBackMatter(settings));

    const options = {
        title: settings.title,
        author: settings.authors,
        publisher: 'Autoédition Amaury Bennett',
        lang: 'fr',
        tocTitle: 'Table de matières',
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
