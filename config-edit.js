'use strict'

const config = require('./config')
const createElement = require('virtual-dom/create-element')
const h = require('virtual-dom/h')
const icons = require('./icons')
const viewHeader = require('./view-header')

function render () {
  function checkbox (id) {
    if (config[id].enabled) {
      return h('input', {
        name: `${id}_enabled`,
        type: 'checkbox',
        checked: 'checked'
      })
    } else {
      return h('input', {
        name: `${id}_enabled`,
        type: 'checkbox'
      })
    }
  }

  return h('html', [
    viewHeader(),
    h('h1', 'config'),
    h('p', 'You must restart the server before changes will take effect'),
    h('form', { method: 'post' }, [
      h('h2', 'web'),
      h('div', [
        h('label', ['enabled', checkbox('web')])
      ]),
      h('h2', 'email'),
      h('div', [
        h('label', ['enabled', checkbox('email')])
      ]),
      h('div', [
        h('label', 'subject'),
        h('input', {
          name: 'email_subject',
          type: 'text',
          value: config.email.subject
        })
      ]),
      h('div', [
        h('label', 'from'),
        h('input', {
          name: 'email_from',
          type: 'email',
          value: config.email.from
        })
      ]),
      h('div', [
        h('label', 'to'),
        h('input', {
          name: 'email_to',
          type: 'email',
          value: config.email.to
        })
      ]),
      h('div', [
        h('label', 'provider'),
        h('input', {
          name: 'email_provider',
          type: 'text',
          value: config.email.provider
        }),
        h('.hint', h('a', {
          href: 'http://git.io/vGbpu',
          target: '_blank'
        }, 'view list of providers'))
      ]),
      h('div', [
        h('label', 'username'),
        h('input', {
          name: 'email_user',
          type: 'text',
          value: config.email.user
        })
      ]),
      h('div', [
        h('label', 'password'),
        h('input', {
          name: 'email_pass',
          type: 'password',
          value: config.email.pass
        })
      ]),
      h('button', { type: 'submit' }, [
        h('img', { src: `data:image/svg+xml;utf8,${icons.save}` }),
        'save changes'
      ])
    ])
  ])
}

module.exports = function viewCrashReport (req, res) {
  const tree = render(config)
  const vdom = createElement(tree)
  const html = `<!DOCTYPE html>${vdom.toString()}`
  res.set('Content-Type', 'text/html')
  res.send(html)
}
