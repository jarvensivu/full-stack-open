import { useSelector } from 'react-redux'

const Notifications = () => {
  const notifications = useSelector(state => state.notifications)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div style={style}>
      {notifications.map(notification => <div key={notification.id}>{notification.content}</div>)}
    </div>
  )
}

export default Notifications