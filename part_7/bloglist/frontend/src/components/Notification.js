import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  const severity = notification.type ? notification.type : 'info'
  return (
    <Alert severity={severity} sx={{ my: 1 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
