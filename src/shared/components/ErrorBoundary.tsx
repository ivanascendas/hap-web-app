import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorBoundaryProps {
  /** Content to render when no error has occurred. */
  children: ReactNode;
  /**
   * Optional custom fallback UI. When provided, it receives the error and a
   * reset callback. When omitted, the default fallback is rendered.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional label shown in logs / UI to identify *which* boundary caught the error. */
  name?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Generic React Error Boundary.
 *
 * Catches unhandled JS errors in its child tree, logs them to the console,
 * and renders a user-friendly fallback UI with a "Reload" / "Try again" button.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary name="Upload">
 *   <UploadDocumentModal … />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const label = this.props.name ? `[${this.props.name}] ` : "";
    console.error(
      `${label}ErrorBoundary caught an error:`,
      error,
      info.componentStack,
    );
  }

  private handleReset = (): void => {
    this.setState({ error: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    // Allow parent to supply custom fallback
    if (this.props.fallback) {
      return this.props.fallback(error, this.handleReset);
    }

    // Default fallback UI
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        p={3}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 480,
            textAlign: "center",
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            An unexpected error occurred. You can try again or reload the page.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="outlined" onClick={this.handleReset}>
              Try again
            </Button>
            <Button variant="contained" onClick={this.handleReload}>
              Reload page
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
}

export default ErrorBoundary;
