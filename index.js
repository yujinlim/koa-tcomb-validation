const {validate} = require('tcomb-validation')

/**
 * Koa middleware to check request payload
 * @param  {Function} type     tcomb type
 * @param  {String} location   request location, either query or body
 * @return {[type]}          [description]
 */
module.exports = (type, location) => {
  if (!type) {
    throw new Error('type is required')
  }

  if (!location) {
    location = 'body'
  }

  return async (ctx, next) => {
    const payload = ctx.request[location]
    const result = validate(payload, type)
    const error = result.firstError()

    ctx.assert(result.isValid(), 400, error ? error.message : null)

    await next()
  }
}
