import { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { increaseLikes, removeBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationsReducer'
import { parseErrorMessage } from '../utils'

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false)
  const dispatch = useDispatch()

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const handleUpdateLikes = async () => {
    try {
      dispatch(increaseLikes(blog))
    } catch (error) {
      dispatch(setNotification(parseErrorMessage(error), 'error'))
    }
  }

  const handleDeleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(removeBlog(blog.id))
        dispatch(
          setNotification(
            `blog ${blog.title} by ${blog.author} was deleted`,
            'success'
          )
        )
      } catch (error) {
        dispatch(setNotification(parseErrorMessage(error), 'error'))
      }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button
          id="toggle-visibility-button"
          onClick={() => toggleVisibility()}
        >
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <>
          <a href={blog.url}>{blog.url}</a>
          <div>
            likes {blog.likes}
            <button id="likes-button" onClick={() => handleUpdateLikes(blog)}>
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username && (
            <div>
              <button id="remove-button" onClick={handleDeleteBlog}>
                remove
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
