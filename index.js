'use strict'

const authorize = require('./authorize')
const bodyParser = require('body-parser')
const config = require('./config')
const configEdit = require('./config-edit')
const configSave = require('./config-save')
const crashReportDelete = require('./crash-report-delete')
const crashReportList = require('./crash-report-list')
const crashReportSave = require('./crash-report-save')
const crashReportShow = require('./crash-report-show')
const dumpFileDownload = require('./dump-file-download')
const express = require('express')
const fs = require('fs')
const methodOverride = require('method-override')
const path = require('path')

fs.accessSync('.', fs.W_OK)
fs.accessSync(path.join(__dirname, 'config.ini'), fs.R_OK | fs.W_OK)

const app = express()
const server = app.listen(process.env.port, function () {
  const addr = server.address().address
  const port = server.address().port
  console.log(`crash report server running at http://${addr}:${port}`)
})

app.set('trust proxy', true)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.post('/', crashReportSave)

if (config.web.enabled) {
  app.get('/', authorize, crashReportList)
  app.get('/config', authorize, configEdit)
  app.get('/:id', authorize, crashReportShow)
  app.get('/:id/:attachment', authorize, dumpFileDownload)
  app.post('/config', authorize, configSave)
  app.delete('/:id', authorize, crashReportDelete)
}
