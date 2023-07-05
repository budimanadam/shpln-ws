import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';
import { callApi } from '~/utils/apiJubelio';
import { callApiOneWH } from '~/utils/apiOnewarehouse';
import { validate, login } from '~/utils/validate';

export const postBillReceive = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    try {
        const body: any = req.body;
        const val = await validate(req);
        if (!val.result) rep.code(500).send({'error': val.error});
        req.token = val.token;
        let resultGetBill = await callApi(req, 'GET', {}, `/purchase/bills/${body.bill_id}`);
        if (resultGetBill && resultGetBill.message && (resultGetBill.message.includes('Missing authentication') || resultGetBill.message.includes('Invalid credentials') || resultGetBill.message.includes('Invalid token'))) {
            await login(req);
            resultGetBill = await callApi(req, 'GET', {}, `/purchase/bills/${body.bill_id}`);
        }

        let resultGetPO = await callApi(req, 'GET', {}, `/purchase/orders/${resultGetBill.purchaseorder_id}`);
        if (resultGetPO && resultGetPO.message && (resultGetPO.message.includes('Missing authentication') || resultGetPO.message.includes('Invalid credentials') || resultGetPO.message.includes('Invalid token'))) {
            await login(req);
            resultGetPO = await callApi(req, 'GET', {}, `/purchase/orders/${resultGetBill.purchaseorder_id}`);
        }

        const payload = {
            inbound_order_id: resultGetPO.purchaseorder_no,
            unique_key: `${resultGetPO.purchaseorder_id}11`,
            inbound_status: 'completed',
            details: []
        };
        
        resultGetPO.items.forEach(item => {
            payload.details.push({
                sku_id: item.item_code,
                qty_good: parseInt(item.qty_in_base)
            });
        });

        let resultPushBill = await callApiOneWH(req, 'POST', payload, `/v20210901/onewarehouse/inbound/callback/abstock`);
        rep.code(200).send({"status":"ok"});   
    } catch (error) {
        return error;
    }
}