// cypressは内部で使用するMochaテストライブラリからdescribeやitを使用する
// Mocha はthisをbindしないようにアロー関数を使用しないことを推奨している。参照:https://mochajs.org/#arrow-functions
describe('Note app', function() {
  beforeEach(function() {
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
})
