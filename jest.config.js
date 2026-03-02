/* eslint-env node */
/* eslint-disable no-undef */
module.exports = {
  preset: "react-scripts",
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/themes/new_design/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@themes/(.*)$": "<rootDir>/src/themes/$1",
    "^@standard-schema/(.*)$": "<rootDir>/src/__mocks__/@standard-schema.js",
    "^intl-tel-input/react$": "<rootDir>/src/__mocks__/intl-tel-input-react.js",
    "^intl-tel-input(.*)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^react-pdf(.*)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^pdfjs-dist(.*)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^yet-another-react-lightbox(.*)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$":
      "<rootDir>/src/__mocks__/fileMock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@standard-schema|@reduxjs/toolkit)/)",
  ],
  testEnvironment: "jsdom",
};
