import { collection, doc, writeBatch, getDocs } from "firebase/firestore";
import { db } from "/src/firebase.ts";
export const TEST_QUESTIONS = [
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
    writingPrompt: "Express your strong desire to improve your English listening skills for your professional work.",
    audioUrl: ""
  },
  {
    id: "wrt_1_1_2",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Explain how studying persistently for at least thirty minutes everyday brings surprising results.",
    audioUrl: ""
  },
  {
    id: "wrt_1_1_3",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Describe how a quiet learning environment helps allocate your mental energy comfortably during exam preparation.",
    audioUrl: ""
  },
  {
    id: "wrt_1_1_4",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a complete English sentence:",
    writingPrompt: "Describe how an AI context-analyzer tool helps you build a custom-tailored personalized study plan.",
    audioUrl: ""
  },
  {
    id: "wrt_1_1_5",
    skill: "writing",
    levelNumber: 1,
    lessonNumber: 1,
    questionText: "Write a short paragraph of 30-50 words in English explaining why learning a foreign language is crucial in the modern digital era.",
    writingPrompt: "Why is English important in today's era? (Write 30-50 words)",
    audioUrl: ""
  }
];
export async function runFirebaseMigration() {
  try {
    const questionsCol = collection(db, "questions");
    const snapshot = await getDocs(questionsCol);
    const existingIds = new Set(snapshot.docs.map((i) => i.id));
    let batch = writeBatch(db);
    let count = 0;
    for (const q of TEST_QUESTIONS) {
      if (!existingIds.has(q.id)) {
        const qRef = doc(db, "questions", q.id);
        const qAny = q as any;
        const normalized = {
          ...q,
          isPlacement: true,
          options: qAny.options || [],
          correctAnswer: qAny.correctAnswer || "",
          explanation: qAny.explanation || "",
          subject: qAny.subject || "General",
          grade: qAny.grade || "",
          examId: null,
          difficulty: "medium",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        batch.set(qRef, normalized);
        count++;
        if (count % 400 === 0) {
          await batch.commit();
          batch = writeBatch(db);
        }
      }
    }
    if (count % 400 !== 0) {
      await batch.commit();
    }
    console.log(`[Migration] Hoàn tất. Đã thêm ${count} câu hỏi hardcode vào Firestore.`);
    return true;
  } catch (error) {
    console.error("[Migration] Lỗi khi chạy migration:", error);
    return false;
  }
}
