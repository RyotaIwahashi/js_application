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

  // Dateオブジェクトは、ホストシステムのタイムゾーンに基づき、常にUTC(世界標準時)に変換して値を格納する
  // 日本のシステムなら9時間前
  const time = new Date()

  // toString()などメソッドを使用して出力すると日本時間に戻して返してくれる
  // console.log(time.toString())

  // 削除期限を1分後に設定してcookieとして保存するよう指示する
  // cookieのexpiresにはUTCを登録する。ブラウザ側で各ホストのタイムゾーン設定に合わせて処理してくれる。
  // つまり、ブラウザ側がどのタイムゾーンでも対応できる
  time.setMinutes(time.getMinutes() + 1)
  response.cookie('jwtToken', token, { expires: time }) // responseキューにヘッダー情報を入れられる。まだクライアントには送信されない。

  // maxAgeを使用して以下の例だと2時間という制限をつけられる。(自動で日時に変換してExpiresに登録されてる)
  // response.cookie('jwtToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })

  // キューに入れられているヘッダーを読むことができる
  // console.log(response.getHeader('set-cookie'))

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
