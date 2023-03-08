import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import noteService from './services/notes'
import loginService from './services/login'
import { Note, Notification, LoginForm, LogoutForm, NoteForm, Footer, Togglable } from './components'
import './index.css'
import { createNote, toggleImportanceOf } from './reducers/noteReducer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function fetchData() {
      const initialNotes = await noteService.getAll()
      setNotes(initialNotes)
      // storeの状態が変更された場合、React はアプリケーションを自動的に再レンダリングできない。
      // したがって、ここでdispatchしたあとにレンダリングするように作る必要がある。
      // レンダリングしないと、store.getState()しても空の値が返ってくる。
      // (このコンポーネントのstateを変更したりして再レンダリングさせれば、最新のstoreにアクセスできるようになる)
      // 次回Appコンポーネントでstoreを使うところから。
      // store.dispatch({
      //   type: 'NEW_NOTE',
      //   payload: initialNotes
      // })
    }
    fetchData()
  }, [])
  // 第2引数で、特定の値が変更された場合にのみエフェクトを起動するように選択できる。
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

  const handleLogin = async (userInput) => {
    try {
      const user = await loginService.login({
        username: userInput.username,
        password: userInput.password,
      })

      // ローカルストレージはkey-valueデータベース。すべて文字列で格納する必要があるため、stringifyを使用している。
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)

      setUser(user) // state変える度にrenderされてる。
    } catch (exception) {
      setErrorMessage('Wrong credentials')

      // setTimeoutが実行されてから指定時間(5秒)経ったらfbの関数を実行する
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleAddNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
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
    return (
      <Togglable buttonLabel='login' style={{ marginBottom: '10px' }}>
        <LoginForm
          handleLogin={handleLogin}
        />
      </Togglable>
    )
  }

  const logoutForm = () => {
    return (
      <LogoutForm handleSubmit={handleLogout} />
    )
  }

  // noteFormRef変数は、コンポーネントへの参照として機能する。
  // このフックは、コンポーネントの再レンダリングを通じて保持される同じ参照 (ref) を保証する。
  const noteFormRef = useRef()
  const noteForm = () => {
    return (
      <Togglable buttonLabel='new note' style={{ marginBottom: '20px' }} ref={noteFormRef}>
        <NoteForm
          createNote={handleAddNote} />
      </Togglable>
    )
  }

  // console.log(store.getState())
  // const notesToShow = showAll ? store.getState() : store.getState().filter(note => note.important === true)
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
          {logoutForm()}
          {noteForm()}
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
