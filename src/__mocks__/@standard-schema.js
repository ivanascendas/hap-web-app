/* eslint-env node */
/* eslint-disable no-undef */
// Mock for @standard-schema to avoid ES module issues in Jest
module.exports = {
  standardSchemaValidator: () => ({}),
};
