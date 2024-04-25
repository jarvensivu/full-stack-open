import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconButton, Menu, MenuItem } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { removeCurrentUser } from '../reducers/loginReducer'

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(removeCurrentUser())
    navigate('/')
  }

  return (
    <div>
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        aria-controls="main-menu"
        aria-haspopup="true"
        aria-label="Main Menu"
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default Profile
