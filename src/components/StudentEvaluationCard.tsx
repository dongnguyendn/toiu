import React, { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Award,
} from "lucide-react";

interface SkillMetric {
  averageScore?: number;
  accuracyRate?: number;
  completedLessons?: number;
  totalTopics?: number;
}

interface StudentEvaluationCardProps {
  user: any;
  stats: any;
  plan: any;
  placementTest: any;
  onOpenRoadmap: () => void;
}

interface EvaluatedSkill {
  key: string;
  label: string;
  score10: number;
  percent: number;
  completedLessons: number;
  hasData: boolean;
  ratingLabel: string;
  ratingClass: string;
  barClass: string;
}

function getSkillRating(score10: number, hasData: boolean) {
  if (!hasData) {
    return {
      label: "Chưa luyện",
      textClass: "text-slate-400",
      barClass: "bg-slate-300",
    };
  }
  if (score10 >= 8.0) {
    return {
      label: "Tốt",
      textClass: "text-emerald-700",
      barClass: "bg-emerald-500",
    };
  }
  if (score10 >= 6.5) {
    return {
      label: "Khá",
      textClass: "text-indigo-700",
      barClass: "bg-indigo-500",
    };
  }
  if (score10 >= 5.0) {
    return {
      label: "Trung bình",
      textClass: "text-amber-700",
      barClass: "bg-amber-500",
    };
  }
  return {
    label: "Cần cải thiện",
    textClass: "text-rose-700",
    barClass: "bg-rose-500",
  };
}

function getCefrTierName(level: string): string {
  const upper = (level || "A1").toUpperCase();
  switch (upper) {
    case "A1":
      return "Mới bắt đầu";
    case "A2":
      return "Sơ cấp";
    case "B1":
      return "Trung cấp";
    case "B2":
      return "Trung cấp khá";
    case "C1":
      return "Cao cấp";
    case "C2":
      return "Thông thạo";
    default:
      return "Nền tảng";
  }
}

function getOverallStanding(compositePercent: number, hasAnyEvaluationData: boolean) {
  if (!hasAnyEvaluationData) {
    return {
      rank: "Khởi đầu",
      subtext: "Chưa có điểm bài tập",
      toneClass: "text-slate-700",
    };
  }
  if (compositePercent >= 85) {
    return {
      rank: "Xuất sắc",
      subtext: `Độ chính xác ${compositePercent}%`,
      toneClass: "text-emerald-700",
    };
  }
  if (compositePercent >= 70) {
    return {
      rank: "Khá tốt",
      subtext: `Độ chính xác ${compositePercent}%`,
      toneClass: "text-indigo-700",
    };
  }
  if (compositePercent >= 50) {
    return {
      rank: "Đạt yêu cầu",
      subtext: `Độ chính xác ${compositePercent}%`,
      toneClass: "text-amber-700",
    };
  }
  return {
    rank: "Cần rèn luyện",
    subtext: `Độ chính xác ${compositePercent}%`,
    toneClass: "text-rose-700",
  };
}

function getPaceSummary(paceStatus?: string, completedSessions = 0) {
  if (completedSessions === 0) {
    return { label: "Đang khởi động", toneClass: "text-slate-500" };
  }
  if (paceStatus === "ahead") {
    return { label: "Vượt tiến độ", toneClass: "text-emerald-700" };
  }
  if (paceStatus === "behind") {
    return { label: "Cần tăng tốc", toneClass: "text-amber-700" };
  }
  return { label: "Đúng tiến độ", toneClass: "text-indigo-700" };
}

export default function StudentEvaluationCard({
  user,
  stats,
  plan,
  placementTest,
  onOpenRoadmap,
}: StudentEvaluationCardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "skills">("overview");

  const cefrLevel = (stats?.cefrLevel || placementTest?.level || user?.level || "A1").toUpperCase();
  const ieltsBand =
    stats?.ieltsBand && stats.ieltsBand !== "Chưa đủ dữ liệu"
      ? stats.ieltsBand
      : getCefrTierName(cefrLevel);

  const roadmapStats = plan?.roadmap?.stats || {};
  const totalSessions = Number(roadmapStats.totalSessions || 0);
  const completedSessions = Number(roadmapStats.completedSessions || 0);
  const completionPercentage = Number(stats?.completionPercentage || 0);
  const pace = getPaceSummary(roadmapStats.paceStatus, completedSessions);

  const rawSkills: Array<{ key: string; label: string; metric?: SkillMetric }> = [
    { key: "listening", label: "Nghe (Listening)", metric: stats?.listening },
    { key: "speaking", label: "Nói (Speaking)", metric: stats?.speaking },
    { key: "reading", label: "Đọc (Reading)", metric: stats?.reading },
    { key: "writing", label: "Viết (Writing)", metric: stats?.writing },
    { key: "grammar", label: "Ngữ pháp (Grammar)", metric: stats?.grammar },
  ];

  const evaluatedSkills: EvaluatedSkill[] = rawSkills.map(({ key, label, metric }) => {
    const score10 = Number(metric?.averageScore || 0);
    const completedLessons = Number(metric?.completedLessons || 0);
    const hasData = completedLessons > 0 || score10 > 0;
    const percent = hasData ? Math.min(100, Math.round(score10 * 10)) : 0;
    const rating = getSkillRating(score10, hasData);

    return {
      key,
      label,
      score10,
      percent,
      completedLessons,
      hasData,
      ratingLabel: rating.label,
      ratingClass: rating.textClass,
      barClass: rating.barClass,
    };
  });

  const practicedSkills = evaluatedSkills.filter((s) => s.hasData);
  const accuracyOverall = Number(stats?.accuracyRateOverall || 0);
  const placementScore = typeof placementTest?.score === "number" ? placementTest.score : null;
  const hasAnyEvaluationData =
    practicedSkills.length > 0 || accuracyOverall > 0 || (placementScore !== null && placementScore > 0);

  const compositePercent =
    accuracyOverall > 0
      ? accuracyOverall
      : practicedSkills.length > 0
      ? Math.round(
          practicedSkills.reduce((sum, item) => sum + item.percent, 0) / practicedSkills.length
        )
      : placementScore ?? 0;

  const standing = getOverallStanding(compositePercent, hasAnyEvaluationData);

  // Derive real strengths text
  const sortedByScoreDesc = [...practicedSkills].sort((a, b) => b.score10 - a.score10);
  const strongestSkill = sortedByScoreDesc[0];
  const weakestSkill =
    practicedSkills.length > 1
      ? sortedByScoreDesc[sortedByScoreDesc.length - 1]
      : evaluatedSkills.find((s) => !s.hasData);

  const learnedVocab = Number(stats?.learnedVocabularyCount || 0);
  const totalVocab = Number(stats?.totalVocabularyCount || 0);
  const completedLessons = Number(stats?.completedLessonsCount || 0);
  const totalLessons = Number(stats?.totalLessonsCount || 0);
  const streakDays = Number(roadmapStats.streakDays || stats?.streakCount || 0);
  const srsDueCount = Number(stats?.srsDueCount || 0);

  const strengthsText =
    placementTest?.strengths ||
    (strongestSkill
      ? `Kỹ năng nổi bật hiện tại là ${strongestSkill.label} với điểm trung bình ${strongestSkill.score10.toFixed(1)}/10 qua ${strongestSkill.completedLessons} bài đạt yêu cầu.`
      : learnedVocab > 0
      ? `Đã chủ động tích lũy ${learnedVocab} từ vựng ở trình độ ${cefrLevel} và duy trì nhịp học đều đặn.`
      : `Đã thiết lập lộ trình cá nhân hóa ở trình độ ${cefrLevel}. Hãy hoàn thành bài luyện tập đầu tiên để hệ thống ghi nhận điểm mạnh nổi trội.`);

  const weaknessesText =
    placementTest?.weaknesses ||
    (weakestSkill && weakestSkill.hasData && weakestSkill.score10 < 7.0
      ? `Nên ưu tiên củng cố ${weakestSkill.label} (hiện đạt ${weakestSkill.score10.toFixed(1)}/10)${
          srsDueCount > 0 ? ` và ôn lại ${srsDueCount} từ vựng đến hạn SRS.` : "."
        }`
      : weakestSkill && !weakestSkill.hasData
      ? `Chưa có dữ liệu luyện tập ở kỹ năng ${weakestSkill.label}. Nên bổ sung vào các buổi học sắp tới để phát triển đồng đều.`
      : `Cần duy trì luyện tập đều đặn 4 kỹ năng Nghe - Nói - Đọc - Viết và mở rộng vốn từ vựng trình độ ${cefrLevel}.`);

  const evaluationReviewText =
    stats?.aiProgressReview ||
    `Học viên đang ở trình độ ${cefrLevel} (${getCefrTierName(cefrLevel)}). Hãy bám sát lịch học đã đăng ký để nâng cao độ chính xác và tốc độ hoàn thành mục tiêu.`;

  return (
    <div className="bg-white border border-slate-200/60 rounded-[2.2rem] p-6 md:p-8 shadow-sm space-y-5">
      {/* Header + Segmented View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase">
            <ClipboardCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>ĐÁNH GIÁ HỌC SINH</span>
          </h3>
          <p className="text-xs text-slate-400 font-semibold">
            Tổng hợp năng lực hiện tại, điểm mạnh và định hướng cải thiện
          </p>
        </div>

        <div
          className="inline-flex items-center p-1 bg-slate-100 rounded-xl self-start shrink-0"
          role="tablist"
          aria-label="Chế độ xem đánh giá học sinh"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "overview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tổng quan
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "skills"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Kỹ năng
          </button>
        </div>
      </div>

      {/* 3-Column Academic Standing Strip */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/70 border border-slate-100 rounded-2xl py-3.5 px-2">
        <div className="px-2.5 space-y-0.5">
          <span className="block text-[11px] font-semibold text-slate-500">Trình độ</span>
          <span className="block text-xl font-black text-indigo-700 tabular-nums leading-tight">
            {cefrLevel}
          </span>
          <span className="block text-[11px] font-medium text-slate-500 truncate">
            {ieltsBand}
          </span>
        </div>

        <div className="px-2.5 space-y-0.5">
          <span className="block text-[11px] font-semibold text-slate-500">Xếp loại</span>
          <span className={`block text-base font-black leading-tight pt-0.5 ${standing.toneClass}`}>
            {standing.rank}
          </span>
          <span className="block text-[11px] font-medium text-slate-500 tabular-nums truncate">
            {standing.subtext}
          </span>
        </div>

        <div className="px-2.5 space-y-0.5">
          <span className="block text-[11px] font-semibold text-slate-500">Tiến độ</span>
          <span className="block text-xl font-black text-slate-800 tabular-nums leading-tight">
            {totalSessions > 0 ? `${completedSessions}/${totalSessions}` : `${completionPercentage}%`}
          </span>
          <span className={`block text-[11px] font-semibold truncate ${pace.toneClass}`}>
            {pace.label}
          </span>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <div className="space-y-3.5">
          {/* Strengths */}
          <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <h4 className="text-xs font-extrabold tracking-tight">Điểm mạnh nổi bật</h4>
            </div>
            <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
              {strengthsText}
            </p>
          </div>

          {/* Areas to Improve */}
          <div className="bg-amber-50/50 border border-amber-100/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <h4 className="text-xs font-extrabold tracking-tight">Cần ưu tiên cải thiện</h4>
            </div>
            <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
              {weaknessesText}
            </p>
          </div>

          {/* System Evaluation Comment */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-800">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <h4 className="text-xs font-extrabold tracking-tight">Nhận xét định kỳ</h4>
            </div>
            <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">
              {evaluationReviewText}
            </p>
          </div>

          {/* Quiet Unboxed Metadata Footer */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium pt-0.5 tabular-nums">
            <span>
              Từ vựng: <strong className="text-slate-700">{learnedVocab}/{totalVocab || 120}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Bài học: <strong className="text-slate-700">{completedLessons}/{totalLessons || 44}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Chuỗi học: <strong className="text-slate-700">{streakDays} ngày</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="divide-y divide-slate-100">
            {evaluatedSkills.map((skill) => (
              <div key={skill.key} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex items-baseline gap-1.5">
                    <span className="text-[13px] font-bold text-slate-800 truncate">
                      {skill.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium tabular-nums shrink-0">
                      · {skill.completedLessons} bài đạt
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 tabular-nums">
                    <span className="text-xs font-black text-slate-800">
                      {skill.hasData ? `${skill.score10.toFixed(1)}/10` : "--"}
                    </span>
                    <span className={`text-[11px] font-bold ${skill.ratingClass}`}>
                      {skill.ratingLabel}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${skill.barClass}`}
                    style={{ width: `${skill.hasData ? Math.max(8, skill.percent) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Extra real metrics if present */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium tabular-nums">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {placementScore !== null
                  ? `Đánh giá đầu vào: ${placementScore}/100 (${placementTest?.level || cefrLevel})`
                  : `Trình độ mục tiêu đang theo học: ${cefrLevel}`}
              </span>
            </div>
            {typeof stats?.aiPronunciationAverage === "number" && (
              <span>
                Phát âm: <strong className="text-slate-700">{stats.aiPronunciationAverage}%</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation CTA to Full Roadmap */}
      <button
        type="button"
        onClick={onOpenRoadmap}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-5 rounded-2xl text-[12.5px] transition-all cursor-pointer shadow-md active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 whitespace-nowrap"
      >
        <span>Xem lộ trình học đầy đủ</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
}
