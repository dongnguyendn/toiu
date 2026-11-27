import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { Plus, Trash2, Edit2, X, Volume2, Sliders, AlertCircle, Search, BarChart3 } from "lucide-react";
export default function AdminSrsFlashcards() {
  const [vocabularies, setVocabularies] = useState([]);
  const [srsItems, setSrsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("flashcards");
  const [vocabSearch, setVocabSearch] = useState("");
  const [vocabLevelFilter, setVocabLevelFilter] = useState("all");
  const [vocabPage, setVocabPage] = useState(1);
  const itemsPerPage = 8;
  const [showVocabForm, setShowVocabForm] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [word, setWord] = useState("");
  const [ipa, setIpa] = useState("");
  const [meaning, setMeaning] = useState("");
  const [meaningVi, setMeaningVi] = useState("");
  const [category, setCategory] = useState("general");
  const [level, setLevel] = useState("A1");
  const [exampleEn, setExampleEn] = useState("");
  const [exampleVi, setExampleVi] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [srsMultiplier, setSrsMultiplier] = useState(1.5);
  const [srsInitialDays, setSrsInitialDays] = useState(1);
  const [maxIntervalDays, setMaxIntervalDays] = useState(365);
  const fetchAssets = async () => {
    setLoading(true);
    setError("");
    try {
      const vocList = await api.getVocabularies();
      const list = Array.isArray(vocList) ? vocList : vocList?.vocabularies || [];
      setVocabularies(list);
      const srsRes = await fetch("/api/admin/srs/all");
      if (srsRes.ok) {
        const data = await srsRes.json();
        setSrsItems(data.srsReviews || []);
        if (data.config) {
          setSrsMultiplier(data.config.multiplier || 1.5);
          setSrsInitialDays(data.config.initialDays || 1);
          setMaxIntervalDays(data.config.maxIntervalDays || 365);
        }
      }
    } catch {
      setError("Không thể nạp dữ liệu từ máy chủ. Đang hiển thị dữ liệu mô phỏng.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAssets();
  }, []);
  const handleVocabSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!word.trim() || !meaningVi.trim()) {
      setError("Từ mới và Nghĩa tiếng Việt bắt buộc phải nhập.");
      return;
    }
    const payload = {
      word: word.trim(),
      ipa: ipa.trim(),
      meaning: meaning.trim() || meaningVi.trim(),
      meaning_vi: meaningVi.trim(),
      category: category.trim(),
      level,
      example_en: exampleEn.trim() || exampleVi.trim(),
      example_vi: exampleVi.trim(),
      example: exampleEn.trim(),
      imageUrl: imageUrl.trim(),
      audioUrl: audioUrl.trim()
    };
    try {
      const res = await fetch(editingVocab ? `/api/admin/vocabularies/${editingVocab.id}` : "/api/admin/vocabularies", {
        method: editingVocab ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`${editingVocab ? "Cập nhật" : "Thêm mới"} từ vựng thành công!`);
      setShowVocabForm(false);
      setEditingVocab(null);
      resetVocabForm();
      fetchAssets();
    } catch (err) {
      setError(err.message || "Lỗi lưu từ vựng.");
    }
  };
  const handleVocabEditClick = (voc) => {
    setEditingVocab(voc);
    setWord(voc.word || "");
    setIpa(voc.ipa || "");
    setMeaning(voc.meaning || "");
    setMeaningVi(voc.meaning_vi || voc.meaning || "");
    setCategory(voc.category || "general");
    setLevel(voc.level || "A1");
    setExampleEn(voc.example_en || voc.example || "");
    setExampleVi(voc.example_vi || "");
    setImageUrl(voc.imageUrl || "");
    setAudioUrl(voc.audioUrl || vosSoundUrl(voc.word));
    setShowVocabForm(true);
  };
  const vosSoundUrl = (w) => {
    return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(w)}&type=2`;
  };
  const handleVocabDelete = async (id, wName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa từ '${wName}' khỏi danh bạ từ vựng flashcards?`)) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/vocabularies/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess(`Đã xóa thành công từ vựng: ${wName}`);
        fetchAssets();
      } else {
        throw new Error();
      }
    } catch {
      setError("Lỗi máy chủ không thể xóa từ vựng liên kết.");
    }
  };
  const resetVocabForm = () => {
    setWord("");
    setIpa("");
    setMeaning("");
    setMeaningVi("");
    setCategory("general");
    setLevel("A1");
    setExampleEn("");
    setExampleVi("");
    setImageUrl("");
    setAudioUrl("");
  };
  const handleSaveSrsParams = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/srs/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          multiplier: Number(srsMultiplier),
          initialDays: Number(srsInitialDays),
          maxIntervalDays: Number(maxIntervalDays)
        })
      });
      if (res.ok) {
        setSuccess("Lưu tham số thuật toán giãn cách SRS thành công!");
        fetchAssets();
      } else {
        throw new Error();
      }
    } catch {
      setError("Không thể cập nhật tham số SRS.");
    }
  };
  const handleResetSrsQueue = async () => {
    if (!window.confirm("BẠN CÓ CHẮC MUỐN KHỞI ĐỘNG LẠI (RESET) toàn bộ lượt ôn tập SRS của học viên? Tất cả trạng thái ghi nhớ sẽ quay lại điểm xuất phát ban đầu!")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/srs/reset-all", { method: "POST" });
      if (res.ok) {
        setSuccess("Đã khởi động lại toàn bộ chu kỳ ôn tập SRS của tất cả học viên thành công!");
        fetchAssets();
      } else {
        throw new Error();
      }
    } catch {
      setError("Lỗi reset srs.");
    }
  };
  const totalDueItems = srsItems.filter((s) => new Date(s.dueAt) <= /* @__PURE__ */ new Date() && s.status === "scheduled").length;
  const failureCount = {};
  srsItems.forEach((s) => {
    if (s.rating === "again" || s.lastReviewResult === "wrong") {
      const wordName = s.vocab?.word || s.vocabularyId;
      failureCount[wordName] = (failureCount[wordName] || 0) + 1;
    }
  });
  const sortedFailedWords = Object.keys(failureCount).map((w) => ({ word: w, count: failureCount[w] })).sort((a, b) => b.count - a.count).slice(0, 5);
  const freqReviewed = srsItems.map((s) => ({ word: s.vocab?.word || s.vocabularyId, count: s.reviewCount || 0 })).sort((a, b) => b.count - a.count).slice(0, 5);
  const filteredVocabs = vocabularies.filter((v) => {
    const searchMatch = v.word?.toLowerCase().includes(vocabSearch.toLowerCase()) || v.meaning?.toLowerCase().includes(vocabSearch.toLowerCase()) || v.meaning_vi?.toLowerCase().includes(vocabSearch.toLowerCase());
    const levelMatch = vocabLevelFilter === "all" || v.level === vocabLevelFilter;
    return searchMatch && levelMatch;
  });
  const totalVocPage = Math.ceil(filteredVocabs.length / itemsPerPage) || 1;
  const currentVocabs = filteredVocabs.slice((vocabPage - 1) * itemsPerPage, vocabPage * itemsPerPage);
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 py-3 px-4 rounded-xl text-xs flex justify-between border border-red-105 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: error }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 243,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setError(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 244,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 244,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
      lineNumber: 242,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-700 py-3 px-4 rounded-xl text-xs flex justify-between border border-emerald-105 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: success }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 249,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setSuccess(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 250,
        columnNumber: 50
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 250,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
      lineNumber: 248,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-slate-200", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveSubTab("flashcards"),
          className: `px-5 py-3 text-xs font-black uppercase tracking-tight relative transition-all cursor-pointer ${activeSubTab === "flashcards" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-900"}`,
          children: [
            "🗂️ Quản lý Flashcard & Từ vựng (",
            vocabularies.length,
            ")"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 256,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveSubTab("srs"),
          className: `px-5 py-3 text-xs font-black uppercase tracking-tight relative transition-all cursor-pointer ${activeSubTab === "srs" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-900"}`,
          children: "⏳ Đợt Nhớ định kỳ Student (SRS Queue)"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 264,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
      lineNumber: 255,
      columnNumber: 7
    }, this),
    activeSubTab === "flashcards" ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 animate-fade-in", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 w-full md:w-auto", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative w-full md:w-56", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxDEV(Search, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 283,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 282,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocab-search-input",
                type: "text",
                value: vocabSearch,
                onChange: (e) => {
                  setVocabSearch(e.target.value);
                  setVocabPage(1);
                },
                placeholder: "Kiểm từ vựng, nghĩa dịch...",
                className: "w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 285,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 281,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              id: "vocab-filter-level",
              value: vocabLevelFilter,
              onChange: (e) => {
                setVocabLevelFilter(e.target.value);
                setVocabPage(1);
              },
              className: "px-3 py-2 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none",
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Tất cả Cấp Độ" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 301,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "A1", children: "A1" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 302,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "A2", children: "A2" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 303,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "B1", children: "B1" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 304,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "B2", children: "B2" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 305,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "C1", children: "C1" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 306,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "C2", children: "C2" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 307,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 295,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 280,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              resetVocabForm();
              setEditingVocab(null);
              setShowVocabForm(!showVocabForm);
            },
            className: "bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-md transition-all active:translate-y-0.5 flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { className: "w-4.5 h-4.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 319,
                columnNumber: 15
              }, this),
              " THÊM TỪ VỰNG MỚI"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 311,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 278,
        columnNumber: 11
      }, this),
      showVocabForm && /* @__PURE__ */ jsxDEV("div", { id: "vocab-form-card", className: "bg-slate-50 border border-slate-200 p-6 rounded-3xl text-left text-xs space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-200 pb-2.5", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wide", children: editingVocab ? `Sửa từ vựng: ${editingVocab.word}` : "Thêm Thẻ từ vựng học liệu mới" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 328,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setShowVocabForm(false);
                setEditingVocab(null);
              },
              className: "p-1 text-slate-400 bg-slate-200 hover:text-slate-600 rounded cursor-pointer",
              children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 335,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 331,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 327,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("form", { onSubmit: handleVocabSubmit, className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Từ mới (Tiếng Anh)" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 342,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-word",
                type: "text",
                required: true,
                value: word,
                onChange: (e) => setWord(e.target.value),
                placeholder: "e.g. Magnificent",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-extrabold"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 343,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 341,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Phiên âm Quốc tế (IPA)" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 355,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-ipa",
                type: "text",
                value: ipa,
                onChange: (e) => setIpa(e.target.value),
                placeholder: "e.g. /mæɡˈnɪf.ɪ.sənt/",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 356,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 354,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Nghĩa Tiếng Việt" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 367,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-meaning-vi",
                type: "text",
                required: true,
                value: meaningVi,
                onChange: (e) => setMeaningVi(e.target.value),
                placeholder: "e.g. Tráng lệ, nguy nga",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 368,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 366,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Nghĩa Anh - Anh / Định nghĩa" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 380,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-meaning",
                type: "text",
                value: meaning,
                onChange: (e) => setMeaning(e.target.value),
                placeholder: "e.g. Extremely beautiful, elaborate or impressive",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 381,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 379,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "CEFR Phân cấp" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 392,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                id: "vocform-level",
                value: level,
                onChange: (e) => setLevel(e.target.value),
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "A1", children: "A1 - Elementary" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 399,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "A2", children: "A2 - Pre-Int" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 400,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "B1", children: "B1 - Intermediate" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 401,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "B2", children: "B2 - Upper-Int" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 402,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "C1", children: "C1 - Advanced" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 403,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "C2", children: "C2 - Proficient" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 404,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 393,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 391,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Chuyên mục / Chủ đề" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 409,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-category",
                type: "text",
                value: category,
                onChange: (e) => setCategory(e.target.value),
                placeholder: "e.g. Travel, Academic, IT",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 410,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 408,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Hình ảnh URL minh họa" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 421,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-img",
                type: "text",
                value: imageUrl,
                onChange: (e) => setImageUrl(e.target.value),
                placeholder: "Auto loading Unsplash...",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 422,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 420,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Audio URL nghe thử" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 433,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-aud",
                type: "text",
                value: audioUrl,
                onChange: (e) => setAudioUrl(e.target.value),
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 434,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 432,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Ví dụ minh họa (Tiếng Anh)" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 444,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-exen",
                type: "text",
                value: exampleEn,
                onChange: (e) => setExampleEn(e.target.value),
                placeholder: "e.g. The palace looked truly magnificent at sunset.",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 445,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 443,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Dịch ví dụ minh họa (Tiếng Việt)" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 456,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "vocform-exvi",
                type: "text",
                value: exampleVi,
                onChange: (e) => setExampleVi(e.target.value),
                placeholder: "Cung điện trông vô cùng tráng lệ lúc hoàng hôn.",
                className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 457,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 455,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-4 flex justify-end gap-2.5 border-t border-slate-200 pt-2.5", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => {
                  setShowVocabForm(false);
                  setEditingVocab(null);
                },
                className: "px-4 py-2 bg-slate-200 hover:bg-slate-350 font-bold rounded-xl cursor-pointer text-slate-700",
                children: "HỦY"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 468,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                id: "btn-vocabform-submit",
                type: "submit",
                className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl cursor-pointer",
                children: "LƯU THẺ PHÂN PHỐI TỪ"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 475,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 467,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 339,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 326,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: loading ? /* @__PURE__ */ jsxDEV("div", { className: "col-span-4 text-center py-12 text-slate-450 animate-pulse font-bold uppercase tracking-wider", children: "Đang nạp từ vựng hệ thống..." }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 491,
        columnNumber: 15
      }, this) : currentVocabs.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "col-span-4 text-center py-12 text-slate-400 font-semibold leading-relaxed", children: "Không tìm thấy từ vựng nào khớp với thuộc tính tìm kiếm." }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 493,
        columnNumber: 15
      }, this) : currentVocabs.map((vocab) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4.5 rounded-3xl flex flex-col justify-between text-left hover:border-slate-350 hover:shadow-md transition-all gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start gap-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded select-none", children: vocab.level }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 499,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-semibold font-mono text-slate-400", children: [
              "ID: ",
              vocab.id
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 502,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 498,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-900 uppercase tracking-tight", children: vocab.word }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 506,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 text-[10.5px] text-slate-450 font-mono font-medium", children: [
              /* @__PURE__ */ jsxDEV("span", { children: vocab.ipa }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 508,
                columnNumber: 25
              }, this),
              vocab.audioUrl && /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    const audio = new Audio(vocab.audioUrl);
                    audio.play().catch((e) => console.error(e));
                  },
                  className: "text-slate-400 hover:text-slate-600 cursor-pointer",
                  children: /* @__PURE__ */ jsxDEV(Volume2, { className: "w-3.5 h-3.5" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                    lineNumber: 517,
                    columnNumber: 29
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                  lineNumber: 510,
                  columnNumber: 27
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 507,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 505,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-xs border-t border-slate-100 pt-1.5 leading-relaxed", children: [
            /* @__PURE__ */ jsxDEV("p", { className: "font-extrabold text-slate-800", children: vocab.meaning_vi || vocab.meaning }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 524,
              columnNumber: 23
            }, this),
            vocab.meaning && vocab.meaning !== vocab.meaning_vi && /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 font-medium text-[11px] font-sans line-clamp-1", children: vocab.meaning }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 526,
              columnNumber: 25
            }, this),
            vocab.example && /* @__PURE__ */ jsxDEV("p", { className: "text-[10.5px] text-slate-500 font-semibold font-mono leading-normal pt-1 italic line-clamp-2", children: [
              '"',
              vocab.example,
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 530,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 523,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 497,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-1 border-t border-slate-100 pt-2.5", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `btn-voc-edit-${vocab.id}`,
              onClick: () => handleVocabEditClick(vocab),
              className: "p-1.5 border border-slate-200 hover:border-emerald-350 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-xl transition-all cursor-pointer",
              children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 543,
                columnNumber: 23
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 538,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `btn-voc-delete-${vocab.id}`,
              onClick: () => handleVocabDelete(vocab.id, vocab.word),
              className: "p-1.5 border border-slate-200 hover:border-red-350 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded-xl transition-all cursor-pointer",
              children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 550,
                columnNumber: 23
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 545,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 537,
          columnNumber: 19
        }, this)
      ] }, vocab.id, true, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 496,
        columnNumber: 17
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 489,
        columnNumber: 11
      }, this),
      totalVocPage > 1 && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 bg-white", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          "Hiển thị trang ",
          vocabPage,
          "/",
          totalVocPage,
          " (",
          filteredVocabs.length,
          " mục lọc được)"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 561,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setVocabPage((prev) => Math.max(prev - 1, 1)),
              disabled: vocabPage === 1,
              className: "px-3 py-1 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 cursor-pointer",
              children: "Trước"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 564,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setVocabPage((prev) => Math.min(prev + 1, totalVocPage)),
              disabled: vocabPage === totalVocPage,
              className: "px-3 py-1 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 cursor-pointer",
              children: "Sau"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 571,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 563,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 560,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
      lineNumber: 275,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 animate-fade-in", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 self-start", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(Sliders, { className: "w-4.5 h-4.5 text-cyan-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 591,
            columnNumber: 17
          }, this),
          " THAM SỐ THUẬT TOÁN SRS GIAN CÁCH"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 590,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Điều tiết khoảng thời gian lặp lại ôn tập từ vựng dựa theo SuperMemo-2" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 593,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 text-xs font-bold font-mono", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-slate-500", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Hệ số giãn cách (Multiplier)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 599,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-cyan-600 font-black", children: [
                srsMultiplier,
                "x"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 600,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 598,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "range",
                min: "1.1",
                max: "2.5",
                step: "0.1",
                value: srsMultiplier,
                onChange: (e) => setSrsMultiplier(Number(e.target.value)),
                className: "w-full accent-cyan-500"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 602,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-semibold font-sans block leading-normal pt-1", children: "Hệ số nhân kỳ hạn ôn tập sau mỗi lần đánh giá đúng (Mức đề xuất: 1.5)." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 611,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 597,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-slate-500", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Chu kỳ xuất phát đầu (Initial Days)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 618,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600 font-black", children: [
                srsInitialDays,
                " ngày"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 619,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 617,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "number",
                min: "1",
                max: "7",
                value: srsInitialDays,
                onChange: (e) => setSrsInitialDays(Number(e.target.value)),
                className: "w-full border border-slate-200 rounded-xl p-2 font-mono text-slate-900 bg-slate-50 focus:bg-white text-xs"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 621,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-semibold font-sans block leading-normal pt-0.5", children: "Thời gian chờ lặp lại đầu tiên khi thêm từ mới vào SRS (Mức đề xuất: 1 ngày)." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 629,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 616,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-slate-500", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Giới hạn kỳ hạn tối đa (Max Days)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 636,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-violet-600 font-black", children: [
                maxIntervalDays,
                " ngày"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 637,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 635,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "number",
                min: "30",
                max: "365",
                value: maxIntervalDays,
                onChange: (e) => setMaxIntervalDays(Number(e.target.value)),
                className: "w-full border border-slate-200 rounded-xl p-2 font-mono text-slate-900 bg-slate-50 focus:bg-white text-xs"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 639,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 634,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 border-t border-slate-100 pt-3", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleSaveSrsParams,
                className: "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl py-2.5 text-xs tracking-wide transition-all shadow-md active:translate-y-0.5 cursor-pointer",
                children: "ÁP DỤNG HỆ SỐ MỚI"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 650,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleResetSrsQueue,
                className: "w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-black rounded-xl py-2.5 text-xs transition-all cursor-pointer",
                children: "RESET LƯỢT ÔN TẬP"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 657,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 649,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 595,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 589,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-teal-500 to-indigo-600 rounded-3xl p-5 text-white flex justify-between items-center text-left", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black uppercase tracking-wider text-teal-100", children: "Báo cáo hoạt động SRS học viên" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 674,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black font-mono", children: [
              srsItems.length,
              " thẻ lưu trữ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 675,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-teal-100", children: "Cộng đồng học viên hệ thống đang sở hữu ôn tập." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 676,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 673,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-right space-y-1 bg-white/10 p-3 rounded-2xl border border-white/10", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-teal-200 block", children: "Đã Quá Hạn (DUE TODAY):" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 679,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { className: "text-xl font-black font-mono text-amber-300", children: [
              totalDueItems,
              " thẻ"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 680,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 678,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 672,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-3xl text-xs text-left space-y-2", children: [
            /* @__PURE__ */ jsxDEV("h5", { className: "font-extrabold uppercase text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[11px]", children: [
              /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-4 h-4 text-rose-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 690,
                columnNumber: 21
              }, this),
              " TỪ VỰNG SAI & THẤT BẠI NHIỀU NHẤT"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 689,
              columnNumber: 19
            }, this),
            sortedFailedWords.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 font-semibold font-sans py-3", children: "Chưa có ghi nhận gặp sự cố phản xạ từ vựng." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 693,
              columnNumber: 21
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "divide-y divide-slate-100 text-[11px] font-sans", children: sortedFailedWords.map((v, idx) => /* @__PURE__ */ jsxDEV("div", { className: "py-2 flex justify-between items-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-800 uppercase font-mono", children: v.word }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 698,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-black text-rose-600 bg-rose-50 px-2 py-0.2 rounded font-mono", children: [
                v.count,
                " lỗi"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 699,
                columnNumber: 27
              }, this)
            ] }, idx, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 697,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 695,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 688,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-3xl text-xs text-left space-y-2", children: [
            /* @__PURE__ */ jsxDEV("h5", { className: "font-extrabold uppercase text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[11px]", children: [
              /* @__PURE__ */ jsxDEV(BarChart3, { className: "w-4 h-4 text-indigo-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 709,
                columnNumber: 21
              }, this),
              " TỪ VỰNG ÔN TẬP TẦN SUẤT CAO NHẤT"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 708,
              columnNumber: 19
            }, this),
            freqReviewed.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 font-semibold font-sans py-35 py-3", children: "Chưa có ghi nhận ôn tập từ vựng." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 712,
              columnNumber: 21
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "divide-y divide-slate-100 text-[11px] font-sans", children: freqReviewed.map((v, idx) => /* @__PURE__ */ jsxDEV("div", { className: "py-2 flex justify-between items-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-800 uppercase font-mono", children: v.word }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 717,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-black text-indigo-600 bg-indigo-50 px-2 py-0.2 rounded font-mono", children: [
                v.count,
                " lần ôn"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
                lineNumber: 718,
                columnNumber: 27
              }, this)
            ] }, idx, true, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 716,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
              lineNumber: 714,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
            lineNumber: 707,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
          lineNumber: 685,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
        lineNumber: 669,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
      lineNumber: 586,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
      lineNumber: 584,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminSrsFlashcards.tsx",
    lineNumber: 239,
    columnNumber: 5
  }, this);
}
