import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import NavBar from './components/NavBar'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import Notifications from './components/Notifications'
import blogService from './services/blogs'
import storageService from './services/storage'
import { initializeBlogs } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'
import { logIn } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.login)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const user = storageService.loadUser()
    if (user) {
      blogService.setToken(user.token)
      dispatch(logIn(user))
    }
  }, [])

  if (!loggedUser) {
    return <Login />
  }

  return (
    <div>
      <Router>
        <NavBar loggedUser={loggedUser} />
        <h2>blog app</h2>
        <Notifications />
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<User />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
