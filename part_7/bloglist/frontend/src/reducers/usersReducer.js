import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload
    },
    addUserBlog: (state, action) => {
      return state.map((user) => {
        return {
          ...user,
          blogs:
            user.id === action.payload.user.id
              ? user.blogs.concat(action.payload)
              : user.blogs,
        }
      })
    },
    removeUserBlog: (state, action) => {
      return state.map((user) => {
        return {
          ...user,
          blogs: user.blogs.filter((blog) => blog.id !== action.payload),
        }
      })
    },
  },
})

export const { setUsers, addUserBlog, removeUserBlog } = usersSlice.actions

export default usersSlice.reducer
