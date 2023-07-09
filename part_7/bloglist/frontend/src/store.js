import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './reducers/notificationsReducer'
import blogsReducer from './reducers/blogsReducer'
import loginReducer from './reducers/loginReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
    login: loginReducer,
  },
  devTools: true,
})

export default store
