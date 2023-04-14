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

// 特定のオリジンからしかアクセスを受け付けない設定
// ブラウザ上での異なるオリジン間の取り決めなので、APIを直接叩いたりすることは可能(corsの範疇外)
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

// ミドルウェアの実行順序は、app.useでExpressにロードされた順序と同じ

// localで別のアプリケーション(別のオリジン)でフロントとバックを動かしてる場合に必要。
// cross origin resource sharing を許可する。つまり各レスポンスヘッダーに Access-Control-Allow-Origin をつけてくれる。
// https://zenn.dev/luvmini511/articles/d8b2322e95ff40
app.use(cors(corsOptions))

app.use(express.static('build')) // サーバに対して静的ファイルのリクエストがあった場合にどのデータを返すか。
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
