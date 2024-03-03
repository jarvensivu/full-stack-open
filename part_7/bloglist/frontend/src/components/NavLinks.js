import { Link } from 'react-router-dom'
import { Box, Button } from '@mui/material'

const NavLinks = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Button color="inherit" component={Link} to="/">
        blogs
      </Button>
      <Button color="inherit" component={Link} to="/users">
        users
      </Button>
    </Box>
  )
}

export default NavLinks
