import { createContext, useReducer, useContext } from 'react'

const notificationsReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return state.concat({ content: action.payload.content, id: action.payload.id })
    case "REMOVE":
      return state.filter(notification => notification.id !== action.payload.id)
    default:
      return state
  }
}

const NotificationsContext = createContext()

export const NotificationsContextProvider = (props) => {
  const [notifications, notificationsDispatch] = useReducer(notificationsReducer, [])

  return (
    <NotificationsContext.Provider value={[notifications, notificationsDispatch] }>
      {props.children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const notificationsAndDispatch = useContext(NotificationsContext)
  return notificationsAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationsAndDispatch = useContext(NotificationsContext)
  return notificationsAndDispatch[1]
}

export default NotificationsContext
