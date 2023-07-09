import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import storageService from '../services/storage'
import { setNotification } from './notificationsReducer'
import { parseErrorMessage } from '../utils'

export const setCurrentUser = (loginCredentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(loginCredentials)
      storageService.saveUser(user)
      blogService.setToken(user.token)
      dispatch(logIn(user))
    } catch (error) {
      dispatch(setNotification(parseErrorMessage(error)))
    }
  }
}

export const removeCurrentUser = () => {
  return async (dispatch) => {
    storageService.removeUser()
    blogService.setToken(null)
    dispatch(logOut())
  }
}

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    logIn: (state, action) => {
      return action.payload
    },
    logOut: () => {
      return null
    },
  },
})

export const { logIn, logOut } = loginSlice.actions

export default loginSlice.reducer
