import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";
import React, { useState } from "react";
import "@shared/utils/i18n";
import { IdleTimerProvider } from "react-idle-timer";
import { useAuth } from "@shared/providers/Auth.provider";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { IdlePopupModal } from "@shared/components/IdlePopup.modal";
import { ConfigurationProvider } from "@shared/providers/Configuration.provider";
import { useConfiguration } from "@shared/hooks/useConfiguration";

function AppContent() {
  const [shoeIDLE, setShowIDLE] = useState(false);
  const { isAuthenticated } = useAuth();
  const { config } = useConfiguration();
  const theme = createTheme({
    palette: {
      primary: {
        main: "#7a003c",
      },
      secondary: {
        main: "#f5f7fa",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 540,
        md: 768,
        lg: 900,
        xl: 1240,
      },
    },
  });

  const handleOnIdle = async () => {
    setShowIDLE(isAuthenticated);
  };

  return (
    <ThemeProvider theme={theme}>
      <IdleTimerProvider
        timeout={config?.idle || 600000} // 10 minutes
        onIdle={handleOnIdle}
      >
        <RouterProvider router={router} />
      </IdleTimerProvider>
      {shoeIDLE && (
        <IdlePopupModal open={shoeIDLE} onClose={() => setShowIDLE(false)} />
      )}
    </ThemeProvider>
  );
}

function App() {
  return (
    <ConfigurationProvider>
      <AppContent />
    </ConfigurationProvider>
  );
}
export default App;
