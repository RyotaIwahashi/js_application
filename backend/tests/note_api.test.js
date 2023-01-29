const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

// Expressアプリケーションをインポートし、スーパーエージェントオブジェクトにラップする
// スーパーエージェント = 多くの高レベルの HTTP クライアント機能を持つライブラリ
// スーパーテストは、テスト対象のアプリケーションを内部の一時ポートで開始してくれる。(つまりindex.jsでやってるみたいにlistenしなくていい)
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all notes are returned', async () => {
  // async/await 構文を使用する利点。
  // 通常、Promise によって返されるデータにアクセスするには、コールバック関数を使用する必要がある。
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map( n => n.content )
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
