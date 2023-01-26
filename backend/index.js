require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Note = require('./models/note')

// ミドルウェアの実行順序は、app.useでExpressにロードされた順序と同じ
app.use(express.json())
app.use(cors()) // localで別のアプリケーションとしてフロントとバックを動かしてる場合に必要。
app.use(express.static('build'))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })
// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    // notes変数に Mongo によって返された配列オブジェクトが割り当たる
    // レスポンスが JSON 形式で送信されると、配列内の各オブジェクトのtoJSONメソッド(上書きしたやつ)がJSON.stringifyメソッドによって自動的に呼び出される。
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(e => {
      // response.status(400).send({ error: 'malformatted id' })

      // nextがパラメータなしで呼ばれた場合、実行は次のルートまたはミドルウェアに移動する。
      // パラメータで呼び出された場合、エラーハンドラーミドルウェアに続く。(？)
      next(e)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(e => next(e))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  // mongooseの built-in validator (組み込みバリデーター)でバリデーションできる。
  // if (body.content === undefined) {
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(e => next(e))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  // if (!body.content) {
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }

  // {new: true}を指定することで、updatedNoteパラメータに新しい変更されたドキュメントでハンドラーが呼び出される。
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, content: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(e => next(e))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// エラーハンドラー
// 各ルートハンドラーの catch 文で next を使うとここにくる。
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
