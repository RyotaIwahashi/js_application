// ルートハンドラ
// routerオブジェクトについて: http://expressjs.com/en/api.html#router
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  // get に割り当てる関数を同期関数(asyncなし)にした場合は、
  // 下記のように非同期関数であるfind()を同期的に処理するためにthen()が必要になる。
  // Note.find({}).then(notes => {
  //   response.json(notes)
  // })

  // notes変数に Mongo によって返された配列オブジェクトが割り当たる
  const notes = await Note.find({})
  // レスポンスが JSON 形式で送信されると、配列内の各オブジェクトのtoJSONメソッド(上書きしたやつ)がJSON.stringifyメソッドによって自動的に呼び出される。
  response.json(notes)
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

notesRouter.post('/',  async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  // note.save()
  //   .then(savedNote => {
  //     response.status(201).json(savedNote)
  //   })
  //   .catch(error => next(error))

  const savedNote = await note.save()
  response.status(201).json(savedNote)
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
