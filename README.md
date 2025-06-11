# imposr

## Description
Imposr est un outil permettant de composer un livre dans plusieurs formats (EPUB, DOCX) à partir d'un fichier source unique. Il génère automatiquement la mise en page, les frontispices, et traite correctement le formatage du texte pour différents formats de sortie.

## Installation

```bash
npm install
```

## Utilisation

1. Créez un fichier de configuration en vous basant sur [`settings-sample.ts`](settings-sample.ts)
2. Exécutez la commande:

```bash
npx tsx ./index.ts -- --settings votre-fichier-settings.ts
```

## Configuration

Pour configurer votre livre, créez un fichier de paramètres basé sur le modèle [`settings-sample.ts`](settings-sample.ts):

```typescript
import { Settings } from './src/settings';

export const settings: Settings = {
    source: 'chemin/vers/votre-fichier-source.docx',
    output: 'chemin/vers/votre-fichier-de-sortie.docx',
    authors: ["Prénom Nom", "Autre Auteur"],
    title: "Titre de votre livre",
};
```

## Formats de page pris en charge

- **A4**: Format standard pour l'impression en Europe
- **Half Letter**: Format adapté aux livres de poche

## Formats de sortie

L'outil génère automatiquement:

- Fichier EPUB pour les liseuses électroniques
- Fichier DOCX au format A4 standard
- Fichier DOCX au format Half Letter (5.5" x 8.5")
- Fichier DOCX optimisé pour l'impression de livres de poche avec des marges adaptées

## Structure du projet

- [`src`](src): Code source TypeScript
- [`assets`](assets): Fichiers de style et templates
- [`output`](output): Dossier par défaut pour les fichiers générés
- [`sources`](sources): Dossier contenant les fichiers sources

## Licence

Ce projet est distribué sous la licence GNU GPL-3.0.

## Dépendances principales

- [docx](https://github.com/dolanmiu/docx) - Génération de documents Word
- [epub-gen](https://github.com/cyrilis/epub-gen) - Génération de fichiers EPUB
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Conversion de DOCX vers HTML

