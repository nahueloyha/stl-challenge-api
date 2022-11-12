# Smart Token Labs - API

![Logo](https://cdn-images-1.medium.com/max/1320/1*sIaWPuUDRyDZRnnWdgKZ2g@2x.png)

## Description

...

## Stack

...

## Environments

There are currently two enviroments, deployed in the Edrans Corp Tools AWS Account (825248816400) but on different VPCs:

- Stage: deployed in the _critical_ VPC and accesible under [edrans.com](edrans.com)
- Prod: deployed in the _noncritical_ and accesible under [stg.edrans.net](stg.edrans.net)

## Requirements

Build:

- node 16

Runtime:

- node 16
- PostgreSQL (12 or higher)

## Build

1. Export the required STAGE/TENANT, for example: `export STAGE=prd && export TENANT=air`
2. Build the image: `docker build -f utils/Dockerfile.apache -t uvod-api:latest .`
3. Run the image: `docker run -p 80:80 --env-file .env uvod-api:latest`

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

## Deploy 

...

CI/CD is configured via Terraform using CodeBuild and CodePipeline, as you can check [HERE](https://github.com/Arielmatz/terraform-scripts/blob/master/common/uvod-api-cicd.tf).

Deployments are triggered automatically after a push to the `pixellot-version-stg` branch.

## Configuration

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
