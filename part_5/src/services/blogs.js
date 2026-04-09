const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await fetch(baseUrl)
  return response.json()
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify(newBlog)
  })
  return response.json()
}

const update = async updatedBlog => {
  const response = await fetch(`${baseUrl}/${updatedBlog.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBlog)
  })
  return response.json()
}

const remove = async id => {
  const config = {
    headers: { Authorization: token }
  }
  return await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      ...config.headers
    }
  })
}

const blogService = { setToken, getAll, create, update, remove }

export default blogService