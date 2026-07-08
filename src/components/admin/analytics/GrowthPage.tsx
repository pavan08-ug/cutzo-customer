import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
 LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
 Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import DateRangePicker, { DateRange } from "../shared/DateRangePicker";

const TOOLTIP_STYLE = {
 contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};
const COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

function daysAgo(n: number) {
 return new Date(Date.now() - n * 86400000).toISOString().split("T")[0];
}

function TimeTrendsTab() {
 const trend90 = useQuery(api.admin.adminGetBookingsTrend, { days: 90 });
 const userGrowth = useQuery(api.admin.adminGetUserGrowthTrend, { weeks: 16 });
 const growth = useQuery(api.admin.adminGetGrowthStats);

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 <div className="admin-chart-grid admin-chart-grid-2">
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Bookings — Last 90 Days</div>
 <ResponsiveContainer width="100%" height={200}>
 <LineChart data={trend90 || []}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
 <Tooltip {...TOOLTIP_STYLE} />
 <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={false} name="Bookings" />
 </LineChart>
 </ResponsiveContainer>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Cumulative Revenue</div>
 <ResponsiveContainer width="100%" height={200}>
 <AreaChart data={(trend90 || []).map((d: any, i: number, arr: any[]) => ({
 date: d.date,
 cumRevenue: arr.slice(0, i + 1).reduce((s: number, x: any) => s + x.revenue, 0),
 }))}>
 <defs>
 <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
 <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v.toLocaleString("en-IN")}`, "Cumulative Revenue"]} />
 <Area type="monotone" dataKey="cumRevenue" stroke="#7c3aed" fill="url(#cumGrad)" strokeWidth={2} />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* MoM Growth KPIs */}
 {growth && (
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
 {[
 { label: "User Growth (MoM)", value: growth.userGrowth, prefix: "", suffix: "%", color: growth.userGrowth >= 0 ? "#34d399" : "#fb7185" },
 { label: "Booking Growth (MoM)", value: growth.bookingGrowth, prefix: "", suffix: "%", color: growth.bookingGrowth >= 0 ? "#34d399" : "#fb7185" },
 { label: "New Users (This Month)", value: growth.thisMonthUsers, prefix: "", suffix: "", color: "#a78bfa" },
 { label: "New Bookings (This Month)", value: growth.thisMonthBookings, prefix: "", suffix: "", color: "#22d3ee" },
 ].map((k) => (
 <div key={k.label} className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: k.color, fontSize: 24 }}>{k.prefix}{k.value}{k.suffix}</div>
 <div className="admin-kpi-label">{k.label}</div>
 </div>
 ))}
 </div>
 )}

 {/* Weekly User Growth */}
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> New User Signups (16 Weeks)</div>
 <ResponsiveContainer width="100%" height={180}>
 <BarChart data={userGrowth || []}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
 <Tooltip {...TOOLTIP_STYLE} />
 <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 );
}

function GeographicTab() {
 const geo = useQuery(api.admin.adminGetGeographicStats);
 const sorted = (geo || []).sort((a: any, b: any) => b.bookings - a.bookings);

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 <div className="admin-chart-grid admin-chart-grid-2">
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Top Cities by Bookings</div>
 <ResponsiveContainer width="100%" height={220}>
 <BarChart data={sorted.slice(0, 10)} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
 <YAxis type="category" dataKey="city" width={100} tick={{ fontSize: 11, fill: "#94a3b8" }} />
 <Tooltip {...TOOLTIP_STYLE} />
 <Bar dataKey="bookings" fill="#06b6d4" radius={[0, 4, 4, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Revenue by City</div>
 <ResponsiveContainer width="100%" height={220}>
 <BarChart data={sorted.slice(0, 10)} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
 <YAxis type="category" dataKey="city" width={100} tick={{ fontSize: 11, fill: "#94a3b8" }} />
 <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
 <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* City Table */}
 <div className="admin-card" style={{ padding: 0 }}>
 <div style={{ padding: "16px 20px" }} className="admin-card-title"> City Intelligence Table</div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead><tr><th>#</th><th>City</th><th>Users</th><th>Bookings</th><th>Revenue</th><th>Avg Order</th></tr></thead>
 <tbody>
 {sorted.map((city: any, i: number) => (
 <tr key={city.city}>
 <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{i + 1}</td>
 <td style={{ fontWeight: 500 }}>{city.city}</td>
 <td>{city.users}</td>
 <td>{city.bookings}</td>
 <td style={{ color: "var(--admin-success)", fontWeight: 600 }}>₹{city.revenue.toLocaleString("en-IN")}</td>
 <td>{city.bookings > 0 ? `₹${Math.round(city.revenue / city.bookings).toLocaleString("en-IN")}` : "—"}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}

function RevenueTab() {
 const trend = useQuery(api.admin.adminGetBookingsTrend, { days: 30 });
 const topShops = useQuery(api.admin.adminGetTopShopsByRevenue, { limit: 10 });

 const totalRev = (trend || []).reduce((s: number, d: any) => s + d.revenue, 0);
 const peakDay = (trend || []).reduce((best: any, d: any) => d.revenue > (best?.revenue || 0) ? d : best, null);

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-success)" }}>₹{(totalRev / 1000).toFixed(1)}K</div>
 <div className="admin-kpi-label">30-Day Revenue</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "#fbbf24", fontSize: 18 }}>{peakDay?.date || "—"}</div>
 <div className="admin-kpi-label">Peak Revenue Day</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-accent)" }}>
 ₹{trend && trend.filter((d: any) => d.count > 0).length > 0
 ? Math.round(totalRev / trend.filter((d: any) => d.count > 0).reduce((s: number, d: any) => s + d.count, 0))
 : 0}
 </div>
 <div className="admin-kpi-label">Avg Order Value</div>
 </div>
 </div>

 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Daily Revenue Trend (30 days)</div>
 <ResponsiveContainer width="100%" height={220}>
 <AreaChart data={trend || []}>
 <defs>
 <linearGradient id="revGrad3" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${v}`} />
 <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
 <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad3)" strokeWidth={2} />
 </AreaChart>
 </ResponsiveContainer>
 </div>

 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Top 10 Shops by Revenue</div>
 <ResponsiveContainer width="100%" height={220}>
 <BarChart data={topShops || []} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
 <YAxis type="category" dataKey="shopName" width={130} tick={{ fontSize: 11, fill: "#94a3b8" }} />
 <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
 <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 );
}

function RetentionTab() {
 const retention = useQuery(api.admin.adminGetRetentionStats);

 const funnel = retention ? [
 { label: "Registered", value: (retention.neverBooked + retention.bookedOnce + retention.bookedTwice + retention.bookedThreePlus), color: "#7c3aed" },
 { label: "Booked Once", value: retention.bookedOnce + retention.bookedTwice + retention.bookedThreePlus, color: "#06b6d4" },
 { label: "Booked Twice", value: retention.bookedTwice + retention.bookedThreePlus, color: "#10b981" },
 { label: "Regular (3+)", value: retention.bookedThreePlus, color: "#f59e0b" },
 ] : [];

 const total = funnel[0]?.value || 1;

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 {/* Funnel */}
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 20 }}> Booking Funnel</div>
 <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
 {funnel.map((stage, i) => (
 <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
 <div style={{ width: 100, fontSize: 13, color: "var(--admin-text-muted)", flexShrink: 0 }}>{stage.label}</div>
 <div style={{ flex: 1, height: 32, background: "var(--admin-surface-2)", borderRadius: 8, overflow: "hidden" }}>
 <div style={{
 height: "100%",
 width: `${(stage.value / total) * 100}%`,
 background: stage.color,
 borderRadius: 8,
 display: "flex",
 alignItems: "center",
 paddingLeft: 10,
 fontSize: 12,
 fontWeight: 700,
 color: "white",
 transition: "width 0.8s ease",
 }}>
 {stage.value}
 </div>
 </div>
 <div style={{ fontSize: 13, fontWeight: 600, width: 48, textAlign: "right" }}>
 {Math.round((stage.value / total) * 100)}%
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Retention KPIs */}
 {retention && (
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-text-muted)" }}>{retention.neverBooked}</div>
 <div className="admin-kpi-label">Never Booked</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "#06b6d4" }}>{retention.bookedOnce}</div>
 <div className="admin-kpi-label">Booked Once</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "#10b981" }}>{retention.bookedTwice}</div>
 <div className="admin-kpi-label">Booked Twice</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "#f59e0b" }}>{retention.bookedThreePlus}</div>
 <div className="admin-kpi-label">Regular Users (3+)</div>
 </div>
 </div>
 )}
 </div>
 );
}

function OperationsTab() {
 const trend = useQuery(api.admin.adminGetBookingsTrend, { days: 30 });
 const statusBreakdown = useQuery(api.admin.adminGetBookingStatusBreakdown);
 const hourly = useQuery(api.admin.adminGetBookingsByHour);

 const cancellationRate = statusBreakdown
 ? (() => {
 const total = statusBreakdown.reduce((s: number, x: any) => s + x.count, 0);
 const cancelled = statusBreakdown.find((x: any) => x.status === "cancelled")?.count || 0;
 return total > 0 ? Math.round((cancelled / total) * 100) : 0;
 })()
 : 0;

 const otpVerifiedRate = statusBreakdown
 ? (() => {
 const completed = statusBreakdown.find((x: any) => x.status === "completed")?.count || 0;
 const total = statusBreakdown.reduce((s: number, x: any) => s + x.count, 0);
 return total > 0 ? Math.round((completed / total) * 100) : 0;
 })()
 : 0;

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: cancellationRate > 30 ? "var(--admin-danger)" : "var(--admin-success)" }}>
 {cancellationRate}%
 </div>
 <div className="admin-kpi-label">Cancellation Rate</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-accent)" }}>{otpVerifiedRate}%</div>
 <div className="admin-kpi-label">Completion Rate</div>
 </div>
 </div>

 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Bookings per Day (30d)</div>
 <ResponsiveContainer width="100%" height={180}>
 <BarChart data={trend || []}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
 <Tooltip {...TOOLTIP_STYLE} />
 <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>

 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Booking Load by Hour</div>
 <ResponsiveContainer width="100%" height={160}>
 <BarChart data={hourly || []}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => `${v}h`} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
 <Tooltip {...TOOLTIP_STYLE} labelFormatter={(v) => `${v}:00`} />
 <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 );
}

const TABS = [
 { id: "trends", label: " Time Trends" },
 { id: "geo", label: " Geographic" },
 { id: "revenue", label: " Revenue" },
 { id: "retention", label: " Retention" },
 { id: "ops", label: " Operations" },
];

export default function GrowthPage() {
 const [activeTab, setActiveTab] = useState("trends");

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Growth Analytics</h1>
 <p className="admin-page-subtitle">Deep business intelligence across all dimensions</p>
 </div>
 </div>

 <div className="admin-tabs">
 {TABS.map((tab) => (
 <button
 key={tab.id}
 className={`admin-tab${activeTab === tab.id ? " active" : ""}`}
 onClick={() => setActiveTab(tab.id)}
 >
 {tab.label}
 </button>
 ))}
 </div>

 {activeTab === "trends" && <TimeTrendsTab />}
 {activeTab === "geo" && <GeographicTab />}
 {activeTab === "revenue" && <RevenueTab />}
 {activeTab === "retention" && <RetentionTab />}
 {activeTab === "ops" && <OperationsTab />}
 </div>
 );
}
