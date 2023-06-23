import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';

export const postSalesOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    rep.code(200).send({"code":"SUCCESS"});
}

export const postReturnOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    rep.code(200).send({"code":"SUCCESS"});
}