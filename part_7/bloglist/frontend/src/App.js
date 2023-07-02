import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notifications from './components/Notifications'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './components/reducers/notificationsReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogs(blogs)))
  }, [])

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
      handleError(error)
    }
  }

  const logOutUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      dispatch(
        setNotification(
          `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
          'success'
        )
      )
      blogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const updateLikes = async (blog) => {
    const { id, title, author, url, likes } = blog
    try {
      const updatedBlog = await blogService.update({
        id,
        title,
        author,
        url,
        likes: likes + 1,
      })
      setBlogs(
        sortBlogs(
          blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
        )
      )
    } catch (error) {
      handleError(error)
    }
  }

  const deleteBlog = async ({ id, title, author }) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      dispatch(
        setNotification(`blog ${title} by ${author} was deleted`, 'success')
      )
    } catch (error) {
      handleError(error)
    }
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const handleError = (error) => {
    if (error.response.data.error) {
      dispatch(setNotification(error.response.data.error, 'error'))
    } else {
      dispatch(setNotification('unknown error', 'error'))
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
          <BlogList
            blogs={blogs}
            updateLikes={updateLikes}
            deleteBlog={deleteBlog}
            user={user}
          />
        </>
      )}
    </div>
  )
}

export default App
