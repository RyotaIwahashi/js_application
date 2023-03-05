const noteReducer = (state = [], action) => {
  switch(action.type) {
  case 'NEW_NOTE':
    // return state.concat(action.payload)
    return [...state, action.payload]
  case 'TOGGLE_IMPORTANCE': {
    const id = action.payload.id
    const noteToChange = state.find(n => n.id === id)
    const changedNote = {
      ...noteToChange,
      important: !noteToChange.important
    }
    return state.map(note =>
      note.id !== id ? note : changedNote
    )
  }
  default:
    return state
  }
}

// モジュールは1つのデフォルトエクスポートを持つことができるが、
// 複数の normal なエクスポートを持つこともできる。
// これらは、中括弧で括ってインポートできる。export default の場合は中括弧いらない。
// 例: import { createNote } from './../reducers/noteReducer'
export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
    }
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export default noteReducer
