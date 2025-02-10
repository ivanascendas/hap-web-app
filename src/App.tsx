import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";
import "./shared/utils/i18n";
import { IdleTimerProvider } from "react-idle-timer";
import { useAuth } from "./shared/providers/Auth.provider";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import { IdlePopupModal } from "./shared/components/IdlePopup.modal";
function App() {
  const [shoeIDLE, setShowIDLE] = useState(false);
  const { isAuthenticated } = useAuth();
  const theme = createTheme({
    palette: {
      primary: {
        main: "#ef642d",
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
  console.log(process.env.REACT_APP_IDLE);

  return (
    <ThemeProvider theme={theme}>
      <IdleTimerProvider
        timeout={
          process.env.REACT_APP_IDLE
            ? parseInt(process.env.REACT_APP_IDLE)
            : undefined
        } // 10 minutes
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
export default App;
