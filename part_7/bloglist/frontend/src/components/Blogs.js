import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const Blogs = () => {
  const blogFormRef = useRef()
  const blogs = useSelector((state) => state.blogs)

  const toggleFormVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <h3>Blogs</h3>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm toggleFormVisibility={toggleFormVisibility} />
      </Togglable>
      {blogs.map((blog) => (
        <p style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </p>
      ))}
    </div>
  )
}

export default Blogs
