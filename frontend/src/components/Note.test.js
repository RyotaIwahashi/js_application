import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  // コンポーネントのHTMLをコンソールに出力できる
  screen.debug()
  screen.debug(element) // こうすると、必要な要素のみ出力できる

  // containerにはquerySelectorメソッドが用意されていて、レンダリングされた要素をCSSセレクタで検索できる。
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // 上記の他にも、getByTestIdというメソッドで、
  // 特にテスト目的でコードに挿入された id 属性に基づいて要素を探すことができる。
  // https://testing-library.com/docs/queries/bytestid/ : div の属性に data-testid をつける。
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // jestで定義されたモック関数
  const mockHandler = jest.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  // レンダリングされたコンポーネントに対して命令をできる。
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  // テストは、モック関数が1回だけ呼び出されたことを検証する。呼び出されたことによってどうなるかとかは見てない。
  expect(mockHandler.mock.calls).toHaveLength(1)
})
