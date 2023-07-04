export const sortBlogs = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}

export const parseError = (error) => {
  return error.response.data.error ? error.response.data.error : 'unknown error'
}
