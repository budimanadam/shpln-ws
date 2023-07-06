import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';
import { callApi } from '~/utils/apiJubelio';
import { validate, login } from '~/utils/validate';

export const postPurchaseOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    try {
        const body: any = req.body;
        const val = await validate(req);
        if (!val.result) rep.code(500).send({'error': val.error});
        req.token = val.token;
        const date = new Date;
        const payload = {
            purchaseorder_id: 0,
            purchaseorder_no: body.inbound_short_id,
            transaction_date: date.toISOString(),
            contact_id: -1,
            supplier_name: 'ABS',
            source: 1,
            location_id: -1,
            sub_total: 0,
            total_disc: 0,
            total_tax: 0,
            grand_total: 0,
            is_tax_included: false,
            items: []
        }

        await Promise.allSettled(body.details.map(async (item) => {
            let currItem: any = [];
            
            const jubeItem: any = await callApi(req, 'GET', '', `/inventory/items/by-sku/${item.sku_id}`);
            await jubeItem.product_skus.forEach((i: { item_code: any; }) => {
                if (i.item_code.toString() === item.sku_id.toString()) {
                    currItem.push(i);
                };
            });
            payload.items.push({
                purchaseorder_detail_id: 0,
                item_id: currItem[0].item_id,
                qty_in_base: item.qty,
                unit: 'Buah',
                location_id: -1,
                disc: 0,
                disc_amount: 0,
                tax_amount: 0,
                price: 0,
                tax_id: 1,
                amount: 1
            });
        }));
    
        const result = await callApi(req, 'POST', payload, '/purchase/orders/');

        if (result && result.message && (result.message.includes('Missing authentication') || result.message.includes('Invalid credentials') || result.message.includes('Invalid token'))) {
            await login(req);
            await callApi(req, 'POST', payload, '/purchase/orders/');
        }
        rep.code(200).send({"code":"SUCCESS"});   
    } catch (error) {
        throw error;
    }
}