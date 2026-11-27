import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"];
import {
  BarChart3,
  Users,
  HelpCircle,
  BookOpen,
  Settings,
  FolderUp,
  Terminal,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  CheckCircle,
  Trophy
} from "lucide-react";
import AdminLogin from "/src/components/admin/AdminLogin.tsx";
import AdminDashboard from "/src/components/admin/AdminDashboard.tsx";
import AdminUsers from "/src/components/admin/AdminUsers.tsx";
import AdminSyncCheck from "/src/components/admin/AdminSyncCheck.tsx";
import AdminDiagnostics from "/src/components/admin/AdminDiagnostics.tsx";
import AdminQuestions from "/src/components/admin/AdminQuestions.tsx";
import AdminTests from "/src/components/admin/AdminTests.tsx";
import AdminSrsFlashcards from "/src/components/admin/AdminSrsFlashcards.tsx";
import AdminImportExport from "/src/components/admin/AdminImportExport.tsx";
import AdminLogs from "/src/components/admin/AdminLogs.tsx";
import AdminSettings from "/src/components/admin/AdminSettings.tsx";
export default function AdminPanel({ user }) {
  const isTeacher = user?.role === "teacher";
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (user?.role === "admin" || user?.role === "teacher") {
      return true;
    }
    return sessionStorage.getItem("admin_authenticated_session") === "true";
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogoutAdminInstance = () => {
    if (!window.confirm("Bạn có đồng ý đăng xuất tài khoản quản trị viên?")) return;
    sessionStorage.removeItem("admin_authenticated_session");
    setIsAdminLoggedIn(false);
    window.location.reload();
  };
  if (!isAdminLoggedIn) {
    return /* @__PURE__ */ jsxDEV(AdminLogin, { onLoginSuccess: () => setIsAdminLoggedIn(true) }, void 0, false, {
      fileName: "/app/applet/src/components/AdminPanel.tsx",
      lineNumber: 62,
      columnNumber: 12
    }, this);
  }
  const navItems = [
    { id: "dashboard", label: "Tổng quan thống kê", icon: BarChart3, color: "text-blue-500" },
    ...!isTeacher ? [
      { id: "users", label: "Quản lý Học viên", icon: Users, color: "text-emerald-500" },
      { id: "sync_check", label: "Kiểm tra đồng bộ", icon: CheckCircle, color: "text-indigo-500" },
      { id: "diagnostics", label: "Chẩn đoán hệ thống", icon: ShieldAlert, color: "text-rose-500" }
    ] : [],
    { id: "questions", label: "Ngân hàng Câu hỏi", icon: HelpCircle, color: "text-amber-500" },
    { id: "flashcards", label: "Flashcards & SRS", icon: BookOpen, color: "text-rose-500" },
    { id: "tests", label: "Quản lý Kỳ thi", icon: Trophy, color: "text-yellow-500" },
    { id: "import_export", label: "Nhập xuất file mẫu", icon: FolderUp, color: "text-indigo-500" },
    ...!isTeacher ? [
      { id: "logs", label: "Nhật ký hệ thống", icon: Terminal, color: "text-slate-500" },
      { id: "settings", label: "Cấu hình chung", icon: Settings, color: "text-teal-500" }
    ] : []
  ];
  const renderActiveTabContent = () => {
    if (isTeacher && (activeTab === "users" || activeTab === "sync_check" || activeTab === "diagnostics" || activeTab === "logs" || activeTab === "settings")) {
      return /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50 border border-rose-250 text-rose-800 p-8 rounded-[2rem] text-center shadow-sm max-w-xl mx-auto space-y-3", children: [
        /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-12 h-12 text-rose-600 mx-auto animate-bounce" }, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 88,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black uppercase", children: "Quyền truy cập bị từ chối" }, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 89,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-rose-600 font-semibold leading-relaxed", children: "Học viên và tài khoản Giáo viên (Teacher) không thể truy cập các danh mục thành viên, cấu hình cài đặt hoặc nhật ký hệ thống. Vui lòng sử dụng tính năng quản lý bài học chính." }, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 90,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/AdminPanel.tsx",
        lineNumber: 87,
        columnNumber: 9
      }, this);
    }
    switch (activeTab) {
      case "dashboard":
        return /* @__PURE__ */ jsxDEV(AdminDashboard, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 99,
          columnNumber: 16
        }, this);
      case "users":
        return /* @__PURE__ */ jsxDEV(AdminUsers, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 101,
          columnNumber: 16
        }, this);
      case "sync_check":
        return /* @__PURE__ */ jsxDEV(AdminSyncCheck, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 103,
          columnNumber: 16
        }, this);
      case "diagnostics":
        return /* @__PURE__ */ jsxDEV(AdminDiagnostics, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 105,
          columnNumber: 16
        }, this);
      case "questions":
        return /* @__PURE__ */ jsxDEV(AdminQuestions, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 107,
          columnNumber: 16
        }, this);
      case "tests":
        return /* @__PURE__ */ jsxDEV(AdminTests, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 109,
          columnNumber: 16
        }, this);
      case "flashcards":
        return /* @__PURE__ */ jsxDEV(AdminSrsFlashcards, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 111,
          columnNumber: 16
        }, this);
      case "import_export":
        return /* @__PURE__ */ jsxDEV(AdminImportExport, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 113,
          columnNumber: 16
        }, this);
      case "logs":
        return /* @__PURE__ */ jsxDEV(AdminLogs, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 115,
          columnNumber: 16
        }, this);
      case "settings":
        return /* @__PURE__ */ jsxDEV(AdminSettings, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 117,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ jsxDEV(AdminDashboard, {}, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 119,
          columnNumber: 16
        }, this);
    }
  };
  const currentActiveLabel = navItems.find((n) => n.id === activeTab)?.label || "Bảng tổng điều khiển";
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md select-none shrink-0 border-b border-slate-800", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md", children: /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-4 h-4 text-white" }, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black uppercase tracking-wider block", children: "LMS ADMIN CONSOLE" }, void 0, false, {
            fileName: "/app/applet/src/components/AdminPanel.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-300 font-extrabold block leading-none", children: currentActiveLabel }, void 0, false, {
            fileName: "/app/applet/src/components/AdminPanel.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/AdminPanel.tsx",
        lineNumber: 130,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setIsSidebarOpen(!isSidebarOpen),
          className: "p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 cursor-pointer",
          children: isSidebarOpen ? /* @__PURE__ */ jsxDEV(X, { className: "w-5.5 h-5.5 text-white" }, void 0, false, {
            fileName: "/app/applet/src/components/AdminPanel.tsx",
            lineNumber: 145,
            columnNumber: 30
          }, this) : /* @__PURE__ */ jsxDEV(Menu, { className: "w-5.5 h-5.5 text-white" }, void 0, false, {
            fileName: "/app/applet/src/components/AdminPanel.tsx",
            lineNumber: 145,
            columnNumber: 73
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/AdminPanel.tsx",
          lineNumber: 141,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/components/AdminPanel.tsx",
        lineNumber: 140,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AdminPanel.tsx",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "aside",
      {
        className: `fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-400 border-r border-slate-900 flex flex-col justify-between transform transition-transform duration-300 select-none shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`,
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 space-y-7 flex-1 flex flex-col", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 pb-5 border-b border-slate-900/60", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-2xl bg-indigo-650 text-white flex items-center justify-center font-black shadow-lg uppercase", children: isTeacher ? "TEA" : "ADM" }, void 0, false, {
                fileName: "/app/applet/src/components/AdminPanel.tsx",
                lineNumber: 160,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-left leading-tight", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-white text-xs font-black uppercase tracking-wider block", children: isTeacher ? user?.fullName : "Administrator" }, void 0, false, {
                  fileName: "/app/applet/src/components/AdminPanel.tsx",
                  lineNumber: 164,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-emerald-400 font-extrabold flex items-center gap-1 leading-none pt-0.5 select-none uppercase", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-405 bg-emerald-400 animate-pulse" }, void 0, false, {
                    fileName: "/app/applet/src/components/AdminPanel.tsx",
                    lineNumber: 168,
                    columnNumber: 17
                  }, this),
                  " ",
                  isTeacher ? "GIÁO VIÊN" : "QUẢN TRỊ",
                  " ONLINE"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/AdminPanel.tsx",
                  lineNumber: 167,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/AdminPanel.tsx",
                lineNumber: 163,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AdminPanel.tsx",
              lineNumber: 159,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("nav", { className: "flex-1 space-y-1.5 overflow-y-auto pr-1 text-left", children: navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: `btn-navtab-${item.id}`,
                  onClick: () => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  },
                  className: `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${isActive ? "bg-indigo-600 text-white font-black shadow-md shadow-indigo-900/30" : "hover:bg-slate-900 hover:text-white"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsxDEV(IconComp, { className: `w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : item.color}` }, void 0, false, {
                        fileName: "/app/applet/src/components/AdminPanel.tsx",
                        lineNumber: 193,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: item.label }, void 0, false, {
                        fileName: "/app/applet/src/components/AdminPanel.tsx",
                        lineNumber: 194,
                        columnNumber: 21
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/AdminPanel.tsx",
                      lineNumber: 192,
                      columnNumber: 19
                    }, this),
                    isActive && /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3.5 h-3.5 text-white" }, void 0, false, {
                      fileName: "/app/applet/src/components/AdminPanel.tsx",
                      lineNumber: 196,
                      columnNumber: 32
                    }, this)
                  ]
                },
                item.id,
                true,
                {
                  fileName: "/app/applet/src/components/AdminPanel.tsx",
                  lineNumber: 179,
                  columnNumber: 17
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/AdminPanel.tsx",
              lineNumber: 174,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AdminPanel.tsx",
            lineNumber: 156,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 border-t border-slate-900/45", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleLogoutAdminInstance,
              className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer text-left focus:outline-none",
              children: [
                /* @__PURE__ */ jsxDEV(LogOut, { className: "w-4.5 h-4.5 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/AdminPanel.tsx",
                  lineNumber: 210,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Đăng xuất khỏi hệ thống" }, void 0, false, {
                  fileName: "/app/applet/src/components/AdminPanel.tsx",
                  lineNumber: 211,
                  columnNumber: 13
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/AdminPanel.tsx",
              lineNumber: 206,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/AdminPanel.tsx",
            lineNumber: 205,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/AdminPanel.tsx",
        lineNumber: 151,
        columnNumber: 7
      },
      this
    ),
    isSidebarOpen && /* @__PURE__ */ jsxDEV(
      "div",
      {
        onClick: () => setIsSidebarOpen(false),
        className: "fixed inset-0 z-40 bg-slate-950/60 md:hidden transition-opacity"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/AdminPanel.tsx",
        lineNumber: 219,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 p-4 md:p-8 overflow-y-auto max-w-full", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto space-y-6", children: renderActiveTabContent() }, void 0, false, {
      fileName: "/app/applet/src/components/AdminPanel.tsx",
      lineNumber: 229,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/AdminPanel.tsx",
      lineNumber: 226,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/AdminPanel.tsx",
    lineNumber: 126,
    columnNumber: 5
  }, this);
}
