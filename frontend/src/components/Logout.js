import React from 'react'

const LogoutForm = ({ handleLogout }) => {
  return(
    <form onSubmit={handleLogout} style={{ marginBottom: '20px' }}>
      <button type="submit">logout</button>
    </form>
  )
}

export default LogoutForm
