<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p> -->

<p align="center">
  Udemy Custom API.
</p>

<p align="center">
  <a href="https://github.com/beerjoa/udemy-custom-api/blob/main/package.json" target="_blank"><img src="https://img.shields.io/github/package-json/v/beerjoa/udemy-custom-api" alt="NPM Version" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api" target="_blank"><img src="https://img.shields.io/github/languages/top/beerjoa/udemy-custom-api" alt="Package License" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api/commits/main" target="_blank"><img src="https://img.shields.io/github/last-commit/beerjoa/udemy-custom-api" alt="Github Last Commit" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api/actions/workflows/lint-commit-and-test.yml" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/beerjoa/udemy-custom-api/lint-commit-and-test.yml" alt="Github Action" /></a>
  <a href="https://github.com/beerjoa/udemy-custom-api/blob/main/LICENSE.md" target="_blank"><img src="https://img.shields.io/github/license/beerjoa/udemy-custom-api" alt="Package License" /></a>
  <!-- <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a> -->
</p>

## Description

A TypeScript and Nest.js based API for Udemy Custom API.

As a Udemy student, I wanted to make a custom API for my own use. I made this API to get information about the course and discount information on the course I want to take.

I will continue to add some features to this API.

## Getting Started

This is an example of how to set up the project.

### Requirements

- [Node.js](https://nodejs.org/)
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

Nest is [MIT licensed](LICENSE).
