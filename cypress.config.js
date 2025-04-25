const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'skab56',
  e2e: {
    baseUrl: 'https://aretialliance.com', // Replace with your actual domain
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Set to true if you want video recordings
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});