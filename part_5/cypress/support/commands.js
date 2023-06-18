Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
    cy.visit('')
  })
})
