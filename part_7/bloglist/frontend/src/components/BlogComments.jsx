import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'

const BlogComments = ({ blog }) => {
  return (
    <div>
      <Typography variant="h5" sx={{ pl: 2, pt: 2 }}>
        comments
      </Typography>
      {(!blog.comments || blog.comments.length === 0) && (
        <Typography variant="body1" sx={{ p: 2 }}>
          No comments yet
        </Typography>
      )}
      {blog.comments && blog.comments.length > 0 && (
        <Box sx={{ width: 300 }}>
          <List>
            {blog.comments.map((comment, i) => (
              <ListItem key={i}>
                <ListItemText align="center" primary={comment} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  )
}

export default BlogComments
