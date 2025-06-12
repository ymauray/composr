import Epub, { Options } from 'epub-gen';
import path from 'path';

import { AlignmentType, convertMillimetersToTwip, Document, Footer, HeadingLevel, ISectionOptions, Packer, PageNumber, Paragraph, ParagraphChild, SectionType, TextRun } from "docx";
import { Settings } from "./settings";
import { PageSettings, TagElement } from "./types";
import fs from "fs";
import ejs from 'ejs';

type Content = { title?: string; author?: string; data: string, excludeFromToc?: boolean, beforeToc?: boolean, filename?: string };

async function titlePage(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<string> {

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

async function copyrightPage(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<string> {

    var copyrightPageContent = "";

    copyrightPageContent += "<p>Ce texte est une fiction. Les noms et les événements qui y sont décrits sont issus de l’imagination de l’auteur, et toute ressemblance avec des personnages, des personnes, ou des situations existantes ou ayant existé ne pourrait être que pure coïncidence.</p>\n";

    copyrightPageContent += "<p>Les erreurs qui peuvent subsister sont le fait de l’auteur.</p>\n";

    copyrightPageContent += "<p>Le piratage prive l’auteur ainsi que les personnes ayant travaillé sur ce livre de leurs droits.</p>\n";

    return copyrightPageContent;
}

async function addFrontMatter(settings: Settings, pageSettings: PageSettings, marginSettings: number): Promise<Content[]> {
    const frontMatter: Content[] = [
        { title: 'Frontispice', data: await titlePage(settings, pageSettings, marginSettings), beforeToc: true },
        { title: 'Mentions légales', data: await copyrightPage(settings, pageSettings, marginSettings), beforeToc: true },
    ];

    return frontMatter;
}

export async function buildEpub(source: TagElement[], settings: Settings, pageSettings: PageSettings, marginSettings: number, pageNumbersSettings: number, outputPath: string): Promise<void> {

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

    const content = await addFrontMatter(settings, pageSettings, marginSettings);

    content.push(...internalSections.map(internalSection => {
        return {
            title: internalSection.title.text,
            data: `<h1>${internalSection.title.text}</h1>\n${internalSection.children.map(child => `<p>${child.text}</p>`).join('\n')}`
        };
    }));

    const options = {
        title: settings.title,
        author: settings.authors,
        publisher: 'Amaury Bennett',
        lang: 'fr',
        tocTitle: 'Table des matières',
        customNcxTocTemplatePath: 'assets/toc.ncx.ejs',
        customHtmlTocTemplatePath: 'assets/toc.xhtml.ejs',
        customOpfTemplatePath: 'assets/content.opf.ejs',
        css: fs.readFileSync('assets/style.css', 'utf8'),
        appendChapterTitles: false,
        content
    } as Options;

    new Epub(options, outputPath);
}
