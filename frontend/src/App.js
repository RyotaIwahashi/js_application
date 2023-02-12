import { useState, useEffect } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import { Note, Notification, LoginForm, LogoutForm, NoteForm, Footer } from './components'
import './index.css'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function fetchData() {
      const initialNotes = await noteService.getAll()
      setNotes(initialNotes)
    }
    fetchData()
  }, []) // 第2引数で、特定の値が変更された場合にのみエフェクトを起動するように選択できる。
         // 空の配列[]の場合、コンポーネントの最初のレンダリングのときにだけ実行される。

  useEffect(() => {
    // アクセスの度にlocalStorageからログイン情報を読み込む
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = async (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5,
    }

    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
    setNewNote('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      // ローカルストレージはkey-valueデータベース。すべて文字列で格納する必要があるため、
      // stringifyを使用している。
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)

      setUser(user) // state変える度にrenderされてる。
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedNoteappUser')
    setLoginVisible(false)
    setUser(null)
  }

  const handleNoteChange = (e) => {
    setNewNote(e.target.value)
  }

  const toggleImportanceOf = async (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = {
      ...note,
      important: !note.important
    }

    try {
      const returnedNote = await noteService.update(id, changedNote)
      setNotes(notes.map(note => note.id === id? returnedNote : note))
    } catch(e) {
      setErrorMessage(
        `${e} :Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={{...hideWhenVisible, marginBottom: '10px'}}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={{...showWhenVisible, marginBottom: '10px'}}>
          <LoginForm 
            username={username}
            password={password}
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
          <button
            onClick={() => setLoginVisible(false)}
            style={{ marginTop: '5px' }}>cancel</button>
        </div>
      </div>
    )
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user && 
        <div>
          <p>{user.name} logged in</p>
        </div>
      }

      {user === null ?
        loginForm() :
        <div>
          <LogoutForm
            handleSubmit={handleLogout}
          />
          <NoteForm
            addNote={addNote}
            newNote={newNote}
            handleNoteChange={handleNoteChange} />
        </div>
      }

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
      
      <Footer />
    </div>
  )
}

export default App
