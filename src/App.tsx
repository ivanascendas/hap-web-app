import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";
import "./shared/utils/i18n";
import { AuthProvider } from "./shared/providers/Auth.provider";
import { ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#ef642d',
      },
      secondary: {
        main: '#f5f7fa',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 540,
        md: 768,
        lg: 900,
        xl: 1240
      },
    },
  });
  return <AuthProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>;
}

export default App;
