import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";
import "./shared/utils/i18n";
import { AuthProvider } from "./shared/providers/Auth.provider";
function App() {
  return <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>;
}

export default App;
