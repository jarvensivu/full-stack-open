import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../reducers/loginReducer'

const LoginForm = () => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: '',
  })

  const dispatch = useDispatch()

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    const success = dispatch(setCurrentUser(loginCredentials))
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
          id="username"
          type="text"
          value={loginCredentials.username}
          name="username"
          onChange={handleCredentialsChange}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={loginCredentials.password}
          name="password"
          onChange={handleCredentialsChange}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )
}

export default LoginForm
