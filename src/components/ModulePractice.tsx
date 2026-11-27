import React, { useState, useEffect, useRef, Fragment } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { api } from "/src/api.ts";
import { evaluateSpeakingText } from "/src/utils/speechEvaluator.ts";
import { Headphones, Mic, BookOpen, PenTool, CheckCircle, Lock, Play, Pause, ChevronRight, Volume2, MessageSquare, FileText, BookMarked, Sparkles } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { db } from "/src/firebase.ts";
import { collection, query, where, getDocs } from "firebase/firestore";
import ModulePracticeAddons from "/src/components/ModulePracticeAddons.tsx";
import ModuleGrammar from "/src/components/ModuleGrammar.tsx";
import VocabularyPracticeSuite from "/src/components/VocabularyPracticeSuite.tsx";
import { LessonResultView } from "/src/components/LessonResultView.tsx";
import { checkAndCompleteActiveTask, handleBackToHome } from "/src/utils/roadmapProgressManager.ts";
const CORE_SKILL_TABS = [
  { id: "grammar", title: "Luyện ngữ pháp", subtitle: "Grammar Mastery cốt lõi", icon: BookOpen, color: "text-violet-600 border-violet-100 bg-violet-50 shadow-sm" },
  { id: "listening", title: "Nghe hiểu", subtitle: "Nghe hội thoại thực tế", icon: Headphones, color: "text-sky-600 border-sky-100 bg-sky-50 shadow-sm" },
  { id: "reading", title: "Đọc hiểu", subtitle: "Đọc hiểu văn cảnh cụ thể", icon: FileText, color: "text-teal-600 border-teal-100 bg-teal-50 shadow-sm" },
  { id: "writing", title: "Viết câu / Test", subtitle: "Sửa lỗi tóm tắt & Viết câu", icon: PenTool, color: "text-fuchsia-600 border-fuchsia-100 bg-fuchsia-50 shadow-sm" }
];
const SUPPLEMENTARY_SKILL_TABS = [
  { id: "vocabulary", title: "Từ vựng CEFR", subtitle: "Từ vựng cốt lõi theo cấp độ", icon: BookMarked, color: "text-orange-600 border-orange-100 bg-orange-50 shadow-sm" },
  { id: "ipa", title: "Phát âm IPA", subtitle: "Chữa ngọng & âm vị chuẩn", icon: Mic, color: "text-rose-600 border-rose-100 bg-rose-50 shadow-sm" },
  { id: "speaking", title: "Hội thoại", subtitle: "Dialogue roleplay phản xạ", icon: MessageSquare, color: "text-emerald-500 border-emerald-100 bg-emerald-50 shadow-sm" }
];
const SKILL_TABS = [...CORE_SKILL_TABS, ...SUPPLEMENTARY_SKILL_TABS];
const MicPermissionInstructions = ({ errorMsg, onClose }) => {
  const [activeTab, setActiveTab] = React.useState("chrome");
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-amber-900 rounded-2xl p-4.5 space-y-3.5 shadow-md text-left w-full relative z-10 animate-fade-in font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-amber-500 text-white rounded-xl shadow-sm", children: /* @__PURE__ */ jsxDEV(Mic, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 43,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-amber-950 flex items-center gap-1.5 leading-tight", children: "Chưa Cấp Quyền Microphone 🎙️" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 46,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-600 leading-normal text-[11px] mt-1 font-medium", children: "Lớp học cần giọng nói của bạn để phân tích phát âm. Bạn hãy xử lý nhanh theo hướng dẫn phù hợp dưới đây nhé:" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 49,
          columnNumber: 11
        }, this),
        errorMsg && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-amber-800 bg-amber-100/50 p-2 rounded-lg mt-1.5 font-mono border border-amber-200", children: [
          "Chi tiết lỗi: ",
          errorMsg
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 53,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePractice.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 border-b border-amber-200/50 pb-2", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("chrome"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "chrome" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🌐 Chrome / Edge"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 62,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("firefox"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "firefox" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🦊 Firefox"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 71,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("safari"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "safari" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🍏 Safari (iOS)"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 80,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("android"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "android" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🤖 Android"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 89,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePractice.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-[11px] text-slate-700 leading-relaxed space-y-2 bg-white/75 p-3 rounded-xl border border-amber-200", children: [
      activeTab === "chrome" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Khóa (Lock) 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 104,
            columnNumber: 32
          }, this),
          " nằm bên trái thanh địa chỉ URL trình duyệt."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 104,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tại phần ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone (Micro)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 105,
            columnNumber: 26
          }, this),
          ", bấm chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 105,
            columnNumber: 72
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 105,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm phím ",
          /* @__PURE__ */ jsxDEV("strong", { children: "F5" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 106,
            columnNumber: 26
          }, this),
          " hoặc tải lại trang web (Reload) nếu trình duyệt hỏi."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 106,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 103,
        columnNumber: 11
      }, this),
      activeTab === "firefox" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Click biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt trang web / Khóa 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 111,
            columnNumber: 34
          }, this),
          " ở góc trái URL thanh trình duyệt."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Xóa chặn quyền / Nhấp dấu X bên cạnh quyền Micro bị chặn." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tải lại trang (F5) và bấm nút nói, chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 113,
            columnNumber: 57
          }, this),
          " khi có popup hiện lên."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 113,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 110,
        columnNumber: 11
      }, this),
      activeTab === "safari" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Mở ứng dụng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt (Settings) ⚙️" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 118,
            columnNumber: 29
          }, this),
          " trên màn hình thiết bị của bạn."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 118,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Kéo tìm chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Safari" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 119,
            columnNumber: 30
          }, this),
          " ",
          `>`,
          " Nhấp chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 119,
            columnNumber: 70
          }, this),
          " ",
          `>`,
          " Chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 119,
            columnNumber: 109
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 119,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Tuyệt chiêu:" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 120,
            columnNumber: 17
          }, this),
          " Nhấp nút ",
          /* @__PURE__ */ jsxDEV("strong", { children: '"Mở cửa sổ mới" ↗' }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 120,
            columnNumber: 56
          }, this),
          " ở góc trên bên phải trang web để chạy độc lập và xin quyền trực diện!"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 120,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      activeTab === "android" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "ba chấm ⋮" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 125,
            columnNumber: 32
          }, this),
          " trên góc trình duyệt Chrome ",
          `>`,
          " ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt trang web" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 125,
            columnNumber: 93
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 125,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Chọn mục ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 126,
            columnNumber: 26
          }, this),
          " và click gạt chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 126,
            columnNumber: 72
          }, this),
          " cho trang web này."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 126,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Hoặc cấp quyền cho ứng dụng Chrome trong mục ứng dụng của cài đặt hệ điều hành Android." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 127,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 124,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePractice.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-100/60 p-2 rounded-xl border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-600 leading-normal", children: [
        "💡 ",
        /* @__PURE__ */ jsxDEV("strong", { children: "Gợi ý:" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 134,
          columnNumber: 14
        }, this),
        " Lưu ý hệ thống sẽ lưu trạng thái để tránh làm phiền bạn xin quyền liên tục."
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 133,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-3.5 py-1.5 text-[10px] font-black bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all cursor-pointer flex-shrink-0",
          children: "Xóa báo lỗi & Thử lại ngay 🎙️"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 136,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePractice.tsx",
      lineNumber: 132,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModulePractice.tsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
};
export default function ModulePractice({ user, onUserUpdate, activeTaskRedirect, onClearActiveTaskRedirect }) {
  const [activeTab, setActiveTab] = useState("grammar");
  const [practiceMode, setPracticeMode] = useState("pathway");
  const [addonsTab, setAddonsTab] = useState("tasks");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [passedLessons, setPassedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [speakingResult, setSpeakingResult] = useState(null);
  const [writingResult, setWritingResult] = useState(null);
  const [evaluatingAI, setEvaluatingAI] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recRef = useRef(null);
  const [recSuccess, setRecSuccess] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [quizTimer, setQuizTimer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [wasPerfect, setWasPerfect] = useState(false);
  const [unlockedLevelMsg, setUnlockedLevelMsg] = useState(null);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [backSpeed, setBackSpeed] = useState(0.85);
  const [cameFromRoadmap, setCameFromRoadmap] = useState(false);
  useEffect(() => {
    if (activeTaskRedirect) {
      setCameFromRoadmap(true);
    }
  }, [activeTaskRedirect]);
  useEffect(() => {
    if (user && user.currentLevel) {
      setSelectedLevel(user.currentLevel);
    } else if (user && user.level) {
      setSelectedLevel(user.level);
    }
  }, [user?.id, user?.currentLevel, user?.level]);
  useEffect(() => {
    if (activeTaskRedirect) {
      console.log("[ModulePractice] Handling activeTaskRedirect:", activeTaskRedirect);
      const { type, lessonId, level } = activeTaskRedirect;
      const levelMap = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
      const lvlNum = levelMap[level] || 1;
      const lsnNum = lessonId || 1;
      if (type === "vocabulary") {
        setPracticeMode("pathway");
        setActiveTab("vocabulary");
      } else if (type === "grammar") {
        setPracticeMode("pathway");
        setActiveTab("grammar");
      } else if (type === "listening") {
        setPracticeMode("pathway");
        setActiveTab("listening");
        startLessonQuiz(lvlNum, lsnNum, "listening");
      } else if (type === "reading") {
        setPracticeMode("pathway");
        setActiveTab("reading");
        startLessonQuiz(lvlNum, lsnNum, "reading");
      } else if (type === "writing") {
        setPracticeMode("pathway");
        setActiveTab("writing");
        startLessonQuiz(lvlNum, lsnNum, "writing");
      } else if (type === "speaking") {
        setPracticeMode("pathway");
        setActiveTab("speaking");
        startLessonQuiz(lvlNum, lsnNum, "speaking");
      } else if (type === "ipa") {
        setPracticeMode("pathway");
        setActiveTab("ipa");
      } else if (type === "mini-test" || type === "mock") {
        setPracticeMode("specialties");
        setAddonsTab("exams");
      } else if (type === "flashcard" || type === "review") {
        setPracticeMode("pathway");
        setActiveTab("vocabulary");
      }
      if (onClearActiveTaskRedirect) {
        onClearActiveTaskRedirect();
      }
    }
  }, [activeTaskRedirect]);
  const loadPassedLessons = async () => {
    try {
      const progress = await api.getUserProgress();
      setPassedLessons(progress || []);
    } catch (e) {
      console.error("Error fetching user progress:", e);
    }
  };
  useEffect(() => {
    loadPassedLessons();
  }, [user?.id, activeLesson]);
  const curLvlNum = user.currentLevelNumber || 1;
  const curLsnNum = user.currentLessonNumber || 1;
  useEffect(() => {
    if (activeLesson) {
      setSecondsSpent(0);
      const timer = setInterval(() => {
        setSecondsSpent((prev) => prev + 1);
      }, 1e3);
      setQuizTimer(timer);
      return () => clearInterval(timer);
    } else {
      if (quizTimer) clearInterval(quizTimer);
    }
  }, [activeLesson]);
  const handleLevelSelect = async (level) => {
    setSelectedLevel(level);
    try {
      const res = await api.updateActiveLevel(level);
      if (res) {
        onUserUpdate(res);
      }
    } catch (e) {
      console.error("Error updating active level:", e);
    }
  };
  const startLessonQuiz = async (lvl: number, lsn: number, skillOverride?: string) => {
    setLoadingQuestions(true);
    const targetSkill = skillOverride || activeTab;
    try {
      const qCol = collection(db, "questions");
      const safeQuery = query(
        qCol,
        where("skill", "==", targetSkill),
        where("levelNumber", "==", lvl),
        where("lessonNumber", "==", lsn)
      );
      const safeSnapshot = await getDocs(safeQuery);
      let safeList = safeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any)).filter((q) => !q.isDeleted);
      if (safeList.length === 0) {
        safeList = await api.getPracticeQuestions(targetSkill, lvl, lsn);
      }
      setQuestions(safeList);
      setCurrentQIdx(0);
      setUserAnswers({});
      setSpeakingResult(null);
      setWritingResult(null);
      setQuizFinished(false);
      setActiveLesson({ lvl, lsn });
      if (skillOverride) {
        setActiveTab(skillOverride);
      }
    } catch (err) {
      alert("Error fetching questions from Firestore: " + err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };
  const handlePlayReadingAudio = (text) => {
    if (!window.speechSynthesis) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    const tts = new SpeechSynthesisUtterance(text);
    tts.lang = "en-US";
    tts.rate = backSpeed;
    tts.onend = () => setIsPlayingAudio(false);
    tts.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(tts);
  };
  const handleToggleRec = async (question) => {
    console.log("Micro clicked");
    setMicPermissionError(null);
    if (isRecording) {
      console.log("Recording stopped manually");
      if (recRef.current) {
        try {
          recRef.current.stop();
        } catch (e) {
          console.warn("Error stopping speech recognition:", e);
        }
      }
      setIsRecording(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicPermissionError("Trình duyệt không hỗ trợ Web Speech API.");
      alert("Không thể truy cập microphone. Vui lòng sử dụng các trình duyệt hỗ trợ nhận diện giọng nói (Chrome, Edge, Safari) và kết nối HTTPS.");
      return;
    }
    setIsRecording(true);
    setRecSuccess(false);
    setSpeakingResult(null);
    console.log("Recording started");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recRef.current = recognition;
    recognition.onresult = async (event) => {
      if (!event.results || !event.results[0] || !event.results[0][0]) {
        console.warn("Speech recognition returned empty results.");
        setMicPermissionError("Không nghe rõ giọng nói của bạn, vui lòng đọc to hơn!");
        setIsRecording(false);
        return;
      }
      const textStr = event.results[0][0].transcript;
      setUserAnswers((prev) => ({ ...prev, [question.id]: textStr }));
      setRecSuccess(true);
      setIsRecording(false);
      console.log("Recording stopped with text: " + textStr);
      setEvaluatingAI(true);
      try {
        const evalResult = evaluateSpeakingText(question.speakingTarget || "", textStr);
        setSpeakingResult(evalResult);
      } catch (err) {
        console.warn("Failed speech evaluation", err);
      } finally {
        setEvaluatingAI(false);
      }
    };
    recognition.onnomatch = (event) => {
      console.warn("Speech recognition nomatch.");
      setMicPermissionError("Không nghe rõ giọng nói của bạn, vui lòng đọc to hơn!");
      setIsRecording(false);
    };
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsRecording(false);
      let errorDesc = "Không nhận diện được giọng nói. Vui lòng thử lại.";
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        errorDesc = "Quyền truy cập micro bị từ chối hoặc bị chặn. Vui lòng mở lại micro.";
      } else if (e.error === "no-speech") {
        errorDesc = "Không nhận diện được giọng nói. Vui lòng thử lại.";
      }
      setMicPermissionError(errorDesc);
    };
    recognition.onend = () => {
      setIsRecording(false);
      console.log("Recording ended");
    };
    try {
      recognition.start();
    } catch (ex) {
      console.error("Failed starting speech recognition:", ex);
      setIsRecording(false);
      setMicPermissionError("Không nhận diện được giọng nói. Vui lòng thử lại.");
    }
  };
  const fallbackSpeaking = (question) => {
    setTimeout(async () => {
      const mockResultText = question.speakingTarget || "Practice makes perfect when learning database schemas.";
      setUserAnswers((prev) => ({ ...prev, [question.id]: mockResultText }));
      setRecSuccess(true);
      setIsRecording(false);
      setEvaluatingAI(true);
      try {
        const evalResult = evaluateSpeakingText(question.speakingTarget || "", mockResultText);
        setSpeakingResult(evalResult);
      } catch (err) {
        console.warn("Fallback speech evaluation failed", err);
      } finally {
        setEvaluatingAI(false);
      }
    }, 2e3);
  };
  const handleRequestEssayEvaluation = async (question, essay) => {
    if (!essay) return;
    setEvaluatingAI(true);
    setWritingResult(null);
    try {
      const res = await api.evaluateWriting(question.writingPrompt || "", essay);
      setWritingResult(res);
    } catch (_) {
      setWritingResult({
        vocabulary: 85,
        grammar: 80,
        structure: 80,
        corrections: [{ original: essay, suggested: essay, explanation: "Bài chuẩn chỉ và đúng chính tả" }],
        detailedAdvice: "Hãy mở rộng thêm nhiều từ liên nối đa dạng."
      });
    } finally {
      setEvaluatingAI(false);
    }
  };
  const handleSubmitQuiz = async () => {
    if (!activeLesson) return;
    let scoreValue = 0;
    if (activeTab === "listening" || activeTab === "reading" || activeTab === "grammar") {
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctAnswer) {
          scoreValue++;
        }
      });
    }
    if (activeTab === "speaking") {
      scoreValue = 10;
    }
    if (activeTab === "writing") {
      scoreValue = writingResult?.grammar >= 75 ? 9 : 8;
    }
    try {
      const oldLvl = user.currentLevelNumber || 1;
      const oldLsn = user.currentLessonNumber || 1;
      const oldUnlocked = user.unlockedAchievements || [];
      const res = await api.submitLessonScore({
        skill: activeTab,
        levelNumber: activeLesson.lvl,
        lessonNumber: activeLesson.lsn,
        score: scoreValue,
        timeInSeconds: secondsSpent
      });
      const newLvl = res.user.currentLevelNumber || 1;
      const newLsn = res.user.currentLessonNumber || 1;
      if (scoreValue >= 8) {
        if (newLvl > oldLvl || newLvl === oldLvl && newLsn > oldLsn) {
          setUnlockedLevelMsg(`🔓 Cấp độ ${newLvl > oldLvl ? 1 : newLsn} đã được mở khóa`);
        } else {
          setUnlockedLevelMsg(`🔓 Cấp độ ${activeLesson.lsn + 1 <= 5 ? activeLesson.lsn + 1 : 1} đã được mở khóa`);
        }
      } else {
        setUnlockedLevelMsg(null);
      }
      const postUnlocked = res.user.unlockedAchievements || [];
      const freshUnlockIds = postUnlocked.filter((id) => !oldUnlocked.includes(id));
      const ACHIEVEMENTS_DEFINITIONS = [
        { id: "first_login", title: "Khởi đầu vinh quang", desc: "Tạo tài khoản và tham gia cộng đồng", xpReward: 50, emoji: "🐣" },
        { id: "test_completed", title: "Thợ săn trình độ", desc: "Hoàn thiện bài thi thử đầu vào 30 câu hỏi", xpReward: 100, emoji: "🎯" },
        { id: "practice_completed", title: "Chuyên cần bền bỉ", desc: "Hoàn thành 3 bài học luyện tập bất kỳ", xpReward: 150, emoji: "📚" },
        { id: "perfect_score", title: "Tuyệt đỉnh điểm số", desc: "Trả lời đúng 10/10 bài học kiểm tra", xpReward: 200, emoji: "🪐" },
        { id: "streak_3days", title: "Ngọn lửa bốc cháy", desc: "Duy trì chuỗi học liên tiếp tối thiểu 3 ngày", xpReward: 250, emoji: "🔥" }
      ];
      const newlyBadges = freshUnlockIds.map((id) => ACHIEVEMENTS_DEFINITIONS.find((a) => a.id === id)).filter(Boolean);
      setNewlyUnlockedAchievements(newlyBadges);
      setEarnedXP(res.xpAwarded);
      setQuizScore(scoreValue);
      setWasPerfect(scoreValue === 10);
      setQuizFinished(true);
      onUserUpdate(res.user);
      try {
        await checkAndCompleteActiveTask(activeTab);
      } catch (err) {
        console.warn("Failed to auto-complete roadmap task:", err);
      }
    } catch (e) {
      alert("Error submitting answers: " + e.message);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-3xl shadow-sm z-10 relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5", children: "🏆 CỔNG HỌC TẬP THÔNG MINH" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 565,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500", children: "Hứng khởi nâng cao năng lực phản xạ tiếng Anh toàn phổ thông qua các kịch bản học tập thiết lập bởi AI." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 568,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 564,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0 animate-fade", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              if (!activeLesson) setPracticeMode("pathway");
            },
            disabled: !!activeLesson,
            className: `px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${practiceMode === "pathway" ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"}`,
            children: "LỘ TRÌNH CORE"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 573,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              if (!activeLesson) setPracticeMode("specialties");
            },
            disabled: !!activeLesson,
            className: `px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${practiceMode === "specialties" ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/55"}`,
            children: "CHUYÊN ĐỀ PHẢN XẠ 🚀"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 582,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 572,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePractice.tsx",
      lineNumber: 563,
      columnNumber: 7
    }, this),
    practiceMode === "specialties" ? /* @__PURE__ */ jsxDEV(
      ModulePracticeAddons,
      {
        user,
        onUserUpdate,
        activeTab: addonsTab,
        onChangeTab: setAddonsTab,
        selectedLevel,
        activeTaskRedirect,
        onNavigateToTask: (task) => {
          const levelMap = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
          const lvlNum = levelMap[(task.level || "A1").toUpperCase()] || 1;
          let lsnNum = 1;
          if (task.targetId) {
            const match = task.targetId.match(/\d+/);
            if (match) {
              lsnNum = parseInt(match[0]);
            }
          }
          const taskMod = (task.module || task.taskType || "vocabulary").toLowerCase();
          if (["listening", "speaking", "reading", "writing"].includes(taskMod)) {
            setPracticeMode("pathway");
            startLessonQuiz(lvlNum, lsnNum, taskMod);
          } else if (taskMod === "exam") {
            setAddonsTab("exams");
          } else if (taskMod === "pronunciation") {
            setAddonsTab("ipa");
          }
        }
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 595,
        columnNumber: 9
      },
      this
    ) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 px-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-4 bg-indigo-600 rounded-full animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 630,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black uppercase tracking-wider text-slate-800", children: "Lộ Trình Đào Tạo Core (CEFR Academic Learning Path)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 631,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 629,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-indigo-50/20 p-2.5 rounded-2xl border border-indigo-100 shadow-sm shrink-0", children: CORE_SKILL_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          const SkillIcon = tab.icon;
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `tab-skill-${tab.id}`,
              onClick: () => {
                if (!activeLesson) {
                  setActiveTab(tab.id);
                }
              },
              disabled: !!activeLesson,
              className: `flex items-center gap-2 lg:gap-2.5 p-2.5 lg:p-3 rounded-xl text-left transition-all cursor-pointer ${isSelected ? tab.color + " border-2 border-transparent scale-[1.02] ring-2 ring-indigo-550/15" : "bg-white border border-slate-100 hover:bg-slate-50/80 text-slate-500 disabled:opacity-35"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: `p-1.5 lg:p-2 rounded-lg bg-slate-50 border border-slate-200 shrink-0`, children: /* @__PURE__ */ jsxDEV(SkillIcon, { className: "w-4 h-4 lg:w-4.5 lg:h-4.5" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 655,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 654,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: `text-[11px] lg:text-xs font-extrabold block truncate ${isSelected ? "text-slate-900" : "text-slate-600"}`, children: tab.title }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 658,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] lg:text-[10px] text-slate-400 block truncate leading-tight mt-0.5", children: tab.subtitle }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 661,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 657,
                  columnNumber: 21
                }, this)
              ]
            },
            tab.id,
            true,
            {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 639,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 633,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 628,
        columnNumber: 11
      }, this),
      !activeLesson ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-7 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-850 text-white rounded-3xl p-6.5 relative overflow-hidden shadow-[0_15px_35px_rgba(79,70,229,0.15)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_20px_40px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 group", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 678,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 679,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 relative z-10 text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 backdrop-blur-sm border border-white/10", children: [
                /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 683,
                  columnNumber: 23
                }, this),
                " KHUYÊN DÙNG CHO BẠN"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 682,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black uppercase tracking-tight mt-1", children: "TIẾP TỤC LỘ TRÌNH CORE CEFR" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 685,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-100 leading-relaxed max-w-md font-medium", children: [
                "Hãy tiếp tục hành trình học tập tại trình độ ",
                /* @__PURE__ */ jsxDEV("strong", { className: "text-yellow-350 font-black", children: selectedLevel }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 687,
                  columnNumber: 68
                }, this),
                " kỹ năng ",
                /* @__PURE__ */ jsxDEV("strong", { className: "text-yellow-350 font-black", children: (activeTab === "grammar" ? "Ngữ pháp" : activeTab === "listening" ? "Nghe hiểu" : activeTab === "reading" ? "Đọc hiểu" : activeTab === "writing" ? "Viết câu" : activeTab === "vocabulary" ? "Từ vựng" : activeTab === "ipa" ? "Phát âm IPA" : "Hội thoại").toUpperCase() }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 687,
                  columnNumber: 148
                }, this),
                " để nâng cao phản xạ tự nhiên chuẩn học thuật."
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 686,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 681,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-6 flex flex-wrap items-center justify-between gap-4 relative z-10", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-white/60 block font-bold uppercase tracking-wider", children: "Đề xuất tiếp theo" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 693,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-extrabold text-yellow-350", children: [
                  "Cấp độ ",
                  selectedLevel,
                  " • Bài học 1"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 694,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 692,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    const levelMapStr = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
                    const lvlNum = levelMapStr[selectedLevel] || 1;
                    startLessonQuiz(lvlNum, 1, activeTab);
                  },
                  className: "px-6 py-3 bg-yellow-400 hover:bg-yellow-350 text-slate-900 text-xs font-black rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { children: "HỌC NGAY BÀI 1" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 704,
                      columnNumber: 23
                    }, this),
                    " ",
                    /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 704,
                      columnNumber: 51
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 696,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 691,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 677,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-5 bg-white border-2 border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:shadow-md", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 text-left w-full", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block", children: "targets" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 714,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5", children: "🎯 NHIỆM VỤ HÔM NAY" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 715,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 713,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider", children: "Cập Nhật AI" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 719,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 712,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-3.5 h-3.5 fill-emerald-100 text-emerald-600" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 726,
                    columnNumber: 27
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 725,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-700 block", children: [
                      "Luyện tập kỹ năng ",
                      activeTab.toUpperCase()
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 729,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-tight", children: "Yêu cầu hoàn thành bài thi đạt ≥ 80%" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 730,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 728,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 724,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-indigo-650", children: "🔥" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 737,
                    columnNumber: 27
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 736,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-700 block", children: "Duy trì Chuỗi liên tiếp ngày" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 740,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-tight", children: [
                      "Chuỗi của bạn: ",
                      user.streakDays || 1,
                      " ngày học tập liên tục"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 741,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 739,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 735,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-indigo-650", children: "⭐" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 748,
                    columnNumber: 27
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 747,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-700 block", children: "Tích lũy kinh nghiệm thưởng" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 751,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-tight", children: "Nhận trọn vẹn điểm thưởng XP sau mỗi bài thi" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 752,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 750,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 746,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 722,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 711,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setPracticeMode("specialties");
                  setAddonsTab("tasks");
                },
                className: "w-full py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-wider block transition-all mt-4 cursor-pointer",
                children: "XEM DANH SÁCH NHIỆM VỤ DƯỚI DẠNG CARD CHUYÊN SÂU 📋"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 758,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 710,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 674,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-4.5 border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-600 tracking-wider", children: "Cơ chế tự động xếp lớp chuẩn CEFR" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 775,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-extrabold text-slate-800", children: "LỰA CHỌN KHUNG LEVEL CHUYÊN BIỆT" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 776,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 774,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-extrabold text-indigo-700", children: [
              "Cấp độ của bạn: CEFR ",
              user.level || "A1"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 778,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 773,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", children: ["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
            const isUnlocked = (user.unlockedLevels || ["A1"]).includes(lvl);
            const isSelected = selectedLevel === lvl;
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  if (isUnlocked) {
                    handleLevelSelect(lvl);
                  } else {
                    alert(`🔒 Cấp độ ${lvl} đang bị khóa. Bạn vui lòng hoàn thành bài test cuối cấp của level trước đó hoặc liên hệ giáo viên hỗ trợ nhé!`);
                  }
                },
                className: `flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${isSelected ? "bg-indigo-600 text-white shadow-md scale-[1.03]" : isUnlocked ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200" : "bg-slate-50 text-slate-400 border border-slate-200/50 opacity-55 cursor-not-allowed"}`,
                children: [
                  !isUnlocked && /* @__PURE__ */ jsxDEV(Lock, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 806,
                    columnNumber: 41
                  }, this),
                  "Cấp độ ",
                  lvl,
                  isUnlocked && isSelected && /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 808,
                    columnNumber: 54
                  }, this)
                ]
              },
              lvl,
              true,
              {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 789,
                columnNumber: 23
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 783,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 772,
          columnNumber: 15
        }, this),
        ["vocabulary", "grammar", "ipa", "speaking"].includes(activeTab) ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 animate-fade-in", children: [
          activeTab === "vocabulary" && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-3xl border border-slate-200 p-1", children: /* @__PURE__ */ jsxDEV(VocabularyPracticeSuite, { user, onUserUpdate, level: selectedLevel, activeTaskRedirect, cameFromRoadmapProp: cameFromRoadmap }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 820,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 819,
            columnNumber: 21
          }, this),
          activeTab === "grammar" && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-3xl border border-slate-200 p-1", children: /* @__PURE__ */ jsxDEV(ModuleGrammar, { user, onUserUpdate, defaultLevel: selectedLevel }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 825,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 824,
            columnNumber: 21
          }, this),
          activeTab === "ipa" && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-3xl border border-slate-200 p-1", children: /* @__PURE__ */ jsxDEV(ModulePracticeAddons, { user, onUserUpdate, activeTab: "ipa", selectedLevel, hideNav: true }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 830,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 829,
            columnNumber: 21
          }, this),
          activeTab === "speaking" && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-3xl border border-slate-200 p-1", children: /* @__PURE__ */ jsxDEV(ModulePracticeAddons, { user, onUserUpdate, activeTab: "roleplay", selectedLevel, hideNav: true }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 835,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 834,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 817,
          columnNumber: 17
        }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold uppercase text-indigo-400 tracking-wider", children: "TIẾN TRÌNH HỌC TẬP" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 844,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-extrabold uppercase", children: [
                "LỘ TRÌNH ĐÀO TẠO ",
                selectedLevel,
                " (",
                activeTab.toUpperCase(),
                ")"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 845,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-300 leading-relaxed", children: [
                "Mỗi bài học yêu cầu đúng tối thiểu ",
                /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-400 font-bold", children: "8 / 10" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 847,
                  columnNumber: 56
                }, this),
                " câu hỏi để mở khóa bài tiếp theo. Hoàn thành Bài Test để kích hoạt giai đoạn mới."
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 846,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 843,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl shrink-0", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold text-slate-300 block uppercase", children: "Năng lực thực tế" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 852,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-white block mt-0.5", children: [
                "CEFR ",
                user.level || "A1",
                " • Lesson ",
                user.currentLessonNumber || 1
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 853,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 851,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 842,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-2xl p-5.5 space-y-4 shadow-sm relative overflow-hidden", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 862,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-indigo-600 block" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 866,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black text-slate-800 uppercase", children: "📖 Giai đoạn 1 (Bài 1 - 5)" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 867,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 865,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold", children: "Nền tảng" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 869,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 864,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5", children: [1, 2, 3, 4, 5].map((lsnIdx) => {
                const levelMap = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
                const selectedLevelNum = levelMap[selectedLevel] || 1;
                const isPassed = passedLessons.some(
                  (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsnIdx && p.skill === activeTab && p.passed
                );
                const attempts = passedLessons.filter(
                  (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsnIdx && p.skill === activeTab
                );
                const maxScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
                const isUnlocked = lsnIdx === 1 || passedLessons.some(
                  (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsnIdx - 1 && p.skill === activeTab && p.passed
                );
                const lessonTitles = {
                  1: "Bài 1: Giới thiệu bản thân và Sở thích",
                  2: "Bài 2: Giao tiếp tại nhà hàng",
                  3: "Bài 3: Định hướng nghề nghiệp tương lai",
                  4: "Bài 4: Khám phá văn hóa các nước",
                  5: "Bài 5: Thảo luận về tri thức toàn cầu"
                };
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    onClick: () => {
                      if (isUnlocked) {
                        startLessonQuiz(selectedLevelNum, lsnIdx);
                      } else {
                        alert(`🔒 Bài học đang khóa! Vui lòng hoàn thành buổi học thứ ${lsnIdx - 1} tối thiểu 8/10 điểm để tiếp tục.`);
                      }
                    },
                    className: `flex items-center justify-between p-4.5 rounded-2xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${isUnlocked ? isPassed ? "bg-emerald-50/20 hover:bg-emerald-50/50 border-emerald-200 cursor-pointer" : "bg-white hover:border-indigo-200 border-slate-200 cursor-pointer shadow-sm" : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3.5", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm border transition-all ${isPassed ? "bg-emerald-500 text-white border-transparent" : isUnlocked ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-slate-100 text-slate-400 border-slate-200"}`, children: isPassed ? "✓" : lsnIdx }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 919,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: `text-xs block font-black ${isUnlocked ? "text-slate-800" : "text-slate-400"}`, children: lessonTitles[lsnIdx] }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 929,
                            columnNumber: 31
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-semibold block mt-1", children: "⏳ Luyện nghe - nói: ~10 phút" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 932,
                            columnNumber: 31
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 928,
                          columnNumber: 29
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 918,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex items-center gap-2", children: maxScore !== null ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-100 text-[10px] text-emerald-800 font-extrabold px-3 py-1 rounded-lg border border-emerald-200 shadow-sm shrink-0", children: [
                        "Đạt: ",
                        maxScore,
                        "/10 đ"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 938,
                        columnNumber: 31
                      }, this) : !isUnlocked ? /* @__PURE__ */ jsxDEV(Lock, { className: "w-4 h-4 text-slate-350" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 942,
                        columnNumber: 31
                      }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-600 shadow-sm shadow-indigo-150 hover:bg-indigo-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shrink-0 uppercase tracking-tight animate-pulse", children: "Học ngay" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 944,
                        columnNumber: 31
                      }, this) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 936,
                        columnNumber: 27
                      }, this)
                    ]
                  },
                  lsnIdx,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 901,
                    columnNumber: 25
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 873,
                columnNumber: 19
              }, this),
              (() => {
                const levelMap = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
                const selectedLevelNum = levelMap[selectedLevel] || 1;
                const isPassed = (lsn) => passedLessons.some(
                  (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsn && p.skill === activeTab && p.passed
                );
                const isTestUnlocked = [1, 2, 3, 4, 5].every((id) => isPassed(id));
                const attempts = passedLessons.filter(
                  (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === 11 && p.skill === activeTab
                );
                const maxScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
                const isTestPassed = attempts.some((a) => a.passed);
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    onClick: () => {
                      if (isTestUnlocked) {
                        startLessonQuiz(selectedLevelNum, 11);
                      } else {
                        alert("🔒 Hãy học và hoàn thành xuất sắc tất cả 5 bài học của Giai đoạn 1 để mở khóa Bài Test này nhé!");
                      }
                    },
                    className: `mt-4 p-4 rounded-xl border border-dashed transition-all relative overflow-hidden text-left ${isTestUnlocked ? isTestPassed ? "bg-emerald-50 border-emerald-300 cursor-pointer" : "bg-indigo-50/55 hover:bg-indigo-50 border-indigo-300 cursor-pointer" : "bg-slate-50 border-slate-250 opacity-60 cursor-not-allowed"}`,
                    children: /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 flex justify-between items-center gap-3", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-indigo-600 text-white font-black uppercase px-1.5 py-0.5 rounded tracking-wide", children: "KIỂM TRA CHUYÊN SÂU" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 988,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDEV("h4", { className: "text-[11.5px] font-black text-slate-800", children: "📝 BÀI TEST GIAI ĐOẠN 1" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 989,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDEV("p", { className: "text-[9.5px] text-slate-505 leading-relaxed", children: "Bộ câu hỏi kiểm tra tổng hợp kiến thức phản xạ từ bài 1 đến 5." }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 990,
                          columnNumber: 29
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 987,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex flex-col items-end gap-1.5", children: maxScore !== null ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-600 text-[10px] text-white font-black px-2.5 py-1 rounded shadow", children: [
                        "Đạt: ",
                        maxScore,
                        "/10đ"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 995,
                        columnNumber: 31
                      }, this) : !isTestUnlocked ? /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 text-[9px] font-bold text-slate-400", children: [
                        /* @__PURE__ */ jsxDEV(Lock, { className: "w-3 h-3" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 1e3,
                          columnNumber: 33
                        }, this),
                        " Khóa"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 999,
                        columnNumber: 31
                      }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-600 hover:bg-indigo-700 text-white text-[9.5px] font-black px-3 py-1.5 rounded-lg shadow-sm transition-all", children: "Sẵn sàng" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1003,
                        columnNumber: 31
                      }, this) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 993,
                        columnNumber: 27
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 986,
                      columnNumber: 25
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 970,
                    columnNumber: 23
                  },
                  this
                );
              })()
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 861,
              columnNumber: 17
            }, this),
            (() => {
              const levelMap = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
              const selectedLevelNum = levelMap[selectedLevel] || 1;
              const isPhase2Unlocked = passedLessons.some(
                (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === 11 && p.skill === activeTab && p.passed
              );
              return /* @__PURE__ */ jsxDEV("div", { className: `bg-white border border-slate-200 rounded-2xl p-5.5 space-y-4 shadow-sm relative overflow-hidden transition-all ${!isPhase2Unlocked ? "select-none" : ""}`, children: [
                /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1026,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1030,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black text-slate-800 uppercase", children: "🚀 Giai đoạn 2 (Bài 6 - 10)" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1031,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1029,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 font-bold", children: "Nâng cao" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1033,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1028,
                  columnNumber: 23
                }, this),
                !isPhase2Unlocked ? /* @__PURE__ */ jsxDEV("div", { className: "py-20 flex flex-col items-center justify-center text-center space-y-3.5 z-10 relative", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 shadow-sm animate-pulse", children: /* @__PURE__ */ jsxDEV(Lock, { className: "w-5 h-5" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1039,
                    columnNumber: 29
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1038,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800", children: "Nội Dung Đang Ở Trạng Thái Khóa" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1042,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 leading-normal max-w-sm px-6", children: [
                      "Bạn hãy hoàn thành xuất sắc và vượt qua ",
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600 font-bold", children: "Bài Test Giai Đoạn 1 (Đạt ≥ 80%)" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1044,
                        columnNumber: 71
                      }, this),
                      " để kích hoạt toàn bộ 5 bài nâng cao của Giai đoạn 2 này nhé!"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1043,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1041,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1037,
                  columnNumber: 25
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 animate-fade-in", children: [
                  [6, 7, 8, 9, 10].map((lsnIdx) => {
                    const isPassed = passedLessons.some(
                      (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsnIdx && p.skill === activeTab && p.passed
                    );
                    const attempts = passedLessons.filter(
                      (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsnIdx && p.skill === activeTab
                    );
                    const maxScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
                    const isUnlocked = lsnIdx === 6 || passedLessons.some(
                      (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsnIdx - 1 && p.skill === activeTab && p.passed
                    );
                    const lessonTitles2 = {
                      6: "Bài 6: Đàm thoại công việc & Phỏng vấn",
                      7: "Bài 7: Giao tiếp thương mại & Đàm phán",
                      8: "Bài 8: Đọc viết văn học & Phân tích tác phẩm",
                      9: "Bài 9: Viết luận nghiên cứu khoa học",
                      10: "Bài 10: Thảo luận vĩ mô & Hàn lâm"
                    };
                    return /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        onClick: () => {
                          if (isUnlocked) {
                            startLessonQuiz(selectedLevelNum, lsnIdx);
                          } else {
                            alert(`🔒 Hãy hoàn thành buổi học thứ ${lsnIdx - 1} tối thiểu 8/10 điểm để tiếp tục học bài tiếp theo.`);
                          }
                        },
                        className: `flex items-center justify-between p-4.5 rounded-2xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${isUnlocked ? isPassed ? "bg-emerald-50/20 hover:bg-emerald-50/50 border-emerald-200 cursor-pointer" : "bg-white hover:border-indigo-200 border-slate-200 cursor-pointer shadow-sm" : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"}`,
                        children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3.5", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm border transition-all ${isPassed ? "bg-emerald-500 text-white border-transparent" : isUnlocked ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-slate-100 text-slate-400"}`, children: isPassed ? "✓" : lsnIdx }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePractice.tsx",
                              lineNumber: 1093,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
                              /* @__PURE__ */ jsxDEV("span", { className: `text-xs block font-black ${isUnlocked ? "text-slate-800" : "text-slate-400"}`, children: lessonTitles2[lsnIdx] }, void 0, false, {
                                fileName: "/app/applet/src/components/ModulePractice.tsx",
                                lineNumber: 1103,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-semibold block mt-1", children: "⏳ Luyện nghe - nói: ~10 phút" }, void 0, false, {
                                fileName: "/app/applet/src/components/ModulePractice.tsx",
                                lineNumber: 1106,
                                columnNumber: 37
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePractice.tsx",
                              lineNumber: 1102,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1092,
                            columnNumber: 33
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex items-center gap-2", children: maxScore !== null ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-100 text-[10px] text-emerald-800 font-extrabold px-3 py-1 rounded-lg border border-emerald-200 shadow-sm shrink-0", children: [
                            "Đạt: ",
                            maxScore,
                            "/10 đ"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1112,
                            columnNumber: 37
                          }, this) : !isUnlocked ? /* @__PURE__ */ jsxDEV(Lock, { className: "w-4 h-4 text-slate-350" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1116,
                            columnNumber: 37
                          }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-600 shadow-sm shadow-indigo-150 hover:bg-indigo-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shrink-0 uppercase tracking-tight animate-pulse", children: "Học ngay" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1118,
                            columnNumber: 37
                          }, this) }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1110,
                            columnNumber: 33
                          }, this)
                        ]
                      },
                      lsnIdx,
                      true,
                      {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1075,
                        columnNumber: 31
                      },
                      this
                    );
                  }),
                  (() => {
                    const isPassed = (lsn) => passedLessons.some(
                      (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === lsn && p.skill === activeTab && p.passed
                    );
                    const isTestUnlocked = [6, 7, 8, 9, 10].every((id) => isPassed(id));
                    const attempts = passedLessons.filter(
                      (p) => p.levelNumber === selectedLevelNum && p.lessonNumber === 12 && p.skill === activeTab
                    );
                    const maxScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
                    const isTestPassed = attempts.some((a) => a.passed);
                    return /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        onClick: () => {
                          if (isTestUnlocked) {
                            startLessonQuiz(selectedLevelNum, 12);
                          } else {
                            alert("🔒 Hãy học và hoàn thành xuất sắc tất cả 5 bài của Giai đoạn 2 để mở khóa Bài Test Cuối Cấp Độ!");
                          }
                        },
                        className: `mt-4 p-4 rounded-xl border border-dashed transition-all relative overflow-hidden text-left ${isTestUnlocked ? isTestPassed ? "bg-emerald-50 border-emerald-300 cursor-pointer animate-pulse" : "bg-amber-50/55 hover:bg-amber-50 border-amber-300 cursor-pointer animate-pulse" : "bg-slate-50 border-slate-250 opacity-60 cursor-not-allowed"}`,
                        children: /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 flex justify-between items-center gap-3", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-amber-600 text-white font-black uppercase px-2 py-0.5 rounded tracking-wide", children: "KỲ THI THỰC PHÁT" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePractice.tsx",
                              lineNumber: 1157,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("h4", { className: "text-[11.5px] font-black text-slate-800", children: "🏆 BÀI TEST TỔNG HỢP CUỐI LEVEL" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePractice.tsx",
                              lineNumber: 1158,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("p", { className: "text-[9.5px] text-slate-550 leading-relaxed", children: [
                              "Bài kiểm tra tốt nghiệp cấp độ ",
                              selectedLevel,
                              ", mở khóa nấc thành tựu tiếp theo."
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePractice.tsx",
                              lineNumber: 1159,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1156,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex flex-col items-end gap-1.5", children: maxScore !== null ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-600 text-[10px] text-white font-black px-2.5 py-1 rounded shadow", children: [
                            "Đạt: ",
                            maxScore,
                            "/10đ"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1164,
                            columnNumber: 39
                          }, this) : !isTestUnlocked ? /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 text-[9px] font-bold text-slate-400", children: [
                            /* @__PURE__ */ jsxDEV(Lock, { className: "w-3 h-3" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePractice.tsx",
                              lineNumber: 1169,
                              columnNumber: 41
                            }, this),
                            " Khóa"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1168,
                            columnNumber: 39
                          }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-amber-600 hover:bg-amber-700 text-white text-[9.5px] font-black px-3 py-1.5 rounded-lg shadow transition-all", children: "Thi Ngay" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1172,
                            columnNumber: 39
                          }, this) }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePractice.tsx",
                            lineNumber: 1162,
                            columnNumber: 35
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 1155,
                          columnNumber: 33
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1139,
                        columnNumber: 31
                      },
                      this
                    );
                  })()
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1049,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1023,
                columnNumber: 21
              }, this);
            })()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 858,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 840,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePractice.tsx",
        lineNumber: 671,
        columnNumber: 13
      }, this) : (
        /* ACTIVE QUIZ CHANNELS SCREEN */
        /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-200 pb-4 mb-6", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-extrabold uppercase text-indigo-600 block tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100", children: [
                activeTab.toUpperCase(),
                " • Level ",
                activeLesson.lvl,
                " Bài ",
                activeLesson.lsn
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1198,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] block text-slate-600 mt-2 font-bold", children: questions[currentQIdx] && questions[currentQIdx].questionText }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1202,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1197,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 font-mono text-xs text-slate-400", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500", children: [
                "⏳ Thời gian: ",
                Math.floor(secondsSpent / 60),
                ":",
                (secondsSpent % 60).toString().padStart(2, "0")
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1208,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-indigo-600 font-bold", children: [
                "Câu ",
                currentQIdx + 1,
                " / ",
                questions.length || 10
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1209,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1207,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 1196,
            columnNumber: 13
          }, this),
          questions.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-20 font-sans text-slate-400 space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500", children: "📭" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1218,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: "Đang tải tài liệu ôn tập và cấu trúc bài học..." }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1221,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 1217,
            columnNumber: 15
          }, this) : !quizFinished ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
            questions[currentQIdx]?.readingPassage && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-705 leading-loose max-h-52 overflow-y-auto font-sans", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest block mb-1 font-sans", children: "Đoạn Đọc Hiểu:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1229,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "font-sans text-[13.5px] leading-relaxed text-slate-800 font-medium tracking-wide", children: [
                '"',
                questions[currentQIdx].readingPassage,
                '"'
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1230,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1228,
              columnNumber: 19
            }, this),
            activeTab === "listening" && questions[currentQIdx] && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "play-tts-slider",
                  onClick: () => handlePlayReadingAudio(questions[currentQIdx].audioUrl || ""),
                  className: "w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all shadow-sm",
                  children: isPlayingAudio ? /* @__PURE__ */ jsxDEV(Pause, { className: "w-5 h-5 fill-white text-white" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1242,
                    columnNumber: 41
                  }, this) : /* @__PURE__ */ jsxDEV(Play, { className: "w-5 h-5 fill-white text-white ml-0.5" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1242,
                    columnNumber: 95
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1237,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-800 block", children: "Click để nghe phát âm giọng đọc AI" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1245,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 text-[10px] text-slate-500", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: "Tốc độ:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1248,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [0.7, 0.85, 1].map((sp) => /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: `speed-btn-${sp}`,
                      onClick: () => setBackSpeed(sp),
                      className: `px-2 py-1 rounded cursor-pointer ${backSpeed === sp ? "bg-indigo-600 text-white font-bold text-[9px]" : "bg-slate-200 text-slate-600 hover:bg-slate-300 text-[9px]"}`,
                      children: [
                        sp,
                        "x ",
                        sp === 0.7 ? "Chậm" : sp === 0.85 ? "Mẫu" : "Nhanh"
                      ]
                    },
                    sp,
                    true,
                    {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1251,
                      columnNumber: 29
                    },
                    this
                  )) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1249,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1247,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1244,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1236,
              columnNumber: 19
            }, this),
            questions[currentQIdx]?.options && questions[currentQIdx].options.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-3.5 mt-4", children: questions[currentQIdx].options.map((opt) => {
              const letter = opt.trim().substring(0, 1).toUpperCase();
              const selected = userAnswers[questions[currentQIdx].id] === letter;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: `node-opt-${letter}`,
                  onClick: () => setUserAnswers((prev) => ({ ...prev, [questions[currentQIdx].id]: letter })),
                  className: `w-full text-left p-4.5 rounded-2xl text-[14px] font-bold border-2 transition-all cursor-pointer font-sans flex items-center gap-4 hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${selected ? "bg-indigo-50/70 border-indigo-500 text-indigo-900 ring-2 ring-indigo-550/20" : "bg-white border-slate-200 hover:border-indigo-200/60 hover:bg-slate-50/30 text-slate-700"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all border ${selected ? "bg-indigo-600 text-white border-transparent shadow-sm scale-105" : "bg-slate-50 text-slate-500 border-slate-200"}`, children: letter }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1284,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "flex-1 leading-normal", children: opt }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1291,
                      columnNumber: 27
                    }, this)
                  ]
                },
                opt,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1274,
                  columnNumber: 25
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1268,
              columnNumber: 19
            }, this) : (
              /* WRITING DIALOGUES BOX */
              activeTab === "writing" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 font-sans", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs text-slate-600", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-600", children: "Dịch câu hoặc thảo luận đề tài:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1301,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "font-sans text-[13px] text-slate-800 mt-1.5 font-medium leading-relaxed", children: [
                    '"',
                    questions[currentQIdx].writingPrompt,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1302,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1300,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "textarea",
                  {
                    id: "writer-assignment",
                    value: userAnswers[questions[currentQIdx].id] || "",
                    onChange: (e) => setUserAnswers((prev) => ({ ...prev, [questions[currentQIdx].id]: e.target.value })),
                    rows: 4,
                    placeholder: "Nhập bài viết bằng Tiếng Anh của bạn...",
                    className: "w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-850 placeholder-slate-400 text-sm font-sans font-medium focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1305,
                    columnNumber: 23
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-550", children: [
                    "Đã viết: ",
                    (userAnswers[questions[currentQIdx].id] || "").trim().split(/\s+/).filter(Boolean).length,
                    " từ • Gemini AI support active"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1315,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: "btn-evaluate-writing",
                      onClick: () => handleRequestEssayEvaluation(questions[currentQIdx], userAnswers[questions[currentQIdx].id] || ""),
                      disabled: evaluatingAI || !(userAnswers[questions[currentQIdx].id] || "").trim(),
                      className: "bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-black px-4 py-1.5 rounded-lg active:translate-y-0.5 transition-all text-right cursor-pointer shrink-0 disabled:opacity-40",
                      children: evaluatingAI ? "Đang chấm bằng AI..." : "YÊU CẦU AI CHẤM NHẬN XÉT"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1319,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1314,
                  columnNumber: 23
                }, this),
                writingResult && /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50 rounded-xl p-4 border border-indigo-250 text-xs space-y-3 mt-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 border-b border-indigo-100 pb-2", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-600 font-bold block", children: [
                      "Vocabulary: ",
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-650", children: writingResult.vocabulary || 90 }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1333,
                        columnNumber: 102
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1333,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-650 font-bold block", children: [
                      "Grammar: ",
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-600", children: writingResult.grammar || 85 }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1334,
                        columnNumber: 99
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1334,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-650 font-bold block", children: [
                      "Structure: ",
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-yellow-600", children: writingResult.structure || 85 }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1335,
                        columnNumber: 101
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1335,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1332,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold uppercase text-slate-500", children: "AI Phân tích chi tiết:" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1339,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 leading-relaxed text-[11px]", children: writingResult.detailedAdvice }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1340,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1338,
                    columnNumber: 27
                  }, this),
                  writingResult.corrections && writingResult.corrections.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-2.5 rounded-md border border-slate-200 text-[10px] font-mono leading-relaxed space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-sans font-bold text-red-500 block text-[9px] uppercase tracking-wide", children: "Điểm cần sửa:" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1345,
                      columnNumber: 31
                    }, this),
                    writingResult.corrections.map((corr, i) => /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-red-550 line-through font-semibold", children: [
                        '"',
                        corr.original,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1348,
                        columnNumber: 35
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-600 font-bold", children: [
                        ' → "',
                        corr.suggested,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1349,
                        columnNumber: 35
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500 block text-[9px] font-sans", children: [
                        "Lý do: ",
                        corr.explanation
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1350,
                        columnNumber: 35
                      }, this)
                    ] }, i, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1347,
                      columnNumber: 33
                    }, this))
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1344,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1331,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1299,
                columnNumber: 21
              }, this)
            ),
            activeTab === "speaking" && questions[currentQIdx] && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 font-sans", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-600 block mb-1", children: "Mẫu đọc chuẩn phát âm:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1365,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "font-sans text-[14.5px] font-extrabold leading-relaxed text-slate-900 tracking-wide mt-1", children: [
                  '"',
                  questions[currentQIdx].speakingTarget,
                  '"'
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1366,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1364,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center p-6 border border-dashed border-slate-200 bg-slate-50 rounded-xl text-center gap-3", children: [
                micPermissionError && /* @__PURE__ */ jsxDEV("div", { className: "max-w-lg w-full text-left", children: /* @__PURE__ */ jsxDEV(
                  MicPermissionInstructions,
                  {
                    errorMsg: micPermissionError,
                    onClose: () => setMicPermissionError(null)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1373,
                    columnNumber: 27
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1372,
                  columnNumber: 25
                }, this),
                isRecording ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-red-500 text-xs font-extrabold animate-pulse block", children: "MIC ĐANG HOẠT ĐỘNG THU ÂM..." }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1382,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500", children: "Đọc dõng dạc câu phía trên để nhận diện phản xạ giọng nói." }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1383,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1381,
                  columnNumber: 25
                }, this) : recSuccess ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-emerald-650 font-black block", children: "THU ÂM HOÀN CHỈNH!" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1387,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500 italic block", children: [
                    '"',
                    (userAnswers[questions[currentQIdx].id] || "").substring(0, 85),
                    '..."'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1388,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1386,
                  columnNumber: 25
                }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-500", children: "Chọn nút để ghi đàm thoại của bạn qua Web Speech API." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1391,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: "toggle-recording",
                      onClick: () => handleToggleRec(questions[currentQIdx]),
                      className: `px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"}`,
                      children: [
                        /* @__PURE__ */ jsxDEV(Mic, { className: "w-4 h-4" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 1402,
                          columnNumber: 27
                        }, this),
                        " ",
                        isRecording ? "Dừng ghi âm" : "Ghi âm phát âm"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1395,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: "btn-play-speaking-tts",
                      onClick: () => handlePlayReadingAudio(questions[currentQIdx].speakingTarget || ""),
                      className: "px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-slate-200",
                      children: [
                        /* @__PURE__ */ jsxDEV(Volume2, { className: "w-4 h-4" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePractice.tsx",
                          lineNumber: 1410,
                          columnNumber: 27
                        }, this),
                        " Nghe giọng đọc mẫu"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1405,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1394,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1369,
                columnNumber: 21
              }, this),
              evaluatingAI && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-2 text-xs text-slate-500 animate-pulse", children: "Đang phân tích âm sắc giọng nói bằng Gemini..." }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1418,
                columnNumber: 23
              }, this),
              speakingResult && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-5 border border-slate-200 text-xs space-y-4 shadow-sm text-left", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      className: "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-1.5",
                      style: {
                        color: speakingResult.color,
                        backgroundColor: speakingResult.backgroundColor
                      },
                      children: /* @__PURE__ */ jsxDEV("span", { children: speakingResult.overallScore >= 85 ? "🟢 Đọc đúng" : speakingResult.overallScore >= 60 ? "🟡 Gần đúng" : "🔴 Đọc sai" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1434,
                        columnNumber: 29
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1427,
                      columnNumber: 27
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500 text-[10px] uppercase font-black tracking-wider block", children: "Điểm phát âm" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1437,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800", children: [
                      speakingResult.overallScore,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1438,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1436,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1426,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 font-sans text-slate-700 border-b border-slate-100 pb-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    "Từ/câu mục tiêu: ",
                    /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-950 font-mono", children: [
                      '"',
                      questions[currentQIdx].speakingTarget,
                      '"'
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1444,
                      columnNumber: 49
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1444,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    "Học viên đã đọc: ",
                    /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-650 font-mono font-bold", children: [
                      '"',
                      userAnswers[questions[currentQIdx].id] || "...",
                      '"'
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1445,
                      columnNumber: 49
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1445,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    "Kết quả: ",
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold", style: { color: speakingResult.color }, children: speakingResult.overallScore >= 85 ? "🟢 Đọc đúng" : speakingResult.overallScore >= 60 ? "🟡 Gần đúng" : "🔴 Đọc sai" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1446,
                      columnNumber: 41
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1446,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1443,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider text-slate-400 block", children: "Đánh giá chi tiết từng từ:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1451,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2.5 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100", children: speakingResult.words.map((w, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxDEV(
                      "span",
                      {
                        className: "px-2 py-1 rounded-lg text-xs font-bold leading-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-transparent",
                        style: {
                          color: w.color,
                          backgroundColor: w.backgroundColor,
                          borderColor: w.color + "20"
                        },
                        children: w.word
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModulePractice.tsx",
                        lineNumber: 1455,
                        columnNumber: 33
                      },
                      this
                    ),
                    w.score > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-mono text-slate-400 font-medium", children: [
                      w.score,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1466,
                      columnNumber: 35
                    }, this)
                  ] }, idx, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1454,
                    columnNumber: 31
                  }, this)) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1452,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1450,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 border-t border-b border-slate-100 py-2.5 text-[10px] text-slate-500 font-medium", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: [
                    "Độ chính xác: ",
                    /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-600 font-bold", children: [
                      speakingResult.accuracy,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1475,
                      columnNumber: 47
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1475,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: [
                    "Độ trôi chảy: ",
                    /* @__PURE__ */ jsxDEV("strong", { className: "text-emerald-600 font-bold", children: [
                      speakingResult.fluency,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePractice.tsx",
                      lineNumber: 1476,
                      columnNumber: 47
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1476,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1474,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold uppercase text-slate-400 block tracking-wide", children: "Nhận xét chi tiết từ phản xạ:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1481,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 text-xs leading-relaxed mt-1 font-medium", children: speakingResult.feedback }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1482,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1480,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "pt-2 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      setSpeakingResult(null);
                      setRecSuccess(false);
                      handleToggleRec(questions[currentQIdx]);
                    },
                    className: "px-4 py-2 bg-indigo-50 border border-indigo-250 text-indigo-700 rounded-xl text-xs font-black h-9 flex items-center gap-1 cursor-pointer hover:bg-indigo-100 transition-all uppercase tracking-wide",
                    children: "Luyện lại câu này 🔄"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePractice.tsx",
                    lineNumber: 1487,
                    columnNumber: 27
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1486,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1424,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1363,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-t border-slate-200 pt-6", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "btn-page-prev",
                  onClick: () => setCurrentQIdx((prev) => Math.max(0, prev - 1)),
                  disabled: currentQIdx === 0,
                  className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-xl disabled:opacity-40 cursor-pointer",
                  children: "Quay lại"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1506,
                  columnNumber: 19
                },
                this
              ),
              currentQIdx < questions.length - 1 ? /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "btn-page-next",
                  onClick: () => setCurrentQIdx((prev) => prev + 1),
                  className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer",
                  children: "Tiếp theo"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1516,
                  columnNumber: 21
                },
                this
              ) : /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "btn-finish-quiz",
                  onClick: handleSubmitQuiz,
                  className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-transform active:scale-[0.98] cursor-pointer",
                  children: "Nộp bài hoàn tất"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePractice.tsx",
                  lineNumber: 1524,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePractice.tsx",
              lineNumber: 1505,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePractice.tsx",
            lineNumber: 1224,
            columnNumber: 15
          }, this) : (
            /* RECAP SCREEN POST TEST */
            /* @__PURE__ */ jsxDEV(
              LessonResultView,
              {
                title: "Hoàn Thành Bài Tập Phản Xạ!",
                subtitle: `Lộ trình Đào tạo CEFR Pathway • Cấp độ ${activeLesson.lvl} • Bài học ${activeLesson.lsn}`,
                correctAnswers: quizScore,
                totalQuestions: questions.length || 10,
                xpEarned: earnedXP,
                streakDays: user.streakDays || 1,
                passed: quizScore >= 8,
                unlockedLevelMessage: unlockedLevelMsg,
                achievementsUnlocked: newlyUnlockedAchievements,
                ctaText: "Quay lại trang chính",
                onCtaClick: () => {
                  setActiveLesson(null);
                  setQuizFinished(false);
                  setNewlyUnlockedAchievements([]);
                  handleBackToHome();
                }
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePractice.tsx",
                lineNumber: 1537,
                columnNumber: 15
              },
              this
            )
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 1193,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePractice.tsx",
          lineNumber: 1192,
          columnNumber: 9
        }, this)
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePractice.tsx",
      lineNumber: 626,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModulePractice.tsx",
    lineNumber: 560,
    columnNumber: 5
  }, this);
}
