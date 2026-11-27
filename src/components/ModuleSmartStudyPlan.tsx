import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { useNavigate } from "react-router-dom";
import { api } from "/src/api.ts";
import { ensureArray } from "/src/utils/arrayUtils.ts";
import { SafeChartContainer } from "/src/components/SafeChart.tsx";
import { CefrPathwayIcon } from "/src/components/CefrPathwayLogo.tsx";
import StudentEvaluationCard from "/src/components/StudentEvaluationCard.tsx";
import {
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Compass,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend
} from "recharts";
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayMapToEN = {
  "Thứ 2": "Monday",
  "Thứ 3": "Tuesday",
  "Thứ 4": "Wednesday",
  "Thứ 5": "Thursday",
  "Thứ 6": "Friday",
  "Thứ 7": "Saturday",
  "Chủ Nhật": "Sunday",
  "Monday": "Monday",
  "Tuesday": "Tuesday",
  "Wednesday": "Wednesday",
  "Thursday": "Thursday",
  "Friday": "Friday",
  "Saturday": "Saturday",
  "Sunday": "Sunday"
};
const dayMapToVI = {
  "Monday": "Thứ 2",
  "Tuesday": "Thứ 3",
  "Wednesday": "Thứ 4",
  "Thursday": "Thứ 5",
  "Friday": "Thứ 6",
  "Saturday": "Thứ 7",
  "Sunday": "Chủ Nhật",
  "Thứ 2": "Thứ 2",
  "Thứ 3": "Thứ 3",
  "Thứ 4": "Thứ 4",
  "Thứ 5": "Thứ 5",
  "Thứ 6": "Thứ 6",
  "Thứ 7": "Thứ 7",
  "Chủ Nhật": "Chủ Nhật"
};
function convertTo12HourVN(timeStr) {
  if (!timeStr) return "12:00 SA";
  const [hourStr, minStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const min = minStr || "00";
  const suffix = hour >= 12 ? "CH" : "SA";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${formattedHour}:${min} ${suffix}`;
}
function TimePickerField({ value, onChange }) {
  const [hourStr, minStr] = (value || "12:00").split(":");
  let hour24 = parseInt(hourStr, 10);
  if (isNaN(hour24)) hour24 = 12;
  let isPM = hour24 >= 12;
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const selectedHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;
  const selectedMin = minStr || "00";
  const selectedPeriod = isPM ? "CH" : "SA";
  const handlePartChange = (h12, m, p) => {
    let h24 = parseInt(h12, 10);
    if (p === "CH" && h24 < 12) h24 += 12;
    if (p === "SA" && h24 === 12) h24 = 0;
    const formattedH24 = h24 < 10 ? `0${h24}` : `${h24}`;
    onChange(`${formattedH24}:${m}`);
  };
  const hoursArr = Array.from({ length: 12 }, (_, i) => {
    const val = i + 1;
    return val < 10 ? `0${val}` : `${val}`;
  });
  const minutesArr = Array.from({ length: 60 }, (_, i) => {
    return i < 10 ? `0${i}` : `${i}`;
  });
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-sm hover:border-slate-350 transition-all font-sans text-xs font-semibold text-slate-800 w-full md:flex-1 gap-0.5", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-0.5 w-full justify-center", children: [
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          value: selectedHour,
          onChange: (e) => handlePartChange(e.target.value, selectedMin, selectedPeriod),
          className: "bg-transparent font-sans font-bold text-slate-800 px-1 py-1 cursor-pointer focus:outline-none rounded hover:bg-slate-50 text-[13px] text-center",
          children: hoursArr.map((h) => /* @__PURE__ */ jsxDEV("option", { value: h, children: h }, h, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 96,
            columnNumber: 13
          }, this))
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 90,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold select-none", children: ":" }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 100,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          value: selectedMin,
          onChange: (e) => handlePartChange(selectedHour, e.target.value, selectedPeriod),
          className: "bg-transparent font-sans font-bold text-slate-800 px-1 py-1 cursor-pointer focus:outline-none rounded hover:bg-slate-50 text-[13px] text-center",
          children: minutesArr.map((m) => /* @__PURE__ */ jsxDEV("option", { value: m, children: m }, m, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 108,
            columnNumber: 13
          }, this))
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 102,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          value: selectedPeriod,
          onChange: (e) => handlePartChange(selectedHour, selectedMin, e.target.value),
          className: "bg-transparent font-sans font-black text-indigo-600 px-1 py-1 cursor-pointer focus:outline-none rounded hover:bg-slate-50 text-[12px] text-center",
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "SA", children: "SA" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 117,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "CH", children: "CH" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 118,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 112,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Clock, { className: "w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" }, void 0, false, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
    lineNumber: 88,
    columnNumber: 5
  }, this);
}
export default function ModuleSmartStudyPlan({ user }) {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localSchedules, setLocalSchedules] = useState([]);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [recalculatingAI, setRecalculatingAI] = useState(false);
  const [simSessions, setSimSessions] = useState(4);
  const [simMinutes, setSimMinutes] = useState(300);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [placementTest, setPlacementTest] = useState(null);
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [planData, statsData, placementData] = await Promise.all([
        api.getSmartStudyPlan(),
        api.getDashboardStats(),
        api.getPlacementTest().catch(() => null)
      ]);
      setPlan(planData);
      setStats(statsData?.stats || statsData);
      setPlacementTest(placementData);
      const initialSchedules = ensureArray(planData?.schedules);
      const mapped = initialSchedules.map((item) => ({
        key: "db_" + item.id,
        id: item.id,
        dayOfWeek: dayMapToEN[item.dayOfWeek] || item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime
      }));
      setLocalSchedules(mapped);
      if (planData.analysis) {
        setSimSessions(planData.analysis.totalSessionsPerWeek || 4);
        setSimMinutes(planData.analysis.totalMinutesPerWeek || 300);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi đồng bộ thông tin Lộ trình & Thời khóa biểu học tập.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAllData();
  }, []);
  useEffect(() => {
    const triggerSimulation = async () => {
      setSimulating(true);
      try {
        const result = await api.simulateSmartStudyPlan(simSessions, simMinutes);
        setSimulationResult(result);
      } catch (e) {
        console.error(e);
      } finally {
        setSimulating(false);
      }
    };
    const handler = setTimeout(() => {
      if (plan && plan.analysis) {
        triggerSimulation();
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [simSessions, simMinutes]);
  const handleAddRow = () => {
    setError("");
    setSuccess("");
    const newIdx = localSchedules.length;
    const defaultDays = ["Monday", "Wednesday", "Friday", "Saturday", "Tuesday", "Thursday", "Sunday"];
    const chosenDay = defaultDays[newIdx % defaultDays.length];
    const defaultTimes = [
      { start: "19:00", end: "20:00" },
      { start: "20:00", end: "21:00" },
      { start: "09:00", end: "10:30" }
    ];
    const chosenTime = defaultTimes[newIdx % defaultTimes.length];
    const newRow = {
      key: "local_" + Math.random().toString(36).substr(2, 9),
      dayOfWeek: chosenDay,
      startTime: chosenTime.start,
      endTime: chosenTime.end
    };
    setLocalSchedules((prev) => [...prev, newRow]);
  };
  const handleRemoveRow = (key) => {
    setError("");
    setSuccess("");
    setLocalSchedules((prev) => prev.filter((item) => item.key !== key));
  };
  const handleUpdateRow = (key, field, value) => {
    setError("");
    setSuccess("");
    setLocalSchedules((prev) => prev.map((item) => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };
  const handleSaveSchedules = async () => {
    setError("");
    setSuccess("");
    for (const sch of localSchedules) {
      if (!sch.startTime || !sch.endTime) {
        setError("Vui lòng điền mốc giờ học cho tất cả các hàng.");
        return;
      }
      if (sch.startTime >= sch.endTime) {
        setError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
        return;
      }
    }
    setSavingSchedule(true);
    try {
      const payload = localSchedules.map((sch) => ({
        dayOfWeek: dayMapToVI[sch.dayOfWeek] || sch.dayOfWeek,
        startTime: sch.startTime,
        endTime: sch.endTime
      }));
      await api.saveSchedulesBulk(payload);
      setSuccess("Lịch rảnh học tập của bạn đã được cập nhật thành công.");
      await loadAllData();
    } catch (err) {
      setError(err.message || "Lỗi cập nhật lịch.");
    } finally {
      setSavingSchedule(false);
    }
  };
  const handleRecalculateAIPlan = async () => {
    setError("");
    setSuccess("");
    setRecalculatingAI(true);
    try {
      const updated = await api.recalculateSmartStudyPlan();
      setPlan(updated);
      setSuccess("Đã tái tạo lộ trình học & nhiệm vụ thông qua thuật toán AI.");
    } catch (err) {
      setError(err.message || "Lỗi tái tạo kế hoạch.");
    } finally {
      setRecalculatingAI(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-20 space-y-4", children: [
      /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-8 h-8 text-indigo-600 animate-spin" }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 313,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-slate-500 animate-pulse", children: "Đang đồng bộ Kế hoạch học tập thông minh..." }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 314,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 312,
      columnNumber: 7
    }, this);
  }
  const radarData = [
    { skill: "Nghe (Listening)", Score: Math.round((stats?.listening?.averageScore || 0) * 10), Target: 80 },
    { skill: "Nói (Speaking)", Score: Math.round((stats?.speaking?.averageScore || 0) * 10), Target: 75 },
    { skill: "Đọc (Reading)", Score: Math.round((stats?.reading?.averageScore || 0) * 10), Target: 80 },
    { skill: "Viết (Writing)", Score: Math.round((stats?.writing?.averageScore || 0) * 10), Target: 70 }
  ];
  const analysis = plan?.analysis || {
    totalSessionsPerWeek: 0,
    totalHoursPerWeek: 0,
    totalMinutesPerWeek: 0,
    totalHoursPerMonth: 0,
    totalHoursPerYear: 0
  };
  const prediction = plan?.roadmap?.prediction || { days: 120, weeks: 18, months: 4 };
  const phases = ensureArray(plan?.roadmap?.phases);
  const aiComment = plan?.recommendation?.comment || "Hãy lưu thời khóa biểu rảnh của bạn phía dưới để khởi tạo chỉ số phân tích AI đầu tiên.";
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-8 font-sans max-w-7xl mx-auto pb-16", id: "smart-study-plan-module", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-205 pb-5", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxDEV("span", { className: "px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-[10px] font-black text-indigo-600 tracking-wider uppercase animate-pulse", children: "COACH CÁ NHÂN HÓA • PREMIUM" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 347,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 346,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h2", { className: "text-[30px] font-[900] text-slate-900 tracking-tight leading-tight uppercase", children: "KẾ HOẠCH HỌC TẬP THÔNG MINH" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 351,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[14px] text-slate-500 font-medium", children: "Tối ưu hóa hành trình ôn luyện tiếng Anh dựa trên Thời khóa biểu thực tế, Trình độ hiện tại và AI dự phóng mục tiêu." }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 354,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 345,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleRecalculateAIPlan,
          disabled: recalculatingAI,
          className: "flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-extrabold text-[13px] py-3 px-5 rounded-2xl shadow-md cursor-pointer transition-all active:scale-98 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 animate-bounce" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 364,
              columnNumber: 11
            }, this),
            recalculatingAI ? "Đang phân tích..." : "Tái tạo lộ trình bằng AI ⚡"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 359,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 344,
      columnNumber: 7
    }, this),
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-4.5 h-4.5 shrink-0 text-red-500 animate-pulse" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 373,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "font-semibold leading-relaxed", children: error }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 374,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 372,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: error.includes("thời gian rảnh") || error.includes("lịch học") || error.includes("lưu") || error.includes("thời khóa biểu") ? handleSaveSchedules : loadAllData,
          className: "shrink-0 bg-red-100 hover:bg-red-200 text-red-800 font-extrabold px-3 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1 w-fit",
          children: [
            /* @__PURE__ */ jsxDEV(RefreshCw, { className: "w-3 h-3 animate-spin", style: { animationDuration: "3s" } }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 380,
              columnNumber: 13
            }, this),
            "Thử lại"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 376,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 371,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm", children: [
      /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4.5 h-4.5 shrink-0 text-emerald-600 animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 388,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: success }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 389,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 387,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] p-0.5 shadow-xl shadow-indigo-100", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-[1.95rem] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 flex flex-col items-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 rounded-3xl bg-white border border-indigo-100 shadow-md flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform", children: /* @__PURE__ */ jsxDEV(CefrPathwayIcon, { size: 64 }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 398,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 397,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-black text-indigo-600 tracking-wider mt-2.5", children: "PATHWAY AI" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 400,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 396,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 flex-1 text-center md:text-left", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-extrabold text-slate-800 flex items-center justify-center md:justify-start gap-1.5 uppercase tracking-wide", children: /* @__PURE__ */ jsxDEV("span", { children: "💬 Nhận xét & Chỉ dẫn từ Coach Trực Quan" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 405,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 404,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-650 leading-relaxed text-[15px] font-medium bg-indigo-50/20 p-4 rounded-2xl border border-slate-100/10 italic", children: [
          '"',
          aiComment,
          '"'
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 407,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 403,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 395,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 394,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 p-6 rounded-[1.8rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 418,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-2xl", children: "📅" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 419,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h4", { className: "text-slate-400 font-bold text-xs uppercase tracking-wider mt-3", children: "Mật độ học" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 420,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1 mt-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-slate-800", children: analysis.totalSessionsPerWeek }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 422,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-500", children: "buổi / tuần" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 423,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 421,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 mt-2", children: "Dựa trên thời khóa biểu đăng ký" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 425,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 417,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 p-6 rounded-[1.8rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 429,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-2xl", children: "⏳" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 430,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h4", { className: "text-slate-400 font-bold text-xs uppercase tracking-wider mt-3", children: "Thời lượng tự rảnh" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 431,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1 mt-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-indigo-600", children: analysis.totalMinutesPerWeek }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 433,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-500", children: "phút / tuần" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 434,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 432,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 mt-2", children: [
          "~ ",
          analysis.totalHoursPerWeek,
          " giờ luyện tập ròng"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 436,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 428,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 p-6 rounded-[1.8rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 440,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-2xl", children: "🎯" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 441,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h4", { className: "text-slate-400 font-bold text-xs uppercase tracking-wider mt-3", children: "Dự kiến bứt phá" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 442,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1 mt-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-emerald-600", children: prediction.months }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 444,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-500", children: "tháng" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 445,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-300 mx-1", children: "/" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 446,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-700", children: prediction.weeks }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 447,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-500", children: "tuần" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 448,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 443,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 mt-2", children: [
          "Ước tính để cán mốc ",
          user.level === "A1" ? "A2/B1" : "Mục tiêu"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 450,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 439,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 p-6 rounded-[1.8rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 454,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-2xl", children: "⚡" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 455,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h4", { className: "text-slate-400 font-bold text-xs uppercase tracking-wider mt-3", children: "Tích lũy năm học" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 456,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1 mt-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-amber-600", children: [
            "~",
            analysis.totalHoursPerYear
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 458,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-500", children: "giờ ròng / năm" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 459,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 457,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 mt-2", children: [
          "Bao gồm ",
          analysis.totalHoursPerMonth,
          " giờ ròng / tháng"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 461,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 453,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 415,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-7 space-y-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 rounded-[2.2rem] p-6 md:p-8 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-black text-slate-800 flex items-center gap-2 uppercase", children: [
              /* @__PURE__ */ jsxDEV(Calendar, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 477,
                columnNumber: 19
              }, this),
              " THỜI KHÓA BIỂU CÁ NHÂN HÓA"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 476,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 font-semibold uppercase tracking-wider", children: "Thêm bớt khung giờ rảnh của bạn để AI tự động cấu trúc bài học" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 479,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 475,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 474,
            columnNumber: 13
          }, this),
          localSchedules.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold", children: 'Chưa có khung giờ rảnh nào được chọn. Hãy nhấn "+ Thêm khung giờ mới" để bắt đầu thiết kế.' }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 486,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 max-h-[350px] overflow-y-auto pr-1", children: localSchedules.map((sch) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "bg-slate-50 hover:bg-[#ebf2fe]/40 border border-slate-100 p-2.5 rounded-2xl flex flex-col md:flex-row items-center gap-2.5 w-full transition-colors",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "w-full md:flex-[1.2]", children: /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: sch.dayOfWeek,
                    onChange: (e) => handleUpdateRow(sch.key, "dayOfWeek", e.target.value),
                    className: "bg-white border border-slate-200 rounded-xl px-3 py-2 font-black text-slate-700 w-full cursor-pointer text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-slate-300 transition-all shadow-sm",
                    children: DAYS_OF_WEEK.map((d) => /* @__PURE__ */ jsxDEV("option", { value: d, children: dayMapToVI[d] }, d, false, {
                      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                      lineNumber: 504,
                      columnNumber: 27
                    }, this))
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 498,
                    columnNumber: 23
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 497,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  TimePickerField,
                  {
                    value: sch.startTime,
                    onChange: (val) => handleUpdateRow(sch.key, "startTime", val)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 510,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  TimePickerField,
                  {
                    value: sch.endTime,
                    onChange: (val) => handleUpdateRow(sch.key, "endTime", val)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 516,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => handleRemoveRow(sch.key),
                    className: "bg-white hover:bg-rose-50 text-rose-500 border border-slate-200 hover:border-rose-200 rounded-xl px-4 py-2 transition-colors text-xs font-black cursor-pointer w-full md:w-16 active:scale-95",
                    children: "Xóa"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 522,
                    columnNumber: 21
                  },
                  this
                )
              ]
            },
            sch.key,
            true,
            {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 492,
              columnNumber: 19
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 490,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-3 pt-2", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleAddRow,
                className: "bg-slate-100/80 hover:bg-slate-200/50 text-slate-800 font-extrabold py-3 px-5 rounded-2xl text-[12.5px] transition-colors cursor-pointer flex items-center justify-center gap-1 focus:outline-none",
                children: "+ Thêm khung giờ rảnh"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 535,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleSaveSchedules,
                disabled: savingSchedule,
                className: "bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 px-5 rounded-2xl text-[12.5px] transition-all cursor-shadow shadow-md active:translate-y-0.5 disabled:opacity-50 flex items-center justify-center focus:outline-none",
                children: savingSchedule ? "Đang lưu lịch học..." : "Lưu thời gian rảnh"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 542,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 534,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 473,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-[2.2rem] p-6 md:p-8 shadow-md space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-black flex items-center gap-2 uppercase text-cyan-400", children: [
              /* @__PURE__ */ jsxDEV(Compass, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 556,
                columnNumber: 17
              }, this),
              " GIẢ LẬP KỊCH BẢN HỌC TẬP (WHAT-IF STUDY SIMULATOR)"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 555,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-200/70 leading-relaxed font-medium", children: "Bạn tò mò nếu gia tăng số giờ tự học rảnh rỗi lên, AI dự phóng bạn có thể hoàn thành khóa học sớm hơn bao nhiêu tuần? Khảo sát tốc độ bứt phá tại đây." }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 558,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 554,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-xs font-black", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-200 uppercase tracking-wide", children: "Số buổi học mong muốn" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 568,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-cyan-400 bg-indigo-800/60 px-2.5 py-0.5 rounded-full", children: [
                  simSessions,
                  " buổi / tuần"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 569,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 567,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "range",
                  min: "1",
                  max: "7",
                  value: simSessions,
                  onChange: (e) => setSimSessions(Number(e.target.value)),
                  className: "w-full accent-cyan-400 bg-indigo-950 border border-indigo-800/40 rounded-xl cursor-pointer"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 571,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 566,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-xs font-black", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-200 uppercase tracking-wide", children: "Tổng số phút tự học hàng tuần" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 584,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-cyan-405 bg-indigo-800/60 px-2.5 py-0.5 rounded-full", children: [
                  simMinutes,
                  " phút / tuần (",
                  Math.round(simMinutes / 60),
                  " giờ)"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 585,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 583,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "range",
                  min: "60",
                  max: "1200",
                  step: "30",
                  value: simMinutes,
                  onChange: (e) => setSimMinutes(Number(e.target.value)),
                  className: "w-full accent-cyan-400 bg-indigo-950 border border-indigo-800/40 rounded-xl cursor-pointer"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 587,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 582,
              columnNumber: 15
            }, this),
            simulating ? /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-4 text-xs font-bold text-center text-indigo-300 animate-pulse", children: "AI Coach đang tính toán dự toán hoàn thành mục tiêu..." }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 600,
              columnNumber: 17
            }, this) : simulationResult ? /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950/60 border border-teal-500/30 rounded-2xl p-4 space-y-3 shadow-inner", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "bg-teal-500 text-indigo-950 block rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider", children: "Dự báo kịch bản" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 606,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-indigo-300 font-bold", children: "IELTS / Trình độ Fluency (Tháng)" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 607,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 605,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 py-1", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "text-center bg-indigo-900/60 border border-indigo-800 px-3 py-2 rounded-xl", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-400 font-bold block text-[10px] uppercase", children: "Lịch hiện tại" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 612,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-300", children: [
                    prediction.months,
                    " tháng"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 613,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 611,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(ArrowRight, { className: "w-4 h-4 text-cyan-400 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 616,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "text-center bg-teal-500/10 border border-teal-500/30 px-3 py-2 rounded-xl", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-teal-400 font-bold block text-[10px] uppercase", children: "Mô phỏng mới" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 619,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-teal-300", children: [
                    simulationResult.simulated?.months || 0,
                    " tháng"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 620,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 618,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 610,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-350 leading-relaxed font-semibold", children: [
                "💡 ",
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-100", children: simulationResult.comparisonText }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 625,
                  columnNumber: 24
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 624,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 604,
              columnNumber: 17
            }, this) : null
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 563,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 553,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 470,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-5 space-y-8", children: [
        /* @__PURE__ */ jsxDEV(StudentEvaluationCard, {
          user,
          stats,
          plan,
          placementTest,
          onOpenRoadmap: () => navigate("/study-roadmap")
        }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 639,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 rounded-[2.2rem] p-6 shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-[15px] font-black text-slate-800 flex items-center gap-1.5 uppercase", children: [
              /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-4.5 h-4.5 text-indigo-600" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 706,
                columnNumber: 17
              }, this),
              " PHÂN TÍCH NHÓM KỸ NĂNG & THƯỚC ĐO"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 705,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 font-semibold uppercase tracking-wider", children: "Điểm bài test & Điểm tự do hiện tại đối sánh mốc chuẩn bứt phá" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 708,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 704,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "h-64 mt-2", children: /* @__PURE__ */ jsxDEV(SafeChartContainer, { height: 256, data: radarData, children: ({ width, height }) => /* @__PURE__ */ jsxDEV(RadarChart, { cx: "50%", cy: "50%", outerRadius: Math.min(width, height) * 0.35, width, height, data: radarData, children: [
            /* @__PURE__ */ jsxDEV(PolarGrid, { stroke: "#e2e8f0" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 717,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(PolarAngleAxis, { dataKey: "skill", tick: { fill: "#64748b", fontSize: 10, fontWeight: "bold" } }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 718,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(PolarRadiusAxis, { angle: 30, domain: [0, 100], tick: { fill: "#94a3b8" } }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 719,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(Radar, { name: "Thang Điểm Bạn", dataKey: "Score", stroke: "#4f46e5", fill: "#818cf8", fillOpacity: 0.4 }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 720,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(Radar, { name: "Chuẩn IELTS 6.5", dataKey: "Target", stroke: "#f59e0b", fill: "#fbbf24", fillOpacity: 0.1 }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 721,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(Tooltip, {}, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 722,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(Legend, { wrapperStyle: { fontSize: 11, fontWeight: "bold" } }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 723,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 716,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 714,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 713,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 leading-normal block text-center font-bold uppercase tracking-wider", children: "Chỉ số tính năng được đồng bộ hóa tự động từ Bài phỏng vấn và Kết quả Luyện kỹ năng." }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 729,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 703,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200/60 rounded-[2.2rem] p-6 md:p-8 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-black text-slate-800 flex items-center gap-2 uppercase", children: [
              /* @__PURE__ */ jsxDEV(Compass, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 738,
                columnNumber: 17
              }, this),
              " CÁC CHẶNG LỘ TRÌNH KẾ HOẠCH"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 737,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 font-semibold uppercase tracking-wider", children: "Cấu trúc lộ trình chuẩn chỉnh được AI băm nhỏ cho bạn nắm bắt" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 740,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 736,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-3 before:w-0.5 before:bg-slate-100", children: phases.map((phase, index) => {
            let badgeColor = "bg-slate-100 text-slate-700";
            if (phase.stage === 1) badgeColor = "bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold";
            if (phase.stage === 2) badgeColor = "bg-cyan-50 border border-cyan-100 text-cyan-700 font-extrabold";
            if (phase.stage === 3) badgeColor = "bg-purple-50 border border-purple-100 text-purple-700 font-extrabold";
            if (phase.stage === 4) badgeColor = "bg-pink-50 border border-pink-100 text-pink-700 font-extrabold";
            return /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 relative", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-black shrink-0 relative bg-white border border-slate-200 text-slate-700`, children: phase.stage }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 755,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100/50 transition-colors w-full", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center justify-between gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-slate-700 uppercase tracking-tight", children: phase.focus }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 761,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: `text-[9.5px] px-2 py-0.5 rounded-full ${badgeColor}`, children: phase.weeks }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                    lineNumber: 762,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 760,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11.5px] text-slate-505 font-medium leading-relaxed", children: phase.description }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                  lineNumber: 766,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
                lineNumber: 759,
                columnNumber: 21
              }, this)
            ] }, index, true, {
              fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
              lineNumber: 754,
              columnNumber: 19
            }, this);
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
            lineNumber: 745,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
          lineNumber: 735,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
        lineNumber: 636,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
      lineNumber: 467,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModuleSmartStudyPlan.tsx",
    lineNumber: 341,
    columnNumber: 5
  }, this);
}
