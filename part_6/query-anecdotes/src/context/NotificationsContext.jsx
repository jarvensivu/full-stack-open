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

export const useNotificationHandler = () => {
  const notificationsAndDispatch = useContext(NotificationsContext)
  const dispatch = notificationsAndDispatch[1]
  return (payload) => {
    dispatch({ type: "ADD", payload })
    setTimeout(() => {
      dispatch({ type: "REMOVE", payload })
    }, 5000)
  }
}

export default NotificationsContext
