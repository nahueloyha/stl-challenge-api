import cors from '@fastify/cors';
import fastify from 'fastify';
import mercurius from 'mercurius';
import {LOGGER, NODE_ENV} from './constant';
import router from './controller/route';
import shutdown from './plugin/shutdown';
import {schema} from './types/schema';

export async function startApiServer() {
  const FASTIFY_PORT = Number(process.env.FASTIFY_PORT || 3006);
  const FASTIFY_ADDRESS = process.env.FASTIFY_ADDRESS || '127.0.0.1';

  const server = fastify({
    logger: LOGGER,
    trustProxy: true,
  });

  server
    .register(cors)
    .after(err => {
      if (err) {
        console.error(`register plugins failed: ${err.message}`);
        throw err;
      }
    })
    .register(router)
    .register(mercurius, {
      schema,
      path: '/graphql',
      graphiql: NODE_ENV === 'dev',
    })
    .register(shutdown)
    .ready()
    .then(
      () => {
        LOGGER.info('Server successfully booted!');
      },
      err => {
        LOGGER.trace('Server start error', err);
      }
    );

  server.listen({port: FASTIFY_PORT, host: FASTIFY_ADDRESS}).then(() => {
    server.log.info(`🚀  Api Server running on port ${FASTIFY_PORT}`);
  });
}
