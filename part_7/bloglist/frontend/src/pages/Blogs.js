import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BlogForm from '../components/BlogForm'
import PageHeader from '../components/PageHeader'
import Togglable from '../components/Togglable'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'

const Blogs = () => {
  const blogFormRef = useRef()
  const blogs = useSelector((state) => state.blogs)

  const toggleFormVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div className="blogs">
      <PageHeader pageName="Blogs" />
      <Grid container spacing={1} sx={{ p: 2, mt: 2, mb: 10 }}>
        {blogs.map((blog) => (
          <Grid item key={blog.id} xs={12} md={6} lg={4}>
            <Card elevation={0}>
              <CardActionArea
                sx={{ height: 120 }}
                component={Link}
                to={`/blogs/${blog.id}`}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ p: 1 }} noWrap>
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{ p: 1 }}
                    noWrap
                  >
                    {blog.author}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box align="center" sx={{ pb: 5 }}>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm toggleFormVisibility={toggleFormVisibility} />
        </Togglable>
      </Box>
    </div>
  )
}

export default Blogs
