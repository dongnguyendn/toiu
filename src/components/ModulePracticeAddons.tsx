import React, { useState, useEffect, useRef, Fragment } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { api } from "/src/api.ts";
import { db } from "/src/firebase.ts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { evaluateSpeakingText } from "/src/utils/speechEvaluator.ts";
import { ErrorBoundary } from "/src/components/ErrorBoundary.tsx";
import ModuleGrammar from "/src/components/ModuleGrammar.tsx";
import VocabularyPracticeSuite from "/src/components/VocabularyPracticeSuite.tsx";
import SrsReviewDeck from "/src/components/SrsReviewDeck.tsx";
import PronunciationScoring from "/src/components/PronunciationScoring.tsx";
import AutoReview from "/src/components/AutoReview.tsx";
import { checkAndCompleteActiveTask } from "/src/utils/roadmapProgressManager.ts";
import {
  Sparkles,
  Award,
  Zap,
  Volume2,
  Mic,
  TrendingUp,
  Send,
  RefreshCw,
  Info,
  Clock,
  Check,
  Play,
  ChevronRight,
  Star,
  AlertCircle,
  Flame,
  Lock,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Trophy,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const MicPermissionInstructions = ({ errorMsg, onClose }) => {
  const [activeTab, setActiveTab] = React.useState("chrome");
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-amber-900 rounded-2xl p-4.5 space-y-3.5 shadow-md text-left w-full relative z-10 animate-fade-in font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-amber-500 text-white rounded-xl shadow-sm", children: /* @__PURE__ */ jsxDEV(Mic, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 63,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-amber-950 flex items-center gap-1.5 leading-tight font-sans", children: "Chưa Cấp Quyền Microphone 🎙️" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-600 leading-normal text-[11px] mt-1 font-medium font-sans", children: "Phần luyện nói cần kết nối Microphone của bạn. Bạn hãy làm theo hướng dẫn siêu dễ dưới đây nhé:" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this),
        errorMsg && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-amber-800 bg-amber-100/50 p-2 rounded-lg mt-1.5 font-mono border border-amber-200", children: [
          "Chi tiết lỗi: ",
          errorMsg
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 73,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 61,
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
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 82,
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
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 91,
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
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 100,
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
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 109,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 81,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-[11px] text-slate-700 leading-relaxed space-y-2 bg-white/75 p-3 rounded-xl border border-amber-200", children: [
      activeTab === "chrome" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1 font-sans", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Nhấp biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Khóa (Lock) 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 124,
            columnNumber: 33
          }, this),
          " bên trái thanh địa chỉ URL của bạn."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 124,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Ở mục ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 125,
            columnNumber: 23
          }, this),
          ", bật tùy chọn chuyển thành ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 125,
            columnNumber: 78
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 125,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm phím ",
          /* @__PURE__ */ jsxDEV("strong", { children: "F5" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 126,
            columnNumber: 26
          }, this),
          " hoặc tải lại trang web (Reload) nếu trình duyệt yêu cầu."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 126,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 123,
        columnNumber: 11
      }, this),
      activeTab === "firefox" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1 font-sans", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Click biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt trang web / Khóa 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 131,
            columnNumber: 34
          }, this),
          " ở góc trái URL thanh trình duyệt."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 131,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Xóa cài đặt bị chặn / Gỡ gạch chéo đỏ hoặc dấu x bên cạnh Micro bị chặn." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tải lại trang (F5) và bấm nút nói, chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 133,
            columnNumber: 57
          }, this),
          " khi có popup hiện ra."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 133,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 130,
        columnNumber: 11
      }, this),
      activeTab === "safari" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1 font-sans", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Mở ứng dụng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt (Settings) ⚙️" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 138,
            columnNumber: 29
          }, this),
          " trên màn hình thiết bị của bạn."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 138,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Kéo tìm chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Safari" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 139,
            columnNumber: 30
          }, this),
          " ",
          `>`,
          " Nhấp chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 139,
            columnNumber: 70
          }, this),
          " ",
          `>`,
          " Chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 139,
            columnNumber: 109
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 139,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Tuyệt chiêu:" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 140,
            columnNumber: 17
          }, this),
          " Nhấp nút ",
          /* @__PURE__ */ jsxDEV("strong", { children: '"Mở cửa sổ mới" ↗' }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 140,
            columnNumber: 56
          }, this),
          " ở góc trên bên phải trang web để chạy độc lập và xin quyền trực diện!"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 140,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 137,
        columnNumber: 11
      }, this),
      activeTab === "android" && /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1 font-sans", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "ba chấm ⋮" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 145,
            columnNumber: 32
          }, this),
          " trên góc trình duyệt Chrome ",
          `>`,
          " ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt trang web" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 145,
            columnNumber: 93
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 145,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Chọn mục ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 146,
            columnNumber: 26
          }, this),
          " và click gạt chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 146,
            columnNumber: 72
          }, this),
          " cho trang web này."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 146,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Hoặc cấp quyền cho ứng dụng Chrome trong mục ứng dụng của cài đặt hệ điều hành Android." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 147,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 144,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-100/60 p-2 rounded-xl border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2 font-sans", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-650 leading-normal", children: [
        "💡 ",
        /* @__PURE__ */ jsxDEV("strong", { children: "Gợi ý:" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 154,
          columnNumber: 14
        }, this),
        " Hệ thống sẽ ghi nhớ tùy chọn để không hỏi lại liên tục nếu mọi thứ hoạt động tốt."
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 153,
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
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 156,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 152,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
    lineNumber: 60,
    columnNumber: 5
  }, this);
};
export default function ModulePracticeAddons({
  user,
  onUserUpdate,
  activeTab: activeTabProp,
  onChangeTab,
  onNavigateToTask,
  selectedLevel,
  hideNav = false
}) {
  const [localActiveTab, setLocalActiveTab] = useState("tasks");
  const [showDiscoverMore, setShowDiscoverMore] = useState(false);
  const activeTab = activeTabProp !== void 0 ? activeTabProp : localActiveTab;
  const setActiveTab = (tab) => {
    if (onChangeTab) {
      onChangeTab(tab);
    } else {
      setLocalActiveTab(tab);
    }
  };
  const [vocabLevel, setVocabLevel] = useState("A1");
  useEffect(() => {
    if (selectedLevel) {
      setVocabLevel(selectedLevel);
    } else if (user?.currentLevel) {
      setVocabLevel(user.currentLevel);
    } else if (user?.level) {
      setVocabLevel(user.level);
    }
  }, [selectedLevel, user?.currentLevel, user?.level]);
  const [vocabList, setVocabList] = useState([]);
  const [currentVocabIdx, setCurrentVocabIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedAns, setQuizSelectedAns] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksMessage, setTasksMessage] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLevelVerified, setIsLevelVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [creationProgress, setCreationProgress] = useState(0);
  const [showCreationProgress, setShowCreationProgress] = useState(false);
  const [selectedLevelInput, setSelectedLevelInput] = useState("");
  const [completedToastTask, setCompletedToastTask] = useState(null);
  const [ipaChart, setIpaChart] = useState(null);
  const [ipaLessons, setIpaLessons] = useState([]);
  const [selectedIpa, setSelectedIpa] = useState(null);
  const [loadingIpa, setLoadingIpa] = useState(false);
  const [isIpaRecording, setIsIpaRecording] = useState(false);
  const ipaRecRef = useRef(null);
  const [ipaTranscription, setIpaTranscription] = useState("");
  const [ipaEvaluating, setIpaEvaluating] = useState(false);
  const [ipaEvaluationResult, setIpaEvaluationResult] = useState(null);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const [ipaStats, setIpaStats] = useState(null);
  const [ipaSubTab, setIpaSubTab] = useState("vowelsShort");
  const [ipaDetailTab, setIpaDetailTab] = useState("learn");
  const [ipaQuizQuestionNum, setIpaQuizQuestionNum] = useState(0);
  const [ipaQuizScores, setIpaQuizScores] = useState(0);
  const [ipaQuizSelectedOption, setIpaQuizSelectedOption] = useState(null);
  const [ipaQuizIsChecked, setIpaQuizIsChecked] = useState(false);
  const [ipaQuizIsCorrect, setIpaQuizIsCorrect] = useState(false);
  const [ipaQuizCompleted, setIpaQuizCompleted] = useState(false);
  const [ipaQuizData, setIpaQuizData] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [chatThread, setChatThread] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [tutorHistory, setTutorHistory] = useState([
    { role: "model", text: "Chào bạn! Tôi là cô giáo tiếng Anh AI của bạn. Hãy gửi cho tôi bất kỳ khó khăn ngữ pháp nào, câu viết học thuật cần dịch, hoặc dán đoạn văn của bạn để tôi sửa lỗi chính xác nhé! 🍎" }
  ]);
  const [tutorInput, setTutorInput] = useState("");
  const [sendingTutor, setSendingTutor] = useState(false);
  const [examsList, setExamsList] = useState([]);
  const [examsResults, setExamsResults] = useState([]);
  const [activeExam, setActiveExam] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [submittingExam, setSubmittingExam] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [loadingExams, setLoadingExams] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [expandedFolder, setExpandedFolder] = useState("placement");
  const answersRef = React.useRef({});
  React.useEffect(() => {
    answersRef.current = examAnswers;
  }, [examAnswers]);
  useEffect(() => {
    if (activeTab === "exams") {
      fetchExams();
      const qExams = query(
        collection(db, "exam_tests"),
        where("status", "==", "published"),
        where("isActive", "==", true),
        // Filter by user level
        where("cefrLevel", "==", (user?.level || "A1").toUpperCase())
      );
      const unsubscribe = onSnapshot(qExams, (snapshot) => {
        const newExams = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        api.getExams().then((res) => {
          if (res?.success) setExamsList(res.exams || []);
        });
      }, (err) => {
        console.warn("Firestore real-time listener failed:", err);
      });
      const interval = setInterval(() => {
        api.getExamResults().then((resResults) => {
          if (resResults?.success) setExamsResults(resResults.results || []);
        });
      }, 1e4);
      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
  }, [activeTab, user?.level]);
  useEffect(() => {
    let timerId = null;
    if (activeExam && !examResult && examTimeLeft > 0) {
      timerId = setInterval(() => {
        setExamTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            alert("⏰ Hết thời gian làm bài thi! Hệ thống đang tiến hành tự động nộp bài để ghi nhận kết quả.");
            performSubmitExamMock(answersRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [activeExam, examResult, examTimeLeft]);
  useEffect(() => {
    fetchVocabularies();
    fetchDailyTasks(true);
    fetchIpaChart();
    fetchScenarios();
    fetchExams();
  }, [vocabLevel]);
  useEffect(() => {
    fetchDailyTasks(true);
  }, [user.xp, vocabLevel]);
  useEffect(() => {
    if (dailyTasks && dailyTasks.length > 0) {
      const pendingNotify = dailyTasks.find((t) => (t.completed || t.isCompleted) && !t.notifiedAt);
      if (pendingNotify) {
        setDailyTasks((prev) => prev.map((t) => t.id === pendingNotify.id ? { ...t, notifiedAt: (/* @__PURE__ */ new Date()).toISOString() } : t));
        setCompletedToastTask(pendingNotify);
        setTimeout(() => {
          setCompletedToastTask(null);
        }, 4e3);
        api.notifyDailyTaskCompleted(pendingNotify.id).catch((err) => {
          console.error("Failed to persist notified status:", err);
        });
      }
    }
  }, [dailyTasks]);
  const fetchVocabularies = async () => {
    setLoadingVocab(true);
    try {
      const res = await api.getVocabularies(vocabLevel);
      if (res?.success) {
        setVocabList(res.vocabularies || []);
        setCurrentVocabIdx(0);
        setIsFlipped(false);
      }
    } catch (e) {
      console.error("Error loading vocabularies:", e);
    } finally {
      setLoadingVocab(false);
    }
  };
  const fetchDailyTasks = async (silent = false) => {
    if (!silent) setLoadingTasks(true);
    try {
      const res = await api.getDailyTasks();
      if (res?.success) {
        const tasksList = res.tasks || [];
        setDailyTasks(tasksList);
        const allCompleted = tasksList.length > 0 && tasksList.every((t) => t.completed);
        setShowCelebration(allCompleted);
        if (tasksList.length > 0) {
          setIsLevelVerified(true);
        } else {
          setIsLevelVerified(false);
        }
      }
    } catch (e) {
      console.error("Error loading daily tasks:", e);
    } finally {
      if (!silent) setLoadingTasks(false);
    }
  };
  const fetchIpaChart = async () => {
    setLoadingIpa(true);
    try {
      const res = await api.getPronunciationIpa(vocabLevel);
      if (res?.success) {
        setIpaChart(res.ipaChart);
        setIpaLessons(res.pronunciationLessons || []);
        if (res.ipaStats) {
          setIpaStats(res.ipaStats);
        }
      }
    } catch (e) {
      console.error("Error loading IPA:", e);
    } finally {
      setLoadingIpa(false);
    }
  };
  useEffect(() => {
    if (selectedIpa) {
      setIpaQuizQuestionNum(0);
      setIpaQuizScores(0);
      setIpaQuizSelectedOption(null);
      setIpaQuizIsChecked(false);
      setIpaQuizIsCorrect(false);
      setIpaQuizCompleted(false);
      const incorrectSymbols = [];
      if (ipaChart) {
        const pool = [
          ...ipaChart.vowelsShort || [],
          ...ipaChart.vowelsLong || [],
          ...ipaChart.diphthongs || [],
          ...ipaChart.consonants || []
        ].filter((i) => i.ipa !== selectedIpa.ipa);
        const copiedPool = [...pool];
        while (incorrectSymbols.length < 3 && copiedPool.length > 0) {
          const idx = Math.floor(Math.random() * copiedPool.length);
          const val = copiedPool.splice(idx, 1)[0].ipa;
          if (!incorrectSymbols.includes(val)) {
            incorrectSymbols.push(val);
          }
        }
      }
      if (incorrectSymbols.length < 3) {
        incorrectSymbols.push("ʊ", "æ", "ʃ");
      }
      const optionsQ1 = [selectedIpa.ipa, ...incorrectSymbols.slice(0, 3)].sort(() => Math.random() - 0.5);
      const correctWord = selectedIpa.sampleWord || "hello";
      const wrongWordsPool = ["door", "dog", "bag", "cold", "water", "banana", "teacher", "hot", "about", "happy"].filter((w) => w !== correctWord && !selectedIpa.examples?.includes(w));
      const optionsQ2 = [correctWord, wrongWordsPool[0], wrongWordsPool[1], wrongWordsPool[2]].sort(() => Math.random() - 0.5);
      const generatedQuestions = [
        {
          type: "listen",
          title: "Bài tập 1: Nhận diện Âm (Listening Test)",
          instruction: "Bấm nút loa để nghe và chọn ký hiệu âm IPA tương ứng phát ra:",
          audioText: btoa(selectedIpa.sampleWord) ? selectedIpa.sampleWord : "word",
          options: optionsQ1,
          answer: selectedIpa.ipa,
          scoreDelta: 25
        },
        {
          type: "vocabulary",
          title: "Bài tập 2: Phục hồi từ khóa (Word Matching)",
          instruction: `Trong các từ sau, từ nào chứa âm tiết phiên âm /${selectedIpa.ipa}/?`,
          options: optionsQ2,
          answer: correctWord,
          scoreDelta: 25
        },
        {
          type: "meaning",
          title: "Bài tập 3: Dịch nghĩa từ vựng (Definition Match)",
          instruction: `Từ khóa ví dụ "${selectedIpa.sampleWord}" có nghĩa tiếng Việt là gì?`,
          options: [selectedIpa.translation || "không rõ", "mặt trời", "gia đình", "hành động"].sort(() => Math.random() - 0.5),
          answer: selectedIpa.translation || "không rõ",
          scoreDelta: 25
        },
        {
          type: "speak",
          title: "Bài tập 4: Luyện nói Độc Quyền (Speaking Practice)",
          instruction: `Nhấn nút ghi âm mic và đọc to rõ từ khóa: "${correctWord}"`,
          answer: correctWord,
          scoreDelta: 25
        }
      ];
      setIpaQuizData(generatedQuestions);
    }
  }, [selectedIpa, ipaChart]);
  const handleTTSWithParams = (text, lang = "en-US", rate = 0.85) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.toLowerCase().includes(lang.toLowerCase()));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }
    window.speechSynthesis.speak(utterance);
  };
  const playIpaListening = async (text, lang = "en-US", rate = 0.85) => {
    handleTTSWithParams(text, lang, rate);
    if (selectedIpa?.ipa) {
      try {
        await api.saveIpaAction(selectedIpa.ipa, "listen");
        fetchIpaChart();
      } catch (err) {
        console.error("Failed to log listening action:", err);
      }
    }
  };
  const fetchScenarios = async () => {
    try {
      const res = await api.getScenarios(vocabLevel);
      if (res?.success) {
        setScenarios(res.scenarios || []);
      }
    } catch (e) {
      console.error("Error loading scenarios:", e);
    }
  };
  const fetchExams = async () => {
    setLoadingExams(true);
    try {
      const res = await api.getExams(vocabLevel);
      if (res?.success) {
        setExamsList(res.exams || []);
      }
      const resResults = await api.getExamResults();
      if (resResults?.success) {
        setExamsResults(resResults.results || []);
      }
    } catch (e) {
      console.error("Error loading exams:", e);
    } finally {
      setLoadingExams(false);
    }
  };
  const handleTTS = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };
  const startVocabularyQuiz = () => {
    if (vocabList.length < 3) {
      alert("Cần tối thiểu 3 từ vựng để tổ chức mini-game!");
      return;
    }
    const generated = vocabList.map((vocab, index) => {
      const incorrects = vocabList.filter((v) => v.id !== vocab.id).map((v) => v.meaning);
      const uniqueIncorrects = Array.from(new Set(incorrects)).slice(0, 2);
      const choices = [vocab.meaning, ...uniqueIncorrects].sort(() => Math.random() - 0.5);
      return {
        vocab,
        choices,
        correctAnswer: vocab.meaning
      };
    });
    setQuizQuestions(generated);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizSelectedAns(null);
    setQuizSubmitted(false);
    setIsQuizMode(true);
  };
  const handleQuizAnswerSubmit = () => {
    if (!quizSelectedAns) return;
    setQuizSubmitted(true);
    const curr = quizQuestions[quizIndex];
    if (quizSelectedAns === curr.correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };
  const handleNextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelectedAns(null);
      setQuizSubmitted(false);
    } else {
      const bonusXp = Math.round(quizScore / quizQuestions.length * 20);
      alert(`Xin chúc mừng! Bạn đạt điểm số ${quizScore}/${quizQuestions.length}. Hệ thống thưởng bạn thêm +${bonusXp} XP rèn luyện!`);
      const updatedUser = { ...user, xp: (user.xp || 100) + bonusXp };
      onUserUpdate(updatedUser);
      setIsQuizMode(false);
    }
  };
  const handleToggleTask = async (taskId) => {
    try {
      const res = await api.toggleDailyTask(taskId);
      if (res?.success) {
        if (res.user) {
          onUserUpdate(res.user);
        } else {
          const currentTask = dailyTasks.find((t) => t.id === taskId);
          const xpBonus = currentTask?.xpReward || 10;
          const isCompletingTask = currentTask ? !currentTask.completed : false;
          onUserUpdate({
            ...user,
            xp: Math.max(0, (user.xp || 0) + (isCompletingTask ? xpBonus : -xpBonus))
          });
        }
        const nextTasks = dailyTasks.map(
          (t) => t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? (/* @__PURE__ */ new Date()).toISOString() : null } : t
        );
        setDailyTasks(nextTasks);
        const allCompleted = nextTasks.length > 0 && nextTasks.every((t) => t.completed);
        setShowCelebration(allCompleted);
        if (res.bonusAwarded) {
          setTasksMessage("🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ nhiệm vụ hôm nay.");
          setTimeout(() => setTasksMessage(null), 5e3);
        }
      }
    } catch (e) {
      console.error("Gặp sự cố khi thay đổi trạng thái nhiệm vụ:", e);
    }
  };
  const startIpaVoiceRecording = async (phrase, isQuizContext = false) => {
    console.log("Micro clicked");
    setMicPermissionError(null);
    if (isIpaRecording) {
      console.log("Recording stopped manually");
      if (ipaRecRef.current) {
        try {
          ipaRecRef.current.stop();
        } catch (e) {
          console.warn("Error stopping speech recognition:", e);
        }
      }
      setIsIpaRecording(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicPermissionError("Trình duyệt của bạn không hỗ trợ Web Speech API.");
      alert("Không thể truy cập microphone. Vui lòng sử dụng các trình duyệt hỗ trợ nhận diện giọng nói (Chrome, Edge, Safari) và kết nối HTTPS.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    ipaRecRef.current = rec;
    setIsIpaRecording(true);
    setIpaTranscription("");
    setIpaEvaluationResult(null);
    console.log("Recording started");
    rec.onresult = (event) => {
      if (!event.results || !event.results[0] || !event.results[0][0]) {
        console.warn("Speech recognition returned empty results.");
        setMicPermissionError("Không nghe rõ giọng nói của bạn, vui lòng đọc to hơn!");
        setIsIpaRecording(false);
        return;
      }
      const speechText = event.results[0][0].transcript;
      setIpaTranscription(speechText);
      triggerIpaAI_Evaluation(phrase, speechText, isQuizContext);
    };
    rec.onnomatch = (event) => {
      console.warn("Speech recognition nomatch.");
      setMicPermissionError("Không nghe rõ giọng nói của bạn, vui lòng đọc to hơn!");
      setIsIpaRecording(false);
    };
    rec.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsIpaRecording(false);
      let errorDesc = "Không nhận diện được giọng nói. Vui lòng thử lại.";
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        errorDesc = "Quyền truy cập micro bị từ chối hoặc bị chặn. Vui lòng mở lại micro.";
      } else if (e.error === "no-speech") {
        errorDesc = "Không nhận diện được giọng nói. Vui lòng thử lại.";
      }
      setMicPermissionError(errorDesc);
    };
    rec.onend = () => {
      setIsIpaRecording(false);
      console.log("Recording stopped");
    };
    try {
      rec.start();
    } catch (ex) {
      console.error("Failed starting speech recognition:", ex);
      setIsIpaRecording(false);
      console.log("Recording stopped");
    }
  };
  const triggerIpaAI_Evaluation = async (expected, userSpoken, isQuizContext = false) => {
    setIpaEvaluating(true);
    try {
      const localEvalObj = evaluateSpeakingText(expected, userSpoken);
      const scores = {
        accuracy: localEvalObj.accuracy,
        fluency: localEvalObj.fluency,
        intonation: Math.round(localEvalObj.overallScore * 0.95),
        overall: localEvalObj.overallScore,
        feedback: localEvalObj.feedback,
        words: localEvalObj.words,
        color: localEvalObj.color,
        backgroundColor: localEvalObj.backgroundColor,
        label: localEvalObj.label
      };
      setIpaEvaluationResult(scores);
      const nw = { ...user, xp: (user.xp || 100) + 15 };
      onUserUpdate(nw);
      if (isQuizContext && ipaQuizQuestionNum === 3) {
        const overallScore = Number(scores.overall || 0);
        const passed = overallScore >= 70;
        setIpaQuizIsCorrect(passed);
        if (passed) {
          setIpaQuizScores((prev) => prev + 25);
        }
        setIpaQuizSelectedOption(userSpoken);
        setIpaQuizIsChecked(true);
      }
      if (selectedIpa?.ipa) {
        await api.saveIpaAction(selectedIpa.ipa, "speak", scores.overall);
      }
      fetchIpaChart();
    } catch (ex) {
      console.error("Failed evaluating pronunciation text:", ex);
    } finally {
      setIpaEvaluating(false);
    }
  };
  const handleIpaQuizComplete = async (finalScore) => {
    setIpaQuizCompleted(true);
    if (!selectedIpa) return;
    if (finalScore >= 80) {
      const nw = { ...user, xp: (user.xp || 100) + 50 };
      onUserUpdate(nw);
    }
    try {
      await api.saveIpaAction(selectedIpa.ipa, "quiz", finalScore);
      await api.evaluatePronunciation("ipa_" + selectedIpa.ipa, selectedIpa.sampleWord, selectedIpa.sampleWord);
      fetchIpaChart();
    } catch (ex) {
      console.error("Failed recording quiz complete stats log", ex);
    }
  };
  const startScenicRoleplay = (scen) => {
    setActiveScenario(scen);
    setChatThread([
      { role: "model", text: scen.firstMessage }
    ]);
    setChatInput("");
  };
  const submitRoleplayMessage = async (textOver?: string) => {
    const textToSend = textOver || chatInput;
    if (!textToSend.trim() || sendingChat) return;
    const newThread = [...chatThread, { role: "user", text: textToSend }];
    setChatThread(newThread);
    setChatInput("");
    setSendingChat(true);
    try {
      const res = await api.sendScenarioChat(activeScenario.id, activeScenario.character, newThread);
      if (res?.success) {
        setChatThread([...newThread, { role: "model", text: res.reply }]);
      }
    } catch (err) {
      console.error("Failed sending Chat Scenic Roleplay:", err);
    } finally {
      setSendingChat(false);
    }
  };
  const submitTutorQuery = async (customPrompt?: string) => {
    const query2 = customPrompt || tutorInput;
    if (!query2.trim() || sendingTutor) return;
    const newThread = [...tutorHistory, { role: "user", text: query2 }];
    setTutorHistory(newThread);
    setTutorInput("");
    setSendingTutor(true);
    try {
      const res = await api.sendChatTutorMessage(query2, tutorHistory, vocabLevel);
      if (res?.success || res?.reply) {
        setTutorHistory([...newThread, { role: "model", text: res.reply || res.answer || "No response" }]);
        const uX = { ...user, xp: (user.xp || 100) + 4 };
        onUserUpdate(uX);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingTutor(false);
    }
  };
  const handleAnswerExamSection = (sectionIndex, selectVal) => {
    setExamAnswers((prev) => ({ ...prev, [sectionIndex]: selectVal }));
  };
  const performSubmitExamMock = async (customAnswers?: any) => {
    const finalAnswers = customAnswers || examAnswers;
    setSubmittingExam(true);
    try {
      const res = await api.submitExam(activeExam.id, finalAnswers);
      if (res?.success) {
        setExamResult(res.examResult);
        const profile = { ...user, xp: (user.xp || 100) + 50 };
        onUserUpdate(profile);
        try {
          await checkAndCompleteActiveTask("mock");
          await checkAndCompleteActiveTask("mini-test");
        } catch (e) {
          console.warn("Failed to auto-complete exam task:", e);
        }
        const resResults = await api.getExamResults();
        if (resResults?.success) {
          setExamsResults(resResults.results || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingExam(false);
    }
  };
  const closeExamMockSession = () => {
    setActiveExam(null);
    setExamResult(null);
    setExamAnswers({});
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    !hideNav && activeTab !== "tasks" && /* @__PURE__ */ jsxDEV("div", { className: "bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4.5 px-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm animate-fade-in", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 text-slate-800 text-left", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg select-none", children: [
          activeTab === "vocab" && "📚",
          activeTab === "grammar" && "📝",
          activeTab === "srs" && "🧠",
          activeTab === "pronunciation" && "🎤",
          activeTab === "auto-review" && "🤖",
          activeTab === "ipa" && "🗣️",
          activeTab === "roleplay" && "🏨",
          activeTab === "tutor" && "👩‍🏫",
          activeTab === "exams" && "📝"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 981,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest block", children: "Chuyên Đề Học Tập Smart" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 993,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black uppercase text-slate-800 tracking-tight", children: [
            activeTab === "vocab" && "Phân kho từ vựng CEFR",
            activeTab === "grammar" && "Học Ngữ pháp Tiếng Anh",
            activeTab === "srs" && "Lặp Lại Khoảng Cách SRS",
            activeTab === "pronunciation" && "Luyện phát âm đàm thoại AI",
            activeTab === "auto-review" && "Bài ôn tập tự động AI",
            activeTab === "ipa" && "Thực Hành Âm Vị IPA Clinic",
            activeTab === "roleplay" && "Kịch Bản Nhập Vai Tình Huống",
            activeTab === "tutor" && "Cố vấn thông thái AI Tutor",
            activeTab === "exams" && "Hệ Thống Luyện Thi IELTS / TOEIC"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 994,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 992,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 980,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab("tasks"),
          className: "px-5 py-2.5 hover:bg-slate-50 border-2 border-slate-200/90 rounded-2xl text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all self-start sm:self-auto",
          children: /* @__PURE__ */ jsxDEV("span", { children: "← QUAY LẠI TRANG CHỦ DASHBOARD" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1011,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1007,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 979,
      columnNumber: 9
    }, this),
    activeTab === "vocab" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Kho Từ Vựng CEFR", children: /* @__PURE__ */ jsxDEV(
      VocabularyPracticeSuite,
      {
        user,
        onUserUpdate,
        level: vocabLevel
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1021,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1020,
      columnNumber: 9
    }, this),
    activeTab === "grammar" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Luyện tập ngữ pháp (Grammar Mastery)", children: /* @__PURE__ */ jsxDEV(
      ModuleGrammar,
      {
        user,
        onUserUpdate
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1031,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1030,
      columnNumber: 9
    }, this),
    activeTab === "srs" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Hệ Thống Ôn Tập SRS", children: /* @__PURE__ */ jsxDEV(
      SrsReviewDeck,
      {
        user,
        onUserUpdate,
        onBackToHome: () => setActiveTab("tasks"),
        onStudyNewVocab: () => setActiveTab("vocab"),
        onTakeTest: () => setActiveTab("exams")
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1043,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1042,
      columnNumber: 9
    }, this),
    activeTab === "pronunciation" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Luyện Phát Âm Với AI", children: /* @__PURE__ */ jsxDEV(PronunciationScoring, { user, onUserUpdate }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1055,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1054,
      columnNumber: 9
    }, this),
    activeTab === "auto-review" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Ôn Tập Sai Lầm Tự Động AI", children: /* @__PURE__ */ jsxDEV(AutoReview, { user, onUserUpdate }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1061,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1060,
      columnNumber: 9
    }, this),
    activeTab === "tasks" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Nhiệm vụ hằng ngày", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-8 animate-fade-in", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-600/30", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/[0.04] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1075,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1076,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4.5 text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm", children: [
                "🔥 CHUỖI LIÊN TỤC: ",
                user.streakDays || 1,
                " NGÀY HỌC"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1083,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xl sm:text-2xl font-black uppercase tracking-tight mt-1 flex items-center gap-2", children: "🎯 NHIỆM VỤ HÔM NAY • DAILY MISSION" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1086,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-150 font-semibold leading-relaxed", children: "Hoàn thành các nhiệm vụ cá nhân hóa hằng ngày dưới đây để củng cố phản xạ tự nhiên nhanh gấp 2 lần." }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1089,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1082,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => fetchDailyTasks(false),
                className: "self-start sm:self-auto px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all",
                children: [
                  /* @__PURE__ */ jsxDEV(RefreshCw, { className: `w-3.5 h-3.5 text-yellow-300 ${loadingTasks ? "animate-spin" : ""}` }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1098,
                    columnNumber: 21
                  }, this),
                  "Cập Nhật AI"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1094,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1081,
            columnNumber: 17
          }, this),
          tasksMessage && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-emerald-500/20 text-emerald-200 text-xs font-bold rounded-2xl text-center border border-emerald-500/30 animate-pulse", children: tasksMessage }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1105,
            columnNumber: 19
          }, this),
          !isLevelVerified ? showCreationProgress ? /* @__PURE__ */ jsxDEV("div", { className: "py-12 text-center space-y-5 animate-fade-in", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-12 h-12 text-yellow-300 animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1115,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1114,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black uppercase text-yellow-300 tracking-wider", children: "Đang khởi tạo 5 nhiệm vụ hằng ngày cá nhân hóa..." }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1118,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-150 font-semibold h-4", children: creationProgress < 30 ? "⚡ Đang liên kết với mô hình AI..." : creationProgress < 75 ? "🔬 Đang điều chỉnh cấu hình độ khó bài học..." : "📂 Đang đồng bộ danh sách nhiệm vụ hôm nay..." }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1121,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1117,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "max-w-md mx-auto bg-indigo-950 rounded-full h-4.5 p-1 overflow-hidden border border-white/5 shadow-inner", children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "bg-gradient-to-r from-yellow-300 to-amber-500 h-full rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(253,224,71,0.5)]",
                style: { width: `${creationProgress}%` }
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1128,
                columnNumber: 25
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1127,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-mono font-black text-yellow-300 select-none", children: [
              creationProgress,
              "% HOÀN TẤT"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1133,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1113,
            columnNumber: 21
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "py-2 text-left space-y-6 animate-fade-in font-sans", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-yellow-400 text-slate-900 px-3 py-0.5 rounded-full uppercase font-mono font-black tracking-wider", children: "Yêu cầu bắt buộc ✨" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1138,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-white uppercase tracking-tight", children: "Xác nhận Trình độ Cấp học hằng ngày" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1141,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-indigo-150 leading-relaxed font-medium", children: "Hệ thống CEFR Pathway AI cần xác nhận cấp độ học để thiết lập đúng độ khó cho 5 nhiệm vụ hằng ngày cá nhân hóa của bạn. Tránh sai lệch bài thi hoặc quá tải kiến thức." }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1142,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-bold text-yellow-300 flex items-center gap-1.5 pt-1", children: [
                "🎯 Cấp học chính thức của bạn trên hệ thống là: ",
                /* @__PURE__ */ jsxDEV("strong", { className: "font-mono bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded ml-1 text-xs", children: user.currentLevel || user.level || "A1" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1146,
                  columnNumber: 75
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1145,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1137,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: ["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
              const isTrueLvl = lvl === (user.currentLevel || user.level || "A1").toUpperCase();
              const isSelected = selectedLevelInput === lvl;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: `level-button-${lvl}`,
                  onClick: () => {
                    setSelectedLevelInput(lvl);
                    setVerificationError(null);
                  },
                  className: `p-4 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden group ${isSelected ? "bg-white text-indigo-950 border-white shadow-xl scale-102" : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-101"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "block text-xl font-black font-mono tracking-tight", children: lvl }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1169,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "block text-[9px] uppercase tracking-wider font-extrabold opacity-85 mt-1 font-sans", children: lvl === "A1" ? "Sơ cấp sơ sài" : lvl === "A2" ? "Sơ cấp mở rộng" : lvl === "B1" ? "Trung cấp nền tảng" : lvl === "B2" ? "Trung cấp mở rộng" : lvl === "C1" ? "Cao cấp học thuật" : "Làm chủ chuyên sâu" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1170,
                      columnNumber: 31
                    }, this),
                    isTrueLvl && /* @__PURE__ */ jsxDEV("span", { className: "absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]", title: "Trình độ thực tế" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1179,
                      columnNumber: 33
                    }, this)
                  ]
                },
                lvl,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1156,
                  columnNumber: 29
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1150,
              columnNumber: 23
            }, this),
            verificationError && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-xl text-xs font-semibold leading-normal flex items-start gap-2.5 animate-pulse", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "⚠️" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1188,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: verificationError }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1189,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1187,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                id: "confirm-generate-tasks-btn",
                onClick: () => {
                  if (!selectedLevelInput) {
                    setVerificationError("Vui lòng chọn một cấp học để tiếp tục.");
                    return;
                  }
                  const actualTrueLvl = (user.currentLevel || user.level || "A1").toUpperCase();
                  if (selectedLevelInput.toUpperCase() !== actualTrueLvl) {
                    setVerificationError("Cấp học bạn chọn không khớp với cấp hiện tại của bạn. Vui lòng chọn đúng cấp học đang học.");
                    return;
                  }
                  setVerificationError(null);
                  setShowCreationProgress(true);
                  setCreationProgress(0);
                  let progressVal = 0;
                  const interval = setInterval(async () => {
                    progressVal += 4;
                    if (progressVal >= 100) {
                      progressVal = 100;
                      clearInterval(interval);
                      try {
                        const res = await api.getDailyTasks(selectedLevelInput);
                        if (res?.success) {
                          setDailyTasks(res.tasks || []);
                          setIsLevelVerified(true);
                        }
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setShowCreationProgress(false);
                      }
                    } else {
                      setCreationProgress(progressVal);
                    }
                  }, 80);
                },
                className: "w-full py-4 bg-yellow-400 hover:bg-yellow-350 active:scale-99 text-slate-950 font-black tracking-wide rounded-2xl text-xs border border-yellow-300 shadow-lg transition-all cursor-pointer text-center",
                children: "XÁC NHẬN VÀ KHỞI TẠO BẢNG NHIỆM VỤ DỰA TRÊN CẤP HỌC 🎯"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1194,
                columnNumber: 25
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1193,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1136,
            columnNumber: 21
          }, this) : loadingTasks ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-12 text-indigo-250 text-xs font-mono", children: [
            /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-6 h-6 animate-spin text-yellow-300 mb-3" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1246,
              columnNumber: 21
            }, this),
            "Đang đồng bộ lộ trình luyện tập thông minh..."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1245,
            columnNumber: 19
          }, this) : dailyTasks.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-10 bg-white/5 border border-dashed border-white/10 rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-4xl block mb-2", children: "🎉" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1251,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-yellow-400 uppercase tracking-widest", children: "Không có nhiệm vụ nào phát sinh" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1252,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-200/80 mt-1 max-w-sm mx-auto", children: "Hãy tiếp tục rèn luyện lộ trình chính để kích hoạt các chuỗi thử thách thông minh ngày hôm nay!" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1253,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1250,
            columnNumber: 19
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4 text-left font-sans", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-yellow-300 font-extrabold uppercase tracking-wide", children: [
                  /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-yellow-300 fill-yellow-400/20" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1264,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "Mục tiêu ngày hôm nay của bạn" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1265,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1263,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-mono font-black text-yellow-350 text-base", children: [
                  dailyTasks.filter((t) => t.completed).length,
                  " / ",
                  dailyTasks.length,
                  " NHIỆM VỤ"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1267,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1262,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-white/10 rounded-full h-4.5 p-1 overflow-hidden border border-white/5 shadow-inner", children: /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: "bg-gradient-to-r from-yellow-350 to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(253,224,71,0.4)]",
                  style: { width: `${dailyTasks.length > 0 ? Math.round(dailyTasks.filter((t) => t.completed).length / dailyTasks.length * 100) : 0}%` }
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1273,
                  columnNumber: 25
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1272,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-indigo-150 font-mono", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "Nhận điểm thưởng +50 XP sau khi hạ gục tất cả" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1280,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-yellow-300", children: [
                  dailyTasks.length > 0 ? Math.round(dailyTasks.filter((t) => t.completed).length / dailyTasks.length * 100) : 0,
                  "% HOÀN THÀNH"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1281,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1279,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1261,
              columnNumber: 21
            }, this),
            showCelebration && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                className: "bg-gradient-to-r from-yellow-400 to-amber-450 text-slate-900 rounded-3xl p-4.5 text-center space-y-2 shadow-lg",
                children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-3xl block animate-bounce", children: "🏆" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1294,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black uppercase tracking-wider", children: "TUYỆT VỜI! ĐẠT CHỈ TIÊU CHIẾN THẦN HOÀN HẢO" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1295,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-800 font-semibold max-w-md mx-auto leading-normal", children: [
                    "Bạn đã bứt phá hoàn tất 100% mục tiêu của mình. Hệ thống tặng thêm thưởng nóng ",
                    /* @__PURE__ */ jsxDEV("strong", { children: "+50 XP" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1297,
                      columnNumber: 106
                    }, this),
                    "!"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1296,
                    columnNumber: 25
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1289,
                columnNumber: 23
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3.5", children: dailyTasks.map((task) => {
              const isDone = task.completed;
              const curVal = task.currentValue || 0;
              const tarVal = task.targetValue || 1;
              return /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: `flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 text-left ${isDone ? "bg-white/10 border-white/15 opacity-75" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 mt-0.5", children: isDone ? /* @__PURE__ */ jsxDEV("div", { className: "text-lg bg-emerald-500 text-white rounded-full flex items-center justify-center w-7 h-7 shadow-sm font-bold", children: "✓" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1320,
                      columnNumber: 33
                    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-xs bg-white/10 text-indigo-150 border border-white/20 rounded-full flex items-center justify-center w-7 h-7 font-mono font-black", children: [
                      curVal,
                      "/",
                      tarVal
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1324,
                      columnNumber: 33
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1318,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-w-0 space-y-1", children: [
                      /* @__PURE__ */ jsxDEV("p", { className: `text-xs font-black leading-snug truncate ${isDone ? "text-indigo-200 line-through" : "text-white"}`, children: task.title }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1331,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-indigo-150 leading-relaxed line-clamp-1", children: task.description }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1334,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 pt-0.5", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-950/40 text-yellow-300 border border-yellow-300/20 px-1.5 py-0.5 rounded font-black font-mono tracking-wider", children: [
                        "🏷️ CẤP ĐỘ: ",
                        (task.level || "A1").toUpperCase()
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1338,
                        columnNumber: 33
                      }, this) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1337,
                        columnNumber: 31
                      }, this),
                      !isDone && /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5", children: /* @__PURE__ */ jsxDEV(
                        "div",
                        {
                          className: "bg-yellow-300 h-full rounded-full",
                          style: { width: `${Math.min(100, Math.round(curVal / tarVal * 100))}%` }
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 1345,
                          columnNumber: 35
                        },
                        this
                      ) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1344,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1330,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex flex-col items-end gap-1.5 justify-between h-full", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: `px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase tracking-wider flex items-center gap-1 ${isDone ? "bg-white/5 text-slate-350 border-white/5" : "bg-yellow-300 text-slate-900 border-none shadow-sm"}`, children: [
                        /* @__PURE__ */ jsxDEV(Zap, { className: "w-2.5 h-2.5 fill-current" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 1359,
                          columnNumber: 33
                        }, this),
                        "+",
                        task.xpReward || 15,
                        " XP"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1354,
                        columnNumber: 31
                      }, this),
                      !isDone && /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            const taskMod = (task.module || task.taskType || "vocabulary").toLowerCase();
                            if (["vocabulary", "vocab", "flashcard"].includes(taskMod)) {
                              setVocabLevel(task.level || "A1");
                              setActiveTab("vocab");
                            } else {
                              if (onNavigateToTask) {
                                onNavigateToTask(task);
                              }
                            }
                          },
                          className: "px-2.5 py-1 bg-yellow-400 hover:bg-yellow-350 active:scale-95 text-slate-950 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm",
                          children: [
                            /* @__PURE__ */ jsxDEV(Play, { className: "w-2 h-2 fill-slate-950 text-slate-950" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 1379,
                              columnNumber: 35
                            }, this),
                            "Vào học"
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 1364,
                          columnNumber: 33
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1353,
                      columnNumber: 29
                    }, this)
                  ]
                },
                task.id,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1310,
                  columnNumber: 27
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1303,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1258,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1078,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1073,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-650 font-extrabold uppercase tracking-widest block", children: "CHUYÊN ĐỀ PHẢI HỌC" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1398,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5", children: "📖 HOẠT ĐỘNG HẰNG NGÀY • CORE HABITS" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1399,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1397,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all group relative", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 right-4 text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-indigo-100", children: [
              "CEFR ",
              user.level || "A1"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1407,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4.5 text-left", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xl group-hover:scale-105 transition-transform", children: "📚" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1412,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800 uppercase tracking-tight", children: "KHO TỪ VỰNG TIÊU CHUẨN CEFR" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1416,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed", children: "Học thông minh qua hàng ngàn từ vựng, cụm từ tiếng Anh bản xứ với phiên âm, giải nghĩa học thuật và ví dụ cụ thể cho mọi trình độ." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1417,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1415,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1411,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-6 pt-4 border-t border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-bold block", children: "Tự động gợi ý từ vựng yếu" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1424,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setActiveTab("vocab");
                    setIsQuizMode(false);
                  },
                  className: "px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1",
                  children: [
                    "BẮT ĐẦU HỌC ",
                    /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1429,
                      columnNumber: 35
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1425,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1423,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1406,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all group relative", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "absolute top-4 right-4 text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono", children: "SPACED REPETITION" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1436,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4.5 text-left", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-xl group-hover:scale-105 transition-transform", children: "🧠" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1441,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800 uppercase tracking-tight", children: "ÔN TẬP THẺ NHỚ SRS" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1445,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed font-medium", children: "Khoa học ghi nhớ ngắt quãng tự động đề xuất những từ vựng chuẩn bị quên để giữ cho bộ não luôn lưu trữ thông tin lâu dài bền bỉ." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1446,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1444,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1440,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-6 pt-4 border-t border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-bold block", children: "Đồng bộ đám mây" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1453,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setActiveTab("srs");
                  },
                  className: "px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1",
                  children: [
                    "LUYỆN THẺ SRS ",
                    /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1458,
                      columnNumber: 37
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1454,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1452,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1435,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1404,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1396,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-emerald-500/5 to-teal-500/10 border-2 border-emerald-200/80 rounded-3xl p-6.5 relative overflow-hidden text-left hover:border-emerald-400 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 max-w-2xl", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm", children: [
            /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3 h-3 fill-white/10" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1469,
              columnNumber: 19
            }, this),
            " SMART COGNITIVE"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1468,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5", children: "📝 BÀI ÔN TẬP TỰ ĐỘNG (SMART AUTO-REVIEW)" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1472,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-600 leading-relaxed font-medium", children: "AI tự động tổng hợp những lỗi ngữ pháp bạn hay sai, các từ khó nhớ, và các âm vị IPA bạn cần chỉnh và biên dịch thành các bài ôn tập bám sát thực tế của bạn." }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1475,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1471,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1467,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("auto-review"),
            className: "px-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md inline-flex items-center gap-2 shrink-0 self-start sm:self-auto",
            children: [
              /* @__PURE__ */ jsxDEV("span", { children: "CHỮA LỖI VỚI AI" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1485,
                columnNumber: 17
              }, this),
              " ",
              /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1485,
                columnNumber: 46
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1481,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1466,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-650 font-extrabold uppercase tracking-widest block", children: "AI PLAYGROUNDS" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1492,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5", children: "🤖 KHU VỰC AI • AI LEARNING TOOLS" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1493,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1491,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-slate-100 hover:border-violet-300 rounded-3xl p-5.5 hover:shadow-sm transition-all text-left flex flex-col justify-between group", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform", children: "👩‍🏫" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1503,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 select-none", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between", children: [
                  "CỐ VẤN AI TUTOR",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-black uppercase font-sans", children: "ACTIVE" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1509,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1507,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed font-semibold", children: "Đối thoại sâu rộng và giải đáp thắc mắc ngữ pháp, dịch thuật tức thì với AI gia sư đắc lực." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1511,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1506,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1502,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveTab("tutor"),
                className: "mt-5 px-3.5 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer w-full uppercase tracking-wider",
                children: [
                  "Hỏi đáp gia sư AI ",
                  /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1520,
                    columnNumber: 39
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1516,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1501,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-slate-100 hover:border-rose-300 rounded-3xl p-5.5 hover:shadow-sm transition-all text-left flex flex-col justify-between group", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform", children: "🏨" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1527,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 select-none", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between", children: [
                  "NHẬP VAI THỰC TẾ (ROLE PLAY)",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black uppercase font-sans", children: "CHUYÊN SÂU" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1533,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1531,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed font-semibold", children: "Tham gia đàm thoại vào các kịch bản đời thường: check-in sân bay, giao lưu bạn bè quốc tế." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1535,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1530,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1526,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveTab("roleplay"),
                className: "mt-5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer w-full uppercase tracking-wider",
                children: [
                  "Bắt đầu hội thoại ",
                  /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1544,
                    columnNumber: 39
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1540,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1525,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-slate-100 hover:border-emerald-250 rounded-3xl p-5.5 hover:shadow-sm transition-all text-left flex flex-col justify-between group", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform", children: "🎤" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1551,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 select-none", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between", children: [
                  "LUYỆN PHÁT ÂM AI (PRONUNCIATION)",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase font-sans", children: "VOICE ANALYST" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1557,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1555,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed font-semibold", children: "AI lắng nghe giọng nói của bạn, nhận dạng phổ âm và ghi nhận chấm điểm chuẩn xác từng từ." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1559,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1554,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1550,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveTab("pronunciation"),
                className: "mt-5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer w-full uppercase tracking-wider",
                children: [
                  "Luyện phát âm giọng đọc ",
                  /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1568,
                    columnNumber: 45
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1564,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1549,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-slate-100 hover:border-orange-300 rounded-3xl p-5.5 hover:shadow-sm transition-all text-left flex flex-col justify-between group", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform", children: "🗣️" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1575,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 select-none", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between", children: [
                  "PHÁT ÂM IPA CLINIC",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-black uppercase font-sans", children: "PHONETICS" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1581,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1579,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed font-semibold", children: "Sửa giọng từ cơ bản với bảng 44 âm vĩ chuẩn quốc tế giúp bạn phát âm chắc chắn, chuẩn giọng." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1583,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1578,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1574,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveTab("ipa"),
                className: "mt-5 px-3.5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer w-full uppercase tracking-wider",
                children: [
                  "Phòng luyện âm IPA ",
                  /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1592,
                    columnNumber: 40
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1588,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1573,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1498,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1490,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-650 font-extrabold uppercase tracking-widest block", children: "LUYỆN THI THỬ CHỨNG CHỈ" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1602,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5", children: "🎓 CHINH PHỤC CHỨNG CHỈ • EXAM PREPARATION" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1603,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1601,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-7 text-white relative overflow-hidden text-left hover:shadow-lg transition-all border border-slate-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1609,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 max-w-2xl", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-400 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-wider", children: "COMPREHENSIVE" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1611,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black uppercase tracking-tight text-white flex items-center gap-2", children: "LUYỆN ĐỀ CHUẨN ĐỊNH DẠNG IELTS & TOEIC 📝" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1614,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-200/90 leading-relaxed font-semibold", children: "Đề thi thử rút gọn và đầy đủ giúp học sinh kiểm tra định lượng năng lực từ vựng, ngữ pháp, độ nhạy thông hiểu nghe đọc chuẩn quốc tế." }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1617,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1610,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setActiveTab("exams"),
              className: "px-6 py-4 bg-yellow-400 hover:bg-yellow-350 active:scale-[0.98] text-slate-950 text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md inline-flex items-center gap-2 shrink-0 self-start md:self-auto uppercase tracking-wide",
              children: [
                /* @__PURE__ */ jsxDEV("span", { children: "Chinh Phục Đề Thi" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1626,
                  columnNumber: 19
                }, this),
                " ",
                /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1626,
                  columnNumber: 50
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1622,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1608,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1600,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setShowDiscoverMore(!showDiscoverMore),
            className: "w-full p-4.5 px-6 bg-slate-50 hover:bg-slate-100/70 text-left flex items-center justify-between font-black text-xs text-slate-600 uppercase tracking-wider cursor-pointer select-none transition-all",
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-2 font-black", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "🧭 KHÁM PHÁ THÊM CÁC TIỆN ÍCH KHÁC" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1638,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-100 text-indigo-750 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono lowercase", children: "cloud" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1639,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1637,
                columnNumber: 17
              }, this),
              showDiscoverMore ? /* @__PURE__ */ jsxDEV(ChevronUp, { className: "w-4 h-4 text-slate-500" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1641,
                columnNumber: 37
              }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { className: "w-4 h-4 text-slate-500" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1641,
                columnNumber: 88
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1633,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(AnimatePresence, { children: showDiscoverMore && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            className: "overflow-hidden border-t border-slate-150 bg-white",
            children: /* @__PURE__ */ jsxDEV("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: "p-4.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-indigo-50/20 hover:border-indigo-150 text-left flex items-start gap-3.5 transition-all group cursor-pointer",
                  onClick: () => {
                    setActiveTab("grammar");
                  },
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0", children: "📝" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1657,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 flex-1", children: [
                      /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider", children: "Học Ngữ Pháp Cốt Lõi (Grammar)" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1661,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-normal font-semibold", children: "Củng cố cấu trúc câu, mệnh đề quan hệ, bài tập đắp chữ và ngữ pháp tự động sửa sai." }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1662,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-600 font-extrabold hover:underline block mt-1", children: "Bắt đầu ôn tập ngữ pháp →" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1665,
                        columnNumber: 27
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1660,
                      columnNumber: 25
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1654,
                  columnNumber: 23
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "p-4.5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg shrink-0", children: "🔥" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1673,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 flex-1", children: [
                  /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider", children: "Lịch Sử Lưu Đám Mây" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1677,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-normal font-medium", children: "Toàn bộ lịch sử rèn luyện, cấp độ CEFR tích lũy và số điểm thưởng XP được lưu tự động trên Firestore." }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1678,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1676,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1672,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1652,
              columnNumber: 21
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1646,
            columnNumber: 19
          },
          this
        ) }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1644,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1632,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1070,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1069,
      columnNumber: 9
    }, this),
    activeTab === "ipa" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Bảng phiên âm quốc tế IPA", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-150 pb-5", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-1 text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-750 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm", children: [
            /* @__PURE__ */ jsxDEV(Flame, { className: "w-3.5 h-3.5 text-orange-500 fill-orange-200" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1704,
              columnNumber: 19
            }, this),
            " Elite Phonetics Clinic"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1703,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black text-slate-800 mt-1.5 flex items-center gap-2", children: "44 Âm Tiết Phiên Âm Quốc Tế" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1706,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-medium", children: "Lộ trình chuẩn hóa phát âm rít gió, nguyên âm, phụ âm tựa ELSA Speak và học thuật chuẩn Anh-Mỹ." }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1709,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1702,
          columnNumber: 15
        }, this),
        ipaStats && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 min-w-[240px] space-y-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-slate-300 font-mono", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "TIẾN TRÌNH IPA" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1718,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-400 font-bold", children: [
              ipaStats.progressPercent,
              "%"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1719,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1717,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-slate-800 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500",
              style: { width: `${ipaStats.progressPercent}%` }
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1722,
              columnNumber: 21
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1721,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2 text-center pt-1 border-t border-slate-800", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left font-mono", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 uppercase block leading-none", children: "Thành thạo" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1729,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-slate-200", children: [
                ipaStats.completedUniqueSounds,
                "/44"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1730,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1728,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-right font-mono", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 uppercase block leading-none", children: "Luyện nói" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1733,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-rose-300", children: [
                ipaStats.totalAttempts,
                " lần"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1734,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1732,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1727,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1716,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1701,
        columnNumber: 13
      }, this),
      ipaStats && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 bg-indigo-50/40 border border-indigo-100 rounded-2xl p-3 px-4 text-xs", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "p-1.5 bg-emerald-100 text-emerald-700 rounded-xl font-extrabold flex items-center justify-center text-sm", children: "💪" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1745,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[10px] uppercase font-black block", children: "Âm tốt nhất của bạn:" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1747,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-855 font-black text-[12px] mt-0.5 block", children: [
              "/",
              ipaStats.strongestSound?.sound || "Chưa ghi nhận",
              "/ (",
              ipaStats.strongestSound?.score || 0,
              "đ)"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1748,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1746,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1744,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5 md:border-l md:border-slate-150 md:pl-4", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "p-1.5 bg-amber-100 text-amber-700 rounded-xl font-extrabold flex items-center justify-center text-sm", children: "⚠️" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1754,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[10px] uppercase font-black block", children: "Hãy chú ý luyện tập thêm:" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1756,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-855 font-black text-[12px] mt-0.5 block", children: [
              "/",
              ipaStats.weakestSound?.sound || "Chưa ghi nhận",
              "/ (",
              ipaStats.weakestSound?.score || 0,
              "đ)"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1757,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1755,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1753,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1743,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "xl:col-span-2 space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl", children: [
            { id: "vowelsShort", label: "Nguyên âm ngắn" },
            { id: "vowelsLong", label: "Nguyên âm dài" },
            { id: "diphthongs", label: "Nguyên âm đôi" },
            { id: "consonants", label: "Phụ âm" }
          ].map((subT) => {
            const count = ipaChart ? ipaChart[subT.id]?.length || 0 : 0;
            const isActive = ipaSubTab === subT.id;
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setIpaSubTab(subT.id),
                className: `flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isActive ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,
                children: [
                  subT.label,
                  /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-200/80 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded-full", children: count }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1792,
                    columnNumber: 25
                  }, this)
                ]
              },
              subT.id,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1782,
                columnNumber: 23
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1772,
            columnNumber: 17
          }, this),
          ipaChart ? /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-55/60 p-4 border border-slate-200 rounded-2xl", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5", children: ipaChart[ipaSubTab]?.map((item) => {
            const isSelected = selectedIpa?.ipa === item.ipa;
            const scoreKey = "ipa_" + item.ipa;
            const userBestScore = ipaStats?.bestScores?.[scoreKey] || 0;
            const isMastered = userBestScore >= 80;
            const status = ipaStats?.statusMap?.[item.ipa] || "learning";
            return /* @__PURE__ */ jsxDEV(
              "div",
              {
                onClick: () => {
                  setSelectedIpa(item);
                  setIpaEvaluationResult(null);
                  setIpaDetailTab("learn");
                },
                className: `p-4 rounded-2xl border text-center cursor-pointer transition-all relative group flex flex-col justify-between ${isSelected ? "bg-indigo-650 border-indigo-700 text-white shadow-xl scale-[1.02]" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm"}`,
                children: [
                  isMastered && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 right-2 bg-amber-500 text-white rounded-full p-0.5 border border-amber-400 flex items-center justify-center w-5 h-5 shadow animate-pulse", children: /* @__PURE__ */ jsxDEV(Award, { className: "w-3 h-3 text-white" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1827,
                    columnNumber: 33
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1826,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-3xl block font-serif font-black tracking-wide leading-none py-1", children: [
                      "/",
                      item.ipa,
                      "/"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1833,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: `block text-[10px] font-bold italic ${isSelected ? "text-indigo-200" : "text-slate-400"}`, children: item.sampleWord }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1838,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: `block text-[9px] ${isSelected ? "text-indigo-150" : "text-slate-400"}`, children: [
                      "(",
                      item.translation,
                      ")"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1841,
                      columnNumber: 31
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1831,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mt-3 pt-3 border-t border-dashed border-slate-200/60 text-[9px] font-mono leading-none", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex gap-0.5", children: Array.from({ length: typeof item.difficulty === "number" ? item.difficulty : item.difficulty === "Hard" ? 3 : item.difficulty === "Medium" ? 2 : 1 }).map((_, i) => /* @__PURE__ */ jsxDEV(Star, { className: `w-2 h-2 ${isSelected ? "text-amber-200 fill-amber-300" : "text-amber-500 fill-amber-500"}` }, i, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1851,
                      columnNumber: 35
                    }, this)) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1849,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: status === "mastered" ? /* @__PURE__ */ jsxDEV("span", { className: `font-black ${isSelected ? "text-emerald-300" : "text-emerald-600"}`, children: [
                      userBestScore || 80,
                      "đ"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1858,
                      columnNumber: 35
                    }, this) : status === "practicing" ? /* @__PURE__ */ jsxDEV("span", { className: `font-black ${isSelected ? "text-amber-200" : "text-amber-600"}`, children: userBestScore ? `${userBestScore}đ` : "luyện tập" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1862,
                      columnNumber: 35
                    }, this) : status === "learning" ? /* @__PURE__ */ jsxDEV("span", { className: `italic ${isSelected ? "text-sky-200" : "text-sky-655"}`, children: "mới học" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1866,
                      columnNumber: 35
                    }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-slate-350 italic", children: "khoá" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1870,
                      columnNumber: 35
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1856,
                      columnNumber: 31
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1847,
                    columnNumber: 29
                  }, this)
                ]
              },
              item.ipa,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1811,
                columnNumber: 27
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1802,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1801,
            columnNumber: 19
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-16 text-xs text-slate-400 font-mono animate-pulse", children: "Đang đồng bộ hóa kho tài nguyên phát âm..." }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1880,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1769,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-inner flex flex-col justify-between space-y-4", children: selectedIpa ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 flex-1", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-1.5 pb-3 border-b border-slate-200 flex flex-col items-center", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-4xl font-serif font-black text-indigo-700 bg-white px-5 py-2.5 rounded-2xl border border-slate-150 w-fit shadow-md block", children: [
              "/",
              selectedIpa.ipa,
              "/"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1892,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 mt-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-150 text-indigo-750 font-extrabold px-2 py-0.5 rounded uppercase", children: selectedIpa.type }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1896,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-0.5 ${selectedIpa.difficulty === "Hard" ? "bg-red-50 text-red-650" : selectedIpa.difficulty === "Medium" ? "bg-amber-50 text-amber-655" : "bg-emerald-50 text-emerald-650"}`, children: [
                /* @__PURE__ */ jsxDEV(Star, { className: "w-2.5 h-2.5 fill-current" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1902,
                  columnNumber: 27
                }, this),
                " ",
                selectedIpa.difficulty
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1899,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1895,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1891,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-xl", children: [
            { id: "learn", label: "Luyện Nghe" },
            { id: "mouth", label: "Khẩu Hình" },
            { id: "exercises", label: "Kiểm tra Quiz" }
          ].map((actT) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setIpaDetailTab(actT.id),
              className: `py-2 px-2 rounded-lg text-[10px] font-black text-center transition-all cursor-pointer ${ipaDetailTab === actT.id ? "bg-white text-indigo-700 shadow" : "text-slate-500 hover:text-slate-800"}`,
              children: actT.label
            },
            actT.id,
            false,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1914,
              columnNumber: 25
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1908,
            columnNumber: 21
          }, this),
          ipaDetailTab === "learn" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block text-left", children: "Nghe giọng chuẩn Anh - Mỹ:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1933,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-1.5", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => playIpaListening(selectedIpa.sampleWord, "en-US", 0.85),
                    className: "px-2.5 py-2.5 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-750 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm group",
                    children: [
                      /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3.5 h-3.5 text-indigo-600 group-hover:scale-110" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1939,
                        columnNumber: 31
                      }, this),
                      " US Accent"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1935,
                    columnNumber: 29
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => playIpaListening(selectedIpa.sampleWord, "en-GB", 0.82),
                    className: "px-2.5 py-2.5 bg-white hover:bg-purple-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-750 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm group",
                    children: [
                      /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3.5 h-3.5 text-purple-600 group-hover:scale-110" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1945,
                        columnNumber: 31
                      }, this),
                      " UK Accent"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1941,
                    columnNumber: 29
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => playIpaListening(selectedIpa.sampleWord, "en-US", 0.52),
                    className: "px-2.5 py-2.5 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-750 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm group",
                    children: [
                      /* @__PURE__ */ jsxDEV(Clock, { className: "w-3.5 h-3.5 text-amber-500 group-hover:scale-110" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1951,
                        columnNumber: 31
                      }, this),
                      " Chậm (Slow)"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1947,
                    columnNumber: 29
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1934,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1932,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-450 font-black uppercase tracking-wider block border-b border-slate-100 pb-1.5 mb-1.5", children: "Từ khóa đại diện chính:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1958,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-slate-800", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black font-mono tracking-wide", children: selectedIpa.sampleWord }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1964,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 block italic", children: [
                    "(",
                    selectedIpa.translation,
                    ")"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1965,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1963,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => playIpaListening(selectedIpa.sampleWord),
                    className: "p-1.5 hover:bg-indigo-50 text-indigo-650 rounded-full cursor-pointer transition-transform",
                    children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 1971,
                      columnNumber: 31
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1967,
                    columnNumber: 29
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1962,
                columnNumber: 27
              }, this),
              selectedIpa.examples && selectedIpa.examples.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "pt-2.5 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-450 uppercase font-black tracking-wider block mb-1.5", children: "Các ví dụ khác chứa âm tương tự:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1978,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1", children: selectedIpa.examples.map((item) => /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    onClick: () => playIpaListening(item, "en-US", 0.85),
                    className: "flex items-center gap-1 bg-slate-50 hover:bg-indigo-50 border border-slate-200 p-1.5 px-2 rounded-xl text-[10px] font-semibold font-mono text-slate-700 hover:text-indigo-700 cursor-pointer transition-all",
                    children: [
                      /* @__PURE__ */ jsxDEV("span", { children: item }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1986,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3 h-3 opacity-60 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 1987,
                        columnNumber: 37
                      }, this)
                    ]
                  },
                  item,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 1981,
                    columnNumber: 35
                  },
                  this
                )) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 1979,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1977,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1957,
              columnNumber: 25
            }, this),
            selectedIpa.exampleSentences && selectedIpa.exampleSentences.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-455 font-black uppercase tracking-wider block border-b border-slate-100 pb-1.5 mb-1.5", children: "Luyện kỹ năng thực tế với câu:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 1998,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: selectedIpa.exampleSentences.map((sent, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start gap-2 leading-normal border-b border-slate-50 pb-1.5 last:border-0 last:pb-0", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10.5px] font-black text-slate-800 font-sans tracking-wide", children: [
                    '"',
                    sent.sentence,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2005,
                    columnNumber: 37
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[9px] text-slate-400 mt-0.5", children: sent.translation }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2008,
                    columnNumber: 37
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2004,
                  columnNumber: 35
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => playIpaListening(sent.sentence, "en-US", 0.85),
                    className: "p-1 hover:bg-indigo-50 text-indigo-600 rounded-full cursor-pointer transition-all flex-shrink-0",
                    children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2016,
                      columnNumber: 37
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2012,
                    columnNumber: 35
                  },
                  this
                )
              ] }, idx, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2003,
                columnNumber: 33
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2001,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 1997,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 pt-3 border-t border-slate-200", children: [
              /* @__PURE__ */ jsxDEV("h5", { className: "text-[10px] font-black text-slate-800 uppercase flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV(Mic, { className: `w-3.5 h-3.5 text-emerald-500 ${isIpaRecording ? "animate-pulse" : ""}` }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2027,
                  columnNumber: 29
                }, this),
                " THIẾT BỊ MICRO PHẢN XẠ:"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2026,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                micPermissionError && /* @__PURE__ */ jsxDEV("div", { className: "w-full text-left", children: /* @__PURE__ */ jsxDEV(
                  MicPermissionInstructions,
                  {
                    errorMsg: micPermissionError,
                    onClose: () => setMicPermissionError(null)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2033,
                    columnNumber: 33
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2032,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    id: "ipa-practice-mic-button",
                    onClick: () => startIpaVoiceRecording(selectedIpa.sampleWord),
                    className: `w-full py-2.5 px-4 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 text-white relative z-10 ${isIpaRecording ? "bg-red-500 animate-pulse hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700 shadow-sm"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(Mic, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2048,
                        columnNumber: 31
                      }, this),
                      isIpaRecording ? "Đang ghi âm (Bấm để dừng)..." : "BẮT ĐẦU LUYỆN NÓI"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2039,
                    columnNumber: 29
                  },
                  this
                ),
                isIpaRecording && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-1.5 h-6 my-2 bg-red-50/50 rounded-lg py-1 border border-red-100", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-1 bg-red-500 h-3 rounded-full animate-[pulse_0.8s_infinite]" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2055,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "w-1 bg-red-400 h-5 rounded-full animate-[pulse_0.6s_infinite]" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2056,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "w-1 bg-red-500 h-4 rounded-full animate-[pulse_0.7s_infinite]" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2057,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "w-1 bg-red-400 h-6 rounded-full animate-[pulse_0.5s_infinite]" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2058,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "w-1 bg-red-500 h-3 rounded-full animate-[pulse_0.8s_infinite]" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2059,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-red-500 font-extrabold uppercase tracking-wide", children: "Đang ghi âm..." }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2060,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2054,
                  columnNumber: 31
                }, this),
                ipaTranscription && /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-2.5 rounded-lg border border-slate-150 text-[10px] text-slate-650 font-mono text-center", children: [
                  "Bạn phát biểu: ",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-650 font-bold", children: [
                    '"',
                    ipaTranscription,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2066,
                    columnNumber: 48
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2065,
                  columnNumber: 31
                }, this),
                ipaEvaluating && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-2 text-[10px] text-indigo-650 font-mono animate-pulse", children: "Cố vấn AI đang đo khẩu hình tiếng Anh & chấm điểm ELSA..." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2072,
                  columnNumber: 31
                }, this),
                ipaEvaluationResult && /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950 text-white p-4 rounded-xl text-xs space-y-3.5 shadow-md border border-indigo-800 text-left", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-fit", children: "Kết quả luyện phát âm" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2081,
                      columnNumber: 35
                    }, this),
                    ipaEvaluationResult.label && /* @__PURE__ */ jsxDEV(
                      "span",
                      {
                        className: "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide",
                        style: { color: ipaEvaluationResult.color, backgroundColor: ipaEvaluationResult.backgroundColor },
                        children: ipaEvaluationResult.label
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2085,
                        columnNumber: 37
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2080,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-1 text-center font-mono text-[10px]", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 p-1.5 rounded", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "block text-slate-300", children: "Độ chuẩn" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2096,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-emerald-450", children: [
                        ipaEvaluationResult.accuracy,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2097,
                        columnNumber: 37
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2095,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 p-1.5 rounded", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "block text-slate-300", children: "Trôi chảy" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2100,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-sky-450", children: [
                        ipaEvaluationResult.fluency,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2101,
                        columnNumber: 37
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2099,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 p-1.5 rounded", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "block text-slate-300", children: "Tổng quan" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2104,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-rose-300", children: [
                        ipaEvaluationResult.overall,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2105,
                        columnNumber: 37
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2103,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 p-1.5 rounded", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "block text-slate-300", children: "Xếp hạng" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2108,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-amber-400", children: "ELSA" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2109,
                        columnNumber: 37
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2107,
                      columnNumber: 35
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2094,
                    columnNumber: 33
                  }, this),
                  ipaEvaluationResult.words && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] uppercase tracking-wider font-extrabold text-slate-450 block", children: "Đọc chi tiết:" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2116,
                      columnNumber: 37
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 p-2.5 bg-black/20 rounded-lg", children: ipaEvaluationResult.words.map((w, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
                      /* @__PURE__ */ jsxDEV(
                        "span",
                        {
                          className: "px-1.5 py-0.5 rounded text-[10.5px] font-bold",
                          style: { color: w.color, backgroundColor: w.backgroundColor },
                          children: w.word
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2120,
                          columnNumber: 43
                        },
                        this
                      ),
                      w.score > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-mono text-slate-300 mt-0.5", children: [
                        w.score,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2126,
                        columnNumber: 59
                      }, this)
                    ] }, idx, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2119,
                      columnNumber: 41
                    }, this)) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2117,
                      columnNumber: 37
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2115,
                    columnNumber: 35
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 font-sans text-slate-350 text-[11px] border-t border-white/10 pt-2 text-left", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      "Mục tiêu: ",
                      /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-white font-mono", children: [
                        '"',
                        selectedIpa.sampleWord,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2134,
                        columnNumber: 50
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2134,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      "Bạn đã đọc: ",
                      /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-emerald-400 font-mono", children: [
                        '"',
                        ipaTranscription || "...",
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2135,
                        columnNumber: 52
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2135,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      "Điểm phát âm: ",
                      /* @__PURE__ */ jsxDEV("span", { className: "font-black text-rose-300", children: [
                        ipaEvaluationResult.overall,
                        "% (",
                        ipaEvaluationResult.overall >= 85 ? "🟢 Đọc đúng" : ipaEvaluationResult.overall >= 60 ? "🟡 Gần đúng" : "🔴 Đọc sai",
                        ")"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2136,
                        columnNumber: 54
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2136,
                      columnNumber: 35
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2133,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-200 text-justify italic font-serif leading-snug", children: [
                    '"',
                    ipaEvaluationResult.feedback,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2139,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => {
                        setIpaTranscription("");
                        setIpaEvaluationResult(null);
                        startIpaVoiceRecording(selectedIpa.sampleWord);
                      },
                      className: "w-full py-2 mt-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black text-center cursor-pointer transition-all uppercase tracking-wide border border-white/10",
                      children: "Luyện lại từ này 🔄"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2143,
                      columnNumber: 33
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2079,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2030,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2025,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 1930,
            columnNumber: 23
          }, this),
          ipaDetailTab === "mouth" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-left", children: [
              /* @__PURE__ */ jsxDEV("h5", { className: "text-[10px] text-indigo-700 font-extrabold uppercase flex items-center gap-1", children: "👄 HƯỚNG DẪN BỐ TRÍ KHẨU HÌNH:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2165,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-center my-2", children: [
                /* @__PURE__ */ jsxDEV("svg", { viewBox: "0 0 100 100", className: "w-16 h-16 mx-auto text-indigo-600", children: [
                  selectedIpa.type?.toLowerCase().includes("vowel") ? /* @__PURE__ */ jsxDEV("path", { d: "M 15,50 Q 50,15 85,50 M 15,50 Q 50,85 85,50", fill: "none", stroke: "currentColor", strokeWidth: "5", strokeLinecap: "round" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2173,
                    columnNumber: 33
                  }, this) : /* @__PURE__ */ jsxDEV("path", { d: "M 25,50 Q 50,38 75,50 M 25,50 Q 50,62 75,50", fill: "none", stroke: "currentColor", strokeWidth: "5", strokeLinecap: "round" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2175,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("path", { d: "M 30,68 Q 55,42 80,68", fill: "none", stroke: "#f59e0b", strokeWidth: "3.5", strokeDasharray: "3,3" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2177,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("circle", { cx: "50", cy: "50", r: "3.5", fill: "#ef4444", className: "animate-ping" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2178,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2171,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-mono text-slate-400 block mt-1.5 uppercase", children: "Cấu hình luồng hơi vòm họng" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2180,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2170,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-[10.5px] text-slate-650 leading-relaxed", children: selectedIpa.articulation ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("p", { children: [
                  /* @__PURE__ */ jsxDEV("strong", { children: "👄 Môi (Lips):" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2186,
                    columnNumber: 36
                  }, this),
                  " ",
                  selectedIpa.articulation.lips
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2186,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ jsxDEV("p", { children: [
                  /* @__PURE__ */ jsxDEV("strong", { children: "👅 Lưỡi (Tongue):" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2187,
                    columnNumber: 36
                  }, this),
                  " ",
                  selectedIpa.articulation.tongue
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2187,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ jsxDEV("p", { children: [
                  /* @__PURE__ */ jsxDEV("strong", { children: "💨 Luồng khí (Airflow):" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2188,
                    columnNumber: 36
                  }, this),
                  " ",
                  selectedIpa.articulation.airflow
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2188,
                  columnNumber: 33
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2185,
                columnNumber: 31
              }, this) : /* @__PURE__ */ jsxDEV("p", { children: selectedIpa.description }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2191,
                columnNumber: 31
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2183,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2164,
              columnNumber: 25
            }, this),
            selectedIpa.vietMistake && /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50/40 border border-amber-200/80 p-3.5 rounded-2xl space-y-2 text-left", children: [
              /* @__PURE__ */ jsxDEV("h5", { className: "text-[10px] text-amber-800 font-extrabold uppercase flex items-center gap-1", children: [
                /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-3.5 h-3.5 text-amber-600" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2200,
                  columnNumber: 31
                }, this),
                " PHỤC HỒI LỖI SAI CỦA NGƯỜI VIỆT:"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2199,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-[10px] text-slate-700 leading-normal", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "bg-white/80 p-2 rounded-xl border border-amber-100", children: [
                  "❌ ",
                  /* @__PURE__ */ jsxDEV("strong", { children: "Hành vi sai lầm:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2204,
                    columnNumber: 35
                  }, this),
                  " ",
                  selectedIpa.vietMistake.habit
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2203,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "bg-emerald-50/70 p-2 rounded-xl border border-emerald-100 text-emerald-800", children: [
                  "✔️ ",
                  /* @__PURE__ */ jsxDEV("strong", { children: "Cách chỉnh sửa:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2207,
                    columnNumber: 36
                  }, this),
                  " ",
                  selectedIpa.vietMistake.fix
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2206,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2202,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2198,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2162,
            columnNumber: 23
          }, this),
          ipaDetailTab === "exercises" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: ipaQuizCompleted ? /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 text-white rounded-2xl p-5 text-center space-y-3 shadow-md", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-3xl block", children: "🏆" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2220,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-500/85 text-white font-extrabold px-2 py-0.5 rounded uppercase", children: "KẾT QUẢ ĐỐ VUI IPA" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2221,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-100 animate-pulse", children: [
              "Cơ số điểm: ",
              ipaQuizScores,
              " / 100đ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2222,
              columnNumber: 29
            }, this),
            ipaQuizScores >= 80 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-emerald-300 font-semibold leading-relaxed", children: "BẠN ĐÃ CHIẾN THẮNG bài kiểm tra này! +50 XP được cộng trực tiếp vào hồ sơ của bạn! 🎉" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2226,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setIpaQuizCompleted(false);
                    setIpaQuizQuestionNum(0);
                    setIpaQuizScores(0);
                  },
                  className: "w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] cursor-pointer block text-center transition-all active:scale-95",
                  children: "Làm lại Đợt mới"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2227,
                  columnNumber: 33
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2225,
              columnNumber: 31
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 animate-bounce", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-amber-300 leading-relaxed", children: "Cần đạt tối thiểu 80/100đ để được đóng mộc hoàn thành. Hãy rèn luyện thêm chút nữa và thử lại nhé! 💪" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2240,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setIpaQuizCompleted(false);
                    setIpaQuizQuestionNum(0);
                    setIpaQuizScores(0);
                  },
                  className: "w-full py-2 bg-amber-500 text-white font-black rounded-xl text-[10px] hover:bg-amber-600 cursor-pointer block text-center",
                  children: "Làm lại Quiz"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2241,
                  columnNumber: 33
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2239,
              columnNumber: 31
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2219,
            columnNumber: 27
          }, this) : ipaQuizData.length > 0 && ipaQuizQuestionNum < ipaQuizData.length && /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[9px] font-mono text-slate-400", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Tiến trình câu hỏi:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2260,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1", children: ipaQuizData.map((_, i) => /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: `w-3.5 h-1.5 rounded-full ${i === ipaQuizQuestionNum ? "bg-indigo-600" : i < ipaQuizQuestionNum ? "bg-emerald-400" : "bg-slate-200"}`
                },
                i,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2263,
                  columnNumber: 37
                },
                this
              )) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2261,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2259,
              columnNumber: 31
            }, this),
            (() => {
              const currentQ = ipaQuizData[ipaQuizQuestionNum];
              return /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md uppercase block w-fit", children: [
                    "Q",
                    ipaQuizQuestionNum + 1,
                    ": ",
                    currentQ.title
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2283,
                    columnNumber: 39
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-700 mt-1.5 leading-normal font-extrabold", children: currentQ.instruction }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2286,
                    columnNumber: 39
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2282,
                  columnNumber: 37
                }, this),
                currentQ.type === "listen" && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 justify-center py-2.5 bg-slate-55 border border-dashed border-slate-250 rounded-xl", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleTTSWithParams(currentQ.audioText, "en-US", 0.85),
                      className: "p-3 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white rounded-full transition-all cursor-pointer shadow flex items-center justify-center group",
                      children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-5 h-5 group-hover:animate-bounce" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2298,
                        columnNumber: 43
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2294,
                      columnNumber: 41
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono text-slate-400", children: "Ấn loa nghe từ mẫu" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2300,
                    columnNumber: 41
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2293,
                  columnNumber: 39
                }, this),
                currentQ.type !== "speak" ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: currentQ.options?.map((opt) => {
                  const isSelected = ipaQuizSelectedOption === opt;
                  return /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      disabled: ipaQuizIsChecked,
                      onClick: () => setIpaQuizSelectedOption(opt),
                      className: `p-2.5 rounded-xl text-xs font-semibold font-serif transition-all text-center cursor-pointer border ${isSelected ? "bg-indigo-600 border-indigo-700 text-white font-black shadow" : ipaQuizIsChecked && opt === currentQ.answer ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold" : "bg-slate-55 border-slate-200 hover:bg-slate-100 text-slate-700"}`,
                      children: currentQ.type === "listen" ? `/${opt}/` : opt
                    },
                    opt,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2310,
                      columnNumber: 45
                    },
                    this
                  );
                }) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2306,
                  columnNumber: 39
                }, this) : (
                  /* Step 4: Speaking specific mic block */
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-center py-2.5 bg-slate-50 rounded-xl border border-slate-150 relative z-10 animate-fade-in text-left", children: [
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-455 italic text-center", children: [
                      "Đọc to từ đại diện: ",
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-mono text-xs", children: [
                        '"',
                        currentQ.answer,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2330,
                        columnNumber: 122
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2330,
                      columnNumber: 41
                    }, this),
                    micPermissionError && /* @__PURE__ */ jsxDEV("div", { className: "max-w-md mx-3 mb-2 relative z-10 text-left", children: /* @__PURE__ */ jsxDEV(
                      MicPermissionInstructions,
                      {
                        errorMsg: micPermissionError,
                        onClose: () => setMicPermissionError(null)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2334,
                        columnNumber: 45
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2333,
                      columnNumber: 43
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        id: "ipa-quiz-mic-button",
                        disabled: ipaEvaluating,
                        onClick: () => startIpaVoiceRecording(currentQ.answer, true),
                        className: `mx-auto w-12 h-12 rounded-full flex items-center justify-center text-white transition-all cursor-pointer relative z-10 ${isIpaRecording ? "bg-red-500 animate-pulse hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:scale-105"}`,
                        children: /* @__PURE__ */ jsxDEV(Mic, { className: "w-6 h-6 text-white" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2351,
                          columnNumber: 43
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2341,
                        columnNumber: 41
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-mono uppercase text-slate-400 block tracking-wider mt-1", children: isIpaRecording ? "Đang ghi âm (Bấm để dừng)..." : "Chạm mic để bắt đầu nói" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2354,
                      columnNumber: 41
                    }, this),
                    isIpaRecording && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-1 my-1", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "w-0.5 bg-red-500 h-2 rounded-full animate-[pulse_0.8s_infinite]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2361,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "w-0.5 bg-red-400 h-4 rounded-full animate-[pulse_0.6s_infinite]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2362,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "w-0.5 bg-red-500 h-3 rounded-full animate-[pulse_0.7s_infinite]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2363,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "w-0.5 bg-red-400 h-5 rounded-full animate-[pulse_0.5s_infinite]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2364,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "w-0.5 bg-red-500 h-2 rounded-full animate-[pulse_0.8s_infinite]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2365,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-red-500 font-black uppercase tracking-wider block ml-1", children: "Đang ghi âm..." }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2366,
                        columnNumber: 45
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2360,
                      columnNumber: 43
                    }, this),
                    ipaTranscription && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] bg-white p-2 rounded-xl border border-slate-200 text-slate-650 mx-3 mt-1.5 text-center", children: [
                      "Bạn nói: ",
                      /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-650 font-bold font-mono", children: [
                        '"',
                        ipaTranscription,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2372,
                        columnNumber: 54
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2371,
                      columnNumber: 43
                    }, this),
                    ipaEvaluating && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-1.5 text-[9px] text-indigo-650 font-mono animate-pulse font-black leading-none uppercase", children: "AI đang phân tích âm tiết..." }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2377,
                      columnNumber: 43
                    }, this),
                    ipaEvaluationResult && /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950 text-white p-3.5 rounded-xl text-xs space-y-3 shadow-md border border-indigo-800 text-left mx-3 mt-2", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-indigo-900 pb-2", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-500 px-1.5 py-0.5 rounded font-black uppercase tracking-wide block w-fit", children: "Kết quả phát âm" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2385,
                          columnNumber: 47
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          "span",
                          {
                            className: "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-normal",
                            style: { color: ipaEvaluationResult.color, backgroundColor: ipaEvaluationResult.backgroundColor },
                            children: ipaEvaluationResult.overall >= 85 ? "🟢 Đọc đúng" : ipaEvaluationResult.overall >= 60 ? "🟡 Gần đúng" : "🔴 Đọc sai"
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 2388,
                            columnNumber: 47
                          },
                          this
                        )
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2384,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 font-sans text-slate-200", children: [
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          "Từ/câu mục tiêu: ",
                          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-white font-mono", children: [
                            '"',
                            currentQ.answer,
                            '"'
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 2397,
                            columnNumber: 69
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2397,
                          columnNumber: 47
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          "Bạn đã đọc: ",
                          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-emerald-400 font-mono", children: [
                            '"',
                            ipaTranscription || "...",
                            '"'
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 2398,
                            columnNumber: 64
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2398,
                          columnNumber: 47
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          "Điểm phát âm: ",
                          /* @__PURE__ */ jsxDEV("span", { className: "font-black text-rose-300 text-sm", children: [
                            ipaEvaluationResult.overall,
                            "%"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 2399,
                            columnNumber: 66
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2399,
                          columnNumber: 47
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2396,
                        columnNumber: 45
                      }, this),
                      ipaEvaluationResult.words && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1.5 p-2 bg-black/20 rounded-lg", children: ipaEvaluationResult.words.map((w, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
                        /* @__PURE__ */ jsxDEV(
                          "span",
                          {
                            className: "px-1.5 py-0.5 rounded text-[10px] font-bold",
                            style: { color: w.color, backgroundColor: w.backgroundColor },
                            children: w.word
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 2406,
                            columnNumber: 53
                          },
                          this
                        ),
                        w.score > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-mono text-slate-350 mt-0.5", children: [
                          w.score,
                          "%"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2412,
                          columnNumber: 69
                        }, this)
                      ] }, idx, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2405,
                        columnNumber: 51
                      }, this)) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2403,
                        columnNumber: 47
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[10.5px] text-slate-300 italic", children: [
                        '"',
                        ipaEvaluationResult.feedback,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2418,
                        columnNumber: 45
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => {
                            setIpaTranscription("");
                            setIpaEvaluationResult(null);
                            setIpaQuizIsChecked(false);
                            setIpaQuizIsCorrect(false);
                            startIpaVoiceRecording(currentQ.answer, true);
                          },
                          className: "w-full py-1.5 bg-indigo-900 hover:bg-indigo-850 text-white border border-indigo-800 rounded-lg text-xs font-black text-center cursor-pointer transition-all uppercase tracking-wide",
                          children: "Thử lại phát âm 🔄"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 2422,
                          columnNumber: 45
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2383,
                      columnNumber: 43
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2329,
                    columnNumber: 39
                  }, this)
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "pt-2 border-t border-slate-100", children: ipaQuizIsChecked ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: `p-2.5 rounded-xl border flex items-center gap-2 text-left ${ipaQuizIsCorrect ? "bg-emerald-50 border-emerald-250 text-emerald-800" : "bg-red-50 border-red-250 text-red-800"}`, children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-base flex-shrink-0", children: ipaQuizIsCorrect ? "👍" : "❌" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2448,
                      columnNumber: 45
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] leading-normal font-sans", children: ipaQuizIsCorrect ? `Giải nghĩa: Chính xác! Bạn đã nắm chắc kỹ thuật phiên âm này!` : `Phải chọn đáp án đúng là: ${currentQ.type === "listen" ? "/" + currentQ.answer + "/" : currentQ.answer}` }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2449,
                      columnNumber: 45
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2443,
                    columnNumber: 43
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: async () => {
                        const nextNum = ipaQuizQuestionNum + 1;
                        if (nextNum >= ipaQuizData.length) {
                          await handleIpaQuizComplete(ipaQuizScores);
                        } else {
                          setIpaQuizQuestionNum(nextNum);
                          setIpaQuizSelectedOption(null);
                          setIpaQuizIsChecked(false);
                          setIpaQuizIsCorrect(false);
                          setIpaTranscription("");
                          setIpaEvaluationResult(null);
                        }
                      },
                      className: "w-full py-2 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-xl text-xs font-black transition-all cursor-pointer text-center",
                      children: "Tiếp tục"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2457,
                      columnNumber: 43
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2442,
                  columnNumber: 41
                }, this) : currentQ.type !== "speak" && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: !ipaQuizSelectedOption,
                    onClick: () => {
                      const isCorrect = ipaQuizSelectedOption === currentQ.answer;
                      setIpaQuizIsCorrect(isCorrect);
                      if (isCorrect) {
                        setIpaQuizScores((prev) => prev + currentQ.scoreDelta);
                      }
                      setIpaQuizIsChecked(true);
                    },
                    className: `w-full py-2 text-white font-black rounded-xl text-xs cursor-pointer transition-all ${ipaQuizSelectedOption ? "bg-indigo-600 hover:bg-indigo-750" : "bg-slate-300 cursor-not-allowed"}`,
                    children: "Kiểm tra kết quả"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2479,
                    columnNumber: 43
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2440,
                  columnNumber: 37
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2281,
                columnNumber: 35
              }, this);
            })()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2256,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2217,
            columnNumber: 23
          }, this),
          ipaEvaluationResult && ipaDetailTab !== "exercises" && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950 border border-slate-850 text-slate-100 p-3.5 rounded-2xl text-xs space-y-2.5 shadow-xl animate-fade-in text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] bg-emerald-500/85 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider block w-fit", children: "ELSA Standard Grade AI (Phản hồi tức thì)" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2515,
                columnNumber: 27
              }, this),
              ipaEvaluationResult.label && /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide",
                  style: { color: ipaEvaluationResult.color, backgroundColor: ipaEvaluationResult.backgroundColor },
                  children: ipaEvaluationResult.label
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2519,
                  columnNumber: 29
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2514,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-1.5 text-center font-mono", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-1 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[8px] text-slate-400 block pb-1", children: "Độ chuẩn" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2530,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black text-emerald-400", children: [
                  ipaEvaluationResult.accuracy,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2531,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2529,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-1 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[8px] text-slate-400 block pb-1", children: "Trôi chảy" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2534,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black text-sky-400", children: [
                  ipaEvaluationResult.fluency,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2535,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2533,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-1 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[8px] text-slate-400 block pb-1", children: "Nhấn câu" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2538,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black text-amber-500", children: [
                  ipaEvaluationResult.intonation || ipaEvaluationResult.pronunciation || 0,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2539,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2537,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-1 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[8px] text-slate-400 block pb-1", children: "Overall" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2542,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black text-rose-300", children: [
                  ipaEvaluationResult.overall,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2543,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2541,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2528,
              columnNumber: 25
            }, this),
            ipaEvaluationResult.words && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[7.5px] uppercase tracking-wider font-extrabold text-slate-400 block", children: "Từ chi tiết:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2550,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1.5 p-2 bg-black/40 rounded-lg", children: ipaEvaluationResult.words.map((w, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxDEV(
                  "span",
                  {
                    className: "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    style: { color: w.color, backgroundColor: w.backgroundColor },
                    children: w.word
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2554,
                    columnNumber: 35
                  },
                  this
                ),
                w.score > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[7.5px] font-mono text-slate-400 mt-0.5", children: [
                  w.score,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2560,
                  columnNumber: 51
                }, this)
              ] }, idx, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2553,
                columnNumber: 33
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2551,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2549,
              columnNumber: 27
            }, this),
            ipaEvaluationResult.feedback && /* @__PURE__ */ jsxDEV("p", { className: "text-[9.5px] text-slate-300 border-t border-white/5 pt-2 italic text-justify leading-relaxed", children: [
              '"',
              ipaEvaluationResult.feedback,
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2568,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 pt-1", children: Number(ipaEvaluationResult.overall) < 70 ? /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-red-950/40 text-red-300 border border-red-905/30 p-1 px-2 rounded-lg block font-semibold leading-none", children: "⚠️ Hãy luyện lại âm này kỹ hơn" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2575,
              columnNumber: 29
            }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-emerald-950/50 text-emerald-300 border border-emerald-905/30 p-1 px-2 rounded-lg block font-semibold leading-none", children: "👍 Phát âm khá tốt rồi đó!" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2579,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2573,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2513,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1889,
          columnNumber: 19
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-20 text-xs text-slate-450 italic max-w-xs mx-auto space-y-3", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-4xl block", children: "💡" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2590,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "font-extrabold text-slate-700 uppercase tracking-wide", children: "Đấu Trường Bảng Âm IPA" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2591,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] leading-relaxed", children: "Hãy nhấp chọn một thẻ âm tiết phiên âm bất kỳ trong bảng IPA bên trái để kích hoạt huấn luyện viên, xem chi tiết và tham gia minigame đố vui!" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2592,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2589,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 1887,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 1766,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-100 pb-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-850 uppercase flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(Award, { className: "w-4 h-4 text-amber-500" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2604,
                columnNumber: 21
              }, this),
              " BỘ SƯU TẬP HUY HIỆU LUYỆN ÂM TRẺ EM"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2603,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Rèn luyện dứt điểm từng nhóm âm tiết để tự phá khóa các huy hiệu quý giá!" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2606,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2602,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-50 border border-indigo-150 tracking-wider text-indigo-600 text-[10px] font-black p-1 px-2.5 rounded-full", children: "KID UNLOCKS" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2608,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2601,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
          {
            id: "vowels",
            title: "Bậc Thầy Nguyên Âm",
            desc: "Hoàn tất 100% Nguyên âm Ngắn & Dài với điểm đố vui >= 80% để mở khóa.",
            illustration: "🌸",
            isUnlocked: (() => {
              if (!ipaStats || !ipaChart) return false;
              const allVowels = [...ipaChart.vowelsShort || [], ...ipaChart.vowelsLong || []];
              if (allVowels.length === 0) return false;
              return allVowels.every((v) => (ipaStats.bestScores?.["ipa_" + v.ipa] || 0) >= 80);
            })(),
            bg: "from-indigo-55 to-indigo-100 border-indigo-200 text-indigo-900",
            lockBg: "bg-slate-50 border-slate-200 text-slate-400"
          },
          {
            id: "diphthongs",
            title: "Cao Thú Nguyên Âm Đôi",
            desc: "Hoàn tất rèn luyện thực tế 8 Nguyên âm đôi (Diphthongs) đầy khó khăn.",
            illustration: "⚡",
            isUnlocked: (() => {
              if (!ipaStats || !ipaChart) return false;
              const diphthongs = ipaChart.diphthongs || [];
              if (diphthongs.length === 0) return false;
              return diphthongs.every((v) => (ipaStats.bestScores?.["ipa_" + v.ipa] || 0) >= 80);
            })(),
            bg: "from-pink-55 to-pink-100 border-pink-200 text-pink-900",
            lockBg: "bg-slate-50 border-slate-200 text-slate-400"
          },
          {
            id: "consonants",
            title: "Chuyên Gia Phụ Âm",
            desc: "Khẩu hình chuẩn và lọt top 24 phụ âm rít gió xát sạt của tiếng Anh bản địa.",
            illustration: "🛡️",
            isUnlocked: (() => {
              if (!ipaStats || !ipaChart) return false;
              const consonants = ipaChart.consonants || [];
              if (consonants.length === 0) return false;
              return consonants.every((v) => (ipaStats.bestScores?.["ipa_" + v.ipa] || 0) >= 80);
            })(),
            bg: "from-amber-55 to-amber-100 border-amber-200 text-amber-900",
            lockBg: "bg-slate-50 border-slate-200 text-slate-400"
          }
        ].map((bg) => /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: `p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${bg.isUnlocked ? `bg-gradient-to-br ${bg.bg} scale-[1.02] shadow-md` : `${bg.lockBg} opacity-65`}`,
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-3xl block filter drop-shadow-sm", children: bg.isUnlocked ? bg.illustration : "🔒" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2667,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-left min-w-0", children: [
                /* @__PURE__ */ jsxDEV("h5", { className: "text-[11px] font-black truncate", children: bg.title }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2669,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[9.5px] leading-relaxed text-slate-500", children: bg.desc }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2670,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: `text-[8px] font-black px-2 py-0.5 rounded-full w-fit block uppercase border ${bg.isUnlocked ? "bg-white text-emerald-700 border-emerald-300" : "bg-slate-200 text-slate-500 border-slate-250"}`, children: bg.isUnlocked ? "Đang sở hữu" : "Đang khóa" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2671,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2668,
                columnNumber: 21
              }, this)
            ]
          },
          bg.id,
          true,
          {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2659,
            columnNumber: 19
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2614,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 2600,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1698,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 1697,
      columnNumber: 9
    }, this),
    activeTab === "roleplay" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Giao tiếp vai giả lập", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-sky-50 border border-sky-150 text-sky-600 font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider", children: "Module 8 • Interactive Real-Life Conversations" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2695,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-800", children: "NHẬP VAI THEO TÌNH HUỐNG THỰC TẾ" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2698,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed mt-0.5", children: "Giao tiếp tiếng Anh trực tiếp song hành với nhân bản xứ giả lập ở Nhà Hàng, Khách Sạn, hoặc Sân Bay để tăng tư duy phản xạ giao hoán." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2699,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 2694,
        columnNumber: 11
      }, this),
      !activeScenario ? (
        /* SCENARIO LIST BOARD */
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: scenarios.map((scen) => /* @__PURE__ */ jsxDEV(
          "div",
          {
            onClick: () => startScenicRoleplay(scen),
            className: "bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-slate-100/60 p-5 rounded-2xl cursor-pointer transition-all space-y-3 flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold", children: [
                  "Đóng vai với: ",
                  scen.character
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2714,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800", children: scen.title }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2717,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-snug", children: scen.situation }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2718,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2713,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-indigo-650 font-bold flex items-center gap-1 mt-2", children: [
                "Bắt đầu trò chuyện ",
                /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3 h-3" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2722,
                  columnNumber: 41
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2721,
                columnNumber: 19
              }, this)
            ]
          },
          scen.id,
          true,
          {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2708,
            columnNumber: 17
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2706,
          columnNumber: 13
        }, this)
      ) : (
        /* ACTIVE CHAT DIALOGUE SUITE */
        /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-150 rounded-2xl overflow-hidden flex flex-col h-[420px] bg-slate-50 shadow-inner", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-900 p-4 text-white flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black", children: activeScenario.title }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2734,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-350", children: [
                "Đối tác thoại: ",
                /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-400 font-bold", children: activeScenario.character }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2736,
                  columnNumber: 36
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2735,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2733,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveScenario(null),
                className: "text-[10px] text-slate-300 border border-white/20 hover:bg-white/10 px-2.5 py-1 rounded transition-colors",
                children: "Đóng vai khác"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2739,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2732,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
            chatThread.map((msg, idx) => /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
                children: /* @__PURE__ */ jsxDEV("div", { className: `p-3 max-w-[80%] rounded-2xl text-xs shadow-sm leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-150 rounded-tl-none"}`, children: [
                  /* @__PURE__ */ jsxDEV("p", { children: msg.text }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2759,
                    columnNumber: 23
                  }, this),
                  msg.role === "model" && /* @__PURE__ */ jsxDEV("div", { className: "mt-1 pt-1 border-t border-slate-100 text-[10px] text-slate-400 italic", children: "Di chuột lên tin nhắn để xem bản dịch Việt-Anh" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2761,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2754,
                  columnNumber: 21
                }, this)
              },
              idx,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2750,
                columnNumber: 19
              },
              this
            )),
            sendingChat && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-white border border-slate-150 rounded-2xl rounded-tl-none text-xs text-slate-400 italic animate-pulse", children: "Sarah đang gõ tin nhắn trả lời..." }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2771,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2770,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2748,
            columnNumber: 15
          }, this),
          activeScenario.starterSuggestions && /* @__PURE__ */ jsxDEV("div", { className: "bg-white px-4 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap min-h-[40px]", children: activeScenario.starterSuggestions.map((sug, i) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => submitRoleplayMessage(sug),
              className: "text-[10px] bg-slate-100 text-slate-650 hover:bg-indigo-50 border border-slate-150 hover:border-indigo-200 hover:text-indigo-700 px-2.5 py-1 rounded-full cursor-pointer shrink-0 transition-colors",
              children: [
                "💡 ",
                sug
              ]
            },
            i,
            true,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2782,
              columnNumber: 21
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2780,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-3.5 border-t border-slate-200 flex gap-2", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                value: chatInput,
                onChange: (e) => setChatInput(e.target.value),
                placeholder: "Gõ lời thoại phản xạ của bạn bằng tiếng Anh...",
                className: "flex-1 px-3 py-2 border border-slate-250 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550",
                onKeyDown: (e) => e.key === "Enter" && submitRoleplayMessage()
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2795,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => submitRoleplayMessage(),
                disabled: !chatInput.trim() || sendingChat,
                className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer font-bold transition-all",
                children: [
                  "Gửi ",
                  /* @__PURE__ */ jsxDEV(Send, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 2809,
                    columnNumber: 23
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2804,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2794,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2729,
          columnNumber: 13
        }, this)
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 2693,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 2692,
      columnNumber: 9
    }, this),
    activeTab === "tutor" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Phòng Trợ Lý Giáo Viên AI", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-purple-50 border border-purple-150 text-purple-600 font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider", children: "Module 9 • AI Learning Chat Tutor" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2828,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-800", children: "LỚP HỌC TRỢ LÝ GIÁO VIÊN TIẾNG ANH AI" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2831,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 mt-0.5 leading-relaxed", children: "Hỏi đáp bất cứ thắc mắc ngữ pháp, dịch thuật học thuật hoặc sửa bài đoạn văn Writing để giáo viên phân tích chi tiết." }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2832,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2827,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => submitTutorQuery("Giải thích cách dùng các cấu trúc đảo ngữ nâng cao C1 đi kèm ví dụ"),
              className: "text-[10px] bg-purple-50 hover:bg-purple-100 border border-purple-250 hover:border-purple-300 text-purple-700 font-extrabold px-2 py-1 rounded transition-colors cursor-pointer",
              children: "💡 Đảo ngữ C1"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2839,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => submitTutorQuery("Dịch thuật và tóm tắt giúp tôi cụm từ: 'Sustainable resource deployment plan'"),
              className: "text-[10px] bg-purple-50 hover:bg-purple-100 border border-purple-250 hover:border-purple-300 text-purple-700 font-extrabold px-2 py-1 rounded transition-colors cursor-pointer",
              children: "🔬 Dịch thuật học thuật"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2845,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2838,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 2826,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[380px] bg-slate-50 shadow-inner", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-3.5 animate-fade-in", children: [
          tutorHistory.map((item, index) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `flex ${item.role === "user" ? "justify-end" : "justify-start"}`,
              children: /* @__PURE__ */ jsxDEV("div", { className: `p-4 max-w-[85%] rounded-2xl text-xs space-y-1 shadow-sm leading-relaxed ${item.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-150 rounded-tl-none font-sans"}`, children: /* @__PURE__ */ jsxDEV("div", { className: "whitespace-pre-line text-xs font-medium", children: item.text }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2869,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2863,
                columnNumber: 19
              }, this)
            },
            index,
            false,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2859,
              columnNumber: 17
            },
            this
          )),
          sendingTutor && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-white border border-slate-150 rounded-2xl rounded-tl-none text-xs text-slate-400 italic animate-pulse", children: "Cô giáo AI trợ lý đang tra cứu giáo án và dịch thuật văn cảnh..." }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2878,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2877,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2857,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-3 border-t border-slate-200 flex gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: tutorInput,
              onChange: (e) => setTutorInput(e.target.value),
              placeholder: "Dán câu tiếng Anh bị lỗi hoặc thắc mắc ngữ pháp của bạn vào đây...",
              className: "flex-1 px-3 py-2 border border-slate-250 rounded-xl text-xs focus:ring-1 focus:ring-purple-550",
              onKeyDown: (e) => e.key === "Enter" && submitTutorQuery()
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2887,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => submitTutorQuery(),
              disabled: !tutorInput.trim() || sendingTutor,
              className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-indigo-100 font-bold hover:text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all",
              children: [
                "Đặt câu hỏi ",
                /* @__PURE__ */ jsxDEV(Send, { className: "w-3 h-3" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2900,
                  columnNumber: 29
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2895,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2886,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 2854,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 2825,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 2824,
      columnNumber: 9
    }, this),
    activeTab === "exams" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Hệ thống Luyện đề IELTS/TOEIC", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono", children: "🏆 Hệ Thống Quản Lý & Khảo Thí Đồng Bộ" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2920,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(Trophy, { className: "w-5 h-5 text-amber-500 animate-bounce" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2924,
              columnNumber: 19
            }, this),
            " Các kỳ thi của tôi"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2923,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 max-w-xl leading-relaxed", children: "Làm đề ôn tập chính thức chuẩn khảo thí châu Âu CEFR. Mọi dữ liệu câu hỏi, kết quả thi và tiến độ học viên đều được liên kết trực tiếp theo thời gian thực với ban quản trị." }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2926,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2919,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-3 rounded-xl font-mono text-[10px] text-slate-500 self-start md:self-auto", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2931,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Luồng đồng bộ tự động: Live (5s)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2932,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2930,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 2918,
        columnNumber: 13
      }, this),
      loadingExams ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-12 text-center text-xs font-mono text-slate-400 space-y-2", children: [
        /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto text-indigo-500" }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2938,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: "Đang nạp dữ liệu kỳ thi chung từ hệ thống..." }, void 0, false, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2939,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 2937,
        columnNumber: 15
      }, this) : !activeExam ? (
        /* TREE EXAM COVERS LIST FOLDER GROUPING */
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col lg:flex-row gap-6 items-start", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-full lg:w-[280px] shrink-0 bg-white border border-slate-200 p-4.5 rounded-2xl space-y-3 shadow-xs", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "pb-2 border-b border-slate-100 mb-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono", children: "Danh mục CEFR Syllabus" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2948,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-800 uppercase", children: "PHÂN LOẠI KỲ THI" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2949,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2947,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 flex flex-col font-sans", children: [
              { id: "placement", label: "📁 Test đầu vào", count: examsList.filter((ex) => ex.isPlacementTest).length, desc: "Kiểm tra năng lực xếp lớp" },
              { id: "A1", label: "📁 Cấp độ A1", count: examsList.filter((ex) => !ex.isPlacementTest && ex.level === "A1").length, desc: "Giai đoạn 1, 2 & Final Test" },
              { id: "A2", label: "📁 Cấp độ A2", count: examsList.filter((ex) => !ex.isPlacementTest && ex.level === "A2").length, desc: "Sơ cấp trung văn" },
              { id: "B1", label: "📁 Cấp độ B1", count: examsList.filter((ex) => !ex.isPlacementTest && ex.level === "B1").length, desc: "Trung cấp tích hợp chuyên sâu" },
              { id: "B2", label: "📁 Cấp độ B2", count: examsList.filter((ex) => !ex.isPlacementTest && ex.level === "B2").length, desc: "Trung cao cấp phản xạ" },
              { id: "C1", label: "📁 Cấp độ C1", count: examsList.filter((ex) => !ex.isPlacementTest && ex.level === "C1").length, desc: "Cao cấp lưu loát học thuật" },
              { id: "C2", label: "📁 Cấp độ C2", count: examsList.filter((ex) => !ex.isPlacementTest && ex.level === "C2").length, desc: "Thành thạo bản xứ chuyên sâu" }
            ].map((folder) => {
              const isSelected = expandedFolder === folder.id;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setExpandedFolder(folder.id),
                  className: `w-full p-3 rounded-xl text-left transition-all flex items-start justify-between gap-2.5 cursor-pointer border ${isSelected ? "bg-indigo-600 text-white border-transparent shadow" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-extrabold uppercase block leading-tight", children: folder.label }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2974,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] block ${isSelected ? "text-indigo-200" : "text-slate-400"}`, children: folder.desc }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 2975,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2973,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] py-0.5 px-2 rounded-full font-black ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`, children: folder.count }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 2977,
                      columnNumber: 27
                    }, this)
                  ]
                },
                folder.id,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2964,
                  columnNumber: 25
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2952,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2946,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 w-full space-y-4 font-sans", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxDEV(FolderOpen, { className: "w-5 h-5 text-indigo-500 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2991,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-left animate-fade-in", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black uppercase text-slate-800 tracking-wide", children: [
                  "Khung bài thi đang mở: ",
                  expandedFolder === "placement" ? "Test năng lực đầu vào học viên" : `Chương trình cấp độ CEFR ${expandedFolder}`
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2993,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[10.5px] text-slate-500 font-mono", children: "Chỉ hiển thị các kỳ thi đã kích hoạt Xuất bản (status = published)" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 2998,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 2992,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2990,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 2989,
              columnNumber: 19
            }, this),
            (() => {
              const filteredExams = examsList.filter((ex) => {
                if (expandedFolder === "placement") {
                  return ex.isPlacementTest;
                } else {
                  return !ex.isPlacementTest && ex.level === expandedFolder;
                }
              });
              if (filteredExams.length === 0) {
                return /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-2xl py-12 px-6 text-center space-y-2 w-full", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-3xl block filter grayscale opacity-60", children: "📁" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3016,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-black text-slate-700 uppercase", children: "Thư mục trống" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3017,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed", children: "Hiện chưa có đề khảo thí nào trong thư mục này được Admin biên tập hoặc phát hành. Vui lòng quay lại sau!" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3018,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3015,
                  columnNumber: 25
                }, this);
              }
              return /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 w-full", children: filteredExams.map((ex) => {
                const previousAttempts = examsResults.filter((r) => r.examId === ex.id);
                const previousCount = previousAttempts.length;
                const hasExceededAttempts = ex.maxAttempts !== void 0 && ex.maxAttempts !== -1 && previousCount >= ex.maxAttempts;
                const isScheduledOpen = ex.openTime ? /* @__PURE__ */ new Date() >= new Date(ex.openTime) : true;
                const isScheduledClose = ex.closeTime ? /* @__PURE__ */ new Date() <= new Date(ex.closeTime) : true;
                const isAccessibleTime = isScheduledOpen && isScheduledClose;
                const canTakeExam = isAccessibleTime && !hasExceededAttempts;
                const passThreshold = ex.passingScore || 50;
                const hasPassed = previousAttempts.some((r) => (r.scorePercent || 0) >= passThreshold);
                const maxScorePct = previousAttempts.length > 0 ? Math.max(...previousAttempts.map((r) => r.scorePercent || 0)) : null;
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-350 transition-all shadow-sm relative overflow-hidden",
                    children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-1 rounded-lg", children: hasPassed ? /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase", children: [
                        /* @__PURE__ */ jsxDEV(Check, { className: "w-3 h-3 text-emerald-600 font-bold" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3052,
                          columnNumber: 37
                        }, this),
                        " Đạt yêu cầu"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3051,
                        columnNumber: 35
                      }, this) : previousCount > 0 ? /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 text-[9px] bg-rose-50 border border-rose-200 text-rose-700 font-extrabold px-2 py-0.5 rounded-full uppercase", children: [
                        /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-3 h-3 text-rose-600" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3056,
                          columnNumber: 37
                        }, this),
                        " Chưa Đạt"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3055,
                        columnNumber: 35
                      }, this) : /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 text-[9px] bg-slate-50 border border-slate-200 text-slate-500 font-extrabold px-2 py-0.5 rounded-full uppercase", children: "⏳ Đang chờ thi" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3059,
                        columnNumber: 35
                      }, this) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3049,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 text-left", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-50 border border-indigo-150 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase font-mono", children: ex.isPlacementTest ? "Test Đầu Vào" : `CEFR ${ex.level || "Cấp Độ"}` }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3068,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-slate-50 border border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded font-mono", children: [
                              "Giai đoạn: ",
                              ex.phase || "Full"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3071,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3067,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 leading-snug uppercase tracking-tight block pt-1 mr-24 text-left", children: ex.title }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3075,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 leading-relaxed text-left line-clamp-2 italic pt-0.5", children: ex.description || "Hãy hoàn thành bộ câu hỏi trực tiếp để củng cố năng lực ngôn ngữ." }, void 0, false, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3078,
                            columnNumber: 35
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3066,
                          columnNumber: 33
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2.5 rounded-xl font-mono border border-slate-150 text-left", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-extrabold block uppercase", children: "⏱ THỜI LƯỢNG" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3086,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-700 text-xs", children: [
                              ex.durationMinutes,
                              " phút làm bài"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3087,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3085,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-extrabold block uppercase", children: "📋 CẤU TRÚC" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3090,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-700 text-xs", children: [
                              ex.sections?.length || 0,
                              " mục / câu hỏi"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3091,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3089,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5 border-t border-slate-200/50 pt-2 col-span-2", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-extrabold block uppercase", children: "📊 ĐIỂM CHUẨN ĐẠT" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3094,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-755 text-xs text-indigo-700 font-bold", children: [
                              "Từ ",
                              passThreshold,
                              "% số câu chính xác trở lên"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3095,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3093,
                            columnNumber: 35
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3084,
                          columnNumber: 33
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] pt-1 pl-1 text-slate-600 font-mono text-left", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxDEV(Trophy, { className: "w-3.5 h-3.5 text-indigo-500 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3102,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { children: [
                              "Lần thi: ",
                              /* @__PURE__ */ jsxDEV("strong", { children: [
                                previousCount,
                                "/",
                                ex.maxAttempts === -1 || !ex.maxAttempts ? "∞" : ex.maxAttempts
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                                lineNumber: 3103,
                                columnNumber: 52
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3103,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3101,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxDEV(Award, { className: "w-3.5 h-3.5 text-amber-500 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3106,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { children: [
                              "Điểm cao nhất: ",
                              /* @__PURE__ */ jsxDEV("strong", { children: maxScorePct !== null ? `${maxScorePct}%` : "Chưa lưu" }, void 0, false, {
                                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                                lineNumber: 3107,
                                columnNumber: 58
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3107,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3105,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxDEV(Users, { className: "w-3.5 h-3.5 text-sky-500 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3110,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { children: [
                              "Đã tham gia: ",
                              /* @__PURE__ */ jsxDEV("strong", { children: [
                                ex.participantsCount || 0,
                                " học viên"
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                                lineNumber: 3111,
                                columnNumber: 56
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3111,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3109,
                            columnNumber: 35
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3114,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { children: [
                              "Tỷ lệ đạt chung: ",
                              /* @__PURE__ */ jsxDEV("strong", { children: [
                                ex.passRate || 100,
                                "%"
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                                lineNumber: 3115,
                                columnNumber: 60
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3115,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3113,
                            columnNumber: 35
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3100,
                          columnNumber: 33
                        }, this),
                        (ex.openTime || ex.closeTime) && /* @__PURE__ */ jsxDEV("div", { className: "text-[9px] text-slate-400 flex flex-col pt-1.5 italic leading-tight pl-1 text-left border-t border-slate-100", children: [
                          ex.openTime && /* @__PURE__ */ jsxDEV("span", { children: [
                            "• Thời hạn mở: ",
                            new Date(ex.openTime).toLocaleString("vi-VN")
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3122,
                            columnNumber: 53
                          }, this),
                          ex.closeTime && /* @__PURE__ */ jsxDEV("span", { children: [
                            "• Hạn nộp cuối: ",
                            new Date(ex.closeTime).toLocaleString("vi-VN")
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3123,
                            columnNumber: 54
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3121,
                          columnNumber: 35
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3065,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => {
                            if (!canTakeExam) return;
                            setActiveExam(ex);
                            setExamAnswers({});
                            setExamResult(null);
                            setExamTimeLeft(ex.durationMinutes * 60);
                          },
                          disabled: !canTakeExam,
                          className: `w-full py-2.5 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm transition-all text-center uppercase tracking-wider flex items-center justify-center gap-2 ${canTakeExam ? "bg-indigo-600 hover:bg-indigo-700 active:translate-y-0.5" : "bg-slate-200 text-slate-450 border border-slate-300 cursor-not-allowed"}`,
                          children: !isAccessibleTime ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                            /* @__PURE__ */ jsxDEV(Lock, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3145,
                              columnNumber: 37
                            }, this),
                            "Chưa mở hoặc đã hết hạn nộp"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3144,
                            columnNumber: 35
                          }, this) : hasExceededAttempts ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                            /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3150,
                              columnNumber: 37
                            }, this),
                            "Hết số lượt cho phép (",
                            ex.maxAttempts,
                            ")"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3149,
                            columnNumber: 35
                          }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                            /* @__PURE__ */ jsxDEV(Play, { className: "w-3 h-3 text-white fill-current shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                              lineNumber: 3155,
                              columnNumber: 37
                            }, this),
                            "Bắt đầu làm bài thi ngay ➔"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                            lineNumber: 3154,
                            columnNumber: 35
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3128,
                          columnNumber: 31
                        },
                        this
                      )
                    ]
                  },
                  ex.id,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3044,
                    columnNumber: 29
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3026,
                columnNumber: 23
              }, this);
            })()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 2987,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 2943,
          columnNumber: 15
        }, this)
      ) : (
        /* ACTIVE EXAM PLAYGROUND WORKING SESSION WITH COUNTDOWN */
        /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono", children: [
                "Đề thi chính thức: ",
                activeExam.type
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3176,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-900 block mt-1", children: activeExam.title }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3179,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3175,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: closeExamMockSession,
                className: "px-3 py-1.5 border border-slate-300 hover:bg-white text-slate-600 rounded-lg text-xs cursor-pointer",
                children: "Hủy bỏ rời phòng thi"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3181,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 3174,
            columnNumber: 15
          }, this),
          !examResult ? (
            /* EXAM SHEETS SECTIONS QUESTION ELEMENT ROW */
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
              activeExam.sections?.map((sec, idx) => /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between border-b border-slate-100 pb-1.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-indigo-600 uppercase tracking-widest", children: sec.name }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3198,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono", children: [
                        "Phần ",
                        idx + 1
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3199,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 3197,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold text-slate-800 leading-relaxed", children: sec.prompt }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 3203,
                      columnNumber: 23
                    }, this),
                    sec.passage && /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-justify font-serif italic max-h-[140px] overflow-y-auto leading-relaxed", children: sec.passage }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 3205,
                      columnNumber: 25
                    }, this),
                    sec.options ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2", children: sec.options.map((opt) => {
                      const isSelected = examAnswers[idx] === opt.charAt(0);
                      return /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleAnswerExamSection(idx, opt.charAt(0)),
                          className: `p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${isSelected ? "bg-indigo-50 border-indigo-400 font-semibold text-indigo-950" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"}`,
                          children: opt
                        },
                        opt,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3216,
                          columnNumber: 31
                        },
                        this
                      );
                    }) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                      lineNumber: 3212,
                      columnNumber: 25
                    }, this) : (
                      /* Essay textarea or speaking simulation box depending on section type */
                      /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: /* @__PURE__ */ jsxDEV(
                        "textarea",
                        {
                          rows: 4,
                          placeholder: sec.placeholderText || "Viết câu trả lời luận của bạn bằng tiếng Anh...",
                          value: examAnswers[idx] || "",
                          onChange: (e) => handleAnswerExamSection(idx, e.target.value),
                          className: "w-full p-3.5 border border-slate-250 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                          lineNumber: 3233,
                          columnNumber: 27
                        },
                        this
                      ) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                        lineNumber: 3232,
                        columnNumber: 25
                      }, this)
                    )
                  ]
                },
                idx,
                true,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3193,
                  columnNumber: 21
                },
                this
              )),
              /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => performSubmitExamMock(),
                  disabled: submittingExam,
                  className: "w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl text-xs font-black tracking-wide shadow transition-all cursor-pointer text-center",
                  children: submittingExam ? "ĐANG ĐỒNG BỘ ĐÁNH GIÁ CHẤM THI CHUYÊN SÂU..." : "NỘP BÀI THI LÊN HỘI ĐỒNG CHẤM AI ✨"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3247,
                  columnNumber: 21
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3246,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3191,
              columnNumber: 17
            }, this)
          ) : (
            /* EXAM RESULT DEEP ANALYTICS REPORT DISPLAY */
            /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950 text-white rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3259,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-center py-4 space-y-1 block border-b border-white/10", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-3xl text-center", children: "🏆" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3262,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("h5", { className: "text-xs uppercase text-slate-300 font-mono", children: "Bản phân tích điểm thi thử điện tử" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3263,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-black text-white", children: activeExam.title }, void 0, false, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3264,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3261,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-3 rounded-xl border border-white/10", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400 uppercase", children: "Ước tính điểm số" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3270,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-emerald-400", children: activeExam.type === "IELTS" ? `Band ${examResult.estimatedBand}` : `${examResult.estimatedBand}đ TOEIC` }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3271,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3269,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-3 rounded-xl border border-white/10", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400 uppercase", children: "Trắc nghiệm Đúng" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3277,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-sky-400", children: [
                    examResult.correctCount,
                    " / ",
                    examResult.totalCount
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3278,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3276,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-3 rounded-xl border border-white/10", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400 uppercase", children: "Tỷ lệ chính xác" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3284,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-amber-500", children: [
                    examResult.scorePercent,
                    "%"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3285,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3283,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-3 rounded-xl border border-white/10", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400 uppercase", children: "Thưởng khuyến khích" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3289,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-rose-300", children: "+50 XP" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3290,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3288,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3268,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 bg-white/5 p-4 rounded-xl border border-white/10", children: [
                /* @__PURE__ */ jsxDEV("h6", { className: "text-xs font-black text-white uppercase flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV(Info, { className: "w-3.5 h-3.5 text-indigo-400" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3297,
                    columnNumber: 23
                  }, this),
                  " Ý KIẾN CHUẨN ĐOÁN CỦA GIÁM KHẢO AI CLINICS:"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3296,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-205 leading-relaxed text-justify italic font-serif leading-relaxed text-slate-200", children: [
                  '"',
                  examResult.detailedReport,
                  '"'
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                  lineNumber: 3299,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3295,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "pt-2 flex flex-col sm:flex-row gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      const totalAttempts = examsResults.filter((r) => r.examId === activeExam.id).length;
                      if (activeExam.maxAttempts !== void 0 && activeExam.maxAttempts !== -1 && totalAttempts >= activeExam.maxAttempts) {
                        alert(`Bạn không thể thi lại vì đã dùng hết số lượt cho phép (${activeExam.maxAttempts} lượt) cho đề thi này.`);
                        return;
                      }
                      setExamAnswers({});
                      setExamResult(null);
                    },
                    className: "flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black tracking-wide text-center cursor-pointer transition-colors border border-indigo-500",
                    children: "🔄 THI LẠI BÀI KHẢO SÁT"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3306,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: closeExamMockSession,
                    className: "flex-1 py-2.5 bg-white text-indigo-950 hover:bg-slate-100 rounded-xl text-xs font-black tracking-wide text-center cursor-pointer transition-colors",
                    children: "Quay trở về danh sách đề thi"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                    lineNumber: 3321,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3305,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3258,
              columnNumber: 17
            }, this)
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
          lineNumber: 3171,
          columnNumber: 15
        }, this)
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 2915,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 2914,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: completedToastTask && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
        transition: { type: "spring", stiffness: 300, damping: 25 },
        className: "fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-4 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white flex items-start gap-3 justify-between overflow-hidden",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" }, void 0, false, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 3352,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full w-9 h-9 shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-emerald-400", children: /* @__PURE__ */ jsxDEV(Check, { className: "w-5 h-5 stroke-[3]" }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3356,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3355,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1 text-left min-w-0 space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black inline-block", children: "Nhiệm vụ Hoàn thành! 🎯" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3360,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-black truncate leading-snug", children: completedToastTask.title }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3363,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-300 leading-normal line-clamp-1", children: "Đúng chỉ tiêu thực tế hệ thống đề xuất!" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3366,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3359,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 3354,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex flex-col items-end justify-between h-full min-h-[44px]", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "bg-yellow-450 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5 whitespace-nowrap", children: [
              /* @__PURE__ */ jsxDEV(Zap, { className: "w-3 h-3 fill-current animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3374,
                columnNumber: 17
              }, this),
              "+",
              completedToastTask.xpReward || 15,
              " XP"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
              lineNumber: 3373,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setCompletedToastTask(null),
                className: "text-[10px] text-slate-400 hover:text-white underline font-semibold transition-colors mt-2 cursor-pointer",
                children: "Đóng"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
                lineNumber: 3377,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
            lineNumber: 3372,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
        lineNumber: 3344,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
      lineNumber: 3342,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModulePracticeAddons.tsx",
    lineNumber: 975,
    columnNumber: 5
  }, this);
}
