import { mapTextractError } from "./getErrorMessage";

// Mock i18next — return the key directly so we can assert on the i18n key
jest.mock("i18next", () => ({
  t: (key: string) => key,
}));

describe("mapTextractError", () => {
  it("maps UnsupportedDocumentException message", () => {
    const result = mapTextractError(
      "Document format not supported. Textract supports PDF, PNG, JPEG, and TIFF formats only.",
    );
    expect(result).toBe("ERRORS.TEXTRACT_UNSUPPORTED_DOCUMENT");
  });

  it("maps BadDocumentException message", () => {
    const result = mapTextractError(
      "Document is corrupted or cannot be processed. Please verify the file integrity.",
    );
    expect(result).toBe("ERRORS.TEXTRACT_BAD_DOCUMENT");
  });

  it("maps DocumentTooLargeException message", () => {
    const result = mapTextractError(
      "Document size exceeds the maximum allowed size of 5 MB for direct upload.",
    );
    expect(result).toBe("ERRORS.TEXTRACT_DOCUMENT_TOO_LARGE");
  });

  it("maps InvalidParameterException message", () => {
    const result = mapTextractError(
      "Invalid document parameters. The document may be corrupted or in an unsupported format.",
    );
    expect(result).toBe("ERRORS.TEXTRACT_INVALID_PARAMETER");
  });

  it("maps throttling message", () => {
    const result = mapTextractError("Too many requests, please slow down.");
    expect(result).toBe("ERRORS.TEXTRACT_THROTTLING");
  });

  it("maps service unavailable message", () => {
    const result = mapTextractError("Service unavailable, try later.");
    expect(result).toBe("ERRORS.TEXTRACT_SERVICE_UNAVAILABLE");
  });

  it("maps generic processing error", () => {
    const result = mapTextractError(
      "Document could not be processed. Please try again or contact support.",
    );
    expect(result).toBe("ERRORS.TEXTRACT_PROCESSING_ERROR");
  });

  it("returns null for non-Textract error messages", () => {
    expect(mapTextractError("Access denied")).toBeNull();
    expect(mapTextractError("Session expired")).toBeNull();
    expect(mapTextractError("")).toBeNull();
  });

  it("is case-insensitive", () => {
    const result = mapTextractError("DOCUMENT FORMAT NOT SUPPORTED");
    expect(result).toBe("ERRORS.TEXTRACT_UNSUPPORTED_DOCUMENT");
  });
});
