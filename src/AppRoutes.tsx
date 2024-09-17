import { createBrowserRouter } from "react-router-dom";

import { MainComponent } from "./features/main/Main.component";
import { Protected } from "./shared/components/Protected";
import { StatementComponent } from "./features/statement/Statement.component";
import { AuthComponent } from "./features/auth/Auth.component";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthComponent />,
  },
  {
    index: true,
    path: "/statement",
    element: <Protected component={<StatementComponent />} />,
  },
]);
