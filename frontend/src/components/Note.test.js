import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  //render メソッドは、コンポーネントを DOM にレンダリングせずにテストに適した形式でレンダリングする
  render(<Note note={note} />)

  // screenで、レンダリングされたコンポーネントにアクセスできる
  const element = screen.getByText('Component testing is done with react-testing-library')

  // 実はexpectはいらなくて、要素が見つからなかったらそもそもgetByTextで失敗する。
  expect(element).toBeDefined()

  // renderによって返されるフィールドの1つにcontainerがある。
  const { container } = render(<Note note={note}/>)

  // containerにはquerySelectorメソッドが用意されていて、レンダリングされた要素をCSSセレクタで検索できる。
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // 上記の他にも、getByTestIdというメソッドで、
  // 特にテスト目的でコードに挿入された id 属性に基づいて要素を探すことができる。
  // https://testing-library.com/docs/queries/bytestid/ : div の属性に data-testid をつける。
})
