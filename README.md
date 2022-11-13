# Smart Token Labs - API

![Logo](https://cdn-images-1.medium.com/max/1320/1*sIaWPuUDRyDZRnnWdgKZ2g@2x.png)

## Description

Repository for the API of the Smart Token Labs challenge.

## Stack

About this API:

- it is made by using [Fastify](https://www.fastify.io/), a web framework for Node.js.
- it comprises a GraphQL server with it's own schema and appropiate resolvers for connecting to a PostgreSQL database.
- it uses [mercurius](https://mercurius.dev/#/) as a GraphQL adapter for Fastify.
- it includes [GrapihQL](https://github.com/graphql/graphiql/tree/main/packages/graphiql), a GraphQL in-browser GUI

## Environments

There are currently two enviroments, deployed on different VPCs, each with it's own API, DB and GraphiQL endpoint:

- Stage: [http://api.stl-stage.nahueloyha.com:3006/graphiql](http://api.stl-stage.nahueloyha.com:3006/graphiql)
- Prod: [http://api.stl-prod.nahueloyha.com:3006/graphiql](http://api.stl-prod.nahueloyha.com:3006/graphiql)

## Requirements

- Node 16
- PostgreSQL (12 or higher)

## Build

1. Install the required NPM dependencies: `npm ci`
2. Compile the typescript files: `npm run build`
3. Stat the API: `node dist/index.js`

## Deploy

Automatic deployment is configured by using [GitHub Actions](https://github.com/nahueloyha/stl-challenge-api/actions), where:

- a pull request opened against any branch on this repo will build and push of the Docker image to the ECR registry
- a commit pushed to any branch on this repo will also build and push of the Docker image to the ECR registry
- a commit pushed to specific `stage` or `prod` branch will, additionally, deploy the built image to the ECS cluster

## Configuration

The following environment variables are available to configure the behaviour of the API:

| Variable        | Description                  | Default   |
| --------------- | ---------------------------- | --------- |
| FASTIFY_ADDRESS | Server listening address     | 127.0.0.1 |
| FASTIFY_PORT    | Server listening port        | 3006      |
| LOG_LEVEL       | Log level                    | debug     |
| DB_HOST         | PostgreSQL database host     | 127.0.0.1 |
| DB_PORT         | PostgreSQL database port     | 5432      |
| DB_USER         | PostgreSQL database username | tf_admin  |
| DB_PASSWORD     | PostgreSQL database password | admin     |
| DB_DATABASE     | PostgreSQL database name     | tf        |