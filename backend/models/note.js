const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
console.log('connection to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(e => {
    console.log('error connection to MongoDB:', e.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  date: Date,
  important: Boolean,
}, {
  toJSON: {
    // toJsonメソッドの上書き。retはreturnedObjectの略。
    // response.json(notes) で呼び出される。
    // Mongoose オブジェクトの_idプロパティは文字列のように見えますが、実際にはオブジェクトなので、文字列に変換する(フロント側が文字列で待ってるため)。
    transform: (doc, ret) => {
      ret.id = ret._id.toString()
      console.log(ret)
      delete ret._id
      delete ret.__v
    }
  }
})
// toJsonの書き換えは set でもできるっぽい？
// noteSchema.set('toJson', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     console.log(returnedObject)
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

module.exports = mongoose.model('Note', noteSchema)
