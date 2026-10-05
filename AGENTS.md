# AGENTS.md — consignes pour les agents de code

Composr génère, à partir d'un manuscrit Word (`.docx`), des documents DOCX mis en page (plusieurs formats de page), leurs PDF et un EPUB.

## Commandes

```sh
npm ci                                             # dépendances
npm run typecheck                                  # tsc --noEmit, seul contrôle de la CI
npx tsx ./index.ts --source <projet> [--with-pdf]  # génération
```

Il n'y a pas de tests automatisés. Pour valider un changement, lancer une génération sur un projet réel de `sources/` (dossier ignoré par Git) et vérifier les fichiers produits.

## Architecture

- `index.ts` : point d'entrée (CLI yargs) ; charge `sources/<projet>/settings.ts` ou `--settings`, puis enchaîne DOCX, PDF et EPUB.
- `src/file-utils.ts` : lecture du `.docx` source (mammoth → HTML → cheerio).
- `src/compose.ts` : génération des DOCX mis en page (bibliothèque `docx`, fork `ymauray/docx` installé depuis une release GitHub).
- `src/pdf.ts` : conversion DOCX → PDF par Microsoft Word, via `docx2pdf.ps1` (Windows) ou `docx2pdf.scpt` (macOS).
- `src/epub.ts` et `assets/` : génération de l'EPUB (epub-gen, templates EJS, CSS).
- `src/settings.ts`, `src/page-settings.ts`, `src/types.ts` : configuration, formats de page et types.
- `settings-sample.ts` : exemple de configuration, à maintenir à jour avec le type `Settings` (la CI le vérifie).

## Conventions

- Code et commentaires en français ; TypeScript strict, indentation de 4 espaces, fins de ligne LF (`*.ps1` en CRLF).
- Chaque fichier source commence par l'en-tête de licence GPL v3 en français.
- Messages de commit `type: description` (`feat:`, `fix:`, `refactor:`, `doc:`, `chore:`).

## Cycle de travail

- `main` est protégée : passer par une branche et une PR vers `main`, mergée en squash par le mainteneur. Un agent ne merge jamais.
- Publier une version : incrémenter `version` dans `package.json`. Au merge, le workflow `Release` crée le tag `v<version>` et sa release.
