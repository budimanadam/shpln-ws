import { FastifyReply, FastifyRequest, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import shortUUID from 'short-uuid';
import { logger } from '../utils/logger';

const requestHook: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.addHook('preValidation', (req: FastifyRequest, _rep: FastifyReply, hookDone) => {
    req.request_id = shortUUID.generate();
    const { headers, body, url, method, request_id } = req;
    logger.info({ message: JSON.stringify({ headers, body, url, method }), requestId: request_id });
    const { systemDb } = req;
    systemDb.query(
        `INSERT INTO log (request, log_date)
        VALUES ($1, now());`,
        [{ headers, body, url, method }]
      );
    hookDone();
  });
  done();
};

export default fp(requestHook, '3.x');
