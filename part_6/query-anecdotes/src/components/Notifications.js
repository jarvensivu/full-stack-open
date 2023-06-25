import { useNotifications} from '../context/NotificationsContext'

const Notifications = () => {
  const notifications = useNotifications()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (notifications.length === 0) return null

  return (
    <div style={style}>
      {notifications.map(notification => <div key={notification.id}>{notification.content}</div>)}
    </div>
  )
}

export default Notifications
