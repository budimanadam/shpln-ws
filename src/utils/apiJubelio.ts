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

const callApi = async (request, method, params, uri) => {
  const options: iOptions = {
    url: `${config.JUBELIO_API}${uri}`,
    method,
    json: true,
    headers: {
      'authorization': request.token
    }
  }
  if (method === 'GET') {
    options.params = params;
  } else {
    options.data = params;
  }
  if (uri === '/login') {
    options.url = `${config.JUBELIO_API}${uri}`
    delete options.headers.authorization;
  }

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

export { callApi };