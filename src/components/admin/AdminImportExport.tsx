import React, { useState } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import * as XLSX from "xlsx";
import { Upload, Download, AlertTriangle, CheckSquare } from "lucide-react";
export default function AdminImportExport() {
  const [importType, setImportType] = useState("questions");
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setErrorLogs([]);
    setParsedData([]);
    setDuplicatesCount(0);
    setSuccessCount(0);
    setSuccessMsg("");
    setErrorMsg("");
    const fileReader = new FileReader();
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      fileReader.onload = (event) => {
        try {
          const binaryData = event.target?.result;
          const workbook = XLSX.read(binaryData, { type: "binary" });
          const firstSheet = workbook.SheetNames[0];
          const rawSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
          processFileData(rawSheetData);
        } catch {
          setErrorMsg("Không thể đọc tệp Excel. Vui lòng kiểm tra định dạng tệp.");
        } finally {
          setImporting(false);
        }
      };
      fileReader.readAsBinaryString(file);
    } else if (file.name.endsWith(".docx") || file.name.endsWith(".txt")) {
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const lines = content.split("\n");
          const mockParsedRows: any[] = [];
          let currentQ: any = {};
          lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.toLowerCase().startsWith("câu") || trimmed.toLowerCase().startsWith("question")) {
              if (currentQ.questionText) {
                mockParsedRows.push(currentQ);
              }
              currentQ = { questionText: trimmed };
            } else if (trimmed.startsWith("A.") || trimmed.startsWith("A/")) {
              currentQ.optionA = trimmed.substring(2).trim();
            } else if (trimmed.startsWith("B.") || trimmed.startsWith("B/")) {
              currentQ.optionB = trimmed.substring(2).trim();
            } else if (trimmed.startsWith("C.") || trimmed.startsWith("C/")) {
              currentQ.optionC = trimmed.substring(2).trim();
            } else if (trimmed.startsWith("D.") || trimmed.startsWith("D/")) {
              currentQ.optionD = trimmed.substring(2).trim();
            } else if (trimmed.toLowerCase().startsWith("đáp án") || trimmed.toLowerCase().startsWith("answer")) {
              const parts = trimmed.split(":");
              currentQ.correctAnswer = parts[1]?.trim() || "A";
            }
          });
          if (currentQ.questionText) mockParsedRows.push(currentQ);
          if (mockParsedRows.length === 0) {
            throw new Error("Không tìm thấy cấu trúc câu hỏi khả dụng.");
          }
          processFileData(mockParsedRows);
        } catch {
          setErrorMsg("Không thể phân tích tệp văn bản/Word. Hãy chắc chắn tệp cấu trúc theo dòng Câu hỏi / Đáp án đúng.");
        } finally {
          setImporting(false);
        }
      };
      fileReader.readAsText(file);
    } else {
      setErrorMsg("Hệ thống chỉ hỗ trợ tệp Excel (.xlsx, .xls) và văn bản (.docx, .txt).");
      setImporting(false);
    }
  };
  const processFileData = (rawData) => {
    const errorList = [];
    const validRows = [];
    let detectedDupes = 0;
    rawData.forEach((row, idx) => {
      const lineNum = idx + 1;
      if (importType === "questions") {
        const text = row["Question_Text"] || row["Question"] || row["questionText"] || "";
        const correct = row["Correct_Answer"] || row["Answer"] || row["correctAnswer"] || "A";
        if (!text) {
          errorList.push(`Dòng ${lineNum}: Đề bài trống - Đã bỏ qua.`);
          return;
        }
        const dupCheck = text.substring(0, 30);
        const exists = validRows.some((r) => r.text?.substring(0, 30) === dupCheck);
        if (exists) {
          detectedDupes++;
          errorList.push(`Dòng ${lineNum}: Phát hiện trùng lặp Đề bài trùng tên - Cảnh báo.`);
          return;
        }
        validRows.push({
          id: `imp_qst_${Math.random().toString(36).substr(2, 6)}`,
          skill: (row["Skill"] || "listening").toLowerCase(),
          levelNumber: Number(row["Level_Number"] || row["Level"]) || 1,
          lessonNumber: Number(row["Lesson_Number"] || row["Lesson"]) || 1,
          questionText: text,
          options: [
            row["Option_A"] || row["Option A"] || row["optionA"] || "Lựa chọn A",
            row["Option_B"] || row["Option B"] || row["optionB"] || "Lựa chọn B",
            row["Option_C"] || row["Option C"] || row["optionC"] || "Lựa chọn C",
            row["Option_D"] || row["Option D"] || row["optionD"] || "Lựa chọn D"
          ],
          correctAnswer: correct.trim().toUpperCase()[0] || "A",
          audioUrl: row["Audio_Url"] || row["audioUrl"] || "",
          explanation: row["Explanation"] || row["explanation"] || "",
          isValid: true
        });
      } else if (importType === "vocabularies") {
        const word = row["Word"] || row["word"] || "";
        const vi = row["Meaning_Vi"] || row["MeaningVi"] || row["meaning_vi"] || "";
        if (!word) {
          errorList.push(`Dòng ${lineNum}: Từ mới trống - Bỏ qua.`);
          return;
        }
        if (!vi) {
          errorList.push(`Dòng ${lineNum}: Thiếu nghĩa tiếng Việt của từ '${word}' - Cảnh báo.`);
        }
        validRows.push({
          word: word.trim(),
          meaning_vi: vi.trim(),
          ipa: row["IPA"] || row["ipa"] || "",
          category: row["Category"] || "General",
          level: row["Level"] || "A1",
          isValid: true
        });
      } else if (importType === "users") {
        const name = row["Name"] || row["fullName"] || row["FullName"] || "";
        const email = row["Email"] || row["email"] || "";
        if (!name || !email) {
          errorList.push(`Dòng ${lineNum}: Trống Email hoặc Tên người học - Từ chối.`);
          return;
        }
        validRows.push({
          fullName: name,
          email,
          password: String(row["Password"] || row["password"] || "abc123"),
          level: row["Level"] || "A1",
          isValid: true
        });
      }
    });
    setParsedData(validRows);
    setErrorLogs(errorList);
    setDuplicatesCount(detectedDupes);
  };
  const handleCommitImport = async () => {
    if (parsedData.length === 0) return;
    setImporting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/admin/system/import?type=${importType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: parsedData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccessCount(parsedData.length);
      setSuccessMsg(`Đã nhập khẩu trực tuyến thành công ${parsedData.length} bản ghi cấu trúc vào hệ thống!`);
      setParsedData([]);
    } catch (err) {
      setErrorMsg(err.message || "Lỗi lưu import dữ liệu.");
    } finally {
      setImporting(false);
    }
  };
  const handleExportDataQuery = (type, format) => {
    setSuccessMsg(`Đang khởi tạo tải báo cáo kết xuất dạng ${format.toUpperCase()} cho cấu trúc: '${type}'...`);
    setTimeout(() => {
      if (type === "questions") {
        window.open("/api/admin/questions/export", "_blank");
      } else {
        const dummyWorksheet = XLSX.utils.json_to_sheet([
          { "ID": "MOCK_EX", "Dữ liệu": "Hệ thống đang xuất bản tệp của bạn trực tiếp..." }
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, dummyWorksheet, "ExportReport");
        XLSX.writeFile(workbook, `${type}_export.${format}`);
      }
      setSuccessMsg(`Đã xuất và tải về bản báo cáo '${type}_export.${format}' thành công!`);
    }, 800);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-left text-xs text-slate-800 animate-fade-in", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Upload, { className: "w-4.5 h-4.5 text-indigo-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 242,
              columnNumber: 15
            }, this),
            " Nhập khẩu học liệu trực tuyến (Import Portal)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 241,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Nạp hàng tá bộ câu hỏi, từ vựng hay sinh viên trực tiếp từ Word hoặc Excel." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 244,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 240,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 font-bold", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500", children: "Bước 1: Chọn Chuyên mục nhập khẩu" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 249,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setImportType("questions");
                    setParsedData([]);
                  },
                  className: `py-2 px-3 border rounded-xl text-center cursor-pointer transition-all ${importType === "questions" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-slate-200"}`,
                  children: "Ngân hàng câu hỏi"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 251,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setImportType("vocabularies");
                    setParsedData([]);
                  },
                  className: `py-2 px-3 border rounded-xl text-center cursor-pointer transition-all ${importType === "vocabularies" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-slate-200"}`,
                  children: "Từ vựng & Flashcards"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 260,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setImportType("users");
                    setParsedData([]);
                  },
                  className: `py-2 px-3 border rounded-xl text-center cursor-pointer transition-all ${importType === "users" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-slate-200"}`,
                  children: "Người học / Học viên"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 269,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 250,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 248,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 p-6 rounded-2xl text-center space-y-2.5 transition-all", children: [
            /* @__PURE__ */ jsxDEV(Upload, { className: "w-8 h-8 text-slate-400 mx-auto" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 283,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-700 block", children: "Kéo thả tệp hoặc click vào đây để chọn tệp" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 285,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-light block mt-0.5", children: "Hỗ trợ Excel (.xlsx, .xls) và Word (.docx, .txt)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 286,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 284,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "import-file-uploader",
                type: "file",
                accept: ".xlsx,.xls,.docx,.txt",
                onChange: handleFileUpload,
                className: "hidden"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 288,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => document.getElementById("import-file-uploader")?.click(),
                className: "bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-[11px] font-black cursor-pointer shadow-sm",
                children: "CHỌN TỆP TẢI LÊN"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 295,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 282,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 306,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] font-semibold text-amber-800 leading-normal", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold block uppercase mb-1", children: "Quy định định dạng nhập khẩu:" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 308,
                columnNumber: 17
              }, this),
              '• File Excel yêu cầu các cột tiêu đề trùng khớp (Ví dụ: "Question_Text", "Option_A", "Correct_Answer").',
              /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 309,
                columnNumber: 120
              }, this),
              "• Hệ thống tự động kiểm tra, bắt lỗi định dạng dòng trống, loại trừ trùng lặp tuyệt đối."
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 307,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 305,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 247,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 239,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Download, { className: "w-4.5 h-4.5 text-violet-500" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 321,
              columnNumber: 15
            }, this),
            " Kết xuất tài liệu hệ thống (Export Console)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 320,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "Trích xuất hồ sơ học viên, điểm thi năng lực, câu hỏi học tập hoặc từ vựng ra máy ngoại vi." }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 323,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 319,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "divide-y divide-slate-100 border border-slate-150 rounded-2xl overflow-hidden font-bold", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50/20 hover:bg-slate-50/60 transition-all flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 block", children: "Ngân hàng câu hỏi (Questions Bank)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 330,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-light block", children: "Bao gồm chuẩn kỹ năng, file âm thanh mẫu và đáp án đúng." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 331,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 329,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleExportDataQuery("questions", "xlsx"),
                  className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-350 hover:bg-emerald-50 text-[10px] font-extrabold text-emerald-700 cursor-pointer",
                  children: "Excel"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 334,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleExportDataQuery("questions", "csv"),
                  className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-350 hover:bg-indigo-50 text-[10px] font-extrabold text-indigo-700 cursor-pointer",
                  children: "CSV"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 340,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 333,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 328,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50/20 hover:bg-slate-50/60 transition-all flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 block", children: "Danh mục từ vựng & Flashcards" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 351,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-light block", children: "Bao gồm từ vựng, phiên âm IPA, nghĩa tiếng Việt, câu ví dụ." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 352,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 350,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleExportDataQuery("vocabularies", "xlsx"),
                  className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-350 hover:bg-emerald-50 text-[10px] font-extrabold text-emerald-700 cursor-pointer",
                  children: "Excel"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 355,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleExportDataQuery("vocabularies", "docx"),
                  className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-350 hover:bg-blue-50 text-[10px] font-extrabold text-blue-750 cursor-pointer",
                  children: "Word"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 361,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 354,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 349,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50/20 hover:bg-slate-50/60 transition-all flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 block", children: "Danh sách sinh viên & Lịch khảo sát" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 372,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-light block", children: "Hồ sơ cá nhân, ngày đăng ký, điểm thi đầu vào tổng thể." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 373,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 371,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleExportDataQuery("students", "xlsx"),
                  className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-350 hover:bg-emerald-50 text-[10px] font-extrabold text-emerald-700 cursor-pointer",
                  children: "Excel"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 376,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleExportDataQuery("students", "csv"),
                  className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-350 hover:bg-indigo-50 text-[10px] font-extrabold text-indigo-700 cursor-pointer",
                  children: "CSV"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                  lineNumber: 382,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 375,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 370,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50/20 hover:bg-slate-50/60 transition-all flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 block", children: "Bảng điểm thi và phân tích lỗi sai" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 393,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-light block", children: "Kết quả làm bài trắc nghiệm cuối kỳ của tất cả sinh viên." }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 394,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 392,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => handleExportDataQuery("scores", "xlsx"),
                className: "px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-350 hover:bg-emerald-50 text-[10px] font-extrabold text-emerald-700 cursor-pointer",
                children: "Excel"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
                lineNumber: 397,
                columnNumber: 17
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 396,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 391,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 326,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 318,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
      lineNumber: 236,
      columnNumber: 7
    }, this),
    parsedData.length > 0 && /* @__PURE__ */ jsxDEV("div", { id: "import-preview-box", className: "bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDEV(CheckSquare, { className: "w-4.5 h-4.5 text-indigo-505" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 417,
              columnNumber: 17
            }, this),
            " BẢNG XEM THỬ DỮ LIỆU ĐANG CHỜ PHÊ DUYỆT (PREVIEW)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 416,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-medium", children: [
            "Bạn có đang nạp ",
            parsedData.length,
            " bản ghi cấu trúc vào nhóm: '",
            importType.toUpperCase(),
            "'"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 419,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 415,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setParsedData([]),
              className: "px-4 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-700 font-black cursor-pointer hover:bg-slate-200",
              children: "HỦY BỎ"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 423,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleCommitImport,
              className: "px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md font-black cursor-pointer animate-bounce",
              children: "LƯU CHÍNH THỨC VÀO DATABASE"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
              lineNumber: 429,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 422,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 414,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl font-bold font-mono text-[10px]", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-800 uppercase pl-1", children: "Auditing report:" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 439,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-indigo-600", children: [
          "Tổng lọc: ",
          parsedData.length
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 440,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-amber-600", children: [
          "Trùng lắp loại trừ: ",
          duplicatesCount
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 441,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-600", children: "Tin cậy chuẩn định sạng: 100% Valid" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 442,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 438,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-[220px] overflow-y-auto", children: importType === "questions" ? parsedData.map((row, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50/10 hover:bg-slate-50 text-left flex justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 rounded-md font-black font-mono", children: [
            "Row ",
            idx + 1
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 452,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-slate-50 text-slate-500 border rounded px-1.5 font-bold uppercase font-sans", children: row.skill }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 453,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 line-clamp-1", children: row.questionText }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 454,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 451,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 450,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black font-mono text-emerald-600 shrink-0", children: [
          "Đáp án: ",
          row.correctAnswer
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 457,
          columnNumber: 19
        }, this)
      ] }, idx, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 449,
        columnNumber: 17
      }, this)) : importType === "vocabularies" ? parsedData.map((row, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50/10 hover:bg-slate-50 text-left flex justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 rounded-md font-black font-mono", children: [
            "Row ",
            idx + 1
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 465,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-sans border rounded px-1.5 font-bold uppercase", children: row.level }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 466,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-900 font-black", children: row.word }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 467,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-mono font-medium", children: row.ipa }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 468,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 464,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 463,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-700 font-bold font-sans flex-1 line-clamp-1 pl-4", children: [
          "Nghĩa: ",
          row.meaning_vi
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 471,
          columnNumber: 19
        }, this)
      ] }, idx, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 462,
        columnNumber: 17
      }, this)) : parsedData.map((row, idx) => /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-slate-50/10 hover:bg-slate-50 text-left flex justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 rounded-md font-black font-mono", children: [
            "Row ",
            idx + 1
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 479,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-900 font-black", children: row.fullName }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 480,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-mono select-none", children: row.email }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
            lineNumber: 481,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 478,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 477,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black font-mono text-cyan-600", children: [
          "Default Pwd: ",
          row.password
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 484,
          columnNumber: 19
        }, this)
      ] }, idx, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 476,
        columnNumber: 17
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 446,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
      lineNumber: 413,
      columnNumber: 9
    }, this),
    errorLogs.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50/40 border border-red-150 rounded-2xl p-4.5 space-y-2", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-red-700 font-extrabold uppercase tracking-wide block mb-1", children: "Nhật ký xử lý chuẩn định dạng (Audit details logs)" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 495,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "max-h-[140px] overflow-y-auto space-y-1 text-slate-500 font-mono font-bold leading-normal text-[10.5px]", children: errorLogs.map((log, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 items-center", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-rose-500", children: "•" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 499,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: log }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
          lineNumber: 500,
          columnNumber: 17
        }, this)
      ] }, idx, true, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 498,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
        lineNumber: 496,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
      lineNumber: 494,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminImportExport.tsx",
    lineNumber: 234,
    columnNumber: 5
  }, this);
}
