import { toast, ToastOptions, ToastContent } from "react-toastify";

/**
 * Derive a stable toast ID from a message string so that react-toastify's
 * built-in deduplication prevents showing the same notification twice.
 *
 * If the message is short enough (<= 64 chars), use it directly.
 * Otherwise, use a simple hash to keep the ID compact.
 */
function toastIdFromMessage(message: string): string {
  if (message.length <= 64) return message;
  // Simple FNV-1a-like hash — just needs to be deterministic, not cryptographic
  let hash = 0x811c9dc5;
  for (let i = 0; i < message.length; i++) {
    hash ^= message.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return `toast-${hash.toString(16)}`;
}

type ToastType = "success" | "error" | "info" | "warning";

/**
 * Show a toast notification with automatic deduplication.
 *
 * If a toast with the same message is already visible, a new one will NOT
 * be created (react-toastify ignores duplicate `toastId`s).
 *
 * @param type - success | error | info | warning
 * @param message - the text to display (used as dedup key)
 * @param options - optional react-toastify overrides
 */
export function showToast(
  type: ToastType,
  message: string,
  options?: Omit<ToastOptions, "toastId">,
): void {
  const id = toastIdFromMessage(message);
  const opts: ToastOptions = { ...options, toastId: id };

  switch (type) {
    case "success":
      toast.success(message, opts);
      break;
    case "error":
      toast.error(message, opts);
      break;
    case "info":
      toast.info(message, opts);
      break;
    case "warning":
      toast.warning(message, opts);
      break;
  }
}

/**
 * Show a toast with a custom React content component.
 * Used by NotificationComponent for its styled toasts.
 */
export function showToastContent(
  type: ToastType,
  content: ToastContent<any>,
  message: string,
  options?: Omit<ToastOptions, "toastId">,
): void {
  const id = toastIdFromMessage(message);
  const opts: ToastOptions = { ...options, toastId: id };

  switch (type) {
    case "success":
      toast.success(content, opts);
      break;
    case "error":
      toast.error(content, opts);
      break;
    case "info":
      toast.info(content, opts);
      break;
    case "warning":
      toast.warning(content, opts);
      break;
  }
}
