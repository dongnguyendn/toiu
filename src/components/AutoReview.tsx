import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import {
  Sparkles,
  RefreshCw
} from "lucide-react";
export default function AutoReview({ user, onUserUpdate }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const fetchGenerator = async () => {
    setLoading(true);
    try {
      const res = await api.getAutoReviewPractice();
      if (res && res.success) {
        setExercises(res.exercises || []);
      }
    } catch (err) {
      console.error("Failed to fetch auto compiled reviews:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGenerator();
  }, []);
  const handleSelectOption = (qIdx, opt) => {
    if (evaluated) return;
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: opt.trim().charAt(0)
    }));
  };
  const handleEvaluate = () => {
    if (exercises.length === 0 || evaluated) return;
    let correct = 0;
    exercises.forEach((item, idx) => {
      const uAns = answers[idx];
      const cAns = item.correctOption.trim().charAt(0);
      if (uAns === cAns) correct++;
    });
    const finalPct = Math.round(correct / exercises.length * 100);
    setScore(finalPct);
    setEvaluated(true);
    onUserUpdate({
      ...user,
      xp: (user.xp || 0) + 15
    });
  };
  const handleReset = () => {
    setAnswers({});
    setEvaluated(false);
    setScore(0);
    fetchGenerator();
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center p-16 text-slate-400 text-xs font-mono", children: [
      /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-6 h-6 animate-spin text-indigo-600 mb-3" }, void 0, false, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 85,
        columnNumber: 9
      }, this),
      "Hệ thống AI đang quét hồ sơ điểm yếu và tự động lắp ráp đề ôn tập phù hợp..."
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this);
  }
  if (exercises.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-4xl text-center", children: "🎉" }, void 0, false, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 94,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-800 uppercase", children: "Hồ sơ điểm thi xuất sắc!" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 96,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed text-justify", children: "Tuyệt hảo! Trình thu thập dữ liệu AI của chúng tôi chẩn đoán thấy bạn đang có phong độ học tập cực đỉnh và chưa ghi nhận sai lầm đáng kể nào cần tạo bài ôn tập tự động. Hãy tiếp tục bứt phá các chủ đề CEFR khác!" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 97,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: fetchGenerator,
          className: "w-full bg-indigo-600 hover:bg-slate-100 py-2.5 rounded-xl border border-indigo-200 text-slate-800 font-black text-xs uppercase cursor-pointer",
          children: "Kiểm tra lại"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 101,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 93,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6 max-w-xl mx-auto animate-fade-in", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-100 pb-3", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-indigo-50 text-indigo-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-indigo-650" }, void 0, false, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 118,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full uppercase", children: "MODULE 8" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 121,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800 uppercase leading-none mt-1", children: "🤖 BÀI ÔN TẬP TỰ ĐỘNG (AI AUTOGEN CLINC)" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 124,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 120,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 116,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 115,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed max-w-md", children: [
      "Dưới đây là ",
      exercises.length,
      " câu hỏi ôn tập do AI thiết kế dựa trên các lỗi từ vựng/ngữ pháp bạn đã mắc phải trong quá khứ."
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-5", children: exercises.map((item, idx) => {
      const userSel = answers[idx];
      return /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-xs font-black text-indigo-600", children: [
            "Q",
            idx + 1,
            "."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AutoReview.tsx",
            lineNumber: 140,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold text-slate-800 leading-normal", children: item.questionText }, void 0, false, {
            fileName: "/app/applet/src/components/AutoReview.tsx",
            lineNumber: 141,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 139,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11.5px]", children: item.options.map((opt) => {
          const letter = opt.trim().charAt(0);
          const isSelected = userSel === letter;
          const isCorrect = item.correctOption.trim().charAt(0) === letter;
          let optStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
          if (evaluated) {
            if (isCorrect) optStyle = "bg-emerald-50 border-emerald-450 text-emerald-900 font-extrabold";
            else if (isSelected) optStyle = "bg-rose-50 border-rose-300 text-rose-800";
          } else if (isSelected) {
            optStyle = "bg-indigo-50 border-indigo-400 text-indigo-950 font-bold";
          }
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSelectOption(idx, opt),
              className: `p-2.5 rounded-xl border text-left cursor-pointer transition-all ${optStyle}`,
              children: opt
            },
            opt,
            false,
            {
              fileName: "/app/applet/src/components/AutoReview.tsx",
              lineNumber: 160,
              columnNumber: 21
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 145,
          columnNumber: 15
        }, this)
      ] }, idx, true, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 138,
        columnNumber: 13
      }, this);
    }) }, void 0, false, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 134,
      columnNumber: 7
    }, this),
    evaluated ? /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950 text-white rounded-2xl p-5 space-y-4 animate-fade-in relative overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" }, void 0, false, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 177,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-white/10 pb-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-300 tracking-wider", children: "CHẤM ĐIỂM HOÀN THÀNH" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 180,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold", children: "+15 XP" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 181,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 179,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-3xl", children: "🎯" }, void 0, false, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 187,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 block text-[10px]", children: "TỶ LỆ CHÍNH XÁC:" }, void 0, false, {
            fileName: "/app/applet/src/components/AutoReview.tsx",
            lineNumber: 189,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black font-mono text-emerald-400", children: [
            score,
            "% CHUẨN XÁC"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AutoReview.tsx",
            lineNumber: 190,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 188,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 186,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2.5 pt-2", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleReset,
          className: "flex-1 bg-white text-indigo-950 hover:bg-slate-50 py-2.5 rounded-xl text-xs font-black tracking-wide text-center uppercase cursor-pointer",
          children: "Cập nhật lại bài ôn tập mới"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/AutoReview.tsx",
          lineNumber: 195,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 194,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AutoReview.tsx",
      lineNumber: 176,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: handleEvaluate,
        disabled: Object.keys(answers).length < exercises.length,
        className: "w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-3.5 rounded-2xl text-xs font-black tracking-wider shadow uppercase cursor-pointer",
        children: "NỘP BÀI ÔN TẬP HOÀN THÀNH ✨"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/AutoReview.tsx",
        lineNumber: 204,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/AutoReview.tsx",
    lineNumber: 112,
    columnNumber: 5
  }, this);
}
