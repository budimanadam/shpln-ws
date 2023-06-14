import createError, { FastifyErrorConstructor } from '@fastify/error'
import { FastifyReply } from 'fastify'
import { FastifySchemaValidationError } from 'fastify/types/schema'

import { logger } from '../utils/logger'

const NotFoundError: FastifyErrorConstructor = createError('NOT_FOUND', 'Error %s not found. ID: %s', 404)

const InputError: FastifyErrorConstructor = createError('ERR_INPUT', 'Error when input', 400)

const InternalServerError: FastifyErrorConstructor = createError('INT_ERR', '%s', 500)

const ValidationError: FastifyErrorConstructor = createError('VAL_ERR', '%s in %s', 400)

const AuthenticationError: FastifyErrorConstructor = createError('AUTH_ERR', '%s', 401)

const ForbiddenError: FastifyErrorConstructor = createError('FORBIDDEN', '%s', 403)

// Error Fastify Route Validator Helper
const SchemaErrorFormatter = (errors: FastifySchemaValidationError[], dataVar: string): Error => {
    let e: any = errors[0];
    const field = e.instancePath.replace('/', '')
        .replace(/^[-_]*(.)/g, (_: any, c: string) => c.toUpperCase())
        .replace(/[-_]+(.)/g, (_: any, c: string) => ' ' + c.toUpperCase());
    
    let message: string = `${field} ${errors[0].message}`
    
    // TODO: check if the enum error then add the values to message
    if (e.keyword === 'enum' && e.params.allowedValues) {
        message += ` : (${e.params.allowedValues.join(', ')})`
    }

    return new ValidationError(message, dataVar);
}

// Error functions below are supposed to handle error in handler level
const CreateError = (message: string, rep: FastifyReply, httpCode: number, code: string, requestId: string, extraInfo?: object): FastifyReply => {
    logger.error(message, { requestId })
    return rep.code(httpCode).send({
        code,
        ...extraInfo,
        message: message
    })
}

export {
    NotFoundError,
    InputError,
    InternalServerError,
    ValidationError,
    AuthenticationError,
    CreateError,
    ForbiddenError,
    SchemaErrorFormatter
}