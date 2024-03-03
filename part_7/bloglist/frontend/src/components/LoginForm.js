import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../reducers/loginReducer'
import { Button, TextField } from '@mui/material'

const LoginForm = () => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: '',
  })

  const dispatch = useDispatch()

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    dispatch(setCurrentUser(loginCredentials))
    setLoginCredentials({ username: '', password: '' })
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
        <TextField
          id="username"
          label="username"
          type="text"
          value={loginCredentials.username}
          name="username"
          margin="normal"
          onChange={handleCredentialsChange}
        />
      </div>
      <div>
        <TextField
          id="password"
          label="password"
          type="password"
          value={loginCredentials.password}
          name="password"
          margin="normal"
          onChange={handleCredentialsChange}
        />
      </div>
      <Button
        id="login-button"
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2 }}
      >
        login
      </Button>
    </form>
  )
}

export default LoginForm
