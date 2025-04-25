const { defineConfig } = require("cypress");
const webpackConfig = require('./cypress/webpack.config.js');

module.exports = defineConfig({
  projectId: '4af4fb86-d18d-400f-bc6f-b2ee29582448',
  e2e: {
    baseUrl: 'https://aretialliance.com', // Point to main website
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  },
component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: "cypress/component/**/*.{js,jsx,ts,tsx}",
  },
});