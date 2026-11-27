import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const createContext = __custom_vite__cjsImport1_react["createContext"]; const useContext = __custom_vite__cjsImport1_react["useContext"]; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const checkUserSession = async () => {
    try {
      const activeUser = await api.getMe();
      if (activeUser) {
        setUser(activeUser);
        if (activeUser.status === "completed" || activeUser.placementTestScore !== void 0 && activeUser.placementTestScore > 0) {
          try {
            const actualTestResult = await api.getPlacementTest();
            if (actualTestResult) {
              setTestResult(actualTestResult);
            } else {
              setTestResult({
                score: activeUser.placementTestScore || 70,
                level: activeUser.level || "A2",
                strengths: "Có sự nhạy bén nhất định trong Đọc hiểu và Từ vựng lý thuyết.",
                weaknesses: "Phát âm nói và phản xạ câu chủ động cần rèn luyện nhiều hơn.",
                proposedRoadmap: {
                  duration: activeUser.minutesPerDay === 15 ? 30 : 60,
                  goals: [
                    "Nâng cao lượng từ vựng học thuật tối thiểu 300 từ mới",
                    "Chữa lỗi phát âm nuốt âm chuẩn xác bằng AI",
                    "Phát triển kỹ năng biên dịch câu ngắn mạch lạc"
                  ],
                  grid: [
                    { day: 1, topic: "Luyện phát âm câu giao tiếp phổ thông", skill: "speaking", duration: activeUser.minutesPerDay || 30 },
                    { day: 2, topic: "Nghe hiểu hội thoại khách sạn", skill: "listening", duration: activeUser.minutesPerDay || 30 },
                    { day: 3, topic: "Đọc hiểu cấu tạo từ phức đơn", skill: "reading", duration: activeUser.minutesPerDay || 30 },
                    { day: 4, topic: "Dịch viết câu luận văn thương mại", skill: "writing", duration: activeUser.minutesPerDay || 30 },
                    { day: 5, topic: "Tự tổng ôn tập kiến thức giao thoa", skill: "reading", duration: activeUser.minutesPerDay || 30 }
                  ]
                },
                detailedAnalysis: "Học tập kiên trì tối thiểu 30 phút mỗi ngày đóng góp tác động trực tiếp vào liên hợp thần kinh. Trực quan hóa tiến trình biểu đồ Radar giúp bạn thấu hiểu điểm mờ kỹ năng nhanh chóng."
              });
            }
          } catch (err) {
            console.error("Retrieve placement test report failed:", err);
          }
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Session fetch failed:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkUserSession();
  }, []);
  const handleLogin = async (email, pass) => {
    const res = await api.login(email, pass);
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem("learning_app_userId", res.user.id);
      await checkUserSession();
    }
    return res.user;
  };
  const handleAdminLogin = async (username, pass) => {
    const res = await api.adminLogin(username, pass);
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem("learning_app_userId", res.user.id);
      sessionStorage.setItem("admin_authenticated_session", "true");
      await checkUserSession();
    }
    return res.user;
  };
  const handleRegister = async (fullName, email, pass, username) => {
    const regRes = await api.register(fullName, email, pass, username);
    return regRes.user;
  };
  const handleLogout = () => {
    api.logout();
    localStorage.removeItem("learning_app_userId");
    sessionStorage.removeItem("admin_authenticated_session");
    setUser(null);
    setTestResult(null);
    setShowRoadmap(false);
  };
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };
  return /* @__PURE__ */ jsxDEV(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        testResult,
        setTestResult,
        showRoadmap,
        setShowRoadmap,
        login: handleLogin,
        adminLogin: handleAdminLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser,
        checkUserSession
      },
      children
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/context/AuthContext.tsx",
      lineNumber: 127,
      columnNumber: 5
    },
    this
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
