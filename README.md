# Sans Croquettes Fixes

Site web de l'association d'adoption de chats "Sans Croquettes Fixes" (Lyon et sa région).

Le projet est un monorepo à deux applications indépendantes :

- `Backend/` : API Strapi 5 (Node.js, SQLite en développement) qui expose le contenu (fiches chats, articles de blog, demandes d'adoption, absences des bénévoles, conversations, etc.) et gère l'authentification.
- `Frontend/` : application Vue 3 + Vite + TypeScript, consommant l'API Strapi, avec un espace public (adoption, CatMatch, blog, dons) et un espace d'administration protégé par rôle.

## Prérequis

- Node.js 20.19+ ou 22.12+ (voir `Frontend/package.json` et `Backend/package.json`, champ `engines`)
- npm (le repo utilise `package-lock.json`, pas de yarn/pnpm)

Aucune base de données externe n'est nécessaire en développement : Strapi utilise SQLite par défaut (fichier généré dans `Backend/.tmp`).

## Installation

Cloner le repo puis installer les dépendances des deux applications séparément :

```shell
cd Backend
npm install

cd ../Frontend
npm install
```

### Configuration des variables d'environnement

Aucune des deux applications ne fonctionne sans son fichier `.env`.

**Backend** : copier `Backend/.env.example` vers `Backend/.env` puis renseigner les valeurs (voir la section [Variables d'environnement](#variables-denvironnement) ci-dessous pour le détail de chaque clé). Les secrets (`APP_KEYS`, `JWT_SECRET`, etc.) doivent être remplacés par des valeurs générées, jamais laissés à `tobemodified`.

**Frontend** : il n'existe pas de `.env.example` dans `Frontend/` actuellement. Créer un fichier `Frontend/.env.development` (ou `.env`) avec au minimum :

```
VITE_APP_NAME=Sans Croquettes Fixes - Association d'adoption de chats
VITE_APP_API_BASE_URL=http://localhost:1337/api
```

Voir la section variables d'environnement pour les clés optionnelles (don, contact).

### Premier démarrage du Backend et mise en place des rôles

Ce projet utilise des rôles applicatifs personnalisés (`Admin`, `Volunteer`, `User`) qui ne sont **pas créés automatiquement** par Strapi. Sans cette étape manuelle, l'API refusera silencieusement la plupart des requêtes des utilisateurs inscrits.

1. Démarrer le Backend une première fois : `npm run dev` depuis `Backend/`.
2. Ouvrir `http://localhost:1337/admin` et créer le compte administrateur Strapi (premier lancement uniquement).
3. Dans `Réglages > Users & Permissions Plugin > Rôles`, créer trois rôles avec exactement ces noms (sensibles à la casse) : `Admin`, `Volunteer`, `User`. Le contenu de chaque rôle (permissions par action) n'a pas besoin d'être configuré manuellement : redémarrer le serveur Strapi (`npm run dev`) déclenche `Backend/src/index.ts`, qui attribue automatiquement les permissions attendues à chaque rôle nommé (voir la matrice détaillée plus bas).
4. Toujours dans `Users & Permissions Plugin`, ouvrir `Rôles > Public` puis vérifier que le rôle par défaut assigné aux nouveaux inscrits (`Settings > Advanced Settings > Default role for authenticated users`) est bien `User`, et non `Authenticated`. Sans ce réglage, tout nouveau compte créé via le formulaire d'inscription du Frontend se retrouve avec un rôle sans aucune permission.
5. Redémarrer le Backend une dernière fois pour que le bootstrap applique les permissions aux rôles fraîchement créés.

Un compte Admin ne peut pas s'auto-attribuer via le formulaire d'inscription public : après création d'un premier compte utilisateur, passer son rôle à `Admin` ou `Volunteer` directement depuis `Content Manager > User` dans l'admin Strapi (ou via l'écran de gestion des utilisateurs du Frontend, une fois qu'un premier Admin existe).

### Données de test (optionnel)

`Backend/scripts/seed-cat-sheets.js` génère des fiches chats variées (avec photos via cataas.com) pour avoir de quoi tester les filtres d'adoption et le classement CatMatch :

```shell
cd Backend
node scripts/seed-cat-sheets.js 30
```

Le script démarre Strapi sans ouvrir de serveur HTTP, donc il peut tourner même si `npm run dev` est déjà lancé dans un autre terminal.

## Développement

```shell
cd Backend
npm run dev
```

API et admin Strapi : `http://localhost:1337/admin`

```shell
cd Frontend
npm run dev
```

Application : `http://localhost:5173/home`

## Variables d'environnement

### Backend (`Backend/.env`)

| Variable                                                                  | Rôle                                                                                                                                                                  |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HOST` / `PORT`                                                           | Adresse et port d'écoute du serveur Strapi (`0.0.0.0` / `1337` par défaut)                                                                                            |
| `APP_KEYS`                                                                | Clés de signature des sessions admin Strapi, liste séparée par des virgules                                                                                           |
| `API_TOKEN_SALT`                                                          | Sel utilisé pour les tokens API générés depuis l'admin                                                                                                                |
| `ADMIN_JWT_SECRET`                                                        | Secret de signature des JWT de l'admin Strapi                                                                                                                         |
| `TRANSFER_TOKEN_SALT`                                                     | Sel utilisé par les tokens de transfert de données Strapi                                                                                                             |
| `JWT_SECRET`                                                              | Secret de signature des JWT utilisateurs (plugin Users & Permissions), utilisé par le Frontend pour authentifier les requêtes                                         |
| `ENCRYPTION_KEY`                                                          | Clé de chiffrement de certaines données sensibles stockées par Strapi                                                                                                 |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD` | Configuration du provider d'envoi d'e-mail (`@strapi/provider-email-nodemailer`), utilisée pour les notifications (confirmation de compte, demandes d'adoption, etc.) |
| `SMTP_FROM_ADDRESS`                                                       | Adresse d'expédition par défaut des e-mails envoyés par Strapi                                                                                                        |
| `SMTP_REPLY_TO_ADDRESS`                                                   | Adresse de réponse par défaut (retombe sur `SMTP_FROM_ADDRESS` si absente)                                                                                            |
| `FRONTEND_URL`                                                            | URL du Frontend, utilisée dans les liens des e-mails envoyés (confirmation de compte, etc.)                                                                           |
| `BACKEND_URL`                                                             | URL publique du Backend                                                                                                                                               |

Toutes ces clés doivent impérativement être définies pour que Strapi démarre ; se référer à `Backend/.env.example` pour la structure exacte du fichier.

### Frontend (`Frontend/.env`, `.env.development`, `.env.production`)

| Variable                      | Rôle                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| `VITE_APP_NAME`               | Nom de l'application, utilisé dans le titre des pages et certains textes                             |
| `VITE_APP_API_BASE_URL`       | URL de base de l'API Strapi consommée par le Frontend (`http://localhost:1337/api` en développement) |
| `VITE_HELLOASSO_DONATION_URL` | URL de la page de don HelloAsso, utilisée par les CTA "Faire un don"                                 |
| `VITE_CONTACT_EMAIL`          | Adresse e-mail de contact affichée sur le site                                                       |

Vite charge `.env`, `.env.development` (mode dev) et `.env.production` (build) selon le mode d'exécution ; une valeur définie dans `.env.development` ou `.env.production` prend le pas sur `.env` pour la même clé.

## Rôles et permissions

L'authentification passe par le plugin Strapi Users & Permissions. Le Frontend distingue quatre profils, `Frontend/src/router/Roles.ts` et les gardes de route dans `Frontend/src/router/routes.ts` s'appuient dessus pour protéger les pages `/dashboard/*`.

- **Public** (non authentifié) : consultation des fiches chats à l'adoption, du blog, de la page CatMatch en découverte seule.
- **User** : rôle par défaut d'un compte inscrit. Peut consulter le blog, déposer une demande d'adoption, consulter ses propres demandes, et démarrer/consulter une conversation avec un bénévole au sujet d'une fiche chat.
- **Volunteer** : en plus des droits `User`, peut gérer les demandes d'adoption (modifier/supprimer), gérer ses absences, rédiger et modifier des articles et catégories de blog, consulter la liste des utilisateurs, et répondre aux conversations. N'a pas accès aux fiches chats, aux tarifications ni à la gestion des rôles.
- **Admin** : accès complet, incluant la suppression d'articles/catégories, la gestion des tarifications, l'attribution des rôles utilisateurs (`Admin`/`Volunteer`/`User`), la désactivation des délégations d'absence, et les pages `/dashboard/cats`, `/dashboard/users`, `/dashboard/analytics`, `/dashboard/tarifications`, `/dashboard/settings` côté Frontend (routes avec `meta.requiredRoles: [Roles.ADMIN]`).

La matrice précise des permissions attribuées à chaque rôle par action Strapi (find/create/update/delete par content-type) est définie dans `Backend/src/index.ts` (constante `PERMISSIONS_BY_ROLE`) et appliquée automatiquement à chaque démarrage du serveur, à condition que les rôles existent déjà (voir installation ci-dessus).

Deux policies Strapi complètent ce système par ailleurs :

- `is-admin` (`Backend/src/policies/is-admin.ts`) : réserve une route au rôle `Admin` exclusivement.
- `is-blog-editor` (`Backend/src/policies/is-blog-editor.ts`) : réserve une route aux rôles `Admin` et `Volunteer` par défaut, personnalisable via une option `roles` passée à la policy.

Côté Frontend, `Frontend/src/router/routes.ts` bloque au niveau des routes l'accès à `/dashboard/cats`, `/dashboard/tarifications`, `/dashboard/users`, `/dashboard/analytics` et `/dashboard/settings` pour tout rôle autre que `Admin` (redirection vers la page "accès refusé"). `Frontend/src/components/AdminAppNavBar.vue` masque en plus le lien de navigation vers le blog aux `Volunteer` dans le menu, sans bloquer la route elle-même : un lien direct vers `/dashboard/blog` reste accessible à un `Volunteer`.

## Modèle de données (Backend)

Content-types Strapi principaux, sous `Backend/src/api/` :

- `cat-sheet` / `cat` / `cat-mood` : fiches d'adoption (une fiche peut regrouper plusieurs chats en duo), avec leurs traits de caractère et humeurs.
- `adoption-request` : demandes d'adoption déposées par les utilisateurs.
- `chat-conversation` / `chat-message` : messagerie entre un utilisateur et un bénévole au sujet d'une fiche chat.
- `blog-post` / `blog-category` : articles et catégories du blog.
- `absence` / `absence-delegation` : gestion des absences des bénévoles et délégation associée.
- `tarification` : grilles tarifaires liées aux adoptions.

Trois API sous `src/api/` sont des contrôleurs personnalisés sans content-type associé (pas de schéma, pas d'entrée dans le Content Manager) :

- `user-profile` : expose une route `me` renvoyant l'utilisateur authentifié avec son rôle peuplé.
- `user-role` : liste les bénévoles disponibles, les rôles assignables (`Admin`/`Volunteer`/`User`), et permet à un `Admin` de changer le rôle d'un utilisateur.
- `newsletter` : gère le lien de désinscription de la newsletter envoyé par e-mail (`newsletterOptIn` porté directement par l'utilisateur Strapi, pas de content-type dédié).

## Tests (Frontend)

Le Backend n'a pas de suite de tests à ce jour. Le Frontend dispose de deux suites, à lancer depuis `Frontend/` :

```shell
npm run test:unit        # Vitest (unitaire), fichiers dans tests/unit/
npm run test:unit:watch  # idem, en mode watch
```

```shell
npm run dev          # dans un premier terminal
npm run test:e2e     # Cypress en headless, dans un second terminal
npm run cypress:open # même chose en mode interactif
```

Les tests Cypress (`Frontend/cypress/e2e/`) mockent systématiquement les appels réseau via `cy.intercept` : ils ne nécessitent pas que le Backend Strapi tourne, seul le serveur de développement Vite doit être démarré.

## Scripts npm utiles

Backend (`Backend/package.json`) :

| Script                            | Effet                                                                 |
| --------------------------------- | --------------------------------------------------------------------- |
| `npm run dev` / `npm run develop` | Démarre Strapi avec rechargement automatique                          |
| `npm run start`                   | Démarre Strapi sans rechargement automatique (mode proche production) |
| `npm run build`                   | Build l'admin Strapi                                                  |

Frontend (`Frontend/package.json`) :

| Script                                 | Effet                                                           |
| -------------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                          | Serveur de développement Vite                                   |
| `npm run build`                        | Vérification TypeScript (`vue-tsc -b`) puis build de production |
| `npm run type-check`                   | Vérification TypeScript seule                                   |
| `npm run format`                       | Formatage Prettier de `src/`                                    |
| `npm run test:unit`, `test:unit:watch` | Tests unitaires Vitest                                          |
| `npm run test:e2e`, `cypress:open`     | Tests end-to-end Cypress                                        |

## Autres ressources

`Docs/` contient les maquettes d'écrans et un cahier des charges (`INFOS_CHATS_Fiche_d.docx`) utilisés en amont du développement
