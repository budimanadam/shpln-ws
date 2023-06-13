import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';

export const postSalesOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    // const system = await PgSysDb.oneOrNone(`select `);
    rep.code(200).send({"code":"SUCCESS"});
}