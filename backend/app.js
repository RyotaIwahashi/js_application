const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // try-catch ブロックを使わなくても、非同期ルートで例外が発生した場合、実行は自動的にエラー処理ミドルウェアに渡される
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const { info, error } = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch(e => {
    error('error connection to MongoDB:', e.message)
  })

// ミドルウェアの実行順序は、app.useでExpressにロードされた順序と同じ
app.use(cors()) // localで別のアプリケーションとしてフロントとバックを動かしてる場合に必要。
app.use(express.static('build')) // サーバに対して静的ファイルのリクエストがあった場合にどのデータを返すか。
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
