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
    size: { width: number; height: number } = { width: 0, height: 0 }; // A4 size in points
    margin: { left: number; right: number; top: number; bottom: number; gutter?: number } = { left: 0, right: 0, top: 0, bottom: 0 };
    fontName: string = '';
    fontSize: number = 0; // in points
    titleFontName: string = ''; // Font for the title
    titleFontSize: number = 0; // in points
}