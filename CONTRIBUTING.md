# Contribuer à Composr

Merci de vous intéresser à Composr ! Ce document résume comment proposer une contribution.

## Avant de commencer

Pour une nouvelle fonctionnalité ou un changement important, ouvrez d'abord une issue ou une [discussion](https://github.com/ymauray/composr/discussions) pour en parler avec le mainteneur.

## Environnement de développement

Prérequis : Node.js (version LTS) et npm. La conversion DOCX → PDF s'appuie sur Microsoft Word, via `docx2pdf.ps1` sous Windows ou `docx2pdf.scpt` sous macOS.

```sh
npm ci
npm run typecheck
```

Le projet n'a pas encore de tests automatisés : la CI vérifie les types (`tsc --noEmit`). Pour un essai de bout en bout, copiez `settings-sample.ts` dans `sources/<projet>/settings.ts`, puis lancez `npx tsx ./index.ts --source <projet>`.

## Proposer une modification

1. Créez une branche dédiée depuis `main` (ex. `fix/...`, `feature/...`).
2. Faites des commits atomiques, avec des messages clairs au format `type: description` (`feat:`, `fix:`, `refactor:`, `doc:`, `chore:`).
3. Vérifiez que `npm run typecheck` passe en local.
4. Ouvrez une pull request vers `main` en remplissant le modèle fourni. Les PR sont mergées en squash.

## Conventions

- TypeScript, indentation de 4 espaces, fins de ligne LF (voir `.editorconfig`).
- Chaque fichier source commence par l'en-tête de licence GPL v3 en français, comme les fichiers existants.
