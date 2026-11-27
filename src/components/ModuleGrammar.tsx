import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import {
  Sparkles,
  BookOpen,
  Zap,
  Bookmark,
  FileText,
  CheckCircle,
  TrendingUp,
  Send,
  Info,
  Check,
  Play,
  Pause,
  ChevronRight,
  AlertCircle,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LessonResultView } from "/src/components/LessonResultView.tsx";
import { checkAndCompleteActiveTask } from "/src/utils/roadmapProgressManager.ts";
export default function ModuleGrammar({ user, onUserUpdate, defaultLevel }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel || "A1");
  useEffect(() => {
    if (defaultLevel) {
      setSelectedLevel(defaultLevel);
    }
  }, [defaultLevel]);
  const [topics, setTopics] = useState([]);
  const [srsCards, setSrsCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [studyTab, setStudyTab] = useState("textbook");
  const [lectureStep, setLectureStep] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [lectureWarmupAns, setLectureWarmupAns] = useState("");
  const [lectureWarmupSubmitted, setLectureWarmupSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState([]);
  const [tutorMessages, setTutorMessages] = useState([]);
  const [tutorQuery, setTutorQuery] = useState("");
  const [sendingQuery, setSendingQuery] = useState(false);
  const [activeSrsReview, setActiveSrsReview] = useState([]);
  const [srsReviewIdx, setSrsReviewIdx] = useState(0);
  const [srsFlipped, setSrsFlipped] = useState(false);
  const [srsAnswered, setSrsAnswered] = useState(false);
  const [srsSelectedOpt, setSrsSelectedOpt] = useState("");
  const [isReviewingSrs, setIsReviewingSrs] = useState(false);
  const [srsIsCorrect, setSrsIsCorrect] = useState(false);
  const loadData = async () => {
    setLoading(true);
    try {
      const headers = { "x-user-id": user.id };
      const topicsRes = await fetch("/api/grammar/topics", { headers });
      const topicsData = await topicsRes.json();
      if (topicsData.success) {
        setTopics(topicsData.topics);
      }
      const srsRes = await fetch("/api/grammar/srs", { headers });
      const srsData = await srsRes.json();
      if (srsData.success) {
        setSrsCards(srsData.allCards || []);
        setActiveSrsReview(srsData.dueCards || []);
      }
    } catch (e) {
      console.error("Failed to load grammar masteries", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [user.id, activeTab]);
  const totalTopics = topics.length;
  const completedTopicsCount = topics.filter((t) => t.completed).length;
  const progressPercent = totalTopics > 0 ? Math.round(completedTopicsCount / totalTopics * 100) : 0;
  const scoreFiltered = topics.filter((t) => t.completed && typeof t.score === "number");
  const overallAccuracy = scoreFiltered.length > 0 ? Math.round(scoreFiltered.reduce((acc, t) => acc + (t.score || 0), 0) / scoreFiltered.length) : 0;
  const getLevelStats = (lvl) => {
    const levelTopics = topics.filter((t) => t.level === lvl);
    const completed = levelTopics.filter((t) => t.completed).length;
    const total = levelTopics.length;
    const percent = total > 0 ? Math.round(completed / total * 100) : 0;
    return { completed, total, percent };
  };
  const isLevelUnlocked = (lvl) => {
    const studentLevel = user.level || "A1";
    const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const studentIdx = cefrLevels.indexOf(studentLevel) !== -1 ? cefrLevels.indexOf(studentLevel) : 0;
    let targetIdx = 0;
    if (lvl === "A1") targetIdx = 0;
    else if (lvl === "A2") targetIdx = 1;
    else if (lvl === "B1") targetIdx = 2;
    else if (lvl === "B2") targetIdx = 3;
    else if (lvl === "C1-C2" || lvl === "C1" || lvl === "C2") targetIdx = 4;
    return targetIdx <= studentIdx;
  };
  const handleSelectTopic = async (topicId) => {
    try {
      setLoading(true);
      const headers = { "x-user-id": user.id };
      const res = await fetch(`/api/grammar/topic/${topicId}`, { headers });
      const data = await res.json();
      if (data.success) {
        setCurrentTopic(data.topic);
        setStudyTab("textbook");
        setLectureStep(0);
        setPlayingAudio(false);
        setLectureWarmupAns("");
        setLectureWarmupSubmitted(false);
        setIncorrectAnswersCount(0);
        setCorrectAnswersCount(0);
        setCurrentQuestionIdx(0);
        setSelectedAns("");
        setIsAnswered(false);
        setShowResults(false);
        setExplanationText("");
        setQuestions(data.topic.lessonData.questions || []);
        setTutorMessages([
          { role: "model", text: `Chào bạn! Tôi là thày giáo **AI Grammar Tutor**. Tôi rành rọt mọi góc khuất về chủ điểm **${data.topic.title}**. Bạn hãy cứ nhấn hỏi tôi bất cứ thắc mắc gì trong bài hôm nay nhé! 📚` }
        ]);
      }
    } catch (e) {
      console.error("Failed to fetch detailed topic", e);
    } finally {
      setLoading(false);
    }
  };
  const handleGenerateQuestions = async () => {
    if (!currentTopic) return;
    setGeneratingQuestions(true);
    setGenerationProgress(0);
    setGenerationError("");
    let currentProgress = 0;
    const intervalId = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(intervalId);
      }
      setGenerationProgress(currentProgress);
    }, 200);
    try {
      const headers = {
        "x-user-id": user.id,
        "Content-Type": "application/json"
      };
      const res = await fetch("/api/grammar/generate-questions", {
        method: "POST",
        headers,
        body: JSON.stringify({ topicId: currentTopic.id })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Lỗi máy chủ sinh đề (Mã phản hồi: ${res.status})`);
      }
      const data = await res.json();
      clearInterval(intervalId);
      if (data.success && data.questions && data.questions.length > 0) {
        setGenerationProgress(100);
        setTimeout(() => {
          setQuestions(data.questions);
          setCurrentQuestionIdx(0);
          setSelectedAns("");
          setIsAnswered(false);
          setIncorrectAnswersCount(0);
          setCorrectAnswersCount(0);
          setShowResults(false);
          setGenerationProgress(0);
        }, 500);
      } else {
        throw new Error(data.error || "Hệ thống AI không định hình được dạng đề hợp chuẩn.");
      }
    } catch (e) {
      clearInterval(intervalId);
      console.error("Errored AI question generation", e);
      setGenerationError(e.message || "Gặp sự cố kết nối trong quá trình tạo đề AI.");
      setGenerationProgress(0);
    } finally {
      setGeneratingQuestions(false);
    }
  };
  const handleToggleChecklist = async (idx) => {
    if (!currentTopic) return;
    const nextChecklist = [...currentTopic.checklistState];
    nextChecklist[idx] = !nextChecklist[idx];
    try {
      const headers = {
        "x-user-id": user.id,
        "Content-Type": "application/json"
      };
      const res = await fetch("/api/grammar/progress/submit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          topicId: currentTopic.id,
          checklistState: nextChecklist
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentTopic((prev) => prev ? { ...prev, checklistState: nextChecklist } : null);
        setTopics((prev) => prev.map((t) => t.id === currentTopic.id ? { ...t, checklistState: nextChecklist } : t));
      }
    } catch (e) {
      console.error("Error setting progress", e);
    }
  };
  const handleSubmitAnswer = async () => {
    if (isAnswered) return;
    setIsAnswered(true);
    const question = questions[currentQuestionIdx];
    let correct = false;
    if (question.type === "multiple_choice") {
      correct = selectedAns === question.correctAnswer;
    } else {
      const userNorm = selectedAns.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const answerNorm = question.correctAnswer.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      correct = userNorm === answerNorm;
    }
    if (correct) {
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setIncorrectAnswersCount((prev) => prev + 1);
      try {
        const headers = {
          "x-user-id": user.id,
          "Content-Type": "application/json"
        };
        await fetch("/api/grammar/srs/add", {
          method: "POST",
          headers,
          body: JSON.stringify({
            topicId: currentTopic.id,
            topicTitle: currentTopic.title || currentTopic.name || "",
            question: question.question,
            options: question.options || [],
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || "",
            userAnswer: selectedAns,
            type: question.type || "pick_one",
            source: "grammar_practice_mistake"
          })
        });
      } catch (err) {
        console.error("Failed to automatically append srs failure card", err);
      }
    }
  };
  const handleNextQuestion = () => {
    setSelectedAns("");
    setIsAnswered(false);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };
  const handleCompleteQuiz = async () => {
    const accuracyScore = Math.round(correctAnswersCount / questions.length * 100);
    const completedVal = accuracyScore >= 60;
    const oldUnlocked = user.unlockedAchievements || [];
    try {
      const headers = {
        "x-user-id": user.id,
        "Content-Type": "application/json"
      };
      const res = await fetch("/api/grammar/progress/submit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          topicId: currentTopic.id,
          completed: completedVal,
          score: accuracyScore
        })
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = data.user || {
          ...user,
          xp: (user.xp || 0) + (completedVal && !currentTopic.completed ? 120 : 0)
        };
        const postUnlocked = updatedUser.unlockedAchievements || [];
        const freshUnlockIds = postUnlocked.filter((id) => !oldUnlocked.includes(id));
        const ACHIEVEMENTS_DEFINITIONS = [
          { id: "first_login", title: "Khởi đầu vinh quang", desc: "Tạo tài khoản và tham gia cộng đồng", xpReward: 50, emoji: "🐣" },
          { id: "test_completed", title: "Thợ săn trình độ", desc: "Hoàn thiện bài thi thử đầu vào từ 30 câu hỏi trở lên", xpReward: 100, emoji: "🎯" },
          { id: "practice_completed", title: "Chuyên cần bền bỉ", desc: "Hoàn thành 3 bài học luyện tập bất kỳ", xpReward: 150, emoji: "📚" },
          { id: "perfect_score", title: "Tuyệt đỉnh điểm số", desc: "Trả lời đúng 10/10 bài học kiểm tra", xpReward: 200, emoji: "🪐" },
          { id: "streak_3days", title: "Ngọn lửa bốc cháy", desc: "Duy trì chuỗi học liên tiếp tối thiểu 3 ngày", xpReward: 250, emoji: "🔥" }
        ];
        const newlyBadges = freshUnlockIds.map((id) => ACHIEVEMENTS_DEFINITIONS.find((a) => a.id === id)).filter(Boolean);
        setNewlyUnlockedAchievements(newlyBadges);
        onUserUpdate(updatedUser);
        try {
          await checkAndCompleteActiveTask("grammar");
        } catch (err) {
          console.warn("Failed to auto-complete grammar task:", err);
        }
        setShowResults(true);
        loadData();
      }
    } catch (e) {
      console.error("Failed submitting final progress stats", e);
    }
  };
  const handleSendTutorMessage = async () => {
    if (!tutorQuery.trim() || sendingQuery) return;
    const userText = tutorQuery.trim();
    setTutorQuery("");
    setSendingQuery(true);
    const newMessages = [...tutorMessages, { role: "user", text: userText }];
    setTutorMessages(newMessages);
    try {
      const activeQText = questions[currentQuestionIdx] ? `Đặt câu hỏi liên hệ: "${questions[currentQuestionIdx].question}" (Đáp án đúng: ${questions[currentQuestionIdx].correctAnswer})` : "";
      const headers = {
        "x-user-id": user.id,
        "Content-Type": "application/json"
      };
      const res = await fetch("/api/grammar/tutor", {
        method: "POST",
        headers,
        body: JSON.stringify({
          topicId: currentTopic.id,
          message: userText,
          questionContext: activeQText,
          chatHistory: newMessages.slice(-5)
          // Send some history
        })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setTutorMessages([...newMessages, { role: "model", text: data.answer }]);
      }
    } catch (e) {
      console.error("Tutor channel failure", e);
    } finally {
      setSendingQuery(false);
    }
  };
  const startSrsReview = () => {
    const uncompleted = srsCards.filter((c) => c.status !== "mastered");
    if (uncompleted.length === 0) return;
    setActiveSrsReview(uncompleted);
    setSrsReviewIdx(0);
    setSrsSelectedOpt("");
    setSrsAnswered(false);
    setSrsFlipped(false);
    setIsReviewingSrs(true);
  };
  const handleVerifySrsAnswer = () => {
    const card = activeSrsReview[srsReviewIdx];
    const isMultipleChoice = card.type === "multiple_choice" || card.options && card.options.length > 0;
    let correct = false;
    if (isMultipleChoice) {
      const normalizedSelected = srsSelectedOpt.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const normalizedCorrect = card.correctAnswer.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      correct = normalizedSelected === normalizedCorrect;
      if (!correct && srsSelectedOpt.length === 1) {
        const optionMatched = card.options.find((opt) => opt.trim().toLowerCase().startsWith(srsSelectedOpt.toLowerCase()));
        if (optionMatched) {
          const optNorm = optionMatched.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          correct = optNorm === normalizedCorrect;
        }
      }
      if (!correct) {
        correct = card.options.some((opt) => {
          const optNorm = opt.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          return srsSelectedOpt.trim().toLowerCase() === optNorm && opt === card.correctAnswer;
        });
      }
    } else {
      const userNorm = srsSelectedOpt.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const answerNorm = card.correctAnswer.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      correct = userNorm === answerNorm;
    }
    setSrsIsCorrect(correct);
    setSrsAnswered(true);
  };
  const handleNextSrsCard = async () => {
    const card = activeSrsReview[srsReviewIdx];
    try {
      const headers = {
        "x-user-id": user.id,
        "Content-Type": "application/json"
      };
      await fetch("/api/grammar/srs/submit-review", {
        method: "POST",
        headers,
        body: JSON.stringify({
          cardId: card.id,
          isCorrect: srsIsCorrect
        })
      });
    } catch (e) {
      console.error("Failed submitting srs review resolution", e);
    }
    setSrsAnswered(false);
    setSrsSelectedOpt("");
    if (srsReviewIdx < activeSrsReview.length - 1) {
      setSrsReviewIdx((prev) => prev + 1);
    } else {
      setIsReviewingSrs(false);
      setActiveSrsReview([]);
      loadData();
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-50 text-slate-800 font-sans pb-16", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-800 text-white shadow-lg overflow-hidden relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80')] bg-cover bg-center" }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
        lineNumber: 546,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-6", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10 mb-3 transition-all scroll-smooth", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-yellow-300 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 551,
                columnNumber: 17
              }, this),
              "Lộ trình Cá nhân hóa CEFR Standard"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 550,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-extrabold tracking-tight font-sans", children: "Grammar Mastery 🇬🇧" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 554,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-violet-100 mt-2 text-sm max-w-2xl font-sans font-medium line-clamp-2", children: "Nắm vững toàn diện ngữ pháp từ A1 đến C2 qua bài giảng sinh động, hệ thống lặp lại khoảng cách SRS tinh tế và Gia sư AI hỗ trợ 24/7." }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 557,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "mt-3 text-xs text-yellow-250 font-semibold leading-relaxed bg-white/10 px-4.5 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm inline-block", children: [
              "Lộ trình được cá nhân hóa dựa trên kết quả Placement Test của học sinh. Hiện tại bạn đang ở trình độ CEFR: ",
              /* @__PURE__ */ jsxDEV("strong", { className: "text-yellow-400 font-extrabold uppercase", children: user.level || "A1" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 561,
                columnNumber: 124
              }, this),
              "."
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 560,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 549,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 sm:gap-6 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "block text-xl md:text-2xl font-black text-yellow-300", children: [
                progressPercent,
                "%"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 568,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase tracking-wider text-violet-100 font-sans font-bold", children: "Tiến trình" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 569,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 567,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-px bg-white/10 align-middle" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 571,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "block text-xl md:text-2xl font-black text-emerald-300", children: [
                overallAccuracy,
                "%"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 573,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase tracking-wider text-violet-100 font-sans font-bold", children: "Độ chính xác" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 574,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 572,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-px bg-white/10" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 576,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "block text-xl md:text-2xl font-black text-pink-300", children: activeSrsReview.length }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 578,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase tracking-wider text-violet-100 font-sans font-bold", children: "Cần ôn (SRS)" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 579,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 577,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 566,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 548,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 border-t border-white/10 mt-8 pt-4 overflow-x-auto", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setActiveTab("dashboard");
                setCurrentTopic(null);
              },
              className: `px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "dashboard" && !currentTopic ? "bg-white text-indigo-900 shadow-md scale-[1.02]" : "text-white/80 hover:bg-white/10"}`,
              children: "📊 Dashboard Ngữ Pháp"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 586,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setActiveTab("learn");
                setCurrentTopic(null);
              },
              className: `px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "learn" && !currentTopic ? "bg-white text-indigo-900 shadow-md scale-[1.02]" : "text-white/80 hover:bg-white/10"}`,
              children: "📖 Lộ trình Học CEFR"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 596,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setActiveTab("srs");
                setCurrentTopic(null);
              },
              className: `px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${activeTab === "srs" && !currentTopic ? "bg-white text-indigo-900 shadow-md scale-[1.02]" : "text-white/80 hover:bg-white/10"}`,
              children: [
                "🔄 Ôn tập SRS",
                activeSrsReview.length > 0 && /* @__PURE__ */ jsxDEV("span", { className: "absolute -top-1.5 -right-1 px-1.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full animate-bounce", children: activeSrsReview.length }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 616,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 606,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 585,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
        lineNumber: 547,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
      lineNumber: 545,
      columnNumber: 7
    }, this),
    currentTopic ? (
      // ==========================================
      // DEDICATED CLASSROOM/LESSON HUB
      // ==========================================
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setCurrentTopic(null),
            className: "inline-flex items-center gap-2 mb-6 text-slate-500 hover:text-slate-800 text-xs font-bold bg-white px-3.5 py-2 rounded-xl shadow-sm border border-slate-200 transition-all cursor-pointer",
            children: "← Quay lại Lộ Trình học"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 631,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 font-sans", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold rounded-full mr-2", children: [
              "Level ",
              currentTopic.level
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 642,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-black text-slate-800 mt-2 flex items-center gap-2 font-sans", children: currentTopic.title }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 645,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-sm italic mt-1 font-sans font-medium", children: [
              "👉 ",
              currentTopic.englishTitle
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 648,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 641,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 font-sans", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setStudyTab("textbook"),
                className: `px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${studyTab === "textbook" ? "bg-white text-violet-750 shadow-sm" : "text-slate-600 hover:text-slate-800"}`,
                children: "📗 Sách Bài Giảng"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 653,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setStudyTab("lecture"),
                className: `px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${studyTab === "lecture" ? "bg-white text-violet-750 shadow-sm" : "text-slate-600 hover:text-slate-800"}`,
                children: "🎬 Video AI Giảng"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 661,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setStudyTab("practice"),
                className: `px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${studyTab === "practice" ? "bg-white text-violet-750 shadow-sm" : "text-slate-600 hover:text-slate-800"}`,
                children: "✍️ Luyện Tập Khắc Sâu"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 669,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setStudyTab("tutor"),
                className: `px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${studyTab === "tutor" ? "bg-white text-violet-750 shadow-sm" : "text-slate-600 hover:text-slate-800"}`,
                children: "🤖 Hỏi AI Tutor"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 677,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 652,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 640,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 639,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: [
            studyTab === "textbook" && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "space-y-6 font-sans",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 703,
                        columnNumber: 25
                      }, this),
                      "Giới Thiệu Chủ Điểm"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 702,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 leading-relaxed text-sm font-sans whitespace-pre-line font-medium", children: currentTopic.lessonData.introduction }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 706,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 701,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(Bookmark, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 714,
                        columnNumber: 25
                      }, this),
                      "Cách Dùng Cốt Lõi"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 713,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 leading-relaxed text-sm font-sans whitespace-pre-line font-medium", children: currentTopic.lessonData.usage }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 717,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 712,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(FileText, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 725,
                        columnNumber: 25
                      }, this),
                      "Cấu trúc & Công thức chuẩn"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 724,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: currentTopic.lessonData.structures.map((str, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-xl font-sans", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-indigo-600 uppercase tracking-widest", children: str.type }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 731,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "font-mono text-sm bg-indigo-50 border border-indigo-100 text-indigo-950 p-2.5 rounded-lg mt-2 mb-2 font-bold select-all", children: str.formula }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 732,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "text-xs space-y-1 mt-1 font-sans", children: [
                        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-800", children: [
                          "🇬🇧 En: ",
                          /* @__PURE__ */ jsxDEV("strong", { className: "font-semibold", children: str.exampleEn }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 736,
                            columnNumber: 70
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 736,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500", children: [
                          "🇻🇳 Vi: ",
                          str.exampleVi
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 737,
                          columnNumber: 31
                        }, this),
                        str.details && /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-pink-700 mt-2 italic", children: [
                          "📌 Phân tích: ",
                          str.details
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 738,
                          columnNumber: 47
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 735,
                        columnNumber: 29
                      }, this)
                    ] }, idx, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 730,
                      columnNumber: 27
                    }, this)) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 728,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 723,
                    columnNumber: 21
                  }, this),
                  currentTopic.lessonData.rules && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(Zap, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 749,
                        columnNumber: 27
                      }, this),
                      "Quy tắc mầm mống & Dấu hiệu nhận biết"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 748,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 leading-relaxed text-sm font-sans whitespace-pre-line font-medium", children: currentTopic.lessonData.rules }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 752,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 747,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 text-rose-700 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-5 h-5" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 761,
                        columnNumber: 25
                      }, this),
                      "Lỗi kinh điển người Việt hay mắc"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 760,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: currentTopic.lessonData.commonMistakes.map((mistake, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-4 rounded-xl border border-rose-100 bg-rose-50/40 font-sans", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-2", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-rose-100/70 text-rose-900 border border-rose-200 rounded-lg", children: [
                          /* @__PURE__ */ jsxDEV("strong", { children: "Sai ❌:" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 769,
                            columnNumber: 33
                          }, this),
                          " ",
                          mistake.incorrect
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 768,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-emerald-100/70 text-emerald-900 border border-emerald-200 rounded-lg font-bold", children: [
                          /* @__PURE__ */ jsxDEV("strong", { children: "Đúng ✅:" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 772,
                            columnNumber: 33
                          }, this),
                          " ",
                          mistake.correct
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 771,
                          columnNumber: 31
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 767,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-rose-950 font-sans leading-normal font-medium mt-1", children: [
                        /* @__PURE__ */ jsxDEV("strong", { children: "Phân tích lý do:" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 776,
                          columnNumber: 31
                        }, this),
                        " ",
                        mistake.explanation
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 775,
                        columnNumber: 29
                      }, this)
                    ] }, idx, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 766,
                      columnNumber: 27
                    }, this)) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 764,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 759,
                    columnNumber: 21
                  }, this),
                  currentTopic.lessonData.comparison && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 787,
                        columnNumber: 27
                      }, this),
                      "So sánh cấu trúc & Sự tương phản"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 786,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 leading-relaxed text-sm font-sans whitespace-pre-line font-medium bg-slate-50 p-4 rounded-xl border border-slate-200", children: currentTopic.lessonData.comparison }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 790,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 785,
                    columnNumber: 23
                  }, this),
                  currentTopic.lessonData.mindmap && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-1.5 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 800,
                        columnNumber: 27
                      }, this),
                      "Sơ đồ tư duy / Tóm tắt siêu nhớ"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 799,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-750 leading-relaxed text-xs font-mono whitespace-pre-line bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/70 font-medium", children: currentTopic.lessonData.mindmap }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 803,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 798,
                    columnNumber: 23
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 694,
                columnNumber: 19
              },
              this
            ),
            studyTab === "lecture" && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans space-y-6",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-black text-slate-800 flex items-center gap-2 font-sans", children: "🎬 Video Bài Giảng AI Độc Quyền" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 819,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-sans font-medium mt-1", children: "Hệ thống Slide giải nghĩa đa chiều cùng AI Avatar giảng dạy mượt mà." }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 822,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 818,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 aspect-video rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-inner border border-slate-800 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 828,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center relative z-10 text-[10px] tracking-wider text-violet-300 font-mono font-bold", children: [
                      /* @__PURE__ */ jsxDEV("span", { children: [
                        "LEARNING NODE: ",
                        currentTopic.id.toUpperCase()
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 832,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 834,
                          columnNumber: 27
                        }, this),
                        "AI EXPLAINING LIVE"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 833,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 831,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "text-center max-w-lg mx-auto relative z-10 my-auto py-4", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black uppercase tracking-widest text-emerald-400", children: currentTopic.lessonData.lectureSteps[lectureStep].title }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 841,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-base sm:text-lg font-black tracking-tight mt-2 text-violet-100 font-sans", children: currentTopic.lessonData.lectureSteps[lectureStep].text }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 844,
                        columnNumber: 25
                      }, this),
                      lectureStep === 3 && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 p-3 bg-white/10 rounded-xl max-w-sm mx-auto border border-white/15 text-left font-sans text-xs", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-yellow-300", children: "⚡ Mini Warmup:" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 850,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-100 mt-1", children: [
                          "Điền mạo từ hoặc chia động từ: ",
                          /* @__PURE__ */ jsxDEV("strong", { children: "He _____ (not live) in Hanoi." }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 851,
                            columnNumber: 95
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 851,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 mt-2", children: [
                          /* @__PURE__ */ jsxDEV(
                            "input",
                            {
                              type: "text",
                              value: lectureWarmupAns,
                              onChange: (e) => setLectureWarmupAns(e.target.value),
                              placeholder: "Gõ câu trả lời...",
                              disabled: lectureWarmupSubmitted,
                              className: "bg-slate-950/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white max-w-[150px] outline-none"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                              lineNumber: 853,
                              columnNumber: 31
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "button",
                            {
                              onClick: () => setLectureWarmupSubmitted(true),
                              disabled: lectureWarmupSubmitted,
                              className: "px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer",
                              children: lectureWarmupSubmitted ? "Có lý!" : "Kiểm tra"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                              lineNumber: 861,
                              columnNumber: 31
                            },
                            this
                          )
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 852,
                          columnNumber: 29
                        }, this),
                        lectureWarmupSubmitted && /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-emerald-300 mt-1.5 font-medium", children: [
                          "Đáp án chính xác là: ",
                          /* @__PURE__ */ jsxDEV("strong", { children: "doesn't live / does not live" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 871,
                            columnNumber: 54
                          }, this),
                          ". Giỏi lắm!"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 870,
                          columnNumber: 31
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 849,
                        columnNumber: 27
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 840,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-t border-white/10 pt-4 relative z-10 font-sans", children: [
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setPlayingAudio(!playingAudio),
                          className: "p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all cursor-pointer shadow",
                          children: playingAudio ? /* @__PURE__ */ jsxDEV(Pause, { className: "w-4 h-4" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 884,
                            columnNumber: 43
                          }, this) : /* @__PURE__ */ jsxDEV(Play, { className: "w-4 h-4" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 884,
                            columnNumber: 75
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 880,
                          columnNumber: 25
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 mx-4 h-1.5 bg-white/20 rounded-full overflow-hidden self-center", children: /* @__PURE__ */ jsxDEV(
                        "div",
                        {
                          className: "bg-indigo-500 h-full transition-all duration-300",
                          style: { width: `${(lectureStep + 1) / 4 * 100}%` }
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 889,
                          columnNumber: 27
                        },
                        this
                      ) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 888,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono", children: [
                        lectureStep + 1,
                        " / 4"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 896,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 879,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 826,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-2 font-sans", children: currentTopic.lessonData.lectureSteps.map((step, idx) => /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => {
                        setLectureStep(idx);
                        setLectureWarmupSubmitted(false);
                        setLectureWarmupAns("");
                      },
                      className: `p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${lectureStep === idx ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-150"}`,
                      children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "block font-black text-[10px] text-slate-450 uppercase mb-0.5", children: [
                          "Bước ",
                          idx + 1
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 916,
                          columnNumber: 27
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { className: "font-bold line-clamp-1", children: step.title }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 917,
                          columnNumber: 27
                        }, this)
                      ]
                    },
                    idx,
                    true,
                    {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 903,
                      columnNumber: 25
                    },
                    this
                  )) }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 901,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 812,
                columnNumber: 19
              },
              this
            ),
            studyTab === "practice" && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans space-y-6",
                children: !showResults ? /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-250 pb-4 mb-4", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-black text-slate-800 flex items-center gap-1.5", children: "✍️ Phòng Luyện Đề Khắc Sâu" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 936,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-sans font-medium mt-1", children: "Xác lập đỉnh cao chính xác dựa trên danh mục lỗi hay gặp." }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 939,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 935,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-end gap-1 font-sans", children: /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: handleGenerateQuestions,
                        disabled: generatingQuestions,
                        className: "inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-black rounded-xl shadow transition-all cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 949,
                            columnNumber: 31
                          }, this),
                          generatingQuestions ? `Đang Sinh Đề (${generationProgress}%)...` : "Sinh Thêm Câu Hỏi Bằng AI"
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 944,
                        columnNumber: 29
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 943,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 934,
                    columnNumber: 25
                  }, this),
                  generatingQuestions && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] font-bold text-slate-550 font-sans", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 960,
                          columnNumber: 33
                        }, this),
                        "Đang khởi tạo bộ đề mới từ Gemini AI..."
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 959,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-indigo-700", children: [
                        generationProgress,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 963,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 958,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "w-full h-1.5 bg-slate-150 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        className: "h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300 ease-out",
                        style: { width: `${generationProgress}%` }
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 966,
                        columnNumber: 31
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 965,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 957,
                    columnNumber: 27
                  }, this),
                  generationError && /* @__PURE__ */ jsxDEV("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs font-bold text-red-750 font-sans", children: [
                    "❌ Lỗi: ",
                    generationError
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 975,
                    columnNumber: 27
                  }, this),
                  questions.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 font-sans", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[11px] font-bold text-slate-500", children: [
                      /* @__PURE__ */ jsxDEV("span", { children: [
                        "Câu ",
                        currentQuestionIdx + 1,
                        " / ",
                        questions.length
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 984,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200 text-[10px]", children: [
                        incorrectAnswersCount,
                        " lỗi sai"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 985,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 983,
                      columnNumber: 29
                    }, this),
                    questions[currentQuestionIdx].passage && /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-amber-50/50 border border-amber-200 text-slate-800 rounded-2xl text-xs leading-relaxed max-h-[160px] overflow-y-auto mb-4 font-sans font-medium", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-amber-900 block mb-1", children: "📖 Reading Comprehension Passage:" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 993,
                        columnNumber: 33
                      }, this),
                      questions[currentQuestionIdx].passage
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 992,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl font-sans", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md mr-1.5 uppercase tracking-wide", children: questions[currentQuestionIdx].type.replace("_", " ") }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1e3,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-slate-800 text-sm font-black inline mt-1 leading-relaxed", children: questions[currentQuestionIdx].question }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1003,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 999,
                      columnNumber: 29
                    }, this),
                    questions[currentQuestionIdx].type === "multiple_choice" ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 font-sans", children: questions[currentQuestionIdx].options.map((opt, oIdx) => {
                      const letter = opt.trim().substring(0, 1);
                      const optionIsSelected = selectedAns === letter;
                      return /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => {
                            if (!isAnswered) setSelectedAns(letter);
                          },
                          disabled: isAnswered,
                          className: `p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${optionIsSelected ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-extrabold shadow-sm scale-[1.01]" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"}`,
                          children: [
                            /* @__PURE__ */ jsxDEV("span", { className: `w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black border-2 flex-shrink-0 mt-0.5 ${optionIsSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 text-slate-500"}`, children: letter }, void 0, false, {
                              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                              lineNumber: 1026,
                              columnNumber: 39
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "leading-tight font-sans mt-0.5", children: opt }, void 0, false, {
                              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                              lineNumber: 1033,
                              columnNumber: 39
                            }, this)
                          ]
                        },
                        oIdx,
                        true,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1016,
                          columnNumber: 37
                        },
                        this
                      );
                    }) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1010,
                      columnNumber: 31
                    }, this) : (
                      // Free text entry
                      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 font-sans text-xs", children: [
                        /* @__PURE__ */ jsxDEV("label", { className: "font-extrabold text-slate-700 block text-[11px]", children: "Nhập đáp án chính xác tiếng Anh (Viết thường):" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1041,
                          columnNumber: 33
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          "input",
                          {
                            type: "text",
                            value: selectedAns,
                            onChange: (e) => setSelectedAns(e.target.value),
                            placeholder: "Gõ đáp án tiếng Anh vào đây...",
                            disabled: isAnswered,
                            className: "w-full bg-slate-50 border border-slate-250 text-xs rounded-xl px-4 py-3 outline-none text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-bold"
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 1042,
                            columnNumber: 33
                          },
                          this
                        ),
                        questions[currentQuestionIdx].type === "sort_sentence" && /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 font-medium", children: "💡 Gợi ý: Hãy xếp toàn bộ các từ của đề bài, viết liền mạch cách nhau bởi một phím cách." }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1051,
                          columnNumber: 35
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1040,
                        columnNumber: 31
                      }, this)
                    ),
                    isAnswered && /* @__PURE__ */ jsxDEV("div", { className: `p-4.5 rounded-2xl border text-xs font-sans leading-relaxed flex gap-3 ${selectedAns === questions[currentQuestionIdx].correctAnswer || selectedAns.trim().toLowerCase() === questions[currentQuestionIdx].correctAnswer.trim().toLowerCase() ? "bg-emerald-50 border-emerald-250 text-emerald-950" : "bg-rose-50 border-rose-250 text-rose-950"}`, children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "p-1 px-2.5 rounded-lg text-white font-black bg-slate-800 text-[10px] self-start mt-0.5", children: selectedAns === questions[currentQuestionIdx].correctAnswer || selectedAns.trim().toLowerCase() === questions[currentQuestionIdx].correctAnswer.trim().toLowerCase() ? "ĐÚNG!" : "CHƯA ĐÚNG!" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1064,
                        columnNumber: 33
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsxDEV("p", { className: "font-bold", children: [
                          "ĐÁP ÁN: ",
                          /* @__PURE__ */ jsxDEV("strong", { className: "font-semibold", children: questions[currentQuestionIdx].correctAnswer }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 1070,
                            columnNumber: 68
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1070,
                          columnNumber: 35
                        }, this),
                        /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-slate-650 font-medium", children: questions[currentQuestionIdx].explanation }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1071,
                          columnNumber: 35
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1069,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1058,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-3 font-sans pt-4 border-t", children: [
                      questions[currentQuestionIdx].hint && !isAnswered && /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          type: "button",
                          onClick: () => alert(`Gợi ý chuẩn: ${questions[currentQuestionIdx].hint}`),
                          className: "px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                          children: "Xem Gợi Ý 💡"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1079,
                          columnNumber: 33
                        },
                        this
                      ),
                      !isAnswered ? /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          type: "button",
                          onClick: handleSubmitAnswer,
                          disabled: !selectedAns,
                          className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-300 text-white text-xs font-black rounded-xl shadow transition-all cursor-pointer",
                          children: "Nộp Đáp Án"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1089,
                          columnNumber: 33
                        },
                        this
                      ) : /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          type: "button",
                          onClick: handleNextQuestion,
                          className: "px-5 py-2.5 bg-slate-850 hover:bg-slate-950 text-white text-xs font-black rounded-xl shadow transition-all cursor-pointer inline-flex items-center gap-1",
                          children: currentQuestionIdx < questions.length - 1 ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                            "Tiếp theo",
                            /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3.5 h-3.5" }, void 0, false, {
                              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                              lineNumber: 1106,
                              columnNumber: 39
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 1104,
                            columnNumber: 37
                          }, this) : "Kết Thúc Bài Luyện"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1098,
                          columnNumber: 33
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1077,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 981,
                    columnNumber: 27
                  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12", children: [
                    /* @__PURE__ */ jsxDEV(Info, { className: "w-12 h-12 text-slate-350 mx-auto mb-3" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1115,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-slate-700", children: "Chưa tải được mảng câu hỏi." }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1116,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 mt-1", children: "Vui lòng click sinh câu hỏi bằng AI ở góc trên nhé!" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1117,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1114,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 932,
                  columnNumber: 23
                }, this) : (
                  // Display Results Screen
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
                    /* @__PURE__ */ jsxDEV(
                      LessonResultView,
                      {
                        title: "Luyện Tập Ngữ Pháp Hoàn Tất!",
                        subtitle: "Hệ thống học tập thông minh dựa trên AI bài tập cá nhân hoá",
                        correctAnswers: correctAnswersCount,
                        totalQuestions: questions.length,
                        xpEarned: correctAnswersCount / questions.length >= 0.6 ? 120 : 0,
                        streakDays: user.streakDays || 1,
                        passed: correctAnswersCount / questions.length >= 0.6,
                        achievementsUnlocked: newlyUnlockedAchievements,
                        ctaText: generatingQuestions ? "Đang Sinh Đề..." : "Học Đề AI Mới ✨",
                        onCtaClick: handleGenerateQuestions,
                        secondaryCtaText: "Thi Lại Đề Này",
                        onSecondaryCtaClick: () => {
                          setCurrentQuestionIdx(0);
                          setIncorrectAnswersCount(0);
                          setCorrectAnswersCount(0);
                          setSelectedAns("");
                          setIsAnswered(false);
                          setShowResults(false);
                        }
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1124,
                        columnNumber: 25
                      },
                      this
                    ),
                    generatingQuestions && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 mt-4 text-center font-sans", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] font-bold text-slate-550", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" }, void 0, false, {
                            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                            lineNumber: 1151,
                            columnNumber: 33
                          }, this),
                          "Đang khởi tạo đề mới từ Gemini API..."
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1150,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-indigo-700", children: [
                          generationProgress,
                          "%"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1154,
                          columnNumber: 31
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1149,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200", children: /* @__PURE__ */ jsxDEV(
                        "div",
                        {
                          className: "h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300 ease-out",
                          style: { width: `${generationProgress}%` }
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1157,
                          columnNumber: 31
                        },
                        this
                      ) }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1156,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1148,
                      columnNumber: 27
                    }, this),
                    generationError && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs font-bold text-red-705 whitespace-pre-line font-sans", children: [
                      "❌ Lỗi: ",
                      generationError
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1166,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1123,
                    columnNumber: 23
                  }, this)
                )
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 925,
                columnNumber: 19
              },
              this
            ),
            studyTab === "tutor" && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans flex flex-col h-[520px]",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b pb-3 mb-4", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "p-1 px-2.5 bg-rose-500 text-white text-[10px] font-black rounded-lg", children: "LIVE" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1185,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-extrabold text-slate-800 font-sans", children: "English Grammar Tutor 🎓" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1186,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1184,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono", children: "MODEL: GEMINI-3.5-FLASH" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1188,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1183,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto space-y-4 mb-4 pr-1 text-xs leading-relaxed font-sans scrollbar-thin", children: [
                    tutorMessages.map((msg, idx) => /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        className: `flex ${msg.role === "user" ? "justify-end" : "justify-start animate-fade-in"}`,
                        children: /* @__PURE__ */ jsxDEV("div", { className: `p-3.5 rounded-2xl max-w-[85%] border shadow-sm font-sans font-medium whitespace-pre-line ${msg.role === "user" ? "bg-slate-850 border-slate-900 text-white text-right" : "bg-slate-50 border-slate-200 text-slate-800 text-left"}`, children: msg.text }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1198,
                          columnNumber: 27
                        }, this)
                      },
                      idx,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1194,
                        columnNumber: 25
                      },
                      this
                    )),
                    sendingQuery && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxDEV("div", { className: "p-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-bold flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1210,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1211,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1212,
                        columnNumber: 29
                      }, this),
                      "AI Thầy giáo đang gõ phản hồi liên hệ..."
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1209,
                      columnNumber: 27
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1208,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1192,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 font-sans border-t pt-3", children: [
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        type: "text",
                        value: tutorQuery,
                        onChange: (e) => setTutorQuery(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") handleSendTutorMessage();
                        },
                        disabled: sendingQuery,
                        placeholder: "Hãy hỏi thày: Tại sao lại chuyển như vậy? Cài đặt này sai ở đâu?...",
                        className: "flex-1 bg-slate-50 border border-slate-250 rounded-xl px-4 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-400"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1221,
                        columnNumber: 23
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: handleSendTutorMessage,
                        disabled: sendingQuery || !tutorQuery.trim(),
                        className: "px-4.5 bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-300 text-white rounded-xl shadow flex items-center justify-center transition-all cursor-pointer duration-300",
                        children: /* @__PURE__ */ jsxDEV(Send, { className: "w-4 h-4" }, void 0, false, {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1235,
                          columnNumber: 25
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1230,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1220,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1176,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 692,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 691,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 font-sans", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-slate-800 mb-3 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1248,
                  columnNumber: 19
                }, this),
                "Mục Tiêu Nắm Vững"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1247,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 font-medium mb-4 leading-normal", children: "Đánh dấu chọn các kỹ năng bên dưới sau khi đọc sách bài giảng và thực hành." }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1251,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: currentTopic.lessonData.checklist.map((item, idx) => {
                const isChecked = currentTopic.checklistState[idx];
                return /* @__PURE__ */ jsxDEV(
                  "label",
                  {
                    className: `flex items-start gap-2.5 p-3.5 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-indigo-50/40 border-indigo-200 text-indigo-900" : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          type: "checkbox",
                          checked: isChecked,
                          onChange: () => handleToggleChecklist(idx),
                          className: "w-4 h-4 text-indigo-600 mt-0.5 pointer-events-none rounded outline-none"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                          lineNumber: 1267,
                          columnNumber: 25
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] leading-tight font-bold font-sans", children: item }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1273,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  idx,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1259,
                    columnNumber: 23
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1255,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1246,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 font-sans", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-slate-800 mb-3", children: "💡 Câu Hỏi Gợi Ý Nhanh" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1284,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-550 mb-3 font-semibold", children: "Bấm vào câu hỏi dưới để thày giáo AI giải nghĩa ngay:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1285,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-[10.5px] font-bold font-sans", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      setStudyTab("tutor");
                      setTutorQuery("Giải thích cho tôi các ngoại lệ của bài này.");
                    },
                    className: "w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-700 cursor-pointer",
                    children: "❓ Giải thích các ngoại lệ đặc biệt?"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1287,
                    columnNumber: 19
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      setStudyTab("tutor");
                      setTutorQuery("Tôi hay nhầm đuôi bài này, có mẹo nào phát âm chuẩn không?");
                    },
                    className: "w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-700 cursor-pointer",
                    children: "❓ Mẹo tránh lỗi phát âm hay quên chia?"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1296,
                    columnNumber: 19
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      setStudyTab("tutor");
                      setTutorQuery("Hãy liệt kê thêm cho tôi 5 cặp so sánh thực tế.");
                    },
                    className: "w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-700 cursor-pointer",
                    children: "❓ Tạo 5 câu so sánh thực tế?"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1305,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1286,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1283,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1244,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 690,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
        lineNumber: 629,
        columnNumber: 9
      }, this)
    ) : activeTab === "dashboard" ? (
      // ==========================================
      // DYNAMIC GRAMMAR SYSTEM DASHBOARD
      // ==========================================
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans space-y-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 font-sans", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans md:col-span-2 space-y-6", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-800 flex items-center gap-1.5 pb-2 border-b", children: [
              /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1330,
                columnNumber: 17
              }, this),
              "Quang cảnh Năng Lực Ngữ Pháp"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1329,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-emerald-950 flex items-center gap-1", children: "💪 Điểm Mạnh Đã Chinh Phục" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1337,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("ul", { className: "mt-3.5 space-y-2 text-emerald-900 font-bold font-sans", children: topics.filter((t) => t.completed && (t.score || 0) >= 80).length > 0 ? topics.filter((t) => t.completed && (t.score || 0) >= 80).map((t) => /* @__PURE__ */ jsxDEV("li", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5 text-emerald-600" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1344,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "line-clamp-1", children: [
                    t.title,
                    " (",
                    t.score,
                    "%)"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1345,
                    columnNumber: 27
                  }, this)
                ] }, t.id, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1343,
                  columnNumber: 25
                }, this)) : /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 font-medium", children: "Chưa có chủ điểm đạt trên 80% độ chính xác." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1349,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1340,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1336,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-amber-50/50 border border-amber-100 rounded-2xl", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-amber-950 flex items-center gap-1", children: "⚠️ Điểm Yếu Cần Rèn Luyện" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1356,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("ul", { className: "mt-3.5 space-y-2 text-amber-900 font-bold font-sans", children: topics.filter((t) => t.completed && (t.score || 0) < 80).length > 0 ? topics.filter((t) => t.completed && (t.score || 0) < 80).map((t) => /* @__PURE__ */ jsxDEV("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1363,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "line-clamp-1", children: [
                    t.title,
                    " (",
                    t.score || 0,
                    "%)"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1364,
                    columnNumber: 27
                  }, this)
                ] }, t.id, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1362,
                  columnNumber: 25
                }, this)) : /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 font-medium", children: "Chưa phát hiện điểm yếu học tập nào đáng kể." }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1368,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1359,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1355,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1334,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-xs font-sans", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between font-bold text-slate-700", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "Tiến độ hoàn thiện CEFR Syllabus:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1377,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: [
                  completedTopicsCount,
                  " / ",
                  totalTopics,
                  " Chủ đề"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1378,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1376,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-2.5 bg-slate-105 border rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-600 h-full transition-all duration-500", style: { width: `${progressPercent}%` } }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1381,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1380,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1375,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1328,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-950/20 font-sans flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "px-2.5 py-0.5 bg-yellow-400 text-slate-900 font-extrabold rounded-md text-[10px] uppercase", children: "Spaced Repetition System" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1389,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black tracking-tight mt-3 text-slate-105", children: "Hộp Ôn Ngữ Pháp SRS" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1390,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-200 mt-2 font-medium leading-relaxed font-sans", children: "Thuật toán SRS tự động lựa lọc các câu bạn làm sai và lên lịch ôn tập sau 1 ngày, 3 ngày, 7 ngày đến 30 ngày để lưu vào trí nhớ dài hạn." }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1391,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1388,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pt-4 border-t border-white/10 font-sans mt-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-200 font-bold", children: "Thẻ cần ôn hôm nay:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1398,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "px-2 py-0.5 bg-indigo-500 rounded-md font-black", children: activeSrsReview.length }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1399,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1397,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setActiveTab("srs"),
                  disabled: activeSrsReview.length === 0,
                  className: "w-full py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-750 disabled:text-slate-500 text-slate-900 justify-center font-black rounded-xl text-xs transition-all shadow cursor-pointer flex items-center gap-1",
                  children: activeSrsReview.length > 0 ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    "Bắt đầu ôn ngay",
                    /* @__PURE__ */ jsxDEV(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1410,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1408,
                    columnNumber: 21
                  }, this) : "Đã dọn sạch thẻ ôn 🎉"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1402,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1396,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1387,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 1325,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b pb-4 mb-4", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800", children: "📖 Các Cấp Độ Học" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1421,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveTab("learn"),
                className: "text-xs font-bold text-indigo-600 hover:underline",
                children: "Xem chi tiết lộ trình →"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1422,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1420,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3 font-sans text-xs", children: ["A1", "A2", "B1", "B2", "C1-C2"].map((lvl) => {
            const stats = getLevelStats(lvl);
            const unlocked = isLevelUnlocked(lvl);
            const studentLevel = user.level || "A1";
            const isCurrent = lvl === "C1-C2" ? studentLevel === "C1" || studentLevel === "C2" : studentLevel === lvl;
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  if (unlocked) {
                    setSelectedLevel(lvl);
                    setActiveTab("learn");
                  } else {
                    alert(`Cấp độ ${lvl} đang bị khóa. Bạn hãy hoàn thành bài kiểm tra đầu vào (Placement Test) để mở khóa level này nhé!`);
                  }
                },
                title: unlocked ? void 0 : "Hoàn thành Placement Test để mở khóa level này",
                className: `p-4 rounded-xl text-center border-2 transition-all relative ${unlocked ? isCurrent ? "bg-violet-600 border-violet-600 text-white hover:bg-violet-700 cursor-pointer shadow-md" : "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 cursor-pointer shadow-sm" : "bg-slate-50 border-slate-200 text-slate-450 opacity-60 cursor-not-allowed"}`,
                children: [
                  isCurrent && /* @__PURE__ */ jsxDEV("span", { className: "absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[9px] font-black shadow-sm uppercase tracking-wider whitespace-nowrap", children: "Current Level" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1460,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center items-center gap-1.5 mt-1", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-sm uppercase", children: lvl }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1465,
                      columnNumber: 23
                    }, this),
                    !unlocked && /* @__PURE__ */ jsxDEV(Lock, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1466,
                      columnNumber: 37
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1464,
                    columnNumber: 21
                  }, this),
                  unlocked ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 mt-1.5", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: `block text-[10px] font-bold ${isCurrent ? "text-violet-100" : "text-violet-600/80"}`, children: [
                      "Đã học ",
                      stats.completed,
                      "/",
                      stats.total,
                      " (",
                      stats.percent,
                      "%)"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1470,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: `inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${isCurrent ? "bg-white/20 text-white" : "bg-violet-100 text-violet-800"}`, children: "Unlocked" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1473,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1469,
                    columnNumber: 23
                  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 mt-1.5", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400 font-semibold text-center", children: "Hoàn thành bài Test..." }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1479,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "inline-block text-[9px] font-extrabold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase", children: "Locked" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1480,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1478,
                    columnNumber: 23
                  }, this)
                ]
              },
              lvl,
              true,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1440,
                columnNumber: 19
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1430,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 1419,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
        lineNumber: 1323,
        columnNumber: 9
      }, this)
    ) : activeTab === "learn" ? (
      // ==========================================
      // SYLLABUS LESSON SELECTION VIEW
      // ==========================================
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 p-1.5 bg-slate-200/85 rounded-2xl border border-slate-300 max-w-md", children: ["A1", "A2", "B1", "B2", "C1-C2"].map((lvl) => {
          const unlocked = isLevelUnlocked(lvl);
          const active = selectedLevel === lvl;
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                if (unlocked) {
                  setSelectedLevel(lvl);
                } else {
                  alert(`Trình độ ${lvl} chưa được mở khóa. Vui lòng hoàn thành bài kiểm tra đầu vào (Placement Test) để mở khóa level này nhé!`);
                }
              },
              title: unlocked ? void 0 : "Hoàn thành Placement Test để mở khóa level này",
              className: `flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${active ? "bg-violet-600 text-white shadow-md scale-[1.02]" : unlocked ? "text-violet-700 bg-white/50 hover:bg-white hover:text-violet-850 cursor-pointer" : "text-slate-400 bg-slate-100/50 cursor-not-allowed opacity-60"}`,
              children: /* @__PURE__ */ jsxDEV("span", { className: "flex items-center justify-center gap-1", children: [
                lvl,
                !unlocked && /* @__PURE__ */ jsxDEV(Lock, { className: "w-2.5 h-2.5 text-slate-400" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1522,
                  columnNumber: 35
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1520,
                columnNumber: 19
              }, this)
            },
            lvl,
            false,
            {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1502,
              columnNumber: 17
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 1497,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 font-sans", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-850 flex items-center gap-2", children: [
            "🏆 Trình độ ",
            selectedLevel
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1531,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-555 mt-1 font-sans font-medium", children: [
            selectedLevel === "A1" && "Nền tảng căn bản cho người mới bắt đầu: Động từ To Be, danh từ số nhiều, đại từ và thì thời đơn sơ.",
            selectedLevel === "A2" && "Chuyển giao tiền trung cấp: Quá khứ đơn, so sánh hơn/nhất, và câu điều kiện nền tảng.",
            selectedLevel === "B1" && "Giao tiếp độc lập tự tin: Quá khứ tiếp diễn, câu bị động, gián tiếp, và các thì nâng cao.",
            selectedLevel === "B2" && "Sử dụng lưu loát học thuật: Đảo ngữ, câu chẻ, mệnh đề quan hệ và động từ khuyết thiếu cao cấp.",
            selectedLevel === "C1-C2" && "Văn phong học thuật sắc sảo: Thức giả định, cấu trúc nhấn mạnh, rút gọn mệnh đề phân từ."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1534,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 1530,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans", children: topics.filter((t) => t.level === selectedLevel).map((topic) => /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between font-sans hover:shadow-md transition-all duration-300 group",
            children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-3", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "px-2.5 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-md text-[10px] font-black uppercase", children: "Topic" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1552,
                    columnNumber: 21
                  }, this),
                  topic.completed ? /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-xs text-emerald-600 font-black", children: [
                    /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1557,
                      columnNumber: 25
                    }, this),
                    "Đã đạt ",
                    topic.score,
                    "%"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1556,
                    columnNumber: 23
                  }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-semibold", children: "Chưa hoàn thành" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1561,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1551,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors", children: topic.title }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1565,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 italic font-mono mb-2", children: topic.englishTitle }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1568,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-xs mt-1 leading-normal font-sans font-medium line-clamp-2", children: topic.description }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1569,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1550,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "pt-4 border-t border-slate-100/80 mt-4 flex items-center justify-between font-sans", children: [
                topic.lastStudied && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-semibold font-sans", children: [
                  "Học gần nhất: ",
                  new Date(topic.lastStudied).toLocaleDateString()
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1576,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => handleSelectTopic(topic.id),
                    className: "px-4 py-2 bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ml-auto",
                    children: "Bắt đầu học →"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1580,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1574,
                columnNumber: 17
              }, this)
            ]
          },
          topic.id,
          true,
          {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1546,
            columnNumber: 15
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 1544,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
        lineNumber: 1495,
        columnNumber: 9
      }, this)
    ) : (
      // ==========================================
      // SRS STUDY MODULE WITH COMPLETE LIST of ERROR & INTERACTIVE PRACTICE
      // ==========================================
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-xl mx-auto px-4 py-8 font-sans space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-center font-sans", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black text-slate-850", children: "🔄 Sân Ôn Spaced Repetition (SRS)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1597,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 mt-1 font-medium font-sans", children: "Hệ thống tự động lưu các câu làm sai khi luyện ngữ pháp để ôn tập lại." }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1598,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleGrammar.tsx",
          lineNumber: 1596,
          columnNumber: 11
        }, this),
        !isReviewingSrs ? (
          // ==========================================
          // VIEW 1: ERROR LIST & INTRO DASHBOARD
          // ==========================================
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: srsCards.filter((c) => c.status !== "mastered").length > 0 ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50 border border-indigo-150 p-4.5 rounded-2xl flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-indigo-600 text-white rounded-xl", children: /* @__PURE__ */ jsxDEV(Zap, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1610,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1609,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-indigo-950 uppercase tracking-wider", children: "Hệ Thống Lặp Khoảng Cách (SRS)" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1613,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-indigo-850 font-medium leading-relaxed mt-0.5", children: [
                  "Bạn đang có ",
                  /* @__PURE__ */ jsxDEV("strong", { className: "font-bold", children: [
                    srsCards.filter((c) => c.status !== "mastered").length,
                    " câu hỏi"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1615,
                    columnNumber: 37
                  }, this),
                  " đã trả lời chưa chính xác. Bạn cần hoàn thành ôn tập đúng để nâng cao phản xạ ngữ pháp."
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1614,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1612,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1608,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-500 uppercase tracking-widest px-1", children: "Danh Sách Lỗi Sai Đã Mắc:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1621,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 max-h-[360px] overflow-y-auto pr-1", children: srsCards.filter((c) => c.status !== "mastered").map((card, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] font-black tracking-wide text-slate-400", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase", children: [
                    "#",
                    idx + 1,
                    " • ",
                    card.topicTitle || "Luyện ngữ pháp"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1626,
                    columnNumber: 29
                  }, this),
                  card.type && /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md uppercase", children: card.type.replace("_", " ") }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1630,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1625,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold text-slate-800 leading-relaxed font-sans pt-0.5", children: card.question }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1636,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-medium pt-1 border-t border-slate-50", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-rose-50/50 border border-rose-100/70 rounded-xl text-rose-950", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold block text-[9px] uppercase tracking-wide text-rose-600 mb-0.5", children: "❌ Đã chọn sai:" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1642,
                      columnNumber: 31
                    }, this),
                    card.userAnswer || "Chưa lưu trạng thái"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1641,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-emerald-50/50 border border-emerald-100/70 rounded-xl text-emerald-950", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold block text-[9px] uppercase tracking-wide text-emerald-600 mb-0.5", children: "✅ Đáp án đúng:" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1646,
                      columnNumber: 31
                    }, this),
                    card.correctAnswer
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1645,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1640,
                  columnNumber: 27
                }, this),
                card.explanation && /* @__PURE__ */ jsxDEV("p", { className: "text-[10.5px] text-slate-500 italic font-medium pt-1 font-sans", children: [
                  "💡 ",
                  /* @__PURE__ */ jsxDEV("strong", { children: "Giải thích:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1653,
                    columnNumber: 34
                  }, this),
                  " ",
                  card.explanation
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1652,
                  columnNumber: 29
                }, this)
              ] }, card.id, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1624,
                columnNumber: 25
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1622,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1620,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: startSrsReview,
                className: "w-full py-4 bg-indigo-600 hover:bg-indigo-750 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider",
                children: [
                  /* @__PURE__ */ jsxDEV(Play, { className: "w-4 h-4 fill-white" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1667,
                    columnNumber: 23
                  }, this),
                  " Bắt Đầu Ôn Tập (",
                  srsCards.filter((c) => c.status !== "mastered").length,
                  " Câu)"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1663,
                columnNumber: 21
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1662,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1607,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200 font-sans space-y-4", children: [
            /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-14 h-14 text-emerald-500 mx-auto" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1673,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-slate-800", children: "Cây SRS Sạch Sẽ!" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1675,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans font-medium", children: "Tuyệt vời! Bạn không còn bất kỳ một lỗi sai ngữ pháp nào cần ôn tập hôm nay. Hãy tiếp tục học bài mới để tăng tốc phản xạ nhé!" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1676,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1674,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveTab("learn"),
                className: "px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all duration-300",
                children: "Học bài mới thôi 📖"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1680,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1672,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1605,
            columnNumber: 13
          }, this)
        ) : (
          // ==========================================
          // VIEW 2: ACTIVE RE-PRACTICING TEST CANVAS
          // ==========================================
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 font-sans", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs text-slate-500 font-bold px-1 select-none", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "uppercase tracking-widest text-[10px]", children: "ĐANG ÔN LẠI LỖI SAI" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1695,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Câu ",
                srsReviewIdx + 1,
                " / ",
                activeSrsReview.length
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1696,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1694,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-slate-200 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "bg-indigo-600 h-full transition-all duration-300",
                style: { width: `${srsReviewIdx / activeSrsReview.length * 100}%` }
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1701,
                columnNumber: 17
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1700,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-3xl p-5 shadow-md border border-slate-200 font-sans space-y-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-slate-400 font-black", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-100 px-2 py-0.5 rounded-md uppercase", children: [
                  "CHỦ ĐIỂM: ",
                  activeSrsReview[srsReviewIdx].topicTitle || "Luyện tập ngữ pháp"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1710,
                  columnNumber: 19
                }, this),
                activeSrsReview[srsReviewIdx].type && /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md uppercase tracking-wider", children: activeSrsReview[srsReviewIdx].type.replace("_", " ") }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1714,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1709,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-black text-slate-800 leading-relaxed pt-1 select-all", children: activeSrsReview[srsReviewIdx].question }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1721,
                columnNumber: 17
              }, this),
              activeSrsReview[srsReviewIdx].type === "multiple_choice" || activeSrsReview[srsReviewIdx].options && activeSrsReview[srsReviewIdx].options.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-sans", children: activeSrsReview[srsReviewIdx].options.map((opt, oIdx) => {
                const letter = opt.trim().substring(0, 1);
                const isSelected = srsSelectedOpt === opt || srsSelectedOpt === letter;
                return /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      if (!srsAnswered) setSrsSelectedOpt(opt);
                    },
                    disabled: srsAnswered,
                    className: `p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${isSelected ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-extrabold shadow-sm scale-[1.01]" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV("span", { className: `w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black border-2 flex-shrink-0 mt-0.5 ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 text-slate-500"}`, children: letter }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1742,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "leading-tight font-sans mt-0.5", children: opt }, void 0, false, {
                        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                        lineNumber: 1749,
                        columnNumber: 27
                      }, this)
                    ]
                  },
                  oIdx,
                  true,
                  {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1732,
                    columnNumber: 25
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1727,
                columnNumber: 19
              }, this) : (
                // Free Text Answer entry
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 pt-2 text-xs", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "font-extrabold text-slate-705 block text-[11px]", children: "Nhập từ/vựng chính xác tiếng Anh (Viết thường):" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1757,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "text",
                      value: srsSelectedOpt,
                      onChange: (e) => setSrsSelectedOpt(e.target.value),
                      placeholder: "Gõ câu trả lời của bạn...",
                      disabled: srsAnswered,
                      className: "w-full bg-slate-50 border border-slate-250 text-xs rounded-xl px-4 py-3 outline-none text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-bold"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1758,
                      columnNumber: 21
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1756,
                  columnNumber: 19
                }, this)
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1708,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: !srsAnswered ? /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleVerifySrsAnswer,
                disabled: !srsSelectedOpt.trim(),
                className: "w-full py-3.5 bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-250 disabled:text-slate-400 text-white text-xs font-black rounded-xl transition-all shadow-sm uppercase tracking-wider cursor-pointer",
                children: "Kiểm Tra Đáp Án"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1773,
                columnNumber: 19
              },
              this
            ) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: `p-4.5 rounded-2xl border text-xs font-sans leading-relaxed flex gap-3 ${srsIsCorrect ? "bg-emerald-50 border-emerald-250 text-emerald-950" : "bg-rose-50 border-rose-250 text-rose-950"}`, children: [
                /* @__PURE__ */ jsxDEV("div", { className: "p-1 px-2.5 rounded-lg text-white font-black bg-slate-800 text-[10px] self-start mt-0.5", children: srsIsCorrect ? "ĐÚNG!" : "CHƯA ĐÚNG!" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1787,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "font-bold", children: [
                    "ĐÁP ÁN: ",
                    /* @__PURE__ */ jsxDEV("strong", { className: "font-semibold", children: activeSrsReview[srsReviewIdx].correctAnswer }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1791,
                      columnNumber: 58
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1791,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-slate-650 font-medium", children: [
                    "Bạn chọn: ",
                    /* @__PURE__ */ jsxDEV("strong", { className: "font-semibold", children: srsSelectedOpt }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1792,
                      columnNumber: 82
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1792,
                    columnNumber: 25
                  }, this),
                  activeSrsReview[srsReviewIdx].explanation && /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-slate-650 font-sans border-t pt-1 border-indigo-100/30", children: [
                    "💡 ",
                    /* @__PURE__ */ jsxDEV("strong", { children: "Giải thích:" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1795,
                      columnNumber: 32
                    }, this),
                    " ",
                    activeSrsReview[srsReviewIdx].explanation
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1794,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1790,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                lineNumber: 1782,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleNextSrsCard,
                  className: "w-full py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black rounded-xl border border-indigo-300 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5",
                  children: srsReviewIdx < activeSrsReview.length - 1 ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    "Câu Tiếp Theo ",
                    /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                      lineNumber: 1806,
                      columnNumber: 41
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                    lineNumber: 1806,
                    columnNumber: 25
                  }, this) : "Hoàn Thành Buổi Ôn Tập 🎉"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModuleGrammar.tsx",
                  lineNumber: 1801,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1781,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleGrammar.tsx",
              lineNumber: 1771,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleGrammar.tsx",
            lineNumber: 1693,
            columnNumber: 13
          }, this)
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleGrammar.tsx",
        lineNumber: 1595,
        columnNumber: 9
      }, this)
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModuleGrammar.tsx",
    lineNumber: 543,
    columnNumber: 5
  }, this);
}
