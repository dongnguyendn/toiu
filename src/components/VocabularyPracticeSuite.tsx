import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"]; const useRef = __custom_vite__cjsImport1_react["useRef"];
import { api } from "/src/api.ts";
import { evaluateSpeakingText } from "/src/utils/speechEvaluator.ts";
import {
  Volume2,
  Sparkles,
  AlertCircle,
  Zap,
  Check,
  RotateCcw,
  Edit,
  Trash2,
  Plus,
  X,
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
  Search,
  BookOpen,
  Sliders,
  Play,
  RefreshCw,
  Lock,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LessonResultView } from "/src/components/LessonResultView.tsx";
import { checkAndCompleteActiveTask, handleBackToHome } from "/src/utils/roadmapProgressManager.ts";
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
export default function VocabularyPracticeSuite({
  user,
  onUserUpdate,
  level: initialLevel,
  onRefreshRoadmap,
  activeTaskRedirect,
  cameFromRoadmapProp
}) {
  const [cameFromRoadmap, setCameFromRoadmap] = useState(cameFromRoadmapProp || false);
  useEffect(() => {
    if (cameFromRoadmapProp) {
      setCameFromRoadmap(true);
    } else if (activeTaskRedirect) {
      setCameFromRoadmap(true);
    } else {
      const stored = localStorage.getItem("activeTaskRedirect");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.type === "vocabulary" || parsed.type === "flashcard" || parsed.type === "review") {
            setCameFromRoadmap(true);
          }
        } catch (e) {}
      }
    }
  }, [activeTaskRedirect, cameFromRoadmapProp]);
  const [level, setLevel] = useState(initialLevel);
  const [vocabList, setVocabList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompletedSession, setIsCompletedSession] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const [mode, setMode] = useState("vocab");
  const [srsRatings, setSrsRatings] = useState({});
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [userAnswersTrack, setUserAnswersTrack] = useState([]);
  const [stats, setStats] = useState({
    totalStudied: 0,
    streakDays: user.currentLessonNumber || 1,
    recentAccuracy: 85,
    topTopic: "Family"
  });
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [speakingScore, setSpeakingScore] = useState(null);
  const [speakingMetrics, setSpeakingMetrics] = useState(null);
  const [isExamMode, setIsExamMode] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [correctExamWordIds, setCorrectExamWordIds] = useState([]);
  const [examStep, setExamStep] = useState(0);
  const [examItems, setExamItems] = useState([]);
  const [examFinished, setExamFinished] = useState(false);
  const [examPointsGained, setExamPointsGained] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [srsToastMessage, setSrsToastMessage] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [selectedMultiChoice, setSelectedMultiChoice] = useState(null);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [scrambledSelection, setScrambledSelection] = useState([]);
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [formWord, setFormWord] = useState("");
  const [formPron, setFormPron] = useState("");
  const [formMeaningVi, setFormMeaningVi] = useState("");
  const [formMeaningEn, setFormMeaningEn] = useState("");
  const [formExample, setFormExample] = useState("");
  const [formExampleVi, setFormExampleVi] = useState("");
  const [formTopic, setFormTopic] = useState("Family");
  const [formDiff, setFormDiff] = useState(1);
  const [formImg, setFormImg] = useState("");
  const [diagnosticReport, setDiagnosticReport] = useState(null);
  const handleRunDiagnostics = () => {
    const details = [];
    const total = allVocabs.length;
    let missing = 0;
    let broken = 0;
    let duplicates = 0;
    let mismatch = 0;
    const imgMap = /* @__PURE__ */ new Map();
    allVocabs.forEach((v) => {
      if (!v.imageUrl) {
        missing++;
        details.push({
          type: "Thiếu ảnh",
          word: v.word,
          id: v.id,
          error: "Không có URL hình ảnh gán cho từ"
        });
      }
      const url = v.imageUrl;
      if (url) {
        const urlClean = url.trim();
        const isUrlPattern = urlClean.startsWith("http://") || urlClean.startsWith("https://");
        if (!isUrlPattern) {
          broken++;
          details.push({
            type: "URL lỗi",
            word: v.word,
            id: v.id,
            error: `Được gán URL không hợp lệ: "${url}"`
          });
        }
        if (imgMap.has(urlClean)) {
          imgMap.get(urlClean).push(v.word);
        } else {
          imgMap.set(urlClean, [v.word]);
        }
      }
      if (v.id && url && url.includes("images.unsplash.com") && url.includes("w=200") && (url.includes("photo-1488085061387-422e29b40080") || url.includes("photo-1497633762265-9d179a990aa6")) && v.word !== "car" && v.word !== "comprehensive") {
        mismatch++;
        details.push({
          type: "Mapping sai",
          word: v.word,
          id: v.id,
          error: "Hiện ảnh phong cảnh/máy bay mặc định do lỗi seed cũ"
        });
      }
    });
    imgMap.forEach((words, url) => {
      if (words.length > 1) {
        if (!url.includes("photo-1546410531-bb4caa6b424d")) {
          duplicates += words.length - 1;
          words.forEach((w) => {
            const item = allVocabs.find((v) => v.word === w);
            details.push({
              type: "Ảnh trùng",
              word: w,
              id: item?.id || "",
              error: `Sử dụng chung ảnh với: ${words.filter((x) => x !== w).join(", ")}`
            });
          });
        }
      }
    });
    setDiagnosticReport({
      total,
      missing,
      broken,
      duplicates,
      mismatch,
      details
    });
  };
  const recognitionRef = useRef(null);
  const [allVocabs, setAllVocabs] = useState([]);
  const [studiedIds, setStudiedIds] = useState([]);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState([]);
  const isLevelCompleted = (lvl) => {
    const s1 = (user?.vocabularyStageScores || {})[lvl + "_stage1"];
    const s2 = (user?.vocabularyStageScores || {})[lvl + "_stage2"];
    const stagesPassed = s1 !== void 0 && s1 >= 80 && s2 !== void 0 && s2 >= 80;
    if (user && user.completedLevels) {
      return user.completedLevels.map((l) => l.toUpperCase()).includes(lvl.toUpperCase()) || stagesPassed;
    }
    return stagesPassed;
  };
  const isLevelUnlocked = (lvl) => {
    if (lvl === "A1") return true;
    if (user && user.unlockedLevels) {
      return user.unlockedLevels.map((l) => l.toUpperCase()).includes(lvl.toUpperCase());
    }
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const idx = levels.indexOf(lvl);
    if (idx <= 0) return true;
    const prevLvl = levels[idx - 1];
    return isLevelCompleted(prevLvl);
  };
  const handleToggleStudy = async (vocabId) => {
    if (!vocabId) return;
    const alreadyStudied = studiedIds.includes(vocabId);
    try {
      if (alreadyStudied) {
        await api.submitVocabularyProgress(vocabId, "again");
        setStudiedIds((prev) => prev.filter((id) => id !== vocabId));
      } else {
        const res = await api.submitVocabularyProgress(vocabId, "good");
        setStudiedIds((prev) => [...prev, vocabId]);
        if (res?.success) {
          const updatedUser = { ...user, xp: (user.xp || 100) + 5 };
          onUserUpdate(updatedUser);
        }
      }
      const currentLevelWords = allVocabs.filter((v) => v.level === level);
      const isNowStudied = !alreadyStudied;
      const updatedStudiedIds = isNowStudied ? [...studiedIds, vocabId] : studiedIds.filter((id) => id !== vocabId);
      const currentLevelStudiedCount = currentLevelWords.filter((v) => updatedStudiedIds.includes(v.id)).length;
      setStats((prev) => ({
        ...prev,
        totalStudied: currentLevelStudiedCount
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const handleFlashCardSrsRating = async (vocabId, rating) => {
    try {
      await api.submitVocabularyProgress(vocabId, rating, "flashcard");
      if (rating === "again") {
        setSrsToastMessage("✓ Đã thêm vào danh sách ôn tập SRS.");
        setTimeout(() => setSrsToastMessage(null), 2500);
      }
      if (!studiedIds.includes(vocabId)) {
        setStudiedIds((prev) => [...prev, vocabId]);
      }
      setSrsRatings((prev) => ({
        ...prev,
        [vocabId]: rating
      }));
      setTimeout(() => {
        if (currentIdx < vocabList.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setIsFlipped(false);
        } else {
          setIsCompletedSession(true);
        }
      }, 400);
    } catch (err) {
      console.error("Spaced repetition submit failed:", err);
    }
  };
  useEffect(() => {
    fetchProgressAndVocabs();
  }, [level]);
  const fetchProgressAndVocabs = async () => {
    setLoading(true);
    try {
      const vocabRes = await api.getVocabularies();
      let vocabs = [];
      if (vocabRes?.success) {
        vocabs = vocabRes.vocabularies || [];
        setAllVocabs(vocabs);
      }
      const progressRes = await api.getVocabularyProgress();
      let learnedSet = /* @__PURE__ */ new Set();
      const tempRatings = {};
      if (progressRes?.success && progressRes.progress) {
        progressRes.progress.forEach((p) => {
          if (p.rating !== "again") {
            learnedSet.add(p.vocabularyId);
          }
          tempRatings[p.vocabularyId] = p.rating;
        });
        setStudiedIds(Array.from(learnedSet));
        setSrsRatings(tempRatings);
      }
      const currentLevelWords = vocabs.filter((v) => v.level === level);
      setVocabList(currentLevelWords);
      setCurrentIdx(0);
      setIsFlipped(false);
      setIsCompletedSession(false);
      setSpeakingScore(null);
      setSpeakingMetrics(null);
      setSpokenText("");
      const currentLevelStudiedCount = currentLevelWords.filter((v) => learnedSet.has(v.id)).length;
      const topics = [...new Set(currentLevelWords.map((x) => x.topic || "General"))];
      setStats({
        totalStudied: currentLevelStudiedCount,
        streakDays: Math.floor((user.xp || 1250) / 250) + 1,
        recentAccuracy: 80 + Math.floor(Math.random() * 15),
        topTopic: topics[0] || "General"
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
  const triggerSpeechRecognition = async (correctWord) => {
    console.log("Micro clicked");
    setMicPermissionError(null);
    if (isRecording) {
      console.log("Recording stopped");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }
    const navAny = navigator as any;
    const getMedia = navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices) || navAny.getUserMedia?.bind(navigator) || navAny.webkitGetUserMedia?.bind(navigator) || navAny.mozGetUserMedia?.bind(navigator);
    if (getMedia) {
      console.log("Requesting microphone permission directly in click event");
      try {
        const stream = await getMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        console.log("Microphone permission granted");
        localStorage.setItem("mic_permission_status", "granted");
        setMicPermissionError(null);
      } catch (err) {
        console.warn("Microphone permission denied inside user action:", err);
        localStorage.setItem("mic_permission_status", "denied");
        let errorMsg = "Bạn đã từ chối hoặc bị trình duyệt chặn quyền truy cập Microphone.";
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMsg = "Quyền truy cập Microphone đang bị chặn trong cài đặt hoặc bạn đã bấm từ chối. Hãy mở lại Micro theo hướng dẫn phía dưới nhé.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMsg = "Không tìm thấy thiết bị Microphone kết nối với máy tính.";
        } else {
          errorMsg = `${err.name || "Error"}: ${err.message || "Bị từ chối"}`;
        }
        setMicPermissionError(errorMsg);
        setIsRecording(false);
        return;
      }
    } else {
      console.log("No getUserMedia support detected, trying SpeechRecognition directly as fallback");
    }
    if (!SpeechRecognition) {
      setMicPermissionError("Trình duyệt không hỗ trợ Web Speech API.");
      alert("Không thể truy cập microphone. Vui lòng sử dụng các trình duyệt hỗ trợ nhận diện giọng nói (Chrome, Edge, Safari) và kết nối HTTPS.");
      return;
    }
    setIsRecording(true);
    setSpokenText("");
    setSpeakingScore(null);
    setSpeakingMetrics(null);
    console.log("Recording started");
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSpokenText(speechToText);
      evaluateSpeechScore(speechToText, correctWord);
    };
    rec.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsRecording(false);
      console.log("Recording stopped");
    };
    rec.onend = () => {
      setIsRecording(false);
      console.log("Recording stopped");
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (ex) {
      console.error("Failed starting speech recognition:", ex);
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };
  const evaluateSpeechScore = (heard, correct) => {
    const evalResult = evaluateSpeakingText(correct, heard);
    setSpeakingScore(evalResult.overallScore);
    setSpeakingMetrics({
      accuracy: evalResult.accuracy,
      fluency: evalResult.fluency,
      feedback: evalResult.feedback
    });
    if (evalResult.overallScore >= 70) {
      const updated = { ...user, xp: (user.xp || 100) + 5 };
      onUserUpdate(updated);
      api.submitVocabularyExerciseComplete(5);
    } else {
      api.addWordToSRS({
        word: correct,
        source: "speaking",
        correct: false
      }).catch((err) => console.error("Speaking SRS add error", err));
    }
  };
  const getDistractors = (wordItem, fullList) => {
    let candidates = fullList.filter(
      (v) => v.id !== wordItem.id && v.level === wordItem.level && v.topic === wordItem.topic
    );
    if (candidates.length < 3) {
      candidates = fullList.filter(
        (v) => v.id !== wordItem.id && v.level === wordItem.level
      );
    }
    if (candidates.length < 3) {
      candidates = fullList.filter((v) => v.id !== wordItem.id);
    }
    const uniqueWords = Array.from(new Set(candidates.map((c) => c.word))).slice(0, 3);
    while (uniqueWords.length < 3) {
      uniqueWords.push("correct_alt_" + Math.random().toString(36).substring(2, 5));
    }
    return uniqueWords;
  };
  const startStageTest = (stage) => {
    let stageWords = [];
    if (stage === 1) {
      stageWords = chunkedLessons.slice(0, 5).flat();
    } else {
      stageWords = chunkedLessons.slice(5, 10).flat();
    }
    if (stageWords.length === 0) {
      alert("Chương học chưa có đủ từ vựng để tạo bài test!");
      return;
    }
    const shuffled = [...stageWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 10);
    const steps = selectedWords.map((wordItem) => {
      const distractors = getDistractors(wordItem, vocabList);
      const choices = [wordItem.word, ...distractors].sort(() => Math.random() - 0.5);
      return {
        vocab: wordItem,
        type: 0,
        // Multiple-Choice only
        payload: {
          choices,
          questionText: `Từ tiếng Anh nào có nghĩa là "${wordItem.meaning_vi}"?`
        }
      };
    });
    setCurrentLessonIndex(stage === 1 ? -10 : -20);
    setExamItems(steps);
    setExamStep(0);
    setExamFinished(false);
    setExamPointsGained(0);
    setComboCount(0);
    setCorrectAnswersCount(0);
    setCorrectExamWordIds([]);
    setUserAnswersTrack([]);
    setInputAnswer("");
    setSelectedMultiChoice(null);
    setIsQuestionSubmitted(false);
    setIsExamMode(true);
  };
  const startLearningExercise = (lessonWords, lessonIndex) => {
    if (lessonWords.length === 0) {
      alert("Bài luyện tập này hiện chưa có từ vựng!");
      return;
    }
    const steps = lessonWords.map((wordItem) => {
      const distractors = getDistractors(wordItem, vocabList);
      const choices = [wordItem.word, ...distractors].sort(() => Math.random() - 0.5);
      return {
        vocab: wordItem,
        type: 0,
        // Strictly Multiple-Choice only
        payload: {
          choices,
          questionText: `Từ tiếng Anh nào có nghĩa là "${wordItem.meaning_vi}"?`
        }
      };
    });
    setCurrentLessonIndex(lessonIndex);
    setExamItems(steps);
    setExamStep(0);
    setExamFinished(false);
    setExamPointsGained(0);
    setComboCount(0);
    setCorrectAnswersCount(0);
    setCorrectExamWordIds([]);
    setUserAnswersTrack([]);
    setInputAnswer("");
    setSelectedMultiChoice(null);
    setIsQuestionSubmitted(false);
    setIsExamMode(true);
  };
  const handleScrambleClick = (node) => {
    if (isQuestionSubmitted) return;
    if (node.selected) {
      setScrambledSelection((prev) => prev.filter((x) => x !== node.letter));
      setScrambledLetters((prev) => prev.map((item) => item.id === node.id ? { ...item, selected: false } : item));
    } else {
      setScrambledSelection((prev) => [...prev, node.letter]);
      setScrambledLetters((prev) => prev.map((item) => item.id === node.id ? { ...item, selected: true } : item));
    }
  };
  const handleMatchCardClick = (id) => {
    if (isQuestionSubmitted) return;
    const clicked = matchPairs.find((x) => x.id === id);
    if (!clicked || clicked.cleared) return;
    if (!selectedMatch) {
      setSelectedMatch(id);
    } else {
      const prev = matchPairs.find((x) => x.id === selectedMatch);
      if (!prev) return;
      if (prev.id === clicked.id) {
        setSelectedMatch(null);
        return;
      }
      if (prev.wordId === clicked.wordId && prev.type !== clicked.type) {
        setMatchPairs((prevList) => prevList.map((item) => item.wordId === clicked.wordId ? { ...item, cleared: true } : item));
        setSelectedMatch(null);
        setComboCount((curr) => curr + 1);
        handleTTS(clicked.type === "en" ? clicked.val : prev.val);
      } else {
        setSelectedMatch(id);
      }
    }
  };
  const evaluateQuestionAnswerSubmit = () => {
    const q = examItems[examStep];
    let isCorrect = false;
    if (q.type === 0) {
      isCorrect = selectedMultiChoice === q.vocab.word;
    } else if (q.type === 1) {
      const uncleared = matchPairs.filter((x) => !x.cleared);
      isCorrect = uncleared.length === 0;
    } else if (q.type === 2) {
      const formed = scrambledSelection.join("");
      isCorrect = formed.toLowerCase() === q.vocab.word.toLowerCase();
    } else if (q.type === 3 || q.type === 4) {
      isCorrect = inputAnswer.trim().toLowerCase() === q.vocab.word.trim().toLowerCase();
    }
    setIsQuestionSubmitted(true);
    setIsCurrentAnswerCorrect(isCorrect);
    setUserAnswersTrack((prev) => [...prev, { vocab: q.vocab, isCorrect }]);
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      setCorrectExamWordIds((prev) => [...prev, q.vocab.id]);
      setComboCount((prev) => prev + 1);
      setExamPointsGained((prev) => prev + 20 + Math.min(comboCount * 5, 20));
      handleTTS(q.vocab.word);
    } else {
      setComboCount(0);
      api.addWordToSRS({
        vocabularyId: q.vocab.id,
        source: "quiz",
        correct: false
      }).catch((err) => console.error("Spaced repetition auto-add failed:", err));
    }
  };
  const advanceExerciseStep = () => {
    if (examStep < examItems.length - 1) {
      const nextStep = examStep + 1;
      setExamStep(nextStep);
      setInputAnswer("");
      setSelectedMultiChoice(null);
      setIsQuestionSubmitted(false);
      setIsCurrentAnswerCorrect(false);
    } else {
      setExamFinished(true);
      const totalPayout = examPointsGained;
      const accuracy = Math.round(correctAnswersCount / Math.max(examItems.length, 1) * 100);
      const threshold = currentLessonIndex < 0 ? 8 : 10;
      const passed = correctAnswersCount >= threshold;
      if (passed && currentLessonIndex >= 0) {
        const lessonWordIds = examItems.map((q) => q.vocab.id);
        lessonWordIds.forEach((id) => {
          api.submitVocabularyProgress(id, "good");
        });
        setStudiedIds((prev) => {
          const unique = /* @__PURE__ */ new Set([...prev, ...lessonWordIds]);
          return Array.from(unique);
        });
        const updatedRatings = { ...srsRatings };
        lessonWordIds.forEach((id) => {
          updatedRatings[id] = "good";
        });
        setSrsRatings(updatedRatings);
      }
      const oldUnlocked = user?.unlockedAchievements || [];
      const handleSubmissionResponse = (res, fallbackUser) => {
        const finalUser = res && res.success && res.user ? res.user : fallbackUser;
        const postUnlocked = finalUser.unlockedAchievements || [];
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
        onUserUpdate(finalUser);
        try {
          checkAndCompleteActiveTask("vocabulary");
          checkAndCompleteActiveTask("flashcard");
          checkAndCompleteActiveTask("review");
        } catch (err) {
          console.warn("Failed to auto-complete vocabulary task:", err);
        }
      };
      if (currentLessonIndex === -10) {
        api.submitVocabularyExerciseComplete(totalPayout, level, accuracy, level + "_stage1", accuracy).then((res) => {
          const fallback = {
            ...user,
            xp: (user.xp || 100) + totalPayout,
            vocabularyStageScores: {
              ...user.vocabularyStageScores || {},
              [level + "_stage1"]: accuracy
            }
          };
          handleSubmissionResponse(res, fallback);
        });
      } else if (currentLessonIndex === -20) {
        api.submitVocabularyExerciseComplete(totalPayout, level, accuracy, level + "_stage2", accuracy).then((res) => {
          const fallback = {
            ...user,
            xp: (user.xp || 100) + totalPayout,
            vocabularyStageScores: {
              ...user.vocabularyStageScores || {},
              [level + "_stage2"]: accuracy
            }
          };
          handleSubmissionResponse(res, fallback);
        });
      } else {
        api.submitVocabularyExerciseComplete(totalPayout, level, accuracy).then((res) => {
          const fallback = { ...user, xp: (user.xp || 100) + totalPayout };
          handleSubmissionResponse(res, fallback);
        });
      }
      if (onRefreshRoadmap) {
        onRefreshRoadmap();
      }
    }
  };
  const handleAddNewSubmit = async (e) => {
    e.preventDefault();
    if (!formWord || !formMeaningVi || !formImg || !formPron) {
      alert("⚠️ Thiết chế tối thượng (Strict Mode): Tất cả các trường bắt buộc phải có thông tin để đảm bảo liên kết 1-1 không lỗi:\n- Từ vựng (Word)\n- Ý nghĩa (Meaning)\n- Hình ảnh minh họa (ImageUrl)\n- Cách phát âm/Audio (Pronunciation)");
      return;
    }
    const payload = {
      level,
      topic: formTopic,
      word: formWord,
      pronunciation: formPron || `/${formWord}/`,
      meaning_vi: formMeaningVi,
      meaning_en: formMeaningEn,
      example: formExample,
      example_vi: formExampleVi,
      imageUrl: formImg,
      difficulty: formDiff
    };
    try {
      let res;
      if (editingWord) {
        res = await api.editVocabulary(editingWord.id, payload);
      } else {
        res = await api.addVocabulary(payload);
      }
      if (res?.success) {
        alert(editingWord ? "Cập nhật từ vựng thành công!" : "Đã bổ sung từ vựng mới thành công!");
        fetchProgressAndVocabs();
        closeForm();
      } else {
        alert(res?.error || "Gặp sự cố khi lưu từ.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const triggerDelete = async (id, word) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn từ vựng "${word}"?`)) return;
    try {
      const res = await api.deleteVocabulary(id);
      if (res?.success) {
        alert("Đã xóa từ vựng thành công!");
        fetchProgressAndVocabs();
      } else {
        alert(res?.error || "Gặp sự cố khi xóa.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditClick = (voc) => {
    setEditingWord(voc);
    setFormWord(voc.word);
    setFormPron(voc.pronunciation);
    setFormMeaningVi(voc.meaning_vi);
    setFormMeaningEn(voc.meaning_en || "");
    setFormExample(voc.example || "");
    setFormExampleVi(voc.example_vi || "");
    setFormTopic(voc.topic || "Family");
    setFormDiff(voc.difficulty || 1);
    setFormImg(voc.imageUrl || "");
    setIsAddingNew(true);
  };
  const closeForm = () => {
    setIsAddingNew(false);
    setEditingWord(null);
    setFormWord("");
    setFormPron("");
    setFormMeaningVi("");
    setFormMeaningEn("");
    setFormExample("");
    setFormExampleVi("");
    setFormTopic("Family");
    setFormDiff(1);
    setFormImg("");
  };
  const handleSpreadsheetClipboardParse = async () => {
    const raw = prompt("Dán danh sách từ từ bảng Excel (mỗi dòng cách nhau bởi Tab hoặc dấu phẩy):\nDạng thức: Từ, Phiên âm, Nghĩa Việt, Nghĩa Anh, Ví dụ\nVí dụ: hello, /həˈloʊ/, xin chào, greeting, Hello John");
    if (!raw) return;
    const lines = raw.split("\n");
    const parsedWords = [];
    lines.forEach((line) => {
      const parts = line.split(/[,\t]/);
      if (parts.length < 2) return;
      parsedWords.push({
        level,
        word: parts[0]?.trim(),
        pronunciation: parts[1]?.trim() || `/${parts[0]?.trim()}/`,
        meaning_vi: parts[2]?.trim() || "Nghĩa",
        meaning_en: parts[3]?.trim() || "",
        example: parts[4]?.trim() || ""
      });
    });
    if (parsedWords.length === 0) {
      alert("Không tìm thấy dòng từ vựng hợp lệ.");
      return;
    }
    try {
      const res = await api.importVocabularies(parsedWords);
      if (res?.success) {
        alert(`Nhập thành công +${res.count} từ vựng mới vào nhóm ${level}!`);
        fetchProgressAndVocabs();
      } else {
        alert(res?.error || "Không thể nạp dữ liệu.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const filteredVocab = vocabList.filter(
    (v) => v.word.toLowerCase().includes(searchQuery.toLowerCase()) || v.meaning_vi.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const LESSON_SIZE = 10;
  const chunkedLessons = [];
  for (let i = 0; i < vocabList.length; i += LESSON_SIZE) {
    chunkedLessons.push(vocabList.slice(i, i + LESSON_SIZE));
  }
  const currentLevelStudiedIds = vocabList.filter((v) => studiedIds.includes(v.id)).map((v) => v.id);
  const isLessonCompleted = (idx) => {
    const lessonWords = chunkedLessons[idx];
    if (!lessonWords || lessonWords.length === 0) return false;
    return lessonWords.every((w) => currentLevelStudiedIds.includes(w.id));
  };
  const isLessonUnlocked = (idx) => {
    if (idx === 0) return true;
    if (idx >= 1 && idx <= 4) {
      return isLessonCompleted(idx - 1);
    }
    if (idx >= 5 && idx <= 9) {
      const stage1Score2 = (user?.vocabularyStageScores || {})[level + "_stage1"];
      const stage1Passed = stage1Score2 !== void 0 && stage1Score2 >= 80;
      if (!stage1Passed) return false;
      if (idx === 5) return true;
      return isLessonCompleted(idx - 1);
    }
    return false;
  };
  const isStage1TestUnlocked = isLessonCompleted(0) && isLessonCompleted(1) && isLessonCompleted(2) && isLessonCompleted(3) && isLessonCompleted(4);
  const stage1Score = (user?.vocabularyStageScores || {})[level + "_stage1"];
  const isStage1TestPassed = stage1Score !== void 0 && stage1Score >= 80;
  const isStage2Unlocked = isStage1TestPassed;
  const isStage2TestUnlocked = isStage2Unlocked && isLessonCompleted(5) && isLessonCompleted(6) && isLessonCompleted(7) && isLessonCompleted(8) && isLessonCompleted(9);
  const stage2Score = (user?.vocabularyStageScores || {})[level + "_stage2"];
  const isStage2TestPassed = stage2Score !== void 0 && stage2Score >= 80;
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex bg-slate-100 hover:bg-slate-200/50 p-1.5 rounded-2xl max-w-md border border-slate-200/80 transition-colors shadow-sm", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => {
            setMode("vocab");
            setIsExamMode(false);
            setIsCompletedSession(false);
          },
          className: `flex-1 flex items-center justify-center gap-2 py-3 px-5 text-xs font-black rounded-xl transition-all cursor-pointer ${mode === "vocab" ? "bg-white text-indigo-700 shadow-md border border-slate-200/50 scale-[1.02]" : "text-slate-600 hover:text-slate-900"}`,
          children: "📖 TỪ VỰNG CEFR"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 986,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => {
            setMode("flashcards");
            setIsExamMode(false);
            setIsFlipped(false);
            setCurrentIdx(0);
            setIsCompletedSession(false);
          },
          className: `flex-1 flex items-center justify-center gap-2 py-3 px-5 text-xs font-black rounded-xl transition-all cursor-pointer ${mode === "flashcards" ? "bg-white text-indigo-700 shadow-md border border-slate-200/50 scale-[1.02]" : "text-slate-600 hover:text-slate-900"}`,
          children: "📚 FLASH CARD CEFR"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1e3,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
      lineNumber: 985,
      columnNumber: 7
    }, this),
    user.role === "admin" && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "p-1 px-2.5 bg-indigo-650 text-white rounded text-[10px] font-black uppercase tracking-wider", children: "ADMIN MODE" }, void 0, false, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1024,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-700 font-bold", children: "Hệ thống cung cấp toàn quyền quản trị cho tài khoản của bạn." }, void 0, false, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1027,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1023,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setIsAdminOpen(!isAdminOpen),
            className: "text-xs font-black bg-white hover:bg-slate-100 text-slate-700 border border-slate-350 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxDEV(Sliders, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1036,
                columnNumber: 15
              }, this),
              isAdminOpen ? "ẨN QUẢN LÝ TÙ" : "QUẢN LÝ DANH SÁCH TỪ"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1032,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleSpreadsheetClipboardParse,
            className: "text-xs font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-750 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxDEV(FileSpreadsheet, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1043,
                columnNumber: 15
              }, this),
              "IMPORT EXCEL SHEET"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1039,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1031,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
      lineNumber: 1022,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: isAdminOpen && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "bg-white border border-slate-200 rounded-3xl p-6 overflow-hidden space-y-4",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 uppercase tracking-tight", children: [
                "Danh mục quản trị từ vựng level ",
                level
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1061,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500", children: "Thực hiện thêm mới, chỉnh sửa thông tin phát âm, nghĩa, ví dụ minh họa và độ khó." }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1064,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1060,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 w-full md:w-auto", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative flex-1 md:flex-initial", children: [
                /* @__PURE__ */ jsxDEV(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1071,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Tìm kiếm từ...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1072,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1070,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setIsAddingNew(true),
                  className: "px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxDEV(Plus, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1084,
                      columnNumber: 19
                    }, this),
                    " THÊM TỪ"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1080,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1069,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1059,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-black text-slate-805 uppercase tracking-wider flex items-center gap-1.5", children: "🛡️ CÔNG CỤ CHẨN ĐOÁN DỮ LIỆU FLASHCARD CHUẨN 1-1" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1093,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-505 font-medium leading-relaxed", children: "Quét toàn bộ cơ sở dữ liệu hệ thống học tiếng Anh để lập báo cáo về chất lượng gán ảnh, trùng lặp và lỗi liên kết." }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1096,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1092,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleRunDiagnostics,
                  className: "px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxDEV(Search, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1104,
                      columnNumber: 19
                    }, this),
                    " CHẠY CHẨN ĐOÁN TOÀN BỘ"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1100,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1091,
              columnNumber: 15
            }, this),
            diagnosticReport && /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-150 rounded-xl p-4 space-y-4 animate-fade-in text-left", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3 text-center", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-2.5 rounded-lg border border-slate-100", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] uppercase font-extrabold text-slate-500 tracking-wider", children: "Tổng từ vựng" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1112,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xl font-black text-slate-900 mt-0.5", children: diagnosticReport.total }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1113,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1111,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/55", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] uppercase font-extrabold text-rose-500 tracking-wider", children: "Thiếu ảnh" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1116,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xl font-black text-rose-700 mt-0.5", children: diagnosticReport.missing }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1117,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1115,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/55", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] uppercase font-extrabold text-amber-500 tracking-wider", children: "Ảnh lỗi/URL lỗi" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1120,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xl font-black text-amber-700 mt-0.5", children: diagnosticReport.broken }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1121,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1119,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/55", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] uppercase font-extrabold text-indigo-500 tracking-wider", children: "Ảnh trùng" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1124,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xl font-black text-indigo-700 mt-0.5", children: diagnosticReport.duplicates }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1125,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1123,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50/50 p-2.5 rounded-lg border border-red-100/55", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] uppercase font-extrabold text-red-500 tracking-wider", children: "Mapping sai" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1128,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xl font-black text-red-700 mt-0.5", children: diagnosticReport.mismatch }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1129,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1127,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1110,
                columnNumber: 19
              }, this),
              diagnosticReport.details.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold text-slate-700", children: [
                  "Chi tiết sự cố được hệ thống phát hiện (",
                  diagnosticReport.details.length,
                  "):"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1135,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "max-h-[160px] overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-lg text-xs", children: diagnosticReport.details.map((item, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-2 flex justify-between items-center bg-slate-50/20 hover:bg-slate-50 hover:text-slate-950", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: `px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.type === "Thiếu ảnh" ? "bg-rose-100 text-rose-800" : item.type === "URL lỗi" ? "bg-amber-100 text-amber-800" : item.type === "Ảnh trùng" ? "bg-indigo-100 text-indigo-800" : "bg-red-100 text-red-800"}`, children: item.type }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1140,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-800", children: [
                      '"',
                      item.word,
                      '"'
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1147,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-405 font-mono", children: [
                      "(ID: ",
                      item.id,
                      ")"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1148,
                      columnNumber: 31
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1139,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-500 font-semibold italic", children: item.error }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1150,
                    columnNumber: 29
                  }, this)
                ] }, idx, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1138,
                  columnNumber: 27
                }, this)) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1136,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1134,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-bold text-emerald-600 flex items-center gap-1.5 justify-center py-2 bg-emerald-50/50 rounded-xl border border-emerald-105", children: "✨ Hoàn hảo! Không phát hiện bất kỳ sự cố dữ liệu, thiếu ảnh, trùng ảnh hay mapping lỗi nào trên toàn dự án." }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1156,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1109,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1090,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-100 rounded-xl max-h-[300px] overflow-y-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-left text-xs border-collapse", children: [
            /* @__PURE__ */ jsxDEV("thead", { className: "bg-slate-50 text-slate-500 font-bold sticky top-0 border-b border-slate-150", children: /* @__PURE__ */ jsxDEV("tr", { children: [
              /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "Từ vựng (Word)" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1169,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "IPA" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1170,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "Nghĩa tiếng Việt" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1171,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "Chủ đề" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1172,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-3 text-center", children: "Thao tác" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1173,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1168,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1167,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-100", children: [
              filteredVocab.map((voc) => /* @__PURE__ */ jsxDEV("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-bold text-slate-900", children: voc.word }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1179,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-mono text-indigo-700", children: voc.pronunciation }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1180,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-slate-650", children: voc.meaning_vi }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1181,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[10px] font-bold", children: voc.topic || "Family" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1183,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1182,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleEditClick(voc),
                      className: "p-1 hover:bg-slate-100 rounded text-amber-600 cursor-pointer",
                      title: "Sửa từ",
                      children: /* @__PURE__ */ jsxDEV(Edit, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1193,
                        columnNumber: 27
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1188,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => triggerDelete(voc.id, voc.word),
                      className: "p-1 hover:bg-slate-100 rounded text-rose-600 cursor-pointer",
                      title: "Xóa từ",
                      children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1200,
                        columnNumber: 27
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1195,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1187,
                  columnNumber: 23
                }, this)
              ] }, voc.id, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1178,
                columnNumber: 21
              }, this)),
              filteredVocab.length === 0 && /* @__PURE__ */ jsxDEV("tr", { children: /* @__PURE__ */ jsxDEV("td", { colSpan: 5, className: "p-6 text-center text-slate-400", children: "Không tìm thấy từ vựng nào khớp với từ khóa tìm kiếm." }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1207,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1206,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1176,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1166,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1165,
            columnNumber: 13
          }, this),
          isAddingNew && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-6 border border-slate-150 rounded-2xl relative shadow-inner", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: closeForm,
                className: "absolute right-4 top-4 text-slate-400 hover:text-slate-700",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1223,
                  columnNumber: 19
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1219,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-black uppercase text-slate-700 tracking-wider mb-4", children: editingWord ? "CHỈNH SỬA THÔNG TIN TỪ VỰNG" : "THÊM TỪ VỰNG CHUẨN CEFR MỚI" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1225,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleAddNewSubmit, className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Từ vựng (Word) *" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1231,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    required: true,
                    value: formWord,
                    onChange: (e) => setFormWord(e.target.value),
                    placeholder: "e.g. delicious",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1234,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1230,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Phiên âm (IPA)" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1244,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: formPron,
                    onChange: (e) => setFormPron(e.target.value),
                    placeholder: "e.g. /dɪˈlɪʃəs/",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1247,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1243,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Nghĩa tiếng Việt *" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1256,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    required: true,
                    value: formMeaningVi,
                    onChange: (e) => setFormMeaningVi(e.target.value),
                    placeholder: "e.g. ngon miệng",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1259,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1255,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Nghĩa tiếng Anh (Gợi ý định nghĩa)" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1269,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: formMeaningEn,
                    onChange: (e) => setFormMeaningEn(e.target.value),
                    placeholder: "e.g. highly pleasing to taste",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1272,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1268,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Ví dụ tiếng Anh" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1281,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: formExample,
                    onChange: (e) => setFormExample(e.target.value),
                    placeholder: "e.g. This apple pie is delicious.",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1284,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1280,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Ví dụ bản dịch Việt" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1293,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: formExampleVi,
                    onChange: (e) => setFormExampleVi(e.target.value),
                    placeholder: "e.g. Chiếc bánh táo này rất ngon miệng.",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1296,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1292,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Chủ đề (Topic)" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1305,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: formTopic,
                    onChange: (e) => setFormTopic(e.target.value),
                    placeholder: "e.g. Food",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1308,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1304,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Hình ảnh minh họa (Unsplash URL)" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1317,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: formImg,
                    onChange: (e) => setFormImg(e.target.value),
                    placeholder: "Paste Unsplash image URL...",
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1320,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1316,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block mb-1", children: "Mức độ khó (1-5)" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1329,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "number",
                    min: 1,
                    max: 5,
                    value: formDiff,
                    onChange: (e) => setFormDiff(Number(e.target.value)),
                    className: "w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1332,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1328,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-3 flex justify-end gap-2 pt-2", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: closeForm,
                    className: "px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold",
                    children: "HỦY THAO TÁC"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1343,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "submit",
                    className: "px-5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1354,
                        columnNumber: 23
                      }, this),
                      " LƯU TỪ VỰNG"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1350,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1342,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1229,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1218,
            columnNumber: 15
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1053,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
      lineNumber: 1051,
      columnNumber: 7
    }, this),
    !isExamMode ? mode === "vocab" ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-3xl border border-slate-250 shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-2 border-b border-slate-100", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1375,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-slate-800 uppercase", children: "Thẻ ghi nhớ & luyện phát âm AI" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1376,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1374,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 flex-wrap", children: ["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
            const unlocked = isLevelUnlocked(lvl);
            const active = level === lvl;
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  if (!unlocked) {
                    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
                    const idx = levels.indexOf(lvl);
                    const prevLvl = idx > 0 ? levels[idx - 1] : "A1";
                    alert(`🔒 Bạn cần hoàn thành 100% từ vựng ${prevLvl} trước khi mở khóa ${lvl}.`);
                    return;
                  }
                  setLevel(lvl);
                },
                className: `px-3 py-1 text-xs font-bold rounded-lg transition-all border flex items-center gap-1.5 ${active ? "bg-indigo-600 border-indigo-700 text-white shadow-sm" : unlocked ? "bg-white text-slate-600 border-slate-200 hover:text-slate-800 cursor-pointer" : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75"}`,
                children: [
                  !unlocked && /* @__PURE__ */ jsxDEV(Lock, { className: "w-3 h-3 text-slate-400" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1405,
                    columnNumber: 39
                  }, this),
                  unlocked && isLevelCompleted(lvl) && /* @__PURE__ */ jsxDEV(Check, { className: "w-3 h-3 text-emerald-500" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1406,
                    columnNumber: 63
                  }, this),
                  lvl
                ]
              },
              lvl,
              true,
              {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1385,
                columnNumber: 23
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1380,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1373,
          columnNumber: 15
        }, this),
        loading ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-12 text-slate-400 text-xs font-mono", children: [
          /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-5 h-5 animate-spin text-indigo-650 mb-2" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1416,
            columnNumber: 19
          }, this),
          "Đang tải danh mục từ vựng chuẩn khóa ",
          level,
          "..."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1415,
          columnNumber: 17
        }, this) : vocabList.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-7 h-7 text-slate-450 mx-auto" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1421,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-700 mt-2 uppercase", children: "DANH MỤC TRỐNG" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1422,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 mt-1", children: [
            "Không tìm thấy từ vựng nào thuộc cấp độ ",
            level,
            ". Vui lòng thử nạp dữ liệu spreadsheet của admin."
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1423,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1420,
          columnNumber: 17
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pt-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 pb-2", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black text-slate-800", children: [
                "Từ vựng cốt lõi chương ",
                level
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1432,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500", children: "Mỗi chương tự động chia thành 2 Giai đoạn chính với 10 bài luyện tập. Học viên phải vượt qua Bài Test Giai Đoạn 1 để mở khóa Giai đoạn 2, và qua Bài Test Giai Đoạn 2 để hoàn thành chương học." }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1433,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1431,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pb-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/70 border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-2 border-b border-slate-200/65", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV("h4", { className: "font-black text-sm text-slate-800 uppercase flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxDEV("span", { children: "📖" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1443,
                          columnNumber: 35
                        }, this),
                        " Giai đoạn 1 (Bài 1 - 5)"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1442,
                        columnNumber: 33
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 font-medium mt-0.5", children: "Tổng hợp 50 từ vựng nền tảng" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1445,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1441,
                      columnNumber: 31
                    }, this),
                    isStage1TestPassed ? /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150 flex items-center gap-1 scale-95 shadow-sm", children: [
                      /* @__PURE__ */ jsxDEV(Check, { className: "w-3 h-3 text-emerald-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1449,
                        columnNumber: 35
                      }, this),
                      " Đã vượt qua"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1448,
                      columnNumber: 33
                    }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-150 scale-95", children: "Đang học" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1452,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1440,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin", children: chunkedLessons.slice(0, 5).map((lessonWords, idx) => {
                    const isCompleted = isLessonCompleted(idx);
                    const isUnlocked = isLessonUnlocked(idx);
                    const correctCountInLesson = lessonWords.filter((w) => currentLevelStudiedIds.includes(w.id)).length;
                    return /* @__PURE__ */ jsxDEV("div", { className: `p-3 rounded-2xl border transition-all flex items-center justify-between ${isUnlocked ? isCompleted ? "bg-emerald-50/45 border-emerald-200" : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm" : "bg-slate-100 border-slate-150/50 opacity-75"}`, children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${isCompleted ? "bg-emerald-100 text-emerald-700" : isUnlocked ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-400"}`, children: idx + 1 }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1473,
                          columnNumber: 39
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          /* @__PURE__ */ jsxDEV("h5", { className: `font-bold text-xs truncate max-w-[125px] ${isUnlocked ? isCompleted ? "text-emerald-855" : "text-slate-800" : "text-slate-450"}`, children: [
                            "Bài học ",
                            idx + 1
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 1480,
                            columnNumber: 41
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 mt-0.5", children: isCompleted ? "Nắm vững 10/10 từ" : isUnlocked ? "Đang trống" : "Đang khóa" }, void 0, false, {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 1483,
                            columnNumber: 41
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1479,
                          columnNumber: 39
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1472,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                        isUnlocked && !isCompleted && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 scale-95", children: [
                          correctCountInLesson,
                          "/10 từ"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1491,
                          columnNumber: 41
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          "button",
                          {
                            disabled: !isUnlocked,
                            onClick: () => {
                              if (!isUnlocked) return;
                              startLearningExercise(lessonWords, idx);
                            },
                            className: `px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${isCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : isUnlocked ? "bg-indigo-650 hover:bg-indigo-700 text-white shadow-md active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`,
                            children: isCompleted ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                              /* @__PURE__ */ jsxDEV(Check, { className: "w-3 h-3" }, void 0, false, {
                                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                                lineNumber: 1510,
                                columnNumber: 45
                              }, this),
                              " Ôn lại"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 1510,
                              columnNumber: 43
                            }, this) : isUnlocked ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                              /* @__PURE__ */ jsxDEV(Play, { className: "w-3 h-3" }, void 0, false, {
                                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                                lineNumber: 1512,
                                columnNumber: 45
                              }, this),
                              " Học ngay"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 1512,
                              columnNumber: 43
                            }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                              /* @__PURE__ */ jsxDEV(Lock, { className: "w-3 h-3" }, void 0, false, {
                                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                                lineNumber: 1514,
                                columnNumber: 45
                              }, this),
                              " Khóa"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 1514,
                              columnNumber: 43
                            }, this)
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 1495,
                            columnNumber: 39
                          },
                          this
                        )
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1489,
                        columnNumber: 37
                      }, this)
                    ] }, idx, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1465,
                      columnNumber: 35
                    }, this);
                  }) }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1458,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1439,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: `p-4 rounded-2xl border transition-all mt-4 ${isStage1TestPassed ? "bg-emerald-50 border-emerald-250 text-emerald-900 shadow-sm" : isStage1TestUnlocked ? "bg-indigo-50 border-indigo-200 text-indigo-900 animate-pulse-slow shadow-sm" : "bg-slate-100 border-slate-200 text-slate-400"}`, children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxDEV("h5", { className: "font-bold text-xs flex items-center gap-1", children: "📝 Bài Test Giai Đoạn 1" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1534,
                        columnNumber: 33
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: `text-[10px] ${isStage1TestPassed ? "text-emerald-750 font-normal" : isStage1TestUnlocked ? "text-indigo-750 font-medium" : "text-slate-450"}`, children: "Kiểm tra 10 từ ngẫu nhiên từ Bài 1-5 (Phải đạt ≥ 80% để qua)" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1537,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1533,
                      columnNumber: 31
                    }, this),
                    isStage1TestPassed && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded border border-emerald-200", children: [
                      "Đạt: ",
                      stage1Score,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1542,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1532,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "mt-3.5 flex justify-end", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      disabled: !isStage1TestUnlocked,
                      onClick: () => startStageTest(1),
                      className: `px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${isStage1TestPassed ? "bg-emerald-600 hover:bg-emerald-700 text-white" : isStage1TestUnlocked ? "bg-indigo-650 hover:bg-indigo-700 text-white ring-2 ring-indigo-300" : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40"}`,
                      children: isStage1TestPassed ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1561,
                          columnNumber: 37
                        }, this),
                        " Thi lại Test 1"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1561,
                        columnNumber: 35
                      }, this) : isStage1TestUnlocked ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-amber-300 animate-bounce" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1563,
                          columnNumber: 37
                        }, this),
                        " Bắt đầu Test 1"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1563,
                        columnNumber: 35
                      }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(Lock, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1565,
                          columnNumber: 37
                        }, this),
                        " Khóa Test 1"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1565,
                        columnNumber: 35
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1549,
                      columnNumber: 31
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1548,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1525,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1438,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: `bg-slate-50/70 border p-5 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between transition-all ${isStage2Unlocked ? "border-slate-200" : "border-slate-200/50 opacity-60"}`, children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-2 border-b border-slate-200/65", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV("h4", { className: "font-black text-sm text-slate-800 uppercase flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxDEV("span", { children: "🔒" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1580,
                          columnNumber: 35
                        }, this),
                        " Giai đoạn 2 (Bài 6 - 10)"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1579,
                        columnNumber: 33
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 font-medium mt-0.5", children: "Hoàn thành 50 từ nâng cao" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1582,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1578,
                      columnNumber: 31
                    }, this),
                    isStage2TestPassed ? /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150 flex items-center gap-1 scale-95 shadow-sm", children: [
                      /* @__PURE__ */ jsxDEV(Check, { className: "w-3 h-3 text-emerald-600" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1586,
                        columnNumber: 35
                      }, this),
                      " Đã hoàn thành lvl"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1585,
                      columnNumber: 33
                    }, this) : isStage2Unlocked ? /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-150 scale-95", children: "Đang học" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1589,
                      columnNumber: 33
                    }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 scale-95", children: "Chưa mở" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1593,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1577,
                    columnNumber: 29
                  }, this),
                  !isStage2Unlocked ? /* @__PURE__ */ jsxDEV("div", { className: "p-8 text-center text-slate-450 space-y-2 bg-slate-100 rounded-2xl border border-slate-200 border-dashed", children: [
                    /* @__PURE__ */ jsxDEV(Lock, { className: "w-6 h-6 mx-auto text-amber-400 animate-bounce" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1601,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-black tracking-tight text-amber-800 uppercase", children: "Giai đoạn 2 đang khóa" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1602,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 max-w-xs mx-auto", children: "Khóa chặt lộ trình: Hãy đạt từ 8/10 điểm trở lên trong Bài Test Giai Đoạn 1 để mở khóa Giai đoạn 2." }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1603,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1600,
                    columnNumber: 31
                  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin", children: chunkedLessons.slice(5, 10).map((lessonWords, i) => {
                    const idx = i + 5;
                    const isCompleted = isLessonCompleted(idx);
                    const isUnlocked = isLessonUnlocked(idx);
                    const correctCountInLesson = lessonWords.filter((w) => currentLevelStudiedIds.includes(w.id)).length;
                    return /* @__PURE__ */ jsxDEV("div", { className: `p-3 rounded-2xl border transition-all flex items-center justify-between ${isUnlocked ? isCompleted ? "bg-emerald-50/45 border-emerald-200" : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm" : "bg-slate-100 border-slate-150/50 opacity-75"}`, children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${isCompleted ? "bg-emerald-100 text-emerald-700" : isUnlocked ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-400"}`, children: idx + 1 }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1624,
                          columnNumber: 41
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          /* @__PURE__ */ jsxDEV("h5", { className: `font-bold text-xs truncate max-w-[125px] ${isUnlocked ? isCompleted ? "text-emerald-855" : "text-slate-800" : "text-slate-450"}`, children: [
                            "Bài học ",
                            idx + 1
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 1631,
                            columnNumber: 43
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 mt-0.5", children: isCompleted ? "Nắm vững 10/10 từ" : isUnlocked ? "Đang trống" : "Đang khóa" }, void 0, false, {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 1634,
                            columnNumber: 43
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1630,
                          columnNumber: 41
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1623,
                        columnNumber: 39
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                        isUnlocked && !isCompleted && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 scale-95", children: [
                          correctCountInLesson,
                          "/10 từ"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1642,
                          columnNumber: 43
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          "button",
                          {
                            disabled: !isUnlocked,
                            onClick: () => {
                              if (!isUnlocked) return;
                              startLearningExercise(lessonWords, idx);
                            },
                            className: `px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${isCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : isUnlocked ? "bg-indigo-650 hover:bg-indigo-700 text-white shadow-md active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`,
                            children: isCompleted ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                              /* @__PURE__ */ jsxDEV(Check, { className: "w-3 h-3" }, void 0, false, {
                                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                                lineNumber: 1661,
                                columnNumber: 47
                              }, this),
                              " Ôn lại"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 1661,
                              columnNumber: 45
                            }, this) : isUnlocked ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                              /* @__PURE__ */ jsxDEV(Play, { className: "w-3 h-3" }, void 0, false, {
                                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                                lineNumber: 1663,
                                columnNumber: 47
                              }, this),
                              " Học ngay"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 1663,
                              columnNumber: 45
                            }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                              /* @__PURE__ */ jsxDEV(Lock, { className: "w-3 h-3" }, void 0, false, {
                                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                                lineNumber: 1665,
                                columnNumber: 47
                              }, this),
                              " Khóa"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 1665,
                              columnNumber: 45
                            }, this)
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 1646,
                            columnNumber: 41
                          },
                          this
                        )
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1640,
                        columnNumber: 39
                      }, this)
                    ] }, idx, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1616,
                      columnNumber: 37
                    }, this);
                  }) }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1608,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1576,
                  columnNumber: 27
                }, this),
                isStage2Unlocked && /* @__PURE__ */ jsxDEV("div", { className: `p-4 rounded-2xl border transition-all mt-4 ${isStage2TestPassed ? "bg-emerald-50 border-emerald-250 text-emerald-900 shadow-sm" : isStage2TestUnlocked ? "bg-indigo-50 border-indigo-200 text-indigo-900 animate-pulse-slow shadow-sm" : "bg-slate-100 border-slate-200 text-slate-400"}`, children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxDEV("h5", { className: "font-bold text-xs flex items-center gap-1", children: "📝 Bài Test Giai Đoạn 2" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1687,
                        columnNumber: 35
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: `text-[10px] ${isStage2TestPassed ? "text-emerald-750 font-normal" : isStage2TestUnlocked ? "text-indigo-750 font-medium" : "text-slate-450"}`, children: "Kiểm tra 10 từ ngẫu nhiên từ Bài 6-10 (Phải đạt ≥ 80% để qua)" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1690,
                        columnNumber: 35
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1686,
                      columnNumber: 33
                    }, this),
                    isStage2TestPassed && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded border border-emerald-200", children: [
                      "Đạt: ",
                      stage2Score,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1695,
                      columnNumber: 35
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1685,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "mt-3.5 flex justify-end", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      disabled: !isStage2TestUnlocked,
                      onClick: () => startStageTest(2),
                      className: `px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${isStage2TestPassed ? "bg-emerald-600 hover:bg-emerald-700 text-white" : isStage2TestUnlocked ? "bg-indigo-650 hover:bg-indigo-700 text-white ring-2 ring-indigo-300" : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40"}`,
                      children: isStage2TestPassed ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1714,
                          columnNumber: 39
                        }, this),
                        " Thi lại Test 2"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1714,
                        columnNumber: 37
                      }, this) : isStage2TestUnlocked ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-amber-300 animate-bounce" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1716,
                          columnNumber: 39
                        }, this),
                        " Bắt đầu Test 2"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1716,
                        columnNumber: 37
                      }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(Lock, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 1718,
                          columnNumber: 39
                        }, this),
                        " Khóa Test 2"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 1718,
                        columnNumber: 37
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 1702,
                      columnNumber: 33
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 1701,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 1678,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1573,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1436,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1430,
            columnNumber: 19
          }, this),
          false
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1428,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1372,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1371,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 border-b border-slate-100 pb-3", children: [
          /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-4 h-4 text-emerald-600" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1975,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 uppercase", children: "Thống kê & tiến trình học tập" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1976,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1974,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-400 block uppercase", children: "Số từ đã thuộc (Mastered)" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1984,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-2 flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-slate-800", children: stats.totalStudied }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1988,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-450", children: [
                "/ ",
                vocabList.length,
                " từ"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 1991,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1987,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1983,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-400 block uppercase", children: "Chuỗi ngày học liên tục" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1996,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-2 flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-amber-600", children: [
                "🔥 ",
                stats.streakDays
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2e3,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-450", children: "ngày" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2003,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 1999,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 1995,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-400 block uppercase", children: "Độ chính xác luyện tập" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2008,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-2 flex items-baseline gap-0.5", children: /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-emerald-600", children: [
              stats.recentAccuracy,
              "%"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2012,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2011,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2007,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-400 block uppercase", children: "Chủ đề nắm chắc nhất" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2019,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-2 flex items-baseline gap-0.5", children: /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-indigo-700 truncate max-w-full", children: stats.topTopic }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2023,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2022,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2018,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 1982,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 mt-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-[11px] font-bold text-slate-500", children: [
            /* @__PURE__ */ jsxDEV("span", { children: [
              "Hành trình học ",
              level
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2033,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              Math.round(stats.totalStudied / Math.max(vocabList.length, 1) * 100),
              "%"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2034,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2032,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-slate-100 h-2 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "bg-indigo-600 h-2 transition-all duration-500",
              style: { width: `${stats.totalStudied / Math.max(vocabList.length, 1) * 100}%` }
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2039,
              columnNumber: 19
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2038,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2031,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 border-t border-slate-100 pt-4 mt-4", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider text-slate-450 block", children: "Trạng thái Cấp độ CEFR" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2048,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: ["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
            const isCompleted = isLevelCompleted(lvl);
            const isUnlocked = isLevelUnlocked(lvl);
            const isStudying = isUnlocked && !isCompleted;
            const progressPercent = user?.vocabularyProgress?.[lvl] || 0;
            const levelVocabs = allVocabs.filter((v) => v.level === lvl);
            const totalWords = levelVocabs.length || 100;
            const studiedInLvlCount = Math.round(progressPercent / 100 * totalWords);
            return /* @__PURE__ */ jsxDEV("div", { className: "p-3 rounded-2xl border border-slate-100 bg-slate-50/55 space-y-1.5 transition-all", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-slate-800", children: [
                    "Cấp độ ",
                    lvl
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2065,
                    columnNumber: 29
                  }, this),
                  isCompleted ? /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100", children: [
                    /* @__PURE__ */ jsxDEV(Check, { className: "w-2.5 h-2.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2068,
                      columnNumber: 33
                    }, this),
                    " Hoàn thành"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2067,
                    columnNumber: 31
                  }, this) : isStudying ? /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100", children: "📖 Đang học" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2071,
                    columnNumber: 31
                  }, this) : /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100", children: [
                    /* @__PURE__ */ jsxDEV(Lock, { className: "w-2.5 h-2.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2076,
                      columnNumber: 33
                    }, this),
                    " Khóa"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2075,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2064,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500 font-bold", children: [
                  studiedInLvlCount,
                  " / ",
                  totalWords,
                  " từ"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2081,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2063,
                columnNumber: 25
              }, this),
              isUnlocked && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-[10px] font-black text-slate-500", children: /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: [
                  progressPercent,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2089,
                  columnNumber: 31
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2088,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-slate-100 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: `h-1.5 rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-indigo-600"}`,
                    style: { width: `${progressPercent}%` }
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2092,
                    columnNumber: 31
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2091,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2087,
                columnNumber: 27
              }, this)
            ] }, lvl, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2062,
              columnNumber: 23
            }, this);
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2049,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2047,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-xs space-y-3", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider text-indigo-800 block", children: "Phân tích điểm mạnh kỹ năng ngôn ngữ" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2107,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[11px]", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600", children: "Phát âm IPA (Speaking)" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2112,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 w-2/3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-600 h-1.5", style: { width: "90%" } }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2115,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2114,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700", children: "90%" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2117,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2113,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2111,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[11px]", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600", children: "Nghe & Điền từ (Listening)" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2121,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 w-2/3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-600 h-1.5", style: { width: "80%" } }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2124,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2123,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700", children: "80%" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2126,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2122,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2120,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[11px]", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600", children: "Xếp từ giao tiếp (Grammar)" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2130,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 w-2/3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-600 h-1.5", style: { width: "75%" } }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2133,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2132,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700", children: "75%" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2135,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2131,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2129,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2110,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2106,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1973,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 1972,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
      lineNumber: 1369,
      columnNumber: 11
    }, this) : (
      /* ======================================================================
          CHẾ ĐỘ HỌC FLASHCARD THÔNG MINH (SPACED REPETITION)
          ====================================================================== */
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-5 h-5 text-indigo-600 animate-pulse" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2153,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800 uppercase tracking-tight", children: "TIẾN ĐỘ THẺ GHI NHỚ" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2154,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2152,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black tracking-wider text-slate-400", children: "TỔNG SỐ TỪ" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2160,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-slate-800 mt-1", children: vocabList.length }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2161,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2159,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black tracking-wider text-indigo-600", children: "ĐÃ HỌC" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2164,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-indigo-800 mt-1", children: vocabList.filter((v) => srsRatings[v.id] !== void 0).length }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2165,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2163,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black tracking-wider text-emerald-600", children: "ĐÃ NHỚ ✅" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2170,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-emerald-800 mt-1", children: vocabList.filter((v) => srsRatings[v.id] === "good" || srsRatings[v.id] === "easy").length }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2171,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2169,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50/40 p-3 rounded-2xl border border-amber-100 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black tracking-wider text-amber-600", children: "CẦN ÔN TẬP ⏰" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2176,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-amber-800 mt-1", children: vocabList.filter((v) => srsRatings[v.id] === "again" || srsRatings[v.id] === "hard").length }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2177,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2175,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2158,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 pt-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-500", children: "Mức độ thuộc bài:" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2186,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-black text-emerald-600 font-mono", children: [
                vocabList.length > 0 ? Math.round(vocabList.filter((v) => srsRatings[v.id] === "good" || srsRatings[v.id] === "easy").length / vocabList.length * 100) : 0,
                "%"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2187,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2185,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50", children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                style: {
                  width: `${vocabList.length > 0 ? Math.round(vocabList.filter((v) => srsRatings[v.id] === "good" || srsRatings[v.id] === "easy").length / vocabList.length * 100) : 0}%`
                },
                className: "bg-emerald-500 h-full rounded-full transition-all duration-500"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2194,
                columnNumber: 21
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2193,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2184,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "pt-2 border-t border-slate-100 space-y-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] uppercase font-black tracking-wider text-slate-400 block", children: "LỰA CHỌN CẤP ĐỘ CEFR:" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2209,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-1.5", children: ["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
              const unlocked = isLevelUnlocked(lvl);
              const active = level === lvl;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    if (!unlocked) {
                      alert(`🔒 Bạn cần hoàn thành từ vựng cấp độ trước khi mở khóa ${lvl}.`);
                      return;
                    }
                    setLevel(lvl);
                    setCurrentIdx(0);
                    setIsFlipped(false);
                    setIsCompletedSession(false);
                  },
                  className: `py-2 px-3 text-xs font-extrabold rounded-xl transition-all border flex items-center justify-center gap-1.5 ${active ? "bg-indigo-600 border-indigo-700 text-white shadow-sm scale-105 font-black" : unlocked ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer" : "bg-slate-100 text-slate-400 border-slate-150 cursor-not-allowed opacity-75"}`,
                  children: [
                    !unlocked && /* @__PURE__ */ jsxDEV(Lock, { className: "w-3 h-3 text-slate-400" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2235,
                      columnNumber: 41
                    }, this),
                    lvl
                  ]
                },
                lvl,
                true,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2215,
                  columnNumber: 25
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2210,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2208,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2151,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2150,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 space-y-6", children: vocabList.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center", children: [
          /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-10 h-10 text-slate-350 animate-bounce mb-3" }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2249,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-slate-500", children: "Chưa có dữ liệu từ vựng cho cấp độ này." }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2250,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2248,
          columnNumber: 17
        }, this) : isCompletedSession ? /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-8 rounded-3xl border border-indigo-150 shadow-sm flex flex-col items-center text-center space-y-6 w-full animate-fade-in", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-5xl shadow-sm animate-bounce", children: "🏆" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2256,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-1 -right-1 text-2xl animate-pulse", children: "🎉" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2259,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2255,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-black text-indigo-950 uppercase tracking-tight", children: "Chúc mừng! 🎉" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2264,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-slate-700 leading-relaxed max-w-md", children: [
              "Bạn đã hoàn thành toàn bộ ",
              /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-600", children: vocabList.length }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2268,
                columnNumber: 49
              }, this),
              " từ vựng trong bộ Flashcard ",
              /* @__PURE__ */ jsxDEV("span", { className: "p-1 px-2 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-black", children: level }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2268,
                columnNumber: 151
              }, this),
              "."
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2267,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-medium leading-relaxed", children: "Tiếp tục duy trì việc ôn tập mỗi ngày để ghi nhớ lâu hơn và làm chủ tiếng Anh giao tiếp!" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2270,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2263,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full space-y-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-500", children: "Tiến trình hoàn thành" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2278,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-650 font-mono", children: "████████████████ 100%" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2279,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2277,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-500 h-full rounded-full transition-all duration-1000 w-full" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2282,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2281,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2276,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-3.5 text-left", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2", children: "📊 THỐNG KÊ KẾT QUẢ THỰC TẾ" }, void 0, false, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2288,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500 font-bold", children: "Tổng số từ vựng:" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2294,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-935 font-mono text-sm", children: [
                  vocabList.length,
                  " từ"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2295,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2293,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-600 font-bold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-500", children: "🟢" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2299,
                    columnNumber: 27
                  }, this),
                  " Đã nhớ vững vàng:"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2298,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-emerald-700 font-mono text-sm", children: [
                  vocabList.filter((v) => srsRatings[v.id] === "good" || srsRatings[v.id] === "easy").length,
                  " từ"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2301,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2297,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-rose-600 font-bold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-rose-500", children: "🔴" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2307,
                    columnNumber: 27
                  }, this),
                  " Cần ôn tập thêm:"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2306,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-rose-700 font-mono text-sm", children: [
                  vocabList.length - vocabList.filter((v) => srsRatings[v.id] === "good" || srsRatings[v.id] === "easy").length,
                  " từ"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2309,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2305,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "border-t border-dashed border-slate-150 pt-2.5 flex justify-between items-center", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-855 font-black text-xs uppercase", children: "Tỷ lệ ghi nhớ:" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2314,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-black text-indigo-700 text-base font-mono", children: [
                  vocabList.length > 0 ? Math.round(vocabList.filter((v) => srsRatings[v.id] === "good" || srsRatings[v.id] === "easy").length / vocabList.length * 100) : 0,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2315,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2313,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2292,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2287,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-3 w-full pt-2", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setCurrentIdx(0);
                  setIsFlipped(false);
                  setIsCompletedSession(false);
                },
                className: "flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase",
                children: [
                  /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-4 h-4 animate-spin-slow" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2334,
                    columnNumber: 23
                  }, this),
                  " Học lại"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2326,
                columnNumber: 21
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setMode("vocab");
                  setIsCompletedSession(false);
                },
                className: "flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs rounded-xl border border-slate-250 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase",
                children: [
                  /* @__PURE__ */ jsxDEV(Home, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2343,
                    columnNumber: 23
                  }, this),
                  " Thoát"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2336,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2325,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2253,
          columnNumber: 17
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-100 pb-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-indigo-600 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2353,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-indigo-950 uppercase tracking-wide", children: "Học thuật toán Spaced Repetition" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2354,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2352,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-mono", children: [
              "Thẻ ",
              currentIdx + 1,
              " / ",
              vocabList.length
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2356,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2351,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              onClick: () => setIsFlipped(!isFlipped),
              className: "perspective-1000 w-full h-[320px] cursor-pointer",
              style: { touchAction: "none" },
              children: /* @__PURE__ */ jsxDEV("div", { className: `relative w-full h-full preserve-3d transition-transform duration-500 ${isFlipped ? "rotate-y-180" : ""}`, children: [
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 backface-hidden bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-slate-100 text-slate-600 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider", children: vocabList[currentIdx]?.topic || "Family" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2373,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex gap-0.5", children: Array.from({ length: vocabList[currentIdx]?.difficulty || 3 }).map((_, i) => /* @__PURE__ */ jsxDEV(Zap, { className: "w-3.5 h-3.5 text-amber-500 fill-amber-500" }, i, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2378,
                      columnNumber: 31
                    }, this)) }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2376,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2372,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 text-center my-auto", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl overflow-hidden bg-slate-50 border border-slate-150 flex items-center justify-center p-1 shadow-inner", children: (() => {
                      const currentCard = vocabList[currentIdx];
                      if (!currentCard) return null;
                      const currentImageRef = { wordId: currentCard.id };
                      const isMappingValid = currentCard.id === currentImageRef.wordId;
                      if (!isMappingValid) {
                        console.error(`[Assertion Failed] Flashcard-Image Mismatch: flashcardId (${currentCard.id}) !== imageId (${currentImageRef.wordId})`);
                        return /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-red-500 font-bold p-1", children: "Image mapping error detected" }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 2397,
                          columnNumber: 40
                        }, this);
                      }
                      if (!currentCard.imageUrl) {
                        console.error(`[Validation Error] Flashcard word "${currentCard.word}" (ID: ${currentCard.id}) is missing an imageUrl! Displaying default fallback.`);
                        return /* @__PURE__ */ jsxDEV(
                          "img",
                          {
                            referrerPolicy: "no-referrer",
                            src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200",
                            alt: "Default",
                            className: "w-full h-full object-cover rounded-xl transition-all"
                          },
                          currentCard.id + "_" + currentCard.word,
                          false,
                          {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 2403,
                            columnNumber: 35
                          },
                          this
                        );
                      }
                      return /* @__PURE__ */ jsxDEV(
                        "img",
                        {
                          referrerPolicy: "no-referrer",
                          src: currentCard.imageUrl,
                          alt: currentCard.word,
                          className: "w-full h-full object-cover rounded-xl transition-all",
                          onError: (e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200";
                          }
                        },
                        currentCard.id + "_" + currentCard.word,
                        false,
                        {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 2414,
                          columnNumber: 33
                        },
                        this
                      );
                    })() }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2386,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxDEV("h2", { className: "text-4xl font-extrabold text-slate-800 tracking-tight select-none", children: vocabList[currentIdx]?.word }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2429,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-1.5", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-xs text-indigo-650 uppercase tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100", children: vocabList[currentIdx]?.pronunciation }, void 0, false, {
                          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                          lineNumber: 2435,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              if (vocabList[currentIdx]?.word) {
                                handleTTS(vocabList[currentIdx].word);
                              }
                            },
                            className: "p-1 px-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer",
                            title: "Nghe cách phát âm",
                            children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3.5 h-3.5" }, void 0, false, {
                              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                              lineNumber: 2448,
                              columnNumber: 33
                            }, this)
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                            lineNumber: 2438,
                            columnNumber: 31
                          },
                          this
                        )
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2434,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2428,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2384,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-extrabold block text-center uppercase tracking-widest animate-pulse", children: "💡 Bấm vào thẻ để lật xem nghĩa" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2455,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2370,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 backface-hidden rotate-y-180 bg-slate-50 border-2 border-indigo-400 rounded-3xl p-6 flex flex-col justify-between shadow-md", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-indigo-100/40 pb-2", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider", children: "Nghĩa Việt & câu mẫu" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2464,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-xs text-indigo-600 uppercase tracking-wider", children: vocabList[currentIdx]?.pronunciation }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2467,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2463,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 my-auto", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-1", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-black text-indigo-500 tracking-widest block", children: "Bản dịch Tiếng Việt" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2473,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("h3", { className: "text-3xl font-black text-indigo-950 font-sans", children: vocabList[currentIdx]?.meaning_vi }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2474,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2472,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-white hover:bg-indigo-50/20 border-l-4 border-indigo-500 p-4 rounded-r-2xl space-y-1.5 shadow-sm transition-colors", children: [
                      /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-black text-slate-800 leading-relaxed italic", children: [
                        '"',
                        vocabList[currentIdx]?.example,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2481,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-bold text-slate-500 leading-relaxed animate-fade-in", children: vocabList[currentIdx]?.example_vi }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2484,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2480,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2471,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-indigo-400 font-extrabold block text-center uppercase tracking-widest", children: "💡 Bấm để quay lại mặt trước" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2491,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2461,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2367,
                columnNumber: 21
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2362,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-1 relative", children: [
              srsToastMessage && /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-10 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-md z-50 animate-fade-in whitespace-nowrap", children: srsToastMessage }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2503,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-extrabold text-slate-600", children: "Bạn có nhớ từ vựng này không?" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2507,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-450", children: "Lựa chọn phản hồi để máy lập lịch chu kỳ ôn tập tự động." }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2508,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2501,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 max-w-sm mx-auto", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (vocabList[currentIdx]?.id) {
                      handleFlashCardSrsRating(vocabList[currentIdx].id, "again");
                    }
                  },
                  className: "flex-1 py-3 px-4 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100/50 text-xs font-black rounded-2xl transition-all cursor-pointer flex flex-col items-center gap-0.5 active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-base", children: "🔴" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2521,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "Cần ôn tập" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2522,
                      columnNumber: 25
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2512,
                  columnNumber: 23
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (vocabList[currentIdx]?.id) {
                      handleFlashCardSrsRating(vocabList[currentIdx].id, "good");
                    }
                  },
                  className: "flex-1 py-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 text-xs font-black rounded-2xl transition-all cursor-pointer flex flex-col items-center gap-0.5 active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-base", children: "🟢" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2533,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "Đã nhớ từ này" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2534,
                      columnNumber: 25
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2524,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2511,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center max-w-xs mx-auto pt-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  disabled: currentIdx === 0,
                  onClick: (e) => {
                    e.stopPropagation();
                    setCurrentIdx((prev) => prev - 1);
                    setIsFlipped(false);
                  },
                  className: "px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer",
                  children: "Quay lại"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2540,
                  columnNumber: 23
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (currentIdx === vocabList.length - 1) {
                      setIsCompletedSession(true);
                    } else {
                      setCurrentIdx((prev) => prev + 1);
                      setIsFlipped(false);
                    }
                  },
                  className: `px-4 py-2 border text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-95 ${currentIdx === vocabList.length - 1 ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`,
                  children: currentIdx === vocabList.length - 1 ? "Hoàn thành 🎉" : "Kế tiếp"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2551,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2539,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2500,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2348,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2246,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 2147,
        columnNumber: 11
      }, this)
    ) : (
      /* ======================================================================
          ACTIVE GAME MODE (INTERACTIVE EXERCISE PIPELINE)
          ====================================================================== */
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto bg-white border border-slate-250 p-6 rounded-3xl space-y-6 shadow-md", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs font-bold text-slate-500 font-mono", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "uppercase text-indigo-600 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2587,
                columnNumber: 17
              }, this),
              "Luyện tập Duolingo (",
              level,
              ")"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2586,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "Cú đánh combo liên hoàn: 🔥 ",
              comboCount
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2590,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2585,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: examItems.map((_, index) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `flex-1 h-2 rounded-full transition-all duration-350 ${index < examStep ? "bg-emerald-500" : index === examStep ? "bg-indigo-600 scale-y-110" : "bg-slate-200"}`
            },
            index,
            false,
            {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2596,
              columnNumber: 17
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2594,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
          lineNumber: 2584,
          columnNumber: 11
        }, this),
        examFinished ? (() => {
          const isTest = currentLessonIndex < 0;
          const isStage1 = currentLessonIndex === -10;
          const isStage2 = currentLessonIndex === -20;
          const threshold = isTest ? 8 : examItems.length;
          const passed = correctAnswersCount >= threshold;
          const resultTitle = passed ? isStage1 ? "BÀI TEST GIAI ĐOẠN 1 HOÀN THÀNH!" : isStage2 ? "BÀI TEST GIAI ĐOẠN 2 HOÀN THÀNH!" : "BÀI LUYỆN TẬP HOÀN THÀNH TỐT ĐẸP!" : isStage1 ? "CHƯA ĐẠT CHỈ TIÊU GIAI ĐOẠN 1" : isStage2 ? "CHƯA ĐẠT CHỈ TIÊU GIAI ĐOẠN 2" : "CHƯA ĐẠT CHỈ TIÊU BÀI LUYỆN TẬP";
          const resultSubtitle = passed ? isStage1 ? `Chúc mừng! Bạn đã đạt ${correctAnswersCount}/10 điểm và vượt qua Bài Test Giai Đoạn 1. Bạn chính thức mở khóa Giai đoạn 2!` : isStage2 ? `Xuất sắc! Bạn đã đạt ${correctAnswersCount}/10 điểm và vượt qua Bài Test Giai Đoạn 2. Bạn chính thức hoàn thành chương học ${level}!` : `Tuyệt vời! Bạn đã vượt qua BÀI ${currentLessonIndex + 1} và sẵn sàng mở khóa chặng tiếp theo (10/10 điểm).` : isStage1 ? "Bạn cần ôn tập lại Giai đoạn 1 trước khi tiếp tục. Nhấp 'Thử lại bài học' để cải thiện điểm số (yêu cầu tối thiểu 8/10)." : isStage2 ? "Bạn cần ôn tập lại Giai đoạn 2 trước khi tiếp tục. Nhấp 'Thử lại bài học' để cải thiện điểm số (yêu cầu tối thiểu 8/10)." : `Bạn chỉ đạt ${correctAnswersCount}/${examItems.length} câu đúng. Bạn buộc phải đạt tròn 10/10 để qua bài. Hãy thử lại nào!`;
          return /* @__PURE__ */ jsxDEV(
            LessonResultView,
            {
              title: resultTitle,
              subtitle: resultSubtitle,
              correctAnswers: correctAnswersCount,
              totalQuestions: examItems.length,
              xpEarned: passed ? 150 : 0,
              streakDays: user?.streakDays || 1,
              passed,
              achievementsUnlocked: newlyUnlockedAchievements,
              ctaText: "Quay lại trang chính",
              onCtaClick: () => {
                setIsExamMode(false);
                fetchProgressAndVocabs();
                handleBackToHome();
              },
              secondaryCtaText: !passed ? "Thử Lại Bài Học 🔄" : void 0,
              onSecondaryCtaClick: () => {
                if (isStage1) {
                  startStageTest(1);
                } else if (isStage2) {
                  startStageTest(2);
                } else if (currentLessonIndex >= 0) {
                  startLearningExercise(chunkedLessons[currentLessonIndex], currentLessonIndex);
                }
              }
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2644,
              columnNumber: 17
            },
            this
          );
        })() : (
          /* ACTIVE EXERCISE VIEW SHEETS */
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 py-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black tracking-widest text-slate-400", children: [
                examItems[examStep].type === 0 && "Luyện tập Trắc nghiệm từ vựng",
                examItems[examStep].type === 1 && "Bảng ghép thẻ từ ngữ tương đồng",
                examItems[examStep].type === 2 && "Sắp xếp ký tự chữ cái ghép thành từ đúng",
                examItems[examStep].type === 3 && "Lắng nghe máy phát âm khẩu điệu và viết lại từ",
                examItems[examStep].type === 4 && "Điền từ khuyết chính xác hoàn tất câu ví dụ"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2679,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center items-center gap-2", children: [
                /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black tracking-tight text-slate-800 select-none", children: examItems[examStep].type === 0 ? examItems[examStep].payload.questionText : examItems[examStep].type !== 3 ? examItems[examStep].vocab.word : "/ ??? /" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2688,
                  columnNumber: 19
                }, this),
                (examItems[examStep].type === 3 || examItems[examStep].type === 0) && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => handleTTS(examItems[examStep].vocab.word),
                    className: "p-1 px-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg",
                    title: "Phát âm",
                    children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-4 h-4 text-indigo-650" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2701,
                      columnNumber: 23
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2696,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2687,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-600 font-mono italic", children: examItems[examStep].vocab.pronunciation }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2706,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2678,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "py-2", children: [
              examItems[examStep].type === 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto", children: examItems[examStep].payload.choices?.map((choice) => {
                let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                if (isQuestionSubmitted) {
                  if (choice === examItems[examStep].vocab.word) {
                    btnClass = "bg-emerald-500 border-emerald-600 text-white font-extrabold";
                  } else if (selectedMultiChoice === choice) {
                    btnClass = "bg-rose-500 border-rose-600 text-white line-through";
                  }
                } else if (selectedMultiChoice === choice) {
                  btnClass = "bg-indigo-50 border-indigo-400 text-indigo-950 font-black";
                }
                return /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: isQuestionSubmitted,
                    onClick: () => setSelectedMultiChoice(choice),
                    className: `p-3.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnClass}`,
                    children: choice
                  },
                  choice,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2729,
                    columnNumber: 25
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2715,
                columnNumber: 19
              }, this),
              examItems[examStep].type === 1 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto", children: matchPairs.map((card) => {
                let cls = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                if (card.cleared) {
                  cls = "bg-emerald-100 border-emerald-300 text-emerald-800 font-bold opacity-30 cursor-default";
                } else if (selectedMatch === card.id) {
                  cls = "bg-indigo-100 border-indigo-500 text-indigo-950 font-black ring-2 ring-indigo-200";
                }
                return /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: card.cleared || isQuestionSubmitted,
                    onClick: () => handleMatchCardClick(card.id),
                    className: `p-3.5 rounded-xl border text-xs text-center transition-all cursor-pointer min-h-[50px] ${cls}`,
                    children: card.val
                  },
                  card.id,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2754,
                    columnNumber: 25
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2744,
                columnNumber: 19
              }, this),
              examItems[examStep].type === 2 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 max-w-sm mx-auto text-center", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] flex justify-center items-center gap-1", children: [
                  scrambledSelection.map((char, index) => /* @__PURE__ */ jsxDEV(
                    "span",
                    {
                      className: "bg-indigo-150 border border-indigo-250 text-indigo-900 px-2.5 py-1 rounded text-sm font-black",
                      children: char
                    },
                    index,
                    false,
                    {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2773,
                      columnNumber: 25
                    },
                    this
                  )),
                  scrambledSelection.length === 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[10px] uppercase font-bold", children: "Nhấp các chữ cái bên dưới để tạo từ" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2781,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2771,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap justify-center gap-1.5 pt-2", children: scrambledLetters.map((node) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: node.selected || isQuestionSubmitted,
                    onClick: () => handleScrambleClick(node),
                    className: `px-3 py-1.5 rounded-lg border text-xs text-center transition-all cursor-pointer font-black ${node.selected ? "bg-slate-100 text-slate-300 border-slate-200" : "bg-white hover:bg-slate-50 border-slate-350 text-slate-800"}`,
                    children: node.letter
                  },
                  node.id,
                  false,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2790,
                    columnNumber: 25
                  },
                  this
                )) }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2788,
                  columnNumber: 21
                }, this),
                scrambledSelection.length > 0 && !isQuestionSubmitted && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      setScrambledSelection([]);
                      setScrambledLetters((p) => p.map((x) => ({ ...x, selected: false })));
                    },
                    className: "text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 mx-auto",
                    children: [
                      /* @__PURE__ */ jsxDEV(RotateCcw, { className: "w-3 h-3" }, void 0, false, {
                        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                        lineNumber: 2814,
                        columnNumber: 25
                      }, this),
                      " THIẾT LẬP LẠI"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2807,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2769,
                columnNumber: 19
              }, this),
              (examItems[examStep].type === 3 || examItems[examStep].type === 4) && /* @__PURE__ */ jsxDEV("div", { className: "max-w-sm mx-auto space-y-4", children: [
                examItems[examStep].type === 4 && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-center", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-bold text-slate-400 block mb-0.5", children: "Ví dụ mẫu:" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2825,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-serif text-slate-700 leading-relaxed", children: [
                    '"',
                    examItems[examStep].payload.question,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2826,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2824,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-left", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-black text-slate-450 block ml-0.5", children: "Nhập từ vựng phản hồi:" }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2833,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "text",
                      disabled: isQuestionSubmitted,
                      value: inputAnswer,
                      onChange: (e) => setInputAnswer(e.target.value),
                      placeholder: "Type answer here...",
                      className: "w-full bg-slate-50 p-3 outline-none border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-bold text-slate-800"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2836,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2832,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2822,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2712,
              columnNumber: 15
            }, this),
            isQuestionSubmitted && /* @__PURE__ */ jsxDEV("div", { className: `p-4 rounded-2xl text-xs flex gap-3 ${comboCount > 0 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-250"}`, children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg", children: comboCount > 0 ? "🎯" : "❌" }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2856,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "font-extrabold", children: comboCount > 0 ? "Đáp án chính xác!" : "Chưa chính xác!" }, void 0, false, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2860,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] leading-relaxed", children: [
                  "Từ đúng: ",
                  /* @__PURE__ */ jsxDEV("span", { className: "font-black font-mono", children: [
                    '"',
                    examItems[examStep].vocab.word,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2864,
                    columnNumber: 32
                  }, this),
                  " (Phiên âm: ",
                  /* @__PURE__ */ jsxDEV("span", { className: "italic", children: examItems[examStep].vocab.pronunciation }, void 0, false, {
                    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                    lineNumber: 2864,
                    columnNumber: 124
                  }, this),
                  ') nghĩa là "',
                  examItems[examStep].vocab.meaning_vi,
                  '".'
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2863,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2859,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2851,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setIsExamMode(false),
                  className: "text-xs text-slate-450 hover:text-slate-800 underline uppercase font-bold",
                  children: "Rút lui chơi sau"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2872,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: !isQuestionSubmitted ? /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "check-answer-btn",
                  onClick: evaluateQuestionAnswerSubmit,
                  disabled: examItems[examStep].type === 0 && !selectedMultiChoice || examItems[examStep].type === 1 && matchPairs.filter((x) => !x.cleared).length > 0 || examItems[examStep].type === 2 && scrambledSelection.length === 0 || (examItems[examStep].type === 3 || examItems[examStep].type === 4) && !inputAnswer.trim(),
                  className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white text-xs font-black rounded-xl cursor-pointer",
                  children: "Kiểm tra đáp án"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2881,
                  columnNumber: 21
                },
                this
              ) : /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: "next-question-btn",
                  onClick: advanceExerciseStep,
                  className: "px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer animate-fade-in",
                  children: [
                    examStep === examItems.length - 1 ? "Xem kết quả toàn trận" : "Câu hỏi tiếp theo",
                    /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                      lineNumber: 2901,
                      columnNumber: 23
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                  lineNumber: 2895,
                  columnNumber: 21
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
                lineNumber: 2879,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
              lineNumber: 2871,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
            lineNumber: 2676,
            columnNumber: 13
          }, this)
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
        lineNumber: 2582,
        columnNumber: 9
      }, this)
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/VocabularyPracticeSuite.tsx",
    lineNumber: 983,
    columnNumber: 5
  }, this);
}
