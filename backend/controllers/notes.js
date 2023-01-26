// ルートハンドラ
// routerオブジェクトについて: http://expressjs.com/en/api.html#router
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    // notes変数に Mongo によって返された配列オブジェクトが割り当たる
    // レスポンスが JSON 形式で送信されると、配列内の各オブジェクトのtoJSONメソッド(上書きしたやつ)がJSON.stringifyメソッドによって自動的に呼び出される。
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    // nextがパラメータなしで呼ばれた場合、実行は次のルートまたはミドルウェアに移動する。
    // パラメータで呼び出された場合、エラーハンドラーミドルウェアに続く。(？)
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  // {new: true}を指定することで、updatedNoteパラメータに新しい変更されたドキュメントでハンドラーが呼び出される。
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, content: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
