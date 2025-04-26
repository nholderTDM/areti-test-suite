const { defineConfig } = require("cypress");
const path = require('path');

module.exports = defineConfig({
  projectId: 'areti-test-suite',
  reporter: 'spec',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 1,
    openMode: 0
  },
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: 'https://aretialliance.com',
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
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
      webpackConfig: require('./cypress/webpack.config.js')
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: "cypress/component/**/*.{js,jsx,ts,tsx}",
  },
  env: {
    // Global environment variables
    clearCookiesBeforeTests: true,
    clearLocalStorageBeforeTests: true,
    browser: 'firefox'
  }
});