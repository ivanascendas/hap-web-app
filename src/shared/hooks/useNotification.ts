import { useCallback } from "react";
import { useSnackbar } from "notistack";

/**
 * Custom hook for showing notifications
 * Uses notistack for displaying snackbar notifications
 */
export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "success",
        autoHideDuration: 3000,
      });
    },
    [enqueueSnackbar],
  );

  const showError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 4000,
      });
    },
    [enqueueSnackbar],
  );

  const showWarning = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "warning",
        autoHideDuration: 3500,
      });
    },
    [enqueueSnackbar],
  );

  const showInfo = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "info",
        autoHideDuration: 3000,
      });
    },
    [enqueueSnackbar],
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
