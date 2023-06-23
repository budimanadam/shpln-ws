import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { postCancelOutbound } from './handler';

const services: FastifyPluginAsync = async (fastify, options) => {
  fastify.route({
    url: '/cancel-outbound',
    method: 'POST',
    handler: postCancelOutbound,
  });
};

// export plugin using fastify-plugin
export default fp(services, '3.x');
