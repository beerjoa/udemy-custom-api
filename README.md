<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p> -->

<p align="center">
  Udemy Custom API
</p>

<p align="center">
  <a href="https://github.com/beerjoa/udemy-custom-api/blob/main/package.json" target="_blank"><img src="https://img.shields.io/github/package-json/v/beerjoa/udemy-custom-api" alt="NPM Version" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api" target="_blank"><img src="https://img.shields.io/github/languages/top/beerjoa/udemy-custom-api" alt="Package License" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api/commits/main" target="_blank"><img src="https://img.shields.io/github/last-commit/beerjoa/udemy-custom-api" alt="Github Last Commit" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api/actions/workflows/lint-commit-and-test.yml" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/beerjoa/udemy-custom-api/lint-commit-and-test.yml" alt="Github Action" /></a>
  <a href="https://cudm.beerjoa.dev/api-docs" target="_blank"><img alt="Swagger Validator" src="https://img.shields.io/swagger/valid/3.0?specUrl=https%3A%2F%2Fcudm.beerjoa.dev%2Fapi-docs-json"/></a>
  <a href="https://github.com/beerjoa/udemy-custom-api/blob/main/LICENSE.md" target="_blank"><img src="https://img.shields.io/github/license/beerjoa/udemy-custom-api" alt="Package License" /></a>
  <!-- <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a> -->
</p>

## Description

A TypeScript and Nest.js based API for Udemy Custom API.

As a Udemy student, I created a custom API to get information about the course and discount information on the course I want to take. I plan to add more features to this API in the future.

I deployed the API using [Render](https://render.com/docs) and [Docker](https://www.docker.com/). If you want to learn more about how to deploy with Render and Docker, you can check out the [documentation](https://render.com/docs/deploy-an-image).

## Features

### Developer experience

- **Easy Setup**: Containerized using Docker, making setting up a consistent development environment accessible.
- **Modern Technologies**: Uses [Nest.js](https://nestjs.com/) and [TypeScript](https://www.typescriptlang.org/) to provide an easy-to-use, easy-to-read, and efficient development experience.
- **Coding Standards**: Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to ensure consistent code style.
- **Commit Conventions**: Uses [Commitlint](https://commitlint.js.org/#/) and [Husky](https://typicode.github.io/husky/#/) to ensure consistent commit style.
- **Automated Tests**: Uses [Jest](https://jestjs.io/) for unit test.
- **Documentation**: Uses [Swagger](https://swagger.io/) for API documentation. \
  You can check the [Documentation](https://cudm.beerjoa.dev/api-docs) for more information about API.

## Getting Started

This is an example of how to set up the project.

### Requirements

- [Node.js](https://nodejs.org/en/) (v18.17.1)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

#### Local

```bash
$ npm install
```

#### Docker

```bash
## Use docker compose command like below.
## `npm run docker -- ~` or `npm run docker:debug -- ~`
$ npm run docker:debug -- build
```

### Running the app

```bash
# development mode with watch
$ npm run start:dev

# debug mode
## without docker
$ npm run start:debug

## with docker
$ npm run start:debug:docker

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## License

This project is [MIT licensed](LICENSE.md).
