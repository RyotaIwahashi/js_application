const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  // userを取得する際に、userに紐づくnotesも取得する。
  // この際、RDBなら、結合クエリで取ってくるため、クエリ実行中にDBの状態が変わることはないが、
  // ドキュメントデータベースの場合は、結合クエリが存在しないため、mongooseが複数クエリを実行して結合を実現する。
  // そのため、クエリ実行中にDBの状態が変わる可能性はある。
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // パスワードのハッシュに使用するソルト。数値として指定された場合、指定されたラウンド数でソルトが生成され、使用されます
  // ref: https://github.com/kelektiv/node.bcrypt.js/#api
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
