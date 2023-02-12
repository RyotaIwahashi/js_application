import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

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
}

export default Togglable
