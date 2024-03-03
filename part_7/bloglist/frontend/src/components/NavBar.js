import { useSelector } from 'react-redux'
import { AppBar, Toolbar, Typography } from '@mui/material'

import Notifications from './Notifications'
import NavLinks from './NavLinks'
import Profile from './Profile'

const NavBar = () => {
  const loggedUser = useSelector((state) => state.login)

  return (
    <>
      <AppBar position="sticky" component="nav" sx={{ height: 70 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ pr: 2 }}>
            BLOG APP
          </Typography>
          {loggedUser && (
            <>
              <NavLinks />
              <Profile />
            </>
          )}
        </Toolbar>
      </AppBar>
      <Notifications />
    </>
  )
}

export default NavBar
