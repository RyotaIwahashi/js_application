// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
// 参照: https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Reusing-the-login-code
Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username: username, password: password
  }).then(response => {
    // thenメソッドでrequestへの応答にアクセスできる
    localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
    cy.visit('/')
  })
})

Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/notes`,
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('/')
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
