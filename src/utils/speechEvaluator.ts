export function levDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          // substitution
          Math.min(
            matrix[i][j - 1] + 1,
            // insertion
            matrix[i - 1][j] + 1
            // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
export function phonetize(w) {
  return w.toLowerCase().replace(/ck/g, "k").replace(/ph/g, "f").replace(/c(?=[eiy])/g, "s").replace(/c/g, "k").replace(/sh/g, "x").replace(/ch/g, "t").replace(/oo/g, "u").replace(/ea/g, "i").replace(/ee/g, "i").replace(/y/g, "i").replace(/gh/g, "f").replace(/tion/g, "xn").replace(/sion/g, "xn").replace(/wright/g, "rait").replace(/write/g, "rait").replace(/right/g, "rait").replace(/kn/g, "n").replace(/wr/g, "r").replace(/wh/g, "w");
}
export function getWordSimilarity(w1, w2) {
  if (!w1 || !w2) return 0;
  const clean1 = w1.toLowerCase().trim();
  const clean2 = w2.toLowerCase().trim();
  if (clean1 === clean2) return 100;
  const distance = levDistance(clean1, clean2);
  const maxLen = Math.max(clean1.length, clean2.length);
  const editSim = maxLen === 0 ? 100 : (1 - distance / maxLen) * 100;
  const p1 = phonetize(clean1);
  const p2 = phonetize(clean2);
  const pDistance = levDistance(p1, p2);
  const pMaxLen = Math.max(p1.length, p2.length);
  const phonSim = pMaxLen === 0 ? 100 : (1 - pDistance / pMaxLen) * 100;
  return Math.max(editSim, phonSim);
}
export function evaluateSpeakingText(targetText, spokenText) {
  const clean = (text) => {
    return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“]/g, "").replace(/\s+/g, " ").trim();
  };
  const targetClean = clean(targetText);
  const spokenClean = clean(spokenText);
  const targetWords = targetText.split(/\s+/).filter(Boolean);
  const cleanTargetWords = targetClean.split(" ").filter(Boolean);
  const cleanSpokenWords = spokenClean.split(" ").filter(Boolean);
  let lastSpokenIndex = -1;
  const wordScores = targetWords.map((originalWord, i) => {
    const cleanTWord = cleanTargetWords[i] || "";
    let bestScore = 0;
    let bestIdx = -1;
    let bestSpokenWord = "";
    for (let j = lastSpokenIndex + 1; j < cleanSpokenWords.length; j++) {
      const score = getWordSimilarity(cleanTWord, cleanSpokenWords[j]);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = j;
        bestSpokenWord = cleanSpokenWords[j];
      }
    }
    if (bestIdx !== -1 && bestScore >= 35) {
      lastSpokenIndex = bestIdx;
      const roundedScore = Math.round(bestScore);
      let status2 = "incorrect";
      let color2 = "#EF4444";
      let backgroundColor2 = "#FEE2E2";
      let label2 = "🔴 Đọc sai";
      if (roundedScore >= 85) {
        status2 = "correct";
        color2 = "#10B981";
        backgroundColor2 = "#D1FAE5";
        label2 = "🟢 Đọc đúng";
      } else if (roundedScore >= 60) {
        status2 = "almost";
        color2 = "#F59E0B";
        backgroundColor2 = "#FEF3C7";
        label2 = "🟡 Gần đúng";
      }
      return {
        word: originalWord,
        spoken: bestSpokenWord,
        score: roundedScore,
        status: status2,
        color: color2,
        backgroundColor: backgroundColor2,
        label: label2
      };
    } else {
      return {
        word: originalWord,
        spoken: null,
        score: 0,
        status: "incorrect",
        color: "#EF4444",
        backgroundColor: "#FEE2E2",
        label: "🔴 Đọc sai"
      };
    }
  });
  const overallScore = Math.round(
    wordScores.reduce((sum, w) => sum + w.score, 0) / Math.max(wordScores.length, 1)
  );
  let status = "incorrect";
  let label = "🔴 Đọc sai";
  let color = "#EF4444";
  let backgroundColor = "#FEE2E2";
  let feedback = "Chưa nhận diện đúng khẩu hình. Bạn hãy thử nghe kĩ từ mẫu rồi nhấn rõ âm nhé.";
  if (overallScore >= 85) {
    status = "correct";
    label = "🟢 Đọc đúng";
    color = "#10B981";
    backgroundColor = "#D1FAE5";
    feedback = "Tuyệt vời! Phát âm chuẩn xác, ngữ điệu tự nhiên mượt mà như người bản xứ.";
  } else if (overallScore >= 60) {
    status = "almost";
    label = "🟡 Gần đúng";
    color = "#F59E0B";
    backgroundColor = "#FEF3C7";
    feedback = "Khá tốt! Bạn đã phát âm gần đúng. Hãy chú ý các từ màu vàng/đỏ dể cải thiện.";
  }
  const mappedWordsCount = wordScores.filter((w) => w.spoken !== null).length;
  const wordRatio = mappedWordsCount / Math.max(targetWords.length, 1);
  const fluency = Math.round((0.4 + wordRatio * 0.6) * overallScore * 1.05);
  return {
    overallScore,
    accuracy: overallScore,
    fluency: Math.min(100, Math.max(30, fluency)),
    status,
    label,
    color,
    backgroundColor,
    words: wordScores,
    feedback
  };
}
