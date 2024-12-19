// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "normalize.css";
import "@/assets/styles/reset.css";
// 本地SVG图标
import "virtual:svg-icons-register";
import { Provider } from "react-redux";
import store from "@/store";
import { ToastProvider } from "@/components/ToastProvider";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Provider>
  // </StrictMode>
);
