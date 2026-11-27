import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  moduleName: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary] Captured crash in "${this.props.moduleName}":`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-105 rounded-2xl max-w-md mx-auto text-center shadow-lg my-8 animate-fade-in">
          <div className="flex justify-center mb-3">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-base font-semibold text-red-950 mb-1">
            Không thể khởi tạo {this.props.moduleName}
          </h2>
          <p className="text-xs text-red-700/90 mb-4 max-w-sm mx-auto leading-relaxed">
            Hợp phần này tạm thời gặp lỗi hoặc không tìm thấy trường dữ liệu. Toàn bộ các hệ thống học tập cốt lõi khác vẫn hoạt động bình thường.
          </p>
          <div className="text-left bg-red-100/50 p-3 rounded-xl border border-red-100 mb-4 max-h-24 overflow-y-auto font-mono text-[10px] text-red-900 leading-tight">
            <strong>Thông báo kịch bản:</strong>{" "}
            {this.state.error?.message || "Lỗi cú pháp."}
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Khởi động lại hợp phần
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
