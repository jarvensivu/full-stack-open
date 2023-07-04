import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './reducers/notificationsReducer'
import blogsReducer from './reducers/blogsReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
  },
  devTools: true,
})

export default store
