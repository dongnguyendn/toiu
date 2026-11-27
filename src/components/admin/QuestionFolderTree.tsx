import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"];
import { Folder, FolderOpen, Headphones, MessageSquare, BookOpen, PenTool, BookMarked, Award, Hash, Database, ChevronRight, Move } from "lucide-react";
const CEFR_LEVELS = [
  { num: 1, cefr: "A1", label: "Cấp độ A1 (Căn bản)", desc: "Căn bản" },
  { num: 2, cefr: "A2", label: "Cấp độ A2 (Sơ cấp)", desc: "Sơ cấp" },
  { num: 3, cefr: "B1", label: "Cấp độ B1 (Trung cấp)", desc: "Trung cấp" },
  { num: 4, cefr: "B2", label: "Cấp độ B2 (Bán chuyên)", desc: "Bán chuyên" },
  { num: 5, cefr: "C1", label: "Cấp độ C1 (Cao cấp)", desc: "Cao cấp" },
  { num: 6, cefr: "C2", label: "Cấp độ C2 (Bản ngữ)", desc: "Bản ngữ" }
];
const SKILL_TREE_NODES = [
  { value: "listening", label: "Listening", icon: Headphones, colorText: "text-blue-500" },
  { value: "speaking", label: "Speaking", icon: MessageSquare, colorText: "text-emerald-500" },
  { value: "reading", label: "Reading", icon: BookOpen, colorText: "text-pink-500" },
  { value: "writing", label: "Writing", icon: PenTool, colorText: "text-amber-500" },
  { value: "vocabulary", label: "Vocabulary", icon: BookMarked, colorText: "text-orange-500" },
  { value: "grammar", label: "Grammar", icon: Award, colorText: "text-violet-500" },
  { value: "ipa", label: "IPA Pronunciation", icon: Hash, colorText: "text-indigo-500" }
];
export default function QuestionFolderTree({
  questions,
  selectedNode,
  onSelectNode,
  onDropQuestion
}) {
  const [expandedLevels, setExpandedLevels] = useState({
    1: true
    // Expand A1 by default
  });
  const [expandedSkills, setExpandedSkills] = useState({});
  const [draggedOverNodeId, setDraggedOverNodeId] = useState(null);
  const totalCount = questions.length;
  const levelCounts = {};
  const skillCounts = {};
  const lessonCounts = {};
  questions.forEach((q) => {
    const lvl = Number(q.levelNumber) || 1;
    const skl = q.skill || "listening";
    const lsn = Number(q.lessonNumber) || 1;
    levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    const sklKey = `${lvl}-${skl}`;
    skillCounts[sklKey] = (skillCounts[sklKey] || 0) + 1;
    const lsnKey = `${lvl}-${skl}-${lsn}`;
    lessonCounts[lsnKey] = (lessonCounts[lsnKey] || 0) + 1;
  });
  const toggleLevel = (e, lvlNum) => {
    e.stopPropagation();
    setExpandedLevels((prev) => ({ ...prev, [lvlNum]: !prev[lvlNum] }));
  };
  const toggleSkill = (e, skillKey) => {
    e.stopPropagation();
    setExpandedSkills((prev) => ({ ...prev, [skillKey]: !prev[skillKey] }));
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    setDraggedOverNodeId(id);
  };
  const handleDragLeave = () => {
    setDraggedOverNodeId(null);
  };
  const handleDrop = (e, targetLevel, targetSkill, targetLesson) => {
    e.preventDefault();
    setDraggedOverNodeId(null);
    const qId = e.dataTransfer.getData("text/plain");
    if (qId) {
      onDropQuestion(qId, targetLevel, targetSkill, targetLesson);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border-b border-slate-200 px-4.5 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Database, { className: "w-4 h-4 text-indigo-600 animate-pulse" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
          lineNumber: 102,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-black uppercase tracking-wider text-slate-800", children: "CÂY THƯ MỤC LMS" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
          lineNumber: 103,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
        lineNumber: 101,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-black", children: [
        totalCount,
        " câu"
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
      lineNumber: 100,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "p-2 space-y-1 overflow-y-auto max-h-[640px] text-xs font-medium text-slate-700", children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          onClick: () => onSelectNode({ id: "root" }),
          className: `group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${selectedNode.id === "root" ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-extrabold" : "hover:bg-slate-50 text-slate-600"}`,
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "w-4 h-4 flex items-center justify-center text-indigo-600", children: "★" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                lineNumber: 121,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-extrabold tracking-wide uppercase", children: "TẤT CẢ HỌC LIỆU" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                lineNumber: 122,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
              lineNumber: 120,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-full font-bold", children: totalCount }, void 0, false, {
              fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
              lineNumber: 124,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
          lineNumber: 112,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 pt-1", children: CEFR_LEVELS.map((lvl) => {
        const isLvlExpanded = !!expandedLevels[lvl.num];
        const isLvlSelected = selectedNode.id === `lvl-${lvl.num}`;
        const lvlQCount = levelCounts[lvl.num] || 0;
        const lvlNodeId = `lvl-${lvl.num}`;
        return /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: `rounded-xl border border-transparent ${draggedOverNodeId === lvlNodeId ? "border-dashed border-indigo-500 bg-indigo-50/40 p-1" : ""}`,
            onDragOver: (e) => handleDragOver(e, lvlNodeId),
            onDragLeave: handleDragLeave,
            onDrop: (e) => handleDrop(e, lvl.num, "listening", 1),
            children: [
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  onClick: () => onSelectNode({ level: lvl.num, id: lvlNodeId }),
                  className: `group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${isLvlSelected ? "bg-indigo-600 text-white font-extrabold shadow-sm" : "hover:bg-slate-100/80 text-slate-800"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: (e) => toggleLevel(e, lvl.num),
                          className: `p-0.5 rounded hover:bg-slate-200/50 flex items-center justify-center transition-transform ${isLvlExpanded ? "rotate-90" : ""}`,
                          children: /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3.5 h-3.5" }, void 0, false, {
                            fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                            lineNumber: 163,
                            columnNumber: 23
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                          lineNumber: 157,
                          columnNumber: 21
                        },
                        this
                      ),
                      isLvlExpanded ? /* @__PURE__ */ jsxDEV(FolderOpen, { className: `w-4 h-4 shrink-0 ${isLvlSelected ? "text-white" : "text-yellow-500"}` }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                        lineNumber: 166,
                        columnNumber: 23
                      }, this) : /* @__PURE__ */ jsxDEV(Folder, { className: `w-4 h-4 shrink-0 ${isLvlSelected ? "text-white" : "text-yellow-500"}` }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                        lineNumber: 168,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "truncate font-black tracking-tight text-[11.5px]", children: [
                        "CEFR ",
                        lvl.cefr
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                        lineNumber: 170,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-semibold opacity-75 hidden group-hover:inline`, children: [
                        "(",
                        lvl.desc,
                        ")"
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                        lineNumber: 171,
                        columnNumber: 21
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                      lineNumber: 156,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "span",
                      {
                        className: `text-[9.5px] px-1.5 py-0.2 rounded-full font-extrabold ${isLvlSelected ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`,
                        children: lvlQCount
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                        lineNumber: 176,
                        columnNumber: 19
                      },
                      this
                    )
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                  lineNumber: 148,
                  columnNumber: 17
                },
                this
              ),
              isLvlExpanded && /* @__PURE__ */ jsxDEV("div", { className: "pl-5 pr-1.5 py-1 space-y-1 border-l border-slate-100 ml-3.5 mt-0.5", children: SKILL_TREE_NODES.map((skl) => {
                const sklKey = `${lvl.num}-${skl.value}`;
                const isSklExpanded = !!expandedSkills[sklKey];
                const isSklSelected = selectedNode.id === `skl-${sklKey}`;
                const sklQCount = skillCounts[sklKey] || 0;
                const sklNodeId = `skl-${sklKey}`;
                const SkillIcon = skl.icon;
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: `rounded-lg border border-transparent ${draggedOverNodeId === sklNodeId ? "border-dashed border-indigo-500 bg-indigo-50/40 p-0.5" : ""}`,
                    onDragOver: (e) => handleDragOver(e, sklNodeId),
                    onDragLeave: handleDragLeave,
                    onDrop: (e) => handleDrop(e, lvl.num, skl.value, 1),
                    children: [
                      /* @__PURE__ */ jsxDEV(
                        "div",
                        {
                          onClick: () => onSelectNode({ level: lvl.num, skill: skl.value, id: sklNodeId }),
                          className: `group/skill flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all ${isSklSelected ? "bg-indigo-100 text-indigo-800 font-extrabold" : "hover:bg-slate-50 text-slate-700"}`,
                          children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                              /* @__PURE__ */ jsxDEV(
                                "button",
                                {
                                  onClick: (e) => toggleSkill(e, sklKey),
                                  className: `p-0.5 rounded hover:bg-slate-200/50 flex items-center justify-center transition-transform ${isSklExpanded ? "rotate-90" : ""}`,
                                  children: /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-3 h-3 text-slate-400" }, void 0, false, {
                                    fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                                    lineNumber: 223,
                                    columnNumber: 33
                                  }, this)
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                                  lineNumber: 217,
                                  columnNumber: 31
                                },
                                this
                              ),
                              /* @__PURE__ */ jsxDEV(SkillIcon, { className: `w-3.5 h-3.5 shrink-0 ${skl.colorText}` }, void 0, false, {
                                fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                                lineNumber: 225,
                                columnNumber: 31
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { className: "truncate text-[11px] font-bold", children: skl.label }, void 0, false, {
                                fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                                lineNumber: 226,
                                columnNumber: 31
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                              lineNumber: 216,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-slate-100 text-slate-500 px-1 rounded-full font-bold", children: sklQCount }, void 0, false, {
                              fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                              lineNumber: 229,
                              columnNumber: 29
                            }, this)
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                          lineNumber: 206,
                          columnNumber: 27
                        },
                        this
                      ),
                      isSklExpanded && /* @__PURE__ */ jsxDEV("div", { className: "pl-5 py-0.5 space-y-0.5 border-l border-slate-100 ml-2.5 mt-0.5", children: [1, 2, 3, 4, 5, 11, 12].map((lsnNum) => {
                        const lsnKey = `${lvl.num}-${skl.value}-${lsnNum}`;
                        const isLsnSelected = selectedNode.id === `lsn-${lsnKey}`;
                        const lsnQCount = lessonCounts[lsnKey] || 0;
                        const lsnNodeId = `lsn-${lsnKey}`;
                        const labelText = lsnNum >= 11 ? `Phần Test ${lsnNum - 10}` : `Lesson ${lsnNum}`;
                        return /* @__PURE__ */ jsxDEV(
                          "div",
                          {
                            onDragOver: (e) => handleDragOver(e, lsnNodeId),
                            onDragLeave: handleDragLeave,
                            onDrop: (e) => handleDrop(e, lvl.num, skl.value, lsnNum),
                            onClick: (e) => {
                              e.stopPropagation();
                              onSelectNode({
                                level: lvl.num,
                                skill: skl.value,
                                lesson: lsnNum,
                                id: lsnNodeId
                              });
                            },
                            className: `flex items-center justify-between p-1 px-2 rounded-md cursor-pointer transition-all ${isLsnSelected ? "bg-slate-900 text-white font-extrabold shadow-sm" : draggedOverNodeId === lsnNodeId ? "bg-indigo-100/90 text-indigo-750 font-extrabold scale-[1.02]" : "hover:bg-slate-100 text-slate-600 text-[10.5px]"}`,
                            children: [
                              /* @__PURE__ */ jsxDEV("span", { className: "truncate", children: [
                                "├ ",
                                labelText
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                                lineNumber: 267,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV(
                                "span",
                                {
                                  className: `text-[8px] font-black px-1 rounded ${isLsnSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`,
                                  children: lsnQCount
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                                  lineNumber: 268,
                                  columnNumber: 37
                                },
                                this
                              )
                            ]
                          },
                          lsnNum,
                          true,
                          {
                            fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                            lineNumber: 245,
                            columnNumber: 35
                          },
                          this
                        );
                      }) }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                        lineNumber: 236,
                        columnNumber: 29
                      }, this)
                    ]
                  },
                  skl.value,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                    lineNumber: 197,
                    columnNumber: 25
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
                lineNumber: 187,
                columnNumber: 19
              }, this)
            ]
          },
          lvl.num,
          true,
          {
            fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
            lineNumber: 138,
            columnNumber: 15
          },
          this
        );
      }) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
        lineNumber: 130,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
      lineNumber: 110,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-auto p-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl", children: /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-medium italic leading-relaxed flex items-center gap-1", children: [
      /* @__PURE__ */ jsxDEV(Move, { className: "w-3.5 h-3.5 text-indigo-500 shrink-0" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
        lineNumber: 295,
        columnNumber: 11
      }, this),
      "Kéo thả câu hỏi từ bảng bên phải thả vào thư mục/bài học bên trái để chuyển nhanh!"
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
      lineNumber: 294,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
      lineNumber: 293,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/QuestionFolderTree.tsx",
    lineNumber: 99,
    columnNumber: 5
  }, this);
}
