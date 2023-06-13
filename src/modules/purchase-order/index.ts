import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { postPurchaseOrder } from './handler';

const services: FastifyPluginAsync = async (fastify, options) => {
  fastify.route({
    url: '/purchase-orders',
    method: 'POST',
    handler: postPurchaseOrder,
  });
};

// export plugin using fastify-plugin
export default fp(services, '3.x');
