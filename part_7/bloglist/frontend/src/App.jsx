import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import Login from './pages/Login'
import User from './pages/User'
import Users from './pages/Users'
import blogService from './services/blogs'
import storageService from './services/storage'
import { initializeBlogs } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'
import { logIn } from './reducers/loginReducer'
import Layout from './components/Layout'

const App = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.login)

  useEffect(() => {
    if (loggedUser) {
      dispatch(initializeBlogs())
      dispatch(initializeUsers())
    }
  }, [loggedUser, dispatch])

  useEffect(() => {
    const user = storageService.loadUser()
    if (user) {
      blogService.setToken(user.token)
      dispatch(logIn(user))
    }
  }, [])

  if (!loggedUser) {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Layout>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<User />} />
        <Route path="/*" element={<h3>404 Page Not Found</h3>} />
      </Routes>
    </Layout>
  )
}

export default App
