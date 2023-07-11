import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './reducers/notificationsReducer'
import blogsReducer from './reducers/blogsReducer'
import loginReducer from './reducers/loginReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
    login: loginReducer,
    users: usersReducer,
  },
  devTools: true,
})

export default store
