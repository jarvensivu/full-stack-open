import PropTypes from 'prop-types'
import Blog from './Blog'

const BlogList = ({ blogs, updateLikes, deleteBlog, user }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} user={user}/>
      ))}
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default BlogList
