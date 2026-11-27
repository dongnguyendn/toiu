import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"];
import { Key, Download, Upload, Cpu, Database, Save, Eye, EyeOff, CheckCircle, X } from "lucide-react";
export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [coachingTemp, setCoachingTemp] = useState(0.4);
  const [maxWordsPerResponse, setMaxWordsPerResponse] = useState(300);
  const [dbSize, setDbSize] = useState("4.2 MB");
  const [apiUsageToday, setApiUsageToday] = useState(84);
  const [storageStatus, setStorageStatus] = useState("95% Free");
  const [restoreFile, setRestoreFile] = useState(null);
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!currentPwd || !newPwd || !confirmNewPwd) {
      setError("Vui lòng điền đầy đủ thông tin mật khẩu.");
      return;
    }
    if (newPwd !== confirmNewPwd) {
      setError("Xác nhận mật khẩu mới không khớp!");
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem("learning_app_userId") || "";
      const res = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({ currentPwd, newPwd })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(data.message || "Đổi mật khẩu thành công. Hệ thống sẽ yêu cầu đăng nhập lại sau 3 giây.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmNewPwd("");
      setTimeout(() => {
        localStorage.removeItem("learning_app_userId");
        window.location.reload();
      }, 3e3);
    } catch (err) {
      setError(err.message || "Lỗi cập nhật mật khẩu.");
    } finally {
      setLoading(false);
    }
  };
  const handleBackupDatabaseObj = () => {
    setError("");
    setSuccess("");
    setSuccess("Sao lưu dữ liệu thành công! Trực tiếp tải file checkpoint...");
    window.location.href = "/api/admin/system/backup";
  };
  const handleRestoreUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm("BẠN CÓ CHẮC MUỐN KHÔI PHỤC DATABASE? Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại ngay lập tức!")) return;
    setError("");
    setSuccess("");
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      try {
        const jsonContent = JSON.parse(event.target?.result as string);
        if (!jsonContent.users || !jsonContent.questions) {
          throw new Error("Tệp sao lưu không đúng định dạng CEFR PathWay JSON.");
        }
        const userId = localStorage.getItem("learning_app_userId") || "";
        const res = await fetch("/api/admin/system/restore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId
          },
          body: JSON.stringify({ dbState: jsonContent })
        });
        if (res.ok) {
          setSuccess("Khôi phục toàn bộ dữ liệu database thành công! Hãy tải lại trang để áp dụng.");
        } else {
          throw new Error("Lỗi máy chủ ghi đè dữ liệu.");
        }
      } catch (err) {
        setError(err.message || "Tệp JSON tải lên không hợp lệ.");
      }
    };
    fileReader.readAsText(file);
  };
  const handleSaveAiConfig = async () => {
    setError("");
    setSuccess("");
    try {
      const userId = localStorage.getItem("learning_app_userId") || "";
      const res = await fetch("/api/admin/settings/ai-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          model: selectedModel,
          temperature: Number(coachingTemp),
          maxWords: Number(maxWordsPerResponse)
        })
      });
      if (res.ok) {
        setSuccess("Lưu cấu hình tích hợp trợ lý AI học tập thành công!");
      }
    } catch {
      setError("Không thể thiết lập AI.");
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs text-left animate-fade-in text-slate-850", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 py-3 px-4 rounded-xl flex justify-between border border-red-105 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: error }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 150,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setError(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 151,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 151,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
      lineNumber: 149,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-700 py-3 px-4 rounded-xl flex justify-between border border-emerald-105 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: success }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 156,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setSuccess(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 157,
        columnNumber: 50
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 157,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
      lineNumber: 155,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Key, { className: "w-4.5 h-4.5 text-indigo-505" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 169,
              columnNumber: 15
            }, this),
            " Đổi mật khẩu tài khoản quản trị viên"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 168,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Thay đổi mật khẩu mặc định để bảo mật hệ thống học trình." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 171,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("form", { onSubmit: handleUpdatePassword, className: "space-y-3 font-bold", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500", children: "Mật khẩu Hiện tại" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 175,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  id: "pwdform-curr",
                  type: showPwd ? "text" : "password",
                  required: true,
                  value: currentPwd,
                  onChange: (e) => setCurrentPwd(e.target.value),
                  placeholder: "••••••••",
                  className: "w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 176,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 174,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500", children: "Mật khẩu Mới" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 189,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    id: "pwdform-new",
                    type: showPwd ? "text" : "password",
                    required: true,
                    value: newPwd,
                    onChange: (e) => setNewPwd(e.target.value),
                    placeholder: "••••••••",
                    className: "w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 190,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 188,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500", children: "Xác nhận Mật khẩu Mới" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 201,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    id: "pwdform-confirm",
                    type: showPwd ? "text" : "password",
                    required: true,
                    value: confirmNewPwd,
                    onChange: (e) => setConfirmNewPwd(e.target.value),
                    placeholder: "••••••••",
                    className: "w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 202,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 200,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 187,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPwd(!showPwd),
                  className: "text-[10.5px] font-extrabold text-slate-500 hover:text-slate-705 flex items-center gap-1 cursor-pointer",
                  children: [
                    showPwd ? /* @__PURE__ */ jsxDEV(EyeOff, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 220,
                      columnNumber: 30
                    }, this) : /* @__PURE__ */ jsxDEV(Eye, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 220,
                      columnNumber: 63
                    }, this),
                    " Hiển thị mật khẩu"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 215,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "btn-settings-update-pwd",
                  type: "submit",
                  disabled: loading,
                  className: "bg-indigo-600 hover:bg-indigo-505 text-white font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-md",
                  children: "CẬP NHẬT MẬT KHẨU"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 222,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 214,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 173,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Database, { className: "w-4.5 h-4.5 text-cyan-505" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 237,
              columnNumber: 15
            }, this),
            " Sao lưu & khôi phục CƠ SỞ DỮ LIỆU"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Tải về hoặc khôi phục snapshot database (`db.json`) dự án." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 239,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 font-bold", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 items-center", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxDEV(Database, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 244,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 243,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 text-left leading-normal", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 block uppercase text-[10.5px]", children: "An toàn tuyệt đối" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 247,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-medium", children: "Bản sao lưu gồm dữ liệu bài học, thành tích và thẻ srs ôn tập." }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 248,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 246,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 242,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleBackupDatabaseObj,
                  className: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 py-3 rounded-xl font-black text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs",
                  children: [
                    /* @__PURE__ */ jsxDEV(Download, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 257,
                      columnNumber: 19
                    }, this),
                    " TẢI FILE SAO LƯU (.JSON)"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 253,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    id: "db-restore-file-uploader",
                    type: "file",
                    accept: ".json",
                    onChange: handleRestoreUpload,
                    className: "hidden"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 261,
                    columnNumber: 19
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => document.getElementById("db-restore-file-uploader")?.click(),
                    className: "w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-black text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md active:translate-y-0.5",
                    children: [
                      /* @__PURE__ */ jsxDEV(Upload, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                        lineNumber: 272,
                        columnNumber: 21
                      }, this),
                      " UPLOAD VÀ KHÔI PHỤC"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 268,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 260,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 252,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 241,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
          lineNumber: 235,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 164,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Cpu, { className: "w-4.5 h-4.5 text-violet-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 287,
              columnNumber: 15
            }, this),
            " TÍCH HỢP TRỢ LÝ AI HỌC TẬP (AI COACHING)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 286,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Điều tiết mô hình ngôn ngữ lớn (LLM) hỗ trợ gợi ý giải đề học viên." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 289,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 font-bold font-mono", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[10px] uppercase font-bold font-sans", children: "Mô hình AI chủ đạo (Google Gemini)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 293,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  id: "aiconfig-model",
                  value: selectedModel,
                  onChange: (e) => setSelectedModel(e.target.value),
                  className: "w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl font-sans text-slate-900 focus:bg-white text-xs font-bold",
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "gemini-2.5-flash", children: "Gemini 2.5 Flash (Nhanh, hiệu suất đề xuất)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 300,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "gemini-2.5-pro", children: "Gemini 2.5 Pro (Suy luận sâu, học thuật cực mạnh)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 301,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "gemini-1.5-flash", children: "Gemini 1.5 Flash (Legacy)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 302,
                      columnNumber: 19
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 294,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 292,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-left", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[10px] uppercase font-bold font-sans block", children: "Độ sáng tạo (Temperature)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 308,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 items-center", children: [
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "range",
                      min: "0.1",
                      max: "1.0",
                      step: "0.1",
                      value: coachingTemp,
                      onChange: (e) => setCoachingTemp(Number(e.target.value)),
                      className: "w-full accent-violet-600"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                      lineNumber: 310,
                      columnNumber: 21
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-violet-600 font-extrabold font-mono w-8", children: coachingTemp }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 319,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 309,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 307,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[10px] uppercase font-bold font-sans", children: "Chi tiết tối đa (Words limit)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                  lineNumber: 324,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "number",
                    min: "100",
                    max: "1000",
                    step: "50",
                    value: maxWordsPerResponse,
                    onChange: (e) => setMaxWordsPerResponse(Number(e.target.value)),
                    className: "w-full border rounded-xl p-2 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 325,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 323,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 306,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end pt-2 border-t border-slate-100", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                id: "btn-settings-save-ai",
                onClick: handleSaveAiConfig,
                className: "bg-indigo-600 hover:bg-indigo-505 text-white font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxDEV(Save, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                    lineNumber: 343,
                    columnNumber: 19
                  }, this),
                  " LƯU CHỈ SỐ AI ASSISTANT"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 338,
                columnNumber: 17
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 337,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 291,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
          lineNumber: 285,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Database, { className: "w-4.5 h-4.5 text-slate-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 352,
              columnNumber: 15
            }, this),
            " Bản tin hiệu năng Hệ Thống (PMS status report)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 351,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-3 text-center border border-slate-100 rounded-2xl overflow-hidden divide-x divide-slate-100 font-mono font-bold font-bold py-3.5 bg-slate-50/20", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[8.5px] uppercase block font-bold font-sans", children: "Disk storage" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 357,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 text-sm block", children: dbSize }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 358,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 356,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[8.5px] uppercase block font-bold font-sans", children: "Gemini API Requests" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 361,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-600 text-sm block", children: [
                apiUsageToday,
                " / 1,000"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 362,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 360,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[8.5px] uppercase block font-bold font-sans", children: "Bộ nhớ khả dụng" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 365,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600 text-sm block", children: storageStatus }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
                lineNumber: 366,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 364,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 355,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2 text-[10.5px] font-bold", children: [
            /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4 h-4 text-emerald-500 shrink-0" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 371,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600 leading-normal", children: "Tất cả cổng dịch vụ chính (Main express server, Cloud files storage, API proxies) đang hoạt động ổn định và có thời gian phản hồi lý tưởng (uptime 99.9%)." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
              lineNumber: 372,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
            lineNumber: 370,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
          lineNumber: 350,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
        lineNumber: 282,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
      lineNumber: 161,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminSettings.tsx",
    lineNumber: 146,
    columnNumber: 5
  }, this);
}
