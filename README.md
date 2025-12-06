# Leitner System API

This project implements a Leitner System learning application backend using Node.js, Express, and Hexagonal Architecture.

## Architecture

The project follows **Hexagonal Architecture (Ports & Adapters)** and **Domain-Driven Design (DDD)** principles.

- **Domain (`src/domain`)**: Contains the core business logic (Entities, Value Objects, Ports). It has NO dependencies on outer layers.
- **Application (`src/application`)**: Contains Use Cases that orchestrate the domain logic.
- **Infrastructure (`src/infrastructure`)**: Contains adapters for external concerns (Web API, Persistence).

## Prerequisites

- Node.js (v14+ recommended)
- npm

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:8080`.

## Running Tests

To run all tests (Unit & Integration) with coverage:

```bash
npm test -- --coverage
```

## API Endpoints

- **GET /cards**: Get all cards (optional `tags` query param).
- **POST /cards**: Create a new card.
- **GET /cards/quizz**: Get cards due for review (optional `date` query param).
- **PATCH /cards/:cardId/answer**: Submit an answer (`isValid`: boolean).

## Design Choices

- **Hexagonal Architecture**: To decouple business logic from the framework and database.
- **In-Memory Repository**: Simulates a database for this exercise. Can be easily swapped with a real DB adapter.
- **Value Objects**: `Category` handles the Leitner interval logic.
