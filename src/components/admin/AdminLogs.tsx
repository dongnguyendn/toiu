import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { Terminal, X, Trash2, Shield, Clock, Key } from "lucide-react";
export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/logs");
      if (res.ok) {
        const data = await res.json();
        const sorted = (data.logs || []).sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        setLogs(sorted);
      } else {
        throw new Error();
      }
    } catch {
      setError("Không thể tải hồ sơ kiểm tra từ hệ thống.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLogs();
  }, []);
  const handleClearLogs = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sạch toàn bộ nhật ký sự kiện hệ thống? Hành động này sẽ loại bỏ hoàn toàn dấu vết kiểm toán!")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (res.ok) {
        setSuccess("Đã xóa vĩnh viễn toàn bộ dấu vết nhật ký sự kiện kiểm toán.");
        fetchLogs();
      }
    } catch {
      setError("Lỗi xóa nhật ký.");
    }
  };
  const filteredLogs = logs.filter((l) => {
    return filterAction === "all" || l.action === filterAction;
  });
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs text-left animate-fade-in text-slate-800", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 py-3 px-4 rounded-xl flex justify-between border border-red-105 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: error }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 61,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setError(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 62,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 60,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-700 py-3 px-4 rounded-xl flex justify-between border border-emerald-105 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: success }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 67,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setSuccess(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 68,
        columnNumber: 50
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 68,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 66,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center bg-white p-3.5 border border-slate-150 rounded-2xl", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 items-center", children: [
        /* @__PURE__ */ jsxDEV(Terminal, { className: "w-5 h-5 text-indigo-505" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 75,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold uppercase text-slate-900 tracking-wider", children: "Nhật Ký Hành Trình / Audit Trail Logs" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 76,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "select",
          {
            id: "filter-log-action",
            value: filterAction,
            onChange: (e) => setFilterAction(e.target.value),
            className: "px-3 py-1.5 border border-slate-200 text-[11px] bg-white rounded-xl focus:outline-none",
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Tất cả hành động" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 83,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "login", children: "Đăng nhập thành công" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 84,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "failed_login", children: "Đăng nhập thất bại" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 85,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "create_question", children: "Thêm câu hỏi" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 86,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "update_question", children: "Sửa câu hỏi" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 87,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "delete_question", children: "Xóa câu hỏi" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 88,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "update_user", children: "Thay đổi thông tin" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 89,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "delete_user", children: "Xóa người học" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 90,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "backup", children: "Sao lưu (Backup)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 91,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "restore", children: "Khôi phục (Restore)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 92,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
            lineNumber: 77,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleClearLogs,
          className: "text-rose-600 font-extrabold hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-150 px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer",
          children: [
            /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
              lineNumber: 100,
              columnNumber: 11
            }, this),
            " DỌN DẸP TOÀN BỘ LOGS"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 96,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxDEV("div", { className: "max-h-[460px] overflow-y-auto divide-y divide-slate-100 leading-normal", children: loading ? /* @__PURE__ */ jsxDEV("p", { className: "text-center py-12 text-slate-450 animate-pulse font-bold uppercase tracking-wider", children: "Đang nạp tiến trình nhật ký..." }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 109,
      columnNumber: 13
    }, this) : filteredLogs.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-center py-12 text-slate-400 font-semibold leading-relaxed", children: "Chưa có bản ghi nhật ký kiểm toán nào được thỏa mãn lọc." }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 111,
      columnNumber: 13
    }, this) : filteredLogs.map((log, idx) => {
      let styleObj = { label: "Info", color: "bg-slate-50 text-slate-600 border" };
      if (log.action === "login") {
        styleObj = { label: "SUCCESS LOGIN", color: "bg-emerald-50 text-emerald-700 border-emerald-100 uppercase" };
      } else if (log.action === "failed_login") {
        styleObj = { label: "FAILED LOGIN", color: "bg-rose-50 text-rose-700 border-rose-100 uppercase" };
      } else if (log.action?.includes("delete")) {
        styleObj = { label: "DESTRUCTION DELETE", color: "bg-red-50 text-red-700 border-red-100 uppercase" };
      } else if (log.action?.includes("create")) {
        styleObj = { label: "CREATION", color: "bg-blue-50 text-blue-700 border-blue-105 uppercase" };
      } else if (log.action?.includes("update")) {
        styleObj = { label: "AMENDMENT EDIT", color: "bg-amber-50 text-amber-700 border-amber-105 uppercase" };
      } else if (log.action === "backup" || log.action === "restore") {
        styleObj = { label: "DATABASE SYSTEM", color: "bg-indigo-50 text-indigo-700 border-indigo-110 uppercase" };
      }
      return /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50/5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left", children: /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 items-start flex-1", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border mt-0.5 text-slate-550", children: log.action?.includes("login") ? /* @__PURE__ */ jsxDEV(Shield, { className: "w-4 h-4 text-emerald-500" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 137,
          columnNumber: 56
        }, this) : /* @__PURE__ */ jsxDEV(Terminal, { className: "w-4 h-4" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 137,
          columnNumber: 106
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 136,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxDEV("span", { className: `text-[8.5px] font-black tracking-wide border px-2 py-0.2 rounded-md ${styleObj.color}`, children: styleObj.label }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
              lineNumber: 142,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 text-[11px] leading-snug", children: log.detail }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
              lineNumber: 145,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
            lineNumber: 141,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 text-[9.5px] text-slate-400 font-semibold font-mono", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxDEV(Clock, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 149,
                columnNumber: 69
              }, this),
              " ",
              new Date(log.timestamp).toLocaleString("vi-VN")
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
              lineNumber: 149,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxDEV(Key, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 150,
                columnNumber: 69
              }, this),
              " Operator: ",
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-600 font-bold", children: log.operator || "SYSTEM" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
                lineNumber: 150,
                columnNumber: 120
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
              lineNumber: 150,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
            lineNumber: 148,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
          lineNumber: 140,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 134,
        columnNumber: 19
      }, this) }, idx, false, {
        fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
        lineNumber: 132,
        columnNumber: 17
      }, this);
    }) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 107,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
      lineNumber: 105,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminLogs.tsx",
    lineNumber: 57,
    columnNumber: 5
  }, this);
}
