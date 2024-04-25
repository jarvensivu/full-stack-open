import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, TextField } from '@mui/material'
import { addNewComment } from '../reducers/blogsReducer'

const BlogCommentForm = ({ blog }) => {
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
    <Box sx={{ p: 2 }}>
      <form id="blog-comment-form" onSubmit={handleCommentSubmit}>
        <div>
          <TextField
            id="blog-comment-input"
            variant="outlined"
            type="text"
            value={comment}
            name="comment"
            margin="normal"
            onChange={handleFormChange}
          />
        </div>
        <div>
          <Button
            id="blog-comment-submit"
            variant="outlined"
            color="primary"
            size="small"
            type="submit"
          >
            add comment
          </Button>
        </div>
      </form>
    </Box>
  )
}

export default BlogCommentForm
