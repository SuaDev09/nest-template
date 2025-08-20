# Nest Template

This repository provides a starter template for building applications with [NestJS](https://nestjs.com/). Below you'll find an explanation of each directory ("carpet"), and instructions on how to run and build the project.

---

## Directory Structure

- **src/**  
  This is the main source code directory for the NestJS application. All modules, controllers, services, and application logic are placed here.

- **test/**  
  Contains testing files and specifications. Use this folder to write unit and integration tests for your application.

- **.env**  
  Environment variables for configuring your application (database credentials, ports, etc.).

- **Configuration Files**  
  - `.eslintrc.js`, `.prettierrc`: Linting and formatting rules.
  - `nest-cli.json`: Nest CLI configuration.
  - `package.json`: Project metadata, dependencies, and scripts.
  - `tsconfig*.json`: TypeScript configuration files for main code and tests.

---

## Running the Project

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the application in development mode:**
   ```sh
   npm run start:dev
   ```
   This starts the server with hot-reloading.

3. **Run the application in production mode:**
   ```sh
   npm run build
   npm run start:prod
   ```

---

## Building the Project

To build the application for production:

```sh
npm run build
```

The compiled JavaScript files will be generated in the `dist/` directory.

---

## Testing

Run the tests using:

```sh
npm run test
```

Other useful test scripts can be found in `package.json` (e.g., `test:watch`, `test:cov` for coverage).

---

## Notes

- Edit the `.env` file to set your environment variables.
- Follow the code style guidelines enforced by ESLint and Prettier.

For more details, refer to the official [NestJS documentation](https://docs.nestjs.com/).