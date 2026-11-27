import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { Calendar, Target, Activity, ChevronRight, Bookmark, AlertCircle, Sparkles, Lightbulb, XCircle, CheckCircle2 } from "lucide-react";
import { api } from "/src/api.ts";
import { ensureArray } from "/src/utils/arrayUtils.ts";
export default function RoadmapDashboard({ user, testResult: initialTestResult, onEnterApp }) {
  const [testResult, setTestResult] = useState(initialTestResult);
  useEffect(() => {
    setTestResult(initialTestResult);
  }, [initialTestResult]);
  useEffect(() => {
    if (!testResult.isAnalyzing) return;
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const latestResult = await api.getPlacementTest();
        if (latestResult && isMounted) {
          setTestResult(latestResult);
          if (!latestResult.isAnalyzing) {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ kết quả AI:", err);
      }
    }, 3e3);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [testResult.isAnalyzing]);
  const roadmap = testResult.proposedRoadmap;
  const [activeTab, setActiveTab] = useState("roadmap");
  const defaultSuggestions = [
    "Dành 15 phút đầu giờ sáng nghe chủ động (Active Listening) các bản tin ngắn (như BBC 6 Minute English) kết hợp xem Transcript để tích lũy phát âm chuẩn.",
    "Luyện nói theo phương pháp Shadowing (đọc đuổi theo âm điệu bản xứ) tối thiểu 10 phút từ các video giao tiếp ngắn, chú ý nuốt âm và nối từ.",
    "Tận dụng mục 'Luyện Tập' trong ứng dụng hàng ngày để làm quen với phát âm câu ngắn và nhận chỉnh sửa lỗi sai từ AI.",
    "Hệ thống hóa từ vựng theo cụm từ (Collocations) thay vì học đơn lẻ, ghi chép sổ sành hành trình ôn luyện 5 câu viết mới mỗi ngày."
  ];
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 overflow-y-auto font-sans relative", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] pulse-glow" }, void 0, false, {
      fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pulse-glow" }, void 0, false, {
      fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
      lineNumber: 57,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto w-full space-y-6 relative z-10", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 text-left", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 tracking-wider", children: "hồ sơ năng lực hoàn tất" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 64,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-black text-white tracking-tight uppercase", children: [
            "CHÚC MỪNG ",
            user.fullName.toUpperCase(),
            "!"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 67,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-350 max-w-lg leading-relaxed font-semibold", children: "Trí tuệ nhân tạo Gemini đã chắt lọc kết quả bài thi 30 câu hỏi của bạn để thiết kế chương trình học thích ứng lý tưởng nhất." }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 68,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 63,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 items-center shrink-0", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative w-24 h-24 rounded-2xl border border-slate-800 flex flex-col items-center justify-center bg-slate-950/90 shadow-xl shadow-black/40", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none block mb-1", children: "SCORE" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 76,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-white leading-none", children: testResult.score }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 77,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-emerald-400 mt-1", children: "/100" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 78,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 75,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-600 px-6 py-4.5 rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-indigo-600/25 transform rotate-2 hover:rotate-0 transition-all duration-300", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-100 font-black uppercase tracking-wider block mb-1 leading-none", children: "CẤP TRÌNH ĐỘ" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 83,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-3xl font-black text-white leading-none", children: testResult.level }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 84,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 82,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 73,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      testResult.isAnalyzing && /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3.5", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 animate-spin", style: { animationDuration: "6s" }, children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 94,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 93,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-left", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black uppercase text-indigo-300 tracking-wider", children: "Đang mổ xẻ lỗi sai & tối ưu hóa lộ trình bằng AI..." }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 97,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-300 leading-relaxed font-semibold", children: "Hệ thống đang gọi Gemini AI phân tích bài trắc nghiệm và thiết lập kế hoạch học tập cá nhân hóa. Kết quả điểm số hiển thị đầy đủ ngay lập tức." }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 98,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 96,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 92,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "shrink-0 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-black uppercase", children: "Processing..." }, void 0, false, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 103,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 91,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-1 space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-5.5 space-y-3.5 shadow-md text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-emerald-450 text-emerald-400", children: [
              /* @__PURE__ */ jsxDEV(Target, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 115,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider", children: "Điểm mạnh cốt lõi" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 116,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 114,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-300 leading-relaxed font-semibold", children: [
              '"',
              testResult.strengths || "Chưa ghi nhận điểm mạnh cụ thể. Hãy hoàn thành thêm luyện tập nhé.",
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 118,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 113,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-5.5 space-y-3.5 shadow-md text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-rose-455 text-rose-400", children: [
              /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 125,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider", children: "Lỗ hổng cần vá" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 126,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 124,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-300 leading-relaxed font-semibold", children: [
              '"',
              testResult.weaknesses || "Chưa ghi nhận lỗ hổng cụ thể. Hãy hoàn thành thêm luyện tập nhé.",
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 128,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 123,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-5.5 space-y-3.5 shadow-md text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-indigo-400", children: [
              /* @__PURE__ */ jsxDEV(Calendar, { className: "w-4 h-4 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 135,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider", children: "Thời gian cam kết" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 136,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 134,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950 rounded-xl p-3.5 text-center border border-slate-850", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-white block", children: [
                roadmap?.duration || 60,
                " Ngày"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 139,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-550 font-mono tracking-wider font-extrabold block mt-0.5 uppercase", children: "Luyện tập sâu" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 140,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 138,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 133,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6.5 shadow-md flex flex-col justify-between text-left", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5 text-indigo-400 border-b border-slate-800 pb-3", children: [
              /* @__PURE__ */ jsxDEV(Activity, { className: "w-5 h-5 shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 149,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-black uppercase tracking-wider text-white flex items-center gap-2", children: [
                "Chẩn đoán chi tiết từ Gemini AI",
                testResult.isAnalyzing && /* @__PURE__ */ jsxDEV("span", { className: "animate-pulse bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-tight", children: "Đang phân tích..." }, void 0, false, {
                  fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                  lineNumber: 153,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 150,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 148,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-slate-300 text-xs leading-relaxed space-y-3", children: /* @__PURE__ */ jsxDEV("p", { className: "indent-4 leading-loose font-sans whitespace-pre-line text-slate-300 font-semibold text-[13px]", children: testResult.detailedAnalysis || "Phân tích hệ thống chỉ ra rằng học viên có phản xạ tiếng Anh cơ bản tương đối tốt đối với mảng Đọc hiểu (Reading Comprehension) nhờ sở hữu vốn từ đơn lẻ phong phú. Tuy nhiên, khả năng ghép vựng và phản xạ hội thoại thực chiến vẫn rụt rè. Trí tuệ nhân tạo khuyên bạn tích cực nghe nhịp âm bản xứ, thực thi Speaking liên tục mỗi ngày trong Module Luyện tập để gia tăng độ mượt." }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 161,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 160,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 147,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Đánh giá tự học" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 168,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Gemini Model 3.5-Flash" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 169,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 167,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-slate-800 gap-1 mt-6", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "tab-btn-roadmap",
            onClick: () => setActiveTab("roadmap"),
            className: `px-5 py-3 text-xs uppercase font-black tracking-widest border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "roadmap" ? "border-emerald-400 text-emerald-400 font-extrabold bg-emerald-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`,
            children: [
              /* @__PURE__ */ jsxDEV(Calendar, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 185,
                columnNumber: 13
              }, this),
              " Lộ Trình 5 Ngày"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 176,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "tab-btn-mistakes",
            onClick: () => setActiveTab("mistakes"),
            className: `px-5 py-3 text-xs uppercase font-black tracking-widest border-b-2 flex items-center gap-2 transition-all cursor-pointer relative ${activeTab === "mistakes" ? "border-red-450 text-red-400 font-extrabold bg-red-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`,
            children: [
              /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 196,
                columnNumber: 13
              }, this),
              " Phá Bẫy Lỗi Sai",
              testResult.wrongAnswers && testResult.wrongAnswers.length > 0 && /* @__PURE__ */ jsxDEV("span", { className: "bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full text-[9px] border border-red-500/30", children: testResult.wrongAnswers.length }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 198,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 187,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "tab-btn-suggestions",
            onClick: () => setActiveTab("suggestions"),
            className: `px-5 py-3 text-xs uppercase font-black tracking-widest border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "suggestions" ? "border-indigo-400 text-indigo-400 font-extrabold bg-indigo-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`,
            children: [
              /* @__PURE__ */ jsxDEV(Lightbulb, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 212,
                columnNumber: 13
              }, this),
              " Gợi ý & Mẹo AI"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 203,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 175,
        columnNumber: 9
      }, this),
      activeTab === "roadmap" && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-800/95 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-700 pb-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxDEV(Bookmark, { className: "w-5 h-5 text-yellow-400" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 221,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-black uppercase tracking-wider text-white", children: "LỘ TRÌNH 5 NGÀY ĐẦU TIÊN CỦA BẠN" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 222,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 220,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-amber-300 font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full", children: "Khởi động nhanh" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 225,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 219,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3.5", children: ensureArray(roadmap?.grid).map((dayNode, idx) => {
          return /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-3 text-center", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-emerald-400 uppercase tracking-widest block bg-emerald-500/5 py-0.5 rounded", children: [
                "Ngày ",
                dayNode.day
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 235,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold leading-normal text-slate-200 block mt-2 h-10 overflow-hidden line-clamp-2", children: dayNode.topic }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 236,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 234,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 border-t border-slate-800 pt-3", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold uppercase bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full inline-block", children: dayNode.skill }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 242,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] block text-slate-400 font-medium", children: [
                "⏰ ",
                dayNode.duration,
                " phút / ngày"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 245,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 241,
              columnNumber: 21
            }, this)
          ] }, idx, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 233,
            columnNumber: 19
          }, this);
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 230,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900/60 p-4 border border-slate-700/30 rounded-xl space-y-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-extrabold uppercase text-slate-500 tracking-wider", children: "CÁC MỐC ĐẠT ĐƯỢC CHỦ CHỐT" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 254,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400 pl-2", children: ensureArray(roadmap?.goals).map((g, i) => /* @__PURE__ */ jsxDEV("li", { className: "flex gap-2 items-start mt-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 258,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: g }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 259,
              columnNumber: 21
            }, this)
          ] }, i, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 257,
            columnNumber: 19
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 255,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 253,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 218,
        columnNumber: 11
      }, this),
      activeTab === "mistakes" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-6 shadow-md space-y-2", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-rose-450 text-rose-400 uppercase tracking-wider flex items-center gap-2 select-none", children: [
            /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-5 h-5 text-rose-400 shrink-0 animate-bounce" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 272,
              columnNumber: 17
            }, this),
            " NHẬT KÝ SỬA SAI CHI TIẾT TỪ AI",
            testResult.isAnalyzing && /* @__PURE__ */ jsxDEV("span", { className: "animate-pulse bg-rose-500/20 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-tight", children: "Đang nạp mổ xẻ AI..." }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 274,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 271,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-300 leading-relaxed", children: "Mẫu số chung của sự tiến bộ là thấu hiểu sai lầm. Dưới đây là phân tích chi tiết của từng câu trả lời chưa chuẩn trong danh sách 30 câu thi vừa qua:" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 279,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 270,
          columnNumber: 13
        }, this),
        !testResult.wrongAnswers || testResult.wrongAnswers.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4 shadow-xl", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl flex items-center justify-center rounded-full mx-auto select-none", children: "🌟" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 286,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-base font-black text-white uppercase tracking-tight", children: "KẾT QUẢ ĐẠT ĐIỂM SỐ HOÀN HẢO" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 290,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 max-w-md mx-auto leading-relaxed", children: "Chúc mừng bạn đã đạt điểm số tối đa trong phần trắc nghiệm! Không có lỗi sai lý thuyết hoặc đọc hiểu nào được ghi nhận. Bạn đã sẵn sàng bứt phá các bài học giao tiếp nâng cao." }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 291,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 289,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 285,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-4.5", children: ensureArray(testResult?.wrongAnswers).map((item, idx) => /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden transition-all hover:border-slate-700/80 shadow-md", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 bottom-0 w-1 bg-red-500/80" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 300,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 justify-between items-start", children: [
            /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase ${item.skill === "listening" ? "bg-sky-500/10 border-sky-500/20 text-sky-400" : item.skill === "reading" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`, children: item.skill === "listening" ? "KỸ NĂNG NGHE (LISTENING)" : item.skill === "reading" ? "KỸ NĂNG ĐỌC (READING)" : "KỸ NĂNG VIẾT (WRITING)" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 303,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono text-slate-500", children: [
              "CÂU TRẮC NGHIỆM #",
              idx + 1
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 310,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 302,
            columnNumber: 21
          }, this),
          item.context && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 border border-slate-800/80 p-3 rounded-xl text-xs italic text-slate-300 leading-relaxed font-sans max-h-36 overflow-y-auto", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-500 uppercase text-[9px] tracking-wider block mb-1", children: "Nguồn hội thoại / Khổ văn đọc hiểu:" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 315,
              columnNumber: 25
            }, this),
            '"',
            item.context,
            '"'
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 314,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-extrabold uppercase text-slate-500 block tracking-wider", children: "Nội dung câu hỏi:" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 323,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-white text-xs font-semibold leading-relaxed", children: item.questionText }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 324,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 322,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-900", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-red-500/5 border border-red-500/15 rounded-xl p-3 space-y-1", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-red-400 font-bold text-[10px] uppercase", children: [
                /* @__PURE__ */ jsxDEV(XCircle, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                  lineNumber: 330,
                  columnNumber: 27
                }, this),
                " Bạn đã chọn"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 329,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-300 text-xs font-medium leading-relaxed", children: item.userAnswerText || item.userAnswer || "Chưa có lời giải" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 332,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 328,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3 space-y-1", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase", children: [
                /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-3.5 h-3.5 shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                  lineNumber: 339,
                  columnNumber: 27
                }, this),
                " Đáp án chính xác"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 338,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-200 text-xs font-extrabold leading-relaxed", children: item.correctAnswerText || item.correctAnswer }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 341,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 337,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 327,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 space-y-1.5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-indigo-400 font-extrabold text-[10px] uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 349,
                columnNumber: 25
              }, this),
              " Giáo vụ AI mổ xẻ & Nhận xét"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 348,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-slate-300 text-xs leading-relaxed font-sans", children: item.explanation }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 351,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 347,
            columnNumber: 21
          }, this)
        ] }, idx, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 299,
          columnNumber: 19
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 297,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 269,
        columnNumber: 11
      }, this),
      activeTab === "suggestions" && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-800/95 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 border-b border-slate-700 pb-3", children: [
          /* @__PURE__ */ jsxDEV(Lightbulb, { className: "w-5 h-5 text-indigo-400 shrink-0" }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 365,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black uppercase text-white tracking-widest", children: [
            "GỢI Ý PHƯƠNG PHÁP HỌC TOÀN DIỆN CHO ",
            user.fullName.toUpperCase()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 366,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 364,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-slate-300 text-xs leading-relaxed space-y-4 font-sans", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "indent-4 leading-loose", children: [
            "Dựa trên mẫu bài làm đạt ",
            /* @__PURE__ */ jsxDEV("b", { className: "text-emerald-400 font-black", children: [
              testResult.score,
              "/100 điểm"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 373,
              columnNumber: 42
            }, this),
            ", đội ngũ cố vấn kết hợp cùng AI đã đúc rút các phương pháp hành động cụ thể để tối ưu hóa khả năng phản xạ và nâng trình tiếng Anh của bạn hàng ngày:"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 372,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-1", children: ensureArray(testResult?.studySuggestions || defaultSuggestions).map((suggestion, i) => /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 border border-slate-850 rounded-xl p-4 flex gap-3.5 items-start transition-all hover:bg-slate-900/80", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-indigo-500/5", children: [
              "0",
              i + 1
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 379,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-indigo-300 uppercase tracking-widest", children: [
                "PHƯƠNG PHÁP CHỦ CHỐT ",
                i + 1
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 383,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-300 leading-relaxed font-semibold", children: suggestion }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 384,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 382,
              columnNumber: 21
            }, this)
          ] }, i, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 378,
            columnNumber: 19
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 376,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-4.5 space-y-2 mt-4.5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-indigo-400 animate-spin", style: { animationDuration: "6s" } }, void 0, false, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 392,
                columnNumber: 19
              }, this),
              " LỜI KHUYÊN PHẢN XẠ THỰC THỰC CHIẾN"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 391,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-400 leading-relaxed pl-1", children: [
              "Đừng ngần ngại phạm sai lầm. Trong quá trình học, AI của hệ thống sẽ liên tục chấm điểm, chỉ ra lỗi sai ngữ pháp, và cung cấp phiên âm IPA chuẩn xác cho từng bài phát âm hoặc viết dịch của bạn. Hãy kiên trì rèn luyện tối thiểu ",
              /* @__PURE__ */ jsxDEV("b", { className: "text-emerald-400", children: [
                user.minutesPerDay || 45,
                " phút hàng ngày"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
                lineNumber: 395,
                columnNumber: 246
              }, this),
              " để thăng cấp thực sự!"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 394,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
            lineNumber: 390,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 371,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
        lineNumber: 363,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "btn-confirm-roadmap",
          onClick: onEnterApp,
          className: "w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl py-4 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 active:translate-y-0.5 transition-all text-sm uppercase tracking-wide cursor-pointer",
          children: [
            "KÍCH HOẠT LỘ TRÌNH & VÀO HỌC LUYỆN TẬP ",
            /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
              lineNumber: 408,
              columnNumber: 50
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
          lineNumber: 403,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
      lineNumber: 59,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/RoadmapDashboard.tsx",
    lineNumber: 55,
    columnNumber: 5
  }, this);
}
