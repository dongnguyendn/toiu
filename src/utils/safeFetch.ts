export const DEFAULT_FALLBACKS = {
  "/api/vocabularies": {
    success: true,
    vocabularies: [
      { id: "voc_a1_1", level: "A1", word: "Hello", meaning: "Xin chào", pronunciation: "/həˈloʊ/", example: "Hello! My name is John.", audio: "Hello", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_a1_2", level: "A1", word: "Book", meaning: "Quyển sách", pronunciation: "/bʊk/", example: "She is reading an English book.", audio: "Book", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_a1_3", level: "A1", word: "Family", meaning: "Gia đình", pronunciation: "/ˈfæm.əl.i/", example: "I love my family very much.", audio: "Family", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_a1_4", level: "A1", word: "School", meaning: "Trường học", pronunciation: "/skuːl/", example: "They walk to school every morning.", audio: "School", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_a2_1", level: "A2", word: "Journey", meaning: "Cuộc hành trình", pronunciation: "/ˈdʒɜː.ni/", example: "The journey takes about three hours by train.", audio: "Journey", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_b1_1", level: "B1", word: "Decision", meaning: "Sự quyết định", pronunciation: "/dɪˈsɪʒ.ən/", example: "Making a decision is always difficult.", audio: "Decision", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_b2_1", level: "B2", word: "Academic", meaning: "Thuộc học thuật, hàn lâm", pronunciation: "/ˌæk.əˈdem.ɪk/", example: "She is doing deep academic research into linguistics.", audio: "Academic", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200" },
      { id: "voc_c1_1", level: "C1", word: "Ubiquitous", meaning: "Xuất hiện khắp nơi, phổ biến", pronunciation: "/juːˈbɪk.wɪ.təs/", example: "Cell phones are ubiquitous in modern society.", audio: "Ubiquitous", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  "/api/srs/reviews": {
    success: true,
    reviews: []
  },
  "/api/pronunciation/ipa": {
    success: true,
    ipaChart: {
      vowels: [
        { ipa: "i:", type: "long", description: "Nguyên âm dài. Căng môi sang hai bên rộng như đang cười, nâng lưỡi cao.", sampleWord: "see", translation: "nhìn thấy" },
        { ipa: "ɪ", type: "short", description: "Nguyên âm ngắn. Miệng hơi mở tự nhiên, âm bật dứt khoát.", sampleWord: "sit", translation: "ngồi" },
        { ipa: "e", type: "short", description: "Nguyên âm ngắn. Miệng mở nhẹ theo chiều dọc, cơ miệng lỏng.", sampleWord: "pen", translation: "bút viết" },
        { ipa: "æ", type: "short", description: "Nguyên âm bẹt. Hạ hàm sâu xuống, kéo căng mép sang hai bên.", sampleWord: "cat", translation: "con mèo" }
      ],
      consonants: [
        { ipa: "p", type: "voiceless", description: "Âm vô thanh. Mím chặt hai môi rồi bật hơi ra thật mạnh.", sampleWord: "pen", translation: "bút" },
        { ipa: "b", type: "voiced", description: "Âm hữu thanh. Mím chặt hai môi rồi bật hơi kết hợp rung thanh quản.", sampleWord: "boy", translation: "cậu bé" },
        { ipa: "t", type: "voiceless", description: "Âm vô thanh. Đặt đầu lưỡi sát nướu răng trên, bật hơi mạnh.", sampleWord: "tea", translation: "trà" },
        { ipa: "d", type: "voiced", description: "Âm hữu thanh. Đặt đầu lưỡi sát nướu răng trên, bật kết hợp rung họng.", sampleWord: "dog", translation: "con chó" }
      ]
    },
    pronunciationLessons: [
      { id: "ipa_short_i", name: "Nguyên âm ngắn /ɪ/", description: "Bắt âm ngắn trong từ 'sit', 'bit'. Mở môi tự nhiên, phát âm dứt khoát.", topic: "IPA Vowel", audioText: "sit" },
      { id: "ipa_long_i", name: "Nguyên âm dài /i:/", description: "Bắt âm dài trong từ 'see', 'meet'. Miệng căng sang hai bên như đang cười.", topic: "IPA Vowel", audioText: "see" }
    ]
  },
  "/api/conversations/scenarios": {
    success: true,
    scenarios: [
      {
        id: "sc_restaurant",
        title: "Tại Nhà Hàng (At the Restaurant)",
        character: "Waitress (Sarah)",
        situation: "Bạn muốn đặt bàn, gọi các món bít tết và tráng miệng, cũng như thanh toán hóa đơn bữa tối.",
        firstMessage: "Welcome to Bella Italia! Do you have a reservation for tonight, or would you like me to find you an available table?",
        starterSuggestions: [
          "I have a reservation for two under the name John.",
          "Could we have a table near the window, please?",
          "What do you recommend as today's special steak dish?"
        ]
      },
      {
        id: "sc_hotel",
        title: "Quầy Lễ Tân Khách Sạn (Hotel Check-In)",
        character: "Receptionist (Andrew)",
        situation: "Bạn đã book phòng Deluxe trực tuyến, bây giờ muốn nhận phòng, hỏi về mật khẩu Wi-Fi, và giờ ăn sáng.",
        firstMessage: "Good afternoon! Welcome to the Grand Plaza Resort. How may I assist you with your booking today?",
        starterSuggestions: [
          "Hi, I would like to check in. I have a booking under Michael.",
          "Is complimentary buffet breakfast included in my room package?"
        ]
      }
    ]
  },
  "/api/exams": {
    success: true,
    exams: [
      {
        id: "exm_ielts_1",
        title: "IELTS Academic Mock Practice - Test 1",
        type: "IELTS",
        durationMinutes: 180,
        questionsCount: 4,
        description: "Bao gồm đầy đủ các phần thi chính (Listening, Reading, Writing, Speaking).",
        sections: [
          {
            name: "Listening Section",
            prompt: "Nghe và trả lời câu hỏi: The speaker talks about green architecture.",
            passage: "Good morning class. Today we will examine how modern buildings integrate vertical gardens...",
            options: ["A. Aesthetic beauty", "B. Reducing heat", "C. Property prices"],
            correctAnswer: "B"
          }
        ]
      }
    ]
  },
  "/api/daily-tasks": {
    success: true,
    tasks: []
  },
  "/api/recommendations": {
    success: true,
    recommendations: []
  },
  "/api/leaderboard": {
    success: true,
    leaderboard: []
  },
  "/api/admin/stats": {
    success: true,
    stats: {
      totalStudents: 0,
      activeStudents: 0,
      completedLessons: 0,
      levelRatios: [],
      totalXpAwarded: 0
    }
  },
  "/api/admin/users": {
    success: true,
    users: []
  },
  "/api/admin/questions": {
    success: true,
    questions: []
  },
  "/api/admin/levels": {
    success: true,
    levels: []
  },
  "/api/admin/lessons": {
    success: true,
    lessons: []
  },
  "/api/exams/results": {
    success: true,
    results: []
  },
  "/api/practice/questions": {
    questions: []
  },
  "/api/smart-study-plan": {
    success: true,
    schedules: [],
    studySchedules: [],
    analysis: { totalSessionsPerWeek: 0, totalHoursPerWeek: 0, totalMinutesPerWeek: 0 },
    roadmap: { prediction: { days: 180, weeks: 24, months: 6 }, phases: [] },
    tasks: {},
    recommendation: { comment: "Lịch học tập." }
  },
  "/api/dashboard/stats": {
    stats: {
      listening: { averageScore: 0, accuracyRate: 0, completedLessons: 0 },
      speaking: { averageScore: 0, accuracyRate: 0, completedLessons: 0 },
      reading: { averageScore: 0, accuracyRate: 0, completedLessons: 0 },
      writing: { averageScore: 0, accuracyRate: 0, completedLessons: 0 },
      streakCount: 1,
      aiProgressReview: "Hãy rèn luyện đều đặn hằng ngày để AI đồng hành tiến bộ cùng bạn nhé!",
      weeklyActivity: [],
      achievements: []
    }
  }
};
export async function safeFetchJson(url: string, options?: any, customFallback?: any) {
  const cleanUrl = url.split("?")[0];
  const defaultFallback = DEFAULT_FALLBACKS[cleanUrl] || DEFAULT_FALLBACKS[url] || {};
  const fallback = customFallback !== void 0 ? customFallback : defaultFallback;
  console.log(`[SafeFetch Info] Fetching from: ${url}`);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.warn(`[SafeFetch Warning] Server returned Status ${response.status} for URL: ${url}. Gracefully falling back.`);
      return fallback;
    }
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType && !contentType.toLowerCase().includes("application/json")) {
      console.warn(`[SafeFetch Warning] Resource at ${url} returned contentType "${contentType}", expected JSON. Standard routing fallback (index.html) likely triggered. Gracefully falling back.`);
      return fallback;
    }
    const text = await response.text();
    if (!text || text.trim() === "") {
      console.warn(`[SafeFetch Warning] Empty response body returned for URL: ${url}. Gracefully falling back.`);
      return fallback;
    }
    if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")) {
      console.warn(`[SafeFetch Warning] Server returned HTML content instead of JSON for URL: ${url}. (Wildcard SPA routing caught nonexistent URL). Gracefully falling back.`);
      return fallback;
    }
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseErr) {
      console.warn(`[SafeFetch Warning] Failed to parse JSON body for URL: ${url}. Error:`, parseErr);
      return fallback;
    }
  } catch (error) {
    console.warn(`[SafeFetch Error] Failed to fetch or parse URL: ${url}. Network/Fetch exception:`, error);
    return fallback;
  }
}
