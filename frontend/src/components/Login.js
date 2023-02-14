import { useState } from 'react'

// handleSubmitとかがprops。(props) => {}と書く代わりに、destructuringによって変数に割り当てている。
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()

    handleLogin({
      username: username,
      password: password,
    })
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={login}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: '5px' }}>login</button>
      </form>
    </div>
  )
}



// eslint-disable-next-line import/no-anonymous-default-export
export default LoginForm
