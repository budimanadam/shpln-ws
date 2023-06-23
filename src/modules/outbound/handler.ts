import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';

export const postCancelOutbound = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    rep.code(200).send({"code":"SUCCESS"});
}