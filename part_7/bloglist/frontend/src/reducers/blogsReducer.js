import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationsReducer'
import { addUserBlog, removeUserBlog } from './usersReducer'
import { sortBlogs, parseErrorMessage } from '../utils'

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(addBlog(newBlog))
      dispatch(addUserBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          'success'
        )
      )
      return true
    } catch (error) {
      dispatch(setNotification(parseErrorMessage(error), 'error'))
      return false
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(removeUserBlog(blog.id))
      dispatch(
        setNotification(
          `blog ${blog.title} by ${blog.author} was deleted`,
          'success'
        )
      )
    } catch (error) {
      dispatch(setNotification(parseErrorMessage(error), 'error'))
    }
  }
}

export const increaseLikes = (blog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update({
        ...blog,
        likes: blog.likes + 1,
      })
      dispatch(addLike(updatedBlog.id))
    } catch (error) {
      dispatch(setNotification(parseErrorMessage(error), 'error'))
    }
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(sortBlogs(blogs)))
  }
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog: (state, action) => {
      state.push(action.payload)
    },
    addLike: (state, action) => {
      return sortBlogs(
        state.map((blog) =>
          blog.id === action.payload ? { ...blog, likes: blog.likes + 1 } : blog
        )
      )
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload)
    },
    setBlogs: (_state, action) => {
      return action.payload
    },
  },
})

export const { addBlog, addLike, removeBlog, setBlogs } = blogSlice.actions

export default blogSlice.reducer
