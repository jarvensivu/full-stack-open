import { createSlice } from '@reduxjs/toolkit'
import blogService from '../../services/blogs'
import { sortBlogs } from '../../utils'

export const createBlog = (content) => {
  return async (dispatch) => {
    const newAnecdote = await blogService.create({ ...content, votes: 0 })
    dispatch(addBlog(newAnecdote))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const increaseLikes = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch(addLike(updatedBlog.id))
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
