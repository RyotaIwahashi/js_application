import { useState } from 'react'
import PropTypes from 'prop-types'

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
            data-testid='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid='login-button' type="submit" style={{ marginTop: '5px' }}>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}


export default LoginForm
