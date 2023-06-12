import 'dotenv/config';
import { fastify, FastifyInstance } from 'fastify';
import { } from 'fastify-qs';
import Ajv from 'ajv';

// import autoLoad from 'fastify-autoload'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'
import * as _ from '@fastify/jwt';
import autoLoad from '@fastify/autoload';
import { join } from 'path';
import 'dotenv/config';

import config from './config';
import os from 'os';

const server = fastify();

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  strict: false,
  allErrors: true,
});

server.get('/health', async (req, rep) => {
  return 'Healthy';
});

// register all modules
server.register(autoLoad, {
  dir: join(__dirname, 'modules'),
});

server.register(require('fastify-qs'));

server.setValidatorCompiler(({ schema }): any => {
  return ajv.compile(schema);
});

server.setSchemaErrorFormatter((error, dataVar): any => {
  return {
    message: 'Bad Request',
    code: 'VAL_ERR',
  };
});

server.addHook('preSerialization', (request, reply, _payload, done) => {
  reply.header('request_id', request.request_id);
  done();
});


function getCpuUsage() {
  const cpuInfo = os.cpus();
  let idleMs = 0;
  let totalMs = 0;

  cpuInfo.forEach((core) => {
    for (let type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });
  const idlePercentage = 100 * (idleMs / totalMs);
  const usagePercentage = 100 - idlePercentage;

  return usagePercentage.toFixed(3);
}

server.register(require('@fastify/cors'), {

  origin: ['http://localhost:3001'],

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  credentials: true,

});

server.addHook('onRequest', (request, _reply, done) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}.${now.getMilliseconds().toString().padStart(3, '0')}`;

  const usedMemory = os.totalmem() - os.freemem()
  const memoryPercent = Math.round((usedMemory / os.totalmem()) * 100 * 100) / 100;

  const info = {
    request_id: request.request_id,
    route: `[${request.method}] ${request.url}`,
    hostname: os.hostname(),
    cpu_usage: `${getCpuUsage()}%`,
    mem_usage: `${memoryPercent}%`,
    start_time: time
  }

  done();
})

server.addHook('onResponse', (request, _reply, done) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}.${now.getMilliseconds().toString().padStart(3, '0')}`;

  const usedMemory = os.totalmem() - os.freemem()
  const memoryPercent = Math.round((usedMemory / os.totalmem()) * 100 * 100) / 100;

  const info = {
    request_id: request.request_id,
    route: `[${request.method}] ${request.url}`,
    hostname: os.hostname(),
    cpu_usage: `${getCpuUsage()}%`,
    mem_usage: `${memoryPercent}%`,
    end_time: time
  }
  done();
})

server.setErrorHandler(function (error, request, reply) {
  // Send error response
  delete error.statusCode;
  delete error.validation;
  delete error.name;
  reply.send({ ...error });
});

server.listen(process.env.PORT || 3001, '0.0.0.0', (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`server listening at ${address}`);
});

export const build: FastifyInstance = server;
