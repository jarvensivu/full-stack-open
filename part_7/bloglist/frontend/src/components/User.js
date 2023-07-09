import { useDispatch } from 'react-redux'
import { removeCurrentUser } from '../reducers/loginReducer'

const User = ({ loggedUser }) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(removeCurrentUser())
  }

  return (
    <>
      {loggedUser.name} logged in
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default User
