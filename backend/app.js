const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const { info } = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(e => {
    console.log('error connection to MongoDB:', e.message)
  })

// ミドルウェアの実行順序は、app.useでExpressにロードされた順序と同じ
app.use(cors()) // localで別のアプリケーションとしてフロントとバックを動かしてる場合に必要。
app.use(express.static('build')) // サーバに対して静的ファイルのリクエストがあった場合にどのデータを返すか。
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
