# AGENTS.md

## But

Ce repo est un monorepo simple avec :

- `Frontend/` : Vue 3 + TypeScript + Vite + Pinia + PrimeVue + Tailwind
- `Backend/` : Strapi 5 + TypeScript

L'objectif d'un agent ici est de faire des changements ciblés, cohérents avec le style existant, et de minimiser la consommation de tokens.

## Règles de lecture

- Lire petit avant de lire large.
- Commencer par `README.md`, puis le dossier concerné (`Frontend/` ou `Backend/`).
- Utiliser `rg` pour localiser les symboles, routes, stores, services et composants avant d'ouvrir des fichiers.
- Ne pas lire `node_modules/`, `dist/`, `.git/` ni des fichiers générés sauf nécessité explicite.
- Ne pas dumper un fichier entier si seule une section est utile.
- Pour une tâche frontend, éviter d'ouvrir le backend tant qu'aucune dépendance API réelle ne l'impose, et inversement.

## Conventions globales

- Faire des changements minimaux et locaux.
- Préserver les noms déjà en place même s'ils sont imparfaits, sauf demande explicite de refactor.
- Ne pas introduire de nouvelle librairie sans nécessité claire.
- Ne pas ajouter de commentaires triviaux.
- Quand une convention diffère entre `Frontend` et `Backend`, respecter la convention du dossier touché.

## Conventions Frontend

- Stack : Vue 3 SFC avec `<script setup lang="ts">`.
- Format dominant : pas de point-virgule, quotes simples, largeur courte à moyenne.
- Alias : utiliser `@` pour `Frontend/src`.
- Composants et layouts : fichiers en `PascalCase.vue`.
- Views : structure existante par domaine (`views/Admin`, `views/Auth`).
- Stores Pinia : un store par domaine dans `src/stores`, noms de fichiers en `camelCase`.
- Services : centralisés dans `src/services`, pattern objet de service déjà présent.
- Modèles TS : interfaces/types dans `src/models`, enums dans `src/models/Enums`.
- i18n : ne pas hardcoder de texte utilisateur si une clé de traduction existe déjà.
- UI : privilégier PrimeVue et les patterns déjà visibles avant de créer du CSS ad hoc.

## Conventions Backend

- Stack : Strapi 5 généré en grande partie par conventions Strapi.
- Respecter la structure `src/api/<content-type>/{controllers,routes,services}`.
- Respecter le kebab-case des content-types Strapi existants.
- Dans les fichiers backend déjà générés par Strapi, conserver le style local existant même s'il diffère du frontend.
- Ne pas déplacer la logique métier frontend dans Strapi sans raison explicite.
- Vérifier les policies existantes avant d'ajouter une nouvelle règle d'accès.

## Commandes utiles

- Frontend dev : `cd Frontend && npm run dev`
- Frontend build : `cd Frontend && npm run build`
- Frontend type-check : `cd Frontend && npm run type-check`
- Frontend format : `cd Frontend && npm run format`
- Backend dev : `cd Backend && npm run dev`
- Backend build : `cd Backend && npm run build`

## Stratégie de modification

- Si la tâche touche l'UI, inspecter d'abord : `router`, `views`, `components`, `stores`, `services`.
- Si la tâche touche les données, inspecter d'abord : `models`, `services`, store associé, puis API Strapi concernée.
- Réutiliser les patterns existants avant d'inventer une nouvelle abstraction.
- En cas d'incohérence locale, aligner la zone modifiée sur les fichiers voisins immédiats.

## Discipline tokens

- Toujours résumer avant d'élargir.
- Citer les chemins de fichiers, pas leur contenu complet, sauf extrait nécessaire.
- Ouvrir au plus 1 à 3 fichiers pertinents par hypothèse.
- Éviter les audits globaux si la demande est locale.
- Ne pas relire plusieurs fois le même fichier sans nouvelle question technique.
- Pour répondre à l'utilisateur, privilégier :
  - le résultat,
  - les fichiers touchés,
  - les vérifications faites,
  - les risques restants.

## Vérification

- Après modification frontend : lancer au minimum `npm run type-check` ou `npm run build` si pertinent.
- Après modification backend : lancer au minimum le build ou le serveur Strapi si pertinent.
- Si une vérification n'est pas lancée, l'indiquer explicitement.
