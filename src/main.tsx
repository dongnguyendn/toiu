import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

if (typeof window !== "undefined") {
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args) => {
    const msg = args.join(" ");
    if (msg.includes("websocket") || msg.includes("HMR") || msg.includes("WebSocket") || msg.includes("vite") || msg.includes("closed without opened") || msg.includes("unhandledrejection")) {
      return;
    }
    originalError.apply(console, args);
  };
  console.warn = (...args) => {
    const msg = args.join(" ");
    if (msg.includes("websocket") || msg.includes("HMR") || msg.includes("WebSocket") || msg.includes("vite") || msg.includes("closed without opened") || msg.includes("unhandledrejection")) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary moduleName="Hệ thống Học Lộ trình Tối ưu">
      <App />
    </ErrorBoundary>
  </StrictMode>
);
