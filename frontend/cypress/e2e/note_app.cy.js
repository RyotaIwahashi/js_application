// cypressは内部で使用するMochaテストライブラリからdescribeやitを使用する
// Mocha はthisをbindしないようにアロー関数を使用しないことを推奨している。参照:https://mochajs.org/#arrow-functions
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Ryota app 2023')
  })
})
