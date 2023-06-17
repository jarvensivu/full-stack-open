import { useState } from 'react'

const LoginForm = ({ loginUser }) => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: '',
  })

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    const success = await loginUser(loginCredentials)
    if (success) setLoginCredentials({ username: '', password: '' })
  }

  const handleCredentialsChange = (event) => {
    const { name, value } = event.target
    setLoginCredentials((loginCredentials) => ({
      ...loginCredentials,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleLoginSubmit}>
      <div>
        username
        <input
          type="text"
          value={loginCredentials.username}
          name="username"
          onChange={handleCredentialsChange}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={loginCredentials.password}
          name="password"
          onChange={handleCredentialsChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
