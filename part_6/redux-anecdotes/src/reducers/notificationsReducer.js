import { createSlice } from '@reduxjs/toolkit'

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    setNotification: (state, action) => {
      const content = action.payload
      const id = Math.floor(Math.random() * 1000000)
      state.push({ content, id })
    },
    removeNotification: (state, action) => {
      state.shift()
    }
  }
});

export const { setNotification, removeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer
