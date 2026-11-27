import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"];
import { api } from "/src/api.ts";
import { ArrowRight, ArrowLeft, Check, Compass, Award, Clock, Mail, CheckCircle } from "lucide-react";
import { useLanguage } from "/src/context/LanguageContext.tsx";
const GOALS_LIST = [
  { id: "communication", label: "Giao tiếp hàng ngày", emoji: "🗣️" },
  { id: "work", label: "Phục vụ công việc", emoji: "💼" },
  { id: "overseas", label: "Chuẩn bị du học", emoji: "✈️" },
  { id: "ielts", label: "Luyện thi IELTS", emoji: "🎓" },
  { id: "toeic", label: "Luyện thi TOEIC", emoji: "📊" },
  { id: "exam", label: "Thi THPT Quốc gia", emoji: "🏫" },
  { id: "travel", label: "Du lịch thế giới", emoji: "🗺️" },
  { id: "movies", label: "Xem phim không vietsub", emoji: "🎬" },
  { id: "other", label: "Mục đích khác", emoji: "💡" }
];
const LEVELS_LIST = [
  { id: "mat_goc", label: "Mất gốc", sub: "Không có phản xạ hoặc quên mọi từ vựng căn bản", level: "A1" },
  { id: "a1", label: "Trình độ A1", sub: "Học từ vựng cơ bản, giới thiệu đơn giản chậm rãi", level: "A1" },
  { id: "a2", label: "Trình độ A2", sub: "Đọc mẫu giao tiếp ngắn, trao đổi ý kiến tức thì", level: "A2" },
  { id: "b1", label: "Trình độ B1", sub: "Hiểu được ý chính, mô tả ngắn ước mơ, sở thích", level: "B1" },
  { id: "b2", label: "Trình độ B2", sub: "Giao tiếp lưu loát tương đối, hiểu bài lý luận sâu", level: "B2" },
  { id: "c1", label: "Trình độ C1", sub: "Trình bày linh hoạt từ chuyên môn, bài luận hàn lâm", level: "C1" }
];
const DURATIONS_LIST = [
  { value: 15, label: "15 phút / Ngày", desc: "Mức độ Nhẹ nhàng 🍃" },
  { value: 30, label: "30 phút / Ngày", desc: "Mức độ Cơ bản ⚡" },
  { value: 45, label: "45 phút / Ngày", desc: "Mức độ Tích cực 🚀" },
  { value: 60, label: "60 phút / Ngày", desc: "Mức độ Nghiêm túc 🔥" },
  { value: 90, label: "90 phút / Ngày", desc: "Mức độ Siêu cấp 🏆" }
];
export default function OnboardingInterview({ user, onSuccess }) {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [proficiency, setProficiency] = useState("");
  const [minutesPerDay, setMinutesPerDay] = useState(30);
  const [emailNotify, setEmailNotify] = useState(user.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const getGoalLabel = (label) => {
    if (language === "en") {
      const enMap = {
        "Giao tiếp hàng ngày": "Daily Communication",
        "Phục vụ công việc": "Career & Work",
        "Chuẩn bị du học": "Study Abroad Prep",
        "Luyện thi IELTS": "IELTS Exam Prep",
        "Luyện thi TOEIC": "TOEIC Exam Prep",
        "Thi THPT Quốc gia": "National Exam Prep",
        "Du lịch thế giới": "Global Travel",
        "Xem phim không vietsub": "No-Sub Movies",
        "Mục đích khác": "Other Purposes"
      };
      return enMap[label] || label;
    }
    return label;
  };
  const getLevelDetails = (lvl) => {
    if (language === "en") {
      const enLevelNames = {
        "mat_goc": { label: "Beginner / Lost Roots", sub: "No reflexes or forgot all basic vocabulary" },
        "a1": { label: "Elementary A1", sub: "Learn basic vocabulary, simple and slow introductions" },
        "a2": { label: "Pre-Intermediate A2", sub: "Read short dialogues, instantly exchange simple comments" },
        "b1": { label: "Intermediate B1", sub: "Understand main ideas, describe short dreams and hobbies" },
        "b2": { label: "Upper Intermediate B2", sub: "Communicate relatively fluently, understand deep reasoning" },
        "c1": { label: "Advanced C1", sub: "Express complex technical jargon, academic essays fluently" }
      };
      return enLevelNames[lvl.id] || { label: lvl.label, sub: lvl.sub };
    }
    return { label: lvl.label, sub: lvl.sub };
  };
  const getDurationDetails = (dur) => {
    if (language === "en") {
      const enDurations = {
        15: { label: "15 mins / Day", desc: "Easy level 🍃" },
        30: { label: "30 mins / Day", desc: "Basic level ⚡" },
        45: { label: "45 mins / Day", desc: "Active level 🚀" },
        60: { label: "60 mins / Day", desc: "Serious level 🔥" },
        90: { label: "90 mins / Day", desc: "Super scholar 🏆" }
      };
      return enDurations[dur.value] || { label: dur.label, desc: dur.desc };
    }
    return { label: dur.label, desc: dur.desc };
  };
  const togglePurpose = (label) => {
    if (selectedPurposes.includes(label)) {
      setSelectedPurposes(selectedPurposes.filter((p) => p !== label));
    } else {
      setSelectedPurposes([...selectedPurposes, label]);
    }
  };
  const handleNextStep = () => {
    setError("");
    if (step === 1 && selectedPurposes.length === 0) {
      setError(language === "en" ? "Please select at least one study purpose." : "Vui lòng chọn ít nhất một mục đích học tập của bạn.");
      return;
    }
    if (step === 2 && !proficiency) {
      setError(language === "en" ? "Please select your estimated current proficiency." : "Vui lòng chọn trình độ hiện tại ước lượng của bạn.");
      return;
    }
    if (step === 4) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailNotify || !emailRegex.test(emailNotify)) {
        setError(language === "en" ? "Please provide a valid email address to receive study notifications." : "Vui lòng cung cấp một tài khoản Email nhận thông báo học tập hợp lệ.");
        return;
      }
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };
  const handlePrevStep = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const updatedUser = await api.submitInterview({
        purposes: selectedPurposes,
        proficiency,
        minutesPerDay,
        emailNotify
      });
      onSuccess(updatedUser);
    } catch (err) {
      setError(err.message || (language === "en" ? "Failed to save onboarding responses." : "Không thể lưu câu trả lời phỏng vấn."));
    } finally {
      setLoading(false);
    }
  };
  const progressPct = Math.round(step / 4 * 100);
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pulse-glow" }, void 0, false, {
      fileName: "/app/applet/src/components/OnboardingInterview.tsx",
      lineNumber: 161,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pulse-glow" }, void 0, false, {
      fileName: "/app/applet/src/components/OnboardingInterview.tsx",
      lineNumber: 162,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-lg bg-white border border-slate-200/85 rounded-3xl shadow-xl p-8 relative z-10 transition-all duration-300", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mb-2.5", children: [
          /* @__PURE__ */ jsxDEV("span", { children: language === "en" ? "Onboarding Interview" : "Phỏng vấn nhập môn" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 169,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600 font-black", children: language === "en" ? `Step ${step} / 4 (${progressPct}%)` : `Bước ${step} / 4 (${progressPct}%)` }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 170,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 168,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-2 w-full bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "h-full bg-indigo-600 transition-all duration-300 rounded-full",
            style: { width: `${progressPct}%` }
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 175,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 174,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 167,
        columnNumber: 9
      }, this),
      error && /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50 border border-rose-200 text-rose-800 text-xs py-2.5 px-3.5 rounded-xl mb-5 flex items-center gap-2 shadow-sm animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 rounded-full bg-rose-500 shrink-0" }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 185,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: error }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 186,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 184,
        columnNumber: 11
      }, this),
      step === 1 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-indigo-50 text-indigo-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Compass, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 195,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 194,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-black text-slate-800 tracking-tight leading-snug", children: language === "en" ? "Why are you learning English?" : "Bạn học tiếng Anh để làm gì?" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 197,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed font-semibold", children: language === "en" ? "Select all statements that best describe your study purposes." : "Chọn các đáp án mô tả đúng nhất mục đích học tập của bạn." }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 201,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2.5 pt-2", children: GOALS_LIST.map((g) => {
          const active = selectedPurposes.includes(g.label);
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `goal-item-${g.id}`,
              onClick: () => togglePurpose(g.label),
              type: "button",
              className: `flex items-center gap-3 border text-left px-5 py-3.5 rounded-xl transition-all cursor-pointer ${active ? "border-indigo-600 bg-indigo-50 text-indigo-850 ring-2 ring-indigo-550/15 shadow-sm scale-[1.01]" : "border-slate-200 hover:bg-slate-50 bg-white text-slate-700 hover:border-slate-300"}`,
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-xl shrink-0", children: g.emoji }, void 0, false, {
                  fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                  lineNumber: 220,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold leading-tight", children: getGoalLabel(g.label) }, void 0, false, {
                  fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                  lineNumber: 221,
                  columnNumber: 21
                }, this)
              ]
            },
            g.id,
            true,
            {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 209,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 205,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 192,
        columnNumber: 11
      }, this),
      step === 2 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-indigo-50 text-indigo-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Award, { className: "w-5 h-5" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 234,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 233,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-black text-slate-800 tracking-tight leading-snug", children: language === "en" ? "How do you rate your current level?" : "Bạn tự đánh giá bản thân đang ở mức độ nào?" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 236,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 232,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed font-semibold", children: language === "en" ? "Choose the closest estimate. The smart study plan and test questions will adapt accordingly." : "Chọn mức độ sát nhất nhé. Sơ đồ học và bài thi sau này sẽ thích ứng theo mức độ này." }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 240,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 pt-2 max-h-72 overflow-y-auto pr-1", children: LEVELS_LIST.map((lvl) => {
          const active = proficiency === lvl.level;
          const details = getLevelDetails(lvl);
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `lvl-item-${lvl.id}`,
              onClick: () => setProficiency(lvl.level),
              type: "button",
              className: `w-full flex flex-col border text-left p-4 rounded-xl transition-all cursor-pointer ${active ? "border-indigo-600 bg-indigo-50 text-indigo-850 ring-2 ring-indigo-550/15 shadow-sm scale-[1.01]" : "border-slate-200 hover:bg-slate-50 bg-white text-slate-700 hover:border-slate-300"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center w-full mb-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black uppercase tracking-wide", children: details.label }, void 0, false, {
                    fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                    lineNumber: 261,
                    columnNumber: 23
                  }, this),
                  active && /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4 text-indigo-600 shrink-0" }, void 0, false, {
                    fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                    lineNumber: 262,
                    columnNumber: 34
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                  lineNumber: 260,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-500 leading-normal font-semibold", children: details.sub }, void 0, false, {
                  fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                  lineNumber: 264,
                  columnNumber: 21
                }, this)
              ]
            },
            lvl.id,
            true,
            {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 249,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 244,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 231,
        columnNumber: 11
      }, this),
      step === 3 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-amber-50 text-amber-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Clock, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 277,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 276,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-black text-slate-800 tracking-tight leading-snug", children: language === "en" ? "How many minutes can you study daily?" : "Bạn có thể học bao nhiêu phút mỗi ngày?" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 279,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 275,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-550 leading-relaxed font-semibold", children: language === "en" ? "Committing time helps the AI optimize the number of lessons in your suggested plan." : "Cam kết thời gian mỗi ngày giúp AI tối ưu hóa số lượng bài trong kế hoạch đề xuất." }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 283,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-2.5 pt-2", children: DURATIONS_LIST.map((d) => {
          const active = minutesPerDay === d.value;
          const details = getDurationDetails(d);
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `time-item-${d.value}`,
              onClick: () => setMinutesPerDay(d.value),
              type: "button",
              className: `flex items-center justify-between border text-left p-4 rounded-xl transition-all cursor-pointer ${active ? "border-amber-500 bg-amber-50/55 text-amber-950 ring-2 ring-amber-500/20 shadow-sm scale-[1.01]" : "border-slate-200 hover:bg-slate-50 bg-white text-slate-700 hover:border-slate-300"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black", children: details.label }, void 0, false, {
                    fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                    lineNumber: 304,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500 mt-0.5 font-bold", children: details.desc }, void 0, false, {
                    fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                    lineNumber: 305,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                  lineNumber: 303,
                  columnNumber: 21
                }, this),
                active && /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4 text-amber-600 animate-bounce" }, void 0, false, {
                  fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                  lineNumber: 307,
                  columnNumber: 32
                }, this)
              ]
            },
            d.value,
            true,
            {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 292,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 287,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 274,
        columnNumber: 11
      }, this),
      step === 4 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-indigo-50 text-indigo-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Mail, { className: "w-5 h-5" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 320,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 319,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-black text-slate-800 tracking-tight leading-snug", children: language === "en" ? "Weekly AI Progress Report Email" : "Email báo cáo học tập định kỳ" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 322,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 318,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed font-semibold", children: language === "en" ? "We will send your review statistics, study reminders, and AI progress evaluations for free." : "Chúng tôi sẽ gửi kết quả ôn luyện định kỳ, nhắc lịch học, và báo cáo tiến độ bằng AI hoàn toàn miễn phí." }, void 0, false, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 326,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "notify-email",
                type: "email",
                value: emailNotify,
                onChange: (e) => setEmailNotify(e.target.value),
                placeholder: language === "en" ? "student@example.com" : "viid_sinhvien@gmail.com",
                className: "w-full bg-white border border-slate-200/80 rounded-xl pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                lineNumber: 332,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxDEV(Mail, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 341,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 340,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 331,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-2 font-mono font-medium", children: language === "en" ? "Your email is always encrypted to guarantee data security." : "Email của bạn luôn được mã hóa để bảo đảm an toàn dữ liệu học viên." }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 344,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 330,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-150 rounded-xl mt-4 flex gap-3 text-[11px] text-slate-600 leading-relaxed", children: [
          /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-5 h-5 text-indigo-600 shrink-0 mt-0.5" }, void 0, false, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 350,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-800 block mb-0.5", children: language === "en" ? "Next Step: Discover Your Practical Level" : "Bước tiếp theo: Khám phá trình độ thực tế" }, void 0, false, {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 352,
              columnNumber: 17
            }, this),
            language === "en" ? "You will start a high-quality adaptive assessment test (comprising Listening, Pronunciation speech, Reading comprehension, and Writing/Fill gaps) evaluated instantly by AI." : "Học viên sẽ được trải nghiệm bài kiểm tra đầu vào thích ứng chất lượng cao (gồm Nghe hiểu, Phát âm nói, Đọc hiểu, Viết / Điền câu) được chấm tự động bằng AI."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 351,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/OnboardingInterview.tsx",
          lineNumber: 349,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 317,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "mt-8 flex justify-between gap-4 border-t border-slate-100 pt-6", children: [
        step > 1 && /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-interview-prev",
            type: "button",
            onClick: handlePrevStep,
            className: "flex items-center gap-2 border border-slate-200/80 hover:bg-slate-50 text-slate-600 text-xs font-bold px-4 py-3 rounded-xl cursor-pointer transition-all bg-white shadow-sm hover:border-slate-300",
            children: [
              /* @__PURE__ */ jsxDEV(ArrowLeft, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                lineNumber: 370,
                columnNumber: 15
              }, this),
              " ",
              language === "en" ? "BACK" : "QUAY LẠI"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 364,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-interview-next",
            type: "button",
            onClick: handleNextStep,
            disabled: loading,
            className: "ml-auto flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black tracking-wider uppercase px-6 py-3 rounded-xl cursor-pointer transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-50",
            children: loading ? /* @__PURE__ */ jsxDEV("span", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 382,
              columnNumber: 15
            }, this) : step === 4 ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
              " ",
              language === "en" ? "SUBMIT & TAKE TEST" : "HOÀN THÀNH & THI TEST",
              " ",
              /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                lineNumber: 384,
                columnNumber: 87
              }, this),
              " "
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 384,
              columnNumber: 15
            }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
              " ",
              language === "en" ? "CONTINUE" : "TIẾP TỤC",
              " ",
              /* @__PURE__ */ jsxDEV(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/OnboardingInterview.tsx",
                lineNumber: 386,
                columnNumber: 64
              }, this),
              " "
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/OnboardingInterview.tsx",
              lineNumber: 386,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/OnboardingInterview.tsx",
            lineNumber: 374,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/OnboardingInterview.tsx",
        lineNumber: 362,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/OnboardingInterview.tsx",
      lineNumber: 164,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/OnboardingInterview.tsx",
    lineNumber: 158,
    columnNumber: 5
  }, this);
}
