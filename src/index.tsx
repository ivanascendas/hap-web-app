import React from "react";
import ReactDOM from "react-dom/client";
import axe from "@axe-core/react";
import "./assets/styles/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./shared/redux/store";

const axeConf = {
  rules: [
    { id: "heading-order", enabled: true },
    { id: "label-title-only", enabled: true },
    { id: "link-in-text-block", enabled: true },
    { id: "region", enabled: true },
    { id: "skip-link", enabled: true },
    { id: "help-same-as-label", enabled: true },
  ],
};

if (process.env.NODE_ENV !== "production") {
  axe(React, ReactDOM, 1000, axeConf);
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
