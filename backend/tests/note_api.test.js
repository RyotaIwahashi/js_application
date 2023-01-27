const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

// Expressアプリケーションをインポートし、スーパーエージェントオブジェクトにラップする
// スーパーエージェント = 多くの高レベルの HTTP クライアント機能を持つライブラリ
// スーパーテストは、テスト対象のアプリケーションを内部の一時ポートで開始してくれる。(つまりindex.jsでやってるみたいにlistenしなくていい)
const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are two notes', async () => {
  // async/await 構文を使用する利点。
  // 通常、Promise によって返されるデータにアクセスするには、コールバック関数を使用する必要がある。
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})

afterAll(async () => {
  await mongoose.connection.close()
})
