import { callApi } from '~/utils/apiJubelio';

const validate = async (req) => {
    const accountNo = req.body.account_no || req.query.id;
    const tenant = await req.systemDb.oneOrNone(`select * from tenant_warehouse tw where tw.extra_info ->> 'account_no' = $1`, [accountNo]);

    if (!tenant) {
        return {result: false, error: 'Tenant not found'};
    }
    req.tenant = tenant;
    let token = tenant.extra_info.jubelioToken;

    let resultLogin: any;
    if (!token) {
        resultLogin = await login(req);
        token = resultLogin.token;
    }
    return {result: true, error: '', token};
}

const login = async (req) => {
    const resultLogin = await callApi(req, 'POST', {email: req.tenant.channel_user_id, password: req.tenant.channel_user_secret}, '/login');
    const info = req.tenant.extra_info;
    info.jubelioToken = resultLogin.token;
    
    await req.systemDb.query(`update tenant_warehouse
    set extra_info = $1::jsonb
    where tenant_id = $2`, [ info, req.tenant.tenant_id]);
    return resultLogin.token;
}

export { validate, login };