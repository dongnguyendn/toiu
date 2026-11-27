import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const Fragment = __custom_vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { useAuth } from "/src/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Sparkles, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Bot, Map, Trophy, Check, GraduationCap } from "lucide-react";
export default function Login() {
  const { user, login, adminLogin, register } = useAuth();
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("student");
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentRemember, setStudentRemember] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminRemember, setAdminRemember] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatOffset((prev) => prev === 0 ? 1 : 0);
    }, 2e3);
    return () => clearInterval(interval);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (activeType === "admin") {
      if (!adminUsername || !adminPassword) {
        setError("Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu Admin!");
        return;
      }
      setLoading(true);
      try {
        await adminLogin(adminUsername, adminPassword);
        setInfo("Đăng nhập hệ thống quản trị thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/dashboard"), 800);
      } catch (err) {
        setError(err.message || "Tên đăng nhập hoặc mật khẩu quản trị không chính xác.");
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu đăng nhập!");
      return;
    }
    if (!isLogin) {
      if (!fullName) {
        setError("Vui lòng nhập Họ và tên để tiếp tục đăng ký!");
        return;
      }
      if (!username) {
        setError("Vui lòng nhập Username để tiếp tục đăng ký!");
        return;
      }
      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không trùng khớp!");
        return;
      }
      if (password.length < 3) {
        setError("Mật khẩu bảo mật phải chứa ít nhất 3 ký tự!");
        return;
      }
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        setInfo("Đăng nhập học viên thành công! Đang vào lớp học...");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        await register(fullName, email, password, username);
        setInfo("Đăng ký thành công! Đang tiến hành tự động đăng nhập...");
        setTimeout(async () => {
          try {
            await login(email, password);
            navigate("/dashboard");
          } catch (err) {
            setError(err.message || "Đăng nhập tự động thất bại. Vui lòng thử đăng nhập thủ công.");
            setIsLogin(true);
          }
        }, 1e3);
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi kết nối hệ thống trong quá trình xác thực.");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = () => {
    setInfo("Hệ thống Offline-First: Vui lòng liên hệ Admin hệ thống (Username: quanli) để thiết lập hoặc khôi phục mật khẩu học viên!");
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 lg:p-8 font-sans", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-[1200px] min-h-[680px] bg-white rounded-[24px] lg:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden relative", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "relative w-full lg:w-[55%] xl:w-[60%] bg-gradient-to-br from-[#2563EB] to-[#06B6D4] p-8 lg:p-14 flex flex-col justify-between overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-32 -right-32 w-96 h-96 rounded-full border-[40px] border-white/5 pointer-events-none" }, void 0, false, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 137,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-[20%] -left-32 w-80 h-80 bg-white/10 blur-[80px] rounded-full pointer-events-none" }, void 0, false, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 138,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute -bottom-20 -right-10 w-96 h-96 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none" }, void 0, false, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 139,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 flex items-center gap-3 text-white", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-[14px] flex items-center justify-center shadow-2xl", children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-6 h-6 text-cyan-200" }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 144,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 143,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-black text-xl tracking-tight leading-none", children: "Smart AI" }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 147,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-bold tracking-widest text-cyan-200 mt-1", children: "Learning Platform" }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 148,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 146,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 142,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 my-12 lg:my-0 text-left", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6", children: [
          "Rèn luyện tiếng Anh ",
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 155,
            columnNumber: 35
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white", children: "thông minh cùng AI" }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 154,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-blue-100 text-lg font-medium max-w-md leading-relaxed", children: "Khám phá lộ trình học tập cá nhân hóa chuẩn CEFR, kết hợp công nghệ AI đưa trải nghiệm của bạn lên tầm cao mới." }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 160,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-12 space-y-4 max-w-md", children: [
          { icon: /* @__PURE__ */ jsxDEV(Bot, { className: "w-5 h-5 text-cyan-200" }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 167,
            columnNumber: 25
          }, this), title: "Giáo viên Trợ lý AI", desc: "Hỗ trợ chấm chữa và giải đáp 24/7" },
          { icon: /* @__PURE__ */ jsxDEV(Map, { className: "w-5 h-5 text-purple-200" }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 168,
            columnNumber: 25
          }, this), title: "Lộ trình học tập cá nhân hóa", desc: "Tối ưu hóa theo năng lực thực tế" },
          { icon: /* @__PURE__ */ jsxDEV(Trophy, { className: "w-5 h-5 text-amber-200" }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 169,
            columnNumber: 25
          }, this), title: "Theo dõi tiến độ & Bảng xếp hạng", desc: "Kích thích cảm hứng học tập mỗi ngày" }
        ].map((feature, idx) => /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg transition-transform duration-500 hover:-translate-y-1 hover:bg-white/10",
            style: { transform: floatOffset === 1 ? "translateY(-2px)" : "translateY(2px)", transitionDelay: `${idx * 100}ms` },
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-white/10 rounded-xl shadow-inner", children: feature.icon }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 176,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-white text-base mb-0.5", children: feature.title }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 180,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-blue-100/80 text-xs font-medium", children: feature.desc }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 181,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 179,
                columnNumber: 19
              }, this)
            ]
          },
          idx,
          true,
          {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 171,
            columnNumber: 17
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 165,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 153,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "relative z-10 text-white/50 text-[10px] font-medium uppercase tracking-widest mt-8 lg:mt-0 text-left", children: "© 2026 Smart AI Learning System" }, void 0, false, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 189,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/Login.tsx",
      lineNumber: 135,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "w-full lg:w-[45%] xl:w-[40%] bg-white p-6 lg:p-12 flex flex-col justify-center relative z-20", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex bg-slate-100 p-1 rounded-2xl mb-10 w-full sm:w-fit mx-auto lg:mx-0 shadow-inner", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setActiveType("student");
              setError("");
              setInfo("");
            },
            className: `flex-1 sm:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide rounded-xl transition-all duration-300 ${activeType === "student" ? "bg-white text-[#0F172A] shadow-md border border-slate-200/50 cursor-pointer" : "text-slate-500 hover:text-slate-800 cursor-pointer"}`,
            children: "Học viên"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 199,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setActiveType("admin");
              setError("");
              setInfo("");
            },
            className: `flex-1 sm:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide rounded-xl transition-all duration-300 ${activeType === "admin" ? "bg-white text-[#0F172A] shadow-md border border-slate-200/50 cursor-pointer" : "text-slate-500 hover:text-slate-800 cursor-pointer"}`,
            children: "Quản trị viên"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 209,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 198,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "mb-8 text-left", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-3xl font-black text-[#0F172A] tracking-tight mb-2", children: "Đăng nhập hệ thống" }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 222,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-sm font-medium", children: activeType === "student" ? isLogin ? "Chào mừng bạn quay lại hệ thống học tập." : "Tạo tài khoản mới để bắt đầu hành trình." : "Truy cập không gian quản lý vận hành nền tảng." }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 223,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 221,
        columnNumber: 11
      }, this),
      error && /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50 text-rose-600 text-sm p-4 rounded-xl mb-6 flex items-start gap-3 border border-rose-100 shadow-sm w-full text-left", children: [
        /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-5 h-5 shrink-0 mt-0.5 text-rose-500" }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 233,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "font-semibold leading-relaxed relative top-0.5", children: error }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 234,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 232,
        columnNumber: 13
      }, this),
      info && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-600 text-sm p-4 rounded-xl mb-6 flex items-start gap-3 border border-emerald-100 shadow-sm w-full text-left", children: [
        /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-5 h-5 shrink-0 mt-0.5 text-emerald-500" }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 239,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "font-semibold leading-relaxed relative top-0.5", children: info }, void 0, false, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 240,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 238,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-5 text-left", children: activeType === "student" ? (
        // STUDENT FORM
        /* @__PURE__ */ jsxDEV(Fragment, { children: [
          !isLogin && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 mt-0", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Họ và Tên" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 252,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(UserIcon, { className: "w-4.5 h-4.5" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 254,
                  columnNumber: 151
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 254,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    required: true,
                    placeholder: "Nguyễn Văn A",
                    value: fullName,
                    onChange: (e) => setFullName(e.target.value),
                    className: "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/Login.tsx",
                    lineNumber: 255,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 253,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 251,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 mt-0", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Tên đăng nhập" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 260,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(GraduationCap, { className: "w-4.5 h-4.5" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 262,
                  columnNumber: 151
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 262,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    required: true,
                    placeholder: "nguyenvana",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    className: "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/Login.tsx",
                    lineNumber: 263,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 261,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 259,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 250,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Địa chỉ Email" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 271,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(Mail, { className: "w-4.5 h-4.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 273,
                columnNumber: 147
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 273,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "email",
                  required: true,
                  placeholder: "example@gmail.com",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  className: "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 274,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 272,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 270,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Mật khẩu" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 280,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(Lock, { className: "w-4.5 h-4.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 282,
                columnNumber: 147
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 282,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: showStudentPassword ? "text" : "password",
                  required: true,
                  placeholder: "••••••••",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  className: "w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white tracking-widest"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 283,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setShowStudentPassword(!showStudentPassword),
                  className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer",
                  children: showStudentPassword ? /* @__PURE__ */ jsxDEV(EyeOff, { className: "w-4.5 h-4.5" }, void 0, false, {
                    fileName: "/app/applet/src/pages/Login.tsx",
                    lineNumber: 287,
                    columnNumber: 46
                  }, this) : /* @__PURE__ */ jsxDEV(Eye, { className: "w-4.5 h-4.5" }, void 0, false, {
                    fileName: "/app/applet/src/pages/Login.tsx",
                    lineNumber: 287,
                    columnNumber: 83
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 285,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 281,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 279,
            columnNumber: 17
          }, this),
          !isLogin && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Xác nhận mật khẩu" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 294,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(Lock, { className: "w-4.5 h-4.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 296,
                columnNumber: 149
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 296,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "password",
                  required: true,
                  placeholder: "••••••••",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  className: "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white tracking-widest"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 297,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 295,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 293,
            columnNumber: 19
          }, this),
          isLogin && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between pt-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2.5 cursor-pointer group select-none", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative flex items-center justify-center w-5 h-5 rounded-[6px] border-[1.5px] border-slate-300 group-hover:border-[#2563EB] transition-colors", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "checkbox", className: "peer sr-only", checked: studentRemember, onChange: (e) => setStudentRemember(e.target.checked) }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 307,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-[#2563EB] rounded-[4.5px] opacity-0 peer-checked:opacity-100 absolute transition-opacity duration-200" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 308,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5 text-white absolute z-10 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 stroke-[3px]" }, void 0, false, {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 309,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 306,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors", children: "Ghi nhớ đăng nhập" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 311,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 305,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: handleForgotPassword, className: "text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer", children: "Quên mật khẩu?" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 313,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 304,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full h-12 mt-6 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-[15px] tracking-wide rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer",
              children: loading ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 322,
                columnNumber: 21
              }, this) : isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 319,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-8 text-center text-sm font-medium text-slate-500", children: [
            isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?",
            /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => {
              setIsLogin(!isLogin);
              setError("");
              setInfo("");
            }, className: "ml-1.5 text-[#2563EB] font-bold hover:underline transition-all cursor-pointer", children: isLogin ? "Đăng ký ngay" : "Đăng nhập ngay" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 330,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 328,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 248,
          columnNumber: 15
        }, this)
      ) : (
        // ADMIN FORM
        /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Tên đăng nhập Admin" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 339,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(UserIcon, { className: "w-4.5 h-4.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 341,
                columnNumber: 147
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 341,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "quanli",
                  value: adminUsername,
                  onChange: (e) => setAdminUsername(e.target.value),
                  className: "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 342,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 340,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 338,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700 uppercase tracking-wide", children: "Mật khẩu" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 348,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors", children: /* @__PURE__ */ jsxDEV(Lock, { className: "w-4.5 h-4.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 350,
                columnNumber: 147
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 350,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: showAdminPassword ? "text" : "password",
                  required: true,
                  placeholder: "••••••••",
                  value: adminPassword,
                  onChange: (e) => setAdminPassword(e.target.value),
                  className: "w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 font-semibold shadow-sm bg-slate-50 focus:bg-white tracking-widest"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 351,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdminPassword(!showAdminPassword),
                  className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer",
                  children: showAdminPassword ? /* @__PURE__ */ jsxDEV(EyeOff, { className: "w-4.5 h-4.5" }, void 0, false, {
                    fileName: "/app/applet/src/pages/Login.tsx",
                    lineNumber: 355,
                    columnNumber: 44
                  }, this) : /* @__PURE__ */ jsxDEV(Eye, { className: "w-4.5 h-4.5" }, void 0, false, {
                    fileName: "/app/applet/src/pages/Login.tsx",
                    lineNumber: 355,
                    columnNumber: 81
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/Login.tsx",
                  lineNumber: 353,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 349,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 347,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between pt-2", children: /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-2.5 cursor-pointer group select-none", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "relative flex items-center justify-center w-5 h-5 rounded-[6px] border-[1.5px] border-slate-300 group-hover:border-[#2563EB] transition-colors", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "checkbox", className: "peer sr-only", checked: adminRemember, onChange: (e) => setAdminRemember(e.target.checked) }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 363,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-[#2563EB] rounded-[4.5px] opacity-0 peer-checked:opacity-100 absolute transition-opacity duration-200" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 364,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(Check, { className: "w-3.5 h-3.5 text-white absolute z-10 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 stroke-[3px]" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 365,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 362,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors", children: "Ghi nhớ đăng nhập" }, void 0, false, {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 367,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 361,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/pages/Login.tsx",
            lineNumber: 360,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full h-12 mt-6 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-[15px] tracking-wide rounded-xl shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer",
              children: loading ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }, void 0, false, {
                fileName: "/app/applet/src/pages/Login.tsx",
                lineNumber: 374,
                columnNumber: 21
              }, this) : "Đăng Nhập Quản Trị"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/Login.tsx",
              lineNumber: 371,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/Login.tsx",
          lineNumber: 337,
          columnNumber: 15
        }, this)
      ) }, void 0, false, {
        fileName: "/app/applet/src/pages/Login.tsx",
        lineNumber: 245,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/Login.tsx",
      lineNumber: 195,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/Login.tsx",
    lineNumber: 132,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/pages/Login.tsx",
    lineNumber: 131,
    columnNumber: 5
  }, this);
}
