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
    const firstBlog = {
      title: 'First Title',
      author: 'First Author',
      url: 'http://firstblog.com',
      likes: 2
    }

    const secondBlog = {
      title: 'Second Title',
      author: 'Second Author',
      url: 'http://secondblog.com',
      likes: 1
    }

    const thirdBlog = {
      title: 'Third Title',
      author: 'Third Author',
      url: 'http://thirdblog.com',
      likes: 3,
    }

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

    it('A blog can be liked', function() {
      cy.createBlog(firstBlog)
      cy.get('#toggle-visibility-button').click()
      cy.get('#likes-button').click()
      cy.contains('likes 3')
    })

    it('A blog can be deleted by the creator of the blog', function() {
      cy.createBlog(thirdBlog)
      cy.get('#toggle-visibility-button').click()
      cy.get('#remove-button').click()
      cy.contains(`blog ${thirdBlog.title} by ${thirdBlog.author} was deleted`)
      cy.contains(`${thirdBlog.title} ${thirdBlog.author}`).should('not.exist')
    })

    it('Only creator of the blog can see the remove button of the blog', function() {
      cy.createBlog(firstBlog)
      cy.contains('First Title First Author')
      cy.get('#toggle-visibility-button').click()
      cy.get('#remove-button').should('exist')

      const anotherUser = {
        name: 'Another User',
        username: 'another.user@test.com',
        password: 'secret',
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
      cy.login({ username: anotherUser.username, password: anotherUser.password })
      cy.contains('First Title First Author')
      cy.get('#toggle-visibility-button').click()
      cy.get('#remove-button').should('not.exist')
    })

    it('Blogs are in descending order according to likes', function() {
      cy.createBlog(firstBlog)
      cy.createBlog(secondBlog)
      cy.createBlog(thirdBlog)

      cy.get('.blog').eq(0).contains('Third Title Third Author')
      cy.get('.blog').eq(1).contains('First Title First Author')
      cy.get('.blog').eq(2).contains('Second Title Second Author')

      cy.get('.blog').eq(1).find('#toggle-visibility-button').click()
      cy.get('#likes-button').click()
      cy.contains('likes 3')
      cy.get('#likes-button').click()
      cy.contains('likes 4')

      cy.get('.blog').eq(0).contains('First Title First Author')
      cy.get('.blog').eq(1).contains('Third Title Third Author')
      cy.get('.blog').eq(2).contains('Second Title Second Author')
    })
  })
})
