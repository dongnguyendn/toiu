import __custom_vite__cjsImport0_react_jsxDevRuntime from "react/jsx-dev-runtime"; const jsxDEV = __custom_vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __custom_vite__cjsImport1_react from "react"; const useState = __custom_vite__cjsImport1_react["useState"]; const useEffect = __custom_vite__cjsImport1_react["useEffect"];
import { api } from "/src/api.ts";
import { Search, Trash2, Edit2, Lock, Unlock, Eye, CheckSquare, Square, X, UserPlus, Clock, Award, ShieldAlert } from "lucide-react";
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dbUserCount, setDbUserCount] = useState(0);
  const [adminUserCount, setAdminUserCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("A1");
  const [role, setRole] = useState("student");
  const [isLocked, setIsLocked] = useState(false);
  const [xp, setXp] = useState(0);
  const [userDetailProgress, setUserDetailProgress] = useState([]);
  const [userDetailSrs, setUserDetailSrs] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true);
    if (!silent) setError("");
    try {
      const res = await api.getAdminUsers();
      const userList = (res.users || []).map((u) => ({
        ...u,
        _id: u._id || u.id || "",
        id: u.id || u._id || ""
      }));
      setUsers(userList);
      setDbUserCount(res.totalInDb || userList.length);
      setAdminUserCount(userList.length);
    } catch (err) {
      console.error(err);
      if (!silent) {
        setError("Không thể nạp danh sách học viên từ nguồn dữ liệu cơ sở.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };
  const handleManualSync = async () => {
    setSyncing(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đồng bộ dữ liệu thật.");
      setSuccess(`🔄 Đồng bộ học viên thành công! Cơ sở dữ liệu chứa ${data.dbUserCount} tài khoản người dùng thực.`);
      await fetchUsers(true);
    } catch (err) {
      setError(err.message || "Lỗi đồng bộ hóa dữ liệu từ nguồn.");
    } finally {
      setSyncing(false);
    }
  };
  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers(true);
    }, 1500);
    return () => clearInterval(intervalId);
  }, []);
  const handleOpenDetail = async (user) => {
    setSelectedUserDetail(user);
    setDetailLoading(true);
    try {
      const progressList = await api.getUserProgress();
      setUserDetailProgress(progressList.filter((p) => p.userId === user.id) || []);
      const srsRes = await api.getVocabularyProgress();
      setUserDetailSrs((srsRes.progress || []).filter((s) => s.userId === user.id) || []);
    } catch {
    } finally {
      setDetailLoading(false);
    }
  };
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!fullName || !email || !password) {
      setError("Vui lòng điền đầy đủ Họ và tên, Email và Mật khẩu.");
      return;
    }
    const payload = {
      fullName,
      email,
      password,
      level,
      role,
      isLocked,
      xp: Number(xp)
    };
    console.log("[DEBUG - CRUD] Khởi chạy thêm học viên mới...");
    console.log("[DEBUG - CRUD] API Endpoint: POST /api/admin/users");
    console.log("[DEBUG - CRUD] Payload gửi đi:", payload);
    try {
      const res = await api.createAdminUser(payload);
      console.log("[DEBUG - CRUD] Response nhận về từ máy chủ:", res);
      if (!res.success) {
        throw new Error(res.error || "Lỗi tạo tài khoản");
      }
      setSuccess(`Đã tạo thành công tài khoản học viên mới: ${fullName}`);
      setShowAddForm(false);
      resetForm();
      if (res.user) {
        const mappedUser = {
          ...res.user,
          _id: res.user._id || res.user.id || "",
          id: res.user.id || res.user._id || ""
        };
        setUsers((prev) => [mappedUser, ...prev]);
      }
      console.log("[DEBUG - CRUD] Tải lại danh sách học viên sau khi thêm thành công...");
      await fetchUsers(true);
    } catch (err) {
      console.error("[DEBUG - CRUD] Lỗi khi thêm học viên:", err);
      setError(err.message || "Lỗi tạo tài khoản học viên.");
    }
  };
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setError("");
    setSuccess("");
    const updates: any = {
      fullName,
      email,
      level,
      role,
      isLocked,
      xp: Number(xp)
    };
    if (password) updates.password = password;
    console.log(`[DEBUG - CRUD] Khởi chạy cập nhật thông tin học viên ID: ${editingUser.id}...`);
    console.log(`[DEBUG - CRUD] API Endpoint: PUT /api/admin/users/${editingUser.id}`);
    console.log("[DEBUG - CRUD] Trọng tải cập nhật:", updates);
    try {
      const user = await api.updateAdminUser(editingUser.id, updates);
      console.log("[DEBUG - CRUD] Response nhận về từ máy chủ (User mới):", user);
      setSuccess(`Cập nhật thông tin học viên ${fullName} thành công!`);
      setEditingUser(null);
      resetForm();
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : u));
      console.log("[DEBUG - CRUD] Tải lại danh sách học viên sau khi sửa thành công...");
      await fetchUsers(true);
    } catch (err) {
      console.error("[DEBUG - CRUD] Lỗi khi cập nhật học viên:", err);
      setError(err.message || "Lỗi cập nhật người dùng.");
    }
  };
  const handleEditClick = (user) => {
    console.log("[DEBUG - CRUD] Bấm nút Sửa học viên:", user);
    setEditingUser(user);
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setPassword("");
    setLevel(user.level || "A1");
    setRole(user.role || "student");
    setIsLocked(!!user.isLocked);
    setXp(user.xp || 0);
    setShowAddForm(false);
  };
  const openDeleteConfirm = (student) => {
    console.log("STUDENT_SELECTED_FOR_DELETE:", student);
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };
  const cancelDelete = () => {
    console.log("[DEBUG - CRUD] Đã hủy thao tác xóa tại hộp thoại custom modal.");
    setStudentToDelete(null);
    setIsDeleteModalOpen(false);
  };
  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    const studentId = studentToDelete._id || studentToDelete.id || "";
    const studentName = studentToDelete.fullName;
    const endpoint = `/api/students/${studentId}`;
    console.log("DELETE_STUDENT_ID:", studentId);
    console.log("DELETE_ENDPOINT:", endpoint);
    if (!studentId) {
      alert("Không tìm thấy ID học sinh cần xóa");
      return;
    }
    try {
      setIsDeleting(true);
      setError("");
      setSuccess("");
      const ok = await api.deleteAdminUser(studentId);
      console.log(`[DEBUG - CRUD] Trạng thái xóa kết quả từ API: ${ok}`);
      if (ok) {
        alert("Xóa học sinh thành công");
        setSuccess(`Đã xóa vĩnh viễn tài khoản của ${studentName}`);
        const updatedUsers = users.filter((u) => u.id !== studentId && u._id !== studentId);
        setUsers(updatedUsers);
        console.log("STUDENTS_AFTER_DELETE:", updatedUsers);
        setSelectedUserIds((prev) => prev.filter((uid) => uid !== studentId));
        setStudentToDelete(null);
        setIsDeleteModalOpen(false);
        console.log("[DEBUG - CRUD] Tải lại danh sách học viên sau khi xóa thành công...");
        await fetchUsers(true);
      } else {
        throw new Error("Lỗi máy chủ không thể thực thi hành động.");
      }
    } catch (err) {
      console.error("DELETE_STUDENT_ERROR:", err);
      alert("Xóa học sinh thất bại. Vui lòng kiểm tra lại.");
      setError(err.message || "Không thể thực hiện xóa học viên.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleToggleSelectUser = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds((prev) => prev.filter((uid) => uid !== id));
    } else {
      setSelectedUserIds((prev) => [...prev, id]);
    }
  };
  const handleToggleSelectAll = (filteredUsers2) => {
    if (selectedUserIds.length === filteredUsers2.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers2.map((u) => u.id));
    }
  };
  const handleBulkDelete = async () => {
    console.log(`[DEBUG - CRUD] Khởi chạy xóa hàng loạt học viên. IDs tuyển chọn:`, selectedUserIds);
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedUserIds.length} học viên đã chọn cùng lúc? Hành động này không thể khôi phục!`)) {
      console.log("[DEBUG - CRUD] Đã hủy thao tác xóa hàng loạt tại hộp thoại xác nhận.");
      return;
    }
    setError("");
    setSuccess("");
    console.log("[DEBUG - CRUD] Đang gọi API POST đến /api/admin/users/bulk-delete...");
    try {
      const res = await api.bulkDeleteAdminUsers(selectedUserIds);
      console.log("[DEBUG - CRUD] Kết quả phản hồi xóa hàng loạt:", res);
      if (!res.success) throw new Error(res.error || "Lỗi xóa hàng loạt.");
      setSuccess(`Đã xóa thành công ${selectedUserIds.length} tài khoản người dùng!`);
      setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
      console.log("[DEBUG - CRUD] Tải lại danh sách học viên sau khi xóa hàng loạt thành công...");
      await fetchUsers(true);
    } catch (err) {
      console.error("[DEBUG - CRUD] Gặp lỗi khi xóa hàng loạt học viên:", err);
      setError(err.message || "Lỗi trong quá trình xóa hàng loạt.");
    }
  };
  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setLevel("A1");
    setRole("student");
    setIsLocked(false);
    setXp(0);
  };
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || u.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || u.level === levelFilter;
    const matchesStatus = statusFilter === "all" || statusFilter === "locked" && u.isLocked || statusFilter === "active" && !u.isLocked || statusFilter === "admin" && u.role === "admin";
    return matchesSearch && matchesLevel && matchesStatus;
  });
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 text-red-700 py-3 px-4 rounded-xl text-xs flex items-center justify-between border border-red-100", children: [
      /* @__PURE__ */ jsxDEV("span", { children: error }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 379,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setError(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 380,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 380,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 378,
      columnNumber: 9
    }, this),
    success && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 text-emerald-700 py-3 px-4 rounded-xl text-xs flex items-center justify-between border border-emerald-100", children: [
      /* @__PURE__ */ jsxDEV("span", { children: success }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 385,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setSuccess(""), children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 386,
        columnNumber: 50
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 386,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 384,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 394,
            columnNumber: 13
          }, this),
          "Trạng thái nguồn dữ liệu gốc"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 393,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-505 font-semibold leading-normal", children: [
          "Hệ thống Admin được cấu hình lấy trực tiếp dữ liệu từ ",
          /* @__PURE__ */ jsxDEV("code", { className: "text-indigo-600 font-mono bg-indigo-50 px-1 py-0.5 rounded", children: "db.json" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 398,
            columnNumber: 67
          }, this),
          " để đảm bảo tính đồng bộ thời gian thực."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 397,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 392,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-8 items-center justify-around md:justify-center border-y md:border-y-0 md:border-x border-slate-100 py-3 md:py-0", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-0.5", children: "DATABASE THẬT" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 404,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-slate-800 font-mono", children: [
            dbUserCount,
            " tài khoản"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 405,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 403,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-0.5 font-mono", children: "ĐANG HIỂN THỊ" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 408,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-lg font-black text-indigo-600 font-mono", children: [
            adminUserCount,
            " tài khoản"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 409,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 407,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 402,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleManualSync,
          disabled: syncing,
          className: "w-full md:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer cursor-action hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
          children: /* @__PURE__ */ jsxDEV("span", { children: syncing ? "Đang quét hệ thống..." : "🔄 ĐỒNG BỘ HỌC VIÊN" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 419,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 414,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 413,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 391,
      columnNumber: 7
    }, this),
    dbUserCount !== adminUserCount && /* @__PURE__ */ jsxDEV("div", { className: "bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 text-xs flex items-center gap-3 shadow-xs", children: [
      /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-5 h-5 text-rose-600 shrink-0" }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 426,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("strong", { className: "block font-black uppercase text-[10px] tracking-wider mb-0.5", children: "CẢNH BÁO MẤT ĐỒNG BỘ CHỈ SỐ" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 428,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-rose-600 text-[11px]", children: "Admin chưa đồng bộ đầy đủ dữ liệu người dùng." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 429,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 427,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 425,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row gap-2 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "relative w-full md:w-72", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxDEV(Search, { className: "w-4 h-4" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 441,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 440,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "search-user-input",
              type: "text",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Tìm kiếm theo Tên, Email, ID...",
              className: "w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 443,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 439,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "select",
          {
            id: "filter-user-level",
            value: levelFilter,
            onChange: (e) => setLevelFilter(e.target.value),
            className: "px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-750 focus:outline-none",
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Tất cả Cấp độ (CEFR)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 460,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "A1", children: "A1 - Elementary" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 461,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "A2", children: "A2 - Pre-Intermediate" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 462,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "B1", children: "B1 - Intermediate" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 463,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "B2", children: "B2 - Upper-Intermediate" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 464,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "C1", children: "C1 - Advanced" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 465,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "C2", children: "C2 - Proficient" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 466,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 454,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "select",
          {
            id: "filter-user-status",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-755 focus:outline-none",
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Mọi trạng thái" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 476,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "active", children: "Kích hoạt (Active)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 477,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "locked", children: "Bị khóa (Locked)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 478,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "admin", children: "Quản trị viên (Admin)" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 479,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 470,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 437,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "btn-admin-add-user-modal",
          onClick: () => {
            resetForm();
            setEditingUser(null);
            setShowAddForm(!showAddForm);
          },
          className: "bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:translate-y-0.5",
          children: [
            /* @__PURE__ */ jsxDEV(UserPlus, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 492,
              columnNumber: 11
            }, this),
            " THÊM HỌC VIÊN MỚI"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 483,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 435,
      columnNumber: 7
    }, this),
    (showAddForm || editingUser) && /* @__PURE__ */ jsxDEV("div", { id: "user-form-container", className: "bg-slate-50 border border-slate-200 rounded-3xl p-6 transition-all space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center border-b border-slate-200 pb-3", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black uppercase text-slate-900 tracking-wider", children: editingUser ? `CẬP NHẬT TÀI KHOẢN: ${editingUser.fullName}` : "THÊM TÀI KHOẢN HỌC VIÊN MỚI" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 501,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setShowAddForm(false);
              setEditingUser(null);
              resetForm();
            },
            className: "p-1 text-slate-400 hover:text-slate-600 rounded bg-slate-200 cursor-pointer",
            children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 512,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 504,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 500,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: editingUser ? handleEditUserSubmit : handleAddUserSubmit, className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-xs", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Họ và Tên" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 519,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "userform-fullname",
              type: "text",
              required: true,
              value: fullName,
              onChange: (e) => setFullName(e.target.value),
              placeholder: "Nguyễn Văn A",
              className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 520,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 518,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Email đăng nhập" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 532,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "userform-email",
              type: "email",
              required: true,
              value: email,
              disabled: !!editingUser,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "nguyenvana@gmail.com",
              className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 533,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 531,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: [
            "Mật khẩu ",
            editingUser && "(Để trống nếu giữ nguyên)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 546,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "userform-password",
              type: "text",
              required: !editingUser,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: editingUser ? "••••••••" : "Nhập mật khẩu",
              className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 547,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 545,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Trình độ Ban đầu (CEFR)" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 559,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              id: "userform-level",
              value: level,
              onChange: (e) => setLevel(e.target.value),
              className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none text-slate-900",
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "A1", children: "A1 - Elementary" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 566,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "A2", children: "A2 - Pre-Intermediate" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 567,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "B1", children: "B1 - Intermediate" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 568,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "B2", children: "B2 - Upper-Intermediate" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 569,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "C1", children: "C1 - Advanced" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 570,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "C2", children: "C2 - Proficient" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 571,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 560,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 558,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Phân quyền hệ thống" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 576,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              id: "userform-role",
              value: role,
              onChange: (e) => setRole(e.target.value),
              className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none text-slate-900",
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "student", children: "Student (Học sinh)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 583,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "teacher", children: "Teacher (Giáo viên)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 584,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "admin", children: "Administrator (Quản trị viên)" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 585,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 577,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 575,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-slate-500 font-bold", children: "Xác nhận XP ban đầu" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 590,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "userform-xp",
              type: "number",
              value: xp,
              onChange: (e) => setXp(Number(e.target.value)),
              className: "w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none text-slate-900"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 591,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 589,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-3 flex justify-between items-center sm:pt-2 border-t border-slate-250", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "userform-locked",
                type: "checkbox",
                checked: isLocked,
                onChange: (e) => setIsLocked(e.target.checked),
                className: "w-4.5 h-4.5 accent-rose-600 rounded cursor-pointer"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 602,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("label", { htmlFor: "userform-locked", className: "text-xs text-rose-700 font-extrabold cursor-pointer flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 610,
                columnNumber: 19
              }, this),
              " Vô hiệu hóa / Khóa tài khoản ngay lập tức"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 609,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 601,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              id: "btn-userform-submit",
              type: "submit",
              className: "bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-md transition-all active:translate-y-0.5",
              children: editingUser ? "CẬP NHẬT THÔNG TIN" : "TẠO TÀI KHOẢN HỌC VIÊN"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 614,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 600,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 516,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 499,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 px-5 py-3.5 border-b border-slate-100 flex justify-between items-center text-xs", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 font-semibold text-slate-500", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handleToggleSelectAll(filteredUsers),
              className: "text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer",
              children: [
                selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 ? /* @__PURE__ */ jsxDEV(CheckSquare, { className: "w-4.5 h-4.5 text-cyan-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 638,
                  columnNumber: 17
                }, this) : /* @__PURE__ */ jsxDEV(Square, { className: "w-4.5 h-4.5 text-slate-400" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 640,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-bold", children: [
                  "Chọn tất cả (",
                  filteredUsers.length,
                  ")"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 642,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 633,
              columnNumber: 13
            },
            this
          ),
          selectedUserIds.length > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] px-2 py-0.5 rounded-md bg-cyan-15 text-cyan-700 border border-cyan-100 font-extrabold animate-pulse", children: [
            "Đã chọn ",
            selectedUserIds.length,
            " học viên"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 646,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 632,
          columnNumber: 11
        }, this),
        selectedUserIds.length > 0 && /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "btn-admin-bulk-delete-users",
            onClick: handleBulkDelete,
            className: "text-red-600 font-extrabold hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer cursor-destructive",
            children: [
              /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 658,
                columnNumber: 15
              }, this),
              " XÓA ",
              selectedUserIds.length,
              " HỌC VIÊN ĐÃ CHỌN"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 653,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 631,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-[11px] text-left border-collapse", children: [
        /* @__PURE__ */ jsxDEV("thead", { className: "bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100", children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 w-10 text-center", children: "Chọn" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 668,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4", children: "Học viên (Họ tên / Username / ID)" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 669,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4", children: "Email & Trạng thái" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 670,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4", children: "Mốc thời gian (Đăng ký / Đăng nhập)" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 671,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 text-center", children: "CEFR / XP" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 672,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 text-center", children: "Thống kê học tập (B.học / Từ / Đề / Điểm TB)" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 673,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "py-3 px-4 text-right", children: "Hành động" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 674,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 667,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 666,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-100 text-slate-700 font-medium", children: loading ? /* @__PURE__ */ jsxDEV("tr", { children: /* @__PURE__ */ jsxDEV("td", { colSpan: 7, className: "text-center py-10 text-slate-450 leading-relaxed font-bold uppercase tracking-wider", children: "Đang kết nối dữ liệu máy chủ..." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 680,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 679,
          columnNumber: 17
        }, this) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxDEV("tr", { children: /* @__PURE__ */ jsxDEV("td", { colSpan: 7, className: "text-center py-10 text-slate-400 font-semibold leading-relaxed", children: "Không tìm thấy học viên nào khớp với bộ lọc dữ liệu." }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 684,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 683,
          columnNumber: 17
        }, this) : filteredUsers.map((u) => {
          const isUserSelected = selectedUserIds.includes(u.id);
          const completedLessons = u.completedLessons || 0;
          const vocabCount = u.vocabCount || 0;
          const testsCount = u.testsCount || 0;
          const avgScore = u.avgScore || 0;
          const username = u.username || (u.email ? u.email.split("@")[0] : "n/a");
          const lastLoginAt = u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Chưa ghi nhận";
          const createdAt = u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "12/06/2026";
          return /* @__PURE__ */ jsxDEV(
            "tr",
            {
              className: `hover:bg-slate-50/55 transition-colors ${u.isLocked ? "bg-rose-50/5 text-slate-450" : ""}`,
              children: [
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4 text-center align-middle", children: /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => handleToggleSelectUser(u.id),
                    className: "text-slate-400 hover:text-slate-600 transition-all cursor-pointer",
                    children: isUserSelected ? /* @__PURE__ */ jsxDEV(CheckSquare, { className: "w-4.5 h-4.5 text-indigo-600" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 712,
                      columnNumber: 29
                    }, this) : /* @__PURE__ */ jsxDEV(Square, { className: "w-4.5 h-4.5 text-slate-300" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 714,
                      columnNumber: 29
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 707,
                    columnNumber: 25
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 706,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-900 text-xs", children: u.fullName }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 722,
                      columnNumber: 29
                    }, this),
                    u.role === "admin" && /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-black uppercase px-2 py-0.5 bg-red-500 text-white rounded leading-none select-none", children: "Admin" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 724,
                      columnNumber: 31
                    }, this),
                    u.role === "teacher" && /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-black uppercase px-2 py-0.5 bg-purple-600 text-white rounded leading-none select-none", children: "Teacher" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 727,
                      columnNumber: 31
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 721,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-indigo-600 block font-bold font-mono", children: [
                    "@",
                    username
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 730,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] text-slate-400 block font-mono", children: [
                    "ID: ",
                    u.id
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 731,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 720,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 719,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4 align-middle", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-705 block break-all font-semibold font-mono", children: u.email }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 737,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: u.isLocked ? /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[8px] font-black text-rose-700 bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded leading-none select-none uppercase", children: [
                    /* @__PURE__ */ jsxDEV(Lock, { className: "w-2.5 h-2.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 741,
                      columnNumber: 33
                    }, this),
                    " Bị khóa"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 740,
                    columnNumber: 31
                  }, this) : /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-0.5 text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded leading-none select-none uppercase", children: [
                    /* @__PURE__ */ jsxDEV(Unlock, { className: "w-2.5 h-2.5" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 745,
                      columnNumber: 33
                    }, this),
                    " Kích hoạt"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 744,
                    columnNumber: 31
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 738,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 736,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 735,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4 align-middle text-slate-500 font-mono text-[10px]", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    "Đăng ký: ",
                    /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700", children: createdAt }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 754,
                      columnNumber: 41
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 754,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "text-[9px] text-slate-400", children: [
                    "Đăng nhập: ",
                    /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-600", children: lastLoginAt }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 755,
                      columnNumber: 81
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 755,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 753,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 752,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4 text-center align-middle", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-2 py-0.5 select-none leading-none block w-max mx-auto font-mono", children: u.level || "A1" }, void 0, false, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 761,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono font-black text-amber-500 block", children: [
                    u.xp || 0,
                    " XP"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 764,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 760,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 759,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4 text-center align-middle font-mono", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-1 text-[9px] items-center text-slate-600 min-w-[210px]", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 p-1 rounded-md text-center", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[7.5px] text-slate-450 block font-bold leading-none uppercase mb-0.5", children: "Bài học" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 773,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-black text-slate-850 text-xs", children: completedLessons }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 774,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 772,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 p-1 rounded-md text-center", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[7.5px] text-slate-450 block font-bold leading-none uppercase mb-0.5", children: "Từ vựng" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 777,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-black text-slate-850 text-xs", children: vocabCount }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 778,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 776,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-100 p-1 rounded-md text-center", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[7.5px] text-slate-450 block font-bold leading-none uppercase mb-0.5", children: "Đề thi" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 781,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-black text-slate-850 text-xs", children: testsCount }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 782,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 780,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-indigo-50/55 border border-indigo-100/60 p-1 rounded-md text-center", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[7.5px] text-indigo-500 block font-black leading-none uppercase mb-0.5", children: "Điểm TB" }, void 0, false, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 785,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-black text-indigo-750 text-xs", children: [
                      avgScore,
                      "%"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 786,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                    lineNumber: 784,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 771,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 770,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "py-4 px-4 text-right align-middle", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: `btn-studetail-open-${u.id}`,
                      onClick: () => handleOpenDetail(u),
                      className: "p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center bg-white",
                      title: "Xem chi tiết học viên",
                      children: /* @__PURE__ */ jsxDEV(Eye, { className: "w-3.5 h-3.5" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                        lineNumber: 799,
                        columnNumber: 29
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 793,
                      columnNumber: 27
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: `btn-stu-edit-open-${u.id}`,
                      onClick: () => handleEditClick(u),
                      className: "p-2 border border-slate-200 hover:border-emerald-350 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-xl transition-all cursor-pointer flex items-center justify-center bg-white",
                      title: "Sửa học viên",
                      children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-3.5 h-3.5" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                        lineNumber: 807,
                        columnNumber: 29
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 801,
                      columnNumber: 27
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      id: `btn-stu-delete-open-${u.id}`,
                      onClick: () => openDeleteConfirm(u),
                      className: "p-2 border border-slate-200 hover:border-red-350 hover:bg-red-50/50 text-slate-450 hover:text-red-750 rounded-xl transition-all cursor-pointer flex items-center justify-center bg-white",
                      title: "Xóa học viên",
                      children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
                        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                        lineNumber: 815,
                        columnNumber: 29
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                      lineNumber: 809,
                      columnNumber: 27
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 792,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 791,
                  columnNumber: 23
                }, this)
              ]
            },
            u.id,
            true,
            {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 700,
              columnNumber: 21
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 677,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 665,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 664,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 628,
      columnNumber: 7
    }, this),
    selectedUserDetail && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-[100] animate-fade-in", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl p-6 relative flex flex-col justify-between animate-slide-left border-l border-slate-200", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedUserDetail(null),
          className: "absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 text-slate-500 rounded-2xl cursor-pointer",
          children: /* @__PURE__ */ jsxDEV(X, { className: "w-5 h-5" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 838,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 834,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 items-center border-b border-slate-100 pb-5 pt-3 text-left", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white text-base font-black border border-slate-200 relative uppercase", children: [
            /* @__PURE__ */ jsxDEV("span", { children: selectedUserDetail.fullName ? selectedUserDetail.fullName.substring(0, 2).toUpperCase() : "HV" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 846,
              columnNumber: 19
            }, this),
            selectedUserDetail.role === "admin" && /* @__PURE__ */ jsxDEV("span", { className: "absolute bottom-0 right-0 bg-rose-600 text-white rounded-full p-0.5 text-[8px] leading-none select-none", children: "👑" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 848,
              columnNumber: 22
            }, this),
            selectedUserDetail.role === "teacher" && /* @__PURE__ */ jsxDEV("span", { className: "absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-0.5 text-[8px] leading-none select-none", children: "🎓" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 851,
              columnNumber: 22
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 845,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-950 flex items-center gap-1.5 uppercase leading-none", children: [
              selectedUserDetail.fullName,
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black text-cyan-600 uppercase bg-cyan-50 border border-cyan-105 rounded-md px-1.5 py-0.2", children: selectedUserDetail.level || "A1" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 857,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 855,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 font-mono font-semibold", children: selectedUserDetail.email }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 861,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: [
              "Đăng ký vào ngày: ",
              new Date(selectedUserDetail.createdAt || Date.now()).toLocaleDateString("vi-VN")
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 862,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 854,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 844,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 p-3 rounded-2xl", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[9px] block font-black uppercase", children: "TỔNG XP" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 869,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-amber-500", children: [
              selectedUserDetail.xp || 0,
              " XP"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 870,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 868,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 p-3 rounded-2xl", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[9px] block font-black uppercase", children: "TUYẾN HỌC" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 873,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-indigo-600", children: [
              "Level ",
              selectedUserDetail.currentLevelNumber || 1,
              " • L",
              selectedUserDetail.currentLessonNumber || 1
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 874,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 872,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 p-3 rounded-2xl", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[9px] block font-black uppercase", children: "MỤC TIÊU NGÀY" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 877,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-cyan-600", children: [
              selectedUserDetail.minutesPerDay || 30,
              " phút"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 878,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 876,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 p-3 rounded-2xl", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[9px] block font-black uppercase", children: "STREAK DAY" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 881,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-black text-orange-500", children: [
              selectedUserDetail.streakDays || 0,
              " Ngày🔥"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 882,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 880,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 867,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(Award, { className: "w-4 h-4 text-indigo-500" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 892,
                columnNumber: 21
              }, this),
              " KẾT QUẢ CÁC BÀI ĐÃ THỰC HÀNH (",
              userDetailProgress.length,
              ")"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 891,
              columnNumber: 19
            }, this),
            detailLoading ? /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400 py-4 font-mono animate-pulse", children: "Đang nạp phân số..." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 895,
              columnNumber: 21
            }, this) : userDetailProgress.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 bg-slate-50/50 p-3 rounded-xl border border-slate-100", children: "Học viên chưa hoàn thành bài luyện tập nào." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 897,
              columnNumber: 21
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "max-h-[140px] overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-2xl p-1 text-xs", children: userDetailProgress.map((p, i) => /* @__PURE__ */ jsxDEV("div", { className: "p-2 flex justify-between items-center text-left", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] uppercase font-black bg-cyan-50 text-cyan-800 px-1.5 rounded mr-1.5", children: p.skill }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 903,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700", children: [
                  "Level ",
                  p.levelNumber,
                  " - Lesson ",
                  p.lessonNumber
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 904,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 902,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "font-mono text-right shrink-0", children: [
                /* @__PURE__ */ jsxDEV("span", { className: `font-black uppercase mr-2 ${p.passed ? "text-emerald-600" : "text-rose-500"}`, children: p.passed ? "Passed" : "Failed" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 907,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-900", children: [
                  p.score * 10,
                  "% (",
                  p.score,
                  "/10)"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 908,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 906,
                columnNumber: 27
              }, this)
            ] }, i, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 901,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 899,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 890,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV(Clock, { className: "w-4 h-4 text-teal-600" }, void 0, false, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 919,
                columnNumber: 21
              }, this),
              " TIẾN TRÌNH TỪ VỰNG ÔN TẬP SRS (",
              userDetailSrs.length,
              ")"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 918,
              columnNumber: 19
            }, this),
            detailLoading ? /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400 py-4 font-mono animate-pulse", children: "Đang nạp bộ ôn tập..." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 922,
              columnNumber: 21
            }, this) : userDetailSrs.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 bg-slate-50/50 p-3 rounded-xl border border-slate-100", children: "Chưa có từ vựng nào được xếp vào ô nhớ định kỳ." }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 924,
              columnNumber: 21
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "max-h-[140px] overflow-y-auto grid grid-cols-2 gap-2 text-xs", children: userDetailSrs.map((s, i) => /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 border border-slate-150 bg-slate-50/20 rounded-xl text-left space-y-1", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-900 uppercase font-black text-[11px]", children: s.word || s.vocabularyId }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 930,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded leading-none", children: s.rating || "good" }, void 0, false, {
                  fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                  lineNumber: 931,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 929,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-400", children: [
                "Lần ôn: ",
                s.reviewCount || 1,
                " | Khoảng nhớ: ",
                s.intervalDays || 1,
                " ngày"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 933,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-[9px] text-slate-450", children: [
                "Hết hạn: ",
                new Date(s.dueAt).toLocaleDateString("vi-VN")
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
                lineNumber: 934,
                columnNumber: 27
              }, this)
            ] }, i, true, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 928,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 926,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 917,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 887,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 841,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedUserDetail(null),
          className: "w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl py-3 border border-slate-200 cursor-pointer text-xs uppercase mt-6",
          children: "ĐÓNG CỬA SỔ CHI TIẾT"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 945,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 832,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 831,
      columnNumber: 9
    }, this),
    isDeleteModalOpen && studentToDelete && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[110] animate-fade-in p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 text-left space-y-4 animate-scale-up", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 text-red-600", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-red-50 rounded-2xl", children: /* @__PURE__ */ jsxDEV(ShieldAlert, { className: "w-6 h-6" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 962,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 961,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-base font-black text-slate-950 uppercase", children: "Xác nhận xóa học sinh" }, void 0, false, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 964,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 960,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 text-slate-700 text-sm", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "leading-relaxed", children: [
          "Bạn có chắc chắn muốn xóa học sinh",
          /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-950", children: [
            " ",
            studentToDelete.fullName || studentToDelete.email
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 970,
            columnNumber: 17
          }, this),
          " không?"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 968,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-left font-mono text-[10px] text-slate-550 space-y-1", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            "• Email: ",
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-900", children: studentToDelete.email }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 973,
              columnNumber: 31
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 973,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            "• Trình độ: ",
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-cyan-705 bg-cyan-50 px-1.5 py-0.5 rounded uppercase", children: studentToDelete.level || "A1" }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 974,
              columnNumber: 34
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 974,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            "• ID: ",
            /* @__PURE__ */ jsxDEV("span", { className: "font-extrabold text-slate-900 select-all", children: studentToDelete._id || studentToDelete.id }, void 0, false, {
              fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
              lineNumber: 975,
              columnNumber: 28
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 975,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 972,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-amber-600 font-bold bg-amber-50/50 p-3 rounded-2xl border border-amber-150 flex gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { children: "⚠️" }, void 0, false, {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 978,
            columnNumber: 17
          }, this),
          " Thao tác này không thể hoàn tác và sẽ xóa sạch toàn bộ tiến trình, lịch sử học tập liên quan!"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
          lineNumber: 977,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 967,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: cancelDelete,
            disabled: isDeleting,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl transition-all cursor-pointer text-xs uppercase",
            children: "Hủy"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 983,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: confirmDeleteStudent,
            disabled: isDeleting,
            className: "px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-extrabold rounded-2xl transition-all cursor-pointer text-xs uppercase flex items-center gap-1.5",
            id: "btn-confirm-delete",
            children: isDeleting ? "Đang xóa..." : "Đồng ý xóa"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
            lineNumber: 990,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
        lineNumber: 982,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 959,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
      lineNumber: 958,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/admin/AdminUsers.tsx",
    lineNumber: 374,
    columnNumber: 5
  }, this);
}
