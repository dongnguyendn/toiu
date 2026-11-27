import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Clock,
  Award,
  ShieldAlert,
  FileText,
  Copy,
  ToggleLeft,
  ToggleRight,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Download,
  ListOrdered,
  Check,
  Search,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Trophy
} from "lucide-react";
import { db } from "/src/firebase.ts";
import { collection, onSnapshot } from "firebase/firestore";
export default function AdminTests() {
  const [exams, setExams] = useState([]);
  const [globalQuestions, setGlobalQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedNodes, setExpandedNodes] = useState({
    "all": true,
    "A1": true
  });
  const [selectedFolder, setSelectedFolder] = useState<any>({
    id: "all",
    name: "Tất cả kỳ thi"
  });
  const [viewMode, setViewMode] = useState("list");
  const [activeExamId, setActiveExamId] = useState(null);
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("A1");
  const [phase, setPhase] = useState("1");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [isPlacementTest, setIsPlacementTest] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState(-1);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [status, setStatus] = useState("draft");
  const [searchQuestionQuery, setSearchQuestionQuery] = useState("");
  const [filterQuestionSkill, setFilterQuestionSkill] = useState("all");
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [newQSkill, setNewQSkill] = useState("Listening");
  const [newQPrompt, setNewQPrompt] = useState("");
  const [newQPassage, setNewQPassage] = useState("");
  const [newQOptionA, setNewQOptionA] = useState("");
  const [newQOptionB, setNewQOptionB] = useState("");
  const [newQOptionC, setNewQOptionC] = useState("");
  const [newQOptionD, setNewQOptionD] = useState("");
  const [newQCorrect, setNewQCorrect] = useState("A");
  const [newQPlaceholder, setNewQPlaceholder] = useState("");
  const [deleteModalState, setDeleteModalState] = useState({
    show: false,
    examIdToDel: "",
    examTitleToDel: "",
    isProcessing: false
  });
  const activeExam = exams.find((e) => e.id === activeExamId);
  const adminFetch = async (url: string, options: any = {}) => {
    const userId = localStorage.getItem("learning_app_userId") || "";
    if (!userId) {
      const authError = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
      setError(authError);
      throw new Error(authError);
    }
    const headers = {
      ...options.headers || {},
      "x-user-id": userId
    };
    return await fetch(url, {
      ...options,
      headers
    });
  };
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const resExams = await adminFetch("/api/admin/exams");
      if (resExams.ok) {
        const data = await resExams.json();
        setExams(data.exams || []);
      }
      const resResults = await adminFetch("/api/admin/exams/results");
      if (resResults.ok) {
        const data = await resResults.json();
        setResults(data.results || []);
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ hóa dữ liệu kỳ thi:", err);
      setError(err.message || "Không thể nạp dữ liệu hoàn chỉnh từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    const unsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
      const data = snapshot.docs.map((i) => ({ id: i.id, ...i.data() }));
      setGlobalQuestions(data);
    });
    return () => unsubscribe();
  }, []);
  const handleSaveExamObject = async (updatedExam, isSilent = false) => {
    try {
      const res = await adminFetch(`/api/admin/exams/${updatedExam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExam)
      });
      if (!res.ok) throw new Error("Thất bại khi lưu kỳ thi.");
      const data = await res.json();
      if (!isSilent) {
        setSuccess(`Đã lưu cập nhật kỳ thi: ${updatedExam.title}`);
      }
      setExams((prev) => prev.map((e) => e.id === updatedExam.id ? updatedExam : e));
    } catch (err) {
      setError(err.message || "Lỗi lưu trữ dữ liệu đồng bộ.");
    }
  };
  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  const getFilteredExams = () => {
    if (selectedFolder.id === "all") return exams;
    if (selectedFolder.id === "placement") return exams.filter((e) => e.isPlacementTest);
    return exams.filter((e) => {
      if (e.isPlacementTest) return false;
      const matchLevel = e.level?.toUpperCase() === selectedFolder.level?.toUpperCase();
      const matchPhase = e.phase?.toString() === selectedFolder.phase?.toString();
      return matchLevel && matchPhase;
    });
  };
  const handleToggleActive = async (exam) => {
    const updated = { ...exam, isActive: !exam.isActive };
    await handleSaveExamObject(updated);
  };
  const getDatetimeLocalString = (isoOrStr) => {
    if (!isoOrStr) return "";
    const dateObj = new Date(isoOrStr);
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const handleExamSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim()) {
      setError("Vui lòng điền tên kỳ thi.");
      return;
    }
    const rawFormData = {
      title,
      description,
      level,
      phase,
      durationMinutes,
      passingScore,
      isPlacementTest,
      isActive,
      maxAttempts,
      openTime,
      closeTime
    };
    console.log(">>> ADMIN_EXAM_SUBMIT: Raw Form Data from inputs before submit:", JSON.stringify(rawFormData, null, 2));
    const validateAndParseDate = (dateVal, fieldName) => {
      if (!dateVal) return { valid: true };
      const trimmed = dateVal.trim();
      console.log(`[Date Validation] Checking ${fieldName}, raw input: "${trimmed}"`);
      const slashFormatRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})$/;
      if (slashFormatRegex.test(trimmed)) {
        const match = trimmed.match(slashFormatRegex);
        if (match) {
          const [_, dayStr, monthStr, yearStr, hourStr, minStr] = match;
          const day = parseInt(dayStr, 10);
          const month = parseInt(monthStr, 10);
          const year = parseInt(yearStr, 10);
          const hour = parseInt(hourStr, 10);
          const min = parseInt(minStr, 10);
          console.log(`[Date Validation] Found DD/MM/YYYY HH:mm representation for ${fieldName}:`, { day, month, year, hour, min });
          if (month < 1 || month > 12) {
            return { valid: false, error: `${fieldName} chứa tháng không hợp lệ (1-12).` };
          }
          if (day < 1 || day > 31) {
            return { valid: false, error: `${fieldName} chứa ngày không hợp lệ (1-31).` };
          }
          if (hour < 0 || hour > 23 || min < 0 || min > 59) {
            return { valid: false, error: `${fieldName} chứa giờ/phút không hợp lệ.` };
          }
          if (year > 3e3) {
            return { valid: false, error: `${fieldName} chứa năm quá lớn (${year}). Vui lòng nhập năm hợp lệ từ 2000 đến 3000.` };
          }
          if (year < 1900) {
            return { valid: false, error: `${fieldName} chứa năm không hợp lệ.` };
          }
          const constructedDate = new Date(year, month - 1, day, hour, min);
          return { valid: true, value: constructedDate.toISOString() };
        }
      }
      const standardFormatRegex = /^(\d{4,5})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(:\d{2})?$/;
      if (standardFormatRegex.test(trimmed)) {
        const match = trimmed.match(standardFormatRegex);
        if (match) {
          const [_, yearStr, monthStr, dayStr, hourStr, minStr] = match;
          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10);
          const day = parseInt(dayStr, 10);
          if (year > 3e3) {
            return { valid: false, error: `${fieldName} chứa năm quá lớn (${year}). Vui lòng nhập năm từ 2000 - 3000.` };
          }
          if (year < 1900) {
            return { valid: false, error: `${fieldName} chứa năm không hợp lệ.` };
          }
          const d = new Date(trimmed.replace(" ", "T"));
          if (!isNaN(d.getTime())) {
            return { valid: true, value: d.toISOString() };
          }
        }
      }
      const parsedDate = new Date(trimmed);
      if (isNaN(parsedDate.getTime())) {
        return { valid: false, error: `${fieldName} không hoàn chỉnh hoặc có định dạng không hợp lệ. Vui lòng nhập đầy đủ ngày/tháng/năm và giờ.` };
      }
      const parsedYear = parsedDate.getFullYear();
      if (parsedYear > 3e3) {
        return { valid: false, error: `${fieldName} chứa năm quá lớn (${parsedYear}). Vui lòng nhập năm hợp lệ (2000 - 3000).` };
      }
      if (parsedYear < 1900) {
        return { valid: false, error: `${fieldName} chứa năm không hợp lệ.` };
      }
      return { valid: true, value: parsedDate.toISOString() };
    };
    const openCheck = validateAndParseDate(openTime, "Ngày mở kỳ thi");
    if (!openCheck.valid) {
      setError(openCheck.error || "Ngày mở kỳ thi không hợp lệ.");
      console.warn(">>> VALIDATION_ERROR: openTime check failed", openCheck);
      return;
    }
    const closeCheck = validateAndParseDate(closeTime, "Ngày đóng kỳ thi");
    if (!closeCheck.valid) {
      setError(closeCheck.error || "Ngày đóng kỳ thi không hợp lệ.");
      console.warn(">>> VALIDATION_ERROR: closeTime check failed", closeCheck);
      return;
    }
    if (Number(durationMinutes) < 5 || Number(durationMinutes) > 240) {
      setError("Thời lượng làm bài phải dao động từ 5 đến 240 phút.");
      return;
    }
    if (Number(passingScore) < 10 || Number(passingScore) > 100) {
      setError("% điểm đạt yêu cầu phải nằm trong tầm 10% đến 100%.");
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      level,
      phase,
      durationMinutes: Number(durationMinutes),
      passingScore: Number(passingScore),
      isPlacementTest,
      isActive,
      maxAttempts: Number(maxAttempts),
      openTime: openCheck.value || void 0,
      closeTime: closeCheck.value || void 0,
      sections: editingExam ? editingExam.sections : [],
      status
    };
    console.log(">>> ADMIN_EXAM_SUBMIT: Validated and constructed payload to be dispatched:", JSON.stringify(payload, null, 2));
    try {
      const url = editingExam ? `/api/admin/exams/${editingExam.id}` : "/api/admin/exams";
      const method = editingExam ? "PUT" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gặp sự cố khi lưu kỳ thi.");
      setSuccess(`${editingExam ? "Cập nhật" : "Tạo mới"} kỳ thi thành công!`);
      setShowExamForm(false);
      setEditingExam(null);
      resetExamForm();
      fetchData();
    } catch (err) {
      setError(err.message || "Gặp sự cố khi lưu trữ đề thi.");
    }
  };
  const handleEditClick = (exam) => {
    setEditingExam(exam);
    setTitle(exam.title || "");
    setDescription(exam.description || "");
    setLevel(exam.level || "A1");
    setPhase(exam.phase || "1");
    setDurationMinutes(Number(exam.durationMinutes) || 30);
    setPassingScore(Number(exam.passingScore) || 70);
    setIsPlacementTest(!!exam.isPlacementTest);
    setIsActive(!!exam.isActive);
    setMaxAttempts(exam.maxAttempts !== void 0 ? Number(exam.maxAttempts) : -1);
    setOpenTime(exam.openTime ? getDatetimeLocalString(exam.openTime) : "");
    setCloseTime(exam.closeTime ? getDatetimeLocalString(exam.closeTime) : "");
    setStatus(exam.status || "draft");
    setShowExamForm(true);
  };
  const handleCloneExam = async (exam) => {
    setError("");
    setSuccess("");
    try {
      const payload = {
        title: `${exam.title} (Bản sao)`,
        description: exam.description,
        level: exam.level,
        phase: exam.phase,
        durationMinutes: exam.durationMinutes,
        passingScore: exam.passingScore,
        isPlacementTest: exam.isPlacementTest,
        isActive: exam.isActive,
        maxAttempts: exam.maxAttempts,
        openTime: exam.openTime,
        closeTime: exam.closeTime,
        status: "draft",
        sections: exam.sections || []
      };
      const res = await adminFetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(`Đã nhân bản kỳ thi "${exam.title}" thành công!`);
        fetchData();
      } else {
        throw new Error();
      }
    } catch {
      setError("Không thể nhân bản kỳ thi.");
    }
  };
  const handlePublishExam = async (exam) => {
    if (!exam.sections || exam.sections.length === 0) {
      setError("Không thể cập nhật cho học sinh vì bài test chưa có câu hỏi.");
      alert("Không thể cập nhật cho học sinh vì bài test chưa có câu hỏi.");
      console.warn(`[FRONTEND ADMIN LOG] WARNING: Cannot publish exam "${exam.id}" because it has 0 sections/questions.`);
      return;
    }
    const confirmResult = window.confirm("Bạn có chắc muốn cập nhật bài test này cho học sinh không?");
    if (!confirmResult) {
      console.log(`[FRONTEND ADMIN LOG] INFO: User canceled publishing for exam "${exam.id}".`);
      return;
    }
    setError("");
    setSuccess("");
    console.log(`[FRONTEND ADMIN LOG] REQUEST:
    - examId: "${exam.id}"
    - action: "publish-to-students"
    - url: "/api/exams/${exam.id}/publish-to-students"
    - request body: {}`);
    try {
      const res = await adminFetch(`/api/exams/${exam.id}/publish-to-students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      console.log(`[FRONTEND ADMIN LOG] RESPONSE:`, data);
      if (res.ok && data.success) {
        setSuccess(`Cập nhật bài test "${exam.title}" cho học sinh thành công!`);
        console.log(`[FRONTEND ADMIN LOG] SUCCESS: Exam "${exam.id}" successfully published to student list.`);
        fetchData();
      } else {
        throw new Error(data.error || "Không thể cập nhật bài test cho học sinh");
      }
    } catch (err) {
      setError(err.message || "Không thể gọi API cập nhật kỳ thi.");
      console.error(`[FRONTEND ADMIN LOG] ERROR:`, err);
    }
  };
  const handleConfirmDelete = async () => {
    const { examIdToDel, examTitleToDel } = deleteModalState;
    if (!examIdToDel || deleteModalState.isProcessing) return;
    console.log(`[EXAM DELETE FRONTEND] Initializing deletion for examId: ${examIdToDel}, payload matching titles: ${examTitleToDel}`);
    setDeleteModalState((prev) => ({ ...prev, isProcessing: true }));
    setError("");
    setSuccess("");
    const endpoint = `/api/admin/exams/${examIdToDel}`;
    console.log(`[EXAM DELETE FRONTEND] Dispatching secure API connection towards ${endpoint}`);
    try {
      const res = await adminFetch(endpoint, { method: "DELETE" });
      console.log(`[EXAM DELETE FRONTEND] Received back network code status: ${res.status}`);
      const responseData = await res.json();
      console.log(`[EXAM DELETE FRONTEND] Server processed payload transaction details:`, responseData);
      if (res.ok && responseData.success) {
        setExams((prev) => prev.filter((exam) => exam.id !== examIdToDel));
        const successMsg = responseData.softDeleted ? `Xóa kỳ thi thành công! Đã chuyển trạng thái lưu trữ cho: ${examTitleToDel} (Bảo toàn lịch sử điểm & tiến trình).` : `Xóa kỳ thi thành công! Đã dọn dẹp triệt để kỳ thi: ${examTitleToDel}`;
        setSuccess(successMsg);
        setDeleteModalState({ show: false, examIdToDel: "", examTitleToDel: "", isProcessing: false });
        await fetchData();
        console.log(`[EXAM DELETE CONFIRMED] Synced with database. Refetched successfully.`);
      } else {
        const errorMsg = responseData?.error || "Giao thức máy chủ từ chối tiến trình xóa.";
        console.error(`[EXAM DELETE FRONTEND] API Error report:`, errorMsg);
        setError(`Không thể thực hiện xóa. Nguyên nhân từ hệ thống: ${errorMsg}`);
        setDeleteModalState((prev) => ({ ...prev, isProcessing: false, show: false }));
      }
    } catch (err) {
      const errorMsg = err.message || err;
      console.error(`[EXAM DELETE FRONTEND] Fetch exception error:`, errorMsg);
      setError(`Không thể truyền tải yêu cầu xóa. Lỗi truyền phát: ${errorMsg}`);
      setDeleteModalState((prev) => ({ ...prev, isProcessing: false, show: false }));
    }
  };
  const resetExamForm = () => {
    setTitle("");
    setDescription("");
    setLevel("A1");
    setPhase("1");
    setDurationMinutes(30);
    setPassingScore(70);
    setIsPlacementTest(false);
    setIsActive(true);
    setMaxAttempts(-1);
    setOpenTime("");
    setCloseTime("");
    setStatus("draft");
  };
  const handleAddNewInFolderScope = () => {
    resetExamForm();
    setEditingExam(null);
    if (selectedFolder.id === "placement") {
      setIsPlacementTest(true);
    } else if (selectedFolder.id !== "all") {
      setLevel(selectedFolder.level || "A1");
      setPhase(selectedFolder.phase || "1");
      setIsPlacementTest(false);
    }
    setShowExamForm(true);
  };
  const calculateExamMetrics = (examId) => {
    const examAttempts = results.filter((r) => r.examId === examId);
    if (examAttempts.length === 0) {
      return { count: 0, avgScore: 0, passRate: 0, topScores: [] };
    }
    const totalScore = examAttempts.reduce((acc, curr) => acc + (Number(curr.scorePercent) || 0), 0);
    const avgScore = Math.round(totalScore / examAttempts.length);
    const examTemp = exams.find((e) => e.id === examId);
    const passThreshold = examTemp ? examTemp.passingScore : 70;
    const passes = examAttempts.filter((r) => (Number(r.scorePercent) || 0) >= passThreshold).length;
    const passRate = Math.round(passes / examAttempts.length * 100);
    const topScores = [...examAttempts].sort((a, b) => b.scorePercent - a.scorePercent).slice(0, 3).map((r) => {
      const student = users.find((u) => u.id === r.userId);
      return {
        name: student ? student.fullName : "Học viên ẩn danh",
        email: student ? student.email : "N/A",
        score: r.scorePercent,
        date: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("vi-VN") : "N/A"
      };
    });
    return {
      count: examAttempts.length,
      avgScore,
      passRate,
      topScores
    };
  };
  const handleExportCSV = (exam) => {
    const examAttempts = results.filter((r) => r.examId === exam.id);
    if (examAttempts.length === 0) {
      alert("Chưa có lượt thi khải thí nào để xuất báo cáo.");
      return;
    }
    let csvContent = "\uFEFF";
    csvContent += "ID Lượt Thi,Tên Học Viên,Email Học Viên,Thời Gian Thi,% Câu Đúng,Số Câu Đúng,Thang Điểm IELTS / Điểm Cộng,Trạng Thái Đạt rào\n";
    examAttempts.forEach((r) => {
      const student = users.find((u) => u.id === r.userId);
      const studentName = student ? student.fullName.replace(/,/g, "") : "Học viên ẩn danh";
      const studentEmail = student ? student.email : "N/A";
      const dateStr = r.submittedAt ? new Date(r.submittedAt).toLocaleString("vi-VN").replace(/,/g, " -") : "N/A";
      const isPassed = r.scorePercent >= exam.passingScore ? "ĐẠT CHUẨN" : "CHƯA ĐẠT";
      csvContent += `${r.id},${studentName},${studentEmail},${dateStr},${r.scorePercent}%,${r.correctCount || 0}/${r.totalCount || 0},${r.estimatedBand || 0},${isPassed}
`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bao_Cao_Ky_Thi_${exam.title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleOpenQuestionsMgmt = (exam) => {
    setActiveExamId(exam.id);
    setViewMode("questions-mgmt");
    setShowNewQuestionForm(false);
  };
  const handleQuestionOrderMove = async (index, direction) => {
    if (!activeExam) return;
    const newSections = [...activeExam.sections || []];
    if (direction === "up" && index > 0) {
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
    } else if (direction === "down" && index < newSections.length - 1) {
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
    } else {
      return;
    }
    const updated = { ...activeExam, sections: newSections };
    await handleSaveExamObject(updated, true);
  };
  const handleDeleteSectionQuestion = async (index) => {
    if (!activeExam) return;
    if (!window.confirm("Loại bỏ câu hỏi này ra khỏi đề thi? Đừng lo, câu hỏi không bị xóa trong ngân hàng câu hỏi gốc.")) return;
    const newSections = (activeExam.sections || []).filter((_, idx) => idx !== index);
    const updated = { ...activeExam, sections: newSections };
    await handleSaveExamObject(updated);
  };
  const handleAddQuestionFromBank = async (bankQ) => {
    if (!activeExam) return;
    const isDup = activeExam.sections?.some((s) => s.prompt === bankQ.questionText);
    if (isDup) {
      alert("Câu hỏi này đã tồn tại trong kết cấu đề thi.");
      return;
    }
    const newSec = {
      name: bankQ.skill.charAt(0).toUpperCase() + bankQ.skill.slice(1),
      prompt: bankQ.questionText,
      passage: bankQ.readingPassage || bankQ.audioUrl || "",
      options: bankQ.options && bankQ.options.length > 0 ? bankQ.options : void 0,
      correctAnswer: bankQ.correctAnswer || ""
    };
    const newSections = [...activeExam.sections || [], newSec];
    const updated = { ...activeExam, sections: newSections };
    await handleSaveExamObject(updated);
  };
  const handleAddNewCustomQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!activeExam) return;
    if (!newQPrompt.trim()) {
      alert("Thất bại: Đề bài câu hỏi không được rỗng.");
      return;
    }
    let compiledOptions = void 0;
    if (newQOptionA.trim() || newQOptionB.trim()) {
      compiledOptions = [
        `A. ${newQOptionA.trim()}`,
        `B. ${newQOptionB.trim()}`,
        `C. ${newQOptionC.trim() || "N/A"}`,
        `D. ${newQOptionD.trim() || "N/A"}`
      ];
    }
    const newSec = {
      name: newQSkill,
      prompt: newQPrompt.trim(),
      passage: newQPassage.trim() || void 0,
      options: compiledOptions,
      correctAnswer: compiledOptions ? newQCorrect : void 0,
      placeholderText: !compiledOptions ? newQPlaceholder.trim() || "Viết cấu trả lời bằng tiếng Anh..." : void 0
    };
    const newSections = [...activeExam.sections || [], newSec];
    const updated = { ...activeExam, sections: newSections };
    await handleSaveExamObject(updated);
    setNewQPrompt("");
    setNewQPassage("");
    setNewQOptionA("");
    setNewQOptionB("");
    setNewQOptionC("");
    setNewQOptionD("");
    setNewQPlaceholder("");
    setShowNewQuestionForm(false);
  };
  const getFilteredQuestionBank = () => {
    return globalQuestions.filter((q) => {
      const matchQuery = !searchQuestionQuery.trim() || q.questionText.toLowerCase().includes(searchQuestionQuery.toLowerCase()) || q.readingPassage && q.readingPassage.toLowerCase().includes(searchQuestionQuery.toLowerCase());
      const matchSkill = filterQuestionSkill === "all" || q.skill.toLowerCase() === filterQuestionSkill.toLowerCase();
      return matchQuery && matchSkill;
    });
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-left antialiased", id: "exams-management-lms", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 py-3.5 px-5 rounded-2xl text-xs flex justify-between border border-red-200 items-center animate-shake", children: [
      /* @__PURE__ */ jsxDEV("span", { children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "Mã Lỗi:" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 799,
          columnNumber: 17
        }, this),
        " ",
        error
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 799,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setError(""), className: "hover:text-red-950", children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 800,
        columnNumber: 79
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 800,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
      lineNumber: 798,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-800 py-3.5 px-5 rounded-2xl text-xs flex justify-between border border-emerald-200 items-center", children: [
      /* @__PURE__ */ jsxDEV("span", { children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "Thành công:" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 805,
          columnNumber: 17
        }, this),
        " ",
        success
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 805,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setSuccess(""), className: "hover:text-emerald-950", children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 806,
        columnNumber: 85
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 806,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
      lineNumber: 804,
      columnNumber: 9
    }, this),
    viewMode === "list" ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-3 bg-white border border-slate-200 p-5 rounded-3xl space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-3", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Trophy, { className: "w-4.5 h-4.5 text-amber-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 818,
              columnNumber: 17
            }, this),
            "CEFR SYLLABUS ROADMAP"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 817,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-1 leading-relaxed", children: "Chọn phân mục CEFR hoặc giai đoạn học tập để quản trị thiết chế đề thi." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 821,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 816,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-xs select-none font-medium", children: [
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              onClick: () => setSelectedFolder({ id: "all", name: "Tất cả kỳ thi" }),
              className: `flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${selectedFolder.id === "all" ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-950 font-extrabold" : "hover:bg-slate-50 text-slate-650"}`,
              children: [
                /* @__PURE__ */ jsxDEV(FolderOpen, { className: "w-4 h-4 text-slate-400 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 836,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: [
                  "Toàn bộ kỳ thi (",
                  exams.length,
                  ")"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 837,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 828,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              onClick: () => setSelectedFolder({ id: "placement", isPlacement: true, name: "Đăng ký đầu vào (Placement Test)" }),
              className: `flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${selectedFolder.id === "placement" ? "bg-rose-50 border-l-4 border-rose-500 text-rose-950 font-extrabold" : "hover:bg-slate-50 text-slate-650"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Award, { className: "w-4 h-4 text-rose-450 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 849,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: [
                  "Test Đầu Vào (",
                  exams.filter((e) => e.isPlacementTest).length,
                  ")"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 850,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 841,
              columnNumber: 15
            },
            this
          ),
          ["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
            const isLvlExpanded = !!expandedNodes[lvl];
            const countLvl = exams.filter((e) => !e.isPlacementTest && e.level?.toUpperCase() === lvl.toUpperCase()).length;
            return /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  onClick: () => toggleNode(lvl),
                  className: "flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 font-bold", children: [
                      isLvlExpanded ? /* @__PURE__ */ jsxDEV(FolderOpen, { className: "w-4 h-4 text-indigo-400 shrink-0" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 867,
                        columnNumber: 42
                      }, this) : /* @__PURE__ */ jsxDEV(Folder, { className: "w-4 h-4 text-slate-400 shrink-0" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 867,
                        columnNumber: 104
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "uppercase text-slate-900", children: [
                        "Trình độ ",
                        lvl
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 868,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.2 leading-none font-mono", children: [
                        countLvl,
                        " đề"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 869,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 866,
                      columnNumber: 23
                    }, this),
                    isLvlExpanded ? /* @__PURE__ */ jsxDEV(ChevronDown, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 871,
                      columnNumber: 40
                    }, this) : /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 871,
                      columnNumber: 97
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 862,
                  columnNumber: 21
                },
                this
              ),
              isLvlExpanded && /* @__PURE__ */ jsxDEV("div", { className: "pl-4 border-l border-slate-100 ml-4 space-y-0.5", children: [
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    onClick: () => setSelectedFolder({ id: `lvl_${lvl}_p1`, level: lvl, phase: "1", name: `Cấp độ ${lvl} • Giai đoạn 1` }),
                    className: `flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${selectedFolder.id === `lvl_${lvl}_p1` ? "bg-indigo-50/70 font-extrabold text-indigo-900" : "hover:bg-slate-50 text-slate-600"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3 h-3 text-slate-350 shrink-0" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 887,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: "Giai đoạn 1" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 888,
                        columnNumber: 27
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 879,
                    columnNumber: 25
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    onClick: () => setSelectedFolder({ id: `lvl_${lvl}_p2`, level: lvl, phase: "2", name: `Cấp độ ${lvl} • Giai đoạn 2` }),
                    className: `flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${selectedFolder.id === `lvl_${lvl}_p2` ? "bg-indigo-50/70 font-extrabold text-indigo-900" : "hover:bg-slate-50 text-slate-600"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3 h-3 text-slate-350 shrink-0" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 900,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: "Giai đoạn 2" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 901,
                        columnNumber: 27
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 892,
                    columnNumber: 25
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    onClick: () => setSelectedFolder({ id: `lvl_${lvl}_pfinal`, level: lvl, phase: "Final", name: `Cấp độ ${lvl} • Thi Cuối Cấp` }),
                    className: `flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${selectedFolder.id === `lvl_${lvl}_pfinal` ? "bg-indigo-50/70 font-extrabold text-indigo-900" : "hover:bg-slate-50 text-slate-600"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3 h-3 text-slate-350 shrink-0" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 913,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-rose-600", children: "Kiểm tra Cuối khóa" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 914,
                        columnNumber: 27
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 905,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 876,
                columnNumber: 23
              }, this)
            ] }, lvl, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 859,
              columnNumber: 19
            }, this);
          })
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 825,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 815,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-9 space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider", children: "THƯ MỤC LƯU TRỮ ĐỀ THI" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 933,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "text-lg font-black text-slate-900 mt-1 uppercase tracking-tight", children: selectedFolder.name }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 936,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-450", children: [
              "Tổng số: ",
              getFilteredExams().length,
              " đề thi, tích hợp kết quả đồng bộ thời gian thực cho học viên."
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 937,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 932,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleAddNewInFolderScope,
              className: "bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4.5 py-3 rounded-2xl text-xs cursor-pointer shadow-md transition-all active:translate-y-0.5 flex items-center gap-1.5",
              children: [
                /* @__PURE__ */ jsxDEV(Plus, { className: "w-4.5 h-4.5 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 944,
                  columnNumber: 17
                }, this),
                " THÊM KỲ THI TRONG PHÂN KHU"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 940,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 931,
          columnNumber: 13
        }, this),
        showExamForm && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border-2 border-indigo-200 p-6 rounded-3xl text-xs space-y-4 shadow-sm animate-fade-in", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-indigo-100 pb-3", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "font-black uppercase text-indigo-950 tracking-wide flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxDEV(FileText, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 953,
                columnNumber: 21
              }, this),
              editingExam ? `Chỉnh sửa Kỳ thi: ${editingExam.title}` : "Khai báo Kỳ thi Học trình Mới"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 952,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setShowExamForm(false);
                  setEditingExam(null);
                },
                className: "p-1.5 text-slate-500 bg-slate-200/80 hover:bg-slate-200 rounded-xl cursor-pointer",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 960,
                  columnNumber: 21
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 956,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 951,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("form", { onSubmit: handleExamSubmit, noValidate: true, className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-8", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black", children: "Tên kỳ thi (Ví dụ: Final Exam Assessment A1)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 968,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    required: true,
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "Hãy đặt một cái tên trực quan, rõ ràng",
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-1 focus:ring-indigo-500 outline-none text-xs"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 969,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 967,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black", children: "Thang bậc CEFR" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 980,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: level,
                    onChange: (e) => setLevel(e.target.value),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 focus:outline-none text-xs font-bold",
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "A1", children: "A1 - Elementary" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 986,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "A2", children: "A2 - Pre-Intermediate" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 987,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "B1", children: "B1 - Intermediate" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 988,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "B2", children: "B2 - Upper-Intermediate" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 989,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "C1", children: "C1 - Advanced" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 990,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "C2", children: "C2 - Proficient" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 991,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 981,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 979,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-12", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black", children: "Mô tả kỳ thi / Mục tiêu khảo thí" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 996,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "textarea",
                  {
                    rows: 2,
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    placeholder: "Tầm quan trọng, cấu trúc hoặc lưu ý dành cho thí sinh trước khi nhấp chuột bắt đầu bài.",
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none text-xs"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 997,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 995,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black", children: "Phân Kỳ / Giai Đoạn" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1007,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: phase,
                    onChange: (e) => setPhase(e.target.value),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 focus:outline-none text-xs font-bold",
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "1", children: "Giai đoạn học phần 1" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1013,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "2", children: "Giai đoạn học phần 2" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1014,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "Final", children: "Thi cuối cấp chứng chỉ" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1015,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1008,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1006,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black block font-mono", children: "Thời lượng (Phút)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1020,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "number",
                    min: "5",
                    max: "240",
                    required: true,
                    value: durationMinutes,
                    onChange: (e) => setDurationMinutes(Number(e.target.value)),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 font-mono text-xs font-bold"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1021,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1019,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4 font-mono", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black block", children: "% Điểm số tối thiểu để vượt rào" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1033,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "number",
                    min: "10",
                    max: "100",
                    required: true,
                    value: passingScore,
                    onChange: (e) => setPassingScore(Number(e.target.value)),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 font-mono text-xs font-bold"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1034,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1032,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black", children: "Giới hạn số lần thi tối đa" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1046,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: maxAttempts,
                    onChange: (e) => setMaxAttempts(Number(e.target.value)),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 focus:outline-none text-xs font-bold",
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "-1", children: "Không giới hạn (Thi tự do)" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1052,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "1", children: "Chỉ cho phép thi đúng 1 lần" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1053,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "2", children: "Giới hạn tối đa 2 lần thi" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1054,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "3", children: "Giới hạn tối đa 3 lần thi" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1055,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "5", children: "Giới hạn tối đa 5 lần thi" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1056,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1047,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1045,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black", children: "Trạng thái phát hành" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1061,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: status,
                    onChange: (e) => setStatus(e.target.value),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 focus:outline-none text-xs font-bold",
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "draft", children: "📁 Bản nháp (Draft)" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1067,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "published", children: "🚀 Đã xuất bản (Published)" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1068,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "active", children: "🌟 Đang thi (Active)" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1069,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "archived", children: "📦 Lưu trữ (Archived)" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1070,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1062,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1060,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4 font-mono", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black block", children: "Hẹn giờ MỞ kỳ thi (Múi Việt Nam)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1075,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "datetime-local",
                    value: openTime,
                    onChange: (e) => setOpenTime(e.target.value),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 font-mono text-xs"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1076,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1074,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 md:col-span-4 font-mono", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black block", children: "Hẹn giờ ĐÓNG kỳ thi (Múi Việt Nam)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1085,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "datetime-local",
                    value: closeTime,
                    onChange: (e) => setCloseTime(e.target.value),
                    className: "w-full bg-white border border-slate-205 rounded-xl p-2.5 text-slate-900 font-mono text-xs"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1086,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1084,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 965,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center pt-4 border-t border-slate-200 gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 cursor-pointer font-bold text-rose-700", children: [
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "checkbox",
                      checked: isPlacementTest,
                      onChange: (e) => setIsPlacementTest(e.target.checked),
                      className: "w-4 h-4 rounded cursor-pointer accent-rose-600"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1099,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("span", { children: "Kỳ thi Đánh Giá Đầu Vào (Placement Test)" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1105,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1098,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 cursor-pointer font-bold text-slate-700", children: [
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "checkbox",
                      checked: isActive,
                      onChange: (e) => setIsActive(e.target.checked),
                      className: "w-4 h-4 rounded cursor-pointer accent-indigo-600"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1109,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("span", { children: "Được phép hiển thị cho Thí sinh thi ngay" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1115,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1108,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1097,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowExamForm(false);
                      setEditingExam(null);
                    },
                    className: "px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold rounded-xl cursor-pointer text-slate-700 font-sans",
                    children: "HỦY BỎ"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1120,
                    columnNumber: 23
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "submit",
                    className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl cursor-pointer font-sans shadow-md",
                    children: editingExam ? "LƯU THAY ĐỔI" : "TẠO KỲ THI KHAI CHẾ"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1127,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1119,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1096,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 964,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 950,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: getFilteredExams().length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "col-span-2 text-center py-14 bg-white border border-slate-150 rounded-3xl p-6 text-slate-400", children: [
          /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-10 h-10 mx-auto text-slate-300 mb-2" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1143,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold leading-normal", children: "Chưa có đề thi nào trong phân mục này." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1144,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-1", children: 'Sử dụng nút "Thêm kỳ thi trong phân khu" hoặc chọn một thư mục khác bên tay trái.' }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1145,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1142,
          columnNumber: 17
        }, this) : getFilteredExams().map((exam) => {
          const metrics = calculateExamMetrics(exam.id);
          const isScheduledOpen = exam.openTime ? /* @__PURE__ */ new Date() >= new Date(exam.openTime) : true;
          const isScheduledClose = exam.closeTime ? /* @__PURE__ */ new Date() <= new Date(exam.closeTime) : true;
          const isAccessibleByTime = isScheduledOpen && isScheduledClose;
          return /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `bg-white border border-slate-200 hover:border-indigo-250 p-5 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all gap-5 ${!exam.isActive ? "bg-red-50/5 opacity-80" : ""}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start gap-1", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: `text-[8.5px] font-black uppercase rounded-lg px-2.5 py-0.5 select-none leading-none border ${exam.isPlacementTest ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"}`, children: exam.isPlacementTest ? "Placement Test" : `${exam.level} • Phase ${exam.phase}` }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1164,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: `text-[8.5px] font-black uppercase rounded-lg px-2.5 py-0.5 select-none leading-none border ${exam.status === "published" ? "bg-emerald-55 text-emerald-700 border-emerald-250" : exam.status === "active" ? "bg-sky-50 text-sky-750 border-sky-250 animate-pulse" : exam.status === "archived" ? "bg-slate-100 text-slate-600 border-slate-250" : "bg-amber-50 text-amber-700 border-amber-250"}`, children: exam.status === "published" ? "🚀 Published" : exam.status === "active" ? "🌟 Active" : exam.status === "archived" ? "📦 Archived" : "📁 Draft" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1173,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1163,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-mono", children: [
                      "ID: ",
                      exam.id
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1185,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1162,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("h4", { className: "text-[14px] font-[900] text-slate-900 leading-snug tracking-tight uppercase line-clamp-2", children: exam.title }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1189,
                      columnNumber: 27
                    }, this),
                    exam.description && /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-450 leading-relaxed mt-1 line-clamp-2 italic", children: exam.description }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1193,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1188,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100", children: [
                      /* @__PURE__ */ jsxDEV("div", { children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold block uppercase text-[7px]", children: "SỐ LƯỢT THI TỐI ĐA" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1203,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("strong", { className: `${exam.maxAttempts === -1 ? "text-indigo-650" : "text-slate-800"}`, children: exam.maxAttempts === -1 ? "Vô hạn (Tự do)" : `${exam.maxAttempts} lượt` }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1204,
                          columnNumber: 31
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1202,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold block uppercase text-[7px]", children: "TRẠNG THÁI HẸN GIỜ" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1209,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("strong", { className: isAccessibleByTime ? "text-emerald-700" : "text-red-650", children: isAccessibleByTime ? "Sẵn sàng" : "Ngoài khung giờ" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1210,
                          columnNumber: 31
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1208,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1201,
                      columnNumber: 27
                    }, this),
                    (exam.openTime || exam.closeTime) && /* @__PURE__ */ jsxDEV("div", { className: "text-[9px] text-slate-400 flex flex-col pt-0.5 pl-1 italic", children: [
                      exam.openTime && /* @__PURE__ */ jsxDEV("span", { children: [
                        "• Mở từ: ",
                        new Date(exam.openTime).toLocaleString("vi-VN")
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1218,
                        columnNumber: 49
                      }, this),
                      exam.closeTime && /* @__PURE__ */ jsxDEV("span", { children: [
                        "• Đóng tại: ",
                        new Date(exam.closeTime).toLocaleString("vi-VN")
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1219,
                        columnNumber: 50
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1217,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1200,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-slate-100 pt-3", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[8px] block uppercase font-bold", children: "LƯỢNG THÌ" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1227,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 flex items-center gap-0.5", children: [
                        /* @__PURE__ */ jsxDEV(Clock, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1228,
                          columnNumber: 90
                        }, this),
                        " ",
                        exam.durationMinutes,
                        " Phút"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1228,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1226,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[8px] block uppercase font-bold", children: "Yêu cầu Đạt (%)" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1231,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 flex items-center gap-0.5", children: [
                        /* @__PURE__ */ jsxDEV(Award, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1232,
                          columnNumber: 90
                        }, this),
                        " ",
                        exam.passingScore,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1232,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1230,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5 text-right", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-450 text-[8px] block uppercase font-bold", children: "BẢN THIẾT KẾ" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1235,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("strong", { className: "text-indigo-600 block", children: [
                        (exam.sections || []).length,
                        " mục hỏi"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1236,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1234,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1225,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-1 grid-stats border-t border-slate-100 pt-3 text-[10px] font-mono", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 p-1.5 rounded-lg text-center", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[7.5px] block font-bold", children: "LƯỢT KHẢO THI" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1243,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-extrabold", children: [
                        metrics.count,
                        " lần"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1244,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1242,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 p-1.5 rounded-lg text-center", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[7.5px] block font-bold", children: "ĐIỂM TRUNG BÌNH" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1247,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-extrabold text-indigo-650", children: [
                        metrics.avgScore,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1248,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1246,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 p-1.5 rounded-lg text-center", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[7.5px] block font-bold", children: "TỶ LỆ ĐẬU" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1251,
                        columnNumber: 29
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-extrabold text-emerald-700", children: [
                        metrics.passRate,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1252,
                        columnNumber: 29
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1250,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1241,
                    columnNumber: 25
                  }, this),
                  metrics.topScores.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50/40 border border-amber-100 p-2.5 rounded-xl space-y-1 text-[10px]", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-amber-800 flex items-center gap-1", children: "🏆 TOP THÍ SINH:" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1259,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("ol", { className: "divide-y divide-amber-100/10 space-y-0.5", children: metrics.topScores.map((ts, tIdx) => /* @__PURE__ */ jsxDEV("li", { className: "flex justify-between items-center text-amber-955 pt-0.5 text-[9.5px]", children: [
                      /* @__PURE__ */ jsxDEV("span", { children: [
                        tIdx + 1,
                        ". ",
                        /* @__PURE__ */ jsxDEV("strong", { children: ts.name }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1263,
                          columnNumber: 53
                        }, this),
                        " (",
                        ts.email,
                        ")"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1263,
                        columnNumber: 35
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-700 font-mono", children: [
                        ts.score,
                        "%"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1264,
                        columnNumber: 35
                      }, this)
                    ] }, tIdx, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1262,
                      columnNumber: 33
                    }, this)) }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1260,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1258,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1161,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-t border-slate-100 pt-3", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleToggleActive(exam),
                      className: "focus:outline-none cursor-pointer",
                      children: exam.isActive ? /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[8.5px] font-extrabold text-emerald-850 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase", children: [
                        /* @__PURE__ */ jsxDEV(ToggleRight, { className: "w-3.5 h-3.5 inline mr-0.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1281,
                          columnNumber: 31
                        }, this),
                        " Hoạt động"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1280,
                        columnNumber: 29
                      }, this) : /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[8.5px] font-extrabold text-rose-850 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md uppercase", children: [
                        /* @__PURE__ */ jsxDEV(ToggleLeft, { className: "w-3.5 h-3.5 inline mr-0.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1285,
                          columnNumber: 31
                        }, this),
                        " Khóa / Ẩn"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1284,
                        columnNumber: 29
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1275,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1", children: [
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handleExportCSV(exam),
                        className: "p-1.5 border border-slate-200 hover:border-slate-450 text-slate-500 rounded-xl cursor-pointer bg-slate-50",
                        title: "Xuất bảng điểm khảo thí (CSV / Excel)",
                        children: /* @__PURE__ */ jsxDEV(Download, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1297,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1292,
                        columnNumber: 27
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handleCloneExam(exam),
                        className: "p-1.5 border border-slate-200 hover:border-indigo-400 text-slate-500 rounded-xl cursor-pointer bg-slate-50",
                        title: "Nhân bản kỳ thi",
                        children: /* @__PURE__ */ jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1306,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1301,
                        columnNumber: 27
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handleEditClick(exam),
                        className: "p-1.5 border border-slate-200 hover:border-indigo-400 text-slate-500 rounded-xl cursor-pointer bg-slate-50",
                        title: "Đổi tiêu chí chính",
                        children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1315,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1310,
                        columnNumber: 27
                      },
                      this
                    ),
                    exam.status !== "published" && /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handlePublishExam(exam),
                        className: "p-1.5 border border-emerald-250 hover:bg-emerald-50 text-emerald-600 rounded-xl cursor-pointer bg-emerald-50/20",
                        title: "Xuất bản cho học sinh",
                        children: /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black flex items-center gap-1 leading-none px-0.5", children: "🚀 Xuất bản" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1325,
                          columnNumber: 31
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1320,
                        columnNumber: 29
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => setDeleteModalState({ show: true, examIdToDel: exam.id, examTitleToDel: exam.title, isProcessing: false }),
                        className: "p-1.5 border border-slate-200 hover:border-red-400 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer",
                        title: "Xóa kỳ thi",
                        children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1337,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1332,
                        columnNumber: 27
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => handleOpenQuestionsMgmt(exam),
                        className: "px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-650 hover:text-white border border-indigo-250 text-indigo-700 text-[10px] font-black rounded-xl uppercase flex items-center gap-0.5 shrink-0 ml-1.5",
                        children: [
                          /* @__PURE__ */ jsxDEV(ListOrdered, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                            lineNumber: 1345,
                            columnNumber: 29
                          }, this),
                          " Câu hỏi"
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1341,
                        columnNumber: 27
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1290,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1274,
                  columnNumber: 23
                }, this)
              ]
            },
            exam.id,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1155,
              columnNumber: 21
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1140,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 928,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
      lineNumber: 812,
      columnNumber: 9
    }, this) : (
      /* ======================== WORKSPACE: MANAGE QUESTIONS INSIDE AN EXAM ======================== */
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-6 space-y-6 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setViewMode("list");
                },
                className: "p-2 border border-slate-200 hover:bg-slate-50 rounded-2xl cursor-pointer text-slate-650 flex items-center gap-1 text-xs font-bold",
                children: [
                  /* @__PURE__ */ jsxDEV(ArrowLeft, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1370,
                    columnNumber: 17
                  }, this),
                  " Quay Lại"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1366,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase rounded-lg px-2 py-0.5 bg-indigo-100 border border-indigo-200 text-indigo-700 leading-none", children: [
                activeExam?.level,
                " • PHASE ",
                activeExam?.phase
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1373,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-900 mt-1 uppercase", children: [
                'QUẢN TRỊ CÂU HỎI KỲ THI: "',
                activeExam?.title,
                '"'
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1376,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-450 leading-relaxed", children: "Sắp xếp, tạo thủ công hoặc nạp câu hỏi sẵn có từ Ngân hàng đề hệ thống." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1377,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1372,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1365,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setShowNewQuestionForm(true),
              className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-sm",
              children: [
                /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1386,
                  columnNumber: 17
                }, this),
                " THÊM CÂU HỎI MỚI THỦ CÔNG"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1382,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1381,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1364,
          columnNumber: 11
        }, this),
        showNewQuestionForm && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/70 border border-indigo-150 p-5 rounded-2xl text-xs space-y-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-200 pb-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-800 uppercase text-[11px]", children: "Tạo câu hỏi mới trực tiếp cho đề thi này" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1395,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("button", { onClick: () => setShowNewQuestionForm(false), className: "text-slate-450", children: "Hủy" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1396,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1394,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("form", { onSubmit: handleAddNewCustomQuestionSubmit, className: "grid grid-cols-1 md:grid-cols-12 gap-3.5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-3", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-slate-600 font-bold block mb-1", children: "Kỹ Năng Trực Thuộc" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1402,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: newQSkill,
                  onChange: (e) => setNewQSkill(e.target.value),
                  className: "w-full border border-slate-205 p-2 rounded-lg bg-white",
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "Listening", children: "Listening (Nghe)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1408,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "Speaking", children: "Speaking (Nói)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1409,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "Reading", children: "Reading (Đọc)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1410,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "Writing", children: "Writing (Viết)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1411,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "Grammar", children: "Grammar (Ngữ pháp)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1412,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "Vocabulary", children: "Vocabulary (Từ vựng)" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1413,
                      columnNumber: 21
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1403,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1401,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-9", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-slate-600 font-bold block mb-1", children: "Đề bài (Prompt / Tiêu đề câu hỏi)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1418,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  required: true,
                  value: newQPrompt,
                  onChange: (e) => setNewQPrompt(e.target.value),
                  placeholder: "Chẳng hạn: Lắng nghe đoạn audio sau và chọn đáp án thích đáng nhất.",
                  className: "w-full border border-slate-205 p-2 rounded-lg bg-white"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1419,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1417,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-12", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-black block mb-1", children: "Đoạn Văn Bản / Transcript đi kèm (Nếu có)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1430,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                "textarea",
                {
                  rows: 2,
                  value: newQPassage,
                  onChange: (e) => setNewQPassage(e.target.value),
                  placeholder: "Transcript nghe hoặc bài đọc dài cho kỹ năng Reading.",
                  className: "w-full border border-slate-205 p-2 rounded-lg bg-white"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1431,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1429,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-12 border-t border-slate-200/60 pt-2 bg-slate-100/50 p-3 rounded-xl space-y-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-[10.5px] text-slate-700 block", children: "Tùy Chọn Trắc Nghiệm (Để trống nếu là Tự Luận - Writing / Speaking)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1441,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Đáp án A (Không cần gõ sẵn 'A. ')",
                    value: newQOptionA,
                    onChange: (e) => setNewQOptionA(e.target.value),
                    className: "w-full border border-slate-200 p-2 rounded-lg bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1444,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Đáp án B (Không cần gõ sẵn 'B. ')",
                    value: newQOptionB,
                    onChange: (e) => setNewQOptionB(e.target.value),
                    className: "w-full border border-slate-200 p-2 rounded-lg bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1451,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Đáp án C (Tùy chọn)",
                    value: newQOptionC,
                    onChange: (e) => setNewQOptionC(e.target.value),
                    className: "w-full border border-slate-200 p-2 rounded-lg bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1458,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Đáp án D (Tùy chọn)",
                    value: newQOptionD,
                    onChange: (e) => setNewQOptionD(e.target.value),
                    className: "w-full border border-slate-200 p-2 rounded-lg bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1465,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1443,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 items-center", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-slate-650 font-bold mr-2", children: "Đáp án Đúng:" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1476,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "select",
                    {
                      value: newQCorrect,
                      onChange: (e) => setNewQCorrect(e.target.value),
                      className: "border border-slate-200 p-1.5 rounded-md bg-white text-xs",
                      children: [
                        /* @__PURE__ */ jsxDEV("option", { value: "A", children: "Thư mục A" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1482,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("option", { value: "B", children: "Thư mục B" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1483,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("option", { value: "C", children: "Thư mục C" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1484,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("option", { value: "D", children: "Thư mục D" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1485,
                          columnNumber: 25
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1477,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1475,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Lời gợi ý / Hộp nhập dữ liệu phản xạ (cho viết luận)",
                    value: newQPlaceholder,
                    onChange: (e) => setNewQPlaceholder(e.target.value),
                    className: "w-full border border-slate-200 p-1.5 rounded-lg bg-white text-xs"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1490,
                    columnNumber: 23
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1489,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1474,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1440,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-12 flex justify-end gap-2 text-xs", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setShowNewQuestionForm(false),
                  className: "px-4 py-1.5 bg-slate-200 text-slate-705 rounded-lg hover:bg-slate-300",
                  children: "Hủy"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1502,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "submit",
                  className: "px-5 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold rounded-lg shadow-sm",
                  children: "Xác Nhận Thêm Vào Kỳ Thi"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1509,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1501,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1399,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1393,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-7 bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "pb-2 border-b border-slate-200 flex justify-between items-center", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider", children: [
                "CẤU TRÚC ĐỀ THI HIỆN TẠI (",
                (activeExam?.sections || []).length,
                " CÂU HỎI)"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1527,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 italic", children: "Mẹo: Thí sinh sẽ làm bài theo đúng trật tự sắp xếp dưới đây" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1528,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1526,
              columnNumber: 15
            }, this),
            !activeExam?.sections || activeExam.sections.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12 p-4 text-slate-405 leading-relaxed bg-white border border-dashed border-slate-250 rounded-2xl", children: [
              /* @__PURE__ */ jsxDEV(HelpCircle, { className: "w-8 h-8 text-indigo-400 mx-auto mb-2" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1533,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold", children: "Chưa có câu hỏi nào trong đề thi này." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1534,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-1", children: "Sử dụng form phía trên hoặc chọn câu hỏi từ Ngân hàng câu hỏi bên tay phải để liên kết ngay lập tức." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1535,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1532,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 max-h-[600px] overflow-y-auto", children: activeExam.sections.map((sec, sIdx) => /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "bg-white border border-slate-200 p-4 rounded-2xl hover:border-slate-350 space-y-3 relative group transition-all",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center bg-slate-50/80 p-1.5 rounded-lg border border-slate-100", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-black font-mono", children: [
                      "Năm: ",
                      sec.name || "N/A"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1545,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-mono font-bold mr-2", children: [
                        "Vị trí: [",
                        sIdx + 1,
                        "]"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1550,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleQuestionOrderMove(sIdx, "up"),
                          disabled: sIdx === 0,
                          className: "p-1 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer",
                          title: "Xếp dịch lên",
                          children: /* @__PURE__ */ jsxDEV(ArrowUp, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                            lineNumber: 1559,
                            columnNumber: 29
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1553,
                          columnNumber: 27
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleQuestionOrderMove(sIdx, "down"),
                          disabled: sIdx === activeExam.sections.length - 1,
                          className: "p-1 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer",
                          title: "Xếp dịch xuống",
                          children: /* @__PURE__ */ jsxDEV(ArrowDown, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                            lineNumber: 1567,
                            columnNumber: 29
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1561,
                          columnNumber: 27
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleDeleteSectionQuestion(sIdx),
                          className: "p-1 text-rose-500 hover:bg-rose-50 rounded ml-1.5 cursor-pointer",
                          title: "Gỡ khỏi đề",
                          children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                            lineNumber: 1576,
                            columnNumber: 29
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1571,
                          columnNumber: 27
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1549,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1544,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold text-slate-800 leading-normal", children: sec.prompt }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1583,
                      columnNumber: 25
                    }, this),
                    sec.passage && /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-serif italic text-[10.5px] max-h-[70px] overflow-y-auto leading-relaxed text-slate-600", children: sec.passage }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1585,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1582,
                    columnNumber: 23
                  }, this),
                  sec.options && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-1.5 text-[10.5px]", children: sec.options.map((opt, oIdx) => /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      className: `p-1.5 rounded-lg border leading-tight ${sec.correctAnswer === opt.charAt(0) ? "bg-emerald-50 border-emerald-350 text-emerald-850 font-bold" : "bg-slate-50/50 border-slate-100 text-slate-600"}`,
                      children: opt
                    },
                    oIdx,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1595,
                      columnNumber: 29
                    },
                    this
                  )) }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1593,
                    columnNumber: 25
                  }, this),
                  !sec.options && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-400 bg-slate-50/50 p-2 rounded-xl italic border border-slate-100", children: sec.placeholderText || "Sinh viên nhập luận tự luận trả lời phản xạ." }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1610,
                    columnNumber: 25
                  }, this)
                ]
              },
              sIdx,
              true,
              {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1540,
                columnNumber: 21
              },
              this
            )) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1538,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1525,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-5 bg-white border border-slate-205 p-5 rounded-3xl space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-2.5", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV(HelpCircle, { className: "w-4.5 h-4.5 text-indigo-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1625,
                  columnNumber: 19
                }, this),
                "KHO NGÂN HÀNG CÂU HỎI"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1624,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 mt-1", children: "Lục lọi và tích hợp bất kỳ câu hỏi nào sẵn có trên hệ thống vào kỳ thi này chỉ với 1-Click." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1628,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1623,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxDEV(Search, { className: "w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1634,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    placeholder: "Tìm câu hỏi...",
                    value: searchQuestionQuery,
                    onChange: (e) => setSearchQuestionQuery(e.target.value),
                    className: "w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 text-[11px]"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1635,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1633,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: filterQuestionSkill,
                  onChange: (e) => setFilterQuestionSkill(e.target.value),
                  className: "bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Mọi kỹ năng" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1649,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "listening", children: "Listening" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1650,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "speaking", children: "Speaking" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1651,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "reading", children: "Reading" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1652,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "writing", children: "Writing" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1653,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "grammar", children: "Grammar" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1654,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "vocabulary", children: "Vocabulary" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1655,
                      columnNumber: 19
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1644,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1632,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 max-h-[450px] overflow-y-auto pr-1 bg-slate-50/30 p-2 rounded-xl", children: getFilteredQuestionBank().length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-10 text-slate-450 text-[11px] italic", children: "Không tìm thấy câu hỏi tương thích." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1662,
              columnNumber: 19
            }, this) : getFilteredQuestionBank().map((bq) => {
              const isAssigned = activeExam?.sections?.some((s) => s.prompt === bq.questionText);
              return /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: "bg-white border border-slate-200 p-3 rounded-xl hover:border-slate-300 space-y-2 text-[11px]",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[9px] font-mono border-b border-slate-100 pb-1.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "uppercase font-black text-indigo-700", children: [
                        bq.skill,
                        " (",
                        bq.level,
                        ")"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1674,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: [
                        "ID: ",
                        bq.id
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1675,
                        columnNumber: 27
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1673,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "font-semibold text-slate-850 text-[11.5px] leading-tight line-clamp-2", children: bq.questionText }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1678,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-1.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[8.5px] text-slate-400", children: [
                        "Đáp án chuẩn: ",
                        /* @__PURE__ */ jsxDEV("strong", { children: bq.correctAnswer || "Tự luận" }, void 0, false, {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1681,
                          columnNumber: 87
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                        lineNumber: 1681,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => handleAddQuestionFromBank(bq),
                          disabled: isAssigned,
                          className: `px-3 py-1.5 rounded-lg text-[9.5px] font-extrabold uppercase flex items-center gap-1 transition-all cursor-pointer ${isAssigned ? "bg-slate-100 text-slate-400 border border-slate-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"}`,
                          children: [
                            isAssigned ? /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5" }, void 0, false, {
                              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                              lineNumber: 1692,
                              columnNumber: 43
                            }, this) : /* @__PURE__ */ jsxDEV(Plus, { className: "w-3.5 h-3.5" }, void 0, false, {
                              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                              lineNumber: 1692,
                              columnNumber: 79
                            }, this),
                            isAssigned ? "Đã Chọn" : "Tích Hợp Ngay"
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                          lineNumber: 1683,
                          columnNumber: 27
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                      lineNumber: 1680,
                      columnNumber: 25
                    }, this)
                  ]
                },
                bq.id,
                true,
                {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1669,
                  columnNumber: 23
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1660,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1622,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1522,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 1361,
        columnNumber: 9
      }, this)
    ),
    deleteModalState.show && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300",
          onClick: () => {
            if (!deleteModalState.isProcessing) {
              setDeleteModalState((prev) => ({ ...prev, show: false }));
            }
          }
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1713,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "relative bg-white w-full max-w-lg rounded-[2.5rem] border border-slate-200/60 shadow-2xl p-6 md:p-8 overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-32 h-32 bg-rose-100/30 rounded-full blur-3xl -z-10" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1725,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-3.5 bg-rose-50 rounded-2xl text-rose-600 shrink-0", children: /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-6 h-6" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1729,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1728,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 flex-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-900 tracking-tight", children: "Xác nhận xóa kỳ thi" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1732,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-semibold leading-relaxed", children: "Bạn có chắc chắn muốn xóa kỳ thi này không?" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1734,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50/80 border border-slate-200 rounded-2xl select-all font-mono text-[11px] text-slate-600 space-y-1.5 shadow-sm", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-400 uppercase tracking-wider text-[9px] shrink-0", children: "Tên kỳ thi:" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1740,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-900 font-bold text-right", children: deleteModalState.examTitleToDel }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1741,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1739,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-400 uppercase tracking-wider text-[9px] shrink-0", children: "Mã kỳ thi (ID):" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1744,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-900 font-extrabold", children: deleteModalState.examIdToDel }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1745,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1743,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1738,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50/70 border border-rose-100/60 p-4 rounded-2xl space-y-1.5 text-rose-700 leading-relaxed shadow-sm", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-bold", children: "Hành động này có thể làm mất các liên kết giữa kỳ thi với phân khu, giai đoạn, câu hỏi và dữ liệu liên quan." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1750,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] font-semibold text-rose-650 flex items-center gap-1", children: "⚠️ Thao tác này không thể hoàn tác." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1753,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1749,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminTests.tsx",
            lineNumber: 1731,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1727,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "px-5 py-2.5 text-xs text-slate-600 font-black tracking-wider uppercase bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-xl transition-all disabled:opacity-50",
              disabled: deleteModalState.isProcessing,
              onClick: () => setDeleteModalState((prev) => ({ ...prev, show: false })),
              children: "Hủy"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1762,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "px-5 py-2.5 text-xs text-white font-black tracking-wider uppercase bg-rose-600 hover:bg-rose-700 disabled:bg-rose-450 hover:shadow-lg disabled:shadow-none hover:shadow-rose-650/10 cursor-pointer rounded-xl transition-all flex items-center gap-1.5",
              disabled: deleteModalState.isProcessing,
              onClick: handleConfirmDelete,
              children: deleteModalState.isProcessing ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("svg", { className: "animate-spin h-3.5 w-3.5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1779,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                    lineNumber: 1780,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1778,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Đang xóa..." }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1782,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1777,
                columnNumber: 19
              }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1786,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Xóa kỳ thi" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                  lineNumber: 1787,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminTests.tsx",
                lineNumber: 1785,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminTests.tsx",
              lineNumber: 1770,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminTests.tsx",
          lineNumber: 1761,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminTests.tsx",
        lineNumber: 1723,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminTests.tsx",
      lineNumber: 1711,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminTests.tsx",
    lineNumber: 794,
    columnNumber: 5
  }, this);
}
