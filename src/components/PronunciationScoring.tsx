import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"]; const useRef = __custom_vite__cjsImport1_react["useRef"];
import { api } from "/src/api.ts";
import {
  Volume2,
  Mic,
  MicOff,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Layers,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";
const PRONUNCIATION_TARGETS = [
  // Vocabulary
  { type: "word", word: "daughter", phrase: "daughter", ipa: "/ˈdɔːtə(r)/", difficulty: "A2", label: "Từ vựng cơ bản" },
  { type: "word", word: "important", phrase: "important", ipa: "/ɪmˈpɔːtnt/", difficulty: "B1", label: "Phổ thông" },
  { type: "word", word: "comfortable", phrase: "comfortable", ipa: "/ˈkʌmftəbl/", difficulty: "B2", label: "Trung cấp" },
  { type: "word", word: "literature", phrase: "literature", ipa: "/ˈlɪtrətʃə(r)/", difficulty: "C1", label: "Cao cấp" },
  { type: "word", word: "entrepreneur", phrase: "entrepreneur", ipa: "/ˌɒntrəprəˈnɜː(r)/", difficulty: "C1", label: "Nâng cao" },
  // Sentences
  { type: "sentence", word: "family", phrase: "My family loves spending summer holidays together.", ipa: "/ˈfæməli/", difficulty: "A2", label: "Gia đình" },
  { type: "sentence", word: "resilient", phrase: "A resilient attitude helps you overcome setbacks immediately.", ipa: "/rɪˈzɪliənt/", difficulty: "B2", label: "Công việc" },
  { type: "sentence", word: "database", phrase: "The cloud database manages large structured datasets cleanly.", ipa: "/ˈdeɪtəbeɪs/", difficulty: "B1", label: "Công nghệ" },
  { type: "sentence", word: "opportunity", phrase: "Every challenge in your work life is a golden opportunity to grow.", ipa: "/ˌɒpəˈtjuːnəti/", difficulty: "B2", label: "Sự nghiệp" },
  // Paragraphs
  {
    type: "paragraph",
    word: "knowledge",
    phrase: "Continuous learning expands your knowledge, sharpens your cognitive skills, and prepares you for future innovations. Reading challenging materials every single day accelerates this transformation.",
    ipa: "/ˈnɒlɪdʒ/",
    difficulty: "C1",
    label: "Triết lý dải rộng"
  },
  {
    type: "paragraph",
    word: "technology",
    phrase: "Modern technology has revolutionized the way people interact. Although digital devices keep us connected at any moment, they also reduce face-to-face quality time.",
    ipa: "/tekˈnɒlədʒi/",
    difficulty: "B2",
    label: "Đời sống số"
  }
];
export default function PronunciationScoring({ user, onUserUpdate }) {
  const [selectedType, setSelectedType] = useState("all");
  const [targetIndex, setTargetIndex] = useState(0);
  const [spokenText, setSpokenText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const recognitionRef = useRef(null);
  const filteredTargets = PRONUNCIATION_TARGETS.filter(
    (item) => selectedType === "all" || item.type === selectedType
  );
  const activeIndex = targetIndex >= filteredTargets.length ? 0 : targetIndex;
  const currentTarget = filteredTargets[activeIndex] || PRONUNCIATION_TARGETS[0];
  useEffect(() => {
    setSpokenText("");
    setResult(null);
    setRecordingError(null);
    setXpEarned(0);
    if (isRecording) {
      stopRecording();
    }
  }, [activeIndex, selectedType]);
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn(e);
        }
      }
    };
  }, []);
  const handleSpeakSample = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentTarget.phrase);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt không hỗ trợ tổng hợp giọng nói.");
    }
  };
  const startRecording = () => {
    setRecordingError(null);
    setSpokenText("");
    setResult(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingError("Trình duyệt không hỗ trợ Web Speech API. Bạn hãy nhập chay giọng đọc vào ô dưới đây để thử nghiệm!");
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => {
        setIsRecording(true);
      };
      rec.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        if (transcript) {
          setSpokenText(transcript);
        }
      };
      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setRecordingError("Không khởi động được micro. Hãy cấp quyền microphone trong Chrome/Safari mục Cài đặt trang web hoặc nhấp biểu tượng 🔒 ở góc URL.");
        } else {
          setRecordingError(`Lỗi mic hoặc chưa nhận dạng được từ nào: ${event.error}. Thử nói to và rõ hơn!`);
        }
        setIsRecording(false);
      };
      rec.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setRecordingError(`Lỗi kích hoạt microphone: ${e.message}`);
      setIsRecording(false);
    }
  };
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Stopping voice failed:", e);
      }
    }
    setIsRecording(false);
  };
  const handleEvaluate = async () => {
    if (!spokenText.trim()) {
      alert("Vui lòng ghi âm giọng đọc của bạn trước khi chấm điểm.");
      return;
    }
    setLoading(true);
    try {
      const evaluation = await api.evaluatePronunciationScoring(currentTarget.phrase, spokenText);
      if (evaluation) {
        setResult(evaluation);
        const earned = Math.max(10, Math.floor((evaluation.accuracy || 70) / 10));
        setXpEarned(earned);
        onUserUpdate({
          ...user,
          xp: (user.xp || 0) + earned
        });
      }
    } catch (err) {
      console.error("Failed evaluating voice pronunciation:", err);
      alert("Chấm điểm thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  const handleNextTarget = () => {
    if (targetIndex + 1 < filteredTargets.length) {
      setTargetIndex(targetIndex + 1);
    } else {
      setTargetIndex(0);
    }
  };
  const handleRetry = () => {
    setSpokenText("");
    setResult(null);
    setXpEarned(0);
    setRecordingError(null);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-b from-indigo-50/20 to-indigo-100/10 min-h-screen py-6 px-4", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl animate-pulse", children: /* @__PURE__ */ jsxDEV(Mic, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 240,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 239,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider", children: "COACH PHÁT ÂM AI CHUYÊN SÂU" }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 243,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-black text-slate-800 uppercase tracking-tight mt-1", children: "🎤 AI PRONUNCIATION COACH" }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 246,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 242,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 238,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 font-black px-2.5 py-1 rounded-full", children: "REALTIME STT" }, void 0, false, {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 251,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PronunciationScoring.tsx",
      lineNumber: 237,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60 shadow-inner", children: ["all", "word", "sentence", "paragraph"].map((tab) => /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => {
          setSelectedType(tab);
          setTargetIndex(0);
        },
        className: `flex-1 py-1.5 rounded-xl text-[11px] font-black tracking-wide capitalize transition-all cursor-pointer ${selectedType === tab ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`,
        children: tab === "all" ? "Tất Cả" : tab === "word" ? "Từ Vựng" : tab === "sentence" ? "Câu Ngắn" : "Đoạn Văn"
      },
      tab,
      false,
      {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 259,
        columnNumber: 13
      },
      this
    )) }, void 0, false, {
      fileName: "/app/applet/src/components/PronunciationScoring.tsx",
      lineNumber: 257,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative overflow-hidden space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 p-3 flex gap-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100", children: currentTarget.difficulty }, void 0, false, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 279,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg", children: currentTarget.label }, void 0, false, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 282,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 278,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-left space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black tracking-wider uppercase text-slate-400 block", children: "Mẫu luyện đọc chuẩn mực:" }, void 0, false, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 288,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          currentTarget.type === "word" ? /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-black text-indigo-950 tracking-tight leading-none uppercase", children: currentTarget.phrase }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 294,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV("p", { className: "text-base font-bold text-slate-800 leading-relaxed italic pr-12", children: [
            '"',
            currentTarget.phrase,
            '"'
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 298,
            columnNumber: 17
          }, this),
          currentTarget.ipa && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-xs text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md font-bold", children: currentTarget.ipa }, void 0, false, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 305,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleSpeakSample,
                className: "p-1 px-2 border border-slate-150 hover:bg-slate-50 hover:border-slate-300 text-indigo-600 rounded-lg cursor-pointer transition-all flex items-center gap-1 text-[10px] font-black",
                children: [
                  /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3.5 h-3.5" }, void 0, false, {
                    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                    lineNumber: 312,
                    columnNumber: 21
                  }, this),
                  " Nghe mẫu"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 308,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 304,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 292,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 287,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "border-t border-slate-100 pt-5 flex flex-col items-center justify-center space-y-4", children: [
        recordingError && /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50 text-amber-900 border border-amber-200/80 p-3 rounded-2xl text-left text-[11px] font-medium leading-relaxed flex items-start gap-2 max-w-sm w-full animate-fade-in", children: [
          /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5" }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 324,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: recordingError }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 325,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 323,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 uppercase font-black tracking-widest block text-center", children: isRecording ? "Hệ thống đang nghe giọng bạn..." : "Nhấp micro để bắt đầu phát âm" }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 330,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: isRecording ? stopRecording : startRecording,
              className: `w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer relative ${isRecording ? "bg-red-500 text-white animate-pulse shadow-red-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-150 hover:shadow-indigo-250"}`,
              children: isRecording ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "absolute inset-0 rounded-full bg-red-400 opacity-60 animate-ping" }, void 0, false, {
                  fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                  lineNumber: 345,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MicOff, { className: "w-6 h-6 relative z-10 animate-bounce" }, void 0, false, {
                  fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                  lineNumber: 346,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 344,
                columnNumber: 19
              }, this) : /* @__PURE__ */ jsxDEV(Mic, { className: "w-6 h-6" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 349,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 335,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 329,
          columnNumber: 13
        }, this),
        spokenText && /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-sm bg-slate-50 border border-slate-200/50 rounded-2xl p-3.5 text-center space-y-1.5 animate-fade-in", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] font-black uppercase text-indigo-500 tracking-wider block", children: "Giọng nói của bạn (Nhận diện STT):" }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 357,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-indigo-950 italic", children: [
            '"',
            spokenText,
            '"'
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 360,
            columnNumber: 17
          }, this),
          !result && !loading && /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleEvaluate,
              className: "mt-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 mx-auto shadow-sm tracking-wide transition-all",
              children: [
                /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
                  fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                  lineNumber: 368,
                  columnNumber: 21
                }, this),
                " Chấm điểm phát âm"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 364,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 356,
          columnNumber: 15
        }, this),
        !isRecording && !spokenText && /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-sm flex gap-1.5 pt-1", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "Nhập thủ công hoặc click 'Điền thử'",
              value: spokenText,
              onChange: (e) => setSpokenText(e.target.value),
              className: "flex-1 min-w-0 px-3 py-1.5 border border-slate-250 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 377,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSpokenText(currentTarget.phrase),
              className: "px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 transition-all cursor-pointer whitespace-nowrap",
              children: "Điền thử"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 384,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 376,
          columnNumber: 15
        }, this),
        loading && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-2 space-y-1", children: [
          /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-6 h-6 text-indigo-600 animate-spin" }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 395,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse", children: "AI Đang chấm âm của bạn..." }, void 0, false, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 396,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PronunciationScoring.tsx",
          lineNumber: 394,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 320,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PronunciationScoring.tsx",
      lineNumber: 277,
      columnNumber: 9
    }, this),
    result && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        className: "bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-white space-y-5",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-white/5 pb-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-indigo-400" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 417,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-300 tracking-wider", children: "Bản Đăng Ký Kiểm Âm ELSA Standard AI" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 418,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 416,
              columnNumber: 15
            }, this),
            xpEarned > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold", children: [
              "+",
              xpEarned,
              " XP tích lũy"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 424,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 415,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-2 text-center", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-2 rounded-xl border border-white/5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 font-semibold block pb-1", children: "Accuracy" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 433,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-emerald-400 font-mono", children: [
                result.accuracy || 0,
                "/100"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 434,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 432,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-2 rounded-xl border border-white/5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 font-semibold block pb-1", children: "Stress" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 439,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-sky-400 font-mono", children: [
                result.stress || 0,
                "/100"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 440,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 438,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-2 rounded-xl border border-white/5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 font-semibold block pb-1", children: "Intonation" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 445,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-amber-400 font-mono", children: [
                result.intonation || 0,
                "/100"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 446,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 444,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-2 rounded-xl border border-white/5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 font-semibold block pb-1", children: "Fluency" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 451,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-fuchsia-400 font-mono", children: [
                result.fluency || 0,
                "/100"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 452,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 450,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 431,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950/40 border border-indigo-900/40 p-4 rounded-2xl flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black uppercase text-indigo-400 tracking-wider", children: "TỔNG ĐIỂM SỐ CHUNG" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 461,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 leading-normal", children: "Chỉ số dựa trên sự kết hợp giữa độ rõ âm tố và nhịp nhấn ngữ điệu của học viên." }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 462,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 460,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-inner", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-indigo-100 block font-bold leading-none", children: "OVERALL" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 467,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black leading-tight", children: Math.round(((result.accuracy || 0) + (result.stress || 0) + (result.intonation || 0) + (result.fluency || 0)) / 4) }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 468,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 466,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 459,
            columnNumber: 13
          }, this),
          result.phonemes && result.phonemes.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 text-left", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] uppercase tracking-wider font-extrabold text-slate-400 block flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(Layers, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 478,
                columnNumber: 19
              }, this),
              " Bản đồ phân mã âm vị (Phonetic mapping):"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 477,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1.5 p-3 bg-black/60 rounded-xl border border-white/5 justify-center", children: result.phonemes.map((ph, idx) => /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: `px-3 py-1 text-xs font-mono font-black flex flex-col items-center rounded-lg border transition-all ${ph.correct === true ? "bg-emerald-950/45 text-emerald-400 border-emerald-900/50" : "bg-rose-950/45 text-rose-400 border-rose-900/50 animate-shake"}`,
                title: ph.comment || "",
                children: [
                  /* @__PURE__ */ jsxDEV("span", { children: ph.sound }, void 0, false, {
                    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                    lineNumber: 492,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[6.5px] uppercase tracking-wide font-extrabold pt-0.5", children: ph.correct === true ? "Đúng" : "Sai" }, void 0, false, {
                    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                    lineNumber: 493,
                    columnNumber: 23
                  }, this)
                ]
              },
              idx,
              true,
              {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 483,
                columnNumber: 21
              },
              this
            )) }, void 0, false, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 481,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 476,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-left bg-black/35 p-4 rounded-2xl border border-white/5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(MessageSquare, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 505,
                columnNumber: 17
              }, this),
              " Góp Ý Chuyên Sâu Của AI Giám Khảo:"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 504,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-200 leading-relaxed italic text-justify", children: [
              '"',
              result.feedback || `Phát âm từ ${currentTarget.word} khá tốt. Hãy tiếp cận với những câu tiếp theo để nâng cao phản xạ nói!`,
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PronunciationScoring.tsx",
              lineNumber: 507,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 503,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2.5 pt-2", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleRetry,
                className: "flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 active:scale-95 text-white text-xs font-black tracking-wide rounded-2xl cursor-pointer transition-all uppercase",
                children: "🔄 Thử lại"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 514,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleNextTarget,
                className: "flex-1 py-3 bg-indigo-600 hover:bg-blue-600 active:scale-95 text-white text-xs font-black tracking-wide rounded-2xl cursor-pointer transition-all uppercase flex items-center justify-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxDEV("span", { children: "Câu tiếp theo" }, void 0, false, {
                    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                    lineNumber: 524,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                    lineNumber: 525,
                    columnNumber: 17
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/PronunciationScoring.tsx",
                lineNumber: 520,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PronunciationScoring.tsx",
            lineNumber: 513,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/PronunciationScoring.tsx",
        lineNumber: 408,
        columnNumber: 11
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
    lineNumber: 234,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/components/PronunciationScoring.tsx",
    lineNumber: 233,
    columnNumber: 5
  }, this);
}
