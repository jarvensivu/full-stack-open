import { createSlice } from '@reduxjs/toolkit'

export const setNotification = (message, type) => {
  return async (dispatch) => {
    dispatch(addNotification({ message, type }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      const id = Math.floor(Math.random() * 1000000)
      state.push({ ...action.payload, id })
    },
    removeNotification: (state) => {
      state.shift()
    },
  },
})

export const { addNotification, removeNotification } =
  notificationsSlice.actions

export default notificationsSlice.reducer
