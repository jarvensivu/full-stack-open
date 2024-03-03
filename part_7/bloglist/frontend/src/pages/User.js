import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

const User = () => {
  const { id } = useParams()
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  )
  const navigate = useNavigate()

  const navigateToBlog = (id) => {
    navigate(`/blogs/${id}`)
  }

  if (!user) {
    return <p>User not found</p>
  }

  return (
    <div>
      <PageHeader pageName={user.name ? user.name : 'Anonymous user'} />
      <Paper sx={{ my: 2 }}>
        <Typography variant="h6" component="h3" sx={{ pt: 2, pl: 2 }}>
          {user.blogs.length > 0 ? 'added blogs' : 'no added blogs'}
        </Typography>
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>
              <ListItemButton onClick={() => navigateToBlog(blog.id)}>
                <ListItemText primary={blog.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default User
