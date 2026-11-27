import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { ensureArray } from "/src/utils/arrayUtils.ts";
import { SafeChartContainer } from "/src/components/SafeChart.tsx";
import { CefrPathwayIcon } from "/src/components/CefrPathwayLogo.tsx";
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import {
  TrendingUp,
  BookOpen,
  RefreshCw,
  Target,
  Sparkles,
  AlertTriangle,
  PlayCircle,
  Calendar,
  Hourglass,
  Edit2
} from "lucide-react";
import { useFirebaseData } from "/src/firebase/firebase.ts";
export default function ModuleProgress({ user }) {
  const { srsReviews, goal, weakness, loading: fbLoading, refresh, updateGoal } = useFirebaseData();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [personalizedRoadmap, setPersonalizedRoadmap] = useState([]);
  const [actionsLoading, setActionsLoading] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempTarget, setTempTarget] = useState(1e3);
  const [tempMonths, setTempMonths] = useState(3);
  const [chartRange, setChartRange] = useState(7);
  const fetchStatsAndMissions = async () => {
    setLoading(true);
    try {
      const activeLvl = user?.currentLevel || user?.level || "A1";
      const data = await api.getDashboardStats(activeLvl);
      setStats(data);
      const tasksRes = await api.getDailyTasks(activeLvl);
      if (tasksRes?.success) {
        setTasks(ensureArray(tasksRes.tasks));
      }
      const recsRes = await api.getRecommendations();
      if (recsRes?.success) {
        setRecommendation(recsRes.recommendations);
      }
      const roadmapRes = await api.getPersonalizedRoadmap();
      if (roadmapRes?.roadmap) {
        setPersonalizedRoadmap(roadmapRes.roadmap);
      }
    } catch (e) {
      console.error("Error fetching statistics or missions:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStatsAndMissions();
  }, [user?.currentLevel, user?.level]);
  useEffect(() => {
    if (goal) {
      setTempTarget(goal.targetCount);
      setTempMonths(goal.months);
    }
  }, [goal]);
  const handleToggleTask = async (taskId) => {
    setActionsLoading(true);
    try {
      const res = await api.toggleDailyTask(taskId);
      if (res?.success) {
        setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t));
      }
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
    } finally {
      setActionsLoading(false);
    }
  };
  const handleToggleRoadmapTask = (id) => {
    setPersonalizedRoadmap(
      (prev) => prev.map((item) => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)
    );
  };
  const handleSaveGoal = async (e) => {
    e.preventDefault();
    await updateGoal(tempTarget, tempMonths);
    setIsEditingGoal(false);
    refresh();
  };
  const generateProgressHistoryData = (days) => {
    const points = [];
    const baseScore = stats?.vocabularyScore || 65;
    for (let i = days; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("vi-VN", { month: "numeric", day: "numeric" });
      const factor = (days - i) / days;
      const variation = Math.round(Math.sin((days - i) * 0.5) * 4);
      points.push({
        name: dayLabel,
        "Nghe (Listening)": Math.min(100, Math.round((stats?.listeningScore || 70) - 10 + 20 * factor + variation)),
        "Nói (Speaking)": Math.min(100, Math.round((stats?.speakingScore || 45) - 6 + 16 * factor + variation)),
        "Đọc (Reading)": Math.min(100, Math.round((stats?.readingScore || 75) - 8 + 15 * factor + variation)),
        "Viết (Writing)": Math.min(100, Math.round((stats?.writingScore || 50) - 5 + 12 * factor + variation)),
        "Ngữ pháp (Grammar)": Math.min(100, Math.round((stats?.grammarScore || stats?.grammar?.accuracyRate || 75) - 10 + 25 * factor + variation))
      });
    }
    return points;
  };
  const lineChartData = generateProgressHistoryData(chartRange);
  const radarData = stats ? [
    { subject: "Listening (Nghe)", value: stats.listeningScore ?? 50 },
    { subject: "Speaking (Nói)", value: stats.speakingScore ?? 50 },
    { subject: "Reading (Đọc)", value: stats.readingScore ?? 50 },
    { subject: "Writing (Viết)", value: stats.writingScore ?? 50 },
    { subject: "Vocabulary (Từ vựng)", value: stats.vocabularyScore ?? 50 },
    { subject: "Grammar (Ngữ pháp)", value: stats.grammarScore ?? 50 }
  ] : [
    { subject: "Listening (Nghe)", value: 65 },
    { subject: "Speaking (Nói)", value: 45 },
    { subject: "Reading (Đọc)", value: 70 },
    { subject: "Writing (Viết)", value: 50 },
    { subject: "Vocabulary (Từ vựng)", value: 60 },
    { subject: "Grammar (Ngữ pháp)", value: 55 }
  ];
  const weeklyLoadData = [
    { day: "Thứ 2", phut: Math.round((user.minutesPerDay || 30) * 0.8) },
    { day: "Thứ 3", phut: Math.round((user.minutesPerDay || 30) * 1.1) },
    { day: "Thứ 4", phut: 0 },
    { day: "Thứ 5", phut: Math.round((user.minutesPerDay || 30) * 0.9) },
    { day: "Thứ 6", phut: Math.round((user.minutesPerDay || 30) * 1.2) },
    { day: "Thứ 7", phut: Math.round((user.minutesPerDay || 30) * 1.5) },
    { day: "Chủ Nhật", phut: Math.round((user.minutesPerDay || 30) * 0.5) }
  ];
  const defaultTarget = stats?.totalVocabularyCount !== void 0 ? stats.totalVocabularyCount : goal?.targetCount || 1e3;
  const currentStudiedCount = stats?.learnedVocabularyCount !== void 0 ? stats.learnedVocabularyCount : goal?.currentCount || 0;
  const targetMonths = goal?.months || 3;
  const pctComplete = stats?.completionPercentage !== void 0 ? stats.completionPercentage : 0;
  const formattedFinishDate = stats?.estimatedCompletedDate || "Đang tính...";
  const activeLevel = user?.currentLevel || user?.level || "A1";
  const determineEquivalentBands = () => {
    switch (activeLevel.toUpperCase()) {
      case "A1":
        return { cefr: "A1 (Mới bắt đầu)", ielts: "1.0 - 2.0" };
      case "A2":
        return { cefr: "A2 (Sơ cấp)", ielts: "3.0" };
      case "B1":
        return { cefr: "B1 (Trung cấp)", ielts: "4.0 - 4.5" };
      case "B2":
        return { cefr: "B2 (Trung cấp khá)", ielts: "5.0 - 6.5" };
      case "C1":
        return { cefr: "C1 (Cao cấp)", ielts: "7.0 - 8.0" };
      case "C2":
        return { cefr: "C2 (Thông thạo)", ielts: "8.5 - 9.0" };
      default:
        return { cefr: "Mới bắt đầu", ielts: "Sơ cấp" };
    }
  };
  const bands = determineEquivalentBands();
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 pb-12", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(TrendingUp, { className: "w-5 h-5 text-indigo-650" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 214,
            columnNumber: 13
          }, this),
          " TRUNG TÂM PHÂN TÍCH TIẾN ĐỘ CEFR"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500", children: "Theo dõi chi tiết mục tiêu học tập, điểm yếu cá nhân hóa và sơ đồ định hướng hiệu quả." }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 216,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 212,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "btn-refresh-stats",
          onClick: () => {
            fetchStatsAndMissions();
            refresh();
          },
          disabled: loading || fbLoading,
          className: "flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-600 hover:text-slate-900 text-xs cursor-pointer transition-all disabled:opacity-40 bg-white shadow-sm font-semibold",
          children: [
            /* @__PURE__ */ jsxDEV(RefreshCw, { className: `w-3.5 h-3.5 ${loading || fbLoading ? "animate-spin" : ""}` }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 230,
              columnNumber: 11
            }, this),
            " ĐỒNG BỘ CLOUD FIRESTORE"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 221,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 211,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(Target, { className: "w-3 h-3 text-indigo-500" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 242,
                columnNumber: 17
              }, this),
              " MODULE 11"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 241,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800", children: "MỤC TIÊU HỌC TIẾNG ANH" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 244,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 240,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setIsEditingGoal(!isEditingGoal),
              className: "text-slate-400 hover:text-indigo-600 p-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer",
              children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 251,
                columnNumber: 15
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 247,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 239,
          columnNumber: 11
        }, this),
        !isEditingGoal ? /* @__PURE__ */ jsxDEV("div", { className: "my-5 flex items-center gap-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative w-24 h-24 shrink-0", children: [
            /* @__PURE__ */ jsxDEV("svg", { className: "w-full h-full transform -rotate-90", viewBox: "0 0 100 100", children: [
              /* @__PURE__ */ jsxDEV(
                "circle",
                {
                  cx: "50",
                  cy: "50",
                  r: "40",
                  stroke: "#f1f5f9",
                  strokeWidth: "8",
                  fill: "transparent"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 260,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "circle",
                {
                  cx: "50",
                  cy: "50",
                  r: "40",
                  stroke: "#4f46e5",
                  strokeWidth: "8",
                  fill: "transparent",
                  strokeDasharray: 251.2,
                  strokeDashoffset: 251.2 - 251.2 * pctComplete / 100,
                  strokeLinecap: "round",
                  className: "transition-all duration-1000 ease-out"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 268,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 259,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800 font-mono", children: [
                pctComplete,
                "%"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 282,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 font-bold uppercase", children: "đạt được" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 283,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 281,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 258,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 block font-semibold", children: "Đã thuộc từ vựng:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 289,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black text-slate-800 font-mono", children: [
                currentStudiedCount,
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-400", children: [
                  "/ ",
                  defaultTarget,
                  " từ"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 291,
                  columnNumber: 43
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 290,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 288,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 block font-semibold", children: "Lịch trình ôn luyện:" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 296,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-600 font-mono flex items-center gap-1 mt-0.5", children: [
                /* @__PURE__ */ jsxDEV(Calendar, { className: "w-3.5 h-3.5 text-slate-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 298,
                  columnNumber: 21
                }, this),
                " ",
                targetMonths,
                " tháng cam kết"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 297,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 295,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 287,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 256,
          columnNumber: 13
        }, this) : /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSaveGoal, className: "my-3 space-y-3", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[10px] uppercase font-bold text-slate-400 mb-1", children: "Số từ vựng mục tiêu:" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 306,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "number",
                value: tempTarget,
                onChange: (e) => setTempTarget(Math.max(10, parseInt(e.target.value) || 0)),
                className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 307,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 305,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[10px] uppercase font-bold text-slate-400 mb-1", children: "Thời gian cam kết (Tháng):" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 315,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: tempMonths,
                onChange: (e) => setTempMonths(parseInt(e.target.value)),
                className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: 1, children: "1 tháng (Cực tốc)" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleProgress.tsx",
                    lineNumber: 321,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 2, children: "2 tháng (Chuyên sâu)" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleProgress.tsx",
                    lineNumber: 322,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 3, children: "3 tháng (Tiêu chuẩn)" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleProgress.tsx",
                    lineNumber: 323,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: 6, children: "6 tháng (Bền bỉ)" }, void 0, false, {
                    fileName: "/app/applet/src/components/ModuleProgress.tsx",
                    lineNumber: 324,
                    columnNumber: 19
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 316,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 314,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 pt-1.5", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "submit",
                className: "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 text-[10px] font-black uppercase text-center cursor-pointer transition-colors",
                children: "LƯU THAY ĐỔI"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 328,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => setIsEditingGoal(false),
                className: "flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg py-1.5 text-[10px] font-bold uppercase text-center cursor-pointer",
                children: "HỦY bỏ"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 334,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 327,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 304,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono mt-auto", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 font-bold text-slate-400", children: [
            /* @__PURE__ */ jsxDEV(Hourglass, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 347,
              columnNumber: 15
            }, this),
            " DỰ KIẾN HOÀN THÀNH:"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 346,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-700 font-extrabold", children: formattedFinishDate }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 349,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 345,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 238,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md grid grid-cols-2 md:grid-cols-3 gap-4 border border-white/5 relative", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 right-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-300 text-[9px] font-extrabold font-mono border border-white/15", children: [
          "CEFR LEVEL: ",
          activeLevel
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 355,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 p-3 bg-white/5 border border-white/5 rounded-xl", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300 block font-bold uppercase tracking-wider", children: "Từ vựng cần ôn (SRS)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 360,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black font-mono block text-amber-300", children: stats?.srsDueCount !== void 0 ? `${stats.srsDueCount} Từ` : "0 Từ" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 361,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Đến giai đoạn ôn lại" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 364,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 359,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 p-3 bg-white/5 border border-white/5 rounded-xl", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300 block font-bold uppercase tracking-wider", children: "Tổng thời gian học" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 368,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black block text-indigo-200 mt-1", children: stats?.totalStudySeconds ? stats.totalStudyHours > 0 ? `${stats.totalStudyHours} giờ ${stats.totalStudyMinutesLeft} phút` : `${stats.totalStudyMinutesLeft} phút` : "Chưa có dữ liệu" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 369,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Thời gian học thực tế" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 378,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 367,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 p-3 bg-white/5 border border-white/5 rounded-xl", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300 block font-bold uppercase tracking-wider", children: "Trình độ tương đương" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 382,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-base font-black block text-indigo-100 mt-1", children: stats?.cefrLabel || "Chưa xác định" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 383,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Đầu ra khung CEFR" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 386,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 381,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 p-3 bg-white/5 border border-white/5 rounded-xl", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300 block font-bold uppercase tracking-wider", children: "Ước lượng IELTS" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 390,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black font-mono block text-emerald-300", children: stats?.ieltsBand || "Chưa đủ dữ liệu" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 391,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Thang điểm IELTS quy đổi" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 394,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 389,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 p-3 bg-white/5 border border-white/5 rounded-xl", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300 block font-bold uppercase tracking-wider", children: "Độ chính xác trung bình" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 398,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black font-mono block text-indigo-100", children: stats?.accuracyRateOverall !== void 0 && stats.accuracyRateOverall > 0 ? `${stats.accuracyRateOverall}%` : "Chưa có dữ liệu" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 399,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Qua tất cả luyện tập" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 404,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 397,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 p-3 bg-white/5 border border-white/5 rounded-xl col-span-2 md:col-span-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300 block font-bold uppercase tracking-wider", children: "Điểm phát âm AI" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 408,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black block text-indigo-100 mt-1", children: stats?.aiPronunciationAverage !== void 0 && stats?.aiPronunciationAverage !== null ? `${stats.aiPronunciationAverage} / 100` : "Chưa có dữ liệu" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 409,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Điểm phát âm trung bình" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 414,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 407,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 354,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 235,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-1.5 bg-violet-50 text-violet-600 rounded-lg", children: /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-5 h-5 text-violet-600" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 425,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 424,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-650 tracking-wider", children: "TIẾN ĐỘ HẠNG MỤC CORE" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 428,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800 uppercase", children: "TIẾN ĐỘ NGỮ PHÁP (GRAMMAR PROGRESS)" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 429,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 427,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 423,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-slate-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tight", children: "PILLAR CORE PROGRESS" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 432,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 422,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 block font-black uppercase tracking-wider", children: "Chủ điểm ngữ pháp" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 438,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black block text-slate-800 font-mono", children: [
              stats?.grammar?.completedLessons || 0,
              " ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-400 font-semibold", children: [
                "/ ",
                stats?.grammar?.totalTopics || 8,
                " chủ điểm"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 440,
                columnNumber: 57
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 439,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9.5px] text-slate-400 block", children: [
              "Đã hoàn thành cấp độ ",
              activeLevel
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 442,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 437,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-lg shadow-sm", children: "📖" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 444,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 436,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 block font-black uppercase tracking-wider", children: "Độ chính xác (Accuracy)" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 451,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black block text-emerald-600 font-mono", children: stats?.grammar?.accuracyRate ? `${stats.grammar.accuracyRate}%` : "0%" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 452,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9.5px] text-slate-400 block font-semibold text-emerald-600/90", children: "Hoàn thành bài tập" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 455,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 450,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm", children: "🎯" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 457,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 449,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 block font-black uppercase tracking-wider", children: "Ngữ pháp cần ôn (SRS)" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 464,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black block text-amber-600 font-mono", children: [
              stats?.grammar?.dueSrsCount || 0,
              " cấu trúc"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 465,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9.5px] text-slate-400 block", children: "Đến tiến trình ôn tập" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 468,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 463,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-sm", children: "⏳" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 470,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 462,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 435,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 421,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 border-b border-slate-100 pb-2.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-1.5 bg-rose-50 text-rose-550 rounded-lg", children: /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-5 h-5 text-rose-500" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 481,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 480,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-650 tracking-wider", children: "MODULE 2" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 484,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800 uppercase", children: "AI CHẨN ĐOÁN 5 ĐIỂM YẾU CHÍNH & KHUYÊN HỌC" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 485,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 483,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 479,
        columnNumber: 9
      }, this),
      weakness ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3.5", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase text-[9px] tracking-wide block", children: "1. Từ vựng" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 494,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block text-justify leading-snug", children: weakness.wordWeaks[0] || "Phrasal verbs khó" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 495,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 493,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase text-[9px] tracking-wide block", children: "2. Ngữ pháp" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 498,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block text-justify leading-snug", children: weakness.grammarWeaks[0] || "Thì hiện tại hoàn thành" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 499,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 497,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase text-[9px] tracking-wide block", children: "3. Chủ đề" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 502,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block text-justify leading-snug", children: weakness.topicWeaks[0] || "Công nghệ xanh" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 503,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 501,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase text-[9px] tracking-wide block", children: "4. Kỹ năng" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 506,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block text-justify leading-snug", children: weakness.skillWeaks[0] || "Phản xạ đàm thoại" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 507,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 505,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs col-span-2 md:col-span-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase text-[9px] tracking-wide block", children: "5. Âm vị" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 510,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block text-justify leading-snug", children: weakness.phonemeWeaks[0] || "Âm đuôi /kts/" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 511,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 509,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 492,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-2", children: "ĐỀ XUẤT HỌC TIẾP TỨ TRỰC TIẾP ĐIỂM YẾU:" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 517,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: ensureArray(weakness.recommendations).map((item, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3 p-3 border border-slate-100 hover:border-indigo-150 hover:bg-slate-50/40 rounded-xl transition-all", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "mt-1 flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-650 text-xs font-black", children: idx + 1 }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 521,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-800 leading-none mb-1", children: item.title }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 525,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed", children: item.description }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 526,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 524,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full shrink-0", children: "Khuyên học" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 529,
              columnNumber: 21
            }, this)
          ] }, idx, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 520,
            columnNumber: 19
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 518,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 516,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 490,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-6 text-xs text-slate-400 font-mono", children: "Đang tổng hợp chẩn đoán lỗi học viên..." }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 538,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 478,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 border-b border-slate-100 pb-2.5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-1.5 bg-indigo-50 text-indigo-550 rounded-lg", children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-indigo-600" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 546,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 545,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-650 tracking-wider", children: "MODULE 3" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 549,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800 uppercase", children: "LỘ TRÌNH ĐỀ XUẤT HÔM NAY (AI RECOMMENDATION TASKS)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 550,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 548,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 544,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: personalizedRoadmap.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "col-span-3 text-center py-6 text-xs text-slate-400 font-mono", children: "Khởi tạo kế hoạch cá nhân hóa hôm nay..." }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 556,
        columnNumber: 13
      }, this) : personalizedRoadmap.map((lesson, idx) => /* @__PURE__ */ jsxDEV(
        "div",
        {
          onClick: () => handleToggleRoadmapTask(lesson.id),
          className: `p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col justify-between ${lesson.isCompleted ? "bg-slate-50 border-slate-200 text-slate-400" : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50"}`,
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-mono font-bold uppercase rounded bg-indigo-50 text-indigo-700 px-1.5 py-0.5", children: [
                  "BÀI LUYỆN ",
                  idx + 1
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 570,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm", children: lesson.icon }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 573,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 569,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: `text-xs font-black ${lesson.isCompleted ? "line-through text-slate-400" : "text-slate-800"}`, children: lesson.title }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 576,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 leading-snug line-clamp-2", children: lesson.description }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 579,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 568,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-semibold", children: lesson.duration }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 583,
                columnNumber: 19
              }, this),
              lesson.isCompleted ? /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-600 font-extrabold flex items-center gap-0.5", children: "✓ Đã xong" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 586,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600 font-extrabold flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxDEV(PlayCircle, { className: "w-3.5 h-3.5 text-indigo-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/ModuleProgress.tsx",
                  lineNumber: 591,
                  columnNumber: 23
                }, this),
                " Bắt đầu ngay"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 590,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 582,
              columnNumber: 17
            }, this)
          ]
        },
        lesson.id,
        true,
        {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 559,
          columnNumber: 15
        },
        this
      )) }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 554,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 543,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-3 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2.5", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-600 tracking-wider", children: "MODULE 14" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 607,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800", children: "NHIỆM VỤ HÀNG NGÀY (DAILY MISSIONS)" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 608,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 606,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold", children: [
            "+",
            ensureArray(tasks).filter((t) => !t.completed).reduce((acc, t) => acc + t.xpReward, 0),
            " XP khả dụng"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 610,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 605,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5", children: ensureArray(tasks).length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-6 text-xs text-slate-400 font-mono", children: "Đang khởi tạo danh sách nhiệm vụ hôm nay..." }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 617,
          columnNumber: 15
        }, this) : ensureArray(tasks).map((task) => /* @__PURE__ */ jsxDEV(
          "div",
          {
            onClick: () => handleToggleTask(task.id),
            className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${task.completed ? "bg-slate-50 border-slate-200 text-slate-400 line-through" : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-700"}`,
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "mt-0.5 shrink-0", children: task.completed ? /* @__PURE__ */ jsxDEV("div", { className: "w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold", children: "✓" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 631,
                columnNumber: 23
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-4 h-4 rounded border border-slate-300 bg-white" }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 633,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 629,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-semibold leading-tight", children: task.title }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 637,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 636,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 font-bold ${task.completed ? "bg-slate-150 text-slate-400" : "bg-amber-50 text-amber-600"}`, children: [
                "+",
                task.xpReward,
                " XP"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 639,
                columnNumber: 19
              }, this)
            ]
          },
          task.id,
          true,
          {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 620,
            columnNumber: 17
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 615,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 604,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl text-white flex flex-col justify-between shadow-md relative overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 652,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-medium tracking-widest text-indigo-300 block uppercase font-bold", children: "MODULE 13 • GỢI Ý TIẾP THEO" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 656,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-white uppercase tracking-wide", children: "ĐỀ XUẤT core LESSON" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 657,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 655,
            columnNumber: 13
          }, this),
          recommendation ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 bg-white/5 border border-white/10 p-3.5 rounded-xl", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", children: "Khuyên học ngay hôm nay" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 662,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold leading-snug", children: recommendation.lesson.title }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 665,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-300 leading-relaxed italic", children: recommendation.advice }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 666,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 661,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-mono text-slate-300 italic", children: "Đang tổng hợp điểm số để đề xuất bài học tối ưu nhất..." }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 669,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 654,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono", children: [
          /* @__PURE__ */ jsxDEV("span", { children: "Dùng dữ liệu CEFR profile" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 674,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Độ chính xác: 98%" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 675,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 673,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 651,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 602,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-[360px] shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider block mb-0.5", children: "Biểu đồ Radar" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 686,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-extrabold text-slate-800", children: "SỰ PHÂN BỔ NĂNG LỰC KỸ NĂNG CÁ NHÂN" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 687,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 685,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 w-full min-h-0 min-w-0 pt-4 text-xs font-mono", children: /* @__PURE__ */ jsxDEV(SafeChartContainer, { height: 250, data: radarData, children: ({ width, height }) => /* @__PURE__ */ jsxDEV(RadarChart, { cx: "50%", cy: "50%", outerRadius: Math.min(width, height) * 0.35, width, height, data: radarData, children: [
          /* @__PURE__ */ jsxDEV(PolarGrid, { stroke: "#e2e8f0" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 694,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(PolarAngleAxis, { dataKey: "subject", stroke: "#475569", tick: { fontSize: 9 } }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 695,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(PolarRadiusAxis, { stroke: "#e2e8f0", angle: 30, domain: [0, 100], tick: { fontSize: 8 } }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 696,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            Radar,
            {
              name: "Học viên",
              dataKey: "value",
              stroke: "#4f46e5",
              fill: "#4f46e5",
              fillOpacity: 0.15
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 697,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 693,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 691,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 690,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 684,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-[360px] col-span-1 lg:col-span-2 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-650 font-extrabold uppercase tracking-wider block mb-0.5", children: "Thống kê xu hướng (Line values)" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 714,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-extrabold text-slate-800", children: "TIẾN TRÌNH LUYỆN TẬP THEO THỜI GIAN" }, void 0, false, {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 715,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 713,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 shrink-0 select-none", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setChartRange(7),
                className: `px-2 py-1 rounded-md text-[9px] font-black cursor-pointer uppercase tracking-wider transition-all ${chartRange === 7 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
                children: "7 Ngày"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 720,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setChartRange(30),
                className: `px-2 py-1 rounded-md text-[9px] font-black cursor-pointer uppercase tracking-wider transition-all ${chartRange === 30 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
                children: "30 Ngày"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 726,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setChartRange(90),
                className: `px-2 py-1 rounded-md text-[9px] font-black cursor-pointer uppercase tracking-wider transition-all ${chartRange === 90 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
                children: "90 Ngày"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ModuleProgress.tsx",
                lineNumber: 732,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 719,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 712,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 w-full min-h-0 min-w-0 pt-4 text-[9px] font-mono", children: /* @__PURE__ */ jsxDEV(SafeChartContainer, { height: 252, data: lineChartData, children: ({ width, height }) => /* @__PURE__ */ jsxDEV(LineChart, { width, height, data: lineChartData, children: [
          /* @__PURE__ */ jsxDEV(XAxis, { dataKey: "name", stroke: "#475569", tick: { fontSize: 8 } }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 745,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(YAxis, { stroke: "#475569", domain: [0, 100], tick: { fontSize: 8 } }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 746,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            Tooltip,
            {
              contentStyle: { backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", fontSize: "10px" }
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ModuleProgress.tsx",
              lineNumber: 747,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "Nghe (Listening)", stroke: "#4f46e5", strokeWidth: 2, dot: false }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 750,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "Nói (Speaking)", stroke: "#ef4444", strokeWidth: 2, dot: false }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 751,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "Đọc (Reading)", stroke: "#10b981", strokeWidth: 2, dot: false }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 752,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "Viết (Writing)", stroke: "#f59e0b", strokeWidth: 2, dot: false }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 753,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Line, { type: "monotone", dataKey: "Ngữ pháp (Grammar)", stroke: "#8b5cf6", strokeWidth: 2, dot: false }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 754,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(Legend, { verticalAlign: "top", height: 24, iconSize: 8, wrapperStyle: { fontSize: "8px" } }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 755,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 744,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 742,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 741,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 711,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 681,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm relative overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-10 -right-10 w-44 h-44 bg-indigo-500/5 rounded-full blur-2xl" }, void 0, false, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 766,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow border border-slate-100", children: /* @__PURE__ */ jsxDEV(CefrPathwayIcon, { size: 36 }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 770,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 769,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 flex-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-700 font-extrabold uppercase tracking-widest block bg-indigo-100/60 px-2 py-0.5 rounded border border-indigo-200 w-fit", children: "NHẬN XÉT HỌC TẬP TỪ CỐ VẤN AI (MODULE 12)" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 774,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-extrabold text-slate-900", children: "Chi tiết phân tích thói quen & định hướng học tập" }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 777,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 text-xs leading-relaxed text-justify font-sans", children: stats?.aiReport || `Dự đoán hồ sơ của bạn chứng tỏ hiệu suất rèn luyện tăng tiến đều. Đối với cấp độ ${activeLevel}, kỹ năng Đọc hiểu của bạn đang dẫn dầu với điểm số tối ưu, trái lại kỹ năng Nói và Phát âm đang gặp thử thách nhẹ do rào cản từ ngữ thói quen. Hãy tận dụng ôn thẻ SRS hàng ngày để ghi nhớ sâu sắc các thành tố từ vựng và tham gia AI Speaking Room thường xuyên nhằm tăng độ giãn của cơ lưỡi và phản xạ.` }, void 0, false, {
            fileName: "/app/applet/src/components/ModuleProgress.tsx",
            lineNumber: 779,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 773,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 768,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-indigo-100/60 flex justify-between text-[10px] text-slate-500 font-mono", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          "Chuỗi ngày học liên tiếp: ",
          user.streakDays || 1,
          " ngày bứt phá"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 786,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: "Báo cáo tuần hoàn cập nhật tự động" }, void 0, false, {
          fileName: "/app/applet/src/components/ModuleProgress.tsx",
          lineNumber: 787,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ModuleProgress.tsx",
        lineNumber: 785,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ModuleProgress.tsx",
      lineNumber: 765,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ModuleProgress.tsx",
    lineNumber: 208,
    columnNumber: 5
  }, this);
}
