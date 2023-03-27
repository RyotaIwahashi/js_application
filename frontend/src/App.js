import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import noteService from './services/notes'
import loginService from './services/login'
import { Note, Notification, LoginForm, LogoutForm, NoteForm, Footer, Togglable, VisibilityFilter } from './components'
import './index.css'
import { initialCreateNote, createNote, toggleImportanceOf, deleteNote } from './reducers/noteReducer'

const App = () => {
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  // アクションを送信して、Redux storeのstateを変更できるようになる
  // dispatch()で再レンダリングされる。
  const dispatch = useDispatch()
  // ストアに保存されている state に アクセスして、関数をパラメータとして渡して値を取得する
  // 複数のreducerを使用する場合、state.xxx に各レデューサーが管理するstateにアクセスできる
  const notes = useSelector(state => {
    if ( state.filter === 'ALL') {
      return state.notes
    }
    return state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function fetchData() {
      const initialNotes = await noteService.getAll()
      dispatch(initialCreateNote(initialNotes))
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
      setUser(user) // 上に記載したuseEffectよりこっちが先に実行されて、一回再レンダリングしてる。
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
    noteFormRef.current.toggleVisibility() // 別コンポーネントの関数を実行する

    try {
      const returnedNote = await noteService.create(noteObject)
      dispatch(createNote(returnedNote))
    } catch(e) {
      if (e.response.status === 401) {
        window.localStorage.removeItem('loggedNoteappUser')
        setUser(null)
        setErrorMessage('認証の有効期限が切れています。')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const handleToggleImportanceOf = async (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = {
      ...note,
      important: !note.important
    }

    try {
      await noteService.update(id, changedNote)
      dispatch(toggleImportanceOf(id))
    } catch(e) {
      setErrorMessage(
        `${e} :Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      dispatch(deleteNote(id))
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

      <VisibilityFilter />
      <ul>
        {notes.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => handleToggleImportanceOf(note.id)} />
        )}
      </ul>

      <Footer />
    </div>
  )
}

export default App
