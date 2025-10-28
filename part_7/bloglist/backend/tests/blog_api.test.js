const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
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
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('should return blogs with right unique identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
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

    assert.strictEqual(newBlog.title, helper.newBlog.title)
    assert.strictEqual(newBlog.author, helper.newBlog.author)
    assert.strictEqual(newBlog.url, helper.newBlog.url)
    assert.strictEqual(newBlog.user.username, loggedUser.body.username)
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  })

  test('should add a blog with zero likes if the likes property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlogWithoutLikes)
    const newBlog = response.body
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(newBlog.likes, 0)
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  })

  test('should fail if the title property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutTitle).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('should fail if the url property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutUrl).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
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
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.id === blogToBeUpdated.id
    )
    assert.deepStrictEqual(updatedBlog, blogToBeUpdated)
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

    assert.strictEqual(blogsAfterAddition.length, blogsAtStart.length + 1)
    assert.strictEqual(blogsAtEnd.length, blogsAfterAddition.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
