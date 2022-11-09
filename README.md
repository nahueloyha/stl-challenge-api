# Sample API project

## Requirement

Build:

- node 16

Runtime:

- node 16
- PostgreSQL (12 or higher)

## Build & Run

```sh
npm ci
npm run build
```

Build artifacts stored in `dist` directory.

Run:

```sh
node dist/index.js
```

The webui can be access from `/graphiql`. Like: http://127.0.0.1:3006/graphiql

## Environment Variables

Avaliable environment variables:

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

You can change these environment variables to suit your environment.
