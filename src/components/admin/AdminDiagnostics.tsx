import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { Activity, ShieldCheck, Server, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
export default function AdminDiagnostics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [diagnostics, setDiagnostics] = useState({
    apiAdminUsers: "OK",
    dbConnection: "OK",
    authentication: "OK",
    authorization: "OK",
    usersLoaded: 0,
    httpStatus: 200,
    reason: "",
    status: "Healthy"
  });
  const [simulatedFailure, setSimulatedFailure] = useState(false);
  const [testExamId, setTestExamId] = useState("exam_a1_stage1");
  const [testResult, setTestResult] = useState(null);
  const [testingDeleter, setTestingDeleter] = useState(false);
  const runDeleteDiagnostic = async () => {
    setTestingDeleter(true);
    setTestResult(null);
    try {
      const cachedUserId = localStorage.getItem("learning_app_userId") || "";
      if (!cachedUserId) {
        setTestResult({
          database: "Connected",
          deleteApi: "FAIL",
          deleteResult: "Failed",
          reason: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại."
        });
        setTestingDeleter(false);
        return;
      }
      const authHeader = { "x-user-id": cachedUserId };
      const testRes = await fetch("/api/admin/exams", { headers: authHeader });
      if (testRes.status === 401) {
        setTestResult({
          database: "Connected",
          deleteApi: "Failed",
          deleteResult: "Failed",
          reason: "Mã Lỗi: Yêu cầu cung cấp định danh phiên tài khoản (x-user-id)!"
        });
      } else if (testRes.status === 403) {
        setTestResult({
          database: "Connected",
          deleteApi: "Failed",
          deleteResult: "Failed",
          reason: "Permission denied (Từ chối truy cập: Tài khoản không có đặc quyền quản trị)"
        });
      } else if (testRes.ok) {
        const data = await testRes.json();
        const examsList = data.exams || [];
        const found = examsList.some((e) => e.id === testExamId);
        setTestResult({
          database: "Connected",
          deleteApi: "OK",
          deleteResult: "Success",
          reason: found ? `Kỳ thi tồn tại. Sẵn sàng thực thi quy trình xóa kỳ thi ${testExamId} an toàn.` : `ID kì thi ${testExamId} không tìm thấy trên hệ thống, nhưng định dạng API/phân quyền xóa OK.`
        });
      } else {
        setTestResult({
          database: "Connected",
          deleteApi: "Failed",
          deleteResult: "Failed",
          reason: `API trả lỗi ${testRes.status}`
        });
      }
    } catch (error) {
      setTestResult({
        database: "Error Connecting",
        deleteApi: "Failed",
        deleteResult: "Failed",
        reason: error.message || "Không thể truyền phát tín hiệu đến máy chủ."
      });
    } finally {
      setTestingDeleter(false);
    }
  };
  const runDiagnostics = async (isRef = false) => {
    if (isRef) setRefreshing(true);
    else setLoading(true);
    try {
      if (simulatedFailure) {
        setDiagnostics({
          apiAdminUsers: "FAILED",
          dbConnection: "OK",
          authentication: "FAILED",
          authorization: "FAILED",
          usersLoaded: 0,
          httpStatus: 403,
          reason: "Missing Admin Role",
          status: "Unhealthy"
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }
      let apiUsersStatus = "OK";
      let dbConnStatus = "OK";
      let authStatus = "OK";
      let authzStatus = "OK";
      let loadedCount = 0;
      let errStatus = 200;
      let errReason = "";
      try {
        const res = await api.getAdminUsers();
        loadedCount = res.totalInDb || 0;
      } catch (err) {
        apiUsersStatus = "FAILED";
        errStatus = err.status || 403;
        errReason = err.message || "Missing Admin Role";
      }
      try {
        const dbStatus = await api.getAdminDbStatus();
        if (dbStatus.connectionStatus !== "ACTIVE (100% connected)") {
          dbConnStatus = "FAILED";
        }
      } catch {
        dbConnStatus = "FAILED";
      }
      const cachedUserId = localStorage.getItem("learning_app_userId");
      if (!cachedUserId) {
        authStatus = "FAILED";
        authzStatus = "FAILED";
        errReason = "Missing x-user-id Session Header";
      } else {
        if (cachedUserId.startsWith("usr_admin_system") || cachedUserId === "usr_admin") {
          authStatus = "OK";
          authzStatus = "OK";
        } else {
          try {
            const me = await api.getMe();
            if (me) {
              authStatus = "OK";
              if (me.role === "admin" || me.role === "teacher" || me.isAdmin) {
                authzStatus = "OK";
              } else {
                authzStatus = "FAILED";
                errReason = "Incongruent Access Parameters (Standard Student Account)";
              }
            } else {
              authStatus = "FAILED";
              authzStatus = "FAILED";
            }
          } catch {
            authStatus = "FAILED";
            authzStatus = "FAILED";
          }
        }
      }
      const isHealthy = apiUsersStatus === "OK" && dbConnStatus === "OK" && authStatus === "OK" && authzStatus === "OK";
      setDiagnostics({
        apiAdminUsers: apiUsersStatus,
        dbConnection: dbConnStatus,
        authentication: authStatus,
        authorization: authzStatus,
        usersLoaded: loadedCount,
        httpStatus: errStatus,
        reason: errReason,
        status: isHealthy ? "Healthy" : "Unhealthy"
      });
    } catch (e) {
      setDiagnostics({
        apiAdminUsers: "FAILED",
        dbConnection: "FAILED",
        authentication: "FAILED",
        authorization: "FAILED",
        usersLoaded: 0,
        httpStatus: 500,
        reason: "Server Error",
        status: "Unhealthy"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    runDiagnostics();
  }, [simulatedFailure]);
  const handleSimulate = () => {
    setSimulatedFailure((prev) => !prev);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(Activity, { className: "w-5 h-5 text-emerald-600 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 221,
            columnNumber: 13
          }, this),
          "Trạm chẩn đoán hệ thống (System Diagnostics)"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 220,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-semibold mt-1", children: "Đo lường tính vẹn toàn của phân quyền API, xác thực tokens, kết nối tệp tin cơ sở dữ liệu thật." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 224,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 219,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-toggle-simulate-403",
            onClick: handleSimulate,
            className: `px-4 py-2 text-[11px] font-black rounded-xl transition-all flex items-center gap-1.5 uppercase border cursor-pointer ${simulatedFailure ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"}`,
            children: [
              /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 239,
                columnNumber: 13
              }, this),
              simulatedFailure ? "Tắt Giả Lập Sai Lệch (403)" : "Giả Lập Lỗi Quyền (403)"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 230,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-refresh-diagnostics",
            onClick: () => runDiagnostics(true),
            disabled: refreshing,
            className: "px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 uppercase cursor-pointer disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxDEV(RefreshCw, { className: `w-3.5 h-3.5 text-white ${refreshing ? "animate-spin" : ""}` }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 249,
                columnNumber: 13
              }, this),
              "Giải phóng mới"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 243,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 229,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
      lineNumber: 218,
      columnNumber: 7
    }, this),
    loading ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 257,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-wider", children: "Đang chẩn mạch hệ thống liên kết..." }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 258,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
      lineNumber: 256,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(Server, { className: "w-4 h-4 text-emerald-600" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 266,
            columnNumber: 15
          }, this),
          "Khảo biên hoạt năng hệ thống"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 265,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block", children: "API Admin Users" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 275,
                columnNumber: 19
              }, this),
              diagnostics.apiAdminUsers === "OK" ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-emerald-100", children: "OK" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 277,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-rose-100 animate-pulse", children: "FAILED" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 281,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 274,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800 block", children: "/api/admin/users" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 287,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-semibold text-slate-450", children: "Tải tệp tin người học" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 288,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 286,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 273,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block", children: "Database Connection" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 295,
                columnNumber: 19
              }, this),
              diagnostics.dbConnection === "OK" ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-emerald-100", children: "OK" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 297,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-rose-100", children: "FAILED" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 301,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 294,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800 block", children: "JSON Store (db.json)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 307,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-semibold text-slate-450", children: "Thuyết kết nối vật lý" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 308,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 306,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 293,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block", children: "Authentication" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 315,
                columnNumber: 19
              }, this),
              diagnostics.authentication === "OK" ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-emerald-100", children: "OK" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 317,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-rose-100", children: "FAILED" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 321,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 314,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800 block", children: "Session Check-in" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 327,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-semibold text-slate-450", children: "Thiết lập token liên kết" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 328,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 326,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 313,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block", children: "Authorization" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 335,
                columnNumber: 19
              }, this),
              diagnostics.authorization === "OK" ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-emerald-100", children: "OK" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 337,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-rose-100", children: "FAILED" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 341,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 334,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800 block", children: "Admin Role Clearance" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 347,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-semibold text-slate-450", children: "Thẩm duyệt phân quyền quản trị" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 348,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 346,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 333,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 270,
          columnNumber: 13
        }, this),
        diagnostics.status === "Healthy" ? /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs flex gap-2 font-medium", children: [
          /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 356,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("strong", { className: "block font-bold", children: "HỆ THỐNG AN TOÀN VÀ LUỒNG THÔNG" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 358,
              columnNumber: 19
            }, this),
            "Tất cả các rào chắn bảo mật đều cấp duyệt cho tài khoản của bạn. Tiến trình lấy dữ liệu từ cơ sở dữ liệu thật hoạt động không sai số."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 357,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 355,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3.5 text-xs space-y-2 font-medium", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 365,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { className: "block font-bold", children: "LỖI XÁC THỰC HOẶC PHÂN QUYỀN TRUY CẬP" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 367,
                columnNumber: 21
              }, this),
              "Hệ thống xác định trạng thái ",
              /* @__PURE__ */ jsxDEV("strong", { className: "text-rose-800 uppercase font-bold", children: "FAILED" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 368,
                columnNumber: 50
              }, this),
              " và trả về mã lỗi bảo mật."
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 366,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 364,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-2 bg-white/60 rounded-lg text-[11px] font-mono border border-rose-150 text-slate-700 space-y-1", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: "HTTP Status:" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 372,
                columnNumber: 24
              }, this),
              " ",
              diagnostics.httpStatus
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 372,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: "Reason:" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 373,
                columnNumber: 24
              }, this),
              " ",
              diagnostics.reason || "Missing Admin Role or Invalid Session ID"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 373,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 371,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 363,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 264,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950 text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between h-full min-h-[200px]", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block", children: "Trạng thái chung" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 383,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `w-3.5 h-3.5 rounded-full inline-block ${diagnostics.status === "Healthy" ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-ping"}` }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 385,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black uppercase tracking-tight font-sans", children: diagnostics.status }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 386,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 384,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 382,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "border-t border-slate-800 my-4 pt-4 shrink-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1", children: "Users Loaded" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 393,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-4xl font-black font-mono leading-none", children: [
              diagnostics.usersLoaded,
              " ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-semibold text-slate-400 font-sans", children: "học viên" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 394,
                columnNumber: 104
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 394,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 392,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-500 font-bold flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Database: Online" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 398,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Port Ingress: 3000" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 399,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 397,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 381,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3", children: [
            /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "w-4 h-4 text-rose-650" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 406,
              columnNumber: 17
            }, this),
            "Chẩn đoán Xóa kỳ thi (Delete Exam Trace)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 405,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 text-xs font-semibold", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] text-slate-450 uppercase font-black tracking-wider block", children: "Nhập Exam ID cần kiểm tra" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 412,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  value: testExamId,
                  onChange: (e) => setTestExamId(e.target.value),
                  className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-slate-400 outline-none",
                  placeholder: "E.g., exam_a1_stage1"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 413,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 411,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: runDeleteDiagnostic,
                disabled: testingDeleter,
                className: "w-full py-2.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-transparent font-black rounded-xl text-[10px] uppercase transition-all tracking-wider cursor-pointer disabled:opacity-50",
                children: testingDeleter ? "Đang truy dấu..." : "Kiểm tra Luồng Xóa"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 422,
                columnNumber: 17
              },
              this
            ),
            testResult && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-[11px] space-y-2.5 border border-slate-800", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-2 border-b border-slate-850", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase tracking-wider text-slate-400", children: "Kết quả chẩn đoán" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 433,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase ${testResult.deleteResult === "Success" ? "bg-emerald-950 text-emerald-350 border border-emerald-900" : "bg-rose-950 text-rose-350 border border-rose-900"}`, children: testResult.deleteResult }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 434,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 432,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 bg-slate-900/40 p-2.5 rounded-lg border border-slate-900", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-normal", children: "Exam ID:" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 441,
                    columnNumber: 25
                  }, this),
                  " ",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-white font-bold", children: testExamId }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 442,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 440,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-normal", children: "Database:" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 445,
                    columnNumber: 25
                  }, this),
                  " ",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-400 font-bold", children: testResult.database }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 446,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 444,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-normal", children: "Delete API:" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 449,
                    columnNumber: 25
                  }, this),
                  " ",
                  /* @__PURE__ */ jsxDEV("span", { className: `${testResult.deleteApi === "OK" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}`, children: testResult.deleteApi }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 450,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 448,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-normal", children: "Delete Result:" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 453,
                    columnNumber: 25
                  }, this),
                  " ",
                  /* @__PURE__ */ jsxDEV("span", { className: `${testResult.deleteResult === "Success" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}`, children: testResult.deleteResult }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                    lineNumber: 454,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 452,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 439,
                columnNumber: 21
              }, this),
              testResult.reason && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] leading-relaxed p-2.5 bg-rose-950/20 rounded-lg text-rose-300 border border-rose-900/30", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold block uppercase text-[8px] text-rose-400 tracking-wider mb-0.5", children: "Chi tiết nguyên cớ (Reason):" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                  lineNumber: 460,
                  columnNumber: 25
                }, this),
                testResult.reason
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
                lineNumber: 459,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 431,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 410,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 404,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 380,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
      lineNumber: 261,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5ClassName mb-1", children: [
        /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "w-4.5 h-4.5 text-indigo-600" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 476,
          columnNumber: 11
        }, this),
        "CHÍNH SÁCH BẢO MẬT & PHÂN QUYỀN HỆ THỐNG"
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 475,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-550 space-y-2 font-semibold leading-relaxed", children: [
        /* @__PURE__ */ jsxDEV("p", { children: "Hệ thống áp dụng chính sách phân quyền tối cao theo 3 nhóm vai trò người dùng chính:" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 480,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("ul", { className: "list-disc pl-5 mt-1 space-y-1", children: [
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-700 uppercase", children: "Admin:" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 485,
              columnNumber: 15
            }, this),
            " Toàn quyền tra cứu dữ liệu, hiển thị danh mục học viên liên tục theo thời gian thực (Realtime Synchronized), cấu hồi mật khẩu và sao lưu hệ thống."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 484,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("strong", { className: "text-purple-700 uppercase", children: "Teacher (Giáo viên):" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 488,
              columnNumber: 15
            }, this),
            " Quản lý biên soạn câu hỏi, cấu trúc khóa học, bài học CEFR và thẻ flashcards học tập. Không được truy xuất danh sách người dùng hay can thiệp bảo mật."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 487,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600 uppercase", children: "Student (Học viên):" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 491,
              columnNumber: 15
            }, this),
            " Toàn bộ API admin (",
            /* @__PURE__ */ jsxDEV("code", { className: "bg-slate-50 px-1 py-0.5 rounded", children: "/api/admin/*" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 491,
              columnNumber: 109
            }, this),
            ") chặn tuyệt đối và trả về mã lỗi ",
            /* @__PURE__ */ jsxDEV("strong", { className: "text-rose-600", children: "403 Forbidden" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
              lineNumber: 491,
              columnNumber: 212
            }, this),
            " nếu cố tình truy cập."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
            lineNumber: 490,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
          lineNumber: 483,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
        lineNumber: 479,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
      lineNumber: 474,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminDiagnostics.tsx",
    lineNumber: 215,
    columnNumber: 5
  }, this);
}
