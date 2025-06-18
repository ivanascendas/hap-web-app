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
