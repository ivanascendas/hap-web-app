import { createBrowserRouter } from "react-router-dom";

import { MainComponent } from "./features/main/main.component";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainComponent />,
  },
]);
