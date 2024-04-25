import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import BlogComments from '../components/BlogComments'
import BlogCommentForm from '../components/BlogCommentForm'
import PageHeader from '../components/PageHeader'

const Blog = () => {
  const { id } = useParams()
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )

  if (!blog) {
    return (
      <div className="blog-not-found">
        <PageHeader pageName="Blog not found" />
      </div>
    )
  }

  return (
    <div className="blog">
      <BlogCard blog={blog} />
      <BlogComments blog={blog} />
      <BlogCommentForm blog={blog} />
    </div>
  )
}

export default Blog
