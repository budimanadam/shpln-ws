import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';
import { validate, login } from '~/utils/validate';
import { callApi } from '~/utils/apiJubelio';
import { callApiOneWH } from '~/utils/apiOnewarehouse';

export const postSalesOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    const body: any = req.body;
    const val = await validate(req);
    if (!val.result) rep.code(500).send({'error': val.error});
    req.token = val.token;
    let now = new Date();
    now.toISOString();
    
    let sub = 0;
    body.details.forEach(item => {
        sub = sub + (item.qty * (item.price / 100));
    });

    const payload = {
        "salesorder_id": 0,
        "salesorder_no": body.order_mc_id,
        "contact_id": -1,
        "customer_name": body.consigneer.consignee_name,
        "transaction_date": now.toISOString(),
        "is_tax_included": false,
        "note": "",
        "sub_total": sub,
        "total_disc": 0,
        "total_tax": 0,
        "grand_total": sub,
        "ref_no": body.outbound_short_id,
        "location_id": -1,
        "source": 1,
        "is_canceled": false,
        "cancel_reason": "Tidak Punya Uang",
        "cancel_reason_detail": "Tidak Punya Uang",
        "channel_status": "Paid",
        "shipping_cost": 0,
        "insurance_cost": 0,
        "is_paid": true,
        "shipping_full_name": body.consigneer.consignee_name,
        "shipping_phone": body.consigneer.consignee_phone || body.consigneer.consignee_mobile,
        "shipping_address": body.consigneer.consignee_address,
        "shipping_area": body.consigneer.consignee_district,
        "shipping_city": body.consigneer.consignee_city,
        "shipping_subdistrict": body.consigneer.consignee_district,
        "shipping_province": body.consigneer.consignee_province,
        "shipping_country": "Indonesia",
        "add_disc": 0,
        "add_fee": 0,
        "salesmen_id": null,
        "store_id": null,
        "payment_method": null,
        "items": []
    };

    await Promise.allSettled(body.details.map(async (item) => {
        let currItem: any = [];
        
        const jubeItem: any = await callApi(req, 'GET', '', `/inventory/items/by-sku/${item.sku_id}`);
        await jubeItem.product_skus.forEach((i: { item_code: any; }) => {
            if (i.item_code.toString() === item.sku_id.toString()) {
                currItem.push(i);
            };
        });
        payload.items.push({
            salesorder_detail_id: 0,
            item_id: currItem[0].item_id,
            qty_in_base: item.qty,
            tax_id: 1,
            price: (item.price / 100),
            unit: "Buah",
            disc: 0,
            disc_amount: 0,
            tax_amount: 0,
            amount: item.qty * (item.price / 100),
            location_id: -1,
            shipper: body.logistics.express_type,
            tracking_no: body.logistics.express_id
        });
    }));


    const result = await callApi(req, 'POST', payload, '/sales/orders/');

    if (result && result.message && (result.message.includes('Missing authentication') || result.message.includes('Invalid credentials') || result.message.includes('Invalid token'))) {
        await login(req);
        await callApi(req, 'POST', payload, '/sales/orders/');
    }
    
    rep.code(200).send({"code":"SUCCESS"});
}

export const processSalesOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    const body: any = req.body;
    const val = await validate(req);
    if (!val.result) rep.code(500).send({'error': val.error});
    req.token = val.token;

    const payload = {
        outbound_order_id: body.ref_no,
        unique_key: `${body.ref_no}11`,
        outbound_status: 'completed',
        details: [{express_details: []}],
        logistics_status: 'delivered',
        imei_list: []
    };
    
    body.items.forEach(item => {
        payload.imei_list.push({
            sku_id: item.item_code,
            imeis: [item.item_code]
        });
    });

    body.items.forEach(item => {
        payload.details[0].express_details.push({
            sku_id: item.item_code,
            qty_actual: parseInt(item.qty_in_base)
        });
    });

    let resultPushBill = await callApiOneWH(req, 'POST', payload, `/v20210901/onewarehouse/outbound/callback/abstock`);
    rep.code(200).send({"status":"ok"});
}

export const postReturnOrder = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    rep.code(200).send({"code":"SUCCESS"});
}