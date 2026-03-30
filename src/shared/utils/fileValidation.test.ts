import {
  validateFile,
  validateFiles,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_LABEL,
} from "./fileValidation";

/**
 * Helper to create a mock File object.
 */
function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(["x".repeat(Math.min(size, 64))], { type });
  Object.defineProperty(blob, "size", { value: size });
  Object.defineProperty(blob, "name", { value: name });
  return blob as File;
}

describe("fileValidation", () => {
  describe("constants", () => {
    it("MAX_FILE_SIZE_BYTES equals 10 MB", () => {
      expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
    });

    it("MAX_FILE_SIZE_LABEL is human-readable", () => {
      expect(MAX_FILE_SIZE_LABEL).toBe("10 MB");
    });

    it("ALLOWED_MIME_TYPES contains expected types", () => {
      expect(ALLOWED_MIME_TYPES).toContain("application/pdf");
      expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
      expect(ALLOWED_MIME_TYPES).toContain("image/png");
      expect(ALLOWED_MIME_TYPES).toContain("image/tiff");
    });

    it("ALLOWED_EXTENSIONS includes all supported formats", () => {
      expect(ALLOWED_EXTENSIONS).toContain(".pdf");
      expect(ALLOWED_EXTENSIONS).toContain(".jpg");
      expect(ALLOWED_EXTENSIONS).toContain(".jpeg");
      expect(ALLOWED_EXTENSIONS).toContain(".png");
      expect(ALLOWED_EXTENSIONS).toContain(".tiff");
      expect(ALLOWED_EXTENSIONS).toContain(".tif");
    });
  });

  describe("validateFile", () => {
    it("returns null for a valid PDF under 10 MB", () => {
      const file = createMockFile(
        "doc.pdf",
        5 * 1024 * 1024,
        "application/pdf",
      );
      expect(validateFile(file)).toBeNull();
    });

    it("returns null for a valid JPEG", () => {
      const file = createMockFile("photo.jpg", 1024, "image/jpeg");
      expect(validateFile(file)).toBeNull();
    });

    it("returns null for a valid PNG", () => {
      const file = createMockFile("img.png", 2048, "image/png");
      expect(validateFile(file)).toBeNull();
    });

    it("returns null for a valid TIFF", () => {
      const file = createMockFile("scan.tiff", 4096, "image/tiff");
      expect(validateFile(file)).toBeNull();
    });

    it("returns null for a file exactly at the size limit", () => {
      const file = createMockFile(
        "exact.pdf",
        MAX_FILE_SIZE_BYTES,
        "application/pdf",
      );
      expect(validateFile(file)).toBeNull();
    });

    it("rejects a file that exceeds 10 MB", () => {
      const file = createMockFile(
        "big.pdf",
        MAX_FILE_SIZE_BYTES + 1,
        "application/pdf",
      );
      const result = validateFile(file);
      expect(result).not.toBeNull();
      expect(result!.code).toBe("FILE_TOO_LARGE");
      expect(result!.i18nKey).toBe("REFUNDS.UPLOAD.FILE_TOO_LARGE");
    });

    it("rejects an unsupported MIME type (e.g. text/plain)", () => {
      const file = createMockFile("readme.txt", 100, "text/plain");
      const result = validateFile(file);
      expect(result).not.toBeNull();
      expect(result!.code).toBe("INVALID_FILE_TYPE");
      expect(result!.i18nKey).toBe("REFUNDS.UPLOAD.INVALID_FILE_TYPE");
    });

    it("rejects an executable file", () => {
      const file = createMockFile(
        "malware.exe",
        100,
        "application/x-msdownload",
      );
      const result = validateFile(file);
      expect(result).not.toBeNull();
      expect(result!.code).toBe("INVALID_FILE_TYPE");
    });

    it("rejects an empty MIME type", () => {
      const file = createMockFile("unknown", 100, "");
      const result = validateFile(file);
      expect(result).not.toBeNull();
      expect(result!.code).toBe("INVALID_FILE_TYPE");
    });

    it("checks type before size (invalid type + too large)", () => {
      const file = createMockFile(
        "huge.txt",
        MAX_FILE_SIZE_BYTES + 1,
        "text/plain",
      );
      const result = validateFile(file);
      // Type error should come first
      expect(result!.code).toBe("INVALID_FILE_TYPE");
    });
  });

  describe("validateFiles", () => {
    it("returns null for an empty array", () => {
      expect(validateFiles([])).toBeNull();
    });

    it("returns null when all files are valid", () => {
      const files = [
        createMockFile("a.pdf", 1024, "application/pdf"),
        createMockFile("b.png", 2048, "image/png"),
      ];
      expect(validateFiles(files)).toBeNull();
    });

    it("returns the first error when one file is invalid", () => {
      const files = [
        createMockFile("good.pdf", 1024, "application/pdf"),
        createMockFile("bad.txt", 100, "text/plain"),
      ];
      const result = validateFiles(files);
      expect(result).not.toBeNull();
      expect(result!.code).toBe("INVALID_FILE_TYPE");
    });

    it("returns error when one file is too large", () => {
      const files = [
        createMockFile("small.pdf", 1024, "application/pdf"),
        createMockFile("huge.pdf", MAX_FILE_SIZE_BYTES + 1, "application/pdf"),
      ];
      const result = validateFiles(files);
      expect(result).not.toBeNull();
      expect(result!.code).toBe("FILE_TOO_LARGE");
    });
  });
});
