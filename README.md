# API Système Leitner

Ce projet implémente le backend d'une application d'apprentissage basée sur le système Leitner, utilisant Node.js, Express et l'Architecture Hexagonale.

## Architecture

Le projet suit les principes de **l'Architecture Hexagonale (Ports & Adapters)** et du **Domain-Driven Design (DDD)**.

- **Domaine (`src/domain`)** : Contient la logique métier centrale (Entités, Objets de Valeur, Ports). Il n'a AUCUNE dépendance vers les couches extérieures.
- **Application (`src/application`)** : Contient les Cas d'Utilisation qui orchestrent la logique du domaine.
- **Infrastructure (`src/infrastructure`)** : Contient les adaptateurs pour les préoccupations externes (API Web, Persistance).

## Prérequis

- Node.js
- npm

## Installation

```bash
npm install
```

## Démarrer le Serveur

```bash
npm start
```

Le serveur démarrera sur `http://localhost:8080`.

## Lancer les Tests

Pour lancer tous les tests (Unitaires & Intégration) avec la couverture :

```bash
npm test -- --coverage
```

## Endpoints API

- **GET /cards** : Récupérer toutes les cartes (paramètre de requête optionnel `tags`).
- **POST /cards** : Créer une nouvelle carte.
- **GET /cards/quizz** : Récupérer les cartes à réviser (paramètre de requête optionnel `date`).
- **PATCH /cards/:cardId/answer** : Soumettre une réponse (`isValid`: booléen).

## Choix de Conception

- **Architecture Hexagonale** : Pour découpler la logique métier du framework et de la base de données.
- **Repository en Mémoire** : Simule une base de données pour cet exercice. Peut être facilement remplacé par un adaptateur de base de données réelle.
- **Objets de Valeur** : `Category` gère la logique des intervalles Leitner.
