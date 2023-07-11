import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { postSalesOrder, postReturnOrder, processSalesOrder } from './handler';

const services: FastifyPluginAsync = async (fastify, options) => {
  fastify.route({
    url: '/sales-orders',
    method: 'POST',
    handler: postSalesOrder,
  });

  fastify.route({
    url: '/jubelio/sales-orders',
    method: 'POST',
    handler: processSalesOrder,
  });

  fastify.route({
    url: '/return-order',
    method: 'POST',
    handler: postReturnOrder,
  });
};

// export plugin using fastify-plugin
export default fp(services, '3.x');
