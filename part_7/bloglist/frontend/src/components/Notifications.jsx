import { useSelector } from 'react-redux'
import Notification from './Notification'

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications)

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notifications">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export default Notifications
