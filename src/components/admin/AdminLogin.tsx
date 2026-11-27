import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"];
import { Shield, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username.trim() === "quanli" && password === "abc123") {
        sessionStorage.setItem("admin_authenticated_session", "true");
        fetch("/api/admin/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            detail: "Đăng nhập thành công tài khoản quản trị viên",
            operator: "quanli"
          })
        }).catch((err) => console.error("Could not write system audit log", err));
        onLoginSuccess();
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
        fetch("/api/admin/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "failed_login",
            detail: `Đăng nhập quản trị thất bại (Username: ${username})`,
            operator: "unknown"
          })
        }).catch((err) => console.error("Could not write audit log", err));
      }
      setLoading(false);
    }, 500);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-[80vh] flex items-center justify-center bg-slate-900/5 px-4", children: /* @__PURE__ */ jsxDEV("div", { id: "admin-login-card", className: "w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm", children: /* @__PURE__ */ jsxDEV(Shield, { className: "w-8 h-8" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 58,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 57,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-900 tracking-tight uppercase", children: "ĐĂNG NHẬP QUẢN TRỊ" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 60,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500", children: "Hệ thống quản lý Học liệu và phân bổ Học viên PMS LMS" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 61,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
      lineNumber: 56,
      columnNumber: 9
    }, this),
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 text-xs py-3 px-4 rounded-xl flex items-center gap-2 border border-red-100 animate-shake", children: [
      /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-4.5 h-4.5 shrink-0 text-red-500" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 66,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: error }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 67,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
      lineNumber: 65,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "text-[11px] font-black uppercase text-slate-500", children: "Tên Đăng Nhập" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
          lineNumber: 73,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxDEV(User, { className: "w-4 h-4" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
            lineNumber: 76,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
            lineNumber: 75,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "admin-username-input",
              type: "text",
              required: true,
              value: username,
              onChange: (e) => setUsername(e.target.value),
              placeholder: "quanli",
              className: "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/80 transition-all"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
              lineNumber: 78,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
          lineNumber: 74,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "text-[11px] font-black uppercase text-slate-500", children: "Mật khẩu" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
          lineNumber: 91,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxDEV(Lock, { className: "w-4 h-4" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
            lineNumber: 94,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
            lineNumber: 93,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "admin-password-input",
              type: showPassword ? "text" : "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              className: "w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/80 transition-all"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
              lineNumber: 96,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer",
              children: showPassword ? /* @__PURE__ */ jsxDEV(EyeOff, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
                lineNumber: 110,
                columnNumber: 33
              }, this) : /* @__PURE__ */ jsxDEV(Eye, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
                lineNumber: 110,
                columnNumber: 66
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
              lineNumber: 105,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
          lineNumber: 92,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
        lineNumber: 90,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "admin-login-submit",
          type: "submit",
          disabled: loading,
          className: "w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-black rounded-xl py-3 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:translate-y-0.5",
          children: loading ? "Đang xác thực..." : "ĐĂNG NHẬP DASHBOARD"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
          lineNumber: 115,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
      lineNumber: 71,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400", children: "CEFR Pathways LMS v2.5.0 © 2026" }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
      lineNumber: 126,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
      lineNumber: 125,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
    lineNumber: 54,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/components/admin/AdminLogin.tsx",
    lineNumber: 53,
    columnNumber: 5
  }, this);
}
