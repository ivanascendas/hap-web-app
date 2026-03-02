import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@shared/redux/store";
import { AuthProvider } from "@shared/providers/Auth.provider";
import App from "./App";

test("App renders without crashing", () => {
  render(
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>,
  );
});
