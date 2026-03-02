const path = require("path");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "src/themes/new_design"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  };

  return config;
};

module.exports.jest = function (config) {
  const extraMappings = {
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
  };
  if (Array.isArray(config.moduleNameMapper)) {
    const existingKeys = new Set(Object.keys(extraMappings));
    const filtered = config.moduleNameMapper.filter(
      ([k]) => !existingKeys.has(k),
    );
    config.moduleNameMapper = [...Object.entries(extraMappings), ...filtered];
  } else {
    config.moduleNameMapper = {
      ...extraMappings,
      ...(config.moduleNameMapper || {}),
    };
  }
  config.transformIgnorePatterns = [
    "node_modules/(?!(@standard-schema|@reduxjs/toolkit)/)",
  ];
  return config;
};
