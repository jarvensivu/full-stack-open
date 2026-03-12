import { useContext } from 'react'
import NotificationsContext from '../context/NotificationsContext'

export const useNotificationHandler = () => {
  const notificationsAndDispatch = useContext(NotificationsContext)
  const dispatch = notificationsAndDispatch[1]

  return (payload) => {
    dispatch({ type: 'ADD', payload })
    setTimeout(() => {
      dispatch({ type: 'REMOVE', payload })
    }, 5000)
  }
}
