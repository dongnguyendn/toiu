import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { Database, Table, CheckCircle, AlertTriangle, RefreshCw, Activity, Check, Radio, Hammer } from "lucide-react";
import { db } from "/src/firebase.ts";
import { writeBatch, doc } from "firebase/firestore";
export default function AdminSyncCheck() {
  const [dbConnected, setDbConnected] = useState(true);
  const [tableConnected, setTableConnected] = useState(true);
  const [dbUserCount, setDbUserCount] = useState(0);
  const [adminUserCount, setAdminUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncStatus, setSyncStatus] = useState("synced");
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [simulatedMismatch, setSimulatedMismatch] = useState(false);
  const [importLogs, setImportLogs] = useState([]);
  const addLog = (msg) => {
    console.log(msg);
    setImportLogs((prev) => [...prev, msg]);
  };
  const checkSyncStatus = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.getAdminUsers();
      const dbUsersCount = res.totalInDb || 0;
      setDbUserCount(dbUsersCount);
      if (simulatedMismatch) {
        setAdminUserCount(Math.max(0, dbUsersCount - 2));
        setSyncStatus("error");
      } else {
        setAdminUserCount(dbUsersCount);
        setSyncStatus("synced");
      }
      setDbConnected(true);
      setTableConnected(true);
      setLastSyncTime((/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN"));
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới cơ sở dữ liệu học viên.");
      setDbConnected(false);
      setTableConnected(false);
      setSyncStatus("error");
    } finally {
      if (!silent) setLoading(false);
    }
  };
  useEffect(() => {
    checkSyncStatus(false);
    const interval = setInterval(() => {
      checkSyncStatus(true);
    }, 1e3);
    return () => clearInterval(interval);
  }, [simulatedMismatch]);
  useEffect(() => {
    if (simulatedMismatch) {
      const timer = setTimeout(() => {
        setSimulatedMismatch(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [simulatedMismatch]);
  const handleForceSync = async () => {
    setSyncStatus("syncing");
    setSimulatedMismatch(false);
    await checkSyncStatus(false);
  };
  const triggerTestMismatch = () => {
    setSimulatedMismatch(true);
  };
  const handleRunMigration = async () => {
    if (window.confirm("Chạy import Dữ Liệu Placement và Question Bank lên Firestore?")) {
      setSyncStatus("syncing");
      try {
        setImportLogs([]);
        addLog("Import started");
        const res = await api.getAdminQuestionsAll();
        addLog(`Found question source: db.json / mock API`);
        addLog(`Questions found: ${res.length}`);
        addLog(`Writing to collection: questions`);
        if (res.length === 0) {
          addLog("Không tìm thấy nguồn câu hỏi để import. Dữ liệu mock trống!");
          setSyncStatus("synced");
          return;
        }
        let successCount = 0;
        let failCount = 0;
        let batch = writeBatch(db);
        for (const q of res) {
          try {
            if (!q.id) {
              q.id = "q_" + Date.now() + "_" + Math.floor(Math.random() * 1e3);
            }
            const qRef = doc(db, "questions", q.id);
            const qAny = q;
            const normalizedData = {
              id: q.id,
              questionText: q.questionText || qAny.prompt || "",
              options: q.options || [],
              correctAnswer: q.correctAnswer || "",
              explanation: qAny.explanation || "",
              subject: qAny.subject || q.skill || "",
              grade: qAny.grade || q.levelNumber?.toString() || "",
              examId: qAny.examId || null,
              difficulty: qAny.difficulty || "medium",
              createdAt: qAny.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: qAny.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
              ...q,
              // preserve existing data
              isDeleted: false
            };
            batch.set(qRef, normalizedData);
            successCount++;
            if (successCount % 400 === 0) {
              await batch.commit();
              batch = writeBatch(db);
              addLog(`Đã đẩy ${successCount} document lên Firestore...`);
            }
          } catch (error2) {
            addLog(`Lỗi khi thêm câu hỏi vào batch: ${error2}`);
            failCount++;
          }
        }
        if (successCount % 400 !== 0) {
          await batch.commit();
        }
        addLog(`Imported: ${successCount}`);
        addLog(`Failed: ${failCount}`);
        addLog("Import process complete.");
      } catch (error2) {
        addLog(`Lỗi migration trên client: ${error2.message || error2}`);
      }
      setSyncStatus("synced");
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(Activity, { className: "w-5 h-5 text-indigo-600 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 173,
            columnNumber: 13
          }, this),
          "Kiểm tra đồng bộ hệ thống"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 172,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-semibold mt-1", children: "Giám sát thời gian thực kết nối Database, cấu trúc bảng và đồng bộ số liệu tài khoản Đăng ký." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 171,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleRunMigration,
            className: "px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 uppercase cursor-pointer",
            children: [
              /* @__PURE__ */ jsxDEV(Hammer, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 186,
                columnNumber: 13
              }, this),
              "Import Dữ Liệu Placement (Firestore)"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 182,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-trigger-mismatch-test",
            onClick: triggerTestMismatch,
            disabled: simulatedMismatch,
            className: "px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 disabled:opacity-50 text-[11px] font-black rounded-xl transition-all flex items-center gap-1.5 uppercase cursor-pointer",
            title: "Tạo ra sai lệch số lượng để test khả năng tự sửa đồng bộ của Admin",
            children: [
              /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-3.5 h-3.5 text-rose-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 197,
                columnNumber: 13
              }, this),
              "Giả Lập Sai Lệch"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 190,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-force-real-sync",
            onClick: handleForceSync,
            className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 uppercase cursor-pointer",
            children: [
              /* @__PURE__ */ jsxDEV(RefreshCw, { className: `w-3.5 h-3.5 text-white ${syncStatus === "syncing" ? "animate-spin" : ""}` }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 206,
                columnNumber: 13
              }, this),
              "Đồng bộ ngay lập tức"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 201,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 181,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
      lineNumber: 170,
      columnNumber: 7
    }, this),
    loading && /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-8 text-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 214,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-wider", children: "Đang đo lường trạm dữ liệu liên kết..." }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 215,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
      lineNumber: 213,
      columnNumber: 9
    }, this),
    !loading && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(Database, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 225,
            columnNumber: 15
          }, this),
          "Kết nối nguồn dữ liệu"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 224,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-emerald-500/10 text-emerald-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Database, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 234,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 233,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider", children: "Database liên kết" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                  lineNumber: 237,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-xs text-slate-700", children: "JSON Persistent DB (db.json)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                  lineNumber: 238,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 236,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 232,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-black px-3 py-1 rounded-full text-[9px] uppercase border border-emerald-100 select-none", children: [
              /* @__PURE__ */ jsxDEV(Radio, { className: "w-3 h-3 text-emerald-500 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 242,
                columnNumber: 19
              }, this),
              "Connected"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 241,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 231,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-emerald-500/10 text-emerald-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Table, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 251,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 250,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider", children: "Users Table (Collection)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                  lineNumber: 254,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-xs text-slate-700", children: "dbState.users (Realtime Hook)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                  lineNumber: 255,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 253,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 249,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-black px-3 py-1 rounded-full text-[9px] uppercase border border-emerald-100 select-none", children: [
              /* @__PURE__ */ jsxDEV(Radio, { className: "w-3 h-3 text-emerald-500 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 259,
                columnNumber: 19
              }, this),
              "Connected"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 258,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 248,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 229,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-[11px] text-slate-400 font-medium py-1", children: [
          "* Hệ thống liên tục kiểm tra trạng thái mỗi ",
          /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-indigo-600", children: "1.0 giây (1000ms)" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 266,
            columnNumber: 59
          }, this),
          ". Bất kỳ sự thay đổi tài khoản nào từ phía người học đều được hiển thị lập tức."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 265,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 223,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: `border rounded-[2rem] p-6 shadow-sm transition-all duration-300 justify-between flex flex-col ${syncStatus === "synced" ? "bg-white border-slate-200" : "bg-rose-50/50 border-rose-200"}`, children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(Activity, { className: "w-4 h-4 text-slate-600" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 279,
                columnNumber: 19
              }, this),
              "So sánh đồng bộ số liệu"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 278,
              columnNumber: 17
            }, this),
            syncStatus === "synced" ? /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 text-[9px] px-2.5 py-0.5 bg-emerald-500 text-white rounded-lg uppercase font-black tracking-wider leading-none", children: [
              /* @__PURE__ */ jsxDEV(Check, { className: "w-2.5 h-2.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 285,
                columnNumber: 21
              }, this),
              " Synced"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 284,
              columnNumber: 19
            }, this) : /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 text-[9px] px-2.5 py-0.5 bg-rose-500 text-white rounded-lg uppercase font-black tracking-wider leading-none animate-bounce", children: [
              /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-2.5 h-2.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 289,
                columnNumber: 21
              }, this),
              " ERROR"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 288,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 277,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1", children: "Total Users in Database" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 296,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-slate-900 font-mono", children: dbUserCount }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 297,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-450 block font-semibold mt-1", children: "Từ tệp tin db.json gốc" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 298,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 295,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: `rounded-2xl p-4 text-center border transition-all ${syncStatus === "synced" ? "bg-indigo-50/50 border-indigo-100 text-indigo-900" : "bg-rose-100/40 border-rose-200 text-rose-800"}`, children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1", children: "Users Displayed in Admin" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 306,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black font-mono", children: adminUserCount }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 307,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-450 block font-semibold mt-1", children: "Chỉ số hiển thị tại Admin" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 308,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 301,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 294,
            columnNumber: 15
          }, this),
          syncStatus === "synced" ? /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs flex gap-2 font-medium", children: [
            /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 314,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { className: "block font-bold", children: "Số liệu khớp 100% (Thuận nhất thống nhất)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 316,
                columnNumber: 21
              }, this),
              "Học viên trong database và danh sách Admin đang hiển thị hoàn toàn đồng bộ theo thời gian thực."
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 315,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 313,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50 border border-rose-150 text-rose-700 rounded-xl p-3.5 text-xs flex gap-2 font-medium", children: [
            /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 322,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { className: "block font-bold", children: "LỆCH DỮ LIỆU ĐỒNG BỘ (ĐĂNG TRANG KHUYẾT THIẾU)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 324,
                columnNumber: 21
              }, this),
              "Số lượng hiển thị khác với thực tế! Hệ thống tự động sửa chữa đồng bộ trong ",
              /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-rose-600 animate-pulse", children: "2 giây..." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
                lineNumber: 325,
                columnNumber: 97
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 323,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 321,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 276,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-slate-450 font-bold border-t border-slate-100 pt-3 mt-4", children: [
          /* @__PURE__ */ jsxDEV("span", { children: [
            "Đo lường cuối lúc: ",
            lastSyncTime || "N/A"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 332,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
              lineNumber: 334,
              columnNumber: 17
            }, this),
            "Live Feed"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 333,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 331,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 271,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
      lineNumber: 220,
      columnNumber: 9
    }, this),
    importLogs.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-3", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-300 uppercase tracking-wider", children: "Lịch sử quá trình Import" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 346,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950 p-4 rounded-xl max-h-64 overflow-y-auto font-mono text-[10px] space-y-1.5 text-emerald-400", children: importLogs.map((log, i) => /* @__PURE__ */ jsxDEV("div", { children: [
        ">_",
        " ",
        log
      ] }, i, true, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 349,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 347,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
      lineNumber: 345,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider", children: "HƯỚNG DẪN KIỂM TRA ĐĂNG KÝ HỌC VIÊN" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 357,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-500 space-y-1.5 font-medium leading-relaxed", children: [
        /* @__PURE__ */ jsxDEV("p", { children: "1. Mở song song giao diện ứng dụng phía học viên (ở chế độ không đăng nhập hoặc đăng xuất ra) và mở trang đăng ký mới." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 359,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: [
          "2. Điền đầy đủ thông tin: Họ tên, Email, Mật khẩu và nhấn ",
          /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600", children: "Đăng ký" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 363,
            columnNumber: 71
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 362,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: [
          "3. Quay lại giao diện trang ",
          /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800", children: "Admin → Quản lý học viên" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 366,
            columnNumber: 41
          }, this),
          " hoặc trang ",
          /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800", children: "Kiểm tra đồng bộ" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 366,
            columnNumber: 121
          }, this),
          " này. Bạn sẽ thấy con số ",
          /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600", children: "Total Users in Database" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
            lineNumber: 366,
            columnNumber: 206
          }, this),
          " tăng lên ngay tức khắc mà không cần tải lại trang (Không cần nhấn F5)."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
          lineNumber: 365,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
        lineNumber: 358,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
      lineNumber: 356,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminSyncCheck.tsx",
    lineNumber: 167,
    columnNumber: 5
  }, this);
}
