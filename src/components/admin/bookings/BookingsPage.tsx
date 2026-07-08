import { useState } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable, { Column } from "../shared/DataTable";
import StatusBadge from "../shared/StatusBadge";
import ExportCSVButton from "../shared/ExportCSVButton";
import ConfirmDialog from "../shared/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import {
 AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
 ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Id } from "../../../../convex/_generated/dataModel";

const TOOLTIP_STYLE = {
 contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};

function BookingDetailModal({ booking, onClose }: { booking: any; onClose: () => void }) {
 const [cancelReason, setCancelReason] = useState("");
 const [showCancel, setShowCancel] = useState(false);
 const [confirmComplete, setConfirmComplete] = useState(false);
 const cancelBooking = useMutation(api.admin.adminCancelBooking);
 const completeBooking = useMutation(api.admin.adminCompleteBooking);

 const handleCancel = async () => {
 if (!cancelReason.trim()) return toast.error("Please enter a reason");
 try {
 await cancelBooking({ bookingId: booking._id, reason: cancelReason });
 toast.success("Booking force-cancelled");
 onClose();
 } catch (e: any) { toast.error(e.message); }
 };

 const handleComplete = async () => {
 try {
 await completeBooking({ bookingId: booking._id });
 toast.success("Booking marked completed");
 onClose();
 } catch (e: any) { toast.error(e.message); }
 };

 return (
 <>
 <motion.div className="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ zIndex: 200 }} />
 <div className="admin-modal-wrap" style={{ zIndex: 201 }}>
 <motion.div
 initial={{ scale: 0.92, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.92, opacity: 0 }}
 style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 20, padding: 28, maxWidth: 560, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto" }}
 >
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
 <h3 style={{ fontWeight: 700, fontSize: 18 }}>Booking Details</h3>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={onClose}>×</button>
 </div>

 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
 <div className="admin-card" style={{ padding: 14 }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 4 }}>CUSTOMER</div>
 <div style={{ fontWeight: 600 }}>{booking.customerName}</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{booking.customerPhone || "—"}</div>
 </div>
 <div className="admin-card" style={{ padding: 14 }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 4 }}>DATE & TIME</div>
 <div style={{ fontWeight: 600 }}>{booking.date}</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{booking.time}</div>
 </div>
 </div>

 <div className="admin-card" style={{ padding: 14, marginBottom: 16 }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 8 }}>SERVICES</div>
 {(booking.services || []).map((s: any, i: number) => (
 <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < booking.services.length - 1 ? "1px solid var(--admin-border)" : "none" }}>
 <span style={{ fontSize: 13 }}>{s.name}</span>
 <div style={{ display: "flex", gap: 12 }}>
 <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{s.duration}min</span>
 <span style={{ fontSize: 13, fontWeight: 600 }}>₹{s.price}</span>
 </div>
 </div>
 ))}
 <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--admin-border)" }}>
 <span style={{ fontWeight: 600 }}>Total</span>
 <span style={{ fontWeight: 800, color: "var(--admin-success)" }}>₹{booking.totalAmount}</span>
 </div>
 </div>

 <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
 <div className="admin-card" style={{ padding: 14, flex: 1 }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 4 }}>STATUS</div>
 <StatusBadge status={booking.status} />
 </div>
 <div className="admin-card" style={{ padding: 14, flex: 1 }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 4 }}>OTP</div>
 <span className={`admin-badge ${booking.otpVerified ? "admin-badge-success" : "admin-badge-muted"}`}>
 {booking.otpVerified ? "Verified" : "Not Verified"}
 </span>
 </div>
 </div>

 {booking.cancelReason && (
 <div className="admin-alert admin-alert-danger" style={{ marginBottom: 16 }}>
 
 <div><div style={{ fontSize: 12, fontWeight: 600 }}>Cancellation reason</div><div style={{ fontSize: 12 }}>{booking.cancelReason}</div></div>
 </div>
 )}

 {/* Admin Actions */}
 {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "active") && (
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
 {booking.status !== "completed" && (
 <button className="admin-btn admin-btn-success" onClick={() => setConfirmComplete(true)}>
 Mark Complete
 </button>
 )}
 <button className="admin-btn admin-btn-danger" onClick={() => setShowCancel(!showCancel)}>
 Force Cancel
 </button>
 </div>
 )}

 {showCancel && (
 <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
 <input className="admin-input" placeholder="Cancellation reason…" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} style={{ flex: 1 }} />
 <button className="admin-btn admin-btn-danger" onClick={handleCancel}>Cancel Booking</button>
 </div>
 )}
 </motion.div>
 </div>

 <ConfirmDialog
 open={confirmComplete}
 title="Mark booking as completed?"
 description="This will force-complete this booking. The customer will receive a notification."
 confirmLabel="Mark Complete"
 onConfirm={handleComplete}
 onCancel={() => setConfirmComplete(false)}
 />
 </>
 );
}

export default function BookingsPage() {
 const { results: bookings, loadMore, status } = usePaginatedQuery(
 api.admin.adminGetAllBookings,
 { statusFilter: undefined, shopId: undefined, dateFrom: undefined, dateTo: undefined },
 { initialNumItems: 50 }
 );

 const trend = useQuery(api.admin.adminGetBookingsTrend, { days: 30 });
 const statusBreakdown = useQuery(api.admin.adminGetBookingStatusBreakdown);
 const hourly = useQuery(api.admin.adminGetBookingsByHour);

 const [selectedBooking, setSelectedBooking] = useState<any>(null);
 const [statusFilter, setStatusFilter] = useState("all");
 const [search, setSearch] = useState("");

 const filtered = (bookings || []).filter((b: any) => {
 if (statusFilter !== "all" && b.status !== statusFilter) return false;
 if (search && !b.customerName?.toLowerCase().includes(search.toLowerCase()) && !b.customerPhone?.includes(search)) return false;
 return true;
 });

 const columns: Column<any>[] = [
 { key: "_id", label: "ID", render: (b) => <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--admin-text-muted)" }}>{b._id.slice(-6)}</span> },
 { key: "customerName", label: "Customer", sortable: true, render: (b) => <div><div style={{ fontWeight: 500, fontSize: 13 }}>{b.customerName}</div><div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{b.customerPhone}</div></div> },
 { key: "services", label: "Services", render: (b) => <span style={{ fontSize: 12 }}>{(b.services || []).map((s: any) => s.name).join(", ")}</span> },
 { key: "totalAmount", label: "Amount", sortable: true, render: (b) => <span style={{ fontWeight: 600, color: "var(--admin-success)" }}>₹{b.totalAmount}</span> },
 { key: "date", label: "Date & Time", sortable: true, render: (b) => <div style={{ fontSize: 12 }}><div>{b.date}</div><div style={{ color: "var(--admin-text-muted)" }}>{b.time}</div></div> },
 { key: "status", label: "Status", sortable: true, render: (b) => <StatusBadge status={b.status} /> },
 { key: "otpVerified", label: "OTP", render: (b) => b.otpVerified ? <span className="admin-badge admin-badge-success">Verified</span> : <span className="admin-badge admin-badge-muted">Not Verified</span> },
 ];

 const COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#7c3aed", "#f43f5e"];

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Bookings Management</h1>
 <p className="admin-page-subtitle">{(bookings || []).length} bookings loaded</p>
 </div>
 <ExportCSVButton data={filtered} columns={[
 { key: "customerName", label: "Customer" }, { key: "customerPhone", label: "Phone" },
 { key: "date", label: "Date" }, { key: "time", label: "Time" },
 { key: "totalAmount", label: "Amount" }, { key: "status", label: "Status" },
 ]} filename="bookings.csv" />
 </div>

 {/* Analytics */}
 <div className="admin-chart-grid admin-chart-grid-3" style={{ marginBottom: 24 }}>
 <div className="admin-card" style={{ gridColumn: "span 2" }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Daily Revenue (30 days)</div>
 <ResponsiveContainer width="100%" height={160}>
 <AreaChart data={trend || []}>
 <defs>
 <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${v}`} />
 <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v}`, "Revenue"]} />
 <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad2)" strokeWidth={2} />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Status Mix</div>
 <ResponsiveContainer width="100%" height={160}>
 <PieChart>
 <Pie data={statusBreakdown || []} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={35} outerRadius={65}>
 {(statusBreakdown || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
 </Pie>
 <Tooltip {...TOOLTIP_STYLE} />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Heatmap: Bookings by Hour */}
 <div className="admin-card" style={{ marginBottom: 24 }}>
 <div className="admin-card-title" style={{ marginBottom: 16 }}> Bookings by Hour of Day</div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 4 }}>
 {(hourly || Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))).map((h: any) => {
 const maxCount = Math.max(...(hourly || []).map((x: any) => x.count), 1);
 const intensity = h.count / maxCount;
 return (
 <div
 key={h.hour}
 title={`${h.hour}:00 — ${h.count} bookings`}
 style={{
 aspectRatio: "1",
 borderRadius: 4,
 background: `rgba(124, 58, 237, ${0.05 + intensity * 0.95})`,
 border: "1px solid rgba(255,255,255,0.05)",
 }}
 />
 );
 })}
 </div>
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--admin-text-muted)", marginTop: 4 }}>
 <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
 </div>
 </div>

 {/* Filters */}
 <div className="admin-card" style={{ marginBottom: 16, padding: "14px 16px" }}>
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
 <div className="admin-search-wrap" style={{ maxWidth: 280, flex: "none" }}>
 <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
 <input className="admin-search-input" placeholder="Search by customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
 </div>
 <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
 <option value="all">All Status</option>
 <option value="pending">Pending</option>
 <option value="confirmed">Confirmed</option>
 <option value="active">Active</option>
 <option value="completed">Completed</option>
 <option value="cancelled">Cancelled</option>
 </select>
 <span style={{ fontSize: 13, color: "var(--admin-text-muted)", marginLeft: "auto" }}>{filtered.length} bookings</span>
 </div>
 </div>

 <DataTable
 columns={columns}
 data={filtered}
 pageSize={25}
 onRowClick={(b) => setSelectedBooking(b)}
 loading={status === "LoadingFirstPage"}
 />

 {status === "CanLoadMore" && (
 <div style={{ textAlign: "center", marginTop: 16 }}>
 <button className="admin-btn admin-btn-secondary" onClick={() => loadMore(50)}>Load More Bookings</button>
 </div>
 )}

 <AnimatePresence>
 {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
 </AnimatePresence>
 </div>
 );
}
