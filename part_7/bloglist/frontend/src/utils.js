export const sortBlogs = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}

export const parseErrorMessage = (error) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.error
  ) {
    return error.response.data.error
  }
  return 'unknown error'
}
