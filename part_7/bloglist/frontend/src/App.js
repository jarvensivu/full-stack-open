import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notifications from './components/Notifications'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import User from './components/User'
import blogService from './services/blogs'
import storageService from './services/storage'
import { initializeBlogs } from './reducers/blogsReducer'
import { logIn } from './reducers/loginReducer'

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

  const toggleFormVisibility = () => {
    blogFormRef.current.toggleVisibility()
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
            <User loggedUser={loggedUser} />
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm toggleFormVisibility={toggleFormVisibility} />
          </Togglable>
          <br />
          <BlogList />
        </>
      )}
    </div>
  )
}

export default App
