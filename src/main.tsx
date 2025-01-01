// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "normalize.css";
import "@/assets/styles/reset.css";
import "@/assets/styles/main.css";
// 本地SVG图标
import "virtual:svg-icons-register";
import { Provider } from "react-redux";
import { AliveScope } from "react-activation";
import store from "@/store";
import { ToastProvider } from "@/components/ToastProvider";
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <AliveScope>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AliveScope>
  </Provider>,
  // </StrictMode>
);
