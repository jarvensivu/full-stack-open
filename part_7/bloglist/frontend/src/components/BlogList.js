import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Blog from './Blog'

const BlogList = ({ updateLikes, deleteBlog, user }) => {
  const blogs = useSelector((state) => state.blogs)
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  )
}

BlogList.propTypes = {
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default BlogList
