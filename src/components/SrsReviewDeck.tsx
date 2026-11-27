import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import {
  Volume2,
  HelpCircle,
  Flame,
  RefreshCw,
  Brain,
  Play,
  ArrowLeft
} from "lucide-react";
export default function SrsReviewDeck({
  user,
  onUserUpdate,
  onBackToHome,
  onStudyNewVocab,
  onTakeTest
}) {
  const [reviews, setReviews] = useState([]);
  const [activeQueue, setActiveQueue] = useState([]);
  const [completedWordsList, setCompletedWordsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [stats, setStats] = useState(null);
  const [sourceBreakdown, setSourceBreakdown] = useState({
    flashcard: 0,
    vocabulary: 0,
    quiz: 0,
    listening: 0,
    speaking: 0
  });
  const loadSrsDashboardData = async () => {
    setLoading(true);
    try {
      const summaryRes = await api.getSrsDueSummary();
      if (summaryRes && summaryRes.success) {
        const words = (summaryRes.dueWords || []).filter(
          (w) => !w.mastered && w.status !== "completed" && w.reviewStatus !== "completed"
        );
        setReviews(words);
        setActiveQueue(words);
        if (summaryRes.sourceBreakdown) {
          setSourceBreakdown(summaryRes.sourceBreakdown);
        }
        console.log("Current Review Queue (Loaded):", words);
        console.log("Completed Words:", completedWordsList);
        console.log("Remaining Words:", words.length);
      }
      const statsRes = await api.getSrsStats();
      if (statsRes && statsRes.success) {
        setStats({
          totalWords: statsRes.totalWords,
          masteredCount: statsRes.masteredCount,
          dueCount: statsRes.dueCount,
          hardestWord: statsRes.hardestWord,
          accuracyRate: statsRes.accuracyRate
        });
      }
    } catch (err) {
      console.error("Failed to load SRS Dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSrsDashboardData();
  }, []);
  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };
  const handleSelectRating = async (rating) => {
    const activeWord = activeQueue[0];
    if (!activeWord) return;
    try {
      const isCorrect = rating !== "again";
      await api.submitVocabularyProgress(activeWord.vocabularyId, rating, activeWord.source || "vocabulary");
      const xpBonus = 10;
      setXpEarned((prev) => prev + xpBonus);
      if (rating === "again") {
        const updatedQueue = [...activeQueue.slice(1), activeQueue[0]];
        setActiveQueue(updatedQueue);
        setIsRevealed(false);
        console.log("Current Review Queue:", updatedQueue);
        console.log("Completed Words (Again/Failed):", completedWordsList);
        console.log("Remaining Words:", updatedQueue.length);
      } else {
        const updatedQueue = activeQueue.slice(1);
        const updatedReviews = reviews.filter((r) => r.vocabularyId !== activeWord.vocabularyId);
        const nextCompletedList = [...completedWordsList, activeWord.vocab?.word || "Word"];
        setCompletedWordsList(nextCompletedList);
        setActiveQueue(updatedQueue);
        setReviews(updatedReviews);
        setIsRevealed(false);
        console.log("Current Review Queue:", updatedQueue);
        console.log("Completed Words:", nextCompletedList);
        console.log("Remaining Words:", updatedQueue.length);
        if (updatedQueue.length === 0) {
          setIsCompleted(true);
          await api.submitVocabularyExerciseComplete(xpBonus, activeWord.vocab?.level || "A1", 100);
          onUserUpdate({
            ...user,
            xp: (user.xp || 0) + xpBonus
          });
        }
      }
      const statsRes = await api.getSrsStats();
      if (statsRes && statsRes.success) {
        setStats({
          totalWords: statsRes.totalWords,
          masteredCount: statsRes.masteredCount,
          dueCount: statsRes.dueCount,
          hardestWord: statsRes.hardestWord,
          accuracyRate: statsRes.accuracyRate
        });
      }
    } catch (err) {
      console.error("SRS rate post failed", err);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center p-16 text-slate-400 text-xs font-mono", children: [
      /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-6 h-6 animate-spin text-indigo-600 mb-3" }, void 0, false, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this),
      "Đang đồng bộ cơ sở dữ liệu Spaced Repetition (SRS)..."
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 185,
      columnNumber: 7
    }, this);
  }
  if (isCompleted || reviews.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center min-h-[400px] p-4 animate-fade-in my-6", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-10 rounded-3xl border border-slate-200 text-center max-w-xl w-full space-y-8 shadow-xl", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-6xl animate-bounce", children: "🎉" }, void 0, false, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 197,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-black text-slate-900 tracking-tight leading-tight", children: "Hoàn thành ôn tập hôm nay!" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 200,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-slate-500 leading-relaxed max-w-md mx-auto", children: "Hiện tại không còn từ nào trong danh sách ôn tập SRS. Hãy quay lại học từ vựng hoặc chờ đến lịch ôn tiếp theo." }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 203,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 199,
        columnNumber: 11
      }, this),
      xpEarned > 0 && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-center text-xs font-bold text-indigo-700 max-w-xs mx-auto shadow-sm", children: [
        "Tổng số điểm XP học tập đã nhận: +",
        xpEarned,
        " XP"
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 209,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => onBackToHome?.(),
            className: "flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2.5xl py-3.5 px-6 text-xs font-black cursor-pointer shadow transition-all uppercase tracking-wider flex items-center justify-center gap-1.5",
            children: "Quay lại Trang chủ"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 215,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => onStudyNewVocab?.(),
            className: "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2.5xl py-3.5 px-6 text-xs font-black cursor-pointer shadow transition-all uppercase tracking-wider flex items-center justify-center gap-1.5",
            children: "Học từ vựng mới"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 222,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => onTakeTest?.(),
            className: "flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white rounded-2.5xl py-3.5 px-6 text-xs font-black cursor-pointer shadow transition-all uppercase tracking-wider flex items-center justify-center gap-1.5",
            children: "Làm bài kiểm tra"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 229,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 214,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 196,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this);
  }
  if (isReviewing && activeQueue.length > 0) {
    const currentItem = activeQueue[0];
    const vocab = currentItem?.vocab || {
      id: "sample",
      word: "Sample Word",
      ipa: "/sample/",
      meaning: "Nghĩa thử nghiệm",
      sentence: "The developer builds robust systems.",
      translation: "Người lập trình xây dựng các thực thể linh hoạt.",
      level: "A1",
      meaning_vi: "Nghĩa thử nghiệm",
      pronunciation: "/sample/",
      example_en: "The developer builds robust systems.",
      example_vi: "Người lập trình xây dựng các thực thể linh hoạt."
    };
    const actualWord = vocab.word || "Sample";
    const actualIpa = vocab.pronunciation || vocab.ipa || "/.../";
    const actualMeaning = vocab.meaning_vi || vocab.meaning || "Từ vựng";
    const actualSentence = vocab.example_en || vocab.example || "";
    const actualSentenceVi = vocab.example_vi || vocab.translation || "";
    return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 max-w-xl mx-auto animate-fade-in", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setIsReviewing(false);
              loadSrsDashboardData();
            },
            className: "flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors",
            children: [
              /* @__PURE__ */ jsxDEV(ArrowLeft, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 276,
                columnNumber: 13
              }, this),
              " Quay Lại Dashboard"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 269,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 text-xs font-mono text-slate-500", children: [
          /* @__PURE__ */ jsxDEV("span", { children: [
            "Chưa thuộc: ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-rose-600 font-extrabold", children: activeQueue.length }, void 0, false, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 281,
              columnNumber: 27
            }, this),
            " từ | Tổng: ",
            reviews.length
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 280,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 font-bold text-amber-600", children: [
            /* @__PURE__ */ jsxDEV(Flame, { className: "w-4 h-4 text-amber-500 text-sm animate-pulse" }, void 0, false, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 284,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "+",
              xpEarned,
              " XP"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 285,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 283,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 279,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 268,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border-2 border-indigo-100 shadow-xl rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] relative text-center space-y-6", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleSpeak(actualWord),
            className: "absolute top-5 right-5 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full cursor-pointer transition-colors",
            title: "Nghe audio phát âm",
            children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 299,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 294,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-5 left-5 flex gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-widest font-mono", children: "SRS CARD" }, void 0, false, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 303,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${currentItem.priority === "high" ? "bg-rose-100 text-rose-700" : currentItem.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`, children: [
            "Ưu tiên: ",
            currentItem.priority?.toUpperCase()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 306,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 302,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-3.5xl font-black text-indigo-950 tracking-tight", children: actualWord }, void 0, false, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 316,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 font-mono font-bold leading-none", children: actualIpa }, void 0, false, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 317,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 315,
          columnNumber: 11
        }, this),
        !isRevealed ? (
          /* Reveal trigger actions button */
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setIsRevealed(true);
                handleSpeak(actualWord);
              },
              className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl cursor-pointer shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5",
              children: [
                /* @__PURE__ */ jsxDEV(HelpCircle, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 326,
                  columnNumber: 15
                }, this),
                " XEM ĐỊNH NGHĨA & DỊCH NGHĨA"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 322,
              columnNumber: 13
            },
            this
          )
        ) : (
          /* Revealed state containing translation, example sentences */
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-5 animate-fade-in pt-2 w-full", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "border-t border-slate-150 pt-4 space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase text-indigo-500 block font-black tracking-wider", children: "ĐỊNH NGHĨA TIẾNG VIỆT:" }, void 0, false, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 332,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-lg font-black text-slate-800", children: actualMeaning }, void 0, false, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 333,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 331,
              columnNumber: 15
            }, this),
            actualSentence && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 bg-slate-50 p-4 border border-slate-100 rounded-2xl text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase text-slate-400 block font-extrabold", children: "Ví dụ trực quan:" }, void 0, false, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 338,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-semibold text-slate-700 italic leading-relaxed", children: [
                '"',
                actualSentence,
                '"'
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 339,
                columnNumber: 19
              }, this),
              actualSentenceVi && /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed italic", children: actualSentenceVi }, void 0, false, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 341,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 337,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 330,
            columnNumber: 13
          }, this)
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 291,
        columnNumber: 9
      }, this),
      isRevealed && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-100/50 p-5 rounded-2xl border border-slate-200/60 space-y-3.5 animate-fade-in text-center shadow-inner", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-500 block leading-none", children: "Mức độ ghi nhớ? Máy tính sẽ tự xác lập thời gian ôn lại tiếp theo:" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 352,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSelectRating("again"),
              className: "bg-rose-50 border-2 border-rose-100 hover:bg-rose-100/40 hover:border-rose-300 text-rose-800 p-3 rounded-2xl text-xs font-extrabold text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1",
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block font-black uppercase text-[10px]", children: "Tập Lại" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 361,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-rose-500 font-semibold block leading-none", children: "1 ngày nữa" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 362,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 357,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSelectRating("hard"),
              className: "bg-amber-50 border-2 border-amber-100 hover:bg-amber-100/40 hover:border-amber-300 text-amber-800 p-3 rounded-2xl text-xs font-extrabold text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1",
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block font-black uppercase text-[10px]", children: "Khó" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 369,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-amber-600 font-semibold block leading-none", children: "3 ngày nữa" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 370,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 365,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSelectRating("good"),
              className: "bg-sky-50 border-2 border-sky-100 hover:bg-sky-100/40 hover:border-sky-300 text-sky-800 p-3 rounded-2xl text-xs font-extrabold text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1",
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block font-black uppercase text-[10px]", children: "Tốt" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 377,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-sky-500 font-semibold block leading-none", children: "7 ngày nữa" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 378,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 373,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleSelectRating("easy"),
              className: "bg-emerald-50 border-2 border-emerald-100 hover:bg-emerald-100/40 hover:border-emerald-300 text-emerald-850 p-3 rounded-2xl text-xs font-extrabold text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1",
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block font-black uppercase text-[10px]", children: "Dễ" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 385,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-emerald-600 font-semibold block leading-none", children: "30 ngày nữa" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 386,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 381,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 356,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 351,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 265,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-8 animate-fade-in max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(Brain, { className: "w-7 h-7 text-indigo-600" }, void 0, false, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 404,
            columnNumber: 13
          }, this),
          " SPACED REPETITION SYSTEM (SRS)"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 403,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500", children: "Hệ thống quản lý ôn tập khoa học thông minh dựa trên đường cong quên lãng của Ebbinghaus." }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 406,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 402,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: loadSrsDashboardData,
          className: "px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-3.5 h-3.5" }, void 0, false, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 414,
              columnNumber: 11
            }, this),
            " Đồng bộ dữ liệu mới"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 410,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 401,
      columnNumber: 7
    }, this),
    stats && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black text-slate-400 tracking-widest block font-sans", children: "Tổng từ SRS" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 423,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-2.5xl font-black text-indigo-950 font-sans", children: stats.totalWords }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 424,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-none", children: "Được đưa vào quản lý" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 425,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 422,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black text-emerald-500 tracking-widest block font-sans", children: "Đã thuộc" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 429,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-2.5xl font-black text-emerald-600 font-sans", children: stats.masteredCount }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 430,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-none", children: "Cấp độ ghi nhớ ≥ 4" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 431,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 428,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black text-rose-500 tracking-widest block font-sans", children: "Cần ôn hôm nay" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 435,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-2.5xl font-black text-rose-600 font-sans", children: stats.dueCount }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 436,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-none", children: "Danh mục hết hạn" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 437,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 434,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1 col-span-2 md:col-span-1", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black text-amber-500 tracking-widest block font-sans", children: "Từ khó nhất" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 441,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-black text-amber-700 truncate pt-1 leading-tight", title: stats.hardestWord, children: stats.hardestWord }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 442,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-none", children: "Bị lỗi sai nhiều nhất" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 445,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 440,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 p-4 rounded-2xl shadow-xs space-y-1", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black text-indigo-600 tracking-widest block font-sans", children: "Tỷ lệ ghi nhớ" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 449,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-2.5xl font-black text-indigo-700 font-sans flex items-baseline gap-0.5", children: [
          stats.accuracyRate,
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black", children: "%" }, void 0, false, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 451,
            columnNumber: 35
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 450,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450 leading-none", children: "Chu vi duy trì từ vựng" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 453,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 448,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 420,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-black text-slate-800 flex items-center gap-2", children: [
            "📚 Từ Cần Ôn Hôm Nay (",
            reviews.length,
            ")"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 463,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[11.5px] text-slate-500", children: "Danh sách từ vựng đã hết hạn hoặc phát sinh lỗi sai được sắp xếp thứ tự ưu tiên thông minh." }, void 0, false, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 466,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 462,
          columnNumber: 11
        }, this),
        reviews.length > 0 && /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setIsReviewing(true);
              setIsRevealed(false);
              setXpEarned(0);
              setActiveQueue([...reviews]);
            },
            className: "px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-black rounded-2xl cursor-pointer shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0 uppercase",
            children: [
              /* @__PURE__ */ jsxDEV(Play, { className: "w-4 h-4 fill-white" }, void 0, false, {
                fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                lineNumber: 481,
                columnNumber: 15
              }, this),
              " Ôn tập ngay bây giờ"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 472,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 461,
        columnNumber: 9
      }, this),
      reviews.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 p-4 rounded-2xl", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] font-black uppercase text-slate-550 mb-2 leading-none", children: "Phân loại nguồn lỗi phát sinh:" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 489,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 text-[10.5px]", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-600", children: [
            "🎴 Flashcard: ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-indigo-600", children: [
              sourceBreakdown.flashcard,
              " từ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 492,
              columnNumber: 31
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 491,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-600", children: [
            "📔 Vocabulary: ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-indigo-600", children: [
              sourceBreakdown.vocabulary,
              " từ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 495,
              columnNumber: 32
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 494,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-600", children: [
            "⚡ Quiz: ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-indigo-600", children: [
              sourceBreakdown.quiz,
              " từ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 498,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 497,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-600", children: [
            "🎧 Listening: ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-indigo-600", children: [
              sourceBreakdown.listening,
              " từ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 501,
              columnNumber: 31
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 500,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-600", children: [
            "📢 Speaking: ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-indigo-600", children: [
              sourceBreakdown.speaking,
              " từ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 504,
              columnNumber: 30
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
            lineNumber: 503,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 490,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 488,
        columnNumber: 11
      }, this),
      reviews.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] font-black uppercase text-slate-500 tracking-wider", children: "Hàng đợi ưu tiên (SRS Queue - Tối đa 15 từ):" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 513,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2.5", children: reviews.map((r, idx) => {
          const itemWord = r.vocab?.word || "Word";
          const itemMean = r.vocab?.meaning_vi || r.vocab?.meaning || "";
          return /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-indigo-300 transition-colors",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5 truncate flex-1", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-sm text-slate-800 font-sans truncate", children: itemWord }, void 0, false, {
                      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                      lineNumber: 526,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: `text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded leading-none ${r.priority === "high" ? "bg-rose-100 text-rose-700" : r.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`, children: r.priority === "high" ? "High" : r.priority === "medium" ? "Med" : "Low" }, void 0, false, {
                      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                      lineNumber: 527,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                    lineNumber: 525,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10.5px] text-slate-500 truncate leading-tight font-medium", children: itemMean }, void 0, false, {
                    fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                    lineNumber: 534,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 524,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9.5px] bg-slate-100 text-slate-550 border border-slate-150 px-2 py-0.5 rounded-md font-bold shrink-0 capitalize", children: r.source || "learn" }, void 0, false, {
                  fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
                  lineNumber: 537,
                  columnNumber: 21
                }, this)
              ]
            },
            r.id || idx,
            true,
            {
              fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
              lineNumber: 520,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 514,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 512,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 border border-dashed border-slate-200 p-10 rounded-2xl text-center space-y-2", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 font-medium text-xs", children: "Hôm nay không có từ vựng nào nằm trong hàng đợi ôn tập." }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 547,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 leading-relaxed italic", children: "(Học từ mới, luyện lật thẻ, tham gia làm bài trắc nghiệm, nói, nghe... lỗi sai sẽ tự động quy nạp về hệ thống này)" }, void 0, false, {
          fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
          lineNumber: 548,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
        lineNumber: 546,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
      lineNumber: 460,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/SrsReviewDeck.tsx",
    lineNumber: 398,
    columnNumber: 5
  }, this);
}
