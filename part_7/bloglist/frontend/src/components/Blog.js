import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { increaseLikes, deleteBlog } from '../reducers/blogsReducer'

const Blog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const loggedUser = useSelector((state) => state.login)
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )

  const handleIncreaseLikes = async () => {
    dispatch(increaseLikes(blog))
  }

  const handleDeleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
      navigate('/')
    }
  }

  if (!blog) {
    return null
  }

  return (
    <div className="blog">
      <h3>
        {blog.title} {blog.author}
      </h3>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button id="likes-button" onClick={() => handleIncreaseLikes(blog)}>
          like
        </button>
        <div>added by {blog.user.name}</div>
        {blog.user.username === loggedUser.username && (
          <div>
            <button id="remove-button" onClick={handleDeleteBlog}>
              remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
