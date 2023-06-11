const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('creating a user', () => {
  test('should add new user if the username is unique and the password is long enough', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users/')
      .send(helper.uniqueUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('should fail if the username is not unique', async () => {
    await api
      .post('/api/users/')
      .send(helper.notUniqueUser)
      .expect(400)
  })

  test('should fail if the password is missing', async () => {
    await api
      .post('/api/users/')
      .send(helper.userWithOutPassword)
      .expect(400)
  })

  test('should fail if the password is too short', async () => {
    await api
      .post('/api/users/')
      .send(helper.userWithTooShortPassword)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})