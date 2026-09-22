import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import "./style.css";
import "./theme.css";

const el = document.getElementById("root");
if (!el) throw new Error("Missing #root");

const root = createRoot(el);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
