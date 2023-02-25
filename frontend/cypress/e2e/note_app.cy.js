// cypressは内部で使用するMochaテストライブラリからdescribeやitを使用する
// Mocha はthisをbindしないようにアロー関数を使用しないことを推奨している。参照:https://mochajs.org/#arrow-functions
describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:8080/api/testing/reset')
    const user = {
      name: 'testuser',
      username: 'testuser',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:8080/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Ryota app 2023')
  })

  it('user can login', function () {
    cy.contains('login').click()
    // cypressのベストプラクティスは、data-cy という属性を与えることらしい。
    // 参照:https://docs.cypress.io/guides/references/best-practices#How-It-Works
    cy.get('[data-testid=username]').type('testuser')
    cy.get('[data-testid=password]').type('password')
    cy.get('[data-testid=login-button]').click()

    cy.contains('testuser logged in')
  })

  // describeが入ると状態が完全にリセットされる
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('[data-testid=username]').type('testuser')
      cy.get('[data-testid=password]').type('password')
      cy.get('[data-testid=login-button]').click()
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('[data-testid=note-input]').type('a note created by cypress')
      cy.get('[data-testid=note-save]').click()
      cy.contains('a note created by cypress')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('[data-testid=username]').type('testuser')
      cy.get('[data-testid=password]').type('password')
      cy.get('[data-testid=login-button]').click()
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('[data-testid=note-input]').type('another note cypress')
        cy.get('[data-testid=note-save]').click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click()

        cy.contains('another note cypress')
          .contains('make important')
      })
    })
  })
})
