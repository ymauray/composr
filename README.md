# 📚 Composr

[![CI](https://github.com/ymauray/composr/actions/workflows/ci.yml/badge.svg)](https://github.com/ymauray/composr/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/ymauray/composr)](https://github.com/ymauray/composr/releases/latest)
[![Licence : GPL v3](https://img.shields.io/github/license/ymauray/composr)](COPYING)

Bienvenue sur **Composr** ! Ce projet permet de générer facilement des fichiers PDF et EPUB à partir de documents Word (.docx) avec des options de personnalisation avancées. Idéal pour l'édition, l'auto-publication ou la création de supports professionnels.

## 🚀 Fonctionnalités principales

- 📄 Conversion de fichiers `.docx` en PDF et EPUB
- 🎨 Personnalisation des styles et de la mise en page
- 🖼️ Gestion des couvertures et des images
- 📑 Génération automatique de la table des matières
- 🛠️ Prise en charge de plusieurs formats de page (A4, Half-Letter, etc.)
- 🔄 Scripts d'automatisation pour la conversion

## 📂 Structure du projet

```
├── assets/                # Modèles et ressources (CSS, ejs)
├── sources/               # Sources de documents par projet
├── src/                   # Code source TypeScript
├── temp/                  # Fichiers temporaires
├── index.ts               # Point d'entrée principal
├── package.json           # Dépendances et scripts npm
├── README.md              # Ce fichier 😄
```

## ⚡ Installation

1. Clonez ce dépôt :
   ```sh
   git clone https://github.com/ymauray/composr.git
   cd composr
   ```
2. Installez les dépendances :
   ```sh
   npm install
   ```

## 🛠️ Utilisation

1. Placez vos fichiers `.docx` dans le dossier `sources/<votre-projet>/`.
2. Configurez les options dans `settings.ts` du projet concerné.
3. Lancez la génération :
   ```sh
   npx tsx ./index.ts --source <votre-projet> --with-pdf
   ```
4. Les fichiers PDF et EPUB seront générés à l'endroit indiqué dans les fichier `settings.ts` de la source.

## 📝 Exemple de configuration

Voir `settings-sample.ts` pour un exemple de configuration personnalisée.

## ⚙️ Intégration continue et releases

Tout passe par GitHub Actions, sans outil externe :

- **CI** (`.github/workflows/ci.yml`) : à chaque push et pull request vers `main`, installe les dépendances (`npm ci`) et vérifie les types (`npm run typecheck`). Il n'y a pas encore de tests automatisés, et la conversion PDF (qui exige Microsoft Word) n'est pas testée en CI.
- **Release** (`.github/workflows/release.yml`) : à chaque push sur `main`, crée le tag `v<version>` et la release GitHub correspondant au champ `version` de `package.json`, s'ils n'existent pas encore. Publier une version revient donc à incrémenter `version`.
- **Dependabot** : mises à jour hebdomadaires des dépendances npm et des actions GitHub.

Aucun paquet n'est publié sur npm : la release GitHub ne contient que le code source.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez [`CONTRIBUTING.md`](CONTRIBUTING.md) avant d'ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence **GNU GPL v3**. Voir le fichier `COPYING` pour plus d'informations.

---


✨ Bon usage de Composr !

## 📦 Dépendances principales

- [docx](https://github.com/dolanmiu/docx) – Génération de documents Word
- [epub-gen](https://github.com/cyrilis/epub-gen) – Génération de fichiers EPUB
- [cheerio](https://github.com/cheeriojs/cheerio) – Manipulation du HTML côté serveur
- [mammoth](https://github.com/mwilliamson/mammoth.js) – Conversion de DOCX vers HTML
- [yargs](https://github.com/yargs/yargs) – Parsing des arguments en ligne de commande
- [ejs](https://github.com/mde/ejs) – Templates HTML dynamiques
