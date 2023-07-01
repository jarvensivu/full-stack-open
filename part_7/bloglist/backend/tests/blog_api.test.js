const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany([])
  await helper.addLoginUser()
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
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlog)
    const newBlog = response.body
    const blogsAtEnd = await helper.blogsInDb()

    expect(newBlog.title).toEqual(helper.newBlog.title)
    expect(newBlog.author).toEqual(helper.newBlog.author)
    expect(newBlog.url).toEqual(helper.newBlog.url)
    expect(newBlog.user.username).toEqual(loggedUser.body.username)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('should add a blog with zero likes if the likes property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlogWithoutLikes)
    const newBlog = response.body
    const blogsAtEnd = await helper.blogsInDb()

    expect(newBlog.likes).toBe(0)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('should fail if the title property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutTitle).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('should fail if the url property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutUrl).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
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
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    const response = await api.post('/api/blogs').set('authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlog)
    const blogsAfterAddition = await helper.blogsInDb()

    await api.delete(`/api/blogs/${response.body.id}`).set('authorization', `Bearer ${loggedUser.body.token}`).expect(204)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAfterAddition).toHaveLength(blogsAtStart.length + 1)
    expect(blogsAtEnd).toHaveLength(blogsAfterAddition.length - 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
