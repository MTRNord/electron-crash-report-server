'use strict'

const _ = require('lodash')
const config = require('./config')
const db = require('./db')
const crashReportEmail = require('./crash-report-email')
const fs = require('fs')
const multiparty = require('multiparty')
const uuid = require('node-uuid')

module.exports = function saveCrashReport (req, res) {
  const form = new multiparty.Form()
  console.log('crash')
  form.parse(req, function (err, fields, files) {
    if (err) return console.error(err)

    const doc = {}
    const file = _.first(files.upload_file_minidump)

    for (let key in fields) {
      const value = _.first(fields[key]).trim()
      if (key === '_version') doc.version = value
      else if (key === 'list_annotations') doc.error = value
      else if (key === 'ver') doc.electron_version = value
      else doc[key] = value
    }

    // remove unnecessary info
    delete doc._companyName
    delete doc._productName
    delete doc.prod

    // couchdb does not permit _key named keys
    for (let key in doc) {
      if (key.match(/^_/)) {
        const k = key.replace(/^_/, '')
        doc[k] = doc[key]
        delete doc[key]
      }
    }

    doc._id = `${new Date().toISOString()}-${uuid.v4()}`
    doc._attachments = {}
    doc._attachments[file.originalFilename] = {
      data: file.path
    }
    /*doc._attachments[file.originalFilename] = {
      data: fs.readFileSync(file.path)
    }*/

    db.put(doc).then(function (response) {
      if (config.email.enabled) crashReportEmail(response.id)
      res.send('thanks!')
    }).catch(function (err) {
      console.error(err)
    })
  })
}
