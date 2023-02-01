const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // トークンには、ユーザー名とユーザーIDがデジタル署名された形式で含まれている
  // デジタル署名により、SECRET の値を知っている者だけが有効なトークンを生成できることが保証される
  // つまりこの値を持つサーバしか、このトークンを生成できないし、検証もできない。
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  // 有効期限を設ける他に、サーバ側セッションとcookieを利用する方法がある。
  // トークンに関する情報(セッションID)を、メモリorデータベースorストレージファイルに保存しておいて、アクセス時にトークンがまだ有効かどうかをチェックする
  // この場合、アクセス権をいつでも取り消すことができるメリットがある。
  // トークンの有効性のチェックはパフォーマンスに影響するため、高速インメモリデータストアであるRedisなどのkey-valueデータベースに保存するのが一般的。
  // jwtトークンの場合には、トークンにはユーザに関する情報は含まれず、リクエストごとにユーザのIDに関する関連情報をデータベースから取得する。
  // Bearerトークンはheaderにつけるが、サーバ側セッションを使用する場合はcookieのkey:valueを使用する。

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
