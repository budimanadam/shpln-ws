import { FastifyReply, FastifyRequest } from "fastify";
import { PgSysDb, tenantDb } from '../../db/pg-helper';
import { validate, login } from '~/utils/validate';
import { callApi } from '~/utils/apiJubelio';

export const postProduct = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    try {
        const body: any = req.body;
        const val = await validate(req);
        if (!val.result) rep.code(500).send({'error': val.error});
        
        req.token = val.token;

        const payload = {
            "item_group_id": 0,
            "item_group_name": body.sku_name,
            "uom_id": -1,
            "description": "semi-synthetic lubricant for 4-stroke motorcycles that ensures",
            "sell_this": true,
            "buy_this": true,
            "stock_this": true,
            "buy_price": 0,
            "min": 0,
            "max": 0,
            "sell_price": 0,
            "sell_tax_id": -1,
            "sales_acct_id": 28,
            "buy_tax_id": -1,
            "invt_acct_id": 4,
            "cogs_acct_id": 30,
            "purch_acct_id": null,
            "sell_unit": "Buah",
            "rop": 20,
            "lead_time": 0,
            "store_priority_qty_treshold": 2,
            "images": [],
            "variation_images": [],
            "use_serial_number": false,
            "use_batch_number": false,
            "brand_id": null,
            "dropship_this": false,
            "is_active": true,
            "item_category_id": 454,
            "package_content": null,
            "package_weight": body.weight,
            "package_height": body.height,
            "package_width": body.width,
            "package_length": body.length,
            "variations": [
            {}
            ],
            "brand_name": body.brand || 'Brand',
            "product_skus": [
            {
                "item_id": 0,
                "item_code": body.sku_id,
                "variation_values": [],
                "sell_price": null,
                "buy_price": 0,
                "barcode": body.barcode,
                "is_consignment": false
            }
            ],
            "unlimited_stock_store_ids": null,
            "use_single_image_set": false,
            "buy_unit": "Buah"
        }
        
        const result = await callApi(req, 'POST', payload, '/inventory/catalog/');
        
        if (result && result.message && (result.message.includes('Missing authentication') || result.message.includes('Invalid credentials') || result.message.includes('Invalid token'))) {
            await login(req);
            await callApi(req, 'POST', payload, '/inventory/catalog/');
        }
        rep.code(200).send({"code":"SUCCESS"});
        } catch (error) {
            throw error;
        }
}