import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "/src/context/AuthContext.tsx";
import { useLanguage } from "/src/context/LanguageContext.tsx";
import OnboardingInterview from "/src/components/OnboardingInterview.tsx";
import PlacementTest from "/src/components/PlacementTest.tsx";
import RoadmapDashboard from "/src/components/RoadmapDashboard.tsx";
import CefrPathwayLogo from "/src/components/CefrPathwayLogo.tsx";
import ModuleSmartStudyPlan from "/src/components/ModuleSmartStudyPlan.tsx";
import ModulePractice from "/src/components/ModulePractice.tsx";
import ModuleProgress from "/src/components/ModuleProgress.tsx";
import ModuleAchievements from "/src/components/ModuleAchievements.tsx";
import ModuleLeaderboard from "/src/components/ModuleLeaderboard.tsx";
import AdminPanel from "/src/components/AdminPanel.tsx";
import { ErrorBoundary } from "/src/components/ErrorBoundary.tsx";
import { LogOut, Calendar, BookOpen, Activity, Award, Trophy, Shield } from "lucide-react";
export default function Dashboard() {
  const {
    user,
    logout,
    updateUser,
    testResult,
    setTestResult,
    showRoadmap,
    setShowRoadmap
  } = useAuth();
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("practice");
  const [activeTaskRedirect, setActiveTaskRedirect] = useState(null);
  const [redirectConsumed, setRedirectConsumed] = useState(false);
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "teacher")) {
      setActiveTab("admin");
      return;
    }
    if (!redirectConsumed) {
      if (location.state && location.state.activeTaskRedirect) {
        setActiveTab("practice");
        setActiveTaskRedirect(location.state.activeTaskRedirect);
        setRedirectConsumed(true);
        localStorage.removeItem("activeTaskRedirect");
        try {
          window.history.replaceState({}, document.title);
        } catch (e) {
          console.warn("Failed to clear history state", e);
        }
      } else {
        const stored = localStorage.getItem("activeTaskRedirect");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setActiveTaskRedirect(parsed);
            setActiveTab("practice");
            setRedirectConsumed(true);
            localStorage.removeItem("activeTaskRedirect");
          } catch (e) {
            console.warn("Stale redirect in localStorage", e);
          }
        }
      }
    }
    const path = location.pathname;
    if (path.startsWith("/practice") || path.startsWith("/exam") || path === "/flashcards" || path === "/review") {
      setActiveTab("practice");
    }
  }, [user, location.pathname, location.state, redirectConsumed]);
  const [initiallyUnlockedIds, setInitiallyUnlockedIds] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const playRewardSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(1e-4, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(523.25, now, 0.15);
      playTone(659.25, now + 0.1, 0.15);
      playTone(783.99, now + 0.2, 0.15);
      playTone(1046.5, now + 0.3, 0.4);
    } catch (e) {
      console.warn("Celebratory audio chime could not play due to user gesture constraints", e);
    }
  };
  useEffect(() => {
    if (user && user.id && initiallyUnlockedIds.length === 0) {
      setInitiallyUnlockedIds(user.unlockedAchievements || ["first_login"]);
    }
  }, [user]);
  useEffect(() => {
    if (!user || initiallyUnlockedIds.length === 0) return;
    const currentUnlocked = user.unlockedAchievements || ["first_login"];
    const newlyUnlockedIds = currentUnlocked.filter((id) => !initiallyUnlockedIds.includes(id));
    if (newlyUnlockedIds.length > 0) {
      const ACHIEVEMENTS_DEFINITIONS = [
        { id: "first_login", title: "Khởi đầu vinh quang", desc: "Tạo tài khoản và tham gia cộng đồng", xpReward: 50, emoji: "🐣" },
        { id: "test_completed", title: "Thợ săn trình độ", desc: "Hoàn thiện bài thi thử đầu vào 30 câu hỏi", xpReward: 100, emoji: "🎯" },
        { id: "practice_completed", title: "Chuyên cần bền bỉ", desc: "Hoàn thành 3 bài học luyện tập bất kỳ", xpReward: 150, emoji: "📚" },
        { id: "perfect_score", title: "Tuyệt đỉnh điểm số", desc: "Trả lời đúng 10/10 bài học kiểm tra", xpReward: 200, emoji: "🪐" },
        { id: "streak_3days", title: "Ngọn lửa bốc cháy", desc: "Duy trì chuỗi học liên tiếp tối thiểu 3 ngày", xpReward: 250, emoji: "🔥" }
      ];
      const freshUnlocks = newlyUnlockedIds.map((id) => ACHIEVEMENTS_DEFINITIONS.find((a) => a.id === id)).filter(Boolean);
      if (freshUnlocks.length > 0) {
        setNotificationQueue((prev) => [...prev, ...freshUnlocks]);
        setInitiallyUnlockedIds((prev) => [...prev, ...newlyUnlockedIds]);
      }
    }
  }, [user, initiallyUnlockedIds]);
  useEffect(() => {
    if (!activeNotification && notificationQueue.length > 0) {
      const nextNotif = notificationQueue[0];
      setNotificationQueue((prev) => prev.slice(1));
      setActiveNotification(nextNotif);
      playRewardSound();
    }
  }, [activeNotification, notificationQueue]);
  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);
  if (!user) {
    return null;
  }
  const isStaff = user.role === "admin" || user.role === "teacher";
  const handleInterviewSuccess = (updatedUser) => {
    localStorage.setItem("onboardingCompleted", "true");
    updateUser(updatedUser);
  };
  const handlePlacementSuccess = (updatedUser, finalTestResult) => {
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem("placementTestCompleted", "true");
    updateUser(updatedUser);
    setTestResult(finalTestResult);
    setShowRoadmap(true);
  };
  const handleEnterLearningZone = () => {
    setShowRoadmap(false);
    setActiveTab("practice");
  };
  const handleUserUpdate = (updated) => {
    updateUser(updated);
  };
  const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true" || (user.purposes && user.purposes.length > 0) || user.status !== "pending_interview";
  const needsInterview = !isStaff && !onboardingCompleted;
  if (needsInterview) {
    return /* @__PURE__ */ jsxDEV(OnboardingInterview, { user, onSuccess: handleInterviewSuccess }, void 0, false, {
      fileName: "/app/applet/src/pages/Dashboard.tsx",
      lineNumber: 202,
      columnNumber: 12
    }, this);
  }
  const placementTestCompleted = localStorage.getItem("placementTestCompleted") === "true" || user.status === "completed" || (user.placementTestScore !== undefined && user.placementTestScore > 0);
  const needsPlacement = !isStaff && !placementTestCompleted && user.status === "pending_test";
  if (needsPlacement) {
    return /* @__PURE__ */ jsxDEV(PlacementTest, { user, onSuccess: handlePlacementSuccess }, void 0, false, {
      fileName: "/app/applet/src/pages/Dashboard.tsx",
      lineNumber: 207,
      columnNumber: 12
    }, this);
  }
  if (showRoadmap && testResult) {
    return /* @__PURE__ */ jsxDEV(
      RoadmapDashboard,
      {
        user,
        testResult,
        onEnterApp: handleEnterLearningZone
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 212,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#EEF4F8] text-slate-850 flex flex-col md:flex-row font-sans selection:bg-cyan-500/10 transition-all", children: [
    /* @__PURE__ */ jsxDEV("aside", { className: "hidden md:flex w-72 bg-white border-r border-slate-100 p-6 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-sm text-left", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "px-2", children: /* @__PURE__ */ jsxDEV(CefrPathwayLogo, { size: 44, mode: "light" }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 228,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 227,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white font-black flex items-center justify-center text-sm shadow-inner uppercase select-none", children: user.fullName.substring(0, 2) }, void 0, false, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 233,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-bold block uppercase leading-none", children: user.role === "admin" ? "Quản trị viên" : user.role === "teacher" ? "Giáo viên" : t("student") }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 237,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-slate-800 block truncate mt-1", children: user.fullName }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 240,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 232,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("nav", { className: "space-y-1.5 text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-slate-400 tracking-widest block px-3 mb-2.5", children: t("study_spaces") }, void 0, false, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 246,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "sidebar-tab-practice",
              onClick: () => setActiveTab("practice"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeTab === "practice" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 257,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: t("learning_center") }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 258,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 248,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "sidebar-tab-schedule",
              onClick: () => setActiveTab("schedule"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeTab === "schedule" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Calendar, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 270,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: t("smart_plan") }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 271,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 261,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "sidebar-tab-progress",
              onClick: () => setActiveTab("progress"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeTab === "progress" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Activity, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 283,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: t("ai_progress") }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 284,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 274,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "sidebar-tab-achievements",
              onClick: () => setActiveTab("achievements"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeTab === "achievements" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Award, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 296,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: t("achievements") }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 297,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 287,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "sidebar-tab-leaderboard",
              onClick: () => setActiveTab("leaderboard"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeTab === "leaderboard" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Trophy, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 309,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: t("leaderboard") }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 310,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 300,
              columnNumber: 13
            },
            this
          ),
          (user.role === "admin" || user.role === "teacher") && /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "sidebar-tab-admin",
              onClick: () => setActiveTab("admin"),
              className: `w-full px-4 py-3.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${activeTab === "admin" ? "bg-rose-600 text-white shadow-md shadow-rose-600/10" : "text-rose-600 hover:bg-rose-50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Shield, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 323,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: user.role === "admin" ? t("cms_admin") : "Quản trị Học phần" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 324,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 314,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 245,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 225,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "sidebar-btn-logout",
          onClick: logout,
          className: "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent text-xs font-black transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsxDEV(LogOut, { className: "w-4 h-4 shrink-0" }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 337,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: t("logout") }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 338,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 332,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 331,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/Dashboard.tsx",
      lineNumber: 224,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "md:hidden bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center text-left", children: /* @__PURE__ */ jsxDEV(CefrPathwayLogo, { size: 32, mode: "light" }, void 0, false, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 346,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 345,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-mono font-black text-amber-600", children: [
          user.xp || 100,
          " XP"
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 350,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "mobile-btn-logout",
            onClick: logout,
            className: "p-1.5 border border-slate-100 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer bg-slate-50",
            children: /* @__PURE__ */ jsxDEV(LogOut, { className: "w-3.5 h-3.5" }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 358,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 353,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 349,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/Dashboard.tsx",
      lineNumber: 344,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col min-w-0 min-h-0 bg-[#EEF4F8]", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 border-b border-indigo-900/40 px-6 md:px-12 py-5 md:py-7 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0 relative z-10 shadow-lg text-white", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 368,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 text-left relative z-10", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-lg md:text-xl font-black tracking-tight flex items-center gap-2 text-white", children: t("welcome_back", { name: user.fullName ? user.fullName.split(" ")[0] : "" }) }, void 0, false, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 371,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[11.5px] md:text-xs text-indigo-150 font-bold leading-relaxed max-w-xl", children: t("daily_motivation") }, void 0, false, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 374,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 370,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-3 w-full lg:w-auto relative z-10", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4.5 py-2.5 rounded-2xl flex flex-col gap-1.5 w-full sm:w-48 text-left shadow-md", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[9px] font-black uppercase text-indigo-150 leading-none", children: [
              /* @__PURE__ */ jsxDEV("span", { children: t("reward_progress") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 385,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-yellow-300 font-mono font-bold", children: [
                (user.xp || 100) % 500,
                " / 500 XP"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 386,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 384,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-0.5", children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "h-full bg-gradient-to-r from-yellow-300 to-amber-450 rounded-full transition-all duration-500",
                style: { width: `${Math.min(100, (user.xp || 100) % 500 / 500 * 100)}%` }
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 389,
                columnNumber: 17
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 388,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 383,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-left shadow-md shrink-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-base select-none", children: "🎯" }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 398,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-indigo-150 block uppercase font-black leading-none", children: t("proficiency_level") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 400,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-yellow-300 uppercase block leading-none mt-1", children: [
                "CEFR ",
                user.level || "A1"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 401,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 399,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 397,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-left shadow-md shrink-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-base select-none animate-pulse", children: "🔥" }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 407,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-indigo-150 block uppercase font-black leading-none", children: t("streak_days") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 409,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-yellow-300 block leading-none mt-1", children: t("days", { count: user.streakDays || 1 }) }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 410,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 408,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 406,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-left shadow-md shrink-0", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-base select-none", children: "⭐" }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 416,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-indigo-150 justify-between uppercase font-black leading-none", children: t("total_xp") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 418,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black text-yellow-300 font-mono block leading-none mt-1", children: [
                user.xp || 100,
                " XP"
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 419,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 417,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 415,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 380,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 367,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 max-w-7xl w-full mx-auto relative z-10", children: [
        activeTab === "practice" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Trung Tâm Luyện Tập", children: /* @__PURE__ */ jsxDEV(ModulePractice, { user, onUserUpdate: handleUserUpdate, activeTaskRedirect, onClearActiveTaskRedirect: () => {
          setActiveTaskRedirect(null);
          localStorage.removeItem("activeTaskRedirect");
          try {
            window.history.replaceState({}, document.title);
          } catch (e) {
            console.warn("Failed to clear history state", e);
          }
        } }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 432,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 431,
          columnNumber: 13
        }, this),
        activeTab === "schedule" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Kế Hoạch Thông Minh v2", children: /* @__PURE__ */ jsxDEV(ModuleSmartStudyPlan, { user }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 438,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 437,
          columnNumber: 13
        }, this),
        activeTab === "progress" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Phân Tích Tiến Độ AI", children: /* @__PURE__ */ jsxDEV(ModuleProgress, { user }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 444,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 443,
          columnNumber: 13
        }, this),
        activeTab === "achievements" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Phòng Lưu Danh Cúp & Danh Hiệu", children: /* @__PURE__ */ jsxDEV(ModuleAchievements, { user }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 450,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 449,
          columnNumber: 13
        }, this),
        activeTab === "leaderboard" && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Bảng Vàng Học Viên", children: /* @__PURE__ */ jsxDEV(ModuleLeaderboard, {}, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 456,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 455,
          columnNumber: 13
        }, this),
        activeTab === "admin" && (user.role === "admin" || user.role === "teacher") && /* @__PURE__ */ jsxDEV(ErrorBoundary, { moduleName: "Quản Trị CMS", children: /* @__PURE__ */ jsxDEV(AdminPanel, { user }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 462,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 461,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 428,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("nav", { className: "md:hidden bg-white border-t border-slate-100 px-3 py-2 flex items-center justify-around sticky bottom-0 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("practice"),
            className: `flex flex-col items-center gap-1 p-1 cursor-pointer transition-all ${activeTab === "practice" ? "text-cyan-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 476,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase", children: t("learning_center") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 477,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 470,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("schedule"),
            className: `flex flex-col items-center gap-1 p-1 cursor-pointer transition-all ${activeTab === "schedule" ? "text-cyan-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ jsxDEV(Calendar, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 486,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase", children: t("smart_plan") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 487,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 480,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("progress"),
            className: `flex flex-col items-center gap-1 p-1 cursor-pointer transition-all ${activeTab === "progress" ? "text-cyan-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ jsxDEV(Activity, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 496,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase", children: t("ai_progress") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 497,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 490,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("achievements"),
            className: `flex flex-col items-center gap-1 p-1 cursor-pointer transition-all ${activeTab === "achievements" ? "text-cyan-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ jsxDEV(Award, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 506,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase", children: t("achievements") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 507,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 500,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("leaderboard"),
            className: `flex flex-col items-center gap-1 p-1 cursor-pointer transition-all ${activeTab === "leaderboard" ? "text-cyan-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ jsxDEV(Trophy, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 516,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase", children: t("leaderboard") }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 517,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/pages/Dashboard.tsx",
            lineNumber: 510,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 469,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("footer", { className: "border-t border-slate-100 py-4 text-center text-[10px] text-slate-400 bg-white shrink-0 mt-auto", children: /* @__PURE__ */ jsxDEV("span", { children: "© 2026 CEFR PATHWAY • Lộ trình rèn luyện cá nhân hóa đồng hành bởi trợ lý AI xuất sắc • Google Workspace & Gemini 3.5-Flash" }, void 0, false, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 523,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 522,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(AnimatePresence, { children: activeNotification && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          id: "achievement-popup-toast",
          initial: { opacity: 0, y: 50, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.95 },
          transition: { type: "spring", stiffness: 300, damping: 25 },
          className: "fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(16,185,129,0.35)] text-white overflow-hidden cursor-pointer",
          style: { pointerEvents: "auto" },
          onClick: () => setActiveNotification(null),
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none overflow-hidden rounded-3xl", children: [...Array(15)].map((_, i) => /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                className: `absolute w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? "bg-emerald-400" : i % 3 === 1 ? "bg-yellow-400" : "bg-cyan-400"}`,
                initial: {
                  x: "50%",
                  y: "65%",
                  scale: 0,
                  opacity: 1
                },
                animate: {
                  x: `${10 + Math.random() * 80}%`,
                  y: `${15 + Math.random() * 70}%`,
                  scale: [0, 1.3, 0.9, 0],
                  opacity: [0, 1, 1, 0]
                },
                transition: {
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeOut"
                }
              },
              i,
              false,
              {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 542,
                columnNumber: 19
              },
              this
            )) }, void 0, false, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 540,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4 relative z-10", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 shrink-0 transform rotate-6 border border-emerald-400 animate-bounce", children: /* @__PURE__ */ jsxDEV("span", { children: activeNotification.emoji }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 573,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 572,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20", children: "Danh Hiệu Đạt Được!" }, void 0, false, {
                    fileName: "/app/applet/src/pages/Dashboard.tsx",
                    lineNumber: 578,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setActiveNotification(null);
                      },
                      className: "text-slate-400 hover:text-white transition-colors cursor-pointer text-sm p-1 hover:bg-white/10 rounded-lg",
                      children: "✕"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/pages/Dashboard.tsx",
                      lineNumber: 581,
                      columnNumber: 21
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 577,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-white mt-2 leading-snug tracking-tight", children: activeNotification.title }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 592,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-300 mt-1 font-medium leading-relaxed", children: activeNotification.desc }, void 0, false, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 596,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mt-4", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-yellow-400 flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl", children: [
                    "⭐ +",
                    activeNotification.xpReward,
                    " XP"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/Dashboard.tsx",
                    lineNumber: 601,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 ml-auto", children: "Chạm để đóng" }, void 0, false, {
                    fileName: "/app/applet/src/pages/Dashboard.tsx",
                    lineNumber: 604,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/Dashboard.tsx",
                  lineNumber: 600,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 576,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Dashboard.tsx",
              lineNumber: 570,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { width: "100%" },
                animate: { width: "0%" },
                transition: { duration: 4.5, ease: "linear" },
                className: "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/Dashboard.tsx",
                lineNumber: 610,
                columnNumber: 15
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/pages/Dashboard.tsx",
          lineNumber: 529,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/pages/Dashboard.tsx",
        lineNumber: 527,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/Dashboard.tsx",
      lineNumber: 364,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/Dashboard.tsx",
    lineNumber: 221,
    columnNumber: 5
  }, this);
}
