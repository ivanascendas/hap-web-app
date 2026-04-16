import { toast } from "react-toastify";
import { showToast } from "./showToast";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

describe("showToast", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls toast.success with a toastId derived from message", () => {
    showToast("success", "Operation succeeded");
    expect(toast.success).toHaveBeenCalledWith("Operation succeeded", {
      toastId: "Operation succeeded",
    });
  });

  it("calls toast.error with a toastId derived from message", () => {
    showToast("error", "Something failed");
    expect(toast.error).toHaveBeenCalledWith("Something failed", {
      toastId: "Something failed",
    });
  });

  it("calls toast.info", () => {
    showToast("info", "FYI");
    expect(toast.info).toHaveBeenCalledWith("FYI", { toastId: "FYI" });
  });

  it("calls toast.warning", () => {
    showToast("warning", "Careful");
    expect(toast.warning).toHaveBeenCalledWith("Careful", {
      toastId: "Careful",
    });
  });

  it("deduplicates: same message produces the same toastId", () => {
    showToast("error", "Duplicate");
    showToast("error", "Duplicate");

    // Both calls use the same toastId, react-toastify deduplicates internally
    const calls = (toast.error as jest.Mock).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[0][1].toastId).toBe(calls[1][1].toastId);
  });

  it("hashes long messages (>64 chars) to a compact toastId", () => {
    const longMsg = "A".repeat(100);
    showToast("error", longMsg);

    const call = (toast.error as jest.Mock).mock.calls[0];
    const toastId = call[1].toastId;
    // Should be hashed, not the raw 100-char string
    expect(toastId.startsWith("toast-")).toBe(true);
    expect(toastId.length).toBeLessThan(longMsg.length);
  });

  it("merges extra options while preserving toastId", () => {
    showToast("success", "Done", { autoClose: 3000 });
    expect(toast.success).toHaveBeenCalledWith("Done", {
      toastId: "Done",
      autoClose: 3000,
    });
  });
});
