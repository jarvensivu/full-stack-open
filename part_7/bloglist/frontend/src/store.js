import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './components/reducers/notificationsReducer'
import blogsReducer from './components/reducers/blogsReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
  },
  devTools: true,
})

export default store
