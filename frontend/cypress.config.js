// eslintの設定がよくわからないのでとりあえずdisableにした。https://github.com/cypress-io/eslint-plugin-cypress
/* eslint-disable */
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      BACKEND: 'http://localhost:8080/api'
    }
  },
});
