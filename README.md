# SOREA

SOREA est une plateforme dédiée au bien-être qui propose des essentiels (kits sensoriels, carnets d'ancrage), des séances de coaching personnalisées et une communauté pour apaiser l'esprit et harmoniser le quotidien.

---

## 🛠 Résumé des modifications (Refonte en cours)

Dans le cadre du stage, l'architecture du projet a été intégralement migrée et modernisée :

- **Nouvelle stack unifiée** : Passage sur **Next.js** (App Router) version 16, regroupant frontend et backend au même endroit (adieu à l'ancienne séparation `frontend_old` et `backend_old` qui sont gardés pour l'historique administratif).
- **Base de données (Dev)** : Intégration de l'ORM **Prisma (v5)** avec une base de données locale **SQLite** (`prisma/dev.db`). Le schéma SQL métier complet a été modélisé (utilisateurs, coachings, produits, favoris, commentaires, paniers).
- **Interface & Landing Page** : Le design initial a été drastiquement rafraîchi pour un rendu plus haut de gamme (cartes glassmorphism, typos modernes, loading optimisé des images LCP, design responsive).
- **Jeu de données de test (Seed)** : Un jeu de test complet (seed) a été créé pour alimenter directement la plateforme en faux coachs, avis, sessions, et produits pour faciliter le développement.

---

## 🚀 Lancer le projet en local

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Initialiser la base de données et charger les données de test** :
   *(La base se créera automatiquement dans le dossier `prisma/` avec le faux profil admin et les articles).*
   ```bash
   npm run seed:reset
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   👉 Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🔐 Identifiants de test préconfigurés

Pendant la phase de développement et pour manipuler l'interface, un compte "super-administrateur" et quelques "coachs" factices sont injectés :

- **Email admin** : `admin@sorea.local`
- **Mot de passe** : `soreadmin123`

*(Note : les dossiers `backend_old/`, `frontend_old/` et les fichiers `pointage_*.txt` ne servent plus au fonctionnement de l'application mais sont conservés spécifiquement à titre d'archive pour le stage).*
