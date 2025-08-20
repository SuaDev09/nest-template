# 📦 Project Structure Overview
This repository provides a starter template for building applications with [NestJS](https://nestjs.com/). Below you'll find an explanation of each directory ("carpet"), and instructions on how to run and build the project.

## 📁 Folders

### `src`
- The main source code directory.

#### └── `common` 🧩
- **constants/**: 📏 Reusable constants and values.
- **filters/**: 🧹 Request/response filters, like error handling or validation.
- **loggers/**: 📝 Logging utilities and configurations.
- **models/**: 📄 Data models and interfaces.

#### └── `config` ⚙️
- **middleware/**: 🪝 Custom middleware functions for request processing.
- **mssql/**: 💾 Database configuration and utilities for MSSQL.

#### └── `controllers` 🚦
- Main controllers for handling routes and business logic.

##### └── `projects` 🗂️
- **dto/**: 📦 Data Transfer Objects (DTOs) for data validation and typing.
- **entities/**: 🧬 Entity definitions, often mapping to database tables.
- **helpers/**: 🛠️ Utility/helper functions for the project controller.
- **tests/**: 🧪 Unit/integration tests for the project feature.
- **transformers/**: 🔄 Functions for data transformation or mapping.
- **utils/**: 🛠️ General utilities for the projects module.

---

## 🗂️ Key Files (by Type)

### Controllers & Services
- **projects.controller.ts** ⚙️  
  Handles incoming HTTP requests related to projects.

- **projects.dao.service.ts** 🔥  
  Data Access Object service for interacting with the database.

- **projects.module.ts** 📦  
  Module definition (groups controllers, services, etc.).

- **projects.service.ts** 🔥  
  Core service logic for the projects feature.

- **app.module.ts** 📦  
  Root application module, sets up the app.

- **main.ts** 🚀  
  Application entry point (bootstraps the app).

---

### `test` 🧪
- Test files and test configuration.

---

### Root Configuration Files

- **.env** 🌱  
  Environment variables.

- **.eslintrc.js** 🧹  
  ESLint configuration for code quality.

- **.gitignore** 🙈  
  Files/folders to exclude from Git.

- **.prettierrc** 🎨  
  Prettier configuration for code formatting.

- **nest-cli.json** 🏗️  
  NestJS CLI configuration.

- **package.json** 📦  
  Project dependencies and scripts.

- **package-lock.json** 📦  
  Exact versions of dependencies.

- **README.md** 📖  
  This file.

- **tsconfig.build.json** ⚒️  
  TypeScript configuration for builds.

- **tsconfig.build.test.json** ⚒️  
  TypeScript config for test builds.

- **tsconfig.json** ⚒️  
  Main TypeScript configuration.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

- Copy `.env.example` to `.env` and fill out required variables (if `.env.example` exists, otherwise create `.env` with your settings).

---

## 🏃 Running the Project

### Development Mode

```bash
npm run start:dev
```
- Starts the server in development mode with auto-reload.

### Production Mode

```bash
npm run build:prod
npm run start:prod
```
- Builds and runs the application with production settings.

### Test Mode

```bash
npm run build:test
npm run start:test
```
- Builds and starts the application using the test configuration.

---

## 🛠️ Useful Commands

| Command                     | What it does                                                           |
|-----------------------------|------------------------------------------------------------------------|
| `npm run build`             | Build the project (default build config)                               |
| `npm run build:prod`        | Build for production (`NODE_ENV=prod`)                                 |
| `npm run clean`             | Remove the `dist` directory                                            |
| `npm run build:test`        | Clean, then build for testing (`NODE_ENV=test`)                        |
| `npm run start`             | Start the app (default config)                                         |
| `npm run start:dev`         | Start in development mode (watch mode)                                 |
| `npm run start:test`        | Start in test mode                                                     |
| `npm run start:prod`        | Start in production mode (from built `dist/`)                          |
| `npm run format`            | Format code using Prettier                                             |
| `npm run lint`              | Lint the code using ESLint                                             |
| `npm run test`              | Run all tests with Jest                                                |
| `npm run test:watch`        | Run tests in watch mode                                                |
| `npm run test:cov`          | Run tests and generate coverage report                                 |
| `npm run test:debug`        | Run tests in debug mode                                                |
| `npm run test:e2e`          | Run end-to-end tests                                                   |

---

## ✨ Quick Legend

| Emoji | Meaning                |
|-------|------------------------|
| 📦    | Module or package      |
| ⚙️    | Configuration/Controller |
| 🧩    | Common/shared stuff    |
| 🧹    | Linting/cleaning       |
| 📏    | Constants              |
| 📝    | Logging                |
| 📄    | Models/schemas         |
| 💾    | Database config        |
| 🪝    | Middleware             |
| 🚦    | Controllers            |
| 🧬    | Entities               |
| 🛠️    | Utilities/helpers      |
| 🔄    | Data transformers      |
| 🔥    | Services/DAO           |
| 🧪    | Testing                |
| 🌱    | Env variables          |
| 🙈    | Git ignore             |
| 🎨    | Formatting             |
| 🏗️    | Build/CLI setup        |
| 🚀    | Entry point            |
| 📖    | Documentation          |
| ⚒️    | TypeScript config      |
