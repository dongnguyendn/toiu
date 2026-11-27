import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { Shield, Sparkles, Flame, Award, BookOpen, Star, Check } from "lucide-react";
const ACHIEVEMENTS_LIST = [
  { id: "first_login", title: "Khởi đầu vinh quang", desc: "Tạo tài khoản và tham gia cộng đồng", xpReward: 50, emoji: "🐣", icon: Shield, color: "from-blue-500 to-indigo-600" },
  { id: "test_completed", title: "Thợ săn trình độ", desc: "Hoàn thiện bài thi thử đầu vào 30 câu hỏi", xpReward: 100, emoji: "🎯", icon: Sparkles, color: "from-emerald-500 to-teal-600" },
  { id: "practice_completed", title: "Chuyên cần bền bỉ", desc: "Hoàn thành 3 bài học luyện tập bất kỳ", xpReward: 150, emoji: "📚", icon: BookOpen, color: "from-yellow-500 to-amber-600" },
  { id: "perfect_score", title: "Tuyệt đỉnh điểm số", desc: "Trả lời đúng 10/10 bài học kiểm tra", xpReward: 200, emoji: "🪐", icon: Star, color: "from-fuchsia-500 to-pink-600" },
  { id: "streak_3days", title: "Ngọn lửa bốc cháy", desc: "Duy trì chuỗi học liên tiếp tối thiểu 3 ngày", xpReward: 250, emoji: "🔥", icon: Flame, color: "from-orange-500 to-red-600" }
];
export default function ModuleAchievements({ user }) {
  const unlockedIds = user.unlockedAchievements || ["first_login"];
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-150 border-slate-200/60 pb-5", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-amber-50 text-amber-500 rounded-xl border border-amber-200/50 shadow-sm", children: /* @__PURE__ */ jsxDEV(Award, { className: "w-6 h-6 text-yellow-500 fill-yellow-100" }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleAchievements.tsx",
        lineNumber: 29,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleAchievements.tsx",
        lineNumber: 28,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-800 tracking-tight leading-none uppercase", children: "PHÒNG TRUYỀN THỐNG" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 32,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-semibold mt-1.5 leading-none", children: "Rèn luyện liên tục để mở khóa danh hiệu cao quý và đạt điểm kinh nghiệm (XP)" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 33,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleAchievements.tsx",
        lineNumber: 31,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleAchievements.tsx",
      lineNumber: 27,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModuleAchievements.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-tr from-amber-500/5 via-amber-500/[0.01] to-white border border-slate-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-center sm:text-left", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-amber-600 font-black uppercase tracking-widest block leading-none", children: "bảng vàng phấn đấu" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 41,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-800", children: [
          "Bạn đã mở khóa ",
          unlockedIds.length,
          " trên ",
          ACHIEVEMENTS_LIST.length,
          " danh hiệu"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 42,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed max-w-md font-medium", children: "Mỗi huy hiệu được hoàn thành sẽ lập tức cộng điểm kinh nghiệm trực tiếp vào tài khoản giúp bạn cải thiện thứ hạng của mình." }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 43,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleAchievements.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200/80 px-6 py-4 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-1", children: "Kinh nghiệm tích lũy" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 49,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-indigo-600 font-mono tracking-tight leading-none block", children: [
          user.xp || 100,
          " XP"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 50,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleAchievements.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleAchievements.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: ACHIEVEMENTS_LIST.map((ach) => {
      const isUnlocked = unlockedIds.includes(ach.id);
      return /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: `bg-white border rounded-2xl p-5 flex gap-4 transition-all duration-300 transform hover:-translate-y-0.5 ${isUnlocked ? "border-amber-300 shadow-sm bg-gradient-to-br from-white to-amber-500/[0.02]" : "border-slate-200/80 select-none opacity-50 bg-slate-50"}`,
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: `w-14 h-14 rounded-xl bg-gradient-to-tr ${ach.color} flex items-center justify-center text-2xl text-white shrink-0 shadow-md transform hover:rotate-3 transition-transform duration-350`, children: /* @__PURE__ */ jsxDEV("span", { children: ach.emoji }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleAchievements.tsx",
              lineNumber: 70,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleAchievements.tsx",
              lineNumber: 69,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 flex-1 min-w-0 font-sans text-left", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center gap-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: `text-[13px] font-black block truncate ${isUnlocked ? "text-slate-800" : "text-slate-400"}`, children: ach.title }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                  lineNumber: 75,
                  columnNumber: 19
                }, this),
                isUnlocked && /* @__PURE__ */ jsxDEV("span", { className: "bg-amber-100 text-amber-700 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200 shrink-0 select-none", children: "vinh danh" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                  lineNumber: 80,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                lineNumber: 74,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: `text-[11.5px] leading-relaxed pr-2 font-medium h-8 overflow-hidden line-clamp-2 ${isUnlocked ? "text-slate-550" : "text-slate-400"}`, children: ach.desc }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                lineNumber: 86,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 font-mono mt-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: `font-bold ${isUnlocked ? "text-amber-600" : "text-slate-400"}`, children: [
                  "💎 +",
                  ach.xpReward,
                  " XP"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                  lineNumber: 91,
                  columnNumber: 19
                }, this),
                isUnlocked ? /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-600 font-black flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5 stroke-[3] text-emerald-500" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                    lineNumber: 94,
                    columnNumber: 23
                  }, this),
                  " ĐÃ NHẬN"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                  lineNumber: 93,
                  columnNumber: 21
                }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-extrabold text-[9px] uppercase", children: "CHƯA ĐẠT" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                  lineNumber: 97,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleAchievements.tsx",
                lineNumber: 90,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleAchievements.tsx",
              lineNumber: 73,
              columnNumber: 15
            }, this)
          ]
        },
        ach.id,
        true,
        {
          fileName: "/app/applet/src/components/ModuleAchievements.tsx",
          lineNumber: 60,
          columnNumber: 13
        },
        this
      );
    }) }, void 0, false, {
      fileName: "/app/applet/src/components/ModuleAchievements.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModuleAchievements.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}
