// ルートハンドラ
// routerオブジェクトについて: http://expressjs.com/en/api.html#router
const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  // get に割り当てる関数を同期関数(asyncなし)にした場合は、
  // 下記のように非同期関数であるfind()を同期的に処理するためにthen()が必要になる。
  // Note.find({}).then(notes => {
  //   response.json(notes)
  // })

  // notes変数に Mongo によって返された配列オブジェクトが割り当たる
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
  // レスポンスが JSON 形式で送信されると、配列内の各オブジェクトのtoJSONメソッド(上書きしたやつ)がJSON.stringifyメソッドによって自動的に呼び出される。
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/',  async (request, response) => {
  const body = request.body

  // authorization ヘッダーにあるベアラーtokenを検証する。
  // 検証ができれば、ログイン済みユーザとして処理を続行する。
  // トークンからデコードされたオブジェクトには、デジタル署名したユーザー名とidフィールドが含まれている。
  // トークンが見つからないか無効な場合、例外JsonWebTokenErrorが発生
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id, // ここはObjectIdで良い。(toString()は不要)
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
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
