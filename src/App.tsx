import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";
import "./shared/utils/i18n";
console.log(process.env);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
