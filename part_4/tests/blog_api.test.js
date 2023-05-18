const mongoose = require('mongoose')
const supertest = require('supertest')
const lodash = require('lodash')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('reading the blogs', () => {
  test('should return blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should return correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('should return blogs with right unique identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

describe('creating of a new blog', () => {
  test('should add one blog that has the right content', async () => {
    const response = await api.post('/api/blogs').send(helper.newBlog)
    const newBlog = response.body
    expect(lodash.omit(newBlog, 'id')).toEqual(helper.newBlog)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd).toContainEqual(newBlog)
  })

  test('should add a blog with zero likes if the likes property is missing', async () => {
    const response = await api
      .post('/api/blogs/')
      .send(helper.newBlogWithoutLikes)
    const newBlog = response.body
    expect(lodash.omit(newBlog, 'id', 'likes')).toEqual(
      helper.newBlogWithoutLikes
    )
    expect(newBlog.likes).toBe(0)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd).toContainEqual(newBlog)
  })

  test('should fail if the title property is missing', async () => {
    await api.post('/api/blogs/').send(helper.blogWithoutTitle).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('should fail if the url property is missing', async () => {
    await api.post('/api/blogs/').send(helper.blogWithoutUrl).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('updating of a blog', () => {
  test('should update details of an existing blog successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeUpdated = { ...blogsAtStart[0] }
    blogToBeUpdated.likes++

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogToBeUpdated)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.id === blogToBeUpdated.id
    )
    expect(updatedBlog).toEqual(blogToBeUpdated)
  })
})

describe('deletion of a blog', () => {
  test('should succeed with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
