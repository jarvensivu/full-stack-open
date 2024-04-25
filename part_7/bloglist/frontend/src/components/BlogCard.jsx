import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import { Delete, Home, ThumbUp } from '@mui/icons-material'
import { increaseLikes, deleteBlog } from '../reducers/blogsReducer'

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.login)
  const targetBlogUrl =
    blog.url.startsWith('http://') || blog.url.startsWith('https://')
      ? blog.url
      : `http://${blog.url}`

  const handleVisitBlog = () => {
    window.open(targetBlogUrl, '_blank')
  }

  const handleIncreaseLikes = async () => {
    dispatch(increaseLikes(blog))
  }

  const handleDeleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
      navigate('/')
    }
  }

  return (
    <Card align="center" elevation={0} sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h4" sx={{ pt: 2 }}>
          {blog.title}
        </Typography>
        <Typography variant="h5" sx={{ mb: 1 }} color="text.secondary">
          by {blog.author}
        </Typography>
        <Typography variant="body1">{blog.likes} likes</Typography>
        <Typography variant="body1">
          blog was added by {blog.user.name}
        </Typography>
      </CardContent>
      <ButtonGroup>
        <Button
          variant="text"
          size="small"
          sx={{ p: 2 }}
          onClick={handleVisitBlog}
          startIcon={<Home />}
        >
          Visit blog
        </Button>
        <Button
          variant="text"
          id="likes-button"
          color="primary"
          size="small"
          onClick={handleIncreaseLikes}
          sx={{ p: 2 }}
          startIcon={<ThumbUp />}
        >
          Like
        </Button>
        {blog.user.username === loggedUser.username && (
          <Button
            variant="text"
            id="remove-button"
            color="warning"
            size="small"
            onClick={handleDeleteBlog}
            sx={{ p: 2 }}
            startIcon={<Delete />}
          >
            Delete
          </Button>
        )}
      </ButtonGroup>
    </Card>
  )
}

export default BlogCard
