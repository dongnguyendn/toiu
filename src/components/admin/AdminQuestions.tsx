import React, { useState, useEffect } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { api } from "/src/api.ts";
import QuestionFolderTree from "/src/components/admin/QuestionFolderTree.tsx";
import * as XLSX from "xlsx";
import { db } from "/src/firebase.ts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  X,
  CheckCircle,
  FileAudio,
  Image as ImageIcon,
  Video,
  BarChart2,
  Edit3,
  Trash,
  Upload,
  CheckSquare,
  Square,
  Grid,
  Layout,
  Database,
  Download
} from "lucide-react";
const SKILLS_LIST = [
  { value: "listening", label: "Listening (Nghe)", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/50" },
  { value: "reading", label: "Reading (Đọc)", color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100/50" },
  { value: "speaking", label: "Speaking (Nói)", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50" },
  { value: "writing", label: "Writing (Viết)", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50" },
  { value: "vocabulary", label: "Vocabulary (Từ vựng)", color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100/50" },
  { value: "grammar", label: "Grammar (Ngữ pháp)", color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100/50" },
  { value: "ipa", label: "IPA (Phát âm)", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/50" }
];
export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>({ id: "root" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkActionTarget, setBulkActionTarget] = useState("");
  const [isTreeDrawerOpen, setIsTreeDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportSource, setExportSource] = useState("all");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [skill, setSkill] = useState("listening");
  const [levelNumber, setLevelNumber] = useState(1);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [readingPassage, setReadingPassage] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [speakingTarget, setSpeakingTarget] = useState("");
  const [writingPrompt, setWritingPrompt] = useState("");
  const [explanation, setExplanation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isInactive, setIsInactive] = useState(false);
  const fetchQuestions = async () => {
  };
  useEffect(() => {
    setLoading(true);
    const qCol = query(collection(db, "questions"), where("isDeleted", "!=", true));
    const unsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
      const data = snapshot.docs.map((i) => ({ id: i.id, ...i.data() } as any));
      setQuestions(data.filter((q) => !q.isDeleted));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Không thể nạp danh sách câu hỏi học liệu từ Firestore.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const resetForm = () => {
    setSkill("listening");
    setLevelNumber(1);
    setLessonNumber(1);
    setQuestionText("");
    setAudioUrl("");
    setReadingPassage("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("A");
    setSpeakingTarget("");
    setWritingPrompt("");
    setExplanation("");
    setImageUrl("");
    setVideoUrl("");
    setIsInactive(false);
  };
  const openFormForNew = () => {
    resetForm();
    setEditingQuestion(null);
    if (selectedNode.level !== void 0) {
      setLevelNumber(selectedNode.level);
    }
    if (selectedNode.skill !== void 0) {
      setSkill(selectedNode.skill);
    }
    if (selectedNode.lesson !== void 0) {
      setLessonNumber(selectedNode.lesson);
    }
    setShowForm(true);
  };
  const handleDropQuestion = async (qId, targetLvl, targetSkl, targetLsn) => {
    setError("");
    setSuccess("");
    const targetQ = questions.find((q) => q.id === qId);
    if (!targetQ) return;
    const payload = {
      ...targetQ,
      levelNumber: Number(targetLvl),
      skill: targetSkl,
      lessonNumber: Number(targetLsn)
    };
    try {
      const res = await api.updateAdminQuestion(qId, payload);
      if (res) {
        const labelsMap = { 1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2" };
        setSuccess(`Đã di chuyển câu hỏi [ID: ${qId}] chuyển sang ${labelsMap[targetLvl] || "Cấp " + targetLvl} > ${targetSkl.toUpperCase()} > Bài ${targetLsn}`);
        fetchQuestions();
      }
    } catch (err) {
      setError(err.message || "Lỗi di chuyển câu hỏi.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!questionText.trim()) {
      setError("Vui lòng điền nội dung tiêu đề câu hỏi.");
      return;
    }
    const options = [];
    if (optionA.trim()) options.push(optionA.trim());
    if (optionB.trim()) options.push(optionB.trim());
    if (optionC.trim()) options.push(optionC.trim());
    if (optionD.trim()) options.push(optionD.trim());
    const payload = {
      skill,
      levelNumber: Number(levelNumber),
      lessonNumber: Number(lessonNumber),
      questionText: questionText.trim(),
      audioUrl: audioUrl.trim(),
      readingPassage: readingPassage.trim(),
      options,
      correctAnswer: correctAnswer.toUpperCase(),
      speakingTarget: speakingTarget.trim(),
      writingPrompt: writingPrompt.trim(),
      explanation: explanation.trim(),
      imageUrl: imageUrl.trim(),
      videoUrl: videoUrl.trim(),
      isInactive: !!isInactive
    };
    try {
      if (editingQuestion) {
        const res = await api.updateAdminQuestion(editingQuestion.id, payload);
        if (res) {
          setSuccess(`Cập nhật thành công câu hỏi [ID: ${editingQuestion.id}]`);
          setShowForm(false);
          resetForm();
          fetchQuestions();
        }
      } else {
        const res = await api.createAdminQuestion(payload);
        if (res) {
          setSuccess("Đã lưu thành công câu hỏi học liệu mới!");
          setShowForm(false);
          resetForm();
          fetchQuestions();
        }
      }
    } catch (err) {
      setError(err.message || "Lỗi lưu học liệu.");
    }
  };
  const handleEditClick = (q) => {
    setEditingQuestion(q);
    setSkill(q.skill || "listening");
    setLevelNumber(Number(q.levelNumber) || 1);
    setLessonNumber(Number(q.lessonNumber) || 1);
    setQuestionText(q.questionText || "");
    setAudioUrl(q.audioUrl || "");
    readingPassage;
    setReadingPassage(q.readingPassage || "");
    setOptionA(q.options?.[0] || "");
    setOptionB(q.options?.[1] || "");
    setOptionC(q.options?.[2] || "");
    setOptionD(q.options?.[3] || "");
    setCorrectAnswer(q.correctAnswer || "A");
    setSpeakingTarget(q.speakingTarget || "");
    setWritingPrompt(q.writingPrompt || "");
    setExplanation(q.explanation || "");
    setImageUrl(q.imageUrl || "");
    setVideoUrl(q.videoUrl || "");
    setIsInactive(!!q.isInactive);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có tin chắc muốn xóa câu hỏi này? Hành động này sẽ loại bỏ nó vĩnh viễn.")) return;
    setError("");
    setSuccess("");
    try {
      const ok = await api.deleteAdminQuestion(id);
      if (ok) {
        setSuccess("Đã xóa câu hỏi khỏi ngân hàng thành công.");
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        fetchQuestions();
      }
    } catch (err) {
      setError(err.message || "Không thể thực hiện xóa.");
    }
  };
  const handleClone = async (q) => {
    setError("");
    setSuccess("");
    try {
      const clonedPayload = {
        skill: q.skill,
        levelNumber: Number(q.levelNumber),
        lessonNumber: Number(q.lessonNumber),
        questionText: `${q.questionText} (Bản sao)`,
        audioUrl: q.audioUrl || "",
        readingPassage: q.readingPassage || "",
        options: q.options || [],
        correctAnswer: q.correctAnswer || "A",
        speakingTarget: q.speakingTarget || "",
        writingPrompt: q.writingPrompt || "",
        explanation: q.explanation || "",
        imageUrl: q.imageUrl || "",
        videoUrl: q.videoUrl || "",
        isInactive: !!q.isInactive
      };
      const res = await api.createAdminQuestion(clonedPayload);
      if (res) {
        setSuccess(`Đã sao chép câu hỏi thành công! Bản sao ID: ${res.id || ""}`);
        fetchQuestions();
      }
    } catch (err) {
      setError(err.message || "Lỗi nhân bản câu hỏi.");
    }
  };
  const handleToggleActiveStatus = async (q) => {
    setError("");
    setSuccess("");
    try {
      const inverted = !q.isInactive;
      const res = await api.updateAdminQuestion(q.id, { isInactive: inverted });
      if (res) {
        setSuccess(`Đã ${inverted ? "vô hiệu hóa" : "kích hoạt"} câu hỏi [ID: ${q.id}]`);
        fetchQuestions();
      }
    } catch (err) {
      setError(err.message || "Lỗi sửa trạng thái học liệu.");
    }
  };
  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const result = evt.target?.result;
      if (typeof result === "string") {
        const pieces = result.split(",");
        const base64Excel = pieces[1] || pieces[0] || "";
        if (!base64Excel) {
          setError("Tệp rỗng hoặc không thể đọc được cấu trúc mã base64.");
          return;
        }
        try {
          setLoading(true);
          setError("");
          setSuccess("Đang đẩy file excel lên hệ thống AI phân bổ...");
          const res = await api.importExcelQuestions(base64Excel);
          setSuccess(`Hoàn thành import thành công! Đã nạp thành công ${res.mergedCount || res.count || "nhiều"} câu hỏi vào đúng vị trí.`);
          fetchQuestions();
        } catch (err) {
          setError(err.message || "Xảy ra sự cố khi tải tệp Excel lên máy chủ.");
        } finally {
          setLoading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };
  const handleToggleSelectQuestion = (id) => {
    setSelectedIds(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const executeBulkAction = async (actionType: string, paramVal?: any) => {
    if (selectedIds.length === 0) return;
    setError("");
    setSuccess("");
    if (actionType === "delete") {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} câu hỏi đã chọn? Thao tác không thể hoàn tác.`)) return;
    }
    setLoading(true);
    let okCount = 0;
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          try {
            if (actionType === "delete") {
              await api.deleteAdminQuestion(id);
            } else {
              const originalObj = questions.find((q) => q.id === id);
              if (originalObj) {
                let payloadUpdate: any = {};
                if (actionType === "activate") payloadUpdate.isInactive = false;
                if (actionType === "deactivate") payloadUpdate.isInactive = true;
                if (actionType === "move_level") payloadUpdate.levelNumber = Number(paramVal);
                if (actionType === "move_skill") payloadUpdate.skill = paramVal;
                if (actionType === "move_lesson") payloadUpdate.lessonNumber = Number(paramVal);
                await api.updateAdminQuestion(id, { ...originalObj, ...payloadUpdate });
              }
            }
            okCount++;
          } catch (e) {
            console.error("Bulk processing failed for: " + id, e);
          }
        })
      );
      setSuccess(`Xử lý hàng loạt hoàn tất! Đã cập nhật thành công ${okCount} / ${selectedIds.length} câu hỏi.`);
      setSelectedIds([]);
      fetchQuestions();
    } catch (err) {
      setError("Có lỗi xảy ra trong quá trình xử lý hàng loạt.");
    } finally {
      setLoading(false);
    }
  };
  const handleExportQuestions = () => {
    setError("");
    setSuccess("");
    let targetQuestions = [];
    if (exportSource === "all") {
      targetQuestions = questions;
    } else if (exportSource === "filtered") {
      targetQuestions = finalFilteredQuestions;
    } else if (exportSource === "selected") {
      if (selectedIds.length === 0) {
        setError("Vui lòng chọn ít nhất một câu hỏi để tải xuống.");
        return;
      }
      targetQuestions = questions.filter((q) => selectedIds.includes(q.id));
    }
    if (targetQuestions.length === 0) {
      setError("Không tìm thấy câu hỏi nào thỏa mãn để thực hiện tải xuống.");
      return;
    }
    try {
      const cefrLabels = {
        1: "A1 (Căn bản)",
        2: "A2 (Sơ cấp)",
        3: "B1 (Trung cấp)",
        4: "B2 (Bán chuyên)",
        5: "C1 (Cao cấp)",
        6: "C2 (Bản ngữ)"
      };
      const rows = targetQuestions.map((q) => {
        return {
          "Mã câu hỏi (ID)": q.id || "",
          "Nội dung câu hỏi": q.questionText || "",
          "Loại kỹ năng": q.skill ? q.skill.toUpperCase() : "",
          "Mức độ / Cấp độ CEFR": cefrLabels[q.levelNumber] || `Cấp độ ${q.levelNumber}`,
          "Số bài học (Lesson)": q.lessonNumber >= 11 ? `Test ${q.lessonNumber - 10}` : `Lesson ${q.lessonNumber}`,
          "Đáp án A": q.options?.[0] || "",
          "Đáp án B": q.options?.[1] || "",
          "Đáp án C": q.options?.[2] || "",
          "Đáp án D": q.options?.[3] || "",
          "Đáp án đúng": q.correctAnswer || "",
          "Nội dung nói (Speaking)": q.speakingTarget || "",
          "Đề bài viết (Writing)": q.writingPrompt || "",
          "Đoạn văn đọc (Reading)": q.readingPassage || "",
          "Đường dẫn âm thanh (Audio)": q.audioUrl || "",
          "Đường dẫn hình ảnh": q.imageUrl || "",
          "Đường dẫn video": q.videoUrl || "",
          "Giải thích chi tiết": q.explanation || "",
          "Trạng thái hoạt động": q.isInactive ? "Đã khóa" : "Hoạt động",
          "Ngày tạo": q.createdAt ? new Date(q.createdAt).toLocaleString("vi-VN") : "",
          "Ngày cập nhật": q.updatedAt ? new Date(q.updatedAt).toLocaleString("vi-VN") : ""
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "NganHangCauHoi");
      const fileExtension = exportFormat === "xlsx" ? ".xlsx" : ".csv";
      const filename = `NganHangCauHoi_Export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}${fileExtension}`;
      if (exportFormat === "xlsx") {
        XLSX.writeFile(workbook, filename);
      } else {
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setSuccess("Tải xuống câu hỏi thành công.");
      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Xảy ra lỗi trong quá trình xuất bản và tải câu hỏi: " + err.message);
    }
  };
  const totalCounts = questions.length;
  const inactiveCount = questions.filter((q) => q.isInactive).length;
  const activeCount = totalCounts - inactiveCount;
  const lsnCountGlobal = questions.filter((q) => q.skill === "listening").length;
  const spkCountGlobal = questions.filter((q) => q.skill === "speaking").length;
  const rdCountGlobal = questions.filter((q) => q.skill === "reading").length;
  const wrtCountGlobal = questions.filter((q) => q.skill === "writing").length;
  const extraCountGlobal = questions.filter((q) => !["listening", "speaking", "reading", "writing"].includes(q.skill)).length;
  const currentDirectoryQuestions = questions.filter((q) => {
    if (selectedNode.level !== void 0 && Number(q.levelNumber) !== selectedNode.level) return false;
    if (selectedNode.skill !== void 0 && q.skill !== selectedNode.skill) return false;
    if (selectedNode.lesson !== void 0 && Number(q.lessonNumber) !== selectedNode.lesson) return false;
    return true;
  });
  const getLevelBreakdown = (lvlNumber) => {
    const subset = questions.filter((q) => Number(q.levelNumber) === lvlNumber);
    return {
      total: subset.length,
      listening: subset.filter((q) => q.skill === "listening").length,
      speaking: subset.filter((q) => q.skill === "speaking").length,
      reading: subset.filter((q) => q.skill === "reading").length,
      writing: subset.filter((q) => q.skill === "writing").length,
      extra: subset.filter((q) => !["listening", "speaking", "reading", "writing"].includes(q.skill)).length
    };
  };
  const currentLvlBreakdown = selectedNode.level !== void 0 ? getLevelBreakdown(selectedNode.level) : null;
  const finalFilteredQuestions = currentDirectoryQuestions.filter((q) => {
    const sTerm = searchTerm.toLowerCase();
    const textMatch = !sTerm || q.questionText?.toLowerCase().includes(sTerm) || q.id?.toLowerCase().includes(sTerm) || q.readingPassage?.toLowerCase().includes(sTerm) || q.speakingTarget?.toLowerCase().includes(sTerm) || q.writingPrompt?.toLowerCase().includes(sTerm);
    const statusMatch = statusFilter === "all" || statusFilter === "active" && !q.isInactive || statusFilter === "inactive" && q.isInactive;
    return textMatch && statusMatch;
  });
  const totalItemsFiltered = finalFilteredQuestions.length;
  const totalPages = Math.ceil(totalItemsFiltered / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = finalFilteredQuestions.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const getHeaderPathText = () => {
    const labelsMap = { 1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2" };
    let text = "TẤT CẢ PHÂN PHỐI";
    if (selectedNode.level !== void 0) {
      text = `Cấp độ ${labelsMap[selectedNode.level] || "Level " + selectedNode.level}`;
      if (selectedNode.skill !== void 0) {
        text += ` > Kỹ năng ${selectedNode.skill.toUpperCase()}`;
        if (selectedNode.lesson !== void 0) {
          text += ` > Bài học ${selectedNode.lesson}`;
        }
      }
    }
    return text.toUpperCase();
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs text-slate-800", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 py-3 px-4 rounded-xl text-xs flex justify-between border border-red-100 items-center animate-fade-in shadow-xs", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: [
        "⚠️ ",
        error
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 579,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setError(""), className: "text-slate-400 hover:text-slate-600 cursor-pointer", children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 581,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 580,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 578,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-800 py-3 px-4 rounded-xl text-xs flex justify-between border border-emerald-100 items-center animate-fade-in shadow-xs", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "font-bold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4 h-4 text-emerald-600" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 588,
          columnNumber: 13
        }, this),
        " ",
        success
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 587,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setSuccess(""), className: "text-slate-400 hover:text-slate-600 cursor-pointer", children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 591,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 590,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 586,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col xl:flex-row gap-6 items-start w-full", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "hidden xl:block w-[320px] min-w-[320px] max-w-[320px] shrink-0 space-y-4", children: [
        /* @__PURE__ */ jsxDEV(
          QuestionFolderTree,
          {
            questions,
            selectedNode,
            onSelectNode: (node) => {
              setSelectedNode(node);
              setCurrentPage(1);
            },
            onDropQuestion: handleDropQuestion
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 601,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500", children: [
            /* @__PURE__ */ jsxDEV(Upload, { className: "w-4 h-4 text-slate-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 614,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Nạp Excel Hệ thống" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 615,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 613,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 leading-relaxed", children: "Bạn có tệp danh sách câu hỏi dạng Excel? Hãy chọn tệp để nạp hàng loạt vào cơ sở dữ liệu học trình chuẩn." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 617,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "block w-full text-center bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 hover:border-slate-300 font-extrabold px-3 py-2 rounded-xl cursor-pointer transition-colors shadow-xs", children: [
            "MỞ FILE EXCEL...",
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "excel-question-selector-desktop",
                type: "file",
                accept: ".xlsx,.xls",
                onChange: handleExcelUpload,
                className: "hidden"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 622,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 620,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 612,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 600,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 w-full min-w-0 space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "xl:hidden flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 min-w-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-slate-400 tracking-wider", children: "Cấu trúc chuyên đề" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 639,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "block text-[11px] font-extrabold text-indigo-950 uppercase truncate", children: [
              "📁 ",
              getHeaderPathText()
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 640,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 638,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "btn-trigger-tree-drawer",
              onClick: () => setIsTreeDrawerOpen(true),
              className: "flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-black rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsxDEV(Layout, { className: "w-4 h-4 text-indigo-600 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 647,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Xem Thư mục CEFR" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 648,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 642,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 637,
          columnNumber: 11
        }, this),
        selectedNode.id === "root" ? (
          /* ROOT GLOBAL DASHBOARD */
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg relative overflow-hidden", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 656,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3 mb-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-400 tracking-widest block", children: "LMS Question Bank" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 660,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("h2", { className: "text-[15px] font-black uppercase tracking-tight flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV(Layout, { className: "w-5 h-5 text-indigo-500" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 662,
                    columnNumber: 21
                  }, this),
                  " DASHBOARD CHUNG NGÂN HÀNG CÂU HỎI"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 661,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 659,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-right", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] block text-slate-350 font-semibold uppercase", children: "Tổng quy mô" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 666,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-indigo-300", children: [
                  totalCounts,
                  " câu hỏi"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 667,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 665,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 658,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/4 border border-white/5 p-3 rounded-2xl", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] block text-slate-400 uppercase font-black tracking-wider", children: "🎧 Listening" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 674,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-blue-400 mt-1 block", children: lsnCountGlobal }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 675,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-0.5", children: "câu tập trung" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 676,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 673,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/4 border border-white/5 p-3 rounded-2xl", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] block text-slate-400 uppercase font-black tracking-wider", children: "🗣 Speaking" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 679,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-emerald-400 mt-1 block", children: spkCountGlobal }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 680,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-0.5", children: "bài tương tác" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 681,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 678,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/4 border border-white/5 p-3 rounded-2xl", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] block text-slate-400 uppercase font-black tracking-wider", children: "📖 Reading" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 684,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-pink-400 mt-1 block", children: rdCountGlobal }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 685,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-0.5", children: "văn bản chuyên sâu" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 686,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 683,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/4 border border-white/5 p-3 rounded-2xl", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] block text-slate-400 uppercase font-black tracking-wider", children: "✍ Writing" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 689,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-amber-400 mt-1 block", children: wrtCountGlobal }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 690,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-0.5", children: "chủ đề viết luận" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 691,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 688,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 672,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-4 flex flex-wrap gap-4 text-[10px] text-slate-400 border-t border-slate-800/60 pt-3", children: [
              /* @__PURE__ */ jsxDEV("span", { children: [
                "🟢 Kích hoạt đang chạy: ",
                /* @__PURE__ */ jsxDEV("b", { className: "text-white", children: activeCount }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 696,
                  columnNumber: 47
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 696,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "🔴 Đang khóa/Tạm ẩn: ",
                /* @__PURE__ */ jsxDEV("b", { className: "text-white", children: inactiveCount }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 697,
                  columnNumber: 44
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 697,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "⚡ Chuyên đề khác (Vocab/Grammar/IPA): ",
                /* @__PURE__ */ jsxDEV("b", { className: "text-white", children: extraCountGlobal }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 698,
                  columnNumber: 61
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 698,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 695,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 655,
            columnNumber: 13
          }, this)
        ) : selectedNode.level !== void 0 && selectedNode.skill === void 0 ? (
          /* LEVEL DASHBOARD OVERVIEW */
          /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950 text-indigo-100 rounded-3xl p-5 border border-indigo-900 shadow-md relative overflow-hidden", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 704,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-indigo-900 pb-3 mb-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-400 tracking-wider block", children: "LMS LEVEL STRUCTURE" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 708,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("h2", { className: "text-[14px] font-black uppercase tracking-tight", children: [
                  "📊 THỐNG KÊ CHI TIẾT CẤP ĐỘ ",
                  selectedNode.id.replace("lvl-", "A").toUpperCase().replace("1", "1").replace("2", "2").replace("3", "3").replace("4", "4").replace("5", "5").replace("6", "6"),
                  selectedNode.level === 1 ? "A1" : selectedNode.level === 2 ? "A2" : selectedNode.level === 3 ? "B1" : selectedNode.level === 4 ? "B2" : selectedNode.level === 5 ? "C1" : "C2"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 709,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 707,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 border border-white/10 px-3 py-1 rounded-xl", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] block text-indigo-350 uppercase", children: "Độ phủ Level" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 715,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-emerald-400", children: [
                  currentLvlBreakdown?.total,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 716,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 714,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 706,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-black/20 p-2.5 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 block font-bold", children: "LISTENING" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 722,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black text-indigo-200 mt-0.5 block", children: [
                  currentLvlBreakdown?.listening,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 723,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 721,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-black/20 p-2.5 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 block font-bold", children: "SPEAKING" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 726,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black text-indigo-200 mt-0.5 block", children: [
                  currentLvlBreakdown?.speaking,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 727,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 725,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-black/20 p-2.5 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 block font-bold", children: "READING" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 730,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black text-indigo-200 mt-0.5 block", children: [
                  currentLvlBreakdown?.reading,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 731,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 729,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-black/20 p-2.5 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 block font-bold", children: "WRITING" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 734,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black text-indigo-200 mt-0.5 block", children: [
                  currentLvlBreakdown?.writing,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 735,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 733,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-black/20 p-2.5 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400 block font-bold", children: "KHÁC" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 738,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black text-indigo-200 mt-0.5 block", children: [
                  currentLvlBreakdown?.extra,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 739,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 737,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 720,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 703,
            columnNumber: 13
          }, this)
        ) : (
          /* SKILL OR LESSON SPECIFIC NODE OVERVIEW UPPER BANNER */
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-slate-400 tracking-wider", children: "Thư mục hiện tại" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 747,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-[12.5px] font-black uppercase text-indigo-950 mt-0.5 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV(BarChart2, { className: "w-5 h-5 text-slate-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 749,
                  columnNumber: 19
                }, this),
                getHeaderPathText()
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 748,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 746,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 block font-bold uppercase", children: "Trong thư mục" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 755,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-indigo-750", children: [
                  currentDirectoryQuestions.length,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 756,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 754,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-center shadow-xs", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-indigo-500 block font-bold uppercase", children: "Hiển thị lọc" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 759,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-indigo-700", children: [
                  totalItemsFiltered,
                  " câu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 760,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 758,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 753,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 745,
            columnNumber: 13
          }, this)
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 pt-1", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 w-full md:w-auto", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "relative w-full md:w-64", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxDEV(Search, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 773,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 772,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  id: "search-box-text-admin",
                  type: "text",
                  value: searchTerm,
                  onChange: (e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  },
                  placeholder: "Tìm từ khóa đề bài, ID...",
                  className: "w-full pl-8.5 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 775,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 771,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                id: "select-active-status-local",
                value: statusFilter,
                onChange: (e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                },
                className: "px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold focus:outline-none focus:ring-1 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Trạng thái (Tất cả)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 798,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "active", children: "Kích hoạt (Hoạt động)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 799,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "inactive", children: "Đã tạm khóa" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 800,
                    columnNumber: 17
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 789,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 769,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-2 w-full md:w-auto", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                id: "btn-trigger-export-dialog",
                onClick: () => {
                  setError("");
                  setSuccess("");
                  if (selectedIds.length > 0) {
                    setExportSource("selected");
                  } else {
                    setExportSource("filtered");
                  }
                  setIsExportModalOpen(true);
                },
                className: "bg-emerald-600 hover:bg-emerald-550 text-white font-black px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer flex items-center gap-2 justify-center",
                title: "Tải xuống câu hỏi dưới dạng Excel hoặc CSV",
                children: [
                  /* @__PURE__ */ jsxDEV(Download, { className: "w-4 h-4 text-white shrink-0" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 821,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "LIÊN KẾT TẢI XUỐNG" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 822,
                    columnNumber: 17
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 805,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                id: "btn-trigger-add-quick",
                onClick: openFormForNew,
                className: "bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4.5 py-2.5 rounded-xl tracking-wide shadow-md transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer flex items-center gap-2 justify-center",
                children: [
                  /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4 text-white shrink-0" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 830,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "THÊM CÂU HỎI TRONG THƯ MỤC" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 831,
                    columnNumber: 17
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 825,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 804,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 767,
          columnNumber: 11
        }, this),
        selectedIds.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 text-white border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl animate-fade-in ring-2 ring-indigo-500/50", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(CheckSquare, { className: "w-4 h-4 text-indigo-400" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 840,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-[12px] text-white", children: [
                "ĐÃ LỰA CHỌN ",
                selectedIds.length,
                " CÂU HỎI"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 842,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "block text-[9px] text-slate-400 font-medium", children: "Chọn tác vụ bạn muốn áp dụng hàng loạt bên dưới:" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 843,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 841,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 839,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => executeBulkAction("activate"),
                className: "px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg cursor-pointer text-[10px] uppercase transition-colors",
                children: "Kích hoạt"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 849,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => executeBulkAction("deactivate"),
                className: "px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-lg cursor-pointer text-[10px] uppercase transition-colors",
                children: "Vô hiệu hóa"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 855,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                onChange: (e) => {
                  const val = e.target.value;
                  if (!val) return;
                  if (val.startsWith("lvl-")) {
                    executeBulkAction("move_level", val.replace("lvl-", ""));
                  } else if (val.startsWith("skl-")) {
                    executeBulkAction("move_skill", val.replace("skl-", ""));
                  } else if (val.startsWith("lsn-")) {
                    executeBulkAction("move_lesson", val.replace("lsn-", ""));
                  }
                  e.target.value = "";
                },
                className: "bg-slate-800 border-slate-700 text-white border rounded-lg px-2 py-1.5 text-[10px] outline-none max-w-[150px] font-bold",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- Di chuyển hàng loạt --" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 878,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("optgroup", { label: "Chuyển Cấp độ (CEFR)", children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "lvl-1", children: "Chuyển sang Cấp A1" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 880,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lvl-2", children: "Chuyển sang Cấp A2" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 881,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lvl-3", children: "Chuyển sang Cấp B1" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 882,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lvl-4", children: "Chuyển sang Cấp B2" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 883,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lvl-5", children: "Chuyển sang Cấp C1" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 884,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lvl-6", children: "Chuyển sang Cấp C2" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 885,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 879,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("optgroup", { label: "Chuyển Kỹ năng", children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-listening", children: "Chuyển Listening" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 888,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-speaking", children: "Chuyển Speaking" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 889,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-reading", children: "Chuyển Reading" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 890,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-writing", children: "Chuyển Writing" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 891,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-vocabulary", children: "Chuyển Vocab" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 892,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-grammar", children: "Chuyển Grammar" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 893,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "skl-ipa", children: "Chuyển IPA" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 894,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 887,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("optgroup", { label: "Chuyển Lesson", children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-1", children: "Chuyển Lesson 1" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 897,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-2", children: "Chuyển Lesson 2" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 898,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-3", children: "Chuyển Lesson 3" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 899,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-4", children: "Chuyển Lesson 4" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 900,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-5", children: "Chuyển Lesson 5" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 901,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-11", children: "Chuyển Bài Test 1" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 902,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "lsn-12", children: "Chuyển Bài Test 2" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 903,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 896,
                    columnNumber: 19
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 863,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => executeBulkAction("delete"),
                className: "p-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg cursor-pointer flex items-center justify-center transition-colors",
                title: "Xóa vĩnh viễn hàng loạt đã chọn",
                children: /* @__PURE__ */ jsxDEV(Trash, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 912,
                  columnNumber: 19
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 907,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setSelectedIds([]),
                className: "p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors",
                title: "Bỏ chọn tất cả",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 920,
                  columnNumber: 19
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 915,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 847,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 838,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-left border-collapse text-[11px]", children: [
            /* @__PURE__ */ jsxDEV("thead", { className: "bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider", children: /* @__PURE__ */ jsxDEV("tr", { children: [
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 w-9 text-center", children: /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    const visibleIds = paginatedQuestions.map((q) => q.id);
                    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
                    if (allSelected) {
                      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
                    } else {
                      setSelectedIds((prev) => Array.from(/* @__PURE__ */ new Set([...prev, ...visibleIds])));
                    }
                  },
                  className: "text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none",
                  children: paginatedQuestions.length > 0 && paginatedQuestions.every((q) => selectedIds.includes(q.id)) ? /* @__PURE__ */ jsxDEV(CheckSquare, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 947,
                    columnNumber: 27
                  }, this) : /* @__PURE__ */ jsxDEV(Square, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 949,
                    columnNumber: 27
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 934,
                  columnNumber: 23
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 933,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 w-28", children: "Kỹ năng" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 953,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 w-28 text-center font-mono", children: "CEFR • Lesson" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 954,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4", children: "Yêu cầu & Nội dung Đề bài" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 955,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-2 text-center w-16", children: "Đáp án" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 956,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-2 text-center w-20", children: "Trạng thái" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 957,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 text-right w-24", children: "Lựa chọn" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 958,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 932,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 931,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-100 text-slate-600 font-medium", children: loading ? /* @__PURE__ */ jsxDEV("tr", { children: /* @__PURE__ */ jsxDEV("td", { colSpan: 7, className: "text-center py-12 text-slate-400 font-bold uppercase tracking-wider", children: "Danh sách đang tải..." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 964,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 963,
              columnNumber: 21
            }, this) : paginatedQuestions.length === 0 ? /* @__PURE__ */ jsxDEV("tr", { children: /* @__PURE__ */ jsxDEV("td", { colSpan: 7, className: "text-center py-12 text-slate-400 font-bold", children: "Không có câu hỏi nào thuộc bộ lọc thư mục này. Bạn hãy bấm Thêm Câu Hỏi Mới để tạo nội dung!" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 970,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 969,
              columnNumber: 21
            }, this) : paginatedQuestions.map((q) => {
              const isSelected = selectedIds.includes(q.id);
              const skillObj = SKILLS_LIST.find((s) => s.value === q.skill) || {
                label: q.skill,
                color: "bg-slate-100 text-slate-600 border-slate-300"
              };
              const cefrTextValues = { 1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2" };
              const displayCefr = cefrTextValues[q.levelNumber] || "L" + q.levelNumber;
              return /* @__PURE__ */ jsxDEV(
                "tr",
                {
                  draggable: true,
                  onDragStart: (e) => {
                    e.dataTransfer.setData("text/plain", q.id);
                    e.dataTransfer.effectAllowed = "move";
                  },
                  className: `hover:bg-slate-50 transition-colors cursor-grab active:cursor-grabbing ${isSelected ? "bg-slate-50 border-l-2 border-indigo-600" : ""} ${q.isInactive ? "opacity-60 bg-slate-50/50" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3 px-4 text-center align-middle", children: /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handleToggleSelectQuestion(q.id),
                        className: "text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none",
                        children: isSelected ? /* @__PURE__ */ jsxDEV(CheckSquare, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1003,
                          columnNumber: 33
                        }, this) : /* @__PURE__ */ jsxDEV(Square, { className: "w-4 h-4" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1005,
                          columnNumber: 33
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 998,
                        columnNumber: 29
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 997,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3.5 px-4 align-middle", children: [
                      /* @__PURE__ */ jsxDEV(
                        "span",
                        {
                          className: `inline-block text-[9px] font-black uppercase border rounded px-2 py-0.5 leading-none select-none ${skillObj.color}`,
                          children: skillObj.label.split(" ")[0]
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1012,
                          columnNumber: 29
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-mono text-slate-450 block mt-1", children: [
                        "ID: ",
                        q.id
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1017,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1011,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3.5 px-4 text-center align-middle font-black font-mono text-slate-700", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-100 px-1.5 py-0.5 rounded text-indigo-755 mr-1 text-[9.5px]", children: [
                        "CEFR ",
                        displayCefr
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1022,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500", children: [
                        "Ls ",
                        q.lessonNumber >= 11 ? `Test ${q.lessonNumber - 10}` : q.lessonNumber
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1025,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1021,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3.5 px-4 max-w-sm md:max-w-md", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-left", children: [
                      /* @__PURE__ */ jsxDEV("p", { className: "text-slate-900 font-extrabold line-clamp-2 leading-relaxed", children: q.questionText }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1033,
                        columnNumber: 31
                      }, this),
                      q.options && q.options.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9.5px] text-slate-450 font-semibold italic", children: q.options.map((opt, idx) => /* @__PURE__ */ jsxDEV("span", { className: "line-clamp-1 truncate", children: [
                        idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D",
                        ". ",
                        opt
                      ] }, idx, true, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1039,
                        columnNumber: 37
                      }, this)) }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1037,
                        columnNumber: 33
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                        q.speakingTarget && /* @__PURE__ */ jsxDEV("span", { className: "inline-block text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono px-1.5 py-0.2 rounded-md", children: [
                          'Nói: "',
                          q.speakingTarget,
                          '"'
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1047,
                          columnNumber: 35
                        }, this),
                        q.writingPrompt && /* @__PURE__ */ jsxDEV("span", { className: "inline-block text-[8px] bg-amber-50 text-amber-850 border border-amber-100 font-mono px-1.5 py-0.2 rounded-md", children: [
                          'Viết: "',
                          q.writingPrompt,
                          '"'
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1052,
                          columnNumber: 35
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1045,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1032,
                      columnNumber: 29
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1031,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3.5 px-2 text-center align-middle", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shadow-2xs", children: q.correctAnswer || "A" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1062,
                      columnNumber: 29
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1061,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3 px-2 text-center align-middle", children: /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handleToggleActiveStatus(q),
                        className: "focus:outline-none transition-transform active:scale-95 cursor-pointer text-[9px]",
                        children: q.isInactive ? /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 font-bold text-rose-700 bg-rose-50 border border-rose-250 px-2 py-0.5 rounded leading-none select-none uppercase", children: "Khóa" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1074,
                          columnNumber: 33
                        }, this) : /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded leading-none select-none uppercase", children: "Hoạt động" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1078,
                          columnNumber: 33
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                        lineNumber: 1069,
                        columnNumber: 29
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1068,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("td", { className: "py-3 px-4 text-right align-middle", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-end gap-1.5", children: [
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleClone(q),
                          className: "p-1.5 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-550 rounded-xl cursor-pointer",
                          title: "Nhân sao chép",
                          children: /* @__PURE__ */ jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                            lineNumber: 1093,
                            columnNumber: 33
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1088,
                          columnNumber: 31
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleEditClick(q),
                          className: "p-1.5 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-550 hover:text-emerald-750 rounded-xl cursor-pointer",
                          title: "Chỉnh sửa câu",
                          children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                            lineNumber: 1100,
                            columnNumber: 33
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1095,
                          columnNumber: 31
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleDelete(q.id),
                          className: "p-1.5 border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-400 hover:text-rose-600 rounded-xl cursor-pointer",
                          title: "Xóa",
                          children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                            lineNumber: 1107,
                            columnNumber: 33
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                          lineNumber: 1102,
                          columnNumber: 31
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1087,
                      columnNumber: 29
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1086,
                      columnNumber: 27
                    }, this)
                  ]
                },
                q.id,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 985,
                  columnNumber: 25
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 961,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 930,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 929,
            columnNumber: 13
          }, this),
          totalPages > 1 && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-slate-500 text-[10.5px]", children: [
            /* @__PURE__ */ jsxDEV("span", { children: [
              "Hiển thị ",
              /* @__PURE__ */ jsxDEV("b", { children: [
                startIndex + 1,
                " - ",
                Math.min(startIndex + itemsPerPage, totalItemsFiltered)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1123,
                columnNumber: 28
              }, this),
              " trong số ",
              /* @__PURE__ */ jsxDEV("b", { children: totalItemsFiltered }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1123,
                columnNumber: 121
              }, this),
              " câu phù hợp"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1122,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handlePageChange(currentPage - 1),
                  disabled: currentPage === 1,
                  className: "px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer select-none font-bold",
                  children: "Trước"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1127,
                  columnNumber: 19
                },
                this
              ),
              Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && p - prevPage > 1;
                return /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
                  showEllipsis && /* @__PURE__ */ jsxDEV("span", { className: "px-1 text-slate-400", children: "..." }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1142,
                    columnNumber: 44
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handlePageChange(p),
                      className: `w-6 h-6 rounded-lg cursor-pointer ${currentPage === p ? "bg-indigo-600 text-white font-black" : "border border-slate-200 bg-white hover:bg-slate-100 text-slate-650"}`,
                      children: p
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1143,
                      columnNumber: 27
                    },
                    this
                  )
                ] }, p, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1141,
                  columnNumber: 25
                }, this);
              }),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handlePageChange(currentPage + 1),
                  disabled: currentPage === totalPages,
                  className: "px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer select-none font-bold",
                  children: "Sau"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1157,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1126,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1121,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 927,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 634,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 597,
      columnNumber: 7
    }, this),
    isTreeDrawerOpen && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-50 flex xl:hidden transition-opacity", children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in",
          onClick: () => setIsTreeDrawerOpen(false)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1175,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "relative flex flex-col w-[320px] max-w-[85vw] h-full bg-white shadow-2xl p-4 overflow-y-auto animate-fade-in space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between pb-3 border-b border-slate-150", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(Database, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1183,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-950 uppercase text-[11px] tracking-wider", children: "Cơ cấu cây CEFR" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1184,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1182,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setIsTreeDrawerOpen(false),
              className: "p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-205 rounded-xl cursor-pointer",
              children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1190,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1186,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1181,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxDEV(
          QuestionFolderTree,
          {
            questions,
            selectedNode,
            onSelectNode: (node) => {
              setSelectedNode(node);
              setCurrentPage(1);
              setIsTreeDrawerOpen(false);
            },
            onDropQuestion: handleDropQuestion
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1195,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1194,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500", children: [
            /* @__PURE__ */ jsxDEV(Upload, { className: "w-4 h-4 text-slate-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1210,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Nạp Excel Hệ thống" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1211,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1209,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 leading-relaxed font-semibold", children: "Nạp tệp Excel câu hỏi học trình chuẩn trên thiết bị." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1213,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "block w-full text-center bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 hover:border-slate-300 font-extrabold px-3 py-2 rounded-xl cursor-pointer transition-colors shadow-xs", children: [
            "MỞ FILE EXCEL...",
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "excel-question-selector-mobile",
                type: "file",
                accept: ".xlsx,.xls",
                onChange: handleExcelUpload,
                className: "hidden"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1218,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1216,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1208,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 1180,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 1173,
      columnNumber: 9
    }, this),
    isExportModalOpen && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-205 rounded-3xl max-w-md w-full p-6 text-slate-800 space-y-6 shadow-2xl relative", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setIsExportModalOpen(false),
          className: "absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors",
          children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1239,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1235,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-150 pb-3 flex items-start gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-emerald-50 text-emerald-600 rounded-xl", children: /* @__PURE__ */ jsxDEV(Download, { className: "w-5 h-5" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1245,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1244,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black uppercase text-indigo-950 tracking-wide", children: "Tải xuống câu hỏi học trình" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1248,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "Lựa chọn phạm vi dữ liệu và định dạng tệp để tải về ngoại tuyến." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1251,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1247,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 1243,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-black uppercase text-slate-400 tracking-wider text-left", children: "1. Phạm vi dữ liệu xuất bản" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1261,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors", children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "radio",
                  name: "exportSource",
                  value: "all",
                  checked: exportSource === "all",
                  onChange: () => setExportSource("all"),
                  className: "w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1266,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-xs font-bold text-slate-800", children: "Toàn bộ ngân hàng học liệu" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1275,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400", children: [
                  "Tải tất cả ",
                  questions.length,
                  " câu hỏi hiện có trong kho dữ liệu"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1276,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1274,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1265,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors", children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "radio",
                  name: "exportSource",
                  value: "filtered",
                  checked: exportSource === "filtered",
                  onChange: () => setExportSource("filtered"),
                  className: "w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1281,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-xs font-bold text-slate-800", children: "Theo bộ lọc và phân mục hiện tại" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1290,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400", children: [
                  "Tải ",
                  finalFilteredQuestions.length,
                  " câu hỏi phù hợp bộ lọc tìm kiếm"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1291,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1289,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1280,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: `flex items-center gap-3 p-3 border rounded-xl transition-colors cursor-pointer ${selectedIds.length === 0 ? "border-slate-100 opacity-60 bg-slate-50/50 cursor-not-allowed" : "border-slate-200 hover:bg-slate-50"}`, children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "radio",
                  name: "exportSource",
                  value: "selected",
                  checked: exportSource === "selected",
                  disabled: selectedIds.length === 0,
                  onChange: () => setExportSource("selected"),
                  className: "w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 disabled:opacity-50 cursor-pointer"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1298,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "text-left font-bold", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "block text-xs font-bold text-slate-800", children: [
                  "Các câu hỏi đã lựa chọn (",
                  selectedIds.length,
                  ")"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1308,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "block text-[10px] text-slate-400", children: selectedIds.length > 0 ? `Tải ${selectedIds.length} câu đã tích chọn checkbox` : "Vui lòng chọn checkbox ở danh sách phía dưới trước" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1309,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1307,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1295,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1264,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1260,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-black uppercase text-slate-400 tracking-wider text-left", children: "2. Định dạng tệp tin tải về" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1321,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDEV("label", { className: `flex flex-col items-center justify-center p-3.5 border rounded-2xl cursor-pointer transition-all ${exportFormat === "xlsx" ? "border-indigo-600 bg-indigo-50/20 text-indigo-700 ring-2 ring-indigo-500/20" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`, children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "radio",
                  name: "exportFormat",
                  value: "xlsx",
                  checked: exportFormat === "xlsx",
                  onChange: () => setExportFormat("xlsx"),
                  className: "sr-only"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1330,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(Grid, { className: "w-5 h-5 text-emerald-600 mb-1" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1338,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-extrabold uppercase", children: "Excel (.xlsx)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1339,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 mt-0.5", children: "Khuyên dùng, đầy đủ cột" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1340,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1325,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: `flex flex-col items-center justify-center p-3.5 border rounded-2xl cursor-pointer transition-all ${exportFormat === "csv" ? "border-indigo-600 bg-indigo-50/20 text-indigo-700 ring-2 ring-indigo-500/20" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`, children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "radio",
                  name: "exportFormat",
                  value: "csv",
                  checked: exportFormat === "csv",
                  onChange: () => setExportFormat("csv"),
                  className: "sr-only"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1348,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(Database, { className: "w-5 h-5 text-blue-500 mb-1" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1356,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-extrabold uppercase", children: "CSV (.csv)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1357,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 mt-0.5", children: "Hỗ trợ phân rã máy tính thô" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1358,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1343,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1324,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1320,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 1258,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 pt-2 border-t border-slate-150", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => setIsExportModalOpen(false),
            className: "flex-1 py-2.5 px-4 font-extrabold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase text-[11px] tracking-wide cursor-pointer text-center",
            children: "Hủy bỏ"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1366,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: handleExportQuestions,
            className: "flex-1 py-2.5 px-4 font-black bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl shadow-lg transition-all active:scale-95 uppercase text-[11px] tracking-wide cursor-pointer text-center flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxDEV(Download, { className: "w-3.5 h-3.5 text-white" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1378,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: "Bắt đầu tải về" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1379,
                columnNumber: 17
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1373,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 1365,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 1234,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 1233,
      columnNumber: 9
    }, this),
    showForm && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 text-slate-800 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => {
            setShowForm(false);
            setEditingQuestion(null);
            resetForm();
          },
          className: "absolute right-4 top-4 p-1.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-full cursor-pointer transition-colors",
          children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1398,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1390,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-150 pb-3", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black uppercase text-indigo-700 tracking-wide flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(Edit3, { className: "w-4 h-4 animate-bounce text-indigo-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1403,
            columnNumber: 17
          }, this),
          editingQuestion ? `Chỉnh sửa học trình ID: ${editingQuestion.id}` : "Nhập câu hỏi học trình mới"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1402,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-1", children: "Điền chính xác các thành tố câu hỏi để hệ thống sắp xếp tự động vào cấu trúc cây rèn luyện của học viên." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1406,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 1401,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-400 font-extrabold block mb-1", children: "Cấp độ học (Khung CEFR)" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1416,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                id: "form-q-lvl",
                value: levelNumber,
                onChange: (e) => setLevelNumber(Number(e.target.value)),
                className: "w-full border border-slate-250 p-2 bg-white rounded-xl focus:outline-none",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: 1, children: "Cấp độ A1 (Level 1)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1423,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 2, children: "Cấp độ A2 (Level 2)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1424,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 3, children: "Cấp độ B1 (Level 3)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1425,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 4, children: "Cấp độ B2 (Level 4)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1426,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 5, children: "Cấp độ C1 (Level 5)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1427,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 6, children: "Cấp độ C2 (Level 6)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1428,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1417,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1415,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-400 font-extrabold block mb-1", children: "Mục tiêu Kỹ năng" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1433,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                id: "form-q-skl",
                value: skill,
                onChange: (e) => setSkill(e.target.value),
                className: "w-full border border-slate-250 p-2 bg-white rounded-xl focus:outline-none",
                children: SKILLS_LIST.map((sk) => /* @__PURE__ */ jsxDEV("option", { value: sk.value, children: sk.label }, sk.value, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1441,
                  columnNumber: 23
                }, this))
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1434,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1432,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-400 font-extrabold block mb-1 font-mono", children: "Lesson (Bài 1-5 hoặc Test 11, 12)" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1449,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                id: "form-q-lsn",
                value: lessonNumber,
                onChange: (e) => setLessonNumber(Number(e.target.value)),
                className: "w-full border border-slate-250 p-2 bg-white rounded-xl focus:outline-none font-mono",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: 1, children: "Bài học (Lesson) 1" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1456,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 2, children: "Bài học (Lesson) 2" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1457,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 3, children: "Bài học (Lesson) 3" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1458,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 4, children: "Bài học (Lesson) 4" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1459,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 5, children: "Bài học (Lesson) 5" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1460,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 11, children: "Bài Test cuối chặng 1 (Test 1)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1461,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 12, children: "Bài Test cuối chặng 2 (Test 2)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1462,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1450,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1448,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1414,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-600 font-extrabold block mb-0.5", children: "Nội dung câu hỏi hoặc Đề bài chính (Yêu cầu)" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1469,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(
            "textarea",
            {
              id: "form-q-text",
              rows: 2,
              value: questionText,
              onChange: (e) => setQuestionText(e.target.value),
              placeholder: "Ví dụ: Choose the correct option to fill the gap...",
              className: "w-full border border-slate-200 bg-slate-50 hover:bg-white rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-900",
              required: true
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1470,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1468,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-indigo-50/20 p-3.5 border border-indigo-50 rounded-2xl", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-indigo-900 font-bold block flex items-center gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsxDEV(FileAudio, { className: "w-3.5 h-3.5 text-indigo-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1484,
                columnNumber: 21
              }, this),
              " Văn bản phát âm / Reading Passage / Transcript"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1483,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                id: "form-q-passage",
                rows: 2.5,
                value: readingPassage,
                onChange: (e) => setReadingPassage(e.target.value),
                placeholder: "Điền đoạn hội thoại hoặc văn bản tiếng Anh dùng cho đọc/nghe...",
                className: "w-full border border-slate-200 bg-white rounded-xl p-2.5 text-slate-800"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1486,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1482,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-indigo-900 font-bold block text-[10px]", children: "Audio URL hoặc Text-to-Speech đọc mẫu" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1498,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  id: "form-q-audio",
                  type: "text",
                  value: audioUrl,
                  onChange: (e) => setAudioUrl(e.target.value),
                  placeholder: "Điền URL liên kết tệp âm thanh hoặc văn bản để TTS...",
                  className: "w-full border border-slate-250 bg-white rounded-xl p-2 text-slate-800"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1499,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1497,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold text-[9px] block", children: "Mục tiêu Nói (Speaking)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1511,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    id: "form-q-speaking",
                    type: "text",
                    value: speakingTarget,
                    onChange: (e) => setSpeakingTarget(e.target.value),
                    placeholder: "e.g. hello standard",
                    className: "w-full border border-slate-200 bg-white rounded-xl p-1.5 text-slate-800"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1512,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1510,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold text-[9px] block", children: "Chủ đề Viết (Writing)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1522,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    id: "form-q-writing",
                    type: "text",
                    value: writingPrompt,
                    onChange: (e) => setWritingPrompt(e.target.value),
                    placeholder: "e.g. describe home",
                    className: "w-full border border-slate-200 bg-white rounded-xl p-1.5 text-slate-800"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1523,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1521,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1509,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1496,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1481,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-3.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-[10.5px] uppercase text-slate-600 block border-b border-slate-200 pb-1 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Các phương án trắc nghiệm" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1539,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9.5px] text-indigo-600 italic", children: "Chọn nút chấm tròn để đặt làm đáp án đúng" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1540,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1538,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2.5", children: [
            { label: "Phương án A", state: optionA, set: setOptionA, key: "A" },
            { label: "Phương án B", state: optionB, set: setOptionB, key: "B" },
            { label: "Phương án C", state: optionC, set: setOptionC, key: "C" },
            { label: "Phương án D", state: optionD, set: setOptionD, key: "D" }
          ].map((opt) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 focus-within:border-indigo-400",
              children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "radio",
                    name: "correct_radio",
                    checked: correctAnswer === opt.key,
                    onChange: () => setCorrectAnswer(opt.key),
                    className: "w-4 h-4 accent-indigo-600 cursor-pointer shrink-0 ml-1"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1554,
                    columnNumber: 23
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "w-full flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-slate-400 block w-9 shrink-0", children: [
                    opt.key,
                    ":"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                    lineNumber: 1562,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "text",
                      value: opt.state,
                      onChange: (e) => opt.set(e.target.value),
                      placeholder: "Bỏ trống nếu không dùng",
                      className: "w-full bg-transparent border-none p-0.5 outline-none focus:ring-0 text-slate-900 text-xs"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                      lineNumber: 1563,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                  lineNumber: 1561,
                  columnNumber: 23
                }, this)
              ]
            },
            opt.key,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1550,
              columnNumber: 21
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1543,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1537,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold block mb-1 flex items-center gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsxDEV(ImageIcon, { className: "w-3.5 h-3.5 text-slate-405" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1580,
                columnNumber: 21
              }, this),
              " Hình ảnh URL minh họa"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1579,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "form-q-image",
                type: "text",
                value: imageUrl,
                onChange: (e) => setImageUrl(e.target.value),
                placeholder: "https://images.unsplash...",
                className: "w-full border border-slate-200 rounded-xl p-2 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1582,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1578,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold block mb-1 flex items-center gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsxDEV(Video, { className: "w-3.5 h-3.5 text-slate-405" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1594,
                columnNumber: 21
              }, this),
              " Video URL minh họa"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1593,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "form-q-video",
                type: "text",
                value: videoUrl,
                onChange: (e) => setVideoUrl(e.target.value),
                placeholder: "https://youtube.com/watch...",
                className: "w-full border border-slate-200 rounded-xl p-2 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1596,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1592,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold block mb-1 text-[10px]", children: "Gợi ý giải thích đáp án" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1607,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "form-q-explanation",
                type: "text",
                value: explanation,
                onChange: (e) => setExplanation(e.target.value),
                placeholder: "Vì cấu trúc động từ nguyên thể...",
                className: "w-full border border-slate-200 rounded-xl p-2 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
                lineNumber: 1608,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1606,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1577,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 p-2 px-1 text-slate-600 block", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "form-q-inactive",
              type: "checkbox",
              checked: isInactive,
              onChange: (e) => setIsInactive(e.target.checked),
              className: "w-4.5 h-4.5 accent-rose-600 rounded cursor-pointer"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1620,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "form-q-inactive", className: "font-extrabold cursor-pointer text-rose-700", children: "Tạm vô hiệu hóa/Ẩn khỏi các bài ôn luyện của học viên" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
            lineNumber: 1627,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1619,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-2 pt-3 border-t border-slate-150", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowForm(false);
                setEditingQuestion(null);
                resetForm();
              },
              className: "px-4.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl cursor-pointer",
              children: "HỦY BỎ"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1634,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "btn-save-questions-database",
              type: "submit",
              className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-md cursor-pointer transition-all active:translate-y-0.5",
              children: editingQuestion ? "CẬP NHẬT CÂU HỎI" : "TẠO CÂU HỎI MỚI"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
              lineNumber: 1645,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
          lineNumber: 1633,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
        lineNumber: 1411,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 1389,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
      lineNumber: 1388,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminQuestions.tsx",
    lineNumber: 574,
    columnNumber: 5
  }, this);
}
