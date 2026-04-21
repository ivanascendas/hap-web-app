import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectToken } from "@shared/redux/slices/authSlice";
import { getTokenExpiryMs } from "@shared/utils/jwtDecoder";
import { showToast } from "@shared/utils/showToast";

export const TOKEN_EXPIRY_WARNING_MS = 5 * 60 * 1000;

/**
 * Returns the delay before the token-expiry warning should be shown.
 * Returns null when the token is invalid or already expired.
 */
export function getTokenExpiryWarningDelay(
  token: string,
  nowMs = Date.now(),
): number | null {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs || expiryMs <= nowMs) return null;

  return Math.max(expiryMs - nowMs - TOKEN_EXPIRY_WARNING_MS, 0);
}

/**
 * Shows a one-time warning shortly before the current JWT expires.
 *
 * There is no refresh-token endpoint in the frontend service layer, so the
 * warning tells the user to save their work instead of offering silent refresh.
 */
export function useTokenExpiryWarning(): void {
  const tokenData = useSelector(selectToken);
  const { t } = useTranslation();
  const warnedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const accessToken = tokenData?.access_token;
    if (!accessToken) {
      warnedTokenRef.current = null;
      return;
    }

    warnedTokenRef.current = null;
    const delayMs = getTokenExpiryWarningDelay(accessToken);
    if (delayMs === null) return;

    const timeoutId = window.setTimeout(() => {
      if (warnedTokenRef.current === accessToken) return;
      warnedTokenRef.current = accessToken;
      showToast("warning", t("ERRORS.SESSION_EXPIRING_WARNING"), {
        autoClose: TOKEN_EXPIRY_WARNING_MS,
      });
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [tokenData?.access_token, t]);
}
