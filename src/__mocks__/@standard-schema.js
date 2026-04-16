/* eslint-env node */
/* eslint-disable no-undef */
// Mock for @standard-schema to avoid ES module issues in Jest
class SchemaError extends Error {
  constructor(issues) {
    super("Schema validation error");
    this.issues = issues;
  }
}

module.exports = {
  standardSchemaValidator: () => ({}),
  SchemaError,
};
