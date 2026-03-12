import { createContext, useReducer } from 'react'

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

export default NotificationsContext
