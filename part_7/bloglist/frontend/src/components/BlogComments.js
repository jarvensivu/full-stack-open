import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewComment } from '../reducers/blogsReducer'

const BlogComments = ({ blog }) => {
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const handleFormChange = (event) => {
    setComment(event.target.value)
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    dispatch(addNewComment(blog.id, { comment: event.target.comment.value }))
    setComment('')
  }

  return (
    <div>
      <h4>comments</h4>
      <form id="blog-comment-form" onSubmit={handleCommentSubmit}>
        <input
          id="blog-comment-input"
          type="text"
          value={comment}
          name="comment"
          onChange={handleFormChange}
        />
        <button id="blog-comment-submit" type="submit">
          add comment
        </button>
      </form>
      {blog.comments.length === 0 && <p>No comments yet</p>}
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogComments
