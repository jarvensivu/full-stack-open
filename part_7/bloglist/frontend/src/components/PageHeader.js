import { Typography } from '@mui/material'

const PageHeader = ({ pageName }) => {
  return (
    <Typography variant="h4" component="h1" sx={{ pt: 5 }}>
      {pageName}
    </Typography>
  )
}

export default PageHeader
