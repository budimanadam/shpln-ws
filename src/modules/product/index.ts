import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { postProduct } from './handler';

const services: FastifyPluginAsync = async (fastify, options) => {
  fastify.route({
    url: '/products',
    method: 'POST',
    handler: postProduct,
  });
};

// export plugin using fastify-plugin
export default fp(services, '3.x');
