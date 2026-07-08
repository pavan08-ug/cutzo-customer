import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";

export default function LiveOpsPage() {
 const ops = useQuery(api.admin.adminGetLiveOperations);

 const now = Date.now();
 const staleWalkIns = (ops?.activeWalkIns || []).filter((w: any) => w.calculatedFinishTime < now);

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title"> Live Operations</h1>
 <p className="admin-page-subtitle">Real-time view of every active session across all shops</p>
 </div>
 <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--admin-success)" }}>
 <div className="admin-live-dot" />
 Live — auto-updating
 </div>
 </div>

 {/* Stale alerts */}
 {staleWalkIns.length > 0 && (
 <div className="admin-alert admin-alert-danger" style={{ marginBottom: 24 }}>
 <div>
 <div style={{ fontWeight: 600, color: "#fb7185" }}>
 {staleWalkIns.length} Stale Walk-in Session{staleWalkIns.length > 1 ? "s" : ""} Detected
 </div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
 These sessions have exceeded their estimated duration but are still marked Active.
 </div>
 </div>
 </div>
 )}

 {/* Summary KPIs */}
 <div className="admin-kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-danger)" }}>{ops?.activeWalkIns?.length ?? "…"}</div>
 <div className="admin-kpi-label">Active Walk-ins</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-accent)" }}>{ops?.activeBookings?.length ?? "…"}</div>
 <div className="admin-kpi-label">Active Bookings</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-warning)" }}>{staleWalkIns.length}</div>
 <div className="admin-kpi-label">Stale Sessions</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-success)" }}>
 {new Set([...(ops?.activeWalkIns || []).map((w: any) => w.shopId), ...(ops?.activeBookings || []).map((b: any) => b.shopId)]).size}
 </div>
 <div className="admin-kpi-label">Shops with Sessions</div>
 </div>
 </div>

 {/* Barber Statuses */}
 {ops?.barberStatuses && ops.barberStatuses.length > 0 && (
 <div className="admin-card" style={{ marginBottom: 24 }}>
 <div className="admin-card-header">
 <div className="admin-card-title"> Barber Statuses</div>
 </div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
 {ops.barberStatuses.map((b: any) => (
 <div key={b._id} style={{
 padding: "12px 14px",
 background: b.currentStatus === "busy" ? "rgba(244,63,94,0.08)" : "rgba(16,185,129,0.08)",
 border: `1px solid ${b.currentStatus === "busy" ? "rgba(244,63,94,0.25)" : "rgba(16,185,129,0.25)"}`,
 borderRadius: 10,
 display: "flex", alignItems: "center", gap: 10,
 }}>
 <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.currentStatus === "busy" ? "var(--admin-danger)" : "var(--admin-success)", flexShrink: 0 }} />
 <div>
 <div style={{ fontSize: 12, fontWeight: 600 }}>{b.currentStatus === "busy" ? "Busy" : "Idle"}</div>
 {b.currentServiceType && <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{b.currentServiceType}</div>}
 {b.currentStatus === "busy" && b.busyUntil > now && (
 <div style={{ fontSize: 10, color: "var(--admin-text-muted)" }}>
 Free in {Math.max(0, Math.round((b.busyUntil - now) / 60000))} min
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Active Walk-ins Table */}
 <div className="admin-card" style={{ marginBottom: 24, padding: 0 }}>
 <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
 <div className="admin-live-dot" />
 <div className="admin-card-title">Active Walk-ins ({ops?.activeWalkIns?.length ?? 0})</div>
 </div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead>
 <tr>
 <th>Shop</th>
 <th>Service</th>
 <th>Started</th>
 <th>Est. Duration</th>
 <th>Finish Time</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 {(ops?.activeWalkIns || []).length === 0 ? (
 <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No active walk-ins right now</td></tr>
 ) : (
 (ops?.activeWalkIns || []).map((w: any) => {
 const isStale = w.calculatedFinishTime < now;
 const remaining = Math.max(0, Math.round((w.calculatedFinishTime - now) / 60000));
 return (
 <tr key={w._id} style={{ background: isStale ? "rgba(244,63,94,0.05)" : undefined }}>
 <td style={{ fontWeight: 500 }}>{w.shopName}</td>
 <td>{w.serviceName}</td>
 <td style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
 {formatDistanceToNow(new Date(w.startTime), { addSuffix: true })}
 </td>
 <td>{w.estimatedDuration} min</td>
 <td style={{ fontSize: 12 }}>
 {isStale
 ? <span style={{ color: "var(--admin-danger)", fontWeight: 600 }}>Overdue by {Math.round((now - w.calculatedFinishTime) / 60000)} min</span>
 : <span style={{ color: "var(--admin-success)" }}>{remaining} min remaining</span>
 }
 </td>
 <td>
 {isStale
 ? <span className="admin-badge admin-badge-danger"> Stale</span>
 : <span className="admin-badge admin-badge-success">Active</span>
 }
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Active Bookings Table */}
 <div className="admin-card" style={{ padding: 0 }}>
 <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
 <div className="admin-live-dot" style={{ background: "var(--admin-accent)" }} />
 <div className="admin-card-title">Active Online Bookings ({ops?.activeBookings?.length ?? 0})</div>
 </div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead>
 <tr>
 <th>Customer</th>
 <th>Shop</th>
 <th>Services</th>
 <th>Amount</th>
 <th>Time</th>
 <th>OTP</th>
 </tr>
 </thead>
 <tbody>
 {(ops?.activeBookings || []).length === 0 ? (
 <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No active online bookings right now</td></tr>
 ) : (
 (ops?.activeBookings || []).map((b: any) => (
 <tr key={b._id}>
 <td>
 <div style={{ fontWeight: 500, fontSize: 13 }}>{b.customerName}</div>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{b.customerPhone}</div>
 </td>
 <td style={{ fontWeight: 500 }}>{b.shopName}</td>
 <td style={{ fontSize: 12 }}>{(b.services || []).map((s: any) => s.name).join(", ")}</td>
 <td style={{ fontWeight: 600, color: "var(--admin-success)" }}>₹{b.totalAmount}</td>
 <td style={{ fontSize: 12 }}>{b.time}</td>
 <td>
 {b.otpVerified
 ? <span className="admin-badge admin-badge-success"> Verified</span>
 : <span className="admin-badge admin-badge-muted">Pending</span>
 }
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
