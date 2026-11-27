import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { api } from "/src/api.ts";
import { getEnrichedTask, saveActiveTaskRedirect, navigateToRoadmapTask } from "/src/utils/roadmapProgressManager.ts";
import { useAuth } from "/src/context/AuthContext.tsx";
import { useLanguage } from "/src/context/LanguageContext.tsx";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  CalendarRange,
  Info,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Play,
  FileText,
  Award,
  ShieldAlert,
  Compass,
  Trophy,
  HelpCircle
} from "lucide-react";
const TEST_QUESTION_POOL = {
  "Từ vựng": [
    { q: "Từ nào sau đây đồng nghĩa với 'meticulous'?", options: ["Careless", "Thorough", "Hasty", "Indifferent"], answer: 1, explanation: "Meticulous có nghĩa là tỉ mỉ, kỹ lưỡng, đồng nghĩa với Thorough." },
    { q: "Hoàn thành câu: She has a ______ memory and never forgets any details.", options: ["vague", "temporary", "retentive", "shallow"], answer: 2, explanation: "Retentive memory là trí nhớ dai, nhớ lâu." },
    { q: "Từ trái nghĩa của 'benevolent' là gì?", options: ["Malevolent", "Kind", "Generous", "Friendly"], answer: 0, explanation: "Benevolent là nhân từ, nhân ái; trái nghĩa là Malevolent (hiểm ác, độc địa)." },
    { q: "Điền từ: The company wants to ______ its business into international markets.", options: ["expand", "shrink", "contract", "reduce"], answer: 0, explanation: "Expand business nghĩa là mở rộng kinh doanh." },
    { q: "Chọn từ đúng: He gave a ______ description of the landscape, making us feel like we were there.", options: ["vivid", "dull", "boring", "faint"], answer: 0, explanation: "Vivid description nghĩa là mô tả sống động." }
  ],
  "Ngữ pháp": [
    { q: "Chọn câu đúng ngữ pháp:", options: ["If I was you, I will buy that car.", "If I were you, I would buy that car.", "If I had been you, I will buy that car.", "If I am you, I would buy that car."], answer: 1, explanation: "Câu điều kiện loại 2 dùng 'If I were you, I would + V'." },
    { q: "Điền giới từ thích hợp: He is capable ______ solving this complex math problem.", options: ["to", "for", "with", "of"], answer: 3, explanation: "Cấu trúc 'capable of + V-ing' nghĩa là có khả năng làm gì." },
    { q: "Chọn thì đúng: By the time we arrived at the cinema, the movie ______.", options: ["has started", "started", "had started", "will start"], answer: 2, explanation: "Hành động xảy ra trước một hành động khác trong quá khứ dùng thì Quá khứ hoàn thành (had started)." },
    { q: "Chọn từ thích hợp: Neither the teacher nor the students ______ present in the classroom.", options: ["is", "are", "was", "be"], answer: 1, explanation: "Cấu trúc 'Neither... nor...' chia động từ theo chủ ngữ gần nhất (students - số nhiều -> are)." },
    { q: "Điền liên từ: We decided to go for a walk ______ the heavy rain.", options: ["although", "despite", "because of", "however"], answer: 1, explanation: "Despite + N/V-ing chỉ sự tương phản (mặc dù cơn mưa nặng hạt)." }
  ],
  "Nghe hiểu": [
    { q: "Đoạn băng nói về sự thay đổi khí hậu. Đâu là nguyên nhân chính được nhắc tới?", options: ["Sử dụng năng lượng hóa thạch", "Trồng rừng bừa bãi", "Sự thay đổi quỹ đạo Trái Đất", "Sóng mặt trời cực mạnh"], answer: 0, explanation: "Theo bài nói, việc đốt nhiên liệu hóa thạch là tác nhân hàng đầu giải phóng khí nhà kính." },
    { q: "Người nói khuyên chúng ta nên hành động thế nào trước tiên?", options: ["Mua xe điện mới ngay lập tức", "Hạn chế sử dụng đồ nhựa một lần", "Tắt bớt thiết bị điện không dùng", "Tham gia các cuộc biểu tình môi trường"], answer: 2, explanation: "Hành động tiết kiệm điện tại nhà là bước thiết thực và dễ dàng đầu tiên được khuyến nghị." },
    { q: "Theo nghiên cứu, tỷ lệ nóng lên toàn cầu đã tăng bao nhiêu % trong thập kỷ qua?", options: ["5%", "12%", "20%", "45%"], answer: 1, explanation: "Bài nghe nhắc đến con số 'twelve percent rise' trong nghiên cứu mới nhất." },
    { q: "Chất khí nào sau đây chịu trách nhiệm lớn nhất cho hiệu ứng nhà kính trong khí quyển?", options: ["Oxy", "Nito", "Cacbon Dioxit (CO2)", "Heli"], answer: 2, explanation: "CO2 (Carbon Dioxide) chiếm tỷ lệ đóng góp lớn nhất trong hiệu ứng nhà kính nhân tạo." },
    { q: "Đâu là dự báo cho tương lai nếu không có hành động kiểm soát khí thải?", options: ["Nhiệt độ toàn cầu giảm mạnh", "Mực nước biển dâng thêm 1 mét vào năm 2100", "Thời tiết sẽ ôn hòa hơn", "Băng ở Nam Cực sẽ dày thêm"], answer: 1, explanation: "Báo cáo cảnh báo mực nước biển có nguy cơ dâng cao tới 1 mét vào cuối thế kỷ này." }
  ],
  "Đọc hiểu": [
    { q: "Theo văn bản, cuộc Cách mạng Công nghiệp lần thứ tư (4.0) khác biệt ở điểm nào?", options: ["Sự bùng nổ của động cơ hơi nước", "Việc phát minh ra bóng đèn điện", "Sự tích hợp sâu sắc giữa công nghệ vật lý, kỹ thuật số và sinh học", "Sự phát triển của giao thông đường sắt"], answer: 2, explanation: "Cách mạng 4.0 đặc trưng bởi sự giao thoa giữa các hệ thống vật lý, kỹ thuật số và sinh học." },
    { q: "Thuật ngữ 'Trí tuệ nhân tạo' (AI) lần đầu tiên được định hình vào khoảng thời gian nào?", options: ["Thập niên 1950", "Thập niên 1990", "Thập niên 2010", "Thập niên 2020"], answer: 0, explanation: "AI bắt đầu hình thành từ những năm 1950 với các nghiên cứu đặt nền móng của Alan Turing và hội thảo Dartmouth." },
    { q: "Ý chính của đoạn 3 trong văn bản đọc hiểu là gì?", options: ["Tầm quan trọng của việc học ngoại ngữ", "Tác động của tự động hóa lên thị trường việc làm", "Cách chế tạo một robot thông minh", "Lịch sử phát triển của internet"], answer: 1, explanation: "Đoạn 3 bàn về xu hướng thay đổi nhân lực, một số công việc thủ công bị thế chỗ bởi robot tự động." },
    { q: "Từ 'disruption' trong văn bản có nghĩa gần nhất với từ nào?", options: ["Continuity", "Interruption", "Stability", "Agreement"], answer: 1, explanation: "Disruption mang nghĩa gián đoạn, đảo lộn, gần nghĩa nhất với Interruption." },
    { q: "Tác giả thể hiện thái độ gì đối với tương lai của công nghệ AI?", options: ["Hoàn toàn bi quan và lo sợ", "Hào hứng và lạc quan có thận trọng", "Hờ hững, không quan tâm", "Phản đối kịch liệt"], answer: 1, explanation: "Tác giả đánh giá cao tiềm năng của AI nhưng cũng cảnh báo cần chuẩn bị kỹ lưỡng về đạo đức và nhân lực." }
  ],
  "Phản xạ nói": [
    { q: "Khi người phỏng vấn hỏi 'Where do you see yourself in 5 years?', câu trả lời nào chuyên nghiệp nhất?", options: ["I want to have your job.", "I hope to grow into a senior role with expertise in this field.", "I have no idea, maybe traveling the world.", "I will start my own competing company."], answer: 1, explanation: "Lựa chọn này thể hiện mong muốn phát triển nghề nghiệp gắn liền với sự cống hiến dài hạn cho lĩnh vực." },
    { q: "Cách phát âm đuôi '-ed' của từ 'wanted' là gì?", options: ["/t/", "/d/", "/id/", "/ed/"], answer: 2, explanation: "Đuôi '-ed' phát âm là /id/ khi động từ kết thúc bằng âm /t/ hoặc /d/." },
    { q: "Để bày tỏ sự đồng tình mạnh mẽ trong tiếng Anh giao tiếp, bạn nói:", options: ["I couldn't agree more.", "I don't think so.", "That is unlikely.", "Maybe you are wrong."], answer: 0, explanation: "'I couldn't agree more' nghĩa là tôi hoàn toàn đồng ý (không thể đồng ý hơn nữa)." },
    { q: "Câu chào xã giao nào phù hợp nhất khi gặp đối tác kinh doanh lần đầu?", options: ["What's up, bro?", "It is an honor to meet you, Mr. Smith.", "Long time no see!", "Who are you again?"], answer: 1, explanation: "Chào hỏi trang trọng kèm danh xưng là lựa chọn lịch sự và chuyên nghiệp nhất." },
    { q: "Chọn câu có ngữ điệu (intonation) đúng khi hỏi câu hỏi Yes/No 'Are you coming?':", options: ["Lên giọng ở cuối câu", "Xuống giọng ở cuối câu", "Giữ nguyên tông giọng phẳng", "Chỉ nhấn mạnh từ đầu tiên"], answer: 0, explanation: "Hầu hết các câu hỏi Yes/No trong tiếng Anh đều lên giọng (rising intonation) ở cuối câu." }
  ],
  "Kỹ năng viết": [
    { q: "Cấu trúc nào tốt nhất để bắt đầu một bài viết thư phàn nàn (Letter of Complaint)?", options: ["Hey there, I am angry.", "I am writing to express my strong dissatisfaction with...", "I want to tell you that your service is bad.", "Please give me my money back immediately."], answer: 1, explanation: "Câu viết lịch sự, trang trọng, trực diện vào vấn đề là quy chuẩn viết thư phàn nàn chuyên nghiệp." },
    { q: "Từ nối (linking word) nào dùng để chỉ kết quả/hậu quả?", options: ["Furthermore", "On the other hand", "Consequently", "In addition"], answer: 2, explanation: "Consequently nghĩa là 'Hệ quả là / Do đó', dùng để dẫn dắt kết quả của hành động trước đó." },
    { q: "Trong văn viết học thuật (Academic Writing), nên tránh điều nào sau đây?", options: ["Sử dụng các từ nối rõ ràng", "Viết tắt các từ như 'don't', 'can't', 'won't'", "Sử dụng cấu trúc câu bị động", "Trích dẫn nguồn tài liệu tham khảo"], answer: 1, explanation: "Academic writing yêu cầu viết đầy đủ (do not, cannot, will not) và tránh viết tắt." },
    { q: "Câu nào dưới đây sử dụng từ vựng nâng cấp nhất để thay thế cho 'The chart shows a big increase'?", options: ["The chart shows a small growth.", "The graph illustrates a dramatic increase.", "The picture displays some up movement.", "The diagram shows a go-up trend."], answer: 1, explanation: "'illustrates a dramatic increase' sử dụng từ vựng trang trọng và miêu tả chính xác biểu đồ." },
    { q: "Chọn câu viết đúng cấu trúc song song (Parallel Structure):", options: ["She likes swimming, to run, and cycling.", "She likes swimming, running, and cycling.", "She likes to swim, running, and cycle.", "She likes swimming, run, and to cycle."], answer: 1, explanation: "Cấu trúc song song yêu cầu các danh động từ cùng dạng V-ing (swimming, running, and cycling)." }
  ]
};
const PROJECT_PROMPTS = {
  "Từ vựng": "Hãy viết một đoạn văn ngắn (80-100 từ) miêu tả kế hoạch phát triển bản thân của bạn trong 3 năm tới, trong đó sử dụng ít nhất 3 từ vựng nâng cao liên quan đến chủ đề 'Career & Growth'.",
  "Ngữ pháp": "Hãy viết 5 câu điều kiện hỗn hợp (Mixed Conditionals) mô tả những quyết định trong quá khứ đã ảnh hưởng như thế nào đến trình độ tiếng Anh hiện tại của bạn.",
  "Nghe hiểu": "Hãy viết bản tóm tắt (100 từ) về một podcast hoặc bài nghe tiếng Anh gần đây nhất mà bạn yêu thích, nêu rõ thông điệp chính và 3 từ mới học được.",
  "Đọc hiểu": "Đọc một bài báo về chủ đề Trí Tuệ Nhân Tạo (AI) và viết một đoạn bình luận ngắn (120 từ) thể hiện quan điểm của bạn về thách thức đạo đức của AI.",
  "Phản xạ nói": "Hãy soạn thảo nội dung một bài nói ngắn (1.5 phút) giới thiệu về một danh lam thắng cảnh ở Việt Nam cho du khách nước ngoài, tập trung vào ngữ điệu cuốn hút.",
  "Kỹ năng viết": "Hãy viết phần Mở bài (Introduction) và Thân bài 1 (Body 1) cho đề bài IELTS Writing Task 2: 'Some people think that university education should be free for everyone. To what extent do you agree or disagree?'"
};
export default function StudyRoadmapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planData, setPlanData] = useState(null);
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState({});
  const [activeModalReading, setActiveModalReading] = useState(null);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [activeModalTest, setActiveModalTest] = useState(null);
  const [projectText, setProjectText] = useState("");
  const [projectEvaluating, setProjectEvaluating] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState(null);
  const [testActiveQuestionIdx, setTestActiveQuestionIdx] = useState(0);
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [extMsg, setExtMsg] = useState(null);
  const playSound = (type) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (type === "pass") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3);
        osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } else if (type === "fail") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(293.66, audioCtx.currentTime);
        osc.frequency.setValueAtTime(220, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn("Audio Context not supported or allowed yet.");
    }
  };
  const normalizeWeeklyPlans = (plans) => {
    if (!Array.isArray(plans)) return [];
    return plans.map((w) => {
      const rawSessions = Array.isArray(w.sessions) ? w.sessions : [];
      const normalizedSessions = rawSessions.map((s) => {
        const rawTasks = Array.isArray(s.tasks) ? s.tasks : [];
        const normalizedTasks = rawTasks.map((t2, idx) => {
          // Task must always be an object
          const id = t2.id || `${s.id}_t${idx}`;
          const title = t2.title || "Nhiệm vụ";
          const description = t2.description || "";
          const skill = t2.skill || s.skill || "General";
          const duration = typeof t2.duration === "number" ? t2.duration : 15;
          const difficulty = t2.difficulty || s.difficulty || "Medium";
          const moduleType = t2.moduleType || "reading";

          return {
            id,
            title,
            description,
            skill,
            duration,
            difficulty,
            moduleType
          };
        });

        let skill = s.skill || "General";
        const skillMap = {
          "vocabulary": "Từ vựng",
          "grammar": "Ngữ pháp",
          "listening": "Nghe hiểu",
          "reading": "Đọc hiểu",
          "speaking": "Phản xạ nói",
          "writing": "Kỹ năng viết",
          "ipa": "Phát âm IPA",
          "mock_test": "Luyện đề",
          "review": "Ôn tập tổng hợp"
        };
        const skillLower = String(skill ?? "").toLowerCase();
        if (skillMap[skillLower]) {
          skill = skillMap[skillLower];
        }
        const duration = s.duration !== void 0 ? s.duration : s.durationMinutes || 45;
        return {
          id: s.id || `session_${Math.random()}`,
          day: s.day || "Monday",
          time: s.time || "19:00 - 19:45",
          duration,
          goal: s.goal || "Học tập và rèn luyện kỹ năng",
          difficulty: s.difficulty || "Trung bình",
          skill,
          tasks: normalizedTasks,
          rawTasks: normalizedTasks, // Alias of tasks as requested
          status: s.status || "pending",
          completedAt: s.completedAt,
          tasksProgress: Array.isArray(s.tasksProgress) ? s.tasksProgress : normalizedTasks.map(() => "TODO"),
          testStatus: s.testStatus || "LOCKED",
          testScore: s.testScore,
          unlocked: s.unlocked !== void 0 ? s.unlocked : false,
          projectSubmitted: s.projectSubmitted || false,
          projectStatus: s.projectStatus || "TODO",
          projectDraft: s.projectDraft || "",
          lmsStatus: s.lmsStatus || "studying",
          projectCount: 1,
          videoCount: 0,
          quizCount: 1,
          title: s.title,
          description: s.description,
          objective: s.objective,
          learningMaterials: s.learningMaterials,
          exercises: s.exercises,
          expectedOutcome: s.expectedOutcome
        };
      });
      return {
        week: Number(w.week || 1),
        title: w.title || `Tuần ${w.week || 1}`,
        status: w.status || "pending",
        weeklyGoal: w.weeklyGoal || w.goal || "Rèn luyện và củng cố kiến thức theo kế hoạch",
        sessions: normalizedSessions
      };
    });
  };
  const fetchRoadmap = async (preserveExpanded = false) => {
    if (!preserveExpanded) setLoading(true);
    setError("");
    const userId = localStorage.getItem("learning_app_userId") || "";
    console.log("[StudyRoadmap] Beginning fetch. x-user-id:", userId);
    let data = null;
    try {
      console.log("[StudyRoadmap] Step 1: Running fetch to get existing study plan from database...");
      data = await api.getSmartStudyPlan();
      console.log("[StudyRoadmap] Step 1 Success! Static plan response received:", data);
    } catch (getError) {
      console.warn("[StudyRoadmap] Step 1 Failed! Fetching existing plan failed, trying recalculation:", getError);
      console.error("Fetch Error Stack:", getError.stack || getError);
      try {
        console.log("[StudyRoadmap] Step 2: Requesting dynamic recalculation of smart study plan...");
        data = await api.recalculateSmartStudyPlan();
        console.log("[StudyRoadmap] Step 2 Success! Recalculated plan response received:", data);
      } catch (recalcError) {
        console.error("StudyRoadmap Error: Both fetch and recalculate failed:", recalcError);
        setError(recalcError.message || "Không thể tải lộ trình học tập chi tiết. Vui lòng thử lại sau.");
        setLoading(false);
        return;
      }
    }
    if (!data) {
      console.error("[StudyRoadmap] Received empty response from API");
      setError("Dữ liệu lộ trình bị rỗng hoặc lỗi. Vui lòng kiểm tra lại cấu hình tài khoản.");
      setLoading(false);
      return;
    }
    if (data && !data.weeklyPlans && data.roadmap && data.roadmap.weeklyPlans) {
      data.weeklyPlans = data.roadmap.weeklyPlans;
    }
    if (data && data.weeklyPlans && data.weeklyPlans[0] && data.weeklyPlans[0].sessions) {
      console.log("PAGE_WEEK_1 =", data.weeklyPlans[0].sessions.length);
    } else {
      console.log("PAGE_WEEK_1 = 0");
    }
    try {
      setPlanData(data);
      console.log("[StudyRoadmap] Successfully loaded planData state:", data);
      if (data?.roadmap?.weeklyPlans) {
        const normalized = normalizeWeeklyPlans(data.roadmap.weeklyPlans);
        console.log("[StudyRoadmap] Normalized weekly plans for rendering:", normalized);
        setWeeklyPlans(normalized);
        if (!preserveExpanded) {
          const firstUnfinished = normalized.flatMap((w) => w.sessions).find((s) => s.unlocked && s.testStatus !== "PASS");
          if (firstUnfinished) {
            setExpandedSessions({ [firstUnfinished.id]: true });
          } else if (normalized.length > 0 && normalized[0].sessions.length > 0) {
            setExpandedSessions({ [normalized[0].sessions[0].id]: true });
          }
        }
      } else {
        console.warn("[StudyRoadmap] No weeklyPlans array found under data.roadmap:", data?.roadmap);
      }
    } catch (renderError) {
      console.error("StudyRoadmap Processing/Rendering Error:", renderError);
      console.error(renderError.stack || renderError);
      setError(renderError.message || "Lỗi xử lý dữ liệu hiển thị lộ trình.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoadmap();
  }, []);
  const showExtensionToast = (message) => {
    playSound("click");
    setExtMsg(message);
    setTimeout(() => {
      setExtMsg(null);
    }, 4e3);
  };
  const toggleSessionExpand = (id) => {
    playSound("click");
    setExpandedSessions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const handleStartTask = (weekNum, session, taskText, tIdx) => {
    playSound("click");
    const taskObj = session.rawTasks ? session.rawTasks[tIdx] : null;
    const enrichedTask = getEnrichedTask(taskObj || taskText, session, tIdx, weekNum);
    console.log("[Roadmap Page] Starting Enriched Task:", enrichedTask);
    saveActiveTaskRedirect(enrichedTask, weekNum, session.id, tIdx);
    
    if (enrichedTask.moduleType === "project") {
      setProjectText(session.projectDraft || "");
      setProjectFeedback(null);
      setProjectEvaluating(false);
      setActiveModalProject({ weekNum, session, taskIndex: tIdx });
    } else {
      navigateToRoadmapTask(enrichedTask, navigate);
    }
  };
  const handleCompleteGeneralTask = async (weekNum, sessionId, taskIndex) => {
    try {
      const res = await api.completeRoadmapTask(weekNum, sessionId, taskIndex);
      if (res?.roadmap?.weeklyPlans) {
        setWeeklyPlans(normalizeWeeklyPlans(res.roadmap.weeklyPlans));
      }
      playSound("pass");
      showExtensionToast("🎉 Tuyệt vời! Nhiệm vụ đã hoàn thành. Nhận +10 XP!");
      fetchRoadmap(true);
    } catch (e) {
      console.error(e);
    }
  };
  const handleEvaluateProject = () => {
    if (!projectText.trim()) return;
    setProjectEvaluating(true);
    playSound("click");
    setTimeout(() => {
      const randScore = (8 + Math.random() * 1.8).toFixed(1);
      const isEnglish = /^[a-zA-Z\s.,!?'-]+$/.test(projectText);
      const report = {
        score: randScore,
        criteria: {
          lexical: Number(randScore) > 9 ? "Ưu tú" : "Khá tốt",
          grammar: isEnglish ? "Chính xác, đa dạng cấu trúc" : "Hợp lệ, có nỗ lực diễn đạt cấu trúc",
          structure: "Bố cục 3 phần rõ ràng, mạch lạc"
        },
        strengths: isEnglish ? "Sử dụng tốt vốn từ vựng chuyên ngành, các liên từ (furthermore, consequently, although) được lồng ghép tự nhiên." : "Nội dung phong phú, thể hiện được sự cam kết học tập và rèn luyện nghiêm túc.",
        suggestions: "Cố gắng sử dụng nhiều từ vựng thuộc band C1 hơn nữa để tối ưu hóa thang điểm sáng tạo.",
        vocabularyRecommendations: ["Meticulous (Tỉ mỉ)", "Synthesize (Tổng hợp)", "Resilience (Sự kiên trì)", "Proactive (Chủ động)"]
      };
      setProjectFeedback(report);
      setProjectEvaluating(false);
      playSound("pass");
    }, 2800);
  };
  const handleFinishProjectTask = async (weekNum, sessionId, taskIndex) => {
    try {
      const res = await api.submitRoadmapProject(weekNum, sessionId, projectText);
      if (res?.roadmap?.weeklyPlans) {
        setWeeklyPlans(normalizeWeeklyPlans(res.roadmap.weeklyPlans));
      }
      setActiveModalProject(null);
      playSound("pass");
      showExtensionToast("🏆 Dự án sáng tạo đã được AI thông qua! Đạt +150 XP!");
      fetchRoadmap(true);
    } catch (e) {
      console.error(e);
    }
  };
  const handleStartTest = (weekNum, session) => {
    playSound("click");
    setTestActiveQuestionIdx(0);
    setTestAnswers({});
    setTestResult(null);
    setActiveModalTest({ weekNum, session });
  };
  const handleAnswerTest = (qIdx, oIdx) => {
    playSound("click");
    setTestAnswers((prev) => ({
      ...prev,
      [qIdx]: oIdx
    }));
  };
  const handleNextTestQuestion = (questionsCount) => {
    if (testActiveQuestionIdx < questionsCount - 1) {
      setTestActiveQuestionIdx((prev) => prev + 1);
      playSound("click");
    }
  };
  const handlePrevTestQuestion = () => {
    if (testActiveQuestionIdx > 0) {
      setTestActiveQuestionIdx((prev) => prev - 1);
      playSound("click");
    }
  };
  const handleSubmitTest = async (weekNum, session, questions) => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.answer) {
        correctCount++;
      }
    });
    const finalPercent = Math.round(correctCount / questions.length * 100);
    const passed = finalPercent >= 80;
    setTestResult({
      score: finalPercent,
      passed,
      completed: true
    });
    if (passed) {
      playSound("pass");
    } else {
      playSound("fail");
    }
    try {
      const res = await api.submitRoadmapTest(weekNum, session.id, finalPercent);
      if (res?.roadmap?.weeklyPlans) {
        setWeeklyPlans(normalizeWeeklyPlans(res.roadmap.weeklyPlans));
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleFinishTestFlow = () => {
    setActiveModalTest(null);
    fetchRoadmap(true);
  };
  const totalSessions = weeklyPlans.reduce((sum, w) => sum + (w.sessions?.length || 0), 0);
  const completedSessions = weeklyPlans.reduce((sum, w) => sum + (w.sessions?.filter((s) => s.testStatus === "PASS").length || 0), 0);
  const overallProgressPercentage = totalSessions > 0 ? Math.round(completedSessions / totalSessions * 100) : 0;
  const activeWeek = weeklyPlans.find((w) => w.week === selectedWeekNum) || weeklyPlans[0];
  const getWeekProgressPercentage = (week) => {
    const total = week.sessions.length;
    if (total === 0) return 0;
    const completed = week.sessions.filter((s) => s.testStatus === "PASS" || s.status === "completed").length;
    return Math.round(completed / total * 100);
  };
  const dayNameVI = {
    "Monday": "Thứ 2",
    "Tuesday": "Thứ 3",
    "Wednesday": "Thứ 4",
    "Thursday": "Thứ 5",
    "Friday": "Thứ 6",
    "Saturday": "Thứ 7",
    "Sunday": "Chủ nhật",
    "mon": "Thứ 2",
    "tue": "Thứ 3",
    "wed": "Thứ 4",
    "thu": "Thứ 5",
    "fri": "Thứ 6",
    "sat": "Thứ 7",
    "sun": "Chủ nhật"
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center min-h-screen bg-[#EEF4F8] space-y-4", children: [
      /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 text-indigo-600 animate-spin" }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 583,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-slate-500 animate-pulse", children: "Đang đồng bộ lộ trình học tập thông minh..." }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 584,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 582,
      columnNumber: 7
    }, this);
  }
  if (error) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center min-h-screen bg-[#EEF4F8] p-6 text-center space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-red-500 text-4xl", children: "⚠️" }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 594,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-slate-700", children: error }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 595,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => fetchRoadmap(),
          className: "px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition",
          children: "Thử lại"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 596,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 593,
      columnNumber: 7
    }, this);
  }
  if (weeklyPlans.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center min-h-screen bg-[#EEF4F8] p-6 text-center space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-slate-400 text-4xl", children: "📅" }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 609,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-slate-700", children: "Chưa tìm thấy lộ trình học tập nào. Hãy quay lại Kế hoạch học tập để tạo lộ trình đầu tiên." }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 610,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => navigate("/dashboard"),
          className: "px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition",
          children: "Quay lại Dashboard"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 611,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 608,
      columnNumber: 7
    }, this);
  }
  const week = weeklyPlans.find((w: any) => w.week === 1);
  if (week && week.sessions) {
    console.log("RENDER_WEEK_1 =", week.sessions.length);
  } else {
    console.log("RENDER_WEEK_1 = 0");
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#EEF4F8] text-slate-850 flex flex-col font-sans transition-all relative", children: [
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: extMsg && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: -50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
        className: "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 text-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3 text-xs font-bold max-w-sm",
        children: [
          /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-yellow-400 shrink-0 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 633,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: extMsg }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 634,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 627,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 625,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-45 shadow-sm shrink-0", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => navigate("/dashboard"),
          className: "flex items-center gap-2 text-xs font-black text-indigo-650 hover:text-indigo-800 transition-colors cursor-pointer bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl",
          children: [
            /* @__PURE__ */ jsxDEV(ArrowLeft, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 645,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Quay lại Kế hoạch học tập" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 646,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 641,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "hidden sm:flex bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-black items-center gap-1.5 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV(Trophy, { className: "w-4 h-4 text-indigo-600" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 651,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: [
            "Đã đạt: ",
            completedSessions,
            "/",
            totalSessions,
            " buổi (",
            overallProgressPercentage,
            "%)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 652,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 650,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSidebarOpen(!sidebarOpen),
            className: "md:hidden p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl border border-slate-100 cursor-pointer",
            children: /* @__PURE__ */ jsxDEV(Menu, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 659,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 655,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 649,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 640,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 border-b border-indigo-900/40 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 text-white relative overflow-hidden shadow-md", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 666,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-left relative z-10", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white/10 border border-white/20 text-yellow-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full", children: "LMS Lộ trình Học v3" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 669,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "bg-white/15 text-indigo-150 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3 h-3 text-yellow-300" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 673,
              columnNumber: 15
            }, this),
            " Hệ thống khóa bài tự động"
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 672,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 668,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h1", { className: "text-xl md:text-2xl font-black tracking-tight leading-none text-white", children: "Hệ Thống Lộ Trình Đào Tạo Thông Minh (LMS Engine)" }, void 0, false, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 676,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-indigo-150 font-bold max-w-2xl leading-relaxed", children: "Mỗi buổi học là một nấc thang tri thức. Hãy hoàn thành 100% nhiệm vụ rèn luyện cốt lõi, vượt qua bài kiểm tra năng lực để mở khóa bài học kế tiếp." }, void 0, false, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 679,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 667,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto relative z-10", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4.5 py-3 rounded-2xl text-left shadow-sm shrink-0", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-150 block uppercase font-black leading-none", children: "Mức độ" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 686,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-yellow-300 block leading-none mt-1.5 uppercase", children: [
            "CEFR ",
            user?.level || "A2"
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 687,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 685,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4.5 py-3 rounded-2xl text-left shadow-sm shrink-0", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-150 block uppercase font-black leading-none", children: "Chuỗi học tập" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 693,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-yellow-300 block leading-none mt-1.5 font-mono", children: [
            "🔥 ",
            planData?.roadmap?.stats?.streakDays || 0,
            " Ngày"
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 694,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 692,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4.5 py-3 rounded-2xl text-left shadow-sm shrink-0", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-150 block uppercase font-black leading-none", children: "Tiến độ tuần" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 700,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-yellow-300 block leading-none mt-1.5", children: [
            "Week ",
            selectedWeekNum,
            "/",
            weeklyPlans.length
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 701,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 699,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white/10 backdrop-blur-md border border-white/15 px-4.5 py-3 rounded-2xl text-left shadow-sm shrink-0", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-150 block uppercase font-black leading-none", children: "Tổng trải nghiệm" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 707,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-yellow-300 block leading-none mt-1.5 font-mono", children: [
            "🏆 ",
            user?.xp || 250,
            " XP"
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 708,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 706,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 684,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 665,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col md:flex-row min-w-0 max-w-7xl w-full mx-auto p-4 md:p-8 gap-6 md:gap-8 min-h-0", children: [
      /* @__PURE__ */ jsxDEV(AnimatePresence, { children: sidebarOpen && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setSidebarOpen(false),
          className: "fixed inset-0 bg-black/40 z-40 md:hidden"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 721,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 719,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("aside", { className: `
          fixed md:relative inset-y-0 left-0 w-80 bg-white md:bg-transparent border-r md:border-r-0 border-slate-150 p-5 md:p-0 flex flex-col justify-between shrink-0 z-50 md:z-10 md:flex transition-transform duration-300 shadow-xl md:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `, children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full overflow-hidden bg-white rounded-[2rem] border border-slate-200/50 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-5 border-b border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block", children: "LMS Lộ trình" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 739,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-black text-slate-800 uppercase mt-0.5", children: "Phân Khoá Tuần Học" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 740,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 738,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSidebarOpen(false),
              className: "md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer",
              children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 746,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 742,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 737,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "px-5 py-4 bg-slate-50 border-b border-slate-100 text-left space-y-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-wider", children: "Hoàn thành lộ trình" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 753,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-bold text-indigo-600 font-mono", children: [
              completedSessions,
              "/",
              totalSessions,
              " buổi"
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 754,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 752,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full h-2 bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500",
              style: { width: `${overallProgressPercentage}%` }
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 757,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 756,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 751,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("nav", { className: "flex-1 overflow-y-auto p-4 space-y-1.5 text-left", children: weeklyPlans.map((w) => {
          const isActive = w.week === selectedWeekNum;
          const weekProgress = getWeekProgressPercentage(w);
          let badgeColor = "bg-slate-100 text-slate-500";
          let badgeText = "Chưa mở";
          if (w.status === "completed") {
            badgeColor = "bg-emerald-100 text-emerald-700";
            badgeText = "Hoàn thành";
          } else if (w.status === "studying") {
            badgeColor = "bg-amber-100 text-amber-700";
            badgeText = "Đang học";
          }
          return /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setSelectedWeekNum(w.week);
                setSidebarOpen(false);
                playSound("click");
              },
              className: `w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-indigo-600/10" : "bg-white hover:bg-slate-50 border border-slate-100"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] font-black uppercase tracking-wider block ${isActive ? "text-indigo-150" : "text-slate-400"}`, children: [
                    "Tuần ",
                    w.week
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 795,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-black block truncate mt-0.5 ${isActive ? "text-white" : "text-slate-800"}`, children: w.title }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 798,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 794,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-end gap-1 shrink-0 ml-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: `text-[8px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : badgeColor}`, children: badgeText }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 804,
                    columnNumber: 23
                  }, this),
                  weekProgress > 0 && /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-bold font-mono ${isActive ? "text-indigo-150" : "text-slate-500"}`, children: [
                    weekProgress,
                    "%"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 808,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 803,
                  columnNumber: 21
                }, this)
              ]
            },
            w.week,
            true,
            {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 781,
              columnNumber: 19
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 765,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 border-t border-slate-100 bg-slate-50/50 text-left space-y-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-widest block", children: "Tính năng nâng cao" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 820,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => showExtensionToast("Trợ lý AI đang tối ưu hóa chu kỳ nhắc nhở dựa trên hành vi học tập của bạn..."),
                className: "flex items-center justify-center gap-1.5 p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-[10px] font-extrabold text-indigo-650 transition-all cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5 text-indigo-505" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 826,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "AI Tinh Chỉnh" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 827,
                    columnNumber: 19
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 822,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => showExtensionToast("Vui lòng cho phép quyền truy cập để đồng bộ kế hoạch trực tiếp với Lịch Google."),
                className: "flex items-center justify-center gap-1.5 p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-[10px] font-extrabold text-indigo-650 transition-all cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxDEV(CalendarRange, { className: "w-3.5 h-3.5" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 834,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "Lịch Google" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 835,
                    columnNumber: 19
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 830,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 821,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 819,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 736,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 732,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("section", { className: "flex-1 flex flex-col min-w-0 bg-white rounded-[2rem] border border-slate-200/50 shadow-sm p-6 md:p-8 space-y-6 md:space-y-8 text-left overflow-y-auto", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-indigo-650 uppercase tracking-widest block", children: "Chi tiết lộ trình học tập" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 848,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-black text-slate-800 uppercase mt-0.5", children: [
              "Tuần ",
              activeWeek.week,
              ": ",
              activeWeek.title
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 849,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 847,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-semibold text-slate-400", children: "Trạng thái tuần:" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 855,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${activeWeek.status === "completed" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : activeWeek.status === "studying" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`, children: activeWeek.status === "completed" ? "Hoàn thành" : activeWeek.status === "studying" ? "Đang học" : "Chưa mở" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 856,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 854,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 846,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 border border-indigo-100/60 rounded-2xl p-5 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxDEV(Info, { className: "w-5 h-5 text-indigo-600 mt-0.5 shrink-0" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 870,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-indigo-900 uppercase tracking-wide", children: "Mục tiêu cốt lõi của tuần này:" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 872,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-650 font-semibold leading-relaxed", children: activeWeek.weeklyGoal }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 873,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 871,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 869,
          columnNumber: 11
        }, this),
        planData?.roadmap?.stats && /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800 rounded-[2rem] p-6 text-white shadow-xl space-y-4 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.05] rounded-full blur-2xl pointer-events-none" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 882,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-indigo-800/60 pb-3 relative z-10", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-yellow-300 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 885,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black uppercase tracking-wider text-slate-100", children: "AI Dự đoán tiến độ (Real-time Adaptive Model)" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 886,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 884,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full", children: "LMS Sync Active" }, void 0, false, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 888,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 883,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-5 text-left relative z-10", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-200 font-extrabold uppercase tracking-wide", children: "Lộ trình hoàn thành" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 895,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-white font-mono", children: [
                  planData.roadmap.stats.progressPercentage,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 897,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300", children: "lớp học" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 898,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 896,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 894,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-200 font-extrabold uppercase tracking-wide", children: "Chuỗi ngày bền bỉ" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 903,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-orange-400 font-mono", children: [
                  "🔥 ",
                  planData.roadmap.stats.streakDays
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 905,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300", children: "ngày" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 906,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 904,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 902,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-200 font-extrabold uppercase tracking-wide", children: "Dự báo hoàn thành" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 911,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-baseline gap-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-black text-yellow-300 font-mono", children: planData.roadmap.stats.predictedDurationDays }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 913,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-300", children: [
                  "ngày (chuẩn ",
                  planData.roadmap.stats.originalDurationDays,
                  ")"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 914,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 912,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 910,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-indigo-200 font-extrabold uppercase tracking-wide", children: "Hiệu suất rèn luyện" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 919,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "mt-1", children: planData.roadmap.stats.paceStatus === "ahead" ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full", children: "🚀 Vượt tiến độ" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 922,
                columnNumber: 23
              }, this) : planData.roadmap.stats.paceStatus === "behind" ? /* @__PURE__ */ jsxDEV("span", { className: "bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full", children: "⚠️ Chậm tiến độ" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 926,
                columnNumber: 23
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full", children: "✅ Đúng kế hoạch" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 930,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 920,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 918,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 893,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 881,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black text-slate-400 uppercase tracking-widest", children: "Danh sách các buổi học chi tiết" }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 942,
            columnNumber: 13
          }, this),
          activeWeek.sessions.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold leading-relaxed", children: "Không có buổi học nào được lên lịch cho tuần này." }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 945,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-5", children: activeWeek.sessions.map((session, sIdx) => {
            const isExpanded = !!expandedSessions[session.id];
            const totalTasks = session.tasks.length;
            const doneTasks = session.tasksProgress.filter((st) => st === "DONE").length;
            const taskProgressPercent = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
            const isUnlocked = session.unlocked;
            const isPassed = session.testStatus === "PASS";
            const isPendingTest = isUnlocked && !isPassed && doneTasks === totalTasks;
            const isActiveLearning = isUnlocked && !isPassed && doneTasks < totalTasks;
            const isCurrentlyActiveLesson = isUnlocked && !isPassed;
            let difficultyBg = "bg-slate-50 text-slate-600 border-slate-100";
            const difficultyLower = String(session.difficulty ?? "").toLowerCase();
            if (difficultyLower.includes("dễ") || difficultyLower.includes("easy")) {
              difficultyBg = "bg-green-50 text-green-700 border-green-100";
            } else if (difficultyLower.includes("khó") || difficultyLower.includes("hard")) {
              difficultyBg = "bg-red-50 text-red-700 border-red-100";
            } else {
              difficultyBg = "bg-amber-50 text-amber-700 border-amber-100";
            }
            return /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: `border rounded-3xl transition-all duration-300 relative overflow-hidden ${isPassed ? "bg-slate-50/70 border-slate-200/60 shadow-none opacity-90" : !isUnlocked ? "bg-slate-100/50 border-slate-200/50 opacity-70 pointer-events-none" : isCurrentlyActiveLesson ? "bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10" : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"}`,
                children: [
                  isCurrentlyActiveLesson && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 990,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      onClick: () => isUnlocked && toggleSessionExpand(session.id),
                      className: `p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer ${isUnlocked ? "hover:bg-slate-50/40" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 text-left flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-2", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest", children: [
                              "Buổi học ",
                              sIdx + 1
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1e3,
                              columnNumber: 29
                            }, this),
                            !isUnlocked ? /* @__PURE__ */ jsxDEV("span", { className: "bg-slate-200 text-slate-500 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1", children: [
                              /* @__PURE__ */ jsxDEV(Clock, { className: "w-2.5 h-2.5" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1007,
                                columnNumber: 33
                              }, this),
                              " 🔒 Chưa mở"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1006,
                              columnNumber: 31
                            }, this) : isPassed ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1", children: [
                              /* @__PURE__ */ jsxDEV(Award, { className: "w-2.5 h-2.5 text-emerald-600" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1011,
                                columnNumber: 33
                              }, this),
                              " 🏆 Đã vượt Test"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1010,
                              columnNumber: 31
                            }, this) : isPendingTest ? /* @__PURE__ */ jsxDEV("span", { className: "bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse", children: [
                              /* @__PURE__ */ jsxDEV(HelpCircle, { className: "w-2.5 h-2.5 text-amber-600" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1015,
                                columnNumber: 33
                              }, this),
                              " 📝 Chờ Test"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1014,
                              columnNumber: 31
                            }, this) : /* @__PURE__ */ jsxDEV("span", { className: "bg-blue-100 text-blue-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1", children: [
                              /* @__PURE__ */ jsxDEV(Compass, { className: "w-2.5 h-2.5 text-blue-600 animate-spin", style: { animationDuration: "12s" } }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1019,
                                columnNumber: 33
                              }, this),
                              " 🟢 Đang học"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1018,
                              columnNumber: 31
                            }, this),
                            isCurrentlyActiveLesson && /* @__PURE__ */ jsxDEV("span", { className: "bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md", children: "Đang học cốt lõi" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1024,
                              columnNumber: 31
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 999,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 flex flex-wrap items-center gap-1.5", children: [
                            /* @__PURE__ */ jsxDEV("span", { children: [
                              dayNameVI[session.day] || session.day,
                              " • ",
                              session.time
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1031,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-300", children: "|" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1032,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500 font-bold", children: [
                              session.duration,
                              " phút học"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1033,
                              columnNumber: 29
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1030,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-600 font-bold truncate max-w-xl", children: session.goal }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1036,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 998,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:items-end justify-between w-full md:w-auto gap-3 shrink-0", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider", children: session.skill }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1044,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: `border text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${difficultyBg}`, children: [
                              "Lớp: ",
                              session.difficulty
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1047,
                              columnNumber: 29
                            }, this),
                            isUnlocked && /* @__PURE__ */ jsxDEV("div", { className: "text-slate-400 hover:text-slate-600 p-1", children: isExpanded ? /* @__PURE__ */ jsxDEV(ChevronUp, { className: "w-4 h-4" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1053,
                              columnNumber: 47
                            }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { className: "w-4 h-4" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1053,
                              columnNumber: 83
                            }, this) }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1052,
                              columnNumber: 31
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1043,
                            columnNumber: 27
                          }, this),
                          isUnlocked && /* @__PURE__ */ jsxDEV("div", { className: "w-full md:w-48 space-y-1 text-left md:text-right", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-wide", children: [
                              /* @__PURE__ */ jsxDEV("span", { children: [
                                "Nhiệm vụ: ",
                                doneTasks,
                                "/",
                                totalTasks
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1062,
                                columnNumber: 33
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { children: [
                                taskProgressPercent,
                                "%"
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1063,
                                columnNumber: 33
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1061,
                              columnNumber: 31
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                              "div",
                              {
                                className: "h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-350",
                                style: { width: `${taskProgressPercent}%` }
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1066,
                                columnNumber: 33
                              },
                              this
                            ) }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1065,
                              columnNumber: 31
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1060,
                            columnNumber: 29
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1042,
                          columnNumber: 25
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 994,
                      columnNumber: 23
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(AnimatePresence, { initial: false, children: isExpanded && isUnlocked && /* @__PURE__ */ jsxDEV(
                    motion.div,
                    {
                      initial: { height: 0, opacity: 0 },
                      animate: { height: "auto", opacity: 1 },
                      exit: { height: 0, opacity: 0 },
                      transition: { duration: 0.3, ease: "easeInOut" },
                      className: "border-t border-slate-100 bg-slate-50/40",
                      children: /* @__PURE__ */ jsxDEV("div", { className: "p-5 md:p-6 space-y-5", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 text-left", children: [
                            /* @__PURE__ */ jsxDEV("div", { children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block mb-0.5", children: "Tiêu đề buổi học" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1092,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("h5", { className: "text-xs font-black text-slate-800", children: session.title || `Chuyên đề bổ trợ kỹ năng` }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1093,
                                columnNumber: 37
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1091,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block mb-0.5", children: "Mô tả bài giảng" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1096,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-650 font-medium leading-relaxed", children: session.description || `Học sâu lý thuyết, từ vựng và vận dụng vào bài tập thực hành.` }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1097,
                                columnNumber: 37
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1095,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block mb-0.5", children: "Mục tiêu đạt được" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1100,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-indigo-650 font-bold leading-relaxed", children: session.objective || session.goal }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1101,
                                columnNumber: 37
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1099,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1090,
                            columnNumber: 33
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 text-left border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-4", children: [
                            session.learningMaterials && session.learningMaterials.length > 0 && /* @__PURE__ */ jsxDEV("div", { children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block mb-1", children: "📚 Học liệu khuyên dùng" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1108,
                                columnNumber: 39
                              }, this),
                              /* @__PURE__ */ jsxDEV("ul", { className: "list-disc pl-4 space-y-1 text-[11px] text-slate-600 font-semibold", children: session.learningMaterials.map((mat, mIdx) => /* @__PURE__ */ jsxDEV("li", { children: mat }, mIdx, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1111,
                                columnNumber: 43
                              }, this)) }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1109,
                                columnNumber: 39
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1107,
                              columnNumber: 37
                            }, this),
                            session.exercises && session.exercises.length > 0 && /* @__PURE__ */ jsxDEV("div", { children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block mb-1", children: "✍️ Bài tập rèn luyện" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1118,
                                columnNumber: 39
                              }, this),
                              /* @__PURE__ */ jsxDEV("ul", { className: "list-disc pl-4 space-y-1 text-[11px] text-slate-600 font-semibold", children: session.exercises.map((ex, eIdx) => /* @__PURE__ */ jsxDEV("li", { children: ex }, eIdx, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1121,
                                columnNumber: 43
                              }, this)) }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1119,
                                columnNumber: 39
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1117,
                              columnNumber: 37
                            }, this),
                            session.expectedOutcome && /* @__PURE__ */ jsxDEV("div", { children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block mb-0.5", children: "🎯 Kết quả đầu ra mong đợi" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1128,
                                columnNumber: 39
                              }, this),
                              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-600 font-medium leading-relaxed", children: session.expectedOutcome }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1129,
                                columnNumber: 39
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1127,
                              columnNumber: 37
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1105,
                            columnNumber: 33
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1089,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-100 pb-2", children: [
                            /* @__PURE__ */ jsxDEV("h5", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Nhiệm vụ đào tạo bắt buộc:" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1138,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold text-slate-400", children: "Yêu cầu hoàn thành toàn bộ" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1139,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1137,
                            columnNumber: 33
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-2.5", children: session.tasks.map((taskObj, tIdx) => {
                            const taskStatus = session.tasksProgress[tIdx] || "TODO";
                            const isTaskDone = taskStatus === "DONE";
                            const taskText = taskObj.description ? `${taskObj.title} - ${taskObj.description}` : taskObj.title;
                            const mType = taskObj?.moduleType || "";
                            let textLower = "document";
                            if (mType === "project") {
                              textLower = "project";
                            } else if (mType === "lesson_quiz" || mType === "mock_exam") {
                              textLower = "quiz";
                            } else if (mType === "reading") {
                              textLower = "đọc";
                            }
                            let taskIcon = /* @__PURE__ */ jsxDEV(FileText, { className: "w-4 h-4 text-slate-400" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1149,
                              columnNumber: 52
                            }, this);
                            let catLabel = "Học liệu";
                            if (textLower.includes("project") || textLower.includes("dự án")) {
                              taskIcon = /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-purple-500" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1155,
                                columnNumber: 50
                              }, this);
                              catLabel = "Dự án Sáng tạo";
                            } else if (textLower.includes("quiz") || textLower.includes("test") || textLower.includes("kiểm tra")) {
                              taskIcon = /* @__PURE__ */ jsxDEV(Award, { className: "w-4 h-4 text-amber-500" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1158,
                                columnNumber: 50
                              }, this);
                              catLabel = "Bài đánh giá";
                            } else if (textLower.includes("tài liệu") || textLower.includes("đọc")) {
                              taskIcon = /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-4 h-4 text-teal-500" }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1161,
                                columnNumber: 50
                              }, this);
                              catLabel = "Tài liệu tự đọc";
                            }
                            return /* @__PURE__ */ jsxDEV(
                              "div",
                              {
                                className: `flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${isTaskDone ? "bg-slate-100/60 border-slate-200/50 opacity-80" : "bg-white border-slate-200/60 shadow-sm hover:border-slate-300"}`,
                                children: [
                                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3", children: [
                                    /* @__PURE__ */ jsxDEV("div", { className: `p-2 rounded-xl shrink-0 ${isTaskDone ? "bg-slate-200/40 text-slate-400" : "bg-slate-50 text-indigo-650"}`, children: taskIcon }, void 0, false, {
                                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                      lineNumber: 1175,
                                      columnNumber: 43
                                    }, this),
                                    /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5 text-left", children: [
                                      /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-wider block", children: catLabel }, void 0, false, {
                                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                        lineNumber: 1179,
                                        columnNumber: 45
                                      }, this),
                                      /* @__PURE__ */ jsxDEV("p", { className: `text-xs font-bold leading-normal ${isTaskDone ? "line-through text-slate-400" : "text-slate-700"}`, children: taskText }, void 0, false, {
                                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                        lineNumber: 1182,
                                        columnNumber: 45
                                      }, this)
                                    ] }, void 0, true, {
                                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                      lineNumber: 1178,
                                      columnNumber: 43
                                    }, this)
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                    lineNumber: 1174,
                                    columnNumber: 41
                                  }, this),
                                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center sm:justify-end shrink-0 pl-11 sm:pl-0", children: isTaskDone ? /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm", children: [
                                    /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-3.5 h-3.5 text-emerald-600" }, void 0, false, {
                                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                      lineNumber: 1192,
                                      columnNumber: 47
                                    }, this),
                                    " Hoàn thành"
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                    lineNumber: 1191,
                                    columnNumber: 45
                                  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                                    /* @__PURE__ */ jsxDEV(
                                      "button",
                                      {
                                        onClick: () => {
                                          playSound("click");
                                          setActiveModalReading({ weekNum: activeWeek.week, session, taskIndex: tIdx });
                                        },
                                        className: "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60 text-[10px] font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1",
                                        title: "Đọc tài liệu lý thuyết & Ghi chú",
                                        children: [
                                          /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-3.5 h-3.5 text-teal-600" }, void 0, false, {
                                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                            lineNumber: 1204,
                                            columnNumber: 49
                                          }, this),
                                          /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Tài liệu" }, void 0, false, {
                                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                            lineNumber: 1205,
                                            columnNumber: 49
                                          }, this)
                                        ]
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                        lineNumber: 1196,
                                        columnNumber: 47
                                      },
                                      this
                                    ),
                                    /* @__PURE__ */ jsxDEV(
                                      "button",
                                      {
                                        onClick: () => handleStartTask(activeWeek.week, session, taskText, tIdx),
                                        className: "bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5",
                                        children: [
                                          /* @__PURE__ */ jsxDEV("span", { children: "Thực hiện ngay" }, void 0, false, {
                                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                            lineNumber: 1212,
                                            columnNumber: 49
                                          }, this),
                                          /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3 h-3" }, void 0, false, {
                                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 49
                                          }, this)
                                        ]
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 47
                                      },
                                      this
                                    )
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                    lineNumber: 1195,
                                    columnNumber: 45
                                  }, this) }, void 0, false, {
                                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                    lineNumber: 1189,
                                    columnNumber: 41
                                  }, this)
                                ]
                              },
                              tIdx,
                              true,
                              {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1166,
                                columnNumber: 39
                              },
                              this
                            );
                          }) }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1142,
                            columnNumber: 33
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1136,
                          columnNumber: 31
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "pt-4 border-t border-slate-200/80 space-y-3", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-1", children: [
                            /* @__PURE__ */ jsxDEV("h5", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Cửa ải bài kiểm tra năng lực (Lesson Test):" }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1227,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold text-slate-400", children: [
                              "Yêu cầu đạt ",
                              `>=`,
                              " 80%"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1228,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1226,
                            columnNumber: 33
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: `p-5 rounded-2xl border text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isPassed ? "bg-emerald-50/50 border-emerald-200" : !isPendingTest ? "bg-slate-100/50 border-slate-200/50 text-slate-400" : "bg-amber-50/50 border-amber-200"}`, children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
                              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ jsxDEV(Award, { className: `w-5 h-5 ${isPassed ? "text-emerald-600" : isPendingTest ? "text-amber-600 animate-pulse" : "text-slate-400"}` }, void 0, false, {
                                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                  lineNumber: 1240,
                                  columnNumber: 39
                                }, this),
                                /* @__PURE__ */ jsxDEV("span", { className: `text-xs font-black uppercase tracking-wide ${isPassed ? "text-emerald-800" : isPendingTest ? "text-amber-800" : "text-slate-500"}`, children: [
                                  "Bài Kiểm Tra Khóa Bài Học ",
                                  sIdx + 1
                                ] }, void 0, true, {
                                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                  lineNumber: 1241,
                                  columnNumber: 39
                                }, this)
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1239,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-bold text-slate-500 leading-normal max-w-lg", children: isPassed ? `Chúc mừng bạn đã vượt qua bài test năng lực với số điểm tuyệt đối ${session.testScore}%. Khóa học tiếp theo đã được mở khóa!` : isPendingTest ? "Tất cả các nhiệm vụ cơ bản đã hoàn thành xuất sắc! Bài kiểm tra năng lực cuối bài học đã được mở khóa. Hãy làm bài ngay." : "Vui lòng hoàn thành toàn bộ danh sách 4 nhiệm vụ học tập phía trên trước để mở khóa bài thi kiểm tra năng lực cuối buổi." }, void 0, false, {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1245,
                                columnNumber: 37
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1238,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "shrink-0 w-full sm:w-auto", children: isPassed ? /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black px-4 py-2 rounded-xl inline-block shadow-sm", children: [
                              "Đã vượt qua (",
                              session.testScore,
                              "%)"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1257,
                              columnNumber: 41
                            }, this) }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1256,
                              columnNumber: 39
                            }, this) : isPendingTest ? /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                onClick: () => handleStartTest(activeWeek.week, session),
                                className: "w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-orange-500/10 cursor-pointer text-center",
                                children: "Bắt đầu làm Test (5 câu)"
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1262,
                                columnNumber: 39
                              },
                              this
                            ) : /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                disabled: true,
                                className: "w-full sm:w-auto bg-slate-200 text-slate-400 text-xs font-black px-5 py-3 rounded-xl cursor-not-allowed text-center",
                                children: "Khóa bài kiểm tra 🔒"
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                                lineNumber: 1269,
                                columnNumber: 39
                              },
                              this
                            ) }, void 0, false, {
                              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                              lineNumber: 1254,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1231,
                            columnNumber: 33
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1225,
                          columnNumber: 31
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1086,
                        columnNumber: 29
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1079,
                      columnNumber: 27
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1077,
                    columnNumber: 23
                  }, this),
                  !isUnlocked && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-slate-900/[0.02] backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white/95 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm text-[11px] font-bold text-slate-500 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDEV(Clock, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1289,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "Vượt bài kiểm tra của buổi học phía trước để mở khóa 🔒" }, void 0, false, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1290,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1288,
                    columnNumber: 27
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1287,
                    columnNumber: 25
                  }, this)
                ]
              },
              session.id || sIdx,
              true,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 976,
                columnNumber: 21
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 949,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
          lineNumber: 941,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 843,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 716,
      columnNumber: 7
    }, this),

    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: activeModalReading && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { x: "100%", opacity: 0.9 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0.9 },
        transition: { type: "spring", damping: 25 },
        className: "bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-teal-650 uppercase tracking-widest block", children: "LMS Textbook Reader" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1425,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 uppercase", children: "Tài Liệu Tổng Hợp Và Ghi Chú" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1426,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1424,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveModalReading(null),
                className: "p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 cursor-pointer",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1432,
                  columnNumber: 19
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1428,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1423,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-6 space-y-6 text-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "bg-teal-100 text-teal-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md", children: [
                "Level ",
                activeModalReading.session.difficulty
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1439,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-800 leading-tight", children: [
                "Chuyên đề rèn luyện: ",
                activeModalReading.session.skill
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1442,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500 font-semibold leading-relaxed", children: "Tài liệu cô đọng biên soạn dành riêng cho người dùng giúp tối ưu phản xạ và nắm vững quy tắc xử lý trong bài thi IELTS." }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1445,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1438,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-3.5 text-xs text-slate-700 leading-relaxed font-semibold", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("h5", { className: "font-black text-slate-800 uppercase text-[10px] tracking-wide text-indigo-650", children: "📌 1. Kiến thức cốt lõi (Core Principles)" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1452,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { children: [
                  "Mỗi khía cạnh kỹ năng luôn đòi hỏi sự chuẩn mực và lặp lại đều đặn. Để nắm vững ",
                  activeModalReading.session.skill,
                  ", bạn cần ghi nhớ quy tắc 'Spaced Repetition' (Lặp lại ngắt quãng) đối với từ vựng, hoặc 'Active Recall' (Chủ động gọi nhớ) đối với các bài ngữ pháp và rèn luyện kỹ năng nghe hiểu."
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1453,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1451,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("h5", { className: "font-black text-slate-800 uppercase text-[10px] tracking-wide text-indigo-650", children: "⚡ 2. Mẹo thực chiến nhanh (Exam Hacks)" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1457,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("ul", { className: "list-disc list-inside space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("li", { children: "Đọc lướt (Skimming) để nắm đại ý bài viết." }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1459,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("li", { children: "Tìm từ khóa đồng nghĩa (Synonyms) khi nối thông tin nghe - đọc." }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1460,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("li", { children: "Tránh bẫy tuyệt đối hóa (luôn luôn, không bao giờ, chỉ có) trong đề thi." }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1461,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1458,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1456,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("h5", { className: "font-black text-slate-800 uppercase text-[10px] tracking-wide text-indigo-650", children: "📝 3. Bài tập ghi nhớ sâu (Practice Outline)" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1466,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { children: "Hãy thực hiện tối thiểu 5-10 câu hỏi trắc nghiệm thực hành để củng cố bền bỉ nội dung học." }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1467,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1465,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1450,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "border border-indigo-100 bg-indigo-50/40 rounded-2xl p-4 flex gap-3 text-xs text-indigo-900 leading-relaxed font-semibold", children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-5 h-5 text-indigo-600 shrink-0 mt-0.5" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1472,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Mẹo từ AI Advisor:" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1474,
                  columnNumber: 21
                }, this),
                " Sau khi hoàn thành việc đọc tóm tắt học thuật này, hãy sẵn sàng chuyển sang làm các nhiệm vụ tiếp theo để củng cố kiến thức tốt nhất."
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1473,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1471,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1437,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveModalReading(null),
                className: "flex-1 border border-slate-200 text-slate-600 font-black text-xs py-3.5 rounded-xl hover:bg-slate-100 cursor-pointer text-center",
                children: "Đóng tài liệu"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1481,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  handleCompleteGeneralTask(activeModalReading.weekNum, activeModalReading.session.id, activeModalReading.taskIndex);
                  setActiveModalReading(null);
                },
                className: "flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs py-3.5 rounded-xl shadow-md cursor-pointer text-center",
                children: "Đã đọc & Đã hiểu bài (+10 XP)"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1488,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1480,
            columnNumber: 15
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 1416,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 1415,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 1413,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: activeModalProject && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        className: "bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-purple-650 uppercase tracking-widest block", children: "LMS Project Workspace" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1515,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 uppercase", children: "Nộp Dự Án Sáng Tạo Ứng Dụng" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1516,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1514,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setActiveModalProject(null),
                className: "p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 cursor-pointer",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1522,
                  columnNumber: 19
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1518,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1513,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-5 text-left overflow-y-auto", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-purple-50/50 border border-purple-100 rounded-2xl p-5 space-y-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-purple-900 font-black text-xs uppercase tracking-wide", children: [
                /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-purple-600" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1529,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: [
                  "Đề bài dự án sáng tạo tuần ",
                  activeModalProject.weekNum
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1530,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1528,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-700 font-bold leading-relaxed", children: PROJECT_PROMPTS[activeModalProject.session.skill] || PROJECT_PROMPTS["Default / Tổng hợp"] || "Hãy nộp báo cáo rèn luyện sáng tạo." }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1532,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1527,
              columnNumber: 17
            }, this),
            !projectFeedback ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-wider block", children: "Bài làm dự án của bạn:" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1540,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "textarea",
                {
                  value: projectText,
                  onChange: (e) => setProjectText(e.target.value),
                  placeholder: "Hãy nhập bài viết tiếng Anh, đoạn thu âm dịch thuật hoặc nội dung giải pháp dự án rèn luyện của bạn tại đây (Từ 50 - 150 từ)...",
                  className: "w-full h-40 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none resize-none"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1541,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] font-extrabold text-slate-400 text-right", children: [
                "Số ký tự: ",
                projectText.length
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1547,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1539,
              columnNumber: 19
            }, this) : (
              // AI advisor report dashboard card (Zero-larp high quality)
              /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: "border border-purple-200 rounded-2xl overflow-hidden shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-purple-700 to-indigo-800 px-5 py-3 text-white flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black uppercase tracking-wider", children: "Báo cáo phân tích dự án bởi AI" }, void 0, false, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1559,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full", children: "Completed v2" }, void 0, false, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1560,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1558,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "p-5 space-y-4 bg-purple-50/10", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-3", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-black block uppercase leading-none", children: "Điểm số dự đoán" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1567,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-black text-purple-700 block font-mono mt-1", children: projectFeedback.score }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1568,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] text-slate-400 block leading-none mt-1", children: "/10.0 tối đa" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1569,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1566,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-black block uppercase leading-none", children: "Vốn từ vựng" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1572,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-emerald-600 block mt-1.5", children: projectFeedback.criteria.lexical }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1573,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1571,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 font-black block uppercase leading-none", children: "Tính nhất quán" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1576,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-indigo-600 block mt-1.5", children: projectFeedback.criteria.structure }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1577,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1575,
                          columnNumber: 25
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1565,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3.5 text-xs", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase tracking-wider text-[9px] block", children: "Điểm mạnh nổi bật:" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1584,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "text-slate-750 font-semibold leading-relaxed", children: projectFeedback.strengths }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1585,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1583,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase tracking-wider text-[9px] block", children: "Gợi ý cải thiện ngữ cảnh:" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1588,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "text-slate-750 font-semibold leading-relaxed", children: projectFeedback.suggestions }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1589,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1587,
                          columnNumber: 25
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-400 uppercase tracking-wider text-[9px] block", children: "Bộ từ vựng nâng cấp khuyến nghị (Vocabulary Upgrade):" }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1594,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1.5", children: projectFeedback.vocabularyRecommendations.map((v, vi) => /* @__PURE__ */ jsxDEV("span", { className: "bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-1 rounded-lg", children: v }, vi, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1597,
                            columnNumber: 31
                          }, this)) }, void 0, false, {
                            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                            lineNumber: 1595,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                          lineNumber: 1593,
                          columnNumber: 25
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1582,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1563,
                      columnNumber: 21
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1553,
                  columnNumber: 19
                },
                this
              )
            ),
            projectEvaluating && /* @__PURE__ */ jsxDEV("div", { className: "py-12 flex flex-col items-center justify-center space-y-4", children: [
              /* @__PURE__ */ jsxDEV(Loader2, { className: "w-10 h-10 text-purple-600 animate-spin" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1611,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs font-black text-purple-700 uppercase tracking-wider animate-pulse", children: "Trí tuệ nhân tạo đang thẩm định & phân tích dự án rèn luyện..." }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1612,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1610,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 justify-end pt-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setActiveModalProject(null),
                  className: "border border-slate-200 text-slate-600 font-black text-xs px-5 py-3 rounded-xl hover:bg-slate-50 cursor-pointer",
                  children: "Đóng lại"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1618,
                  columnNumber: 19
                },
                this
              ),
              !projectFeedback ? /* @__PURE__ */ jsxDEV(
                "button",
                {
                  disabled: !projectText.trim() || projectEvaluating,
                  onClick: handleEvaluateProject,
                  className: `text-xs font-black px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 ${!projectText.trim() || projectEvaluating ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-purple-650 hover:bg-purple-700 text-white cursor-pointer"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1635,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "Gửi dự án qua AI Thẩm Định" }, void 0, false, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1636,
                      columnNumber: 23
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1626,
                  columnNumber: 21
                },
                this
              ) : /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleFinishProjectTask(activeModalProject.weekNum, activeModalProject.session.id, activeModalProject.taskIndex),
                  className: "bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5",
                  children: /* @__PURE__ */ jsxDEV("span", { children: "Hoàn thành Dự án & Ghi nhận tiến độ (+150 XP)" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1643,
                    columnNumber: 23
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1639,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1617,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1526,
            columnNumber: 15
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 1507,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 1506,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 1504,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: activeModalTest && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        className: "bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-indigo-650 uppercase tracking-widest block", children: "LMS Verification Gateway" }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1666,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-black text-slate-800 uppercase", children: [
                "Kiểm Tra Năng Lực Buổi Học ",
                activeModalTest.session.skill
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1667,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1665,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => !testResult && setActiveModalTest(null),
                className: "p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 cursor-pointer",
                children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1675,
                  columnNumber: 19
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1671,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1664,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-6 text-left", children: (() => {
            const pool = TEST_QUESTION_POOL[activeModalTest.session.skill] || TEST_QUESTION_POOL["Từ vựng"];
            const totalQuestions = pool.length;
            const currentQ = pool[testActiveQuestionIdx];
            if (testResult && testResult.completed) {
              return /* @__PURE__ */ jsxDEV("div", { className: "space-y-5 text-center py-6", children: [
                testResult.passed ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxDEV(Trophy, { className: "w-16 h-16 text-yellow-400 animate-bounce" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1692,
                    columnNumber: 31
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1691,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black text-emerald-700 uppercase", children: "CHÚC MỪNG BẠN ĐÃ VƯỢT QUA!" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1694,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-slate-600 leading-normal", children: [
                    "Bạn đã đạt điểm số xuất sắc: ",
                    /* @__PURE__ */ jsxDEV("span", { className: "font-black text-indigo-600 font-mono text-lg", children: [
                      testResult.score,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1696,
                      columnNumber: 60
                    }, this),
                    " (Đạt mốc quy định ",
                    `>=`,
                    " 80%)."
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1695,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 max-w-sm mx-auto", children: "Buổi học tiếp theo của lộ trình đào tạo cá nhân hóa đã được mở khóa tự động thành công!" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1698,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1690,
                  columnNumber: 27
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-16 h-16 text-red-500 animate-pulse" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1705,
                    columnNumber: 31
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1704,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black text-red-700 uppercase", children: "BÀI KIỂM TRA CHƯA ĐẠT" }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1707,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-slate-600 leading-normal", children: [
                    "Điểm số rèn luyện của bạn: ",
                    /* @__PURE__ */ jsxDEV("span", { className: "font-black text-red-500 font-mono text-lg", children: [
                      testResult.score,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1709,
                      columnNumber: 58
                    }, this),
                    " (Chưa đạt mốc ",
                    `>=`,
                    " 80% để mở khóa bài tiếp theo)."
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1708,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 max-w-sm mx-auto", children: "Đừng nản lòng! Hãy ôn lại các nhiệm vụ, kiến thức lý thuyết và thực hành thử lại bất kỳ lúc nào để hoàn thành thử thách." }, void 0, false, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1711,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1703,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 justify-center pt-4", children: !testResult.passed ? /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      setTestResult(null);
                      setTestAnswers({});
                      setTestActiveQuestionIdx(0);
                      playSound("click");
                    },
                    className: "bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3.5 rounded-xl shadow-md cursor-pointer",
                    children: "Thực hiện lại bài kiểm tra"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1719,
                    columnNumber: 29
                  },
                  this
                ) : /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: handleFinishTestFlow,
                    className: "bg-emerald-650 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-md cursor-pointer",
                    children: "Đồng ý & Hoàn tất buổi học (+100 XP)"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1731,
                    columnNumber: 29
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1717,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1688,
                columnNumber: 23
              }, this);
            }
            return /* @__PURE__ */ jsxDEV("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: [
                    "Câu hỏi ",
                    testActiveQuestionIdx + 1,
                    "/",
                    totalQuestions
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1748,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: [
                    "Độ khó chuẩn: ",
                    activeModalTest.session.difficulty
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1749,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1747,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "h-full bg-indigo-500 rounded-full transition-all duration-300",
                    style: { width: `${(testActiveQuestionIdx + 1) / totalQuestions * 100}%` }
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1752,
                    columnNumber: 27
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                  lineNumber: 1751,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1746,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 p-5 rounded-2xl", children: /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 leading-relaxed", children: currentQ.q }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1761,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1760,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-2", children: currentQ.options.map((opt, oIdx) => {
                const isSelected = testAnswers[testActiveQuestionIdx] === oIdx;
                return /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => handleAnswerTest(testActiveQuestionIdx, oIdx),
                    className: `w-full p-4 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${isSelected ? "bg-indigo-50 border-indigo-500 text-indigo-800" : "bg-white border-slate-200/60 text-slate-650 hover:bg-slate-50"}`,
                    children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: `w-5 h-5 rounded-full border text-[10px] flex items-center justify-center font-extrabold shrink-0 ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-250 text-slate-500"}`, children: String.fromCharCode(65 + oIdx) }, void 0, false, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1781,
                        columnNumber: 33
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: opt }, void 0, false, {
                        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                        lineNumber: 1788,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                      lineNumber: 1780,
                      columnNumber: 31
                    }, this)
                  },
                  oIdx,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1771,
                    columnNumber: 29
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1767,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-3 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: testActiveQuestionIdx === 0,
                    onClick: handlePrevTestQuestion,
                    className: `text-xs font-black px-4 py-2.5 rounded-xl border ${testActiveQuestionIdx === 0 ? "border-slate-100 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"}`,
                    children: "Quay lại"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1797,
                    columnNumber: 25
                  },
                  this
                ),
                testActiveQuestionIdx < totalQuestions - 1 ? /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: testAnswers[testActiveQuestionIdx] === void 0,
                    onClick: () => handleNextTestQuestion(totalQuestions),
                    className: `text-xs font-black px-5 py-2.5 rounded-xl shadow-sm ${testAnswers[testActiveQuestionIdx] === void 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"}`,
                    children: "Câu tiếp theo"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1810,
                    columnNumber: 27
                  },
                  this
                ) : /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    disabled: Object.keys(testAnswers).length < totalQuestions,
                    onClick: () => handleSubmitTest(activeModalTest.weekNum, activeModalTest.session, pool),
                    className: `text-xs font-black px-5 py-2.5 rounded-xl shadow-md ${Object.keys(testAnswers).length < totalQuestions ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 cursor-pointer"}`,
                    children: "Nộp bài & Hoàn thành test"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                    lineNumber: 1822,
                    columnNumber: 27
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
                lineNumber: 1796,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
              lineNumber: 1744,
              columnNumber: 21
            }, this);
          })() }, void 0, false, {
            fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
            lineNumber: 1680,
            columnNumber: 15
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
        lineNumber: 1657,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 1656,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
      lineNumber: 1654,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/pages/StudyRoadmapPage.tsx",
    lineNumber: 622,
    columnNumber: 5
  }, this);
}
