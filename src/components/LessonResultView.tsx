import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle2, XCircle, Zap, Star, Trophy, ArrowRight, Volume2, VolumeX, AlertCircle, RefreshCw } from "lucide-react";
import { handleBackToHome } from "/src/utils/roadmapProgressManager.ts";
export function CountUp({
  end,
  duration = 1500,
  delay = 0,
  suffix = "",
  prefix = ""
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    let animFrameId;
    const timeoutId = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        if (progress < 1) {
          animFrameId = window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      animFrameId = window.requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (animFrameId) {
        window.cancelAnimationFrame(animFrameId);
      }
    };
  }, [end, duration, delay]);
  return /* @__PURE__ */ jsxDEV("span", { children: [
    prefix,
    count,
    suffix
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/LessonResultView.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}
export function LessonResultView({
  title,
  subtitle,
  correctAnswers,
  totalQuestions,
  xpEarned,
  streakDays = 1,
  passed,
  unlockedLevelMessage,
  achievementsUnlocked = [],
  ctaText = "QUAY LẠI LỘ TRÌNH HỌC TẬP",
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick
}) {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("lesson_result_sound_muted") === "true";
    } catch {
      return false;
    }
  });
  const [showBadgeBanner, setShowBadgeBanner] = useState(true);
  const accuracy = Math.round(correctAnswers / Math.max(totalQuestions, 1) * 100);
  useEffect(() => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const playTone = (freq, startTime, duration, type = "sine", gainVal = 0.1) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(gainVal, startTime);
        gainNode.gain.exponentialRampToValueAtTime(1e-4, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      if (passed) {
        playTone(392, now, 0.2, "triangle", 0.12);
        playTone(493.88, now + 0.15, 0.2, "sine", 0.12);
        playTone(587.33, now + 0.3, 0.2, "sine", 0.12);
        playTone(783.99, now + 0.45, 0.5, "sine", 0.15);
        if (accuracy >= 85) {
          playTone(987.77, now + 0.65, 0.15, "sine", 0.08);
          playTone(1174.66, now + 0.8, 0.4, "sine", 0.1);
        }
      } else {
        playTone(349.23, now, 0.25, "sine", 0.12);
        playTone(311.13, now + 0.22, 0.3, "triangle", 0.1);
        playTone(261.63, now + 0.48, 0.5, "sine", 0.08);
      }
    } catch (e) {
      console.warn("Sound feedback failed due to user gesture requirement", e);
    }
  }, [passed, isMuted, accuracy]);
  useEffect(() => {
    if (passed && achievementsUnlocked.length > 0) {
      const hideTimer = setTimeout(() => {
        setShowBadgeBanner(false);
      }, 8500);
      return () => clearTimeout(hideTimer);
    }
  }, [passed, achievementsUnlocked]);
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newVal = !prev;
      try {
        localStorage.setItem("lesson_result_sound_muted", String(newVal));
      } catch {
      }
      return newVal;
    });
  };
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      id: "lesson-result-card-outer",
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
      className: "p-1 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-slate-100/55 to-slate-200/50 border border-slate-200/60 shadow-lg",
      children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          id: "lesson-result-panel",
          className: "bg-white rounded-[22px] px-6 py-10 md:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl shadow-xl",
          children: [
            passed && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: [...Array(20)].map((_, i) => /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                className: `absolute w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? "bg-indigo-500/50" : i % 3 === 1 ? "bg-amber-400/60" : "bg-emerald-400/55"}`,
                initial: {
                  x: `${15 + Math.random() * 70}%`,
                  y: "110%",
                  scale: 0.3 + Math.random() * 0.7,
                  opacity: 0
                },
                animate: {
                  y: ["110%", "-10%"],
                  x: [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 80}%`],
                  rotate: [0, 360],
                  opacity: [0, 0.85, 0.85, 0]
                },
                transition: {
                  duration: 3 + Math.random() * 2,
                  delay: 4.5 + i * 0.08,
                  // Activates sequentially right with Step 5 (4.5s)
                  ease: "easeOut",
                  repeat: 1
                }
              },
              i,
              false,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 196,
                columnNumber: 15
              },
              this
            )) }, void 0, false, {
              fileName: "/app/applet/src/components/LessonResultView.tsx",
              lineNumber: 194,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 right-4 z-20", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: toggleMute,
                className: "p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-500 hover:text-slate-805 transition-all cursor-pointer flex items-center justify-center shadow-xs",
                title: isMuted ? "Bật âm thanh" : "Tắt âm thanh",
                children: isMuted ? /* @__PURE__ */ jsxDEV(VolumeX, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 231,
                  columnNumber: 24
                }, this) : /* @__PURE__ */ jsxDEV(Volume2, { className: "w-4 h-4 text-indigo-600 animate-pulse" }, void 0, false, {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 231,
                  columnNumber: 58
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 226,
                columnNumber: 11
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/LessonResultView.tsx",
              lineNumber: 225,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                className: "text-center space-y-4",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "relative inline-block", children: [
                    /* @__PURE__ */ jsxDEV(
                      motion.div,
                      {
                        animate: { scale: [1, 1.12, 1], rotate: 360 },
                        transition: { duration: 12, repeat: Infinity, ease: "linear" },
                        className: `absolute -inset-6 rounded-full filter blur-xl opacity-20 ${passed ? "bg-emerald-500" : "bg-rose-400"}`
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/LessonResultView.tsx",
                        lineNumber: 244,
                        columnNumber: 13
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      motion.div,
                      {
                        initial: { scale: 0.5, rotate: -10 },
                        animate: { scale: 1, rotate: 0 },
                        transition: { type: "spring", stiffness: 180, damping: 14, delay: 0.1 },
                        className: `w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl border relative z-10 ${passed ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white border-emerald-400/50 ring-4 ring-emerald-500/5" : "bg-gradient-to-tr from-rose-500 to-amber-500 text-white border-rose-450/50 ring-4 ring-rose-500/5"}`,
                        children: passed ? /* @__PURE__ */ jsxDEV(Award, { className: "w-10 h-10 drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]" }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 263,
                          columnNumber: 17
                        }, this) : /* @__PURE__ */ jsxDEV(XCircle, { className: "w-10 h-10 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]" }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 265,
                          columnNumber: 17
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/LessonResultView.tsx",
                        lineNumber: 252,
                        columnNumber: 13
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 242,
                    columnNumber: 11
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 max-w-md mx-auto", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border ${passed ? "text-emerald-700 bg-emerald-50/70 border-emerald-200" : "text-rose-700 bg-rose-50/70 border-rose-250"}`, children: passed ? "Đã Đạt Chỉ Tiêu Bài Luyện!" : "Chưa Đạt Chỉ Tiêu" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 271,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("h2", { id: "lesson-result-title", className: "text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight pt-1", children: title }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 278,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto", children: subtitle }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 281,
                      columnNumber: 13
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 270,
                    columnNumber: 11
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 236,
                columnNumber: 9
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.93 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1, ease: "easeOut", delay: 1 },
                className: "flex justify-center flex-col items-center py-2",
                children: /* @__PURE__ */ jsxDEV("div", { className: "relative w-40 h-40 flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxDEV("svg", { className: "absolute w-full h-full transform -rotate-90", children: [
                    /* @__PURE__ */ jsxDEV(
                      "circle",
                      {
                        cx: "80",
                        cy: "80",
                        r: "70",
                        className: "stroke-slate-100 fill-none",
                        strokeWidth: "8"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/LessonResultView.tsx",
                        lineNumber: 296,
                        columnNumber: 15
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      motion.circle,
                      {
                        cx: "80",
                        cy: "80",
                        r: "70",
                        className: `fill-none ${passed ? "stroke-emerald-500" : "stroke-rose-500"}`,
                        strokeWidth: "8",
                        strokeDasharray: 2 * Math.PI * 70,
                        initial: { strokeDashoffset: 2 * Math.PI * 70 },
                        animate: { strokeDashoffset: 2 * Math.PI * 70 * (1 - accuracy / 100) },
                        transition: {
                          duration: 2.5,
                          // 2.5s slow-paced circular sweep
                          ease: [0.25, 1, 0.5, 1],
                          // ease-out cubic-bezier easing curve
                          delay: 1
                          // Start right at 1.0s
                        },
                        strokeLinecap: "round"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/LessonResultView.tsx",
                        lineNumber: 303,
                        columnNumber: 15
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 295,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "text-center z-10 space-y-0.5", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block", children: "ĐỘ CHÍNH XÁC" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 324,
                      columnNumber: 15
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-3xl md:text-4xl font-extrabold text-slate-900 font-mono tracking-tight block", children: /* @__PURE__ */ jsxDEV(CountUp, { end: accuracy, duration: 1500, delay: 1e3, suffix: "%" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 327,
                      columnNumber: 17
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 325,
                      columnNumber: 15
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-500 font-semibold block", children: [
                      correctAnswers,
                      "/",
                      totalQuestions,
                      " câu đúng"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 329,
                      columnNumber: 15
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 323,
                    columnNumber: 13
                  }, this),
                  passed && /* @__PURE__ */ jsxDEV(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: [0, 0.3, 0.15] },
                      transition: { delay: 2.5, duration: 1.2 },
                      className: "absolute inset-0 rounded-full border-4 border-emerald-500/20 blur-[2px] animate-pulse"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 335,
                      columnNumber: 15
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 294,
                  columnNumber: 11
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 288,
                columnNumber: 9
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 max-w-md mx-auto", children: [
              /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, y: 15 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, ease: "easeOut", delay: 2.5 },
                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center text-center shadow-xs",
                  children: [
                    /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-5.5 h-5.5 text-emerald-500 mb-1" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 354,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-black text-slate-400 tracking-widest", children: "ĐÚNG" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 355,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-extrabold text-slate-800 font-mono mt-0.5", children: /* @__PURE__ */ jsxDEV(CountUp, { end: correctAnswers, duration: 1e3, delay: 2500 }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 357,
                      columnNumber: 15
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 356,
                      columnNumber: 13
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 348,
                  columnNumber: 11
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, y: 15 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, ease: "easeOut", delay: 2.8 },
                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center text-center shadow-xs",
                  children: [
                    /* @__PURE__ */ jsxDEV(XCircle, { className: "w-5.5 h-5.5 text-rose-500 mb-1" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 368,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-black text-slate-400 tracking-widest", children: "SAI" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 369,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-extrabold text-slate-800 font-mono mt-0.5", children: /* @__PURE__ */ jsxDEV(CountUp, { end: Math.max(totalQuestions - correctAnswers, 0), duration: 1e3, delay: 2800 }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 371,
                      columnNumber: 15
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 370,
                      columnNumber: 13
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 362,
                  columnNumber: 11
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/LessonResultView.tsx",
              lineNumber: 346,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 max-w-md mx-auto", children: [
              /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: {
                    opacity: 1,
                    scale: 1,
                    boxShadow: passed ? "0 0 22px rgba(245, 158, 11, 0.22)" : "none"
                  },
                  transition: { duration: 0.8, ease: "easeOut", delay: 3.5 },
                  className: `p-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center ${passed ? "bg-amber-50/70 border-amber-300/80 shadow-md text-amber-950" : "bg-slate-50 border-slate-200 text-slate-800"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV(Zap, { className: `w-5.5 h-5.5 mb-1.5 ${passed ? "text-amber-505 fill-amber-200 animate-bounce" : "text-slate-400"}` }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 393,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-black text-slate-400 tracking-widest", children: "XP NHẬN ĐƯỢC" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 394,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: `text-xl font-mono mt-0.5 ${passed ? "font-black text-amber-700" : "font-semibold text-slate-500"}`, children: /* @__PURE__ */ jsxDEV(CountUp, { end: xpEarned, duration: 1200, delay: 3500, prefix: "+", suffix: " XP" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 396,
                      columnNumber: 15
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 395,
                      columnNumber: 13
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 379,
                  columnNumber: 11
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: {
                    opacity: 1,
                    scale: 1,
                    boxShadow: passed ? "0 0 22px rgba(99, 102, 241, 0.15)" : "none"
                  },
                  transition: { duration: 0.8, ease: "easeOut", delay: 3.8 },
                  className: `p-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center ${passed ? "bg-indigo-50/70 border-indigo-200/85 shadow-md text-indigo-950" : "bg-slate-50 border-slate-200 text-slate-800"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV(Trophy, { className: "w-5.5 h-5.5 text-indigo-500 mb-1.5 animate-pulse" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 415,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-black text-slate-400 tracking-widest", children: "CHUỖI LIÊN TIẾP" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 416,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-indigo-700 font-mono mt-0.5", children: /* @__PURE__ */ jsxDEV(CountUp, { end: streakDays, duration: 1e3, delay: 3800, suffix: " ngày" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 418,
                      columnNumber: 15
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 417,
                      columnNumber: 13
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                  lineNumber: 401,
                  columnNumber: 11
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/LessonResultView.tsx",
              lineNumber: 377,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV(AnimatePresence, { children: passed && (unlockedLevelMessage || achievementsUnlocked.length > 0 && showBadgeBanner) && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 15, scale: 0.9 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: -15, scale: 0.95 },
                transition: { duration: 0.8, type: "spring", stiffness: 180, damping: 16, delay: 4.5 },
                className: "space-y-4 max-w-md mx-auto",
                children: [
                  unlockedLevelMessage && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3.5 text-left shadow-sm", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/10 text-lg shrink-0 animate-pulse", children: "🎉" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 436,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold uppercase text-emerald-800 tracking-wider block", children: "TIẾN ĐỘ THĂNG HẠNG" }, void 0, false, {
                        fileName: "/app/applet/src/components/LessonResultView.tsx",
                        lineNumber: 440,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-950 text-xs font-black block leading-none", children: unlockedLevelMessage }, void 0, false, {
                        fileName: "/app/applet/src/components/LessonResultView.tsx",
                        lineNumber: 441,
                        columnNumber: 21
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 439,
                      columnNumber: 19
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 435,
                    columnNumber: 17
                  }, this),
                  achievementsUnlocked.length > 0 && showBadgeBanner && /* @__PURE__ */ jsxDEV(
                    motion.div,
                    {
                      initial: { scale: 0.92 },
                      animate: {
                        scale: [0.92, 1.04, 1],
                        boxShadow: "0 0 28px rgba(245,158,11,0.35)"
                      },
                      transition: { duration: 1, ease: "easeOut" },
                      className: "bg-amber-50/75 border-2 border-amber-300 p-5 rounded-2xl space-y-3.5 shadow-xl text-left relative overflow-hidden",
                      children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 p-2 text-[8px] font-extrabold text-amber-500 bg-amber-100/60 rounded-bl-xl uppercase tracking-wider", children: "Hiển thị 4 giây" }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 457,
                          columnNumber: 19
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxDEV(Star, { className: "w-4.5 h-4.5 text-amber-500 fill-amber-300 animate-spin", style: { animationDuration: "7s" } }, void 0, false, {
                            fileName: "/app/applet/src/components/LessonResultView.tsx",
                            lineNumber: 462,
                            columnNumber: 21
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold uppercase text-amber-800 tracking-widest leading-none", children: "CẬP NHẬT DANH HIỆU CHINH PHỤC!" }, void 0, false, {
                            fileName: "/app/applet/src/components/LessonResultView.tsx",
                            lineNumber: 463,
                            columnNumber: 21
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 461,
                          columnNumber: 19
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5", children: achievementsUnlocked.map((badge) => /* @__PURE__ */ jsxDEV(
                          "div",
                          {
                            className: "flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-200/80 shadow-sm transform transition-all hover:scale-[1.01]",
                            style: { boxShadow: "inset 0 0 10px rgba(245, 158, 11, 0.05)" },
                            children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-2xl animate-bounce", style: { animationDuration: "1.8s" }, children: badge.emoji }, void 0, false, {
                                fileName: "/app/applet/src/components/LessonResultView.tsx",
                                lineNumber: 473,
                                columnNumber: 25
                              }, this),
                              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-w-0", children: [
                                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 tracking-tight truncate", children: badge.title }, void 0, false, {
                                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                                  lineNumber: 475,
                                  columnNumber: 27
                                }, this),
                                /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 leading-normal truncate", children: badge.desc }, void 0, false, {
                                  fileName: "/app/applet/src/components/LessonResultView.tsx",
                                  lineNumber: 476,
                                  columnNumber: 27
                                }, this)
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/LessonResultView.tsx",
                                lineNumber: 474,
                                columnNumber: 25
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-amber-600 bg-amber-100/50 px-2 py-1 rounded-lg border border-amber-250/30 shrink-0", children: [
                                "+",
                                badge.xpReward,
                                " XP"
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/LessonResultView.tsx",
                                lineNumber: 478,
                                columnNumber: 25
                              }, this)
                            ]
                          },
                          badge.id,
                          true,
                          {
                            fileName: "/app/applet/src/components/LessonResultView.tsx",
                            lineNumber: 468,
                            columnNumber: 23
                          },
                          this
                        )) }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 466,
                          columnNumber: 19
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 448,
                      columnNumber: 17
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 426,
                columnNumber: 13
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/LessonResultView.tsx",
              lineNumber: 424,
              columnNumber: 9
            }, this),
            !passed && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 4.5 },
                className: "bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex gap-3.5 text-left max-w-md mx-auto items-start",
                children: [
                  /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-5.5 h-5.5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" }, void 0, false, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 498,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-650 leading-relaxed font-semibold", children: [
                    "Kết quả của bạn chưa đủ để hoàn thành bài này. Bạn cần trả lời chính xác từ ",
                    /* @__PURE__ */ jsxDEV("strong", { children: "80% trở lên" }, void 0, false, {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 500,
                      columnNumber: 91
                    }, this),
                    " để hoàn tất đề thi. Đóng góp nỗ lực bền bỉ, nhấp làm lại để thử thách lại ngay nhé!"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/LessonResultView.tsx",
                    lineNumber: 499,
                    columnNumber: 13
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 492,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, ease: "easeOut", delay: 5.5 },
                className: "pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-center items-center gap-3.5",
                children: [
                  ctaText.toLowerCase() !== "quay lại trang chính" && /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: "btn-home-cta",
                      onClick: handleBackToHome,
                      className: "w-full sm:w-auto px-6 py-3 border border-slate-350 hover:bg-slate-50 text-slate-750 hover:text-slate-950 font-black text-xs tracking-widest rounded-xl cursor-pointer transition-all active:scale-[0.98] outline-none shadow-xs flex items-center justify-center gap-1.5 uppercase select-none",
                      children: [
                        /* @__PURE__ */ jsxDEV("span", { children: "Quay lại trang chính" }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 521,
                          columnNumber: 15
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 522,
                      columnNumber: 13
                    },
                    this
                  ),
                  secondaryCtaText && onSecondaryCtaClick && /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: "btn-secondary-cta",
                      onClick: onSecondaryCtaClick,
                      className: "w-full sm:w-auto px-6 py-3 border border-slate-350 hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-black text-xs tracking-widest rounded-xl cursor-pointer transition-all active:scale-[0.98] outline-none shadow-xs flex items-center justify-center gap-1.5 uppercase select-none",
                      children: [
                        /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 518,
                          columnNumber: 15
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { children: secondaryCtaText }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 519,
                          columnNumber: 15
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 513,
                      columnNumber: 13
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: "btn-main-cta",
                      onClick: onCtaClick,
                      className: `w-full sm:w-auto px-8 py-3.5 font-black text-xs tracking-widest text-white rounded-xl cursor-pointer transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 select-none uppercase ${passed ? "bg-indigo-600 hover:bg-indigo-550 shadow-indigo-500/20" : "bg-slate-800 hover:bg-slate-900 shadow-slate-800/10"}`,
                      children: [
                        /* @__PURE__ */ jsxDEV("span", { children: ctaText }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 532,
                          columnNumber: 13
                        }, this),
                        /* @__PURE__ */ jsxDEV(ArrowRight, { className: "w-4 h-4 animate-pulse" }, void 0, false, {
                          fileName: "/app/applet/src/components/LessonResultView.tsx",
                          lineNumber: 533,
                          columnNumber: 13
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/LessonResultView.tsx",
                      lineNumber: 523,
                      columnNumber: 11
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/LessonResultView.tsx",
                lineNumber: 506,
                columnNumber: 9
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/LessonResultView.tsx",
          lineNumber: 188,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/LessonResultView.tsx",
      lineNumber: 181,
      columnNumber: 5
    },
    this
  );
}
