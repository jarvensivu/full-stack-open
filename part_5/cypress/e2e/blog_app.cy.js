describe('Blog app', function () {
  const testUser = {
    name: 'Test User',
    username: 'test.user@test.com',
    password: 'secret',
  }

  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, testUser)
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#login-button').click()

      cy.contains(`${testUser.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.contains(`${testUser.name} logged in`).should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: testUser.username, password: testUser.password })
    })

    it('A blog can be created', function() {
      const testBlog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testblog.com',
      }

      cy.contains('new blog').click()
      cy.get('#title').type(testBlog.title)
      cy.get('#author').type(testBlog.author)
      cy.get('#url').type(testBlog.url)

      cy.get('#create').click()
      cy.contains(`a new blog ${testBlog.title} by ${testBlog.author} added`)
      cy.contains(`${testBlog.title} ${testBlog.author}`)
    })
  })
})
