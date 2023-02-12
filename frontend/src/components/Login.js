import React from 'react'

// ↓こういう風に書くんじゃなくて、コンポーネントが汎用的に使えるように書く。
// const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => {
//   return(
//     <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
//       <div>
//         username
//           <input
//             type="text"
//             value={username}
//             name="Username"
//             onChange={({ target }) => setUsername(target.value)}
//           />
//       </div>
//       <div>
//         password
//           <input
//             type="password"
//             value={password}
//             name="Password"
//             onChange={({ target }) => setPassword(target.value)}
//           />
//       </div>
//       <button type="submit">login</button>
//     </form>
//   )
// }

// handleSubmitとかがprops。(props) => {}と書く代わりに、destructuringによって変数に割り当てている。
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" style={{ marginTop: '5px' }}>login</button>
      </form>
    </div>
  )
}



// eslint-disable-next-line import/no-anonymous-default-export
export default LoginForm
