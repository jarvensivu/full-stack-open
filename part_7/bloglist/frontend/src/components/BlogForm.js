import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, TextField, Typography } from '@mui/material'
import { createBlog } from '../reducers/blogsReducer'

const BlogForm = ({ toggleFormVisibility }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })
  const dispatch = useDispatch()

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setNewBlog((newBlog) => ({
      ...newBlog,
      [name]: value,
    }))
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    const success = await dispatch(createBlog(newBlog))
    if (success) {
      setNewBlog({ title: '', author: '', url: '' })
      toggleFormVisibility()
    }
  }

  return (
    <Box sx={{ mt: 2, height: 380 }}>
      <Typography variant="h6" component="h3" sx={{ pt: 2 }}>
        create new blog
      </Typography>
      <form id="form" onSubmit={handleBlogSubmit}>
        <div>
          <TextField
            id="title"
            label="title"
            variant="standard"
            type="text"
            value={newBlog.title}
            name="title"
            margin="normal"
            onChange={handleFormChange}
          />
        </div>
        <div>
          <TextField
            id="author"
            label="author"
            variant="standard"
            type="text"
            value={newBlog.author}
            name="author"
            margin="normal"
            onChange={handleFormChange}
          />
        </div>
        <div>
          <TextField
            id="url"
            label="url"
            variant="standard"
            type="text"
            value={newBlog.url}
            name="url"
            margin="normal"
            onChange={handleFormChange}
          />
        </div>
        <Button
          id="create-blog-button"
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm
