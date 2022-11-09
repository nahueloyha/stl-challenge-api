import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';

export default async function apiController(fastify: FastifyInstance) {
  fastify.get('/', indexFunction);
}

async function indexFunction(request: FastifyRequest, reply: FastifyReply) {
  try {
    await reply.code(200).send();
  } catch (err) {
    reply.code(500).send(err);
  }
}
