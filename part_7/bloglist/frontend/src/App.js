import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notifications from './components/Notifications'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationsReducer'
import { createBlog, initializeBlogs } from './reducers/blogsReducer'
import { parseError } from './utils'

const App = () => {
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const loginUser = async (loginCredentials) => {
    try {
      const user = await loginService.login(loginCredentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      dispatch(setNotification(parseError(error), 'error'))
    }
  }

  const logOutUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (newBlog) => {
    try {
      dispatch(createBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          'success'
        )
      )
      blogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      dispatch(setNotification(parseError(error), 'error'))
      return false
    }
  }

  return (
    <div>
      {!user ? (
        <>
          <h2>Log in to application</h2>
          <Notifications />
          <LoginForm loginUser={loginUser} />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Notifications />
          <p>
            {user.name} logged in
            <button onClick={logOutUser}>Logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          <br />
          <BlogList user={user} />
        </>
      )}
    </div>
  )
}

export default App
