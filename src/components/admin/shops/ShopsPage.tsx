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
 PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
 CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, ZAxis,
} from "recharts";
import { Id } from "../../../../convex/_generated/dataModel";

const TOOLTIP_STYLE = {
 contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};
const STATUS_COLORS: Record<string, string> = { approved: "#10b981", pending: "#f59e0b", rejected: "#f43f5e" };

function ShopDetailPanel({ shopId, onClose }: { shopId: Id<"shops">; onClose: () => void }) {
 const detail = useQuery(api.admin.adminGetShopDetail, { shopId });
 const updateShop = useMutation(api.admin.adminUpdateShopDetails);
 const addService = useMutation(api.admin.adminAddShopService);
 const updateService = useMutation(api.admin.adminUpdateShopService);
 const deleteService = useMutation(api.admin.adminDeleteShopService);
 const toggleActive = useMutation(api.admin.adminToggleShopActive);
 const toggleOpen = useMutation(api.admin.adminToggleShopOpen);
 const addBlockedDate = useMutation(api.admin.adminAddBlockedDate);
 const removeBlockedDate = useMutation(api.admin.adminRemoveBlockedDate);

 const [editMode, setEditMode] = useState(false);
 const [form, setForm] = useState<any>({});
 const [newService, setNewService] = useState({ name: "", price: 0, duration: 30 });
 const [newBlockedDate, setNewBlockedDate] = useState("");
 const [confirmDelete, setConfirmDelete] = useState(false);

 const shop = detail?.shop;

 if (!shop) {
 return (
 <>
 <motion.div className="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
 <motion.div className="admin-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}>
 <div className="admin-drawer-header">
 <div className="admin-drawer-title">Loading…</div>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={onClose}>×</button>
 </div>
 </motion.div>
 </>
 );
 }

 const handleSave = async () => {
 try {
 await updateShop({ shopId, ...form });
 toast.success("Shop updated!");
 setEditMode(false);
 } catch (e: any) { toast.error(e.message); }
 };

 const handleAddService = async () => {
 if (!newService.name) return;
 try {
 await addService({ shopId, ...newService });
 toast.success("Service added!");
 setNewService({ name: "", price: 0, duration: 30 });
 } catch (e: any) { toast.error(e.message); }
 };

 const handleAddBlockedDate = async () => {
 if (!newBlockedDate) return;
 try {
 await addBlockedDate({ shopId, date: newBlockedDate });
 toast.success("Date blocked!");
 setNewBlockedDate("");
 } catch (e: any) { toast.error(e.message); }
 };

 return (
 <>
 <motion.div className="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
 <motion.div
 className="admin-drawer"
 style={{ width: "min(720px, 95vw)" }}
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 28, stiffness: 300 }}
 >
 <div className="admin-drawer-header">
 <div>
 <div className="admin-drawer-title">{shop.shopName}</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>{shop.address}</div>
 </div>
 <div style={{ display: "flex", gap: 8 }}>
 <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => { setEditMode(!editMode); setForm(shop); }}>
 {editMode ? "Cancel" : "Edit"}
 </button>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={onClose}>×</button>
 </div>
 </div>

 <div className="admin-drawer-body" style={{ overflowY: "auto" }}>
 {/* Toggles */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div style={{ display: "flex", gap: 24 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 <label className="admin-toggle">
 <input type="checkbox" checked={!!shop.isActive} onChange={async () => { try { await toggleActive({ shopId }); } catch(e: any) { toast.error(e.message); } }} />
 <span className="admin-toggle-slider" />
 </label>
 <span style={{ fontSize: 13 }}>isActive (visible to customers)</span>
 </div>
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 <label className="admin-toggle">
 <input type="checkbox" checked={!!shop.isOpen} onChange={async () => { try { await toggleOpen({ shopId }); } catch(e: any) { toast.error(e.message); } }} />
 <span className="admin-toggle-slider" />
 </label>
 <span style={{ fontSize: 13 }}>isOpen (accepting bookings)</span>
 </div>
 </div>
 </div>

 {/* Stats */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-stat-row"><span className="admin-stat-label">Status</span><span className="admin-stat-value"><StatusBadge status={shop.status || "pending"} /></span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Rating</span><span className="admin-stat-value">{shop.rating?.toFixed(1)} ({shop.totalReviews} reviews)</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Total Revenue</span><span className="admin-stat-value">₹{(detail.totalRevenue || 0).toLocaleString("en-IN")}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Today's Bookings</span><span className="admin-stat-value">{detail.todayBookings?.length || 0}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Services Count</span><span className="admin-stat-value">{detail.services?.length || 0}</span></div>
 </div>

 {/* Editable Fields */}
 {editMode ? (
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}>Edit Shop Details</div>
 <div className="admin-grid-2">
 <div className="admin-form-group">
 <label className="admin-label">Shop Name</label>
 <input className="admin-input" defaultValue={shop.shopName} onChange={(e) => setForm((f: any) => ({ ...f, shopName: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Phone</label>
 <input className="admin-input" defaultValue={shop.phone} onChange={(e) => setForm((f: any) => ({ ...f, phone: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Open Time</label>
 <input className="admin-input" defaultValue={shop.openTime} onChange={(e) => setForm((f: any) => ({ ...f, openTime: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Close Time</label>
 <input className="admin-input" defaultValue={shop.closeTime} onChange={(e) => setForm((f: any) => ({ ...f, closeTime: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Slot Duration (min)</label>
 <input type="number" className="admin-input" defaultValue={shop.slotDuration} onChange={(e) => setForm((f: any) => ({ ...f, slotDuration: Number(e.target.value) }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Max Bookings/Slot</label>
 <input type="number" className="admin-input" defaultValue={shop.maxBookingsPerSlot} onChange={(e) => setForm((f: any) => ({ ...f, maxBookingsPerSlot: Number(e.target.value) }))} />
 </div>
 </div>
 <div className="admin-form-group" style={{ marginTop: 12 }}>
 <label className="admin-label">Address</label>
 <input className="admin-input" defaultValue={shop.address} onChange={(e) => setForm((f: any) => ({ ...f, address: e.target.value }))} />
 </div>
 <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
 <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Changes</button>
 <button className="admin-btn admin-btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
 </div>
 </div>
 ) : (
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-stat-row"><span className="admin-stat-label">Phone</span><span className="admin-stat-value">{shop.phone || "—"}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Hours</span><span className="admin-stat-value">{shop.openTime || "09:00"} – {shop.closeTime || "21:00"}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Slot Duration</span><span className="admin-stat-value">{shop.slotDuration || 30} min</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Max/Slot</span><span className="admin-stat-value">{shop.maxBookingsPerSlot || 1}</span></div>
 {shop.location && (
 <div className="admin-stat-row">
 <span className="admin-stat-label">GPS</span>
 <a
 href={`https://www.google.com/maps?q=${shop.location.lat},${shop.location.lng}`}
 target="_blank" rel="noreferrer"
 className="admin-btn admin-btn-secondary admin-btn-sm"
 style={{ fontSize: 11 }}
 >
 View on Maps
 </a>
 </div>
 )}
 </div>
 )}

 {/* Services Editor */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Services</div>
 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
 {(detail.services || []).map((svc: any) => (
 <div key={svc._id} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--admin-surface-2)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)" }}>
 <span style={{ flex: 1, fontSize: 13 }}>{svc.name}</span>
 <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>₹{svc.price}</span>
 <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{svc.duration}min</span>
 <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { try { await deleteService({ serviceId: svc._id }); toast.success("Service deleted"); } catch(e: any) { toast.error(e.message); } }}>
 ×
 </button>
 </div>
 ))}
 <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px auto", gap: 6, marginTop: 4 }}>
 <input className="admin-input" placeholder="Service name" value={newService.name} onChange={(e) => setNewService((s) => ({ ...s, name: e.target.value }))} style={{ fontSize: 12 }} />
 <input type="number" className="admin-input" placeholder="₹" value={newService.price} onChange={(e) => setNewService((s) => ({ ...s, price: Number(e.target.value) }))} style={{ fontSize: 12 }} />
 <input type="number" className="admin-input" placeholder="min" value={newService.duration} onChange={(e) => setNewService((s) => ({ ...s, duration: Number(e.target.value) }))} style={{ fontSize: 12 }} />
 <button className="admin-btn admin-btn-success admin-btn-sm" onClick={handleAddService}>+</button>
 </div>
 </div>
 </div>

 {/* Blocked Dates */}
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Blocked Dates</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
 {(detail.blockedDates || []).map((bd: any) => (
 <div key={bd._id} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 8, padding: "4px 8px", fontSize: 12 }}>
 {bd.date}
 <button onClick={async () => { try { await removeBlockedDate({ blockedDateId: bd._id }); toast.success("Date unblocked"); } catch(e: any) { toast.error(e.message); } }} style={{ background: "none", border: "none", color: "#fb7185", cursor: "pointer", padding: 0, marginLeft: 2 }}>×</button>
 </div>
 ))}
 </div>
 <div style={{ display: "flex", gap: 8 }}>
 <input type="date" className="admin-input" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)} />
 <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleAddBlockedDate}>Block Date</button>
 </div>
 </div>

 {/* Today's Bookings */}
 {detail.todayBookings && detail.todayBookings.length > 0 && (
 <div className="admin-card" style={{ padding: 0 }}>
 <div style={{ padding: "14px 16px" }} className="admin-card-title"> Today's Bookings</div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead><tr><th>Customer</th><th>Time</th><th>Services</th><th>Amount</th><th>Status</th></tr></thead>
 <tbody>
 {detail.todayBookings.map((b: any) => (
 <tr key={b._id}>
 <td style={{ fontSize: 12 }}>{b.customerName}</td>
 <td style={{ fontSize: 12 }}>{b.time}</td>
 <td style={{ fontSize: 12 }}>{b.services?.map((s: any) => s.name).join(", ")}</td>
 <td style={{ fontSize: 12 }}>₹{b.totalAmount}</td>
 <td><StatusBadge status={b.status} /></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* Recent Reviews */}
 {detail.reviews && detail.reviews.length > 0 && (
 <div className="admin-card" style={{ padding: 16 }}>
 <div className="admin-card-title" style={{ marginBottom: 12 }}>Recent Reviews</div>
 {detail.reviews.map((r: any) => (
 <div key={r._id} style={{ padding: "10px 0", borderBottom: "1px solid var(--admin-border)" }}>
 <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
 {Array.from({ length: 5 }).map((_, i) => (
 <span key={i} style={{ fontSize: 12, color: i < r.rating ? "#fbbf24" : "#334155" }}>★</span>
 ))}
 <span style={{ fontSize: 11, color: "var(--admin-text-muted)", marginLeft: 4 }}>{r.customerName}</span>
 </div>
 <div style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>{r.reviewText}</div>
 </div>
 ))}
 </div>
 )}
 </div>
 </motion.div>
 </>
 );
}

export default function ShopsPage() {
 const { results: shops, loadMore, status } = usePaginatedQuery(
 api.admin.adminGetAllShops,
 { statusFilter: undefined },
 { initialNumItems: 50 }
 );
 const approveShop = useMutation(api.admin.adminApproveShop);
 const rejectShop = useMutation(api.admin.adminRejectShop);
 const toggleActive = useMutation(api.admin.adminToggleShopActive);

 const [selectedShopId, setSelectedShopId] = useState<Id<"shops"> | null>(null);
 const [statusFilter, setStatusFilter] = useState("all");
 const [search, setSearch] = useState("");

 const pending = (shops || []).filter((s: any) => s.status === "pending");
 const filtered = (shops || []).filter((s: any) => {
 if (statusFilter !== "all" && s.status !== statusFilter) return false;
 if (search && !s.shopName?.toLowerCase().includes(search.toLowerCase()) && !s.address?.toLowerCase().includes(search.toLowerCase())) return false;
 return true;
 });

 const statusDist = [
 { name: "Approved", value: (shops || []).filter((s: any) => s.status === "approved").length },
 { name: "Pending", value: (shops || []).filter((s: any) => s.status === "pending").length },
 { name: "Rejected", value: (shops || []).filter((s: any) => s.status === "rejected").length },
 ];

 const columns: Column<any>[] = [
 { key: "shopName", label: "Shop", sortable: true, render: (s) => <span style={{ fontWeight: 500 }}>{s.shopName}</span> },
 { key: "address", label: "Address", render: (s) => <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{s.address}</span> },
 { key: "status", label: "Status", sortable: true, render: (s) => <StatusBadge status={s.status || "pending"} /> },
 { key: "isActive", label: "Active", render: (s) => (
 <label className="admin-toggle" onClick={(e) => e.stopPropagation()}>
 <input type="checkbox" checked={!!s.isActive} onChange={async () => { try { await toggleActive({ shopId: s._id }); } catch(e: any) { toast.error(e.message); } }} />
 <span className="admin-toggle-slider" />
 </label>
 )},
 { key: "isOpen", label: "Open", render: (s) => s.isOpen ? <span className="admin-badge admin-badge-success">Open</span> : <span className="admin-badge admin-badge-muted">Closed</span> },
 { key: "rating", label: "Rating", sortable: true, render: (s) => <span>{s.rating?.toFixed(1)}</span> },
 { key: "totalReviews", label: "Reviews", sortable: true },
 { key: "_creationTime", label: "Registered", sortable: true, render: (s) => format(new Date(s._creationTime), "dd MMM yyyy") },
 ];

 const handleApprove = async (shopId: any, e: React.MouseEvent) => {
 e.stopPropagation();
 try { await approveShop({ shopId }); toast.success("Shop approved!"); }
 catch (err: any) { toast.error(err.message); }
 };

 const handleReject = async (shopId: any, e: React.MouseEvent) => {
 e.stopPropagation();
 const reason = window.prompt("Rejection reason:");
 if (!reason) return;
 try { await rejectShop({ shopId, reason }); toast.success("Shop rejected."); }
 catch (err: any) { toast.error(err.message); }
 };

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Shops Management</h1>
 <p className="admin-page-subtitle">{(shops || []).length} total shops</p>
 </div>
 <ExportCSVButton data={filtered} columns={[
 { key: "shopName", label: "Name" }, { key: "address", label: "Address" },
 { key: "status", label: "Status" }, { key: "rating", label: "Rating" },
 { key: "phone", label: "Phone" },
 ]} filename="shops.csv" />
 </div>

 {/* Analytics */}
 <div className="admin-chart-grid admin-chart-grid-2" style={{ marginBottom: 24 }}>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Shop Status Breakdown</div>
 <ResponsiveContainer width="100%" height={160}>
 <PieChart>
 <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
 <Cell fill="#10b981" /><Cell fill="#f59e0b" /><Cell fill="#f43f5e" />
 </Pie>
 <Tooltip {...TOOLTIP_STYLE} />
 </PieChart>
 </ResponsiveContainer>
 <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4 }}>
 {statusDist.map((s, i) => (
 <div key={s.name} style={{ fontSize: 11, color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
 <span style={{ width: 8, height: 8, borderRadius: "50%", background: [STATUS_COLORS.approved, STATUS_COLORS.pending, STATUS_COLORS.rejected][i], display: "inline-block" }} />
 {s.name}: {s.value}
 </div>
 ))}
 </div>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Quick Stats</div>
 <div className="admin-stat-row"><span className="admin-stat-label">Total Shops</span><span className="admin-stat-value">{(shops || []).length}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Approved</span><span className="admin-stat-value" style={{ color: "var(--admin-success)" }}>{statusDist[0].value}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Pending Review</span><span className="admin-stat-value" style={{ color: "var(--admin-warning)" }}>{statusDist[1].value}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Rejected</span><span className="admin-stat-value" style={{ color: "var(--admin-danger)" }}>{statusDist[2].value}</span></div>
 <div className="admin-stat-row"><span className="admin-stat-label">Currently Open</span><span className="admin-stat-value">{(shops || []).filter((s: any) => s.isOpen).length}</span></div>
 </div>
 </div>

 {/* Pending Approval Queue */}
 {pending.length > 0 && (
 <div className="admin-card" style={{ marginBottom: 24 }}>
 <div className="admin-card-header">
 <div className="admin-card-title" style={{ color: "#fbbf24" }}> Pending Approvals ({pending.length})</div>
 </div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
 {pending.map((shop: any) => (
 <div key={shop._id} style={{ background: "var(--admin-surface-2)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: 16, cursor: "pointer" }} onClick={() => setSelectedShopId(shop._id)}>
 <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{shop.shopName}</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginBottom: 2 }}>{shop.address}</div>
 {shop.phone && <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginBottom: 10 }}> {shop.phone}</div>}
 <div style={{ display: "flex", gap: 8 }}>
 <button className="admin-btn admin-btn-success admin-btn-sm" style={{ flex: 1 }} onClick={(e) => handleApprove(shop._id, e)}>
 Approve
 </button>
 <button className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }} onClick={(e) => handleReject(shop._id, e)}>
 Reject
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Filters */}
 <div className="admin-card" style={{ marginBottom: 16, padding: "14px 16px" }}>
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
 <div className="admin-search-wrap" style={{ maxWidth: 280, flex: "none" }}>
 <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
 <input className="admin-search-input" placeholder="Search shops…" value={search} onChange={(e) => setSearch(e.target.value)} />
 </div>
 <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
 <option value="all">All Status</option>
 <option value="approved">Approved</option>
 <option value="pending">Pending</option>
 <option value="rejected">Rejected</option>
 </select>
 <span style={{ fontSize: 13, color: "var(--admin-text-muted)", marginLeft: "auto" }}>{filtered.length} shops</span>
 </div>
 </div>

 {/* Table */}
 <DataTable
 columns={columns}
 data={filtered}
 pageSize={25}
 onRowClick={(s) => setSelectedShopId(s._id)}
 loading={status === "LoadingFirstPage"}
 />

 {status === "CanLoadMore" && (
 <div style={{ textAlign: "center", marginTop: 16 }}>
 <button className="admin-btn admin-btn-secondary" onClick={() => loadMore(50)}>Load More Shops</button>
 </div>
 )}

 {/* Shop Detail Drawer */}
 <AnimatePresence>
 {selectedShopId && (
 <ShopDetailPanel shopId={selectedShopId} onClose={() => setSelectedShopId(null)} />
 )}
 </AnimatePresence>
 </div>
 );
}
