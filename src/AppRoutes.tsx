import { createBrowserRouter } from "react-router-dom";

import { MainComponent } from "./features/main/Main.component";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainComponent />,
  },
]);
