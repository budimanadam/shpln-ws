import { callApi } from '~/utils/apiJubelio';

const validate = async (req) => {
    const tenant = await req.systemDb.oneOrNone(`select * from tenant_warehouse tw where tw.extra_info ->> 'secret' = $1`, [req.headers.appkey]);
    
    if (!tenant) {
        return {result: false, error: 'Tenant not found'};
    }

    let resultLogin: any;
    if (!tenant.extra_info.token) {
        resultLogin = await callApi(req, 'POST', {email: tenant.channel_user_id, password: tenant.channel_user_secret}, '/login');
        const info = tenant.extra_info;
        info.jubelioToken = resultLogin.token;
        await req.systemDb.query(`update tenant_warehouse
        set extra_info = $1::jsonb
        where tenant_id = $2`, [ info, tenant.tenant_id]);
    }
    return {result: true, error: '', token: resultLogin.token};
}

export { validate };