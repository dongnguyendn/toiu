import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { Navigate } from "react-router-dom";
import { useAuth } from "/src/context/AuthContext.tsx";
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center font-sans", children: /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" }, void 0, false, {
        fileName: "/app/applet/src/routes/ProtectedRoute.tsx",
        lineNumber: 16,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500", children: "Đang đồng bộ khóa học dữ liệu AI..." }, void 0, false, {
        fileName: "/app/applet/src/routes/ProtectedRoute.tsx",
        lineNumber: 17,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/ProtectedRoute.tsx",
      lineNumber: 15,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/ProtectedRoute.tsx",
      lineNumber: 14,
      columnNumber: 7
    }, this);
  }
  if (!user) {
    return /* @__PURE__ */ jsxDEV(Navigate, { to: "/login", replace: true }, void 0, false, {
      fileName: "/app/applet/src/routes/ProtectedRoute.tsx",
      lineNumber: 24,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children }, void 0, false, {
    fileName: "/app/applet/src/routes/ProtectedRoute.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
};
