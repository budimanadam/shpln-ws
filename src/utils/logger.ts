import winston from 'winston';
import Transports from 'winston-transport';
import { ElasticsearchTransport, ElasticsearchTransportOptions } from 'winston-elasticsearch';
import config from '../config';

const { combine, printf } = winston.format;

const format: winston.Logform.Format = printf(({ level, message, timestamp, requestId }, ...rest) => {
  let log = `${new Date(timestamp).toISOString()} ${level}: ${message}`;
  if (requestId) {
    log += ' RequestId: ' + requestId;
  }
  return log;
});

const transportsConfig: Transports[] = [
  new winston.transports.Console({
    format: combine(winston.format.timestamp(), winston.format.align(), format),
  }),
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.File({ filename: 'combined.log' }),
];

const logger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',

  format: winston.format.json({}),
  defaultMeta: {
    labels: {
      module: 'default',
    },
    service: 'shpln-ws',
  },
  transports: transportsConfig,
});
let esTransport: ElasticsearchTransport | null;
if (config.ES_LOG_ID && config.ES_API_KEY) {
  const esTransportOpts: ElasticsearchTransportOptions = {
    retryLimit: 2,
    bufferLimit: 500,
    dataStream: true,
    clientOpts: {
      node: config.ES_LOG_NODE,
      auth: {
        apiKey: Buffer.from(`${config.ES_LOG_ID}:${config.ES_API_KEY}`).toString('base64'),
      },
    },
    format: combine(winston.format.timestamp(), winston.format.align(), format),
  };

  esTransport = new ElasticsearchTransport(esTransportOpts);
  logger.add(esTransport);

  logger.on('error', (error) => {
    console.error('Error caught', error);
  });

  esTransport.on('warning', (error) => {
    console.error('Error caught', error);
  });
}

export { logger };
