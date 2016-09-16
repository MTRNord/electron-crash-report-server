'use strict'

const config = require('./config')
const fs = require('fs')
const h = require('virtual-dom/h')
const path = require('path')
const css = fs.readFileSync(path.join(__dirname, 'assets', 'style.css'))

module.exports = function () {
  return [
    h('title', 'Crash Reports'),
    h('meta', { charset: 'utf-8' }),
    h('meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }),
    h('style', css.toString()),
    banners()
  ]
}

function banners () {
  if (config.web.enabled && process.env.user === 'admin' && process.env.pass === 'secret') {
    return h('.banner', [
      h('p', [
        'You have web enabled but have not changed the default user and password setup; this means anyone can come along and view your crash reports. ',
        h('a', { href: '/config' }, 'Fix it')
      ])
    ])
  }
}
