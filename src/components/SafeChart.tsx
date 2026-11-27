import { jsxDEV } from "react/jsx-dev-runtime";
import { useElementSize } from "/src/hooks/useElementSize.ts";
export function LoadingChart() {
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full min-h-[250px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-3 animate-pulse", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" }, void 0, false, {
      fileName: "/app/applet/src/components/SafeChart.tsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed", children: "Đang khớp kích thước biểu đồ..." }, void 0, false, {
      fileName: "/app/applet/src/components/SafeChart.tsx",
      lineNumber: 8,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/SafeChart.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this);
}
export function EmptyState({ message }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full min-h-[250px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-6 text-center space-y-2", children: [
    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-350 text-xs uppercase tracking-wider block", children: "CHƯA ĐỦ SỐ LIỆU ĐỂ HIỂN THỊ" }, void 0, false, {
      fileName: "/app/applet/src/components/SafeChart.tsx",
      lineNumber: 16,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-400 font-semibold leading-normal max-w-xs block", children: message || "Hãy hoàn thành thêm các bài học hoặc nhiệm vụ để AI của chúng tôi phân tích thống kê." }, void 0, false, {
      fileName: "/app/applet/src/components/SafeChart.tsx",
      lineNumber: 17,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/SafeChart.tsx",
    lineNumber: 15,
    columnNumber: 5
  }, this);
}
export function SafeChartContainer({ children, height, data, emptyMessage }) {
  const [containerRef, { width, height: elementHeight }] = useElementSize();
  if (data) {
    if (!Array.isArray(data) || data.length === 0) {
      return /* @__PURE__ */ jsxDEV(EmptyState, { message: emptyMessage }, void 0, false, {
        fileName: "/app/applet/src/components/SafeChart.tsx",
        lineNumber: 37,
        columnNumber: 14
      }, this);
    }
  }
  return /* @__PURE__ */ jsxDEV("div", { ref: containerRef, className: "w-full", style: { height: `${height}px` }, children: width <= 0 || elementHeight <= 0 ? /* @__PURE__ */ jsxDEV(LoadingChart, {}, void 0, false, {
    fileName: "/app/applet/src/components/SafeChart.tsx",
    lineNumber: 44,
    columnNumber: 9
  }, this) : children({ width, height: elementHeight }) }, void 0, false, {
    fileName: "/app/applet/src/components/SafeChart.tsx",
    lineNumber: 42,
    columnNumber: 5
  }, this);
}
