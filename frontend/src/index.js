import React from 'react'
import ReactDOM from 'react-dom'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

// combineReducersは、値が異なる縮小関数であるオブジェクトを、createStoreに渡すことができる単一の縮小関数に変換する
const reducers = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})

// configureStoreはcreateStoreと同じ
// createStoreとの違いは、複数の引数を渡すのでなく、名前付きフィールドを持つ単一のオブジェクトを渡すこと
const store = configureStore({
  reducer: reducers
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)


// const root = ReactDOM.createRoot(document.getElementById('root'))

// const renderApp = () => {
//   root.render(<App />)
// }

// renderApp()

// ストアの状態が変更された場合、React はアプリケーションを自動的に再レンダリングできない。
// したがって、ストア内の変更をstore.subscribeメソッドでリッスンするために、
// アプリ全体をレンダリングする関数renderAppを登録する。
// store.subscribe(renderApp)
