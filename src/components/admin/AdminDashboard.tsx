import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { SafeChartContainer } from "/src/components/SafeChart.tsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Users, GraduationCap, FileQuestion, FileText, BookOpen, Layers, Flame, CheckCircle, Clock, Percent, AlertTriangle } from "lucide-react";
const COLORS = ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getAdminStats();
      if (res) {
        setStats(res);
      } else {
        throw new Error("Không thể tải thông tin thống kê.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Lỗi nạp dữ liệu thống kê.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center p-12 space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed", children: "Đang nạp dữ liệu phân tích hệ thống..." }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this);
  }
  const totalStudents = stats?.totalStudents || 0;
  const totalLessons = stats?.totalLessons || 0;
  const totalQuestions = stats?.totalQuestions || 0;
  const totalExams = stats?.totalExams || 0;
  const totalVocabs = stats?.totalVocabs || 0;
  const totalTopics = stats?.totalTopics || stats?.levelRatios?.length || 0;
  const totalFlashcards = stats?.totalFlashcards || 0;
  const totalStudyLogs = stats?.totalStudyLogs || 0;
  const totalTestSubmissions = stats?.totalTestSubmissions || 0;
  const avgCompletionRate = stats?.avgCompletionRate || 0;
  const activeToday = stats?.activeToday || 0;
  const activeWeek = stats?.activeWeek || 0;
  const activeMonth = stats?.activeMonth || 0;
  const avgStudyDuration = stats?.avgStudyDurationMinutes || 0;
  const levelData = stats?.levelRatios || [];
  const activityTrend = stats?.activityTrend || [];
  const accuracyData = stats?.skillsAccuracy || [];
  const worstQuestions = stats?.worstQuestions || [];
  const hardestTopics = stats?.hardestTopics || [];
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1.5 hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400", children: "HỌC VIÊN" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 87,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Users, { className: "w-4 h-4 text-cyan-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 88,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 86,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-slate-900 leading-none block", children: totalStudents }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 91,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block font-semibold", children: "Tài khoản chính thức" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 92,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 90,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 85,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1.5 hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400 font-bold", children: "BÀI HỌC" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 98,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(GraduationCap, { className: "w-4 h-4 text-blue-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 99,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 97,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-slate-900 leading-none block", children: totalLessons }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 102,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block font-semibold", children: [
            totalTopics,
            " Cấp độ đào tạo"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 103,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 101,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1.5 hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400 font-bold", children: "CÂU HỎI" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 109,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FileQuestion, { className: "w-4 h-4 text-indigo-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 110,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 108,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-slate-900 leading-none block", children: totalQuestions }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 113,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block font-semibold", children: "Bộ câu hỏi active" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 114,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1.5 hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400 font-bold", children: "BÀI KIỂM TRA" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 120,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FileText, { className: "w-4 h-4 text-violet-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 121,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-slate-900 leading-none block", children: totalExams }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 124,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block font-semibold", children: "Tests & Quizzes" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 125,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 123,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 118,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-4 rounded-2xl col-span-2 md:col-span-1 shadow-sm space-y-1.5 hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-slate-400 font-bold", children: "TỪ VỰNG & CARDS" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 131,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-4 h-4 text-fuchsia-500" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 132,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 130,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-slate-900 leading-none block", children: totalVocabs }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block font-semibold", children: [
            totalFlashcards,
            " Flashcards, SRS"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
      lineNumber: 83,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-cyan-50/50 border border-cyan-100 p-3.5 rounded-2xl flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxDEV(Flame, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 147,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-cyan-700 block uppercase tracking-wide", children: "LƯỢT HỌC TẬP" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 150,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-slate-900", children: [
            totalStudyLogs,
            " lượt"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 151,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 149,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 145,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-5 h-5" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 157,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 156,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-emerald-700 block uppercase tracking-wide", children: "ĐÃ HÒAN THÀNH" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 160,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-slate-900", children: [
            avgCompletionRate,
            "% khóa"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 161,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 159,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 155,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-violet-50/50 border border-violet-100 p-3.5 rounded-2xl flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxDEV(Clock, { className: "w-5 h-5" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 167,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-violet-700 block uppercase tracking-wide", children: "HỌC TRUNG BÌNH" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 170,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-slate-900", children: [
            avgStudyDuration,
            " phút/ngày"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 171,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 169,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50/50 border border-amber-100 p-3.5 rounded-2xl flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxDEV(Percent, { className: "w-5 h-5" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 177,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-amber-700 block uppercase tracking-wide", children: "LƯỢT LÀM BÀI TEST" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 180,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-slate-900", children: [
            totalTestSubmissions,
            " lượt"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 181,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 179,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 175,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
      lineNumber: 143,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Layers, { className: "w-4.5 h-4.5 text-indigo-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 194,
              columnNumber: 15
            }, this),
            " THỐNG KÊ HỌC VIÊN THEO CẤP ĐỘ (CEFR)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 193,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Tỷ lệ phân bổ học viên vào 6 mức năng lực" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 192,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-[210px] flex items-center justify-center", children: levelData.length === 0 || levelData.every((d) => d.count === 0) ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center text-slate-400 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxDEV(Layers, { className: "w-8 h-8 text-slate-300 stroke-1.5" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 202,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-450", children: "Chưa có dữ liệu học viên hoat động" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 203,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-semibold uppercase", children: "Yêu cầu hoàn thành luyện tập/XP" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 204,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 201,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV(SafeChartContainer, { height: 210, data: levelData, children: ({ width, height }) => /* @__PURE__ */ jsxDEV(PieChart, { width, height, children: [
          /* @__PURE__ */ jsxDEV(
            Pie,
            {
              data: levelData,
              cx: "50%",
              cy: "50%",
              innerRadius: 50,
              outerRadius: 80,
              paddingAngle: 4,
              dataKey: "count",
              nameKey: "level",
              children: levelData.map((entry, index) => /* @__PURE__ */ jsxDEV(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 221,
                columnNumber: 25
              }, this))
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 210,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Tooltip, { formatter: (value, name) => [`${value} học viên`, `Mức ${name}`] }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 224,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Legend, { verticalAlign: "bottom", height: 24, iconType: "circle" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 225,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 209,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 207,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 199,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 191,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 lg:col-span-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(Flame, { className: "w-4.5 h-4.5 text-rose-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 238,
                columnNumber: 17
              }, this),
              " TIẾN TRÌNH HOẠT ĐỘNG TOÀN HỆ THỐNG"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 237,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Mức tương tác học tập hàng ngày trong tuần" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 240,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100", children: [
              "Hôm nay: ",
              activeToday
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 244,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-100", children: [
              "Tuần này: ",
              activeWeek
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 245,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100", children: [
              "Tháng này: ",
              activeMonth
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 246,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 243,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 235,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-[210px] flex items-center justify-center", children: activityTrend.length === 0 || activityTrend.every((d) => d.active === 0 && d.drills === 0) ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center text-slate-400 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxDEV(Flame, { className: "w-8 h-8 text-slate-300 stroke-1.5" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 253,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-450", children: "Chưa có tương tác học tập thực tế trong tuần" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 254,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-semibold uppercase", children: "Kết quả và logs học sinh sẽ vẽ biểu đồ tại đây" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 255,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 252,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV(SafeChartContainer, { height: 210, data: activityTrend, children: ({ width, height }) => /* @__PURE__ */ jsxDEV(LineChart, { width, height, data: activityTrend, children: [
          /* @__PURE__ */ jsxDEV(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 261,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(XAxis, { dataKey: "name", stroke: "#94a3b8", fontSize: 9, tickLine: false }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 262,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(YAxis, { stroke: "#94a3b8", fontSize: 9, tickLine: false }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 263,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Tooltip, {}, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 264,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Legend, { verticalAlign: "top", align: "right", fontSize: 9 }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 265,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "active", name: "Học viên hoạt động", stroke: "#06b6d4", strokeWidth: 3, dot: { r: 4 } }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 266,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "drills", name: "Lượt làm bài (Excercises)", stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "4 4", dot: false }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 267,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 260,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 258,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 250,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 234,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
      lineNumber: 188,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 lg:col-span-1", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Percent, { className: "w-4.5 h-4.5 text-cyan-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 284,
              columnNumber: 15
            }, this),
            " TỶ LỆ TRẢ LỜI ĐÚNG THEO KỸ NĂNG"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 283,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Hiệu năng giải kiến thức qua từng học phần" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 286,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 282,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-[230px] flex items-center justify-center", children: accuracyData.length === 0 || accuracyData.every((d) => d.accuracy === 0) ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center text-slate-400 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxDEV(Percent, { className: "w-8 h-8 text-slate-300 stroke-1.5" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 292,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-450", children: "Chưa có tỉ lệ kỹ năng tích lũy" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 293,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-semibold uppercase", children: "Yêu cầu học viên nộp bài luyện tập" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 294,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 291,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV(SafeChartContainer, { height: 230, data: accuracyData, children: ({ width, height }) => /* @__PURE__ */ jsxDEV(BarChart, { width, height, data: accuracyData, layout: "vertical", children: [
          /* @__PURE__ */ jsxDEV(CartesianGrid, { strokeDasharray: "3 3", horizontal: false, stroke: "#f1f5f9" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 300,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(XAxis, { type: "number", domain: [0, 100], stroke: "#94a3b8", fontSize: 9 }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 301,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(YAxis, { type: "category", dataKey: "skill", stroke: "#94a3b8", fontSize: 9, tickLine: false, width: 70 }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 302,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Tooltip, { formatter: (val) => [`${val}%`, "Độ chính xác"] }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 303,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(Bar, { dataKey: "accuracy", fill: "#06b6d4", radius: [0, 4, 4, 0], children: accuracyData.map((entry, index) => /* @__PURE__ */ jsxDEV(Cell, { fill: entry.color }, `cell-${index}`, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 306,
            columnNumber: 25
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 304,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 299,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 297,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 289,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 281,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-5 lg:col-span-2 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-4.5 h-4.5 text-rose-500 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 323,
                columnNumber: 17
              }, this),
              " CÂU HỎI SAI VÀ THẤT BẠI NHIỀU NHẤT"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 322,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase", children: "Báo động" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 325,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 321,
            columnNumber: 13
          }, this),
          worstQuestions.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "py-8 px-4 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs space-y-1", children: [
            /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-6 h-6 text-slate-300 stroke-1.5" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 330,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-450", children: "Chưa có câu hỏi sai nào được ghi nhận" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 331,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-semibold uppercase leading-none text-center", children: "Tất cả câu hỏi hiện đạt tỷ lệ chính xác tuyệt đối 100%" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 332,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 329,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100", children: worstQuestions.map((q) => /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50/20 hover:bg-slate-50 flex justify-between items-center gap-6 text-xs text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded", children: q.skill }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                  lineNumber: 340,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-500 font-mono", children: [
                  "ID: ",
                  q.id
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                  lineNumber: 341,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 339,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-800 font-extrabold line-clamp-1", children: q.text }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 343,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 338,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 text-right leading-none", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-rose-600 font-mono", children: [
                q.errorRate,
                "%"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 346,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 block font-semibold uppercase mt-0.5", children: "Thất bại" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 347,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 345,
              columnNumber: 21
            }, this)
          ] }, q.id, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 337,
            columnNumber: 19
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 335,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 320,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 pt-3 border-t border-slate-100 mt-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-4.5 h-4.5 text-amber-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 359,
                columnNumber: 17
              }, this),
              " CHỦ ĐỀ CHƯA VƯỢT QUA / ĐỘ KHÓ CAO NHẤT"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 358,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase", children: "Chú ý" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 361,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 357,
            columnNumber: 13
          }, this),
          hardestTopics.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "py-8 px-4 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs space-y-1", children: [
            /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-6 h-6 text-slate-300 stroke-1.5" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 366,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-450", children: "Chưa ghi nhận chủ đề khó nào" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 367,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-semibold uppercase leading-none text-center", children: "Tất cả bài học học phần đạt điểm vượt chuẩn xuất sắc" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 368,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 365,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: hardestTopics.map((topic, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-3 border border-slate-150 rounded-2xl space-y-1.5 text-left bg-slate-50/10 hover:border-slate-300 transition-colors", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded uppercase", children: topic.level }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 375,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-bold font-mono", children: [
                topic.attempts,
                " lượt"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 376,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 374,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-black leading-tight text-slate-850 line-clamp-2 min-h-[32px]", children: topic.name }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 378,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-1 border-t border-slate-100", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-semibold uppercase", children: "Đạt trung bình:" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 380,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-amber-600 font-mono", children: [
                topic.successRate,
                "%"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
                lineNumber: 381,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
              lineNumber: 379,
              columnNumber: 21
            }, this)
          ] }, idx, true, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 373,
            columnNumber: 19
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
            lineNumber: 371,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
          lineNumber: 356,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
        lineNumber: 317,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
      lineNumber: 278,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminDashboard.tsx",
    lineNumber: 80,
    columnNumber: 5
  }, this);
}
