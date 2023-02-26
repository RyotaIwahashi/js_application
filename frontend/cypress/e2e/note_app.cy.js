// cypressは、日常のローカル開発のためのツールとして構築され、最適化されている。
// 参照: https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Bypassing-your-UI

// cypressは内部で使用するMochaテストライブラリからdescribeやitを使用する
// Mocha はthisをbindしないようにアロー関数を使用しないことを推奨している。参照:https://mochajs.org/#arrow-functions
describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'testuser',
      username: 'testuser',
      password: 'password'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('/')
  })

  // it(テストケース)ごとに状態が完全にリセットされ、毎回beforeEachが実行される
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

  // it.only(...)とすると、cypressがonlyのついたテストのみを実行するようになる。
  // なので、新たに一つのテストを実装するときはそのテストにonlyをつけると良い。
  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('[data-testid=username]').type('testuser')
    cy.get('[data-testid=password]').type('wrong')
    cy.get('[data-testid=login-button]').click()

    // cy.get('.error').contains('Wrong credentials')

    // shouldならいろんなことがテストできる。
    // 参照: https://docs.cypress.io/guides/references/assertions#Common-Assertions
    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'testuser logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      // バイパス:経由・迂回という意味。UIをバイパスするとは、UIを迂回する(使わない)という意味？
      // UIからのログインのテストは一回のみにして、あとはAPIを使ってログインを済ませておくのが時短のために良いらしい。
      // なおloginは自分でつくったコマンド → support/commands.js
      cy.login('testuser', 'password')
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('[data-testid=note-input]').type('a note created by cypress')
      cy.get('[data-testid=note-save]').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        // ノートをUIから作るテストはすでにあるので、これ以降はAPI経由でやる
        cy.createNote({
          content: 'another note cypress',
          important: true
        })
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
