import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { initColours } from "./utils/appearanceColors";
import { initTheme } from "./utils/theme";

// Stamped before the first paint, so the page never shows one appearance and
// then corrects itself.
initTheme();
initColours();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
