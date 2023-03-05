import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

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
