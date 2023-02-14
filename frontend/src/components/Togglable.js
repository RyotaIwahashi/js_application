import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // reactフック。コンポーネント内で関数を定義するために使用され、コンポーネントの外部から関数を呼び出すことができる
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div style={props.style}>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={{...showWhenVisible}}>
        {props.children}
        <button onClick={toggleVisibility} style={{ marginTop: '5px' }}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
