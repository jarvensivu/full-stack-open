import { createSlice } from '@reduxjs/toolkit'

export const setNotification = (content, time) => {
  return async (dispatch) => {
    dispatch(addNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
      }, time * 1000
    )
  }
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      const content = action.payload
      const id = Math.floor(Math.random() * 1000000)
      state.push({ content, id })
    },
    removeNotification: (state, _action) => {
      state.shift()
    }
  }
});

export const { addNotification, removeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer
