import { Container, Paper } from '@mui/material'
import NavBar from './NavBar'

const Layout = ({ children }) => {
  return (
    <Container>
      <NavBar />
      <Paper align="center" sx={{ mt: 2, height: '100%' }}>
        {children}
      </Paper>
    </Container>
  )
}

export default Layout
