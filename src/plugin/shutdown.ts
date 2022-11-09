import {FastifyPluginAsync} from 'fastify';

const shutdown: FastifyPluginAsync = async server => {
  process.on('SIGINT', () => server.close());
  process.on('SIGTERM', () => server.close());
};

export default shutdown;
