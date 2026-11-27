import React, { useState, useEffect, useRef } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { api } from "/src/api.ts";
import { evaluateSpeakingText } from "/src/utils/speechEvaluator.ts";
import { useLanguage } from "/src/context/LanguageContext.tsx";
import { CefrPathwayIcon } from "/src/components/CefrPathwayLogo.tsx";
import { Headphones, Mic, BookOpen, PenTool, CheckCircle, ChevronRight, ChevronLeft, AlertTriangle, Play, Pause, Sparkles, Loader2 } from "lucide-react";
import { collection, query, where, onSnapshot, writeBatch, doc, getDocs } from "firebase/firestore";
import { db } from "/src/firebase.ts";
import { TEST_QUESTIONS as FALLBACK_QUESTIONS } from "/src/utils/firebaseMigration.ts";
const MicPermissionInstructions = ({ errorMsg, onClose, language }) => {
  const [activeTab, setActiveTab] = React.useState("chrome");
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-amber-900 rounded-2xl p-4.5 space-y-3.5 shadow-md text-left w-full relative z-10 animate-fade-in font-sans", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-amber-500 text-white rounded-xl shadow-sm", children: /* @__PURE__ */ jsxDEV(Mic, { className: "w-5 h-5 animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 24,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 23,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-extrabold text-sm text-amber-950 flex items-center gap-1.5 leading-tight", children: language === "en" ? "Microphone Permission Missing 🎙️" : "Chưa Cấp Quyền Microphone 🎙️" }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 27,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-605 text-slate-600 leading-normal text-[11px] mt-1 font-semibold", children: language === "en" ? "The assessment requires your microphone to evaluate your speaking abilities. Please resolve this using the matching guide below:" : "Bài kiểm tra cần giọng nói của bạn để đánh giá. Bạn hãy xử lý nhanh theo hướng dẫn phù hợp dưới đây nhé:" }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 30,
          columnNumber: 11
        }, this),
        errorMsg && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-amber-800 bg-amber-100/50 p-2 rounded-lg mt-1.5 font-mono border border-amber-200", children: language === "en" ? `Error details: ${errorMsg}` : `Chi tiết lỗi: ${errorMsg}` }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 36,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 22,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 border-b border-amber-200/50 pb-2", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("chrome"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "chrome" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🌐 Chrome / Edge"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 45,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("firefox"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "firefox" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🦊 Firefox"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 54,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("safari"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "safari" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🍏 Safari (iOS)"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 63,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("android"),
          className: `px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeTab === "android" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-100 hover:bg-amber-200/40 text-amber-800"}`,
          children: "🤖 Android"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 72,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-[11px] text-slate-700 leading-relaxed space-y-2 bg-white/75 p-3 rounded-xl border border-amber-200", children: [
      activeTab === "chrome" && (language === "en" ? /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Click the ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Lock icon 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 88,
            columnNumber: 29
          }, this),
          " on the left side of the address bar."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 88,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Toggle ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 89,
            columnNumber: 26
          }, this),
          " to ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Allow" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 89,
            columnNumber: 57
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 89,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Press ",
          /* @__PURE__ */ jsxDEV("strong", { children: "F5" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 90,
            columnNumber: 25
          }, this),
          " or click Reload if prompted."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 90,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 87,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Khóa (Lock) 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 94,
            columnNumber: 34
          }, this),
          " nằm bên trái thanh địa chỉ URL trình duyệt."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 94,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tại phần ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone (Micro)" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 95,
            columnNumber: 28
          }, this),
          ", bấm chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 95,
            columnNumber: 74
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 95,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm phím ",
          /* @__PURE__ */ jsxDEV("strong", { children: "F5" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 96,
            columnNumber: 28
          }, this),
          " hoặc tải lại trang web (Reload) nếu trình duyệt hỏi."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 96,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 93,
        columnNumber: 13
      }, this)),
      activeTab === "firefox" && (language === "en" ? /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Click the ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Site settings / Lock icon 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 103,
            columnNumber: 29
          }, this),
          " at the left of the address bar."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 103,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Remove blocked permissions / click the X next to blocked mic option." }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 104,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Reload (F5) and tap the record button, select ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Allow" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 105,
            columnNumber: 65
          }, this),
          " on popup."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 105,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 102,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Click biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt trang web / Khóa 🔒" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 109,
            columnNumber: 36
          }, this),
          " ở góc trái URL thanh trình duyệt."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 109,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Xóa chặn quyền / Nhấp dấu X bên cạnh quyền Micro bị chặn." }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 110,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tải lại trang (F5) và bấm nút nói, chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 111,
            columnNumber: 59
          }, this),
          " khi có popup hiện lên."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 111,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 108,
        columnNumber: 13
      }, this)),
      activeTab === "safari" && (language === "en" ? /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Go to ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Settings ⚙️" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 118,
            columnNumber: 25
          }, this),
          " on your iOS device home screen."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 118,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Scroll down to ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Safari" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 119,
            columnNumber: 34
          }, this),
          " and tap it ",
          `>`,
          " Tap ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 119,
            columnNumber: 79
          }, this),
          " ",
          `>`,
          " Choose ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Allow" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 119,
            columnNumber: 120
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 119,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Pro tip:" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 120,
            columnNumber: 19
          }, this),
          " Tap the ",
          /* @__PURE__ */ jsxDEV("strong", { children: '"Open in new tab" ↗' }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 120,
            columnNumber: 53
          }, this),
          " button on the top right to request permissions inside a fully native scope."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 120,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 117,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Mở ứng dụng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt (Settings) ⚙️" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 124,
            columnNumber: 31
          }, this),
          " trên màn hình thiết bị của bạn."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 124,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Kéo tìm chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Safari" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 125,
            columnNumber: 32
          }, this),
          " ",
          `>`,
          " Nhấp chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 125,
            columnNumber: 72
          }, this),
          " ",
          `>`,
          " Chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép (Allow)" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 125,
            columnNumber: 111
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 125,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Tuyệt chiêu:" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 126,
            columnNumber: 19
          }, this),
          " Nhấp nút ",
          /* @__PURE__ */ jsxDEV("strong", { children: '"Mở cửa sổ mới" ↗' }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 126,
            columnNumber: 58
          }, this),
          " ở góc trên bên phải trang web để chạy độc lập và xin quyền trực diện!"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 126,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 123,
        columnNumber: 13
      }, this)),
      activeTab === "android" && (language === "en" ? /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tap the ",
          /* @__PURE__ */ jsxDEV("strong", { children: "three dots ⋮" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 133,
            columnNumber: 27
          }, this),
          " in the top-right corner of Chrome ",
          `>`,
          " ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Site Settings" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 133,
            columnNumber: 97
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 133,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Tap ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 134,
            columnNumber: 23
          }, this),
          " and select ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Allow" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 134,
            columnNumber: 62
          }, this),
          " for this site."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 134,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Or grant Chrome permission in Android App settings." }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 135,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 132,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Bấm biểu tượng ",
          /* @__PURE__ */ jsxDEV("strong", { children: "ba chấm ⋮" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 139,
            columnNumber: 34
          }, this),
          " trên góc trình duyệt Chrome ",
          `>`,
          " ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cài đặt trang web" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 139,
            columnNumber: 95
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 139,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          "Chọn mục ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Microphone" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 140,
            columnNumber: 28
          }, this),
          " và click gạt chọn ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Cho phép" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 140,
            columnNumber: 74
          }, this),
          " cho trang web này."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 140,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: "Hoặc cấp quyền cho ứng dụng Chrome trong mục ứng dụng của cài đặt hệ điều hành Android." }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 141,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 138,
        columnNumber: 13
      }, this))
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-100/60 p-2 rounded-xl border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-600 leading-normal", children: [
        "💡 ",
        language === "en" ? "Tip: The system remembers this decision to avoid repeated alerts." : "Gợi ý: Lưu ý hệ thống sẽ lưu trạng thái để tránh làm phiền bạn xin quyền liên tục."
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 148,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-3.5 py-1.5 text-[10px] font-black bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all cursor-pointer flex-shrink-0",
          children: language === "en" ? "Clear Error & Retry 🎙️" : "Xóa báo lỗi & Thử lại ngay 🎙️"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 151,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 147,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/PlacementTest.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
};
const TEST_QUESTIONS = [
  // LISTENING (1-10)
  {
    id: "lst_1_1_1",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Listen to the introduction. What is Sarah's job?",
    audioUrl: "Hi! My name is Sarah. I work at the city secondary high school, where I have been teaching English and world literature for over five years.",
    options: ["A. English Teacher", "B. Secondary student", "C. Librarian", "D. Tour guide"],
    correctAnswer: "A"
  },
  {
    id: "lst_1_1_2",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Which sport does John play every Saturday morning?",
    audioUrl: "Usually I stay home, but every Saturday morning, I hook up with my friends on the local court to play basketball.",
    options: ["A. Tennis", "B. Volleyball", "C. Basketball", "D. Chess"],
    correctAnswer: "C"
  },
  {
    id: "lst_1_1_3",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Where did she say she bought her waterproof jacket?",
    audioUrl: "While going through the Central Mall yesterday, I decided to buy a waterproof navy blue jacket.",
    options: ["A. Grocery store", "B. Central Mall", "C. Online store", "D. Airport retail shop"],
    correctAnswer: "B"
  },
  {
    id: "lst_1_1_4",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "What was the main topic of the conversation?",
    audioUrl: "We must reduce carbon dioxide emissions quickly. Rising global temperatures are putting marine habitats at severe risks.",
    options: ["A. Marine tourism", "B. Reducing carbon emissions", "C. Industrial logistics", "D. Holiday travel deals"],
    correctAnswer: "B"
  },
  {
    id: "lst_1_1_5",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Why was the speaker delayed during their transit commute?",
    audioUrl: "I'm sorry for being late. There was a sudden power outage on the underground subway train, halting it for twenty minutes.",
    options: ["A. Heavy rainfall", "B. Subways power outage", "C. Flat tire", "D. Missing key card"],
    correctAnswer: "B"
  },
  {
    id: "lst_1_1_6",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "What instrument is the speaker practicing?",
    audioUrl: "Even though my fingertips suffer quite a lot from pressing chords, I am still practicing the acoustic guitar for thirty minutes every night.",
    options: ["A. Acoustic guitar", "B. Standard flute", "C. Electric keyboard", "D. Classical violin"],
    correctAnswer: "A"
  },
  {
    id: "lst_1_1_7",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "How old is her cat Whiskers?",
    audioUrl: "My cat Whiskers is five years old. She likes sleeping on my workspace keyboards.",
    options: ["A. 15 years old", "B. 5 years old", "C. 3 years old", "D. 10 years old"],
    correctAnswer: "B"
  },
  {
    id: "lst_1_1_8",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "What time is the team meeting scheduled to start tomorrow?",
    audioUrl: "Quick announcement! Our team project sync tomorrow will start at 9:30 AM in Conference Room B.",
    options: ["A. Today at 9:30 PM", "B. Tomorrow at 9:30 AM", "C. Friday morning", "D. At noon"],
    correctAnswer: "B"
  },
  {
    id: "lst_1_1_9",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "What did the speaker drink for breakfast?",
    audioUrl: "This morning I enjoyed scrambled eggs with whole wheat toast. It paired elegantly with my hot black tea.",
    options: ["A. Orange juice", "B. Black coffee", "C. Hot black tea", "D. Skim milk"],
    correctAnswer: "C"
  },
  {
    id: "lst_1_1_a",
    skill: "listening",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Which location is the traveler visiting this summer?",
    audioUrl: "I can't wait for summer! I finally booked a hotel near the temples of Kyoto, Japan.",
    options: ["A. Tokyo", "B. Kyoto, Japan", "C. Rome", "D. Paris"],
    correctAnswer: "B"
  },
  // SPEAKING (11-15)
  {
    id: "spk_1_1_1",
    skill: "speaking",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Pronunciation practice: Click Record and read the following sentence aloud:",
    speakingTarget: "Practice makes perfect when learning database schemas."
  },
  {
    id: "spk_1_1_2",
    skill: "speaking",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Pronunciation practice: Read the following sentence aloud:",
    speakingTarget: "To speak English fluently, you must practice every single day."
  },
  {
    id: "spk_1_1_3",
    skill: "speaking",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Pronunciation practice: Read the following sentence aloud:",
    speakingTarget: "Global warming is a critical situation that requires international collaboration."
  },
  {
    id: "spk_1_1_4",
    skill: "speaking",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Pronunciation practice: Read the following sentence aloud:",
    speakingTarget: "Artificial intelligence helps students optimize their tailored roadmaps."
  },
  {
    id: "spk_1_1_5",
    skill: "speaking",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Spontaneous speaking response: Talk about your favorite food in English:",
    speakingTarget: "Tell me about your favorite food."
  },
  // READING (16-25)
  {
    id: "rdg_1_1_1",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Water is essential for all known forms of life. Although it provides no organic nutrients, it plays structural roles. It coordinates blood circulation, regulates body temperature, and enables transport of cells.",
    questionText: "According to the text, what is true about water?",
    options: ["A. It carries dense organic nutrients", "B. It is essential for all known life forms", "C. It should be boiled with heavy salt", "D. It acts as an artificial hormone"],
    correctAnswer: "B"
  },
  {
    id: "rdg_1_1_2",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Human beings should consume around 2 liters of water daily to maintain neural connections and clean kidneys of toxins. High water intake accelerates cellular repair cycles.",
    questionText: "Why is drinking 2 liters of water crucial?",
    options: ["A. To replace morning beverages", "B. To maintain neural connections and clean kidneys", "C. To study English without headaches", "D. To reduce body fat ratios"],
    correctAnswer: "B"
  },
  {
    id: "rdg_1_1_3",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "The Great Barrier Reef is the world's largest coral reef grid, situated near Queensland, Australia. It consists of over 2,900 reefs of corals. Rising ocean levels and temperature spikes represent major threats.",
    questionText: "The Great Barrier Reef is situated off the coast of:",
    options: ["A. Wellington, New Zealand", "B. California, USA", "C. Queensland, Australia", "D. Cape Town, South Africa"],
    correctAnswer: "C"
  },
  {
    id: "rdg_1_1_4",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Photosynthesis is the key biochemical process by which green plants utilize sunlight to synthesize nutrients from carbon dioxide and water. This reaction primarily generates oxygen as a crucial byproduct.",
    questionText: "What is the primary byproduct of the photosynthetic reaction?",
    options: ["A. Hydrogen sulfide", "B. Carbon monoxide", "C. Pure oxygen", "D. Nitrogen dioxide"],
    correctAnswer: "C"
  },
  {
    id: "rdg_1_1_5",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Coffee is loaded with antioxidants and caffeine, widely valued for boosting focus. However, heavy ingestion after 4 PM can interfere with standard Circadian sleeping patterns.",
    questionText: "What benefit of coffee is mentioned?",
    options: ["A. Deep sleep trigger", "B. Loaded with antioxidants to boost focus", "C. Lowers stomach acidities", "D. Suppresses caffeine dependency"],
    correctAnswer: "B"
  },
  {
    id: "rdg_1_1_6",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "The Amazon rainforest covers a massive tropical basin in South America, housing millions of unique biological species. Rapid deforestation represents an active hazard to planetary biodiversity.",
    questionText: "What critical environmental threat is the Amazon basin experiencing?",
    options: ["A. Extreme urban overpopulation", "B. Rapid deforestation", "C. Heavy radioactive snowfall", "D. Shortage of mineral sediments"],
    correctAnswer: "B"
  },
  {
    id: "rdg_1_1_7",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "The Eiffel Tower, finished in 1889, is an icon of iron architecture. Named after Gustave Eiffel, it draws millions of tourists to Paris annually, despite initial critical opposition.",
    questionText: "When was the Eiffel Tower constructed?",
    options: ["A. 1889", "B. 1989", "C. 1789", "D. 1859"],
    correctAnswer: "A"
  },
  {
    id: "rdg_1_1_8",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Deep-sea trenches are extremely cold, high-pressure zones where sunlight never reaches. Despite these brutal conditions, specialized organisms adapt using chemosynthesis helper enzymes.",
    questionText: "How do organisms in deep-sea trenches survive without sunlight?",
    options: ["A. Using chlorophyll absorption", "B. Adapting via chemosynthesis helper enzymes", "C. Hibernating for several decades", "D. Migrating to land surfaces"],
    correctAnswer: "B"
  },
  {
    id: "rdg_1_1_9",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Artificial Intelligence mimics human cognitive abilities. Deep models digest large volumes of raw digital data to build prediction frameworks across logistics and clinics.",
    questionText: "Artificial Intelligence systems are designed to mimic:",
    options: ["A. Traditional hand tools", "B. Human cognitive abilities", "C. Animal migratory paths", "D. Radio transmission rates"],
    correctAnswer: "B"
  },
  {
    id: "rdg_1_1_a",
    skill: "reading",
    levelNumber: 1,
    lessonNumber: 1,
    readingPassage: "Renewable solar cells harvest radiant light rays to excite free electrons, transforming solar kinetic energy directly into clean electricity to power smart municipal grids.",
    questionText: "What do solar cells excite to directly generate clean electricity?",
    options: ["A. Atomic weights", "B. Free electrons", "C. Sound waves", "D. Magnetic loops"],
    correctAnswer: "B"
  },
  // WRITING (26-30)
  {
    id: "wrt_1_1_1",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Express your strong desire to improve your English listening skills for your professional work."
  },
  {
    id: "wrt_1_1_2",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Explain how studying persistently for at least thirty minutes everyday brings surprising results."
  },
  {
    id: "wrt_1_1_3",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Describe how a quiet learning environment helps allocate your mental energy comfortably during exam preparation."
  },
  {
    id: "wrt_1_1_4",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Describe how an AI context-analyzer tool helps you build a custom-tailored personalized study plan."
  },
  {
    id: "wrt_1_1_5",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a short paragraph of 30-50 words in English explaining why learning a foreign language is crucial in the modern digital era.",
    writingPrompt: "Why is English important in today's era? (Write 30-50 words)"
  }
];
async function importFallbackQuestionsToFirestore() {
  try {
    let sourceQuestions = [];
    try {
      console.log("[Migration] Fetching complete question bank from backend API...");
      const res = await api.getAdminQuestionsAll();
      if (res && res.length > 0) {
        sourceQuestions = res;
        console.log(`[Migration] Retrieved ${sourceQuestions.length} questions from backend.`);
      }
    } catch (e) {
      console.warn("[Migration] Backend questions API failed/unavailable, falling back to local list:", e);
    }
    if (sourceQuestions.length === 0) {
      sourceQuestions = [...FALLBACK_QUESTIONS];
      console.log(`[Migration] Operating with default FALLBACK_QUESTIONS fallback list (${sourceQuestions.length} items)`);
    } else {
      const sourceIds = new Set(sourceQuestions.map((q) => q.id));
      for (const fallbackQ of FALLBACK_QUESTIONS) {
        if (fallbackQ.id && !sourceIds.has(fallbackQ.id)) {
          sourceQuestions.push(fallbackQ);
        }
      }
    }
    let batch = writeBatch(db);
    let count = 0;
    for (const q of sourceQuestions) {
      const qId = q.id || "q_" + Date.now() + "_" + Math.floor(Math.random() * 1e3);
      const qRef = doc(db, "questions", qId);
      const qData = { ...q };
      if (qData.imageUrl && qData.imageUrl.startsWith("data:image")) {
        qData.imageUrl = "";
      }
      const isOfficialPlacement = FALLBACK_QUESTIONS.some((item) => item.id === qId);
      const normalizedData = {
        id: qId,
        questionText: qData.questionText || qData.prompt || qData.question || qData.promptText || "",
        options: qData.options || [],
        correctAnswer: qData.correctAnswer || "",
        explanation: qData.explanation || "",
        subject: qData.subject || qData.skill || "",
        grade: qData.grade || qData.levelNumber?.toString() || "",
        examId: qData.examId || null,
        difficulty: qData.difficulty || "medium",
        createdAt: qData.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: qData.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        ...qData
      };
      if (isOfficialPlacement) {
        normalizedData.isPlacement = true;
      }
      batch.set(qRef, normalizedData);
      count++;
      if (count % 400 === 0) {
        await batch.commit();
        batch = writeBatch(db);
        console.log(`[Migration] Imported ${count}/${sourceQuestions.length} questions to Firestore...`);
      }
    }
    if (count % 400 !== 0) {
      await batch.commit();
    }
    console.log(`[Migration] Successfully migrated all ${count} questions to Firestore.`);
  } catch (err) {
    if (err?.code === "permission-denied") {
      console.error("Firestore permission denied. Check security rules.");
    } else {
      console.error("Error importing fallback questions:", err);
    }
  }
}
export default function PlacementTest({ user, onSuccess }) {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechInstance, setSpeechInstance] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const placementRecRef = useRef(null);
  const [recordingSuccess, setRecordingSuccess] = useState(false);
  const [speakingTextResult, setSpeakingTextResult] = useState("");
  const [speakingResult, setSpeakingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState(1);
  const [error, setError] = useState("");
  const [micPermissionError, setMicPermissionError] = useState(null);
  useEffect(() => {
    let unsubscribe;
    const fetchQuestions = async () => {
      const qColRef = collection(db, "questions");
      console.log("Reading questions from path:", "questions");
      try {
        const initialSnapshot = await getDocs(qColRef);
        console.log("Firestore query result size:", initialSnapshot.size);
        if (initialSnapshot.empty) {
          console.warn("Firestore questions empty. Starting migration...");
          await importFallbackQuestionsToFirestore();
          const retrySnapshot = await getDocs(collection(db, "questions"));
          console.log("Questions after migration:", retrySnapshot.size);
        }
        const qCol = query(collection(db, "questions"), where("isPlacement", "==", true));
        unsubscribe = onSnapshot(qCol, (snapshot) => {
          let fetched = snapshot.docs.map((i) => ({ id: i.id, ...i.data() } as any));
          if (fetched.length < 30) {
            console.warn(`[PlacementTest] Firestore placement questions count (${fetched.length}) is less than 30. Using complete FALLBACK_QUESTIONS to guarantee a full test.`);
            fetched = FALLBACK_QUESTIONS as any[];
          }
          fetched.sort((a: any, b: any) => {
            const order: any = { "listening": 1, "speaking": 2, "reading": 3, "writing": 4 };
            return (order[a.skill] || 5) - (order[b.skill] || 5);
          });
          setQuestions(fetched);
          setLoadingQuestions(false);
        }, (err) => {
          if (err?.code === "permission-denied") {
            console.error("Firestore permission denied. Check security rules.");
          } else {
            console.error("Firestore onSnapshot error:", err);
          }
          setQuestions(FALLBACK_QUESTIONS);
          setLoadingQuestions(false);
        });
      } catch (err) {
        if (err?.code === "permission-denied") {
          console.error("Firestore permission denied. Check security rules.");
        } else {
          console.error("Firestore getDocs error:", err);
        }
        setQuestions(FALLBACK_QUESTIONS);
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  const currentQ = questions[currentIdx];
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setRecordingSuccess(false);
    setIsRecording(false);
    setSpeakingTextResult("");
    setSpeakingResult(null);
  }, [currentIdx]);
  const handlePlayAudio = () => {
    if (!window.speechSynthesis) {
      alert(language === "en" ? "Browser does not support text-to-speech." : "Trình duyệt không hỗ trợ công cụ phát âm mẫu.");
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const textToRead = currentQ.audioUrl || "";
    if (!textToRead) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
    setSpeechInstance(utterance);
  };
  const handleToggleRecord = async () => {
    console.log("Micro clicked");
    setError("");
    setMicPermissionError(null);
    if (isRecording) {
      console.log("Recording stopped manually");
      if (placementRecRef.current) {
        try {
          placementRecRef.current.stop();
        } catch (e) {
          console.warn("Error stopping speech recognition:", e);
        }
      }
      setIsRecording(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicPermissionError(language === "en" ? "Browser does not support Web Speech API." : "Trình duyệt không hỗ trợ Web Speech API.");
      alert(language === "en" ? "Cannot access microphone. Please use Chrome, Edge, or Safari with HTTPS enabled." : "Không thể truy cập microphone. Vui lòng sử dụng các trình duyệt hỗ trợ nhận diện giọng nói (Chrome, Edge, Safari) và kết nối HTTPS.");
      return;
    }
    setIsRecording(true);
    setRecordingSuccess(false);
    setSpeakingResult(null);
    console.log("Recording started");
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    placementRecRef.current = rec;
    rec.onresult = (event) => {
      if (!event.results || !event.results[0] || !event.results[0][0]) {
        console.warn("Speech recognition returned empty results.");
        setMicPermissionError(language === "en" ? "Could not hear your voice clearly, please speak louder!" : "Không nghe rõ giọng nói của bạn, vui lòng đọc to hơn!");
        setIsRecording(false);
        return;
      }
      const text = event.results[0][0].transcript;
      setSpeakingTextResult(text);
      setAnswers((prev) => ({ ...prev, [currentQ.id]: text }));
      setRecordingSuccess(true);
      setIsRecording(false);
      try {
        const evalResult = evaluateSpeakingText(currentQ.speakingTarget || "", text);
        setSpeakingResult(evalResult);
      } catch (err) {
        console.warn("Failed speech evaluation inside PlacementTest", err);
      }
      console.log("Recording stopped");
    };
    rec.onnomatch = (event) => {
      console.warn("Speech recognition nomatch.");
      setMicPermissionError(language === "en" ? "Could not hear your voice clearly, please speak louder!" : "Không nghe rõ giọng nói của bạn, vui lòng đọc to hơn!");
      setIsRecording(false);
    };
    rec.onerror = (e) => {
      console.error("Recognition error:", e);
      setIsRecording(false);
      let errorDesc = language === "en" ? "Speech not recognized. Please try again." : "Không nhận diện được giọng nói. Vui lòng thử lại.";
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        errorDesc = language === "en" ? "Microphone permission denied or blocked. Please enable it." : "Quyền truy cập micro bị từ chối hoặc bị chặn. Vui lòng mở lại micro.";
      } else if (e.error === "no-speech") {
        errorDesc = language === "en" ? "No speech detected. Please speak clearly into the microphone." : "Không nhận diện được giọng nói. Vui lòng thử lại.";
      }
      setMicPermissionError(errorDesc);
    };
    rec.onend = () => {
      setIsRecording(false);
      console.log("Recording ended");
    };
    try {
      rec.start();
    } catch (ex) {
      console.error("Failed starting speech recognition in PlacementTest:", ex);
      setIsRecording(false);
      setMicPermissionError(language === "en" ? "Speech activation failed. Please retry." : "Không nhận diện được giọng nói. Vui lòng thử lại.");
    }
  };
  const handleSelectOption = (opt) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };
  const handleTextChange = (e) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }));
  };
  const answeredCount = Object.keys(answers).length;
  const handleSubmitTest = async () => {
    if (answeredCount < 15) {
      const confirmText = language === "en" ? `You have only answered ${answeredCount} / 30 questions. Early submission may affect your placement level, are you sure you want to proceed?` : `Bạn mới trả lời ${answeredCount} / 30 câu hỏi. Nộp sớm điểm sẽ bị ảnh hưởng, bạn vẫn muốn tiếp tục nộp bài chứ?`;
      if (!window.confirm(confirmText)) {
        return;
      }
    }
    setSubmitting(true);
    setSubmittingStep(1);
    setError("");
    const stepInterval = setInterval(() => {
      setSubmittingStep((prev) => prev < 4 ? prev + 1 : prev);
    }, 350);
    try {
      const res = await api.submitPlacementTest(answers);
      clearInterval(stepInterval);
      setSubmittingStep(4);
      await new Promise((resolve) => setTimeout(resolve, 100));
      onSuccess(res.user, res.testResult);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || (language === "en" ? "Failed connecting to AI grading system. Please check connection." : "Lỗi liên hệ hệ thống chấm thi AI. Vui lòng kết nối lại."));
      setSubmitting(false);
    }
  };
  const getQuestionBadge = (skill) => {
    switch (skill) {
      case "listening":
        return "bg-sky-500/10 border-sky-500/20 text-sky-400";
      case "speaking":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "reading":
        return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
      case "writing":
        return "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };
  if (submitting) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6 font-sans relative overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 818,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 819,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "max-w-md w-full text-center space-y-8 relative z-10 font-sans", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "relative w-24 h-24 mx-auto flex items-center justify-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 rounded-full bg-indigo-500/20 animate-ping", style: { animationDuration: "3s" } }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 825,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-2 rounded-full bg-white shadow-xl shadow-indigo-500/10 flex items-center justify-center select-none border border-slate-100", children: /* @__PURE__ */ jsxDEV(CefrPathwayIcon, { size: 72 }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 827,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 826,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 border border-indigo-400/20 border-dashed rounded-full animate-spin", style: { animationDuration: "10s" } }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 830,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 824,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-1.5 text-[10px] uppercase font-black text-indigo-400 tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit mx-auto", children: [
            /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3 h-3 text-indigo-400 animate-pulse animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 835,
              columnNumber: 15
            }, this),
            " ",
            language === "en" ? "AI Grading Engine" : "Hệ thống chấm thi AI"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 834,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-extrabold text-white tracking-tight pt-1", children: language === "en" ? "EVALUATING PERFORMANCE & COMPILING ROADMAP..." : "ĐANG ĐÁNH GIÁ & TẠO LỘ TRÌNH THỰC CHIẾN..." }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 837,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 max-w-sm mx-auto leading-relaxed", children: language === "en" ? `Please keep your connection open. AI is mining your ${answeredCount} responses to define your specific CEFR levels.` : `Vui lòng giữ kết nối. Giáo vụ AI đang mổ xẻ ${answeredCount} câu làm bài để tính chuẩn mực năng lực CEFR của bạn.` }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 840,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 833,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left space-y-5 shadow-2xl relative", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl pointer-events-none" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 849,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3.5 items-start", children: [
            submittingStep > 1 ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: "✓" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 854,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-3 h-3 text-indigo-400 animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 859,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 858,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-bold ${submittingStep >= 1 ? "text-slate-100" : "text-slate-500"}`, children: language === "en" ? "1. Validate Listening & Reading inputs" : "1. So khớp lý thuyết Listening & Reading" }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 863,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500", children: language === "en" ? `Scanned ${answeredCount} objective answers against database.` : `Đã kiểm nghiệm ${answeredCount} đáp án trắc nghiệm hệ thống.` }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 866,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 862,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 852,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3.5 items-start", children: [
            submittingStep > 2 ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: "✓" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 875,
              columnNumber: 17
            }, this) : submittingStep === 2 ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-3 h-3 text-indigo-400 animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 880,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 879,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black flex items-center justify-center text-slate-500 shrink-0 mt-0.5", children: "2" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 883,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-bold ${submittingStep >= 2 ? "text-slate-100" : "text-slate-500"}`, children: language === "en" ? "2. Evaluate Speech Rhythm & Pronunciation" : "2. Thẩm định âm học ngữ điệu Speaking" }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 888,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500", children: language === "en" ? "Benchmarking voice pitch acoustics with native pronunciation patterns." : "Mã hóa accent bản xứ và phân cấp tần suất tương quan hội thoại." }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 891,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 887,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 873,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3.5 items-start", children: [
            submittingStep > 3 ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: "✓" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 900,
              columnNumber: 17
            }, this) : submittingStep === 3 ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-3 h-3 text-indigo-400 animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 905,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 904,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black flex items-center justify-center text-slate-500 shrink-0 mt-0.5", children: "3" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 908,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-bold ${submittingStep >= 3 ? "text-slate-100" : "text-slate-500"}`, children: language === "en" ? "3. Analyze Composition & Grammar" : "3. Phân tích ngữ cảnh đoạn văn Writing" }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 913,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500", children: language === "en" ? "Assessing logical cohesion and syntax complexity via Google Gemini." : "Đối chiếu tính logic, ngữ pháp chuyên sâu qua mô hình lớn Gemini." }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 916,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 912,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 898,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3.5 items-start", children: [
            submittingStep >= 4 ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5", children: "✓" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 925,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black flex items-center justify-center text-slate-500 shrink-0 mt-0.5", children: "4" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 929,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-bold ${submittingStep >= 4 ? "text-slate-100" : "text-slate-500"}`, children: language === "en" ? "4. Assemble Your Optimized Weekly Roadmap" : "4. Thiết kế lộ trình tối ưu hóa 5 ngày tiên phong" }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 934,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500", children: language === "en" ? "Customizing curriculum pacing in alignment with your commitments." : "Tinh chỉnh thời lượng học hàng ngày phù hợp cam kết cá nhân." }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 937,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 933,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 923,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 848,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 font-mono tracking-wider select-none animate-pulse", children: "GOOGLE GEMINI AI PLATFORM INTEGRATION" }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 945,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 821,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 816,
      columnNumber: 7
    }, this);
  }
  if (loadingQuestions) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center text-slate-400", children: [
      /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 animate-spin mb-3 text-indigo-500" }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 958,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-bold uppercase tracking-widest", children: language === "en" ? "Loading Assesment..." : "Đang tải bài thi..." }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 959,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 957,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 956,
      columnNumber: 7
    }, this);
  }
  if (!questions || questions.length === 0 || !currentQ) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "text-center p-6 space-y-4 max-w-sm", children: [
      /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-10 h-10 text-amber-500 mx-auto" }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 969,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-slate-800", children: "Không tìm thấy câu hỏi Placement Test" }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 970,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-slate-500", children: "Dữ liệu câu hỏi chưa được đồng bộ từ Firestore. Admin cần thực thi script Migration." }, void 0, false, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 971,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 968,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 967,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "bg-white border-b border-slate-200/80 px-6 py-4.5 flex justify-between items-center shrink-0 shadow-sm relative z-20", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsxDEV(CefrPathwayIcon, { size: 32 }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 986,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 985,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h1", { className: "text-sm font-black text-slate-800 tracking-tight uppercase leading-none block", children: language === "en" ? "PLACEMENT PRO ASSESSMENT" : "BÀI KIỂM TRA TRÌNH ĐỘ" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 989,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500 font-semibold mt-1", children: language === "en" ? "Adaptive 4-skills CEFR evaluation powered by AI" : "Đánh giá 4 kỹ năng chuẩn CEFR bằng AI thích ứng" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 992,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 988,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 984,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1e3,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-mono font-extrabold text-slate-700", children: language === "en" ? `PROGRESS: ${answeredCount} / 30 Qs` : `TIẾN ĐỘ: ${answeredCount} / 30 CÂU` }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1001,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 999,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-submit-test",
            onClick: handleSubmitTest,
            disabled: submitting,
            className: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-black tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-indigo-150 cursor-pointer disabled:opacity-50",
            children: submitting ? language === "en" ? "Grading..." : "Đang chấm..." : language === "en" ? "Submit Exam" : "Nộp bài thi"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1006,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 998,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 983,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-1 overflow-hidden min-h-0", children: [
      /* @__PURE__ */ jsxDEV("aside", { className: "w-52 bg-white border-r border-slate-200/80 overflow-y-auto p-4 flex flex-col gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2 px-1 block", children: language === "en" ? "Question Portal" : "Mục lục câu hỏi" }, void 0, false, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 1022,
          columnNumber: 11
        }, this),
        questions.map((q, idx) => {
          const isCurrent = idx === currentIdx;
          const hasAns = !!answers[q.id];
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: `sidebar-q-${idx}`,
              onClick: () => setCurrentIdx(idx),
              className: `flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${isCurrent ? "bg-indigo-600 text-white font-black shadow-md shadow-indigo-100" : hasAns ? "bg-indigo-50/60 text-indigo-800 border border-indigo-100/50 font-semibold" : "text-slate-500 hover:bg-slate-50 border border-transparent font-medium"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "shrink-0 opacity-80", children: [
                    q.skill === "listening" && /* @__PURE__ */ jsxDEV(Headphones, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1045,
                      columnNumber: 49
                    }, this),
                    q.skill === "speaking" && /* @__PURE__ */ jsxDEV(Mic, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1046,
                      columnNumber: 48
                    }, this),
                    q.skill === "reading" && /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1047,
                      columnNumber: 47
                    }, this),
                    q.skill === "writing" && /* @__PURE__ */ jsxDEV(PenTool, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1048,
                      columnNumber: 47
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1044,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: language === "en" ? `Question ${idx + 1}` : `Câu ${idx + 1}` }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1050,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1043,
                  columnNumber: 17
                }, this),
                hasAns && !isCurrent && /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1053,
                  columnNumber: 19
                }, this)
              ]
            },
            q.id,
            true,
            {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1031,
              columnNumber: 15
            },
            this
          );
        })
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 1021,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto bg-slate-50 p-8 flex flex-col", children: [
        error && /* @__PURE__ */ jsxDEV("div", { className: "mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed", children: [
          /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-5 h-5 shrink-0 text-red-500" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1064,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: language === "en" ? "AI Grading Error:" : "Lỗi xử lý AI:" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1066,
              columnNumber: 17
            }, this),
            " ",
            error
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1065,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 1063,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-slate-200/80 pb-4 mb-6 font-sans", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] font-black uppercase border px-3 py-1 rounded-full ${getQuestionBadge(currentQ.skill)}`, children: currentQ.skill }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1074,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500 font-semibold", children: language === "en" ? `Question ${currentIdx + 1} / 30` : `Câu hỏi ${currentIdx + 1} / 30` }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1077,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1073,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-[11px] text-slate-400 font-medium font-mono font-bold", children: "CEFR Benchmarked Assessment" }, void 0, false, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1082,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 1072,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col gap-6 font-sans", children: [
          currentQ.readingPassage && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-5 rounded-xl border border-slate-200 leading-relaxed text-sm text-slate-700 shadow-sm font-sans", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-extrabold uppercase text-indigo-600 block mb-2 tracking-wider font-sans", children: language === "en" ? "Reading Passage" : "Đoạn văn đọc hiểu" }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1091,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "font-sans text-[13.5px] leading-relaxed text-slate-800 tracking-wide font-medium", children: [
              '"',
              currentQ.readingPassage,
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1094,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1090,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm font-sans", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-extrabold text-slate-900 leading-relaxed font-sans", children: currentQ.questionText }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1100,
              columnNumber: 15
            }, this),
            currentQ.skill === "listening" && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xl font-sans", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500 font-semibold", children: language === "en" ? "Listening Audio Clip:" : "Phần âm thanh bài nghe:" }, void 0, false, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 1107,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    id: "btn-play-tts",
                    onClick: handlePlayAudio,
                    className: "w-12 h-12 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm",
                    children: isPlaying ? /* @__PURE__ */ jsxDEV(Pause, { className: "w-5 h-5 fill-white text-white" }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1114,
                      columnNumber: 36
                    }, this) : /* @__PURE__ */ jsxDEV(Play, { className: "w-5 h-5 fill-white text-white ml-0.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1114,
                      columnNumber: 90
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1109,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold block text-slate-800", children: isPlaying ? language === "en" ? "Streaming high-quality narration..." : "Đang phát giọng đọc bản xứ..." : language === "en" ? "Click to play text-to-speech narration" : "Click nút để Phát âm chất lượng mẫu" }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1117,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500 block font-mono", children: "Accent: US English • Speed: 0.85x" }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1122,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1116,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 1108,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1106,
              columnNumber: 17
            }, this),
            currentQ.options && currentQ.options.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-2.5 pt-2", children: currentQ.options.map((opt) => {
              const optionChar = opt.trim().substring(0, 1).toUpperCase();
              const isSelected = answers[currentQ.id] === optionChar;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  id: `opt-btn-${optionChar}`,
                  onClick: () => handleSelectOption(optionChar),
                  className: `w-full text-left p-4 rounded-xl text-xs font-medium border transition-all cursor-pointer font-sans ${isSelected ? "bg-indigo-50 border-indigo-650 text-indigo-700 ring-1 ring-indigo-505/20 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300"}`,
                  children: opt
                },
                opt,
                false,
                {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1136,
                  columnNumber: 23
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1130,
              columnNumber: 17
            }, this) : (
              /* WRITING PASSAGE INPUT */
              currentQ.skill === "writing" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 pt-2 font-sans", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl mb-3 text-xs", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-600", children: language === "en" ? "Subject/Topic Guidelines:" : "Bản dịch tiếng Việt yêu cầu hoặc gợi ý:" }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1156,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[13px] font-medium text-slate-700 mt-1 leading-relaxed", children: [
                    '"',
                    currentQ.writingPrompt,
                    '"'
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1159,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1155,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "textarea",
                  {
                    id: "text-writing-input",
                    value: answers[currentQ.id] || "",
                    onChange: handleTextChange,
                    rows: 5,
                    placeholder: language === "en" ? "Type your complete English sentences here..." : "Gõ bài làm bằng Tiếng Anh của bạn vào đây...",
                    className: "w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-transparent transition-all"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1161,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-400 text-right font-mono", children: language === "en" ? `Words written: ${(answers[currentQ.id] || "").trim().split(/\s+/).filter(Boolean).length} words` : `Số lượng từ đã viết: ${(answers[currentQ.id] || "").trim().split(/\s+/).filter(Boolean).length} từ` }, void 0, false, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1169,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 1154,
                columnNumber: 19
              }, this)
            ),
            currentQ.skill === "speaking" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 pt-2 font-sans", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs font-sans", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-650", children: language === "en" ? "Target prompt to read:" : "Văn bản mẫu cần đọc:" }, void 0, false, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1182,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "font-sans font-extrabold text-[14.5px] text-slate-900 mt-1.5 leading-relaxed tracking-wide", children: [
                  '"',
                  currentQ.speakingTarget,
                  '"'
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1183,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 1181,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center gap-4", children: [
                micPermissionError && /* @__PURE__ */ jsxDEV("div", { className: "max-w-lg w-full text-left", children: /* @__PURE__ */ jsxDEV(
                  MicPermissionInstructions,
                  {
                    errorMsg: micPermissionError,
                    onClose: () => setMicPermissionError(null),
                    language
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1189,
                    columnNumber: 25
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1188,
                  columnNumber: 23
                }, this),
                isRecording ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1 items-center h-8", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "w-1 bg-red-500 animate-bounce h-4 rounded", style: { animationDelay: "0.1s" } }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1201,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "w-1 bg-red-500 animate-bounce h-8 rounded", style: { animationDelay: "0.2s" } }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1202,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "w-1 bg-red-500 animate-bounce h-6 rounded", style: { animationDelay: "0.3s" } }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1203,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "w-1 bg-red-500 animate-bounce h-7 rounded", style: { animationDelay: "0.4s" } }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1204,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "w-1 bg-red-500 animate-bounce h-3 rounded", style: { animationDelay: "0.5s" } }, void 0, false, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1205,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1200,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-red-500 font-extrabold animate-pulse", children: language === "en" ? "MIC GATHERING VOICE ACOUSTICS..." : "MIC ĐANG GHI ÂM GIỌNG NÓI..." }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1207,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-550 max-w-xs font-semibold leading-normal", children: language === "en" ? "Please read the prompt aloud clearly. The system is capturing phonetic data." : "Hãy đọc câu phía trên to, rõ ràng và mạch lạc. Thiết bị đang chắt lọc mẫu âm học." }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1210,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1198,
                  columnNumber: 23
                }, this) : recordingSuccess ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-4 w-full", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm", children: /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-6 h-6" }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1219,
                    columnNumber: 27
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1218,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-emerald-600 font-black", children: language === "en" ? "SPEECH CAPTURED SUCCESSFULLY!" : "NẠP THU ÂM THÀNH CÔNG!" }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1221,
                    columnNumber: 25
                  }, this),
                  speakingResult && /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl p-5 border border-slate-200 text-xs space-y-4 shadow-sm text-left w-full max-w-md", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxDEV(
                        "div",
                        {
                          className: "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5",
                          style: {
                            color: speakingResult.color,
                            backgroundColor: speakingResult.backgroundColor
                          },
                          children: /* @__PURE__ */ jsxDEV("span", { children: language === "en" ? speakingResult.overallScore >= 85 ? "🟢 High Accuracy" : speakingResult.overallScore >= 60 ? "🟡 Moderate" : "🔴 Low Accuracy" : speakingResult.overallScore >= 85 ? "🟢 Đọc đúng" : speakingResult.overallScore >= 60 ? "🟡 Gần đúng" : "🔴 Đọc sai" }, void 0, false, {
                            fileName: "/app/applet/src/components/PlacementTest.tsx",
                            lineNumber: 1236,
                            columnNumber: 33
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1229,
                          columnNumber: 31
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500 text-[9px] uppercase font-black tracking-wider block", children: language === "en" ? "Pronunciation Score" : "Điểm phát âm" }, void 0, false, {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1243,
                          columnNumber: 33
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800", children: [
                          speakingResult.overallScore,
                          "%"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1246,
                          columnNumber: 33
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1242,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1228,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-[11.5px] text-slate-700 border-b border-slate-150 pb-2.5", children: [
                      /* @__PURE__ */ jsxDEV("div", { children: [
                        language === "en" ? "Target Text:" : "Từ/câu mục tiêu:",
                        " ",
                        /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-900 font-mono", children: [
                          '"',
                          currentQ.speakingTarget,
                          '"'
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1252,
                          columnNumber: 94
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1252,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { children: [
                        language === "en" ? "Recorded Speech:" : "Học viên đã đọc:",
                        " ",
                        /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-indigo-600 font-mono", children: [
                          '"',
                          speakingTextResult || "...",
                          '"'
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1253,
                          columnNumber: 98
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1253,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { children: [
                        language === "en" ? "Matching Result:" : "Kết quả:",
                        " ",
                        /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold", style: { color: speakingResult.color }, children: language === "en" ? speakingResult.overallScore >= 85 ? "🟢 Correct" : speakingResult.overallScore >= 60 ? "🟡 Almost Correct" : "🔴 Needs Practice" : speakingResult.overallScore >= 85 ? "🟢 Đọc đúng" : speakingResult.overallScore >= 60 ? "🟡 Gần đúng" : "🔴 Đọc sai" }, void 0, false, {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1254,
                          columnNumber: 90
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1254,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1251,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-wider text-slate-400 block", children: language === "en" ? "Individual Word Scoring:" : "Đánh giá chi tiết từng từ:" }, void 0, false, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1263,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2.5 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 font-mono", children: speakingResult.words.map((w, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-0.5", children: [
                        /* @__PURE__ */ jsxDEV(
                          "span",
                          {
                            className: "px-2 py-1 rounded-lg text-xs font-bold leading-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-transparent",
                            style: {
                              color: w.color,
                              backgroundColor: w.backgroundColor,
                              borderColor: w.color + "20"
                            },
                            children: w.word
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/PlacementTest.tsx",
                            lineNumber: 1269,
                            columnNumber: 37
                          },
                          this
                        ),
                        w.score > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-mono text-slate-400 font-medium", children: [
                          w.score,
                          "%"
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/PlacementTest.tsx",
                          lineNumber: 1280,
                          columnNumber: 39
                        }, this)
                      ] }, idx, true, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1268,
                        columnNumber: 35
                      }, this)) }, void 0, false, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1266,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1262,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold uppercase text-slate-300 block tracking-wide", children: language === "en" ? "AI Speech Advisor:" : "AI Nhận xét phát âm:" }, void 0, false, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1289,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-slate-650 text-xs leading-relaxed mt-1 font-semibold font-serif italic", children: [
                        '"',
                        speakingResult.feedback,
                        '"'
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1292,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/PlacementTest.tsx",
                      lineNumber: 1288,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => {
                          setSpeakingResult(null);
                          setRecordingSuccess(false);
                          setSpeakingTextResult("");
                          handleToggleRecord();
                        },
                        className: "w-full py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-black text-center cursor-pointer transition-all hover:bg-indigo-150 uppercase tracking-wide mt-2",
                        children: language === "en" ? "Reread Segment 🔄" : "Thử lại phát âm 🔄"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1295,
                        columnNumber: 29
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1226,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1217,
                  columnNumber: 23
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-650 font-extrabold", children: language === "en" ? "Read prompt then click start recording" : "Luyện đọc và nhấn ghi âm" }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1311,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 max-w-xs mb-3", children: language === "en" ? "Requires hardware browser microphone permissions." : "Ứng dụng yêu cầu cho phép microphone trên thiết bị học viên." }, void 0, false, {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1314,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1310,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    id: "btn-recording-trigger",
                    onClick: handleToggleRecord,
                    className: `px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${isRecording ? "bg-red-500 hover:bg-red-400 text-white shadow" : "bg-indigo-600 hover:bg-indigo-550 text-white shadow-sm"}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(Mic, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/applet/src/components/PlacementTest.tsx",
                        lineNumber: 1329,
                        columnNumber: 23
                      }, this),
                      isRecording ? language === "en" ? "STOP RECORDING" : "DỪNG THU ÂM" : language === "en" ? "START RECORDING (STT)" : "BẮT ĐẦU GHI ÂM (STT)"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/PlacementTest.tsx",
                    lineNumber: 1320,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PlacementTest.tsx",
                lineNumber: 1186,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1180,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PlacementTest.tsx",
            lineNumber: 1099,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 1087,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("footer", { className: "mt-8 pt-6 border-t border-slate-200 flex justify-between gap-4 shrink-0 font-sans", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "btn-test-prev",
              type: "button",
              onClick: () => setCurrentIdx((prev) => Math.max(0, prev - 1)),
              disabled: currentIdx === 0,
              className: "flex items-center gap-2 px-4 py-2.5 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-all disabled:opacity-40 cursor-pointer bg-white border border-slate-200",
              children: [
                /* @__PURE__ */ jsxDEV(ChevronLeft, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1349,
                  columnNumber: 15
                }, this),
                " ",
                language === "en" ? "BACK" : "QUAY LẠI"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1342,
              columnNumber: 13
            },
            this
          ),
          currentIdx < questions.length - 1 ? /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "btn-test-next",
              type: "button",
              onClick: () => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1)),
              className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer",
              children: [
                language === "en" ? "NEXT QUESTION" : "CÂU TIẾP THEO",
                " ",
                /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/components/PlacementTest.tsx",
                  lineNumber: 1359,
                  columnNumber: 73
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1353,
              columnNumber: 15
            },
            this
          ) : /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "btn-test-last-submit",
              onClick: handleSubmitTest,
              disabled: submitting,
              className: "flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm animate-pulse",
              children: submitting ? language === "en" ? "GRADING EXAM..." : "ĐANG CHẤM THI..." : language === "en" ? "SUBMIT ASSESSMENT" : "ẤN NỘP BÀI THI KHOA HỌC"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PlacementTest.tsx",
              lineNumber: 1362,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PlacementTest.tsx",
          lineNumber: 1341,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PlacementTest.tsx",
        lineNumber: 1061,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PlacementTest.tsx",
      lineNumber: 1018,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/PlacementTest.tsx",
    lineNumber: 980,
    columnNumber: 5
  }, this);
}
