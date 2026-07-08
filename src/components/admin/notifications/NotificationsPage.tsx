import { useState } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import {
 PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
 CartesianGrid, ResponsiveContainer,
} from "recharts";

const TOOLTIP_STYLE = {
 contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};

export default function NotificationsPage() {
 const { results: notifications, loadMore, status } = usePaginatedQuery(
 api.admin.adminGetAllNotifications,
 {},
 { initialNumItems: 50 }
 );
 const broadcastNotif = useMutation(api.admin.adminSendBroadcastNotif);

 const [title, setTitle] = useState("");
 const [message, setMessage] = useState("");
 const [type, setType] = useState("admin_announcement");
 const [targetRole, setTargetRole] = useState("all");
 const [showCompose, setShowCompose] = useState(false);
 const [sending, setSending] = useState(false);

 const handleSend = async () => {
 if (!title || !message) return toast.error("Title and message required");
 setSending(true);
 try {
 const result = await broadcastNotif({ title, message, type, targetRole });
 toast.success(`Broadcast sent to ${(result as any)?.sent ?? "all"} users!`);
 setTitle(""); setMessage(""); setShowCompose(false);
 } catch (e: any) { toast.error(e.message); }
 finally { setSending(false); }
 };

 const readCount = (notifications || []).filter((n: any) => n.isRead).length;
 const unreadCount = (notifications || []).filter((n: any) => !n.isRead).length;

 const typeMap: Record<string, number> = {};
 for (const n of notifications || []) {
 typeMap[n.type] = (typeMap[n.type] || 0) + 1;
 }
 const typeData = Object.entries(typeMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);

 const COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"];

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Notification Center</h1>
 <p className="admin-page-subtitle">Broadcast and monitor all platform notifications</p>
 </div>
 <button className="admin-btn admin-btn-primary" onClick={() => setShowCompose(!showCompose)}>
 {showCompose ? "Hide Compose" : "Compose Broadcast"}
 </button>
 </div>

 {/* Compose Panel */}
 {showCompose && (
 <div className="admin-card" style={{ marginBottom: 24 }}>
 <div className="admin-card-title" style={{ marginBottom: 16 }}> Compose Broadcast</div>
 <div className="admin-grid-2">
 <div className="admin-form-group">
 <label className="admin-label">Title</label>
 <input className="admin-input" placeholder="Notification title…" value={title} onChange={(e) => setTitle(e.target.value)} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Target Audience</label>
 <select className="admin-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
 <option value="all">All Users</option>
 <option value="customer">Customers Only</option>
 <option value="shop_owner">Shop Owners Only</option>
 </select>
 </div>
 </div>
 <div className="admin-form-group" style={{ marginTop: 12 }}>
 <label className="admin-label">Message</label>
 <textarea className="admin-input" placeholder="Write your message…" rows={3} style={{ resize: "vertical" }} value={message} onChange={(e) => setMessage(e.target.value)} />
 </div>
 <div className="admin-form-group" style={{ marginTop: 12 }}>
 <label className="admin-label">Notification Type</label>
 <input className="admin-input" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. admin_announcement" />
 </div>

 {/* Preview */}
 {title && (
 <div style={{ marginTop: 16, padding: 16, background: "var(--admin-surface-2)", borderRadius: 12, border: "1px solid var(--admin-border)" }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 8 }}>PREVIEW</div>
 <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
 <div style={{ width: 36, height: 36, background: "rgba(124,58,237,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
 
 </div>
 <div>
 <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
 <div style={{ fontSize: 13, color: "var(--admin-text-muted)", marginTop: 2 }}>{message}</div>
 </div>
 </div>
 </div>
 )}

 <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
 <button className="admin-btn admin-btn-primary" onClick={handleSend} disabled={sending}>
 {sending ? "Sending…" : `Send to ${targetRole === "all" ? "All Users" : targetRole === "customer" ? "Customers" : "Shop Owners"}`}
 </button>
 <button className="admin-btn admin-btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
 </div>
 </div>
 )}

 {/* Stats */}
 <div className="admin-chart-grid admin-chart-grid-2" style={{ marginBottom: 24 }}>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Read vs Unread</div>
 <ResponsiveContainer width="100%" height={160}>
 <PieChart>
 <Pie
 data={[
 { name: "Read", value: readCount },
 { name: "Unread", value: unreadCount },
 ]}
 dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}
 >
 <Cell fill="#10b981" /><Cell fill="#f43f5e" />
 </Pie>
 <Tooltip {...TOOLTIP_STYLE} />
 </PieChart>
 </ResponsiveContainer>
 <div style={{ textAlign: "center", fontSize: 12, color: "var(--admin-text-muted)" }}>
 {notifications?.length || 0} total • {Math.round((readCount / Math.max(notifications?.length || 1, 1)) * 100)}% read rate
 </div>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Types</div>
 <ResponsiveContainer width="100%" height={160}>
 <BarChart data={typeData.slice(0, 6)} layout="vertical">
 <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
 <YAxis type="category" dataKey="type" width={120} tick={{ fontSize: 10, fill: "#94a3b8" }} />
 <Tooltip {...TOOLTIP_STYLE} />
 <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Notifications Log Table */}
 <div className="admin-card" style={{ padding: 0 }}>
 <div style={{ padding: "16px 20px" }} className="admin-card-title"> Notification Log</div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead><tr><th>Title</th><th>Message</th><th>Type</th><th>User</th><th>Read</th><th>Sent</th></tr></thead>
 <tbody>
 {(notifications || []).slice(0, 100).map((n: any) => (
 <tr key={n._id}>
 <td style={{ fontWeight: 500, fontSize: 13 }}>{n.title}</td>
 <td style={{ fontSize: 12, color: "var(--admin-text-muted)", maxWidth: 200 }}>
 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{n.message}</span>
 </td>
 <td><span className="admin-badge admin-badge-violet" style={{ fontSize: 10 }}>{n.type}</span></td>
 <td style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{n.userId?.slice(-8)}</td>
 <td>
 {n.isRead
 ? <span className="admin-badge admin-badge-success">Read</span>
 : <span className="admin-badge admin-badge-muted">Unread</span>
 }
 </td>
 <td style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>
 {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 {status === "CanLoadMore" && (
 <div className="admin-pagination">
 <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => loadMore(50)}>Load More</button>
 </div>
 )}
 </div>
 </div>
 );
}
