// eslintの設定がよくわからないのでとりあえずdisableにした。https://github.com/cypress-io/eslint-plugin-cypress
/* eslint-disable */
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
