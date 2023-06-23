import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import shortUUID from 'short-uuid';

declare module 'fastify' {
  interface FastifyRequest {
    request_id: string;
    token: string;
  }
}

const generateRequestID: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.decorateRequest('request_id', shortUUID.generate());
  done();
};

export default fp(generateRequestID, '3.x');
