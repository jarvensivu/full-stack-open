import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setNewBlog((newBlog) => ({
      ...newBlog,
      [name]: value,
    }))
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    const success = await addBlog(newBlog)
    if (success) setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <>
      <h2>create new</h2>
      <form id='form' onSubmit={handleBlogSubmit}>
        <div>
          title:
          <input
            id='title'
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleFormChange}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleFormChange}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleFormChange}
          />
        </div>
        <button id="create" type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
