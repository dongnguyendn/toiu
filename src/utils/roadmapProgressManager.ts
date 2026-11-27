import { api } from "/src/api.ts";

export function getEnrichedTask(taskInput: any, session: any, tIdx: number, weekNum: number) {
  let title = "Nhiệm vụ";
  let description = "";
  let rawId = "";
  let skill = "";
  if (taskInput && typeof taskInput === "object") {
    title = taskInput.title || "Nhiệm vụ";
    description = taskInput.description || "";
    rawId = taskInput.id || "";
    skill = taskInput.skill || "";
  }
  const text = description ? `${title} - ${description}` : title;

  let moduleType = "reading";
  if (taskInput && typeof taskInput === "object" && taskInput.moduleType) {
    moduleType = taskInput.moduleType;
  }

  // Normalize/Standardize legacy module types
  if (moduleType === "pronunciation") {
    moduleType = "ipa";
  } else if (moduleType === "dialogue" || moduleType === "shadowing") {
    moduleType = "speaking";
  } else if (moduleType === "lesson_quiz") {
    moduleType = "quiz";
  }

  // Map to compatible legacy type and route variables
  let type = "reading";
  let route = "/practice/reading";

  if (moduleType === "vocabulary") {
    type = "vocabulary";
    route = "/practice/vocabulary";
  } else if (moduleType === "grammar") {
    type = "grammar";
    route = "/practice/grammar";
  } else if (moduleType === "listening") {
    type = "listening";
    route = "/practice/listening";
  } else if (moduleType === "reading") {
    type = "reading";
    route = "/practice/reading";
  } else if (moduleType === "writing") {
    type = "writing";
    route = "/practice/writing";
  } else if (moduleType === "ipa") {
    type = "ipa";
    route = "/practice/ipa";
  } else if (moduleType === "speaking") {
    type = "speaking";
    route = "/practice/speaking";
  } else if (moduleType === "project") {
    type = "project";
    route = "";
  } else if (moduleType === "quiz") {
    type = "mini-test";
    route = "/exam/mini-test";
  }

  let lessonId = 1;
  const sesMatch = (session.id || "").match(/ses(\d+)/i);
  if (sesMatch) {
    lessonId = parseInt(sesMatch[1]);
  } else {
    lessonId = tIdx % 5 + 1;
  }
  const tasksProgress = Array.isArray(session.tasksProgress) ? session.tasksProgress : [];
  const status = tasksProgress[tIdx] || "TODO";
  const xpReward = type === "mock" ? 50 : 15;
  let unlockCondition = "Có thể học ngay";
  if (tIdx > 0) {
    const prevTaskStatus = tasksProgress[tIdx - 1] || "TODO";
    if (prevTaskStatus !== "DONE") {
      unlockCondition = `Yêu cầu hoàn thành nhiệm vụ ${tIdx} trước`;
    }
  }
  const estimatedTime = typeof taskInput?.duration === "number" ? taskInput.duration : 15;

  return {
    id: rawId || `${session.id}_task_${tIdx}`,
    type,
    lessonId,
    weekId: weekNum,
    taskId: tIdx,
    moduleId: type,
    moduleType, // Stable unique module identifier
    route,
    difficulty: session.difficulty || "Medium",
    status,
    xpReward,
    unlockCondition,
    estimatedTime,
    title,
    description,
    text
  };
}

export function navigateToRoadmapTask(task: any, navigate: any) {
  if (!task) {
    console.error("[Roadmap Navigator] Task is missing.");
    return;
  }
  if (!task.moduleType) {
    console.error("[Roadmap Navigator] moduleType is missing.", task);
    return;
  }

  const moduleRouteMap: Record<string, string> = {
    vocabulary: "/practice/vocabulary",
    ipa: "/practice/ipa",
    grammar: "/practice/grammar",
    reading: "/practice/reading",
    listening: "/practice/listening",
    writing: "/practice/writing",
    speaking: "/practice/speaking",
    quiz: "/exam/mini-test"
  };

  const route = moduleRouteMap[task.moduleType];
  if (!route) {
    console.error("[Roadmap Navigator] Unsupported or invalid moduleType:", task.moduleType);
    return;
  }

  console.log(`[Roadmap Navigator] Navigating directly to ${task.moduleType} via route ${route}`);
  navigate(route, { state: { activeTaskRedirect: task } });
}

export function saveActiveTaskRedirect(task, weekNum, sessionId, taskIndex) {
  const redirectInfo = {
    type: task.type,
    lessonId: task.lessonId,
    weekNum,
    sessionId,
    taskIndex,
    id: task.id,
    route: task.route
  };
  localStorage.setItem("activeTaskRedirect", JSON.stringify(redirectInfo));
}
export async function checkAndCompleteActiveTask(taskType) {
  try {
    const stored = localStorage.getItem("activeTaskRedirect");
    if (!stored) return { success: false };
    const redirectInfo = JSON.parse(stored);
    if (redirectInfo && redirectInfo.type === taskType) {
      console.log(`[Roadmap Tracker] Auto-completing roadmap task: Week ${redirectInfo.weekNum}, Session ${redirectInfo.sessionId}, TaskIndex ${redirectInfo.taskIndex}`);
      const res = await api.completeRoadmapTask(
        redirectInfo.weekNum,
        redirectInfo.sessionId,
        redirectInfo.taskIndex
      );
      localStorage.removeItem("activeTaskRedirect");
      return { success: true, data: res };
    }
  } catch (err) {
    console.error("[Roadmap Tracker] Failed to complete active task:", err);
  }
  return { success: false };
}

export function handleBackToHome() {
  localStorage.removeItem("activeTaskRedirect");
  window.location.href = "/dashboard";
}

