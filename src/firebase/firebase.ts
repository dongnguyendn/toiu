import __custom_vite__cjsImport0_react from "react"; const useState = __custom_vite__cjsImport0_react["useState"]; const useEffect = __custom_vite__cjsImport0_react["useEffect"];
import { api } from "/src/api.ts";
export const firebaseConfig = {
  apiKey: "AIzaSyFakeKey_CEFR_Roadmap_392",
  authDomain: "cefr-roadmap-english.firebaseapp.com",
  projectId: "cefr-roadmap-english",
  storageBucket: "cefr-roadmap-english.appspot.com",
  messagingSenderId: "3819283912",
  appId: "1:3819283912:web:cefr39281a"
};
export function useFirebaseData() {
  const [srsReviews, setSrsReviews] = useState([]);
  const [goal, setGoal] = useState(null);
  const [weakness, setWeakness] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [srsRes, goalRes, weakRes] = await Promise.all([
        api.getSrsReviews(),
        api.getUserLearningGoals(),
        api.getWeaknessAnalysis()
      ]);
      if (srsRes && srsRes.success) {
        setSrsReviews(srsRes.reviews || []);
      }
      if (goalRes && goalRes.success) {
        setGoal(goalRes.goal || null);
      }
      if (weakRes) {
        setWeakness(weakRes);
      }
    } catch (err) {
      console.error("Failed to sync metrics from Firestore Service layer:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  const updateGoal = async (targetCount, months) => {
    try {
      const res = await api.updateUserLearningGoals(targetCount, months);
      if (res && res.success) {
        setGoal(res.goal);
        return res.goal;
      }
    } catch (err) {
      console.error("Error updating goal in firestore:", err);
    }
    return null;
  };
  const submitSrsReview = async (vocabularyId, rating) => {
    try {
      const res = await api.submitVocabularyProgress(vocabularyId, rating);
      const srsRes = await api.getSrsReviews();
      if (srsRes && srsRes.success) {
        setSrsReviews(srsRes.reviews || []);
      }
      return res;
    } catch (err) {
      console.error("Error submitting SRS evaluation:", err);
    }
  };
  return {
    srsReviews,
    goal,
    weakness,
    loading,
    refresh: fetchAllData,
    updateGoal,
    submitSrsReview
  };
}
