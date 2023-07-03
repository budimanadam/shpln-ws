import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { postBillReceive } from './handler';

const services: FastifyPluginAsync = async (fastify, options) => {
  fastify.route({
    url: '/bill-receive',
    method: 'POST',
    handler: postBillReceive,
  });
};

// export plugin using fastify-plugin
export default fp(services, '3.x');
