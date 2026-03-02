/* eslint-env node */
/* eslint-disable no-undef */
// Mock for react-pdf
const React = require("react");

const Document = function Document({ children }) {
  return children || null;
};
const Page = function Page() {
  return null;
};
const pdfjs = {
  GlobalWorkerOptions: {},
  getDocument: () => ({ promise: Promise.resolve({}) }),
};

module.exports = { Document, Page, pdfjs };
module.exports.default = { Document, Page, pdfjs };
