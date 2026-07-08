import { useState } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable, { Column } from "../shared/DataTable";
import StatusBadge from "../shared/StatusBadge";
import ExportCSVButton from "../shared/ExportCSVButton";
import ConfirmDialog from "../shared/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import {
 PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
 XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Id } from "../../../../convex/_generated/dataModel";

const TOOLTIP_STYLE = {
 contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};
const COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b"];

function UserDetailDrawer({ user, onClose }: { user: any; onClose: () => void }) {
 const detail = useQuery(api.admin.adminGetUserDetail, { userId: user._id as Id<"users"> });
 const banUser = useMutation(api.admin.adminBanUser);
 const unbanUser = useMutation(api.admin.adminUnbanUser);
 const addStrike = useMutation(api.admin.adminAddStrike);
 const removeStrike = useMutation(api.admin.adminRemoveStrike);
 const deleteUser = useMutation(api.admin.adminDeleteUser);
 const sendNotif = useMutation(api.admin.adminSendUserNotification);

 const [confirmDelete, setConfirmDelete] = useState(false);
 const [banDays, setBanDays] = useState(7);
 const [notifTitle, setNotifTitle] = useState("");
 const [notifMsg, setNotifMsg] = useState("");
 const [showNotif, setShowNotif] = useState(false);

 const isBanned = user.bookingBanUntil && user.bookingBanUntil > Date.now();

 const handleBan = async () => {
 try {
 await banUser({ userId: user._id, banUntil: Date.now() + banDays * 86400000, reason: "Admin action" });
 toast.success(`User banned for ${banDays} days`);
 } catch (e: any) { toast.error(e.message); }
 };

 const handleUnban = async () => {
 try { await unbanUser({ userId: user._id }); toast.success("Ban removed"); }
 catch (e: any) { toast.error(e.message); }
 };

 const handleDelete = async () => {
 try { await deleteUser({ userId: user._id }); toast.success("User deleted"); onClose(); }
 catch (e: any) { toast.error(e.message); }
 };

 const handleSendNotif = async () => {
 if (!notifTitle || !notifMsg) return;
 try {
 await sendNotif({ userId: user._id, title: notifTitle, message: notifMsg, type: "admin_message" });
 toast.success("Notification sent!");
 setNotifTitle(""); setNotifMsg(""); setShowNotif(false);
 } catch (e: any) { toast.error(e.message); }
 };

 const avatarColor = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"][
 user.name.charCodeAt(0) % 5
 ];

 return (
 <>
 <motion.div
 className="admin-overlay"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 />
 <motion.div
 className="admin-drawer"
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 28, stiffness: 300 }}
 >
 <div className="admin-drawer-header">
 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
 <div className="admin-avatar" style={{ background: avatarColor, width: 44, height: 44, fontSize: 16 }}>
 {user.name.slice(0, 2).toUpperCase()}
 </div>
 <div>
 <div className="admin-drawer-title">{user.name}</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{user.email}</div>
 </div>
 </div>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={onClose}>×</button>
 </div>

 <div className="admin-drawer-body" style={{ overflowY: "auto" }}>
 {/* Profile Info */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-stat-row"><span className="admin-stat-label">Phone</span><span className="admin-stat-value">{user.phone || "—"}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Location</span><span className="admin-stat-value">{user.location || "—"}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Role</span><span className="admin-stat-value"><StatusBadge status={user.role || "customer"} /></span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Joined</span><span className="admin-stat-value">{user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy") : "—"}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Total Bookings</span><span className="admin-stat-value">{detail?.bookingCount ?? "…"}</span></div>
 <div className="admin-stat-row">
 <span className="admin-stat-label">Status</span>
 <span className="admin-stat-value">
 {isBanned
 ? <span className="admin-badge admin-badge-danger">Banned until {format(new Date(user.bookingBanUntil), "dd MMM yyyy")}</span>
 : <span className="admin-badge admin-badge-success">Active</span>}
 </span>
 </div>
 </div>

 {/* Strike Management */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Strike Management</div>
 <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
 <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { try { await removeStrike({ userId: user._id }); toast.success("Strike removed"); } catch(e: any) { toast.error(e.message); } }}>
 Remove
 </button>
 <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 24, fontWeight: 800, color: (user.noShowStrikes || 0) >= 3 ? "var(--admin-danger)" : (user.noShowStrikes || 0) > 0 ? "var(--admin-warning)" : "var(--admin-success)" }}>
 {user.noShowStrikes || 0}
 </div>
 <div style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>strikes</div>
 <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { try { await addStrike({ userId: user._id }); toast.success("Strike added"); } catch(e: any) { toast.error(e.message); } }}>
 + Add
 </button>
 </div>
 </div>

 {/* Ban Control */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Ban Control</div>
 {isBanned ? (
 <button className="admin-btn admin-btn-success" onClick={handleUnban}>Remove Ban</button>
 ) : (
 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
 <select className="admin-select" style={{ flex: 1 }} value={banDays} onChange={(e) => setBanDays(Number(e.target.value))}>
 <option value={1}>1 day</option>
 <option value={3}>3 days</option>
 <option value={7}>7 days</option>
 <option value={30}>30 days</option>
 <option value={365}>1 year</option>
 </select>
 <button className="admin-btn admin-btn-danger" onClick={handleBan}> Ban User</button>
 </div>
 )}
 </div>

 {/* Send Notification */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
 <div className="admin-card-title"> Send Notification</div>
 <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowNotif(!showNotif)}>
 {showNotif ? "Hide" : "Compose"}
 </button>
 </div>
 {showNotif && (
 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
 <input className="admin-input" placeholder="Title" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} />
 <textarea className="admin-input" placeholder="Message…" rows={3} style={{ resize: "vertical" }} value={notifMsg} onChange={(e) => setNotifMsg(e.target.value)} />
 <button className="admin-btn admin-btn-primary" onClick={handleSendNotif}> Send</button>
 </div>
 )}
 </div>

 {/* Booking History */}
 {detail?.bookings && detail.bookings.length > 0 && (
 <div className="admin-card" style={{ padding: 0 }}>
 <div style={{ padding: "16px 16px 8px" }} className="admin-card-title"> Recent Bookings</div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead><tr><th>Shop</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
 <tbody>
 {detail.bookings.slice(0, 10).map((b: any) => (
 <tr key={b._id}>
 <td style={{ fontSize: 12 }}>{b.shopId}</td>
 <td style={{ fontSize: 12 }}>{b.date} {b.time}</td>
 <td style={{ fontSize: 12 }}>₹{b.totalAmount}</td>
 <td><StatusBadge status={b.status} /></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* Delete */}
 <div>
 <button className="admin-btn admin-btn-danger" style={{ width: "100%" }} onClick={() => setConfirmDelete(true)}>
 Delete Account
 </button>
 </div>
 </div>
 </motion.div>

 <ConfirmDialog
 open={confirmDelete}
 title="Delete User Account?"
 description={`This will permanently delete ${user.name}'s account and all associated data. This action cannot be undone.`}
 confirmLabel="Delete Permanently"
 onConfirm={handleDelete}
 onCancel={() => setConfirmDelete(false)}
 danger
 />
 </>
 );
}

export default function UsersPage() {
 const { results: users, loadMore, status } = usePaginatedQuery(
 api.admin.adminGetAllUsers,
 { search: undefined, roleFilter: undefined, banFilter: undefined },
 { initialNumItems: 50 }
 );
 const [selectedUser, setSelectedUser] = useState<any>(null);
 const [search, setSearch] = useState("");
 const [roleFilter, setRoleFilter] = useState("all");
 const [banFilter, setBanFilter] = useState("all");

 const growthData = useQuery(api.admin.adminGetUserGrowthTrend, { weeks: 16 });

 const now = Date.now();
 const filtered = (users || []).filter((u: any) => {
 const q = search.toLowerCase();
 if (q && !u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q) && !u.phone?.includes(q)) return false;
 if (roleFilter !== "all" && u.role !== roleFilter) return false;
 if (banFilter === "banned" && !(u.bookingBanUntil && u.bookingBanUntil > now)) return false;
 if (banFilter === "active" && (u.bookingBanUntil && u.bookingBanUntil > now)) return false;
 return true;
 });

 const columns: Column<any>[] = [
 {
 key: "name", label: "Name", sortable: true,
 render: (u) => {
 const avatarColor = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"][u.name?.charCodeAt(0) % 5 || 0];
 return (
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 <div className="admin-avatar" style={{ background: avatarColor, flexShrink: 0 }}>
 {u.name?.slice(0, 2).toUpperCase()}
 </div>
 <span style={{ fontWeight: 500 }}>{u.name}</span>
 </div>
 );
 }
 },
 { key: "email", label: "Email", sortable: true },
 { key: "phone", label: "Phone" },
 { key: "role", label: "Role", sortable: true, render: (u) => <StatusBadge status={u.role || "customer"} /> },
 { key: "noShowStrikes", label: "Strikes", sortable: true, render: (u) => {
 const s = u.noShowStrikes || 0;
 return <span className={`admin-badge ${s >= 3 ? "admin-badge-danger" : s > 0 ? "admin-badge-warning" : "admin-badge-success"}`}>{s}</span>;
 }},
 { key: "bookingBanUntil", label: "Ban Status", render: (u) => {
 const banned = u.bookingBanUntil && u.bookingBanUntil > now;
 return banned
 ? <span className="admin-badge admin-badge-danger">Banned</span>
 : <span className="admin-badge admin-badge-success">Active</span>;
 }},
 { key: "createdAt", label: "Joined", sortable: true, render: (u) => u.createdAt ? format(new Date(u.createdAt), "dd MMM yyyy") : "—" },
 ];

 const exportCols = [
 { key: "name", label: "Name" }, { key: "email", label: "Email" },
 { key: "phone", label: "Phone" }, { key: "role", label: "Role" },
 { key: "noShowStrikes", label: "Strikes" }, { key: "createdAt", label: "Joined" },
 ];

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Users Management</h1>
 <p className="admin-page-subtitle">{(users || []).length} total users</p>
 </div>
 <ExportCSVButton data={filtered} columns={exportCols} filename="users.csv" />
 </div>

 {/* Analytics Panel */}
 <div className="admin-chart-grid admin-chart-grid-2" style={{ marginBottom: 24 }}>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> New Signups (16 Weeks)</div>
 <ResponsiveContainer width="100%" height={160}>
 <LineChart data={growthData || []}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
 <Tooltip contentStyle={{ background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }} />
 <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={false} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Role Distribution</div>
 <ResponsiveContainer width="100%" height={160}>
 <PieChart>
 <Pie
 data={[
 { name: "Customers", value: (users || []).filter((u: any) => u.role !== "shop_owner").length },
 { name: "Shop Owners", value: (users || []).filter((u: any) => u.role === "shop_owner").length },
 ]}
 dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}
 >
 <Cell fill="#7c3aed" /><Cell fill="#06b6d4" />
 </Pie>
 <Tooltip contentStyle={{ background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }} />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Filters */}
 <div className="admin-card" style={{ marginBottom: 16, padding: "14px 16px" }}>
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
 <div className="admin-search-wrap" style={{ maxWidth: 280, flex: "none" }}>
 <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
 <input className="admin-search-input" placeholder="Search by name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
 </div>
 <select className="admin-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
 <option value="all">All Roles</option>
 <option value="customer">Customer</option>
 <option value="shop_owner">Shop Owner</option>
 </select>
 <select className="admin-select" value={banFilter} onChange={(e) => setBanFilter(e.target.value)}>
 <option value="all">All Status</option>
 <option value="banned">Banned</option>
 <option value="active">Active</option>
 </select>
 <span style={{ fontSize: 13, color: "var(--admin-text-muted)", marginLeft: "auto" }}>{filtered.length} users</span>
 </div>
 </div>

 {/* Table */}
 <DataTable
 columns={columns}
 data={filtered}
 pageSize={25}
 onRowClick={(u) => setSelectedUser(u)}
 loading={status === "LoadingFirstPage"}
 />

 {status === "CanLoadMore" && (
 <div style={{ textAlign: "center", marginTop: 16 }}>
 <button className="admin-btn admin-btn-secondary" onClick={() => loadMore(50)}>Load More Users</button>
 </div>
 )}

 {/* User Detail Drawer */}
 <AnimatePresence>
 {selectedUser && (
 <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
 )}
 </AnimatePresence>
 </div>
 );
}
