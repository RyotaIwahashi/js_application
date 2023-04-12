import { configureStore } from '@reduxjs/toolkit'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

// combineReducersは、値が異なる縮小関数であるオブジェクトを、createStoreに渡すことができる単一の縮小関数に変換する
// でもそもそも combineReducers 使わなくていいっぽい。
// const reducers = combineReducers({
//   notes: noteReducer,
//   filter: filterReducer,
// })

// configureStoreはcreateStoreと同じ
// createStoreとの違いは、複数の引数を渡すのでなく、名前付きフィールドを持つ単一のオブジェクトを渡すこと
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  }
})

export default store
