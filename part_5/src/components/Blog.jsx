import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
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
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button id='toggle-visibility-button' onClick={() => toggleVisibility()}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <>
          <a href={blog.url}>{blog.url}</a>
          <div>
            likes {blog.likes}
            <button id='likes-button' onClick={() => updateLikes(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username && (
            <div>
              <button id='remove-button' onClick={handleDelete}>remove</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
