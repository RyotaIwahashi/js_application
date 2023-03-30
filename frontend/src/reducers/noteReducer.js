import { createSlice } from '@reduxjs/toolkit'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    initializeNote(state, action){
      const content = action.payload
      return content
    },
    createNote(state, action) {
      const content = action.payload
      state.concat({
        ...content,
        important: false,
      })
      // createSlice関数によって作成されたレデューサーではImmerライブラリを利用していて、
      // これによりレデューサー内の状態引数を変更できる。なのでpushも使える。
      // state.push({
      //   ...content,
      //   important: false
      // })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
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

export const { initializeNote, createNote, toggleImportanceOf, deleteNote } = noteSlice.actions
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
