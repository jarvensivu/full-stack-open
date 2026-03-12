import { useContext } from 'react'
import NotificationsContext from '../context/NotificationsContext'

export const useNotifications = () => {
  const notificationsAndDispatch = useContext(NotificationsContext)
  return notificationsAndDispatch[0]
}
