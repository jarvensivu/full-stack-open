import { Box, Paper, Typography } from '@mui/material'
import LoginForm from '../components/LoginForm'

const Login = () => {
  return (
    <div className="login">
      <Box align="center" sx={{ mt: 2, pt: 4, height: 350 }} component={Paper}>
        <Typography variant="h5" component="h2" sx={{ pt: 4 }}>
          Log in to application
        </Typography>
        <LoginForm />
      </Box>
    </div>
  )
}

export default Login
