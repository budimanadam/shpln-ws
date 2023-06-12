import pgp from 'pg-promise'
import Promise from 'bluebird'

const pgPromise = pgp({
  promiseLib: Promise
})

// Create database connection for multitenancy
// const connection = pgPromise({