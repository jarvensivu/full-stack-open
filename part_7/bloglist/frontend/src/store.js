import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './components/reducers/notificationsReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
  devTools: true,
})

export default store
