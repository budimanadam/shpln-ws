import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { postCancelInbound } from './handler';

const services: FastifyPluginAsync = async (fastify, options) => {
  fastify.route({
    url: '/cancel-inbound',
    method: 'POST',
    handler: postCancelInbound,
  });
};

// export plugin using fastify-plugin
export default fp(services, '3.x');
