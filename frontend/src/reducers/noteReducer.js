import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    setNotes(state, action){
      const content = action.payload
      return content
    },
    createNote(state, action) {
      const content = action.payload
      // state.concat({
      //   ...content,
      //   important: false,
      // })
      // createSlice関数によって作成されたレデューサーではImmerライブラリを利用していて、
      // これによりレデューサー内の状態引数を変更できる。なのでpushも使える。
      state.push({
        ...content,
        important: false
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      // 普通にconsole.log(state)にすると、Immer ライブラリによる内部情報が出力されるのであまり役に立たない。
      // 下記のように記載することで人間に見やすい state を出力することができる。
      // console.log(JSON.parse(JSON.stringify(state)))
      return state.map(note =>
        note.id !== id ? note : changedNote
      )
    },
    deleteNote(state, action) {
      const id = action.payload
      return state.filter(n => n.id !== id)
    }
  }
})

export const { setNotes, createNote, toggleImportanceOf, deleteNote } = noteSlice.actions

// Redux Thunk は configureStore 関数で Redux store を作成していれば使用できる。
// Redux Thunkを使用すると、オブジェクトの代わりに関数を返すアクションクリエーターを実装できる。
// 特定の非同期操作の完了を待機し、その後、ストアの状態を変更する何らかのアクションをディスパッチすることができる。
export const initializeNote = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export default noteSlice.reducer

// createSliceを使わない場合のreducerとactionクリエイターの定義

// const noteReducer = (state = [], action) => {
//   switch(action.type) {
//   case 'NEW_NOTE':
//     return state.concat(action.payload)
//     // return [...state, action.payload]
//   case 'TOGGLE_IMPORTANCE': {
//     const id = action.payload.id
//     const noteToChange = state.find(n => n.id === id)
//     const changedNote = {
//       ...noteToChange,
//       important: !noteToChange.important
//     }
//     return state.map(note =>
//       note.id !== id ? note : changedNote
//     )
//   }
//   case 'DELETE_NOTE': {
//     return state.filter(n => n.id !== action.payload.id)
//   }
//   default:
//     return state
//   }
// }

// モジュールは1つのデフォルトエクスポートを持つことができるが、
// 複数の normal なエクスポートを持つこともできる。
// これらは、中括弧で括ってインポートできる。export default の場合は中括弧いらない。
// 例: import { createNote } from './../reducers/noteReducer'
// export const createNote = (content) => {
//   return {
//     type: 'NEW_NOTE',
//     payload: {
//       ...content,
//       important: false,
//     }
//   }
// }

// export const toggleImportanceOf = (id) => {
//   return {
//     type: 'TOGGLE_IMPORTANCE',
//     payload: { id }
//   }
// }

// export const initialCreateNote = (notes) => {
//   return {
//     type: 'NEW_NOTE',
//     payload: notes
//   }
// }

// export const deleteNote = (id) => {
//   return {
//     type: 'DELETE_NOTE',
//     payload: { id }
//   }
// }

// export default noteReducer
