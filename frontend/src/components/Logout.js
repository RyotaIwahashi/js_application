import React from 'react'

const LogoutForm = (props) => {
  return(
    <form onSubmit={props.handleSubmit} style={{ marginBottom: '20px' }}>
      <button type="submit">logout</button>
    </form>
  )
}

export default LogoutForm
