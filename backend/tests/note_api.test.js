const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

// Expressアプリケーションをインポートし、スーパーエージェントオブジェクトにラップする
// スーパーエージェント = 多くの高レベルの HTTP クライアント機能を持つライブラリ
// スーパーテストは、テスト対象のアプリケーションを内部の一時ポートで開始してくれる。(つまりindex.jsでやってるみたいにlistenしなくていい)
const api = supertest(app)

const Note = require('../models/note')

const initialNotes = [
  {
    date: Date.now(),
    content: 'HTML is easy',
    important: false,
  },
  {
    date: Date.now(),
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
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

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})
