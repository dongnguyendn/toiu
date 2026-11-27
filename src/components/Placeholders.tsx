import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"];
import { useAuth } from "/src/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import CefrPathwayLogo from "/src/components/CefrPathwayLogo.tsx";
import { FolderGit2, Sparkles, Image, LogOut, Plus, Trash2 } from "lucide-react";
export function SidebarLayout({ children, activeItem }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#EEF4F8] text-slate-850 flex flex-col md:flex-row font-sans selection:bg-cyan-500/10 transition-all", children: [
    /* @__PURE__ */ jsxDEV("aside", { className: "hidden md:flex w-72 bg-white border-r border-slate-100 p-6 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-sm text-left", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "px-2", children: /* @__PURE__ */ jsxDEV(CefrPathwayLogo, { size: 44, mode: "light" }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 19,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 18,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white font-black flex items-center justify-center text-sm shadow-inner uppercase", children: user.fullName.substring(0, 2) }, void 0, false, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 23,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-bold block uppercase leading-none", children: user.role === "admin" ? "Quản trị viên" : "Học viên" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 27,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-slate-800 block truncate mt-1", children: user.fullName }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 30,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 26,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 22,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("nav", { className: "space-y-1.5 text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-slate-400 tracking-widest block px-3 mb-2.5", children: "Không gian làm việc" }, void 0, false, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 35,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => navigate("/dashboard"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeItem === "dashboard" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsxDEV(FolderGit2, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 45,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Học tập & Luyện tập" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 46,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 37,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => navigate("/project"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeItem === "project" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsxDEV(FolderGit2, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 57,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Quản lý dự án" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 58,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 49,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => navigate("/tool"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeItem === "tool" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Image, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 69,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Quản lý Poster & AI Generator" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 70,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 61,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 34,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 17,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: logout,
          className: "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-black transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsxDEV(LogOut, { className: "w-4 h-4 shrink-0" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 80,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Đăng xuất" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 81,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 76,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 75,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 16,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "md:hidden bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0", children: [
      /* @__PURE__ */ jsxDEV(CefrPathwayLogo, { size: 32, mode: "light" }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 88,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: logout, className: "p-1.5 border border-slate-100 text-slate-400 hover:text-red-500 rounded-lg bg-slate-50", children: /* @__PURE__ */ jsxDEV(LogOut, { className: "w-3.5 h-3.5" }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 90,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 89,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 87,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col min-w-0 min-h-0 bg-[#EEF4F8]", children }, void 0, false, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 95,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Placeholders.tsx",
    lineNumber: 14,
    columnNumber: 5
  }, this);
}
export function ProjectPage() {
  const [projects, setProjects] = useState([
    { id: "p1", name: "Dự án Biên soạn Giáo trình CEFR B1", desc: "Tập hợp các tài liệu ôn thi Đọc hiểu và Từ vựng nâng cao", status: "Active", count: 12 },
    { id: "p2", name: "Học phần Trắc nghiệm Trọng âm IPA", desc: "Lớp học cải thiện ngữ điệu phát âm phản xạ nói", status: "Review", count: 8 },
    { id: "p3", name: "Poster Giáo trình Giao tiếp Thương mại", desc: "Ảnh minh họa bối cảnh hội thoại văn phòng", status: "Completed", count: 4 }
  ]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const addProject = (e) => {
    e.preventDefault();
    if (!name) return;
    setProjects([
      ...projects,
      { id: Date.now().toString(), name, desc, status: "Active", count: 0 }
    ]);
    setName("");
    setDesc("");
  };
  return /* @__PURE__ */ jsxDEV(SidebarLayout, { activeItem: "project", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 border-b border-indigo-900/40 px-6 md:px-12 py-5 md:py-7 shrink-0 text-white text-left", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xl md:text-2xl font-black tracking-tight", children: "Quản lý dự án của tôi" }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 125,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-[11.5px] md:text-xs text-indigo-100 font-bold leading-relaxed mt-1", children: "Thiết lập, theo dõi và lưu trữ các phân vùng tài nguyên học thuật của riêng bạn." }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 124,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 max-w-7xl w-full mx-auto text-left", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black uppercase text-slate-400 tracking-wider", children: [
          "Danh sách dự án (",
          projects.length,
          ")"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 135,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: projects.map((p) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${p.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : p.status === "Review" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`, children: p.status }, void 0, false, {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 142,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-400 font-black", children: [
                p.count,
                " file đính kèm"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 147,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 141,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-slate-800 text-base mb-1.5", children: p.name }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 149,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-medium leading-relaxed", children: p.desc }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 150,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 140,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-slate-50 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV("button", { className: "text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer", children: "Xem chi tiết →" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 154,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setProjects(projects.filter((item) => item.id !== p.id)),
                className: "p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer",
                children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 161,
                  columnNumber: 23
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 157,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 153,
            columnNumber: 19
          }, this)
        ] }, p.id, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 139,
          columnNumber: 17
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 137,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 134,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-fit", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black uppercase text-slate-400 tracking-wider mb-4", children: "Tạo dự án mới" }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 171,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("form", { onSubmit: addProject, className: "space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide block", children: "Tên dự án" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 174,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                required: true,
                placeholder: "e.g. Giáo án Luyện nghe v2",
                value: name,
                onChange: (e) => setName(e.target.value),
                className: "w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold shadow-sm bg-slate-50 focus:bg-white text-sm"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 175,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 173,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide block", children: "Mô tả ngắn" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 186,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                rows: 3,
                placeholder: "e.g. Tổng hợp câu hỏi và tập âm thanh hỗ trợ nghe hiểu hội thoại...",
                value: desc,
                onChange: (e) => setDesc(e.target.value),
                className: "w-full p-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold shadow-sm bg-slate-50 focus:bg-white text-sm"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 187,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 185,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm", children: [
            /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 197,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Thêm dự án" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 198,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 196,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 172,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 170,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 132,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 131,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Placeholders.tsx",
    lineNumber: 123,
    columnNumber: 5
  }, this);
}
export function ToolPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [posters, setPosters] = useState([
    { id: "pos_1", title: "Lớp học giao tiếp tiếng Anh nâng cao", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=300", date: "2026-06-25" },
    { id: "pos_2", title: "Cúp Vàng Bảng xếp hạng Học tập chuẩn CEFR", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=300", date: "2026-06-26" }
  ]);
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setPosters([
        {
          id: Date.now().toString(),
          title: prompt,
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=300",
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        },
        ...posters
      ]);
      setPrompt("");
      setIsGenerating(false);
    }, 1500);
  };
  return /* @__PURE__ */ jsxDEV(SidebarLayout, { activeItem: "tool", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 border-b border-indigo-900/40 px-6 md:px-12 py-5 md:py-7 shrink-0 text-white text-left", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xl md:text-2xl font-black tracking-tight flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-6 h-6 text-cyan-200" }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 239,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: "Quản lý Poster & AI Generator" }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 240,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 238,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-[11.5px] md:text-xs text-cyan-50 font-bold leading-relaxed mt-1", children: "Hệ thống AI tự động hóa thiết kế poster bài viết và minh họa bối cảnh khóa học học thuật." }, void 0, false, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 242,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 237,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 max-w-7xl w-full mx-auto text-left", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-fit", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-indigo-500 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 252,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "font-black text-[#0F172A] tracking-tight uppercase text-sm", children: "AI Text-to-Image Generator" }, void 0, false, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 253,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 251,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("form", { onSubmit: handleGenerate, className: "space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide block", children: "Mô tả Poster mong muốn" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 258,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                rows: 4,
                required: true,
                placeholder: "e.g. Một tấm poster ngang hiện đại về lớp học lập trình và tiếng Anh, phong cách tối giản màu xanh dương...",
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                className: "w-full p-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold shadow-sm bg-slate-50 focus:bg-white text-sm"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 259,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 257,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "submit",
              disabled: isGenerating,
              className: "w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50",
              children: isGenerating ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 276,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Đang kiến tạo ảnh AI..." }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 277,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 275,
                columnNumber: 19
              }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-cyan-300" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 281,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Bắt đầu tạo thiết kế" }, void 0, false, {
                  fileName: "/app/applet/src/components/Placeholders.tsx",
                  lineNumber: 282,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 280,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 269,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 256,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 250,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black uppercase text-slate-400 tracking-wider", children: [
          "Thư viện Poster đã thiết kế (",
          posters.length,
          ")"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 291,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: posters.map((item) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative aspect-video bg-slate-100 overflow-hidden shrink-0", children: [
            /* @__PURE__ */ jsxDEV("img", { referrerPolicy: "no-referrer", src: item.url, alt: item.title, className: "w-full h-full object-cover" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 297,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "absolute top-3 right-3 bg-slate-950/75 backdrop-blur-md text-[10px] text-white font-black px-2.5 py-1 rounded-full uppercase tracking-wider", children: "AI Generated" }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 298,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 296,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 flex-1 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-slate-800 text-sm leading-snug mb-1 text-left", children: item.title }, void 0, false, {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 302,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-bold uppercase text-left", children: item.date }, void 0, false, {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 303,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 301,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-slate-50 flex justify-end gap-2", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setPosters(posters.filter((p) => p.id !== item.id)),
                className: "px-3.5 py-1.5 border border-slate-200 hover:border-red-500 hover:text-red-500 rounded-lg text-xs font-black text-slate-500 cursor-pointer transition-all",
                children: "Xóa thiết kế"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/Placeholders.tsx",
                lineNumber: 306,
                columnNumber: 23
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/Placeholders.tsx",
              lineNumber: 305,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Placeholders.tsx",
            lineNumber: 300,
            columnNumber: 19
          }, this)
        ] }, item.id, true, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 295,
          columnNumber: 17
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/Placeholders.tsx",
          lineNumber: 293,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Placeholders.tsx",
        lineNumber: 290,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 248,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/Placeholders.tsx",
      lineNumber: 247,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Placeholders.tsx",
    lineNumber: 236,
    columnNumber: 5
  }, this);
}
