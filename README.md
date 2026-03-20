<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/majeurbilly/dark_omnivox">
    <img src="docs/images/logo.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Dark Omnivox Theme</h3>

  <p align="center">
    Extension Chrome **Dark Omnivox** 
    <br />
    <a href="#about"><strong>Explore the screenshots »</strong></a>
      <br />
      <br />
      <a href="https://github.com/majeurbilly/dark_omnivox/issues/new?assignees=&labels=bug&template=01_BUG_REPORT.md&title=bug%3A+">Report a Bug</a>
      ·
      <a href="https://github.com/majeurbilly/dark_omnivox/issues/new?assignees=&labels=enhancement&template=02_FEATURE_REQUEST.md&title=feat%3A+">Request a Feature</a>
      ·
      <a href="https://github.com/majeurbilly/dark_omnivox/issues/new?assignees=&labels=question&template=04_SUPPORT_QUESTION.md&title=support%3A+">Ask a Question</a>
  </p>
</div>




## Table of Contents

1. [About](#about)
2. [Installation Process](#installation-process)
   - [Prerequisites](#prerequisites)
   - [Structure du projet](#structure-du-projet)
   - [Built With](#built-with)
3. [Authors & Contributors](#authors--contributors)
4. [Acknowledgments](#acknowledgments)
5. [Licence](#licence)


## About

**Dark Omnivox** est une extension Chrome qui applique un thème sombre à Omnivox, la plateforme d’apprentissage utilisée dans les cégeps et collèges québécois. L’interface par défaut peut fatiguer les yeux lors de longues sessions. Cette extension propose une alternative confortable avec :

- **Bascule rapide** : activation et désactivation du mode sombre en un clic  
- **Persistance** : vos préférences sont sauvegardées pour les prochaines visites  
- **Comportement léger** : architecture modulaire (pattern Observer, injection CSS ciblée)



## Installation Process

L’extension est disponible sur le [Chrome Web Store.](https://chromewebstore.google.com/detail/dark-omnivox/iibodmibaldeakhfefnmjcajinggeadb?hl=fr&utm_source=ext_sidebar)

### Prerequisites

- **Node.js** (v18 ou plus récent)
- **pnpm** (gestionnaire de paquets) : `npm install -g pnpm`

Pour une installation locale :

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/majeurbilly/dark_omnivox.git
   cd dark_omnivox
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Compiler l’extension**
   ```bash
   pnpm build
   ```

4. **Charger dans Chrome**
   - Ouvrir `chrome://extensions`
   - Activer le **mode développeur** (en haut à droite)
   - Cliquer sur **Charger l’extension non empaquetée**
   - Sélectionner le dossier `dist`


### Structure du projet

```
## 🏗️ Structure du projet

L'architecture de l'extension est modulaire et divisée par responsabilités pour assurer un code maintenable et testable.

```text
dark_omnivox/
├── manifest.json           # Carte d'identité / config Chrome (V3)
├── package.json            # Scripts de build (Esbuild) et dépendances de développement
├── tsconfig.json           # Configuration stricte de TypeScript (ES2020)
├── build.ts                # Pipeline / Publish /dist
├── src/
│   ├── core/               # (Logique métier)
│   │   ├── darkModeController.ts  # Controler manipule la logique (Pattern Observer)
│   │   └── themeApplier.ts        # Manipule le visuel du DOM
│   │
│   ├── inject/             # injectés dans la page Omnivox
│   │   ├── inject.ts              # Point d'entrée
│   │   ├── inject.css             # CSS du mode sombre
│   │   └── icon.svg               # Icône du toggle
│   │
│   ├── shared/             # Contrats et types partagés
│   │   └── darkMode.ts            # Définitions TypeScript (État et Handlers)
│   │
│   ├── storage/            # Persistance des données
│   │   ├── chromeStorage.ts       # Filet de sécurité pour l'API chrome.storage
│   │   └── darkModeStore.ts       # Manipule uniquement la sauvegarde
│   │
│   └── ui/                 # Interface utilisateur
│       └── themeToggle.ts         # Logique du bouton d'activation/désactivation
└── dist/                   # Fichiers compilés

```

### Built With

- **TypeScript** — typage statique
- **Chrome Extension API** (Manifest V3)
- **Esbuild** — bundling rapide
- **Biome** — lint et formatage

## Authors & Contributors

[majeurbilly](https://majeurbilly.github.io/majeurbilly/)

## Acknowledgments

## Licence

MIT

([back to top](#readme-top))
