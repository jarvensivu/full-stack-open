import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notifications from './components/Notifications'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import storageService from './services/storage'
import { setNotification } from './reducers/notificationsReducer'
import { createBlog, initializeBlogs } from './reducers/blogsReducer'
import { logIn, removeCurrentUser } from './reducers/loginReducer'
import { parseErrorMessage } from './utils'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.login)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storageService.loadUser()
    if (user) {
      blogService.setToken(user.token)
      dispatch(logIn(user))
    }
  }, [])

  const logOutUser = () => {
    dispatch(removeCurrentUser())
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
      dispatch(setNotification(parseErrorMessage(error), 'error'))
      return false
    }
  }

  return (
    <div>
      {!loggedUser ? (
        <>
          <h2>Log in to application</h2>
          <Notifications />
          <LoginForm />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Notifications />
          <p>
            {loggedUser.name} logged in
            <button onClick={logOutUser}>Logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          <br />
          <BlogList user={loggedUser} />
        </>
      )}
    </div>
  )
}

export default App
