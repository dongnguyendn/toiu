import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { ensureArray } from "/src/utils/arrayUtils.ts";
import { Trophy, Crown, Flame, RefreshCw } from "lucide-react";
export default function ModuleLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchRankings = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaderboard();
      const sorted = [...ensureArray(data)].sort((a, b) => b.xp - a.xp);
      setLeaderboard(sorted);
    } catch (e) {
      console.error("Error loading rankings:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRankings();
  }, []);
  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return {
          bg: "bg-[#fffbeb] border-amber-300",
          text: "text-amber-600",
          badge: "bg-amber-400 text-slate-900 font-extrabold",
          crown: "text-amber-500"
        };
      case 1:
        return {
          bg: "bg-[#f8fafc] border-slate-200",
          text: "text-slate-600",
          badge: "bg-slate-300 text-slate-800 font-extrabold",
          crown: "text-slate-400"
        };
      case 2:
        return {
          bg: "bg-[#fffaf5] border-amber-200",
          text: "text-amber-700",
          badge: "bg-amber-200 text-amber-800 font-extrabold",
          crown: "text-amber-600"
        };
      default:
        return {
          bg: "bg-white border-transparent",
          text: "text-slate-600",
          badge: "bg-slate-100 text-slate-500 font-bold",
          crown: "hidden"
        };
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 border-slate-200/60 pb-5 gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-200/50 shadow-sm", children: /* @__PURE__ */ jsxDEV(Trophy, { className: "w-6 h-6 text-amber-500 fill-amber-100" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 69,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-800 tracking-tight leading-none uppercase", children: "BẢNG VÀNG DANH VỌNG" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 72,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-semibold mt-1.5 leading-none", children: "Chăm chỉ rèn luyện hàng ngày và nỗ lực bứt phá để ghi danh trên bảng học thuật tương tác" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 73,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 71,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "btn-refresh-leaderboard",
          onClick: fetchRankings,
          disabled: loading,
          className: "flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer transition-all disabled:opacity-40 shadow-sm",
          children: [
            /* @__PURE__ */ jsxDEV(RefreshCw, { className: `w-3.5 h-3.5 ${loading ? "animate-spin" : ""}` }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 83,
              columnNumber: 11
            }, this),
            " TẢI LẠI BẢNG XẾP HẠNG"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 77,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
      lineNumber: 66,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end", children: [
      leaderboard[1] && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-between text-center relative order-2 md:order-1 hover:-translate-y-1 transition-all shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 left-4 w-7 h-7 rounded-lg bg-slate-200/60 text-slate-700 font-black text-[11px] flex items-center justify-center shadow-inner", children: "02" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 93,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 mt-4 font-sans", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-4xl filter drop-shadow", children: "🥈" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 98,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-black text-slate-800 block uppercase max-w-[145px] truncate", children: leaderboard[1].fullName }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 99,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-slate-200/60 text-slate-600 font-black px-2.5 py-1 rounded-full inline-block uppercase tracking-wider", children: [
            "Level ",
            leaderboard[1].level
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 100,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 97,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-5 pt-4 border-t border-slate-200 w-full flex justify-between items-center text-xs font-semibold font-sans", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-orange-600 font-black flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV(Flame, { className: "w-4 h-4 fill-orange-50 text-orange-600" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 104,
              columnNumber: 84
            }, this),
            " ",
            leaderboard[1].streakDays,
            " ngày"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 104,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600 font-black font-mono", children: [
            leaderboard[1].xp,
            " XP"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 105,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 103,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
        lineNumber: 92,
        columnNumber: 11
      }, this),
      leaderboard[0] && /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-tr from-amber-500/[0.03] via-white to-amber-500/[0.01] border-2 border-amber-300 p-8 rounded-3xl flex flex-col items-center justify-between text-center relative order-1 md:order-2 hover:-translate-y-1.5 transition-all shadow-md shadow-amber-500/5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-4.5 py-1 rounded-full text-[9px] flex items-center gap-1 uppercase tracking-widest shadow-md", children: [
          /* @__PURE__ */ jsxDEV(Crown, { className: "w-3.5 h-3.5 fill-slate-950 text-slate-950" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 114,
            columnNumber: 15
          }, this),
          " QUÁN QUÂN"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 113,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 mt-4 font-sans", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-5xl filter drop-shadow", children: "👑" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 118,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-base font-black text-slate-850 block uppercase max-w-[180px] truncate", children: leaderboard[0].fullName }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 119,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-amber-100 text-amber-800 font-black px-3 py-1 rounded-full inline-block uppercase tracking-wider", children: [
            "Level ",
            leaderboard[0].level
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 120,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 117,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-6 pt-4 border-t border-amber-200 w-full flex justify-between items-center text-sm font-semibold font-sans", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-orange-600 font-black flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV(Flame, { className: "w-4 h-4 fill-orange-50 text-orange-600" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 124,
              columnNumber: 84
            }, this),
            " ",
            leaderboard[0].streakDays,
            " ngày"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 124,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-amber-600 font-black font-mono text-base", children: [
            leaderboard[0].xp,
            " XP"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 125,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 123,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
        lineNumber: 112,
        columnNumber: 11
      }, this),
      leaderboard[2] && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-between text-center relative order-3 hover:-translate-y-1 transition-all shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 left-4 w-7 h-7 rounded-lg bg-amber-50 text-amber-800 font-black text-[11px] flex items-center justify-center shadow-inner font-sans", children: "03" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 133,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 mt-4 font-sans", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-4xl filter drop-shadow", children: "🥉" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 138,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-black text-slate-800 block uppercase max-w-[145px] truncate", children: leaderboard[2].fullName }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 139,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-slate-200/60 text-slate-600 font-black px-2.5 py-1 rounded-full inline-block uppercase tracking-wider", children: [
            "Level ",
            leaderboard[2].level
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 140,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 137,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-5 pt-4 border-t border-slate-200 w-full flex justify-between items-center text-xs font-semibold font-sans", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-orange-600 font-black flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV(Flame, { className: "w-4 h-4 fill-orange-50 text-orange-600" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 144,
              columnNumber: 84
            }, this),
            " ",
            leaderboard[2].streakDays,
            " ngày"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 144,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600 font-black font-mono", children: [
            leaderboard[2].xp,
            " XP"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 145,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 143,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
        lineNumber: 132,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
      lineNumber: 88,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm font-sans mt-2", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-4.5 border-b border-slate-200 bg-slate-50/70 flex justify-between text-[10px] font-black uppercase text-slate-450 tracking-wider", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "Hạng mục Học viên" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 155,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-20", children: [
          /* @__PURE__ */ jsxDEV("span", { children: "Hoạt động" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 157,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "min-w-[80px] text-right font-sans", children: "XP Tích Lũy" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 158,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 156,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
        lineNumber: 154,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "divide-y divide-slate-100", children: ensureArray(leaderboard).map((entry, idx) => {
        const style = getRankStyle(idx);
        return /* @__PURE__ */ jsxDEV("div", { className: `px-6 py-4.5 flex justify-between items-center transition-colors ${idx < 3 ? style.bg : "bg-white hover:bg-slate-50"}`, children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 min-w-0 font-sans", children: [
            /* @__PURE__ */ jsxDEV("span", { className: `w-7 h-7 rounded-lg font-mono font-black text-xs flex items-center justify-center shadow-sm ${style.badge}`, children: idx + 1 }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 170,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center font-black text-[12px] text-indigo-600 shrink-0 select-none shadow-sm", children: entry.fullName.substring(0, 2).toUpperCase() }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 175,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "min-w-0 font-sans text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[13px] font-black text-slate-800 block uppercase truncate max-w-[180px]", children: entry.fullName }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
                lineNumber: 180,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-500 block font-semibold mt-0.5", children: [
                "Trình độ tương đương: ",
                /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600 font-extrabold", children: entry.level }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
                  lineNumber: 181,
                  columnNumber: 115
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
                lineNumber: 181,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 179,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 169,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-16 font-mono text-xs", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-orange-600 font-black flex items-center gap-1 select-none", children: [
              /* @__PURE__ */ jsxDEV(Flame, { className: "w-4 h-4 fill-orange-50 text-orange-600" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
                lineNumber: 187,
                columnNumber: 21
              }, this),
              entry.streakDays,
              " Ngày"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 186,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: `min-w-[80px] text-right font-black text-[13px] ${idx === 0 ? "text-amber-600" : "text-slate-800"}`, children: [
              entry.xp,
              " XP"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
              lineNumber: 191,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
            lineNumber: 185,
            columnNumber: 17
          }, this)
        ] }, idx, true, {
          fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
          lineNumber: 167,
          columnNumber: 15
        }, this);
      }) }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
      lineNumber: 153,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModuleLeaderboard.tsx",
    lineNumber: 63,
    columnNumber: 5
  }, this);
}
