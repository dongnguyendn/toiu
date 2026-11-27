import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "/src/context/AuthContext.tsx";
import { LanguageProvider } from "/src/context/LanguageContext.tsx";
import { ProtectedRoute } from "/src/routes/ProtectedRoute.tsx";
import Login from "/src/pages/Login.tsx";
import Dashboard from "/src/pages/Dashboard.tsx";
import StudyRoadmapPage from "/src/pages/StudyRoadmapPage.tsx";
import { ProjectPage, ToolPage } from "/src/components/Placeholders.tsx";
export default function App() {
  return /* @__PURE__ */ jsxDEV(LanguageProvider, { children: /* @__PURE__ */ jsxDEV(AuthProvider, { children: /* @__PURE__ */ jsxDEV(BrowserRouter, { children: /* @__PURE__ */ jsxDEV(Routes, { children: [
    /* @__PURE__ */ jsxDEV(Route, { path: "/login", element: /* @__PURE__ */ jsxDEV(Login, {}, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 19,
      columnNumber: 43
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 19,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/dashboard",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 26,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 25,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 22,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/admin",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 35,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 34,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 31,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/project",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(ProjectPage, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 44,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 43,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 40,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/tool",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(ToolPage, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 53,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 52,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 49,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/study-roadmap",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(StudyRoadmapPage, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 62,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 61,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 58,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/practice/:skill",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 72,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 71,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 68,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/exam/:testType",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 80,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 79,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 76,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/flashcards",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 88,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 87,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 84,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Route,
      {
        path: "/review",
        element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 96,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 95,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 92,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDEV(Navigate, { to: "/dashboard", replace: true }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 102,
      columnNumber: 38
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 102,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 17,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 16,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 15,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 14,
    columnNumber: 5
  }, this);
}
