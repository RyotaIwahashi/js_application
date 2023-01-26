import { useState, useEffect } from 'react'
import noteService from './services/notes'
import { Note, Notification, Footer } from './components'
import './index.css'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // const [flag, setFlag] = useState(false)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, []) // 第2引数で、特定の値が変更された場合にのみエフェクトを起動するように選択できる。
         // 空の配列[]の場合、コンポーネントの最初のレンダリングのときにだけ実行される。

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
        // setFlag(!flag)
      })
  }

  const handleNoteChange = (e) => {
    setNewNote(e.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = {
      ...note,
      important: !note.important
    }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(e => {
        setErrorMessage(
          `${e} :Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)
  console.log(notesToShow)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
