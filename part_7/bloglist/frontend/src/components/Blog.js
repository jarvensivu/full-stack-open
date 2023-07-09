import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { increaseLikes, deleteBlog } from '../reducers/blogsReducer'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.login)

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const handleIncreaseLikes = async () => {
    dispatch(increaseLikes(blog))
  }

  const handleDeleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
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
            <button id="likes-button" onClick={() => handleIncreaseLikes(blog)}>
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === loggedUser.username && (
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
}

export default Blog
