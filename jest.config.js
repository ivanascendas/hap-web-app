/* eslint-env node */
/* eslint-disable no-undef */
module.exports = {
  preset: "react-scripts",
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/themes/new_design/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@standard-schema/(.*)$": "<rootDir>/src/__mocks__/@standard-schema.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@standard-schema|@reduxjs/toolkit)/)",
  ],
  testEnvironment: "jsdom",
};
