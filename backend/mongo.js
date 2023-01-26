const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

// RyotaIwahashiがユーザ名、noteAppがデータベース名
// アプリケーションがまだ存在しないデータベースに接続しようとすると、MongoDB Atlas が自動的に新しいデータベースを作成する
const url = `mongodb+srv://RyotaIwahashi:${password}@cluster0.b4vw4cd.mongodb.net/noteApp?retryWrites=true&w=majority`

// データベースへの接続を確立した後、メモと一致するモデルのスキーマを定義する。
// Noteはモデルの単数形の名前。コレクションの名前は小文字の複数形のnotesになる。
// Mongoose の慣例では複数形(例: notes)としてコレクションに自動的に名前を付けられる。
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
// mongooseでモデルを作成すると、Noteクラスのコンストラクタ関数でスキーマ通りのオブジェクトを作成できるようになる。
const Note = mongoose.model('Note', noteSchema)

// ただし、Mongo のようなドキュメント データベースはスキーマレス。
// つまり、データベース自体は、データベースに格納されているデータの構造を気にしない。
// フィールド(スキーマ)がまったく異なるドキュメントを同じコレクションに格納することができる。 key-value.

mongoose
  .connect(url)
  .then(() => {
    console.log('connected')

    // noteオブジェクトはNoteモデルのコンストラクター関数で作成されるため、
    // オブジェクトをデータベースに保存するためのメソッドを含む、モデルのすべてのプロパティがある。note.save()など。
    const note = new Note({
      content: 'HTML is Easy 2',
      date: new Date(),
      important: false,
    })

    return note.save()
  })
  .then(() => {
    // 保存操作の結果は、イベント ハンドラーの result パラメーターにある
    console.log('note saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))

// noteAppデータベースのすべてのメモを出力
// findは、Mongoの検索クエリ構文のように、検索条件を入れられる
// mongoose
//   .connect(url)
//   .then((result) => {
//     Note.find({ important: true}).then(result => {
//       result.forEach(note => {
//         console.log(note)
//       })
//       mongoose.connection.close()
//     })
//   })
//   .catch((err) => console.log(err))
