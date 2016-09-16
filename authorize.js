'use strict'

const basicAuth = require('basic-auth')
const config = require('./config')

module.exports = function authorize (req, res, next) {
  const user = basicAuth(req)

  if (!user || !user.name || !user.pass) return unauthorized(res)
  if (authorized(user)) return next()
  else return unauthorized(res)

  function authorized (user) {
    return user.name === process.env.user && user.pass === process.env.pass
  }

  function unauthorized (res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization required')
    return res.sendStatus(401)
  }
}
