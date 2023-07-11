import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeCurrentUser } from '../reducers/loginReducer'

const NavBar = ({ loggedUser }) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(removeCurrentUser())
  }

  return (
    <div>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      {loggedUser.name} logged in
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default NavBar
