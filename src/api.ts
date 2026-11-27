import { safeFetchJson } from "/src/utils/safeFetch.ts";
import { auth, db } from "/src/firebase.ts";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc as origGetDoc, setDoc as origSetDoc } from "firebase/firestore";
async function withFirestoreRetry(operation, maxRetries = 4, baseDelay = 1e3) {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        console.error(`[Firestore Client Retry Error] Failed after ${maxRetries} attempts. Error:`, err);
        return null;
      }
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
      console.warn(`[Firestore Client Retry Warning] Attempt ${attempt} failed. Retrying in ${Math.round(delay)}ms... Error:`, err?.message || err);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
const getDoc = async (docRef) => withFirestoreRetry(() => origGetDoc(docRef));
const setDoc = async (docRef: any, data: any, options?: any) => withFirestoreRetry(() => origSetDoc(docRef, data, options));
const getHeaders = () => {
  const userId = localStorage.getItem("learning_app_userId") || "";
  const language = localStorage.getItem("learning_app_language") || "vi";
  return {
    "Content-Type": "application/json",
    "x-user-id": userId,
    "x-user-language": language
  };
};
export function sanitizeForFirestore(value, path = "root") {
  if (value === void 0) {
    console.warn("[Firestore Sanitizer] Undefined field replaced:", path);
    return null;
  }
  if (value === null) return null;
  if (Array.isArray(value)) {
    return value.map((item, idx) => sanitizeForFirestore(item, `${path}[${idx}]`));
  }
  if (typeof value === "object") {
    const cleaned = {};
    Object.entries(value).forEach(([key, val]) => {
      if (val !== void 0) {
        cleaned[key] = sanitizeForFirestore(val, `${path}.${key}`);
      } else {
        console.warn("[Firestore Sanitizer] Undefined field replaced:", `${path}.${key}`);
        cleaned[key] = null;
      }
    });
    return cleaned;
  }
  return value;
}
export const api = {
  // Authentication
  register: async (fullName, email, password, username) => {
    try {
      let fbUid = "";
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        fbUid = userCredential.user.uid;
        const userRef = doc(db, "users", fbUid);
        const userData = {
          id: fbUid,
          fullName,
          email: email.toLowerCase(),
          username: username ? username.trim().toLowerCase() : email.split("@")[0],
          level: "A1",
          xp: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const cleanData = sanitizeForFirestore(userData, "users");
        console.log("[Firestore Write Payload]", JSON.stringify(cleanData, null, 2));
        await setDoc(userRef, cleanData);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          throw new Error("Email này đã được sử dụng trên Firebase Authentication.");
        }
        if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed") {
          console.warn("[Firebase Fallback] Email/Password Sign-In is not enabled on your Firebase Console. Under Authentication -> Sign-in method, please enable the Email/Password provider. Falling back to backend authentication in the meantime.");
        } else {
          console.error("Firebase auth registration failed:", err);
          throw err;
        }
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fbUid || void 0, fullName, email, password, username })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi kết nối máy chủ (Không thể phân tích hành động đăng ký).");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đăng ký");
      return data;
    } catch (err) {
      console.error("[API Error] Registration failed:", err);
      let msg = err.message || "Lỗi đăng ký";
      if (err.code === "auth/weak-password") {
        msg = "Mật khẩu quá yếu. Vui lòng nhập tối thiểu 6 ký tự.";
      }
      throw new Error(msg);
    }
  },
  login: async (email, password) => {
    try {
      console.log("[Auth] Auth login started");
      let fbUser = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        fbUser = userCredential.user;
        console.log("[Auth] Auth login success via Firebase");
      } catch (err) {
        console.log("[Auth] Auth login fail via Firebase:", err.code);
        const isConfigurationError = err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed";
        if (!isConfigurationError) {
          throw err;
        }
        console.warn("[Firebase Fallback] Using local backend authenticator because Email/Password provider is disabled in Firebase Console.");
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firebaseSucceeded: !!fbUser, fbUid: fbUser?.uid })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi kết nối máy chủ (Không thể phân tích hành động đăng nhập).");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đăng nhập");
      if (data.user) {
        localStorage.setItem("learning_app_userId", data.user.id);
      }
      return data;
    } catch (err) {
      console.error("[API Error] Login failed:", err);
      let msg = err.message || "Đã xảy ra lỗi đăng nhập.";
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        msg = "Mật khẩu không chính xác. Vui lòng kiểm tra lại!";
      } else if (err.code === "auth/user-not-found" || msg.includes("auth/user-not-found")) {
        msg = "Tài khoản không tồn tại trên hệ thống.";
      } else if (err.code === "auth/invalid-email" || msg.includes("auth/invalid-email")) {
        msg = "Địa chỉ email không đúng định dạng.";
      } else if (err.code === "auth/network-request-failed" || msg.includes("auth/network-request-failed")) {
        msg = "Lỗi kết nối mạng, vui lòng kiểm tra lại kết nối.";
      }
      throw new Error(msg);
    }
  },
  adminLogin: async (username, password) => {
    try {
      const isNetlify = window.location.hostname.includes("netlify") || !window.location.hostname.includes("run.app") && window.location.hostname !== "localhost";
      const endpoint = isNetlify ? "/.netlify/functions/admin-login" : "/api/admin/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const textData = await res.text();
      let data;
      try {
        data = textData ? JSON.parse(textData) : {};
      } catch (parseError) {
        throw new Error("Server trả về dữ liệu không hợp lệ (không phải JSON). Vui lòng kiểm tra file /netlify/functions/admin-login.js");
      }
      if (!res.ok) throw new Error(data.error || "Lỗi đăng nhập Admin");
      if (data.user) {
        localStorage.setItem("learning_app_userId", data.user.id);
      }
      return data;
    } catch (err) {
      console.error("[API Error] Admin login failed:", err);
      throw err;
    }
  },
  getMe: async () => {
    const userId = localStorage.getItem("learning_app_userId") || (auth.currentUser ? auth.currentUser.uid : null);
    if (!userId) return null;
    try {
      const res = await safeFetchJson("/api/auth/me", {
        method: "GET",
        headers: getHeaders()
      }, { user: null });
      if (res && res.user) {
        // Sync the fully normalized user state from the Express backend back to Firestore
        // so that any individual document checks remain fully up to date
        try {
          const userRef = doc(db, "users", userId);
          const cleanData = sanitizeForFirestore(res.user, "users");
          await setDoc(userRef, cleanData);
        } catch (syncErr) {
          console.warn("[Firestore Sync Back Warning] Failed to update client Firestore doc:", syncErr);
        }
        return res.user;
      }
    } catch (backendErr) {
      console.warn("Backend fetch failed for user session, trying Firestore fallback...", backendErr);
    }
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const remoteUser = userSnap.data();
        return {
          ...remoteUser,
          id: userId
        };
      }
    } catch (e) {
      console.warn("Firestore fallback fetch error for user session:", e);
    }
    return null;
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout failed", e);
    }
    localStorage.removeItem("learning_app_userId");
  },
  // Onboarding Interview
  submitInterview: async (interviewData) => {
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(interviewData)
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi thiết lập phỏng vấn.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi gửi thông tin phỏng vấn");
      return data.user;
    } catch (err) {
      console.error("[API Error] Interview submission failed:", err);
      throw err;
    }
  },
  updateActiveLevel: async (level) => {
    try {
      const res = await fetch("/api/user/active-level", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ level })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi thay đổi cấp độ học tập.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi thay đổi cấp độ");
      return data.user;
    } catch (err) {
      console.error("[API Error] Update active level failed:", err);
      throw err;
    }
  },
  updateLanguage: async (language) => {
    try {
      const res = await fetch("/api/user/language", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ language })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi thay đổi ngôn ngữ.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi thay đổi ngôn ngữ");
      return data.user;
    } catch (err) {
      console.error("[API Error] Update language failed:", err);
      throw err;
    }
  },
  // Placement Test Evaluator
  submitPlacementTest: async (answers) => {
    try {
      const res = await fetch("/api/placement-test", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ answers })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi gửi bài phỏng vấn xếp lớp.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi chấm điểm bài kiểm tra");
      return data;
    } catch (err) {
      console.error("[API Error] Placement test submission failed:", err);
      throw err;
    }
  },
  getPlacementTest: async () => {
    const res = await safeFetchJson("/api/placement-test", {
      method: "GET",
      headers: getHeaders()
    }, { testResult: null });
    return res.testResult;
  },
  // Weekly schedules
  getSchedules: async () => {
    const res = await safeFetchJson("/api/schedule", {
      headers: getHeaders()
    }, { schedules: [] });
    return res.schedules;
  },
  addSchedule: async (schedule) => {
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(schedule)
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi thêm thời khóa biểu.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi thêm lịch học");
      return data.schedule;
    } catch (err) {
      console.error("[API Error] Add schedule failed:", err);
      throw err;
    }
  },
  deleteSchedule: async (id) => {
    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi xóa thời khóa biểu.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi xóa lịch học");
      return true;
    } catch (err) {
      console.error("[API Error] Delete schedule failed:", err);
      throw err;
    }
  },
  saveSchedulesBulk: async (schedules) => {
    console.log("[Client API] saveSchedulesBulk initiated. Validating local schedules data...");
    if (!Array.isArray(schedules)) {
      console.error("[Client API Error] Invalid payload type passed to saveSchedulesBulk.");
      throw new Error("Dữ liệu lịch rảnh không hợp lệ. Payload phải là một mảng.");
    }
    console.log(`[Client API] Validation passed. Preparing to send ${schedules.length} schedules to server.`);
    try {
      const headers = getHeaders();
      console.log("[Client API] Sending POST request to /api/schedule/bulk with headers:", {
        "Content-Type": headers["Content-Type"],
        "x-user-id": headers["x-user-id"] ? `${headers["x-user-id"].slice(0, 6)}...` : "missing",
        "x-user-language": headers["x-user-language"]
      });
      const res = await fetch("/api/schedule/bulk", {
        method: "POST",
        headers,
        body: JSON.stringify({ schedules })
      });
      console.log(`[Client API] Received response from server. Status: ${res.status} ${res.statusText}`);
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        const rawBody = await res.text();
        console.error(`[Client API Error] Expected JSON but received content-type "${contentType}". Raw response body:`, rawBody);
        throw new Error("Lỗi máy chủ: Không kết nối được API lưu thời khóa biểu (Sai định dạng phản hồi từ Server).");
      }
      const data = await res.json();
      console.log("[Client API] Successfully parsed response JSON:", data);
      if (!res.ok) {
        const errorMsg = data.message || data.error || "Lỗi không xác định";
        const detailsMsg = data.details ? ` (${data.details})` : "";
        console.error(`[Client API Error] Server rejected the request: ${errorMsg}${detailsMsg}`);
        throw new Error(`${errorMsg}${detailsMsg}`);
      }
      console.log("[Client API] Bulk save schedules completed successfully. New schedules count:", data.schedules?.length);
      return data.schedules;
    } catch (err) {
      console.error("[Client API Error] saveSchedulesBulk failed in try-catch block:", err);
      throw err;
    }
  },
  // Lessons Practice Questions fetch
  getUserProgress: async () => {
    const res = await safeFetchJson("/api/user/progress", {
      headers: getHeaders()
    }, { success: false, progress: [] });
    return res.progress || [];
  },
  getPracticeQuestions: async (skill, levelNumber, lessonNumber) => {
    const query = new URLSearchParams({
      skill,
      levelNumber: String(levelNumber),
      lessonNumber: String(lessonNumber)
    });
    const res = await safeFetchJson(`/api/practice/questions?${query}`, {
      headers: getHeaders()
    }, { questions: [] });
    return res.questions;
  },
  // Evaluate speech client side fallback or backend AI query
  evaluateSpeaking: async (textToRead, transcriptionReceived) => {
    return await safeFetchJson("/api/ai/evaluate-speaking", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ textToRead, transcriptionReceived })
    }, {
      pronunciation: 80,
      fluency: 75,
      grammar: 90,
      feedback: "Phát âm đầy đủ, có ngữ điệu nhưng cần ngắt câu đều đặn hơn."
    });
  },
  // Evaluate short essay using Gemini AI
  evaluateWriting: async (prompt, essayInput) => {
    return await safeFetchJson("/api/ai/evaluate-writing", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ prompt, essayInput })
    }, {
      vocabulary: 80,
      grammar: 80,
      structure: 80,
      corrections: [],
      detailedAdvice: "Cố rèn luyện viết đoạn văn có nhiều từ nối và mệnh đề trạng từ."
    });
  },
  // Submit final lesson score + reward XP
  submitLessonScore: async (payload) => {
    try {
      const res = await fetch("/api/practice/submit", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi hoàn thành bài học.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi gửi điểm bài học");
      return data;
    } catch (err) {
      console.error("[API Error] Submit lesson score failed:", err);
      throw err;
    }
  },
  // Core metrics analytics dashboard stats
  getDashboardStats: async (level?: string) => {
    const url = level ? `/api/dashboard/stats?level=${encodeURIComponent(level)}` : "/api/dashboard/stats";
    const res = await safeFetchJson(url, {
      headers: getHeaders()
    });
    return res.stats;
  },
  // Ranked leaderboard
  getLeaderboard: async () => {
    const res = await safeFetchJson("/api/leaderboard", {
      headers: getHeaders()
    }, { leaderboard: [] });
    return res.leaderboard;
  },
  // --------- Admin Operations ---------
  getAdminStats: async () => {
    const res = await safeFetchJson("/api/admin/stats", { headers: getHeaders() });
    return res.stats;
  },
  getAdminUsers: async () => {
    const res = await safeFetchJson("/api/admin/users", { headers: getHeaders() }, { users: [], totalInDb: 0, totalSent: 0 });
    return res;
  },
  getAdminDbStatus: async () => {
    const res = await safeFetchJson("/api/admin/db-status", { headers: getHeaders() });
    return res;
  },
  updateAdminUser: async (id, updates) => {
    const res = await safeFetchJson(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates)
    }, { user: null });
    return res.user;
  },
  createAdminUser: async (userPayload) => {
    const res = await safeFetchJson("/api/admin/users", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userPayload)
    }, { success: false, user: null });
    return res;
  },
  bulkDeleteAdminUsers: async (ids) => {
    try {
      const res = await fetch("/api/students/bulk-delete", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ ids })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data.error || `Lỗi từ hệ thống (Mã phản hồi: ${res.status})` };
      }
      return { success: !!data.success, error: data.error };
    } catch (err) {
      return { success: false, error: err.message || "Lỗi kết nối từ máy khách." };
    }
  },
  deleteAdminUser: async (id) => {
    const url = `/api/students/${id}`;
    console.log("CALLING_DELETE_API:", url);
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        const errorMsg = data2.error || `Lỗi xóa tài khoản (Mã phản hồi: ${res.status})`;
        console.log("DELETE_RESPONSE:", data2);
        console.log("DELETE_ERROR:", errorMsg);
        throw new Error(errorMsg);
      }
      const data = await res.json().catch(() => ({ success: true }));
      console.log("DELETE_RESPONSE:", data);
      return !!data.success;
    } catch (err) {
      console.log("DELETE_ERROR:", err.message || err);
      throw err;
    }
  },
  getAdminQuestions: async (page = 1, limit = 50) => {
    const res = await safeFetchJson("/api/admin/questions?page=" + page + "&limit=" + limit, { headers: getHeaders() }, { questions: [], totalPages: 1, currentPage: 1, totalItems: 0 });
    return res;
  },
  getAdminQuestionsAll: async () => {
    const res = await safeFetchJson("/api/admin/questions?limit=all", { headers: getHeaders() }, { questions: [] });
    return res.questions;
  },
  createAdminQuestion: async (question) => {
    if (!question.id) {
      question.id = "q_" + Date.now() + "_" + Math.floor(Math.random() * 1e3);
    }
    const qAny = question;
    const normalizedData = {
      id: question.id,
      questionText: question.questionText || qAny.prompt || "",
      options: question.options || [],
      correctAnswer: question.correctAnswer || "",
      explanation: qAny.explanation || "",
      subject: qAny.subject || question.skill || "",
      grade: qAny.grade || question.levelNumber?.toString() || "",
      examId: qAny.examId || null,
      difficulty: qAny.difficulty || "medium",
      createdAt: qAny.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...question,
      // keep nested fields
      isDeleted: false
    };
    const dbModule = await import("/src/firebase.ts");
    const { doc: doc2, setDoc: setDoc2 } = await import("firebase/firestore");
    await setDoc2(doc2(dbModule.db, "questions", question.id), normalizedData);
    return normalizedData;
  },
  updateAdminQuestion: async (id, question) => {
    const qAny = question;
    const updatedData = {
      ...question,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const dbModule = await import("/src/firebase.ts");
    const { doc: doc2, setDoc: setDoc2 } = await import("firebase/firestore");
    await setDoc2(doc2(dbModule.db, "questions", id), updatedData, { merge: true });
    return { id, ...updatedData };
  },
  deleteAdminQuestion: async (id) => {
    try {
      const dbModule = await import("/src/firebase.ts");
      const { doc: doc2, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc2(dbModule.db, "questions", id), { isDeleted: true, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  importExcelQuestions: async (base64Excel) => {
    try {
      const res = await fetch("/api/admin/questions/import", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ base64Data: base64Excel })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi nạp tệp Excel định cấu hình câu hỏi.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi không thể nạp tệp Excel");
      return data;
    } catch (err) {
      console.error("[API Error] PDF/Excel questions import failed:", err);
      throw err;
    }
  },
  // Smart Study Plan endpoints
  getSmartStudyPlan: async () => {
    return await safeFetchJson("/api/smart-study-plan", {
      headers: getHeaders()
    });
  },
  recalculateSmartStudyPlan: async () => {
    try {
      const res = await fetch("/api/smart-study-plan/recalculate", {
        method: "POST",
        headers: getHeaders()
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi tính toán lại kế hoạch.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi cập nhật lộ trình học");
      return data;
    } catch (err) {
      console.error("[API Error] Study plan recalculation failed:", err);
      throw err;
    }
  },
  simulateSmartStudyPlan: async (simulatedSessions, simulatedMinutes) => {
    try {
      const res = await fetch("/api/smart-study-plan/simulate", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ simulatedSessions, simulatedMinutes })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi tính toán mô phỏng.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi tính toán mô phỏng kịch bản");
      return data;
    } catch (err) {
      console.error("[API Error] Study plan simulation failed:", err);
      throw err;
    }
  },
  updateWeeklyRoadmapProgress: async (weekNumber, sessionId, status) => {
    try {
      const res = await fetch("/api/smart-study-plan/update-progress", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ weekNumber, sessionId, status })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi cập nhật tiến trình.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi cập nhật tiến trình học tập");
      return data;
    } catch (err) {
      console.error("[API Error] Study progress update failed:", err);
      throw err;
    }
  },
  submitRoadmapTest: async (weekNumber, sessionId, score) => {
    try {
      const res = await fetch("/api/smart-study-plan/submit-test", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ weekNumber, sessionId, score })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi nộp bài kiểm tra.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi nộp bài kiểm tra");
      return data;
    } catch (err) {
      console.error("[API Error] submitRoadmapTest failed:", err);
      throw err;
    }
  },
  submitRoadmapProject: async (weekNumber, sessionId, draft) => {
    try {
      const res = await fetch("/api/smart-study-plan/submit-project", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ weekNumber, sessionId, draft })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi nộp dự án.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi nộp báo cáo dự án");
      return data;
    } catch (err) {
      console.error("[API Error] submitRoadmapProject failed:", err);
      throw err;
    }
  },
  completeRoadmapTask: async (weekNumber, sessionId, taskIndex) => {
    try {
      const res = await fetch("/api/smart-study-plan/complete-task", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ weekNumber, sessionId, taskIndex })
      });
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error("Lỗi máy chủ khi cập nhật nhiệm vụ.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi hoàn thành nhiệm vụ");
      return data;
    } catch (err) {
      console.error("[API Error] completeRoadmapTask failed:", err);
      throw err;
    }
  },
  // Vocabulary & SRS
  getVocabularies: async (level?: string) => {
    const url = level ? `/api/vocabularies?level=${level}` : "/api/vocabularies";
    const res = await safeFetchJson(url, { headers: getHeaders() });
    return res;
  },
  addVocabulary: async (vocabData) => {
    return await safeFetchJson("/api/vocabularies", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(vocabData)
    }, { success: false });
  },
  editVocabulary: async (id, vocabData) => {
    return await safeFetchJson(`/api/vocabularies/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(vocabData)
    }, { success: false });
  },
  deleteVocabulary: async (id) => {
    return await safeFetchJson(`/api/vocabularies/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    }, { success: false });
  },
  importVocabularies: async (words) => {
    return await safeFetchJson("/api/vocabularies/import", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ words })
    }, { success: false });
  },
  submitVocabularyProgress: async (vocabularyId: string, rating: number | string, source?: string) => {
    return await safeFetchJson("/api/vocabulary/progress", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ vocabularyId, rating, source })
    }, { success: false });
  },
  getVocabularyProgress: async () => {
    return await safeFetchJson("/api/vocabulary/progress", {
      method: "GET",
      headers: getHeaders()
    }, { success: false, progress: [] });
  },
  submitVocabularyExerciseComplete: async (xpBonus: number, level?: string, accuracy?: number, stageName?: string, stageScore?: number) => {
    return await safeFetchJson("/api/vocabulary/exercise/complete", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ xpBonus, level, accuracy, stageName, stageScore })
    }, { success: false });
  },
  getSrsReviews: async () => {
    const res = await safeFetchJson("/api/srs/reviews", { headers: getHeaders() });
    return res;
  },
  // Pronunciation & IPA
  getPronunciationIpa: async (level?: string) => {
    const url = level ? `/api/pronunciation/ipa?level=${level}` : "/api/pronunciation/ipa";
    const res = await safeFetchJson(url, { headers: getHeaders() });
    return res;
  },
  saveIpaAction: async (phonemeId: string, action: string, score?: number) => {
    return await safeFetchJson("/api/pronunciation/ipa/action", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ phonemeId, action, score })
    }, { success: false });
  },
  evaluatePronunciation: async (lessonId, textToRead, transcriptionReceived) => {
    return await safeFetchJson("/api/pronunciation/evaluate", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ lessonId, textToRead, transcriptionReceived })
    }, {
      success: true,
      logRecord: {
        scores: { accuracy: 80, fluency: 80, intonation: 80, overall: 80 },
        feedback: "Luyện phát âm chuẩn xác."
      }
    });
  },
  // Real-Life Scenarios Conversations Roleplay
  getScenarios: async (level?: string) => {
    const url = level ? `/api/conversations/scenarios?level=${level}` : "/api/conversations/scenarios";
    const res = await safeFetchJson(url, { headers: getHeaders() });
    return res;
  },
  sendScenarioChat: async (scenarioId, character, history) => {
    return await safeFetchJson("/api/conversations/chat", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ scenarioId, character, history })
    }, { success: true, reply: "Nice context! Let's study more parameters." });
  },
  // AI Chat Tutor
  sendChatTutorMessage: async (message, chatHistory, level) => {
    return await safeFetchJson("/api/ai/chat-tutor", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, chatHistory, level })
    }, { reply: "Chào bạn, hãy đặt thêm nhiều câu hỏi ngữ pháp." });
  },
  // Exam Preparation
  getExams: async (level?: string) => {
    const url = level ? `/api/exams?level=${level}` : "/api/exams";
    const res = await safeFetchJson(url, { headers: getHeaders() });
    return res;
  },
  submitExam: async (examId, answers) => {
    return await safeFetchJson("/api/exams/submit", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ examId, answers })
    }, {
      success: true,
      result: {
        score: 8,
        feedback: "Độ chính xác cao, chú ý từ vựng học thuật nâng cao."
      }
    });
  },
  getExamResults: async () => {
    const res = await safeFetchJson("/api/exams/results", { headers: getHeaders() });
    return res;
  },
  // Daily Tasks
  getDailyTasks: async (level?: string) => {
    const url = level ? `/api/daily-tasks?level=${level}` : "/api/daily-tasks";
    const res = await safeFetchJson(url, { headers: getHeaders() });
    return res;
  },
  toggleDailyTask: async (taskId) => {
    return await safeFetchJson("/api/daily-tasks/toggle", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ taskId })
    }, { success: false });
  },
  notifyDailyTaskCompleted: async (taskId) => {
    return await safeFetchJson("/api/daily-tasks/notified", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ taskId })
    }, { success: false });
  },
  // Lessons Recommendations
  getRecommendations: async () => {
    const res = await safeFetchJson("/api/recommendations", { headers: getHeaders() });
    return res;
  },
  // Advanced AI Features & Learning Centers
  getWeaknessAnalysis: async () => {
    return await safeFetchJson("/api/ai/weakness-analysis", { headers: getHeaders() });
  },
  getPersonalizedRoadmap: async () => {
    return await safeFetchJson("/api/ai/personalized-roadmap", { headers: getHeaders() });
  },
  evaluatePronunciationScoring: async (targetWord, spokenText) => {
    return await safeFetchJson("/api/ai/pronunciation-scoring", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ targetWord, spokenText })
    });
  },
  generateAutoReview: async () => {
    return await safeFetchJson("/api/ai/auto-review", {
      method: "POST",
      headers: getHeaders()
    });
  },
  getAutoReviewPractice: async () => {
    const data = await api.generateAutoReview();
    const exercises = [];
    if (data && data.quiz) {
      data.quiz.forEach((q) => {
        const mappedOptions = (q.options || []).map((opt, idx) => {
          const prefix = String.fromCharCode(65 + idx);
          return `${prefix}. ${opt}`;
        });
        const correctIdx = (q.options || []).findIndex((opt) => opt.trim().toLowerCase() === q.correct.trim().toLowerCase());
        const correctLetter = String.fromCharCode(65 + (correctIdx !== -1 ? correctIdx : 0));
        const correctOption = `${correctLetter}. ${q.correct}`;
        exercises.push({
          questionText: q.question,
          options: mappedOptions,
          correctOption
        });
      });
    }
    if (data && data.listeningMini && exercises.length === 0) {
      const q = data.listeningMini;
      const mappedOptions = (q.options || []).map((opt, idx) => {
        const prefix = String.fromCharCode(65 + idx);
        return `${prefix}. ${opt}`;
      });
      const correctIdx = (q.options || []).findIndex((opt) => opt.trim().toLowerCase() === q.correct.trim().toLowerCase());
      const correctLetter = String.fromCharCode(65 + (correctIdx !== -1 ? correctIdx : 0));
      const correctOption = `${correctLetter}. ${q.correct}`;
      exercises.push({
        questionText: `[Listening] ${q.question} (Hear/See: "${data.listeningMini.audioPrompt}")`,
        options: mappedOptions,
        correctOption
      });
    }
    if (exercises.length === 0) {
      exercises.push({
        questionText: "Choose the word closest in meaning to 'resilient':",
        options: ["A. Flexible/strong", "B. Vulnerable", "C. Soft", "D. Quiet"],
        correctOption: "A. Flexible/strong"
      });
    }
    return {
      success: true,
      exercises
    };
  },
  getUserLearningGoals: async () => {
    return await safeFetchJson("/api/user/goals", { headers: getHeaders() });
  },
  updateUserLearningGoals: async (targetCount, months) => {
    return await safeFetchJson("/api/user/goals", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ targetCount, months })
    });
  },
  addWordToSRS: async (payload) => {
    return await safeFetchJson("/api/srs/add", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
  },
  getSrsStats: async () => {
    return await safeFetchJson("/api/srs/stats", { headers: getHeaders() });
  },
  getSrsDueSummary: async () => {
    return await safeFetchJson("/api/srs/due-summary", { headers: getHeaders() });
  },
  migrateFirestoreAll: async () => {
    return await safeFetchJson("/api/admin/system/migrate-firestore", {
      method: "POST",
      headers: getHeaders()
    });
  }
};
