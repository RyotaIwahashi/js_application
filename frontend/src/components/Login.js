import React from 'react'

const LoginFrom = ({ username, password, handleLogin, setUsername, setPassword }) => {
  return(
    <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
      <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginFrom
