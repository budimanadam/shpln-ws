import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';
import { callApi } from '~/utils/apiJubelio';
import { validate, login } from '~/utils/validate';

export const postBillReceive = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    try {
        rep.code(200).send({"status":"ok"});   
    } catch (error) {
        throw error;
    }
}