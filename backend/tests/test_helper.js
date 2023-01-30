const Note = require('../models/note')

const initialNotes = [
  {
    date: Date.now(),
    content: 'HTML is easy',
    important: false
  },
  {
    date: Date.now(),
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({
    date: Date.now(),
    content: 'willremovethissoon'
  })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
