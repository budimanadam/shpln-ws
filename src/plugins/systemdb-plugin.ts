import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

import { PgSysDb } from '../db/pg-helper';

declare module 'fastify' {
  interface FastifyRequest {
    systemDb: pgPromise.IDatabase<{}, IClient>;
  }
}

const dbPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.addHook('onRequest', (req: FastifyRequest, _rep, hookDone) => {
    req.systemDb = PgSysDb;
    hookDone();
  });
  done();
};

export default fp(dbPlugin, '3.x');
