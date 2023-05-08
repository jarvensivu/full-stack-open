const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  const blog = blogs.reduce((favourite, current) => favourite.likes > current.likes ? favourite : current)
  return { title: blog.title, author: blog.author, likes: blog.likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}