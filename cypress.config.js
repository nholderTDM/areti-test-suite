const { defineConfig } = require("cypress");
const webpackConfig = require('./cypress/webpack.config.js');

module.exports = defineConfig({
  projectId: '4af4fb86-d18d-400f-bc6f-b2ee29582448',
  reporter: 'spec', // Change to a simple reporter for now
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
      // Access environment variables
      const testEnv = process.env.TEST_ENV || 'website';
      
      // Change configuration based on test environment
      if (testEnv === 'crm') {
        config.baseUrl = 'https://aretialliance.com/dashboard';
        config.env.appTarget = 'crm';
      } else {
        config.baseUrl = 'https://aretialliance.com';
        config.env.appTarget = 'website';
      }
      
      // Return the updated config
      return config;
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
  env: {
    // Global environment variables
    clearCookiesBeforeTests: true,
    clearLocalStorageBeforeTests: true
  }
});