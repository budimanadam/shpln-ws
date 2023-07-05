import crypto from 'crypto';
import { HmacSHA256, enc } from "crypto-js";
import axios, { AxiosResponse } from 'axios';
import config from '../config';

interface iOptions {
    params?: any;
    data?: any;
    url: string;
    method: string;
    json: boolean;
    headers: any;
}

const callApiOneWH = async (request, method, params, uri) => {
    const appKey = request.tenant.extra_info.appkey;
    const secret = request.tenant.extra_info.secret;
    const options: iOptions = {
      url: `${config.ONEWH_API}${uri}`,
      method,
      json: true,
      headers: {
        'appkey': appKey,
        'sign': '',
        'timestamp': ''
      }
    }
    if (method === 'GET') {
      options.params = params;
    } else {
      options.data = params;
    }

    let parameter = {
      appkey: appKey,
      timestamp: null,
      sign: '',
      'Content-Type': 'application/json'
    };

    parameter.timestamp = new Date().getTime();

    const signature = HmacSHA256(`${JSON.stringify(options.data)}${parameter.timestamp}`, secret);
    
    const data = { ...parameter };
    data.sign = signature;
    
    options.headers = data;
    
    const resultCallApi = await request.systemDb.query(`
      INSERT INTO log (request, log_date, record_name)
      VALUES ($1, now(), 'jubelio-api')
      returning log_id
    `, [options]);
    
    const result: AxiosResponse = await axios(options).catch((error => {
      return error.response;
    }));
    await request.systemDb.query(`
      UPDATE log
      SET response = $1
      WHERE log_id = $2
    `, [result.data, resultCallApi[0].log_id]);
    return result.data;
  };

export { callApiOneWH };
