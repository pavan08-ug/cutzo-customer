import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import KPICard from "../shared/KPICard";
import DateRangePicker, { DateRange } from "../shared/DateRangePicker";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const CHART_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

const TOOLTIP_STYLE = {
  contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
  labelStyle: { color: "#94a3b8", fontSize: 12 },
};

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString().split("T")[0];
}

export default function OverviewPage() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: daysAgo(30), to: new Date().toISOString().split("T")[0] });
  const stats = useQuery(api.admin.adminGetDashboardStats);
  const trend = useQuery(api.admin.adminGetBookingsTrend, { days: 30 });
  const userGrowth = useQuery(api.admin.adminGetUserGrowthTrend, { weeks: 12 });
  const topShops = useQuery(api.admin.adminGetTopShopsByRevenue, { limit: 10 });
  const hourly = useQuery(api.admin.adminGetBookingsByHour);
  const statusBreakdown = useQuery(api.admin.adminGetBookingStatusBreakdown);
  const allShops = useQuery(api.admin.adminGetAllShops, { paginationOpts: { numItems: 50, cursor: null } });
  const pendingShops = (allShops?.page || []).filter((s: any) => s.status === "pending");

  const approveShop = useMutation(api.admin.adminApproveShop);
  const rejectShop = useMutation(api.admin.adminRejectShop);

  const handleApprove = async (shopId: any) => {
    try { await approveShop({ shopId }); toast.success("Shop approved!"); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleReject = async (shopId: any) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    try { await rejectShop({ shopId, reason }); toast.success("Shop rejected."); }
    catch (e: any) { toast.error(e.message); }
  };

  const kpis = [
    { icon: "👥", label: "Total Users", value: stats?.totalUsers ?? 0, color: "#a78bfa", bg: "rgba(124,58,237,0.15)" },
    { icon: "🏪", label: "Total Shops", value: stats?.totalShops ?? 0, color: "#22d3ee", bg: "rgba(6,182,212,0.15)" },
    { icon: "✅", label: "Approved Shops", value: stats?.approvedShops ?? 0, color: "#34d399", bg: "rgba(16,185,129,0.15)" },
    { icon: "⏳", label: "Pending Approval", value: stats?.pendingShops ?? 0, color: "#fbbf24", bg: "rgba(245,158,11,0.15)" },
    { icon: "📅", label: "Today's Bookings", value: stats?.todayBookingCount ?? 0, color: "#22d3ee", bg: "rgba(6,182,212,0.15)" },
    { icon: "💰", label: "Today's Revenue", value: stats?.todayRevenue ?? 0, color: "#34d399", bg: "rgba(16,185,129,0.15)", prefix: "₹" },
    { icon: "⭐", label: "Platform Rating", value: stats?.avgRating ?? 0, color: "#fbbf24", bg: "rgba(245,158,11,0.15)", suffix: "/5" },
    { icon: "🔴", label: "Live Sessions", value: stats?.liveActiveSessions ?? 0, color: "#fb7185", bg: "rgba(244,63,94,0.15)" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Overview Dashboard</h1>
          <p className="admin-page-subtitle">Real-time platform intelligence</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Pending Approvals Banner */}
      {pendingShops.length > 0 && (
        <div className="admin-alert admin-alert-warning" style={{ marginBottom: 24 }}>
          <Clock size={18} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#fbbf24" }}>
              {pendingShops.length} Shop{pendingShops.length > 1 ? "s" : ""} Waiting for Approval
            </div>
            <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>
              Review and approve or reject from the Shops section, or use quick actions below.
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="admin-kpi-grid">
        {kpis.map((k, i) => (
          <KPICard key={k.label} {...k} index={i} />
        ))}
      </div>

      {/* Charts Row 1: Bookings Trend + Revenue Trend */}
      <div className="admin-chart-grid admin-chart-grid-2" style={{ marginBottom: 20 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">📈 Bookings (Last 30 Days)</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={false} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">💰 Revenue (Last 30 Days)</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend || []}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Status Donut + User Growth + Hourly */}
      <div className="admin-chart-grid admin-chart-grid-3" style={{ marginBottom: 20 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">🍩 Booking Status</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusBreakdown || []} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={85} animationDuration={800}>
                {(statusBreakdown || []).map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {(statusBreakdown || []).map((s: any, i: number) => (
              <div key={s.status} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], display: "inline-block" }} />
                <span style={{ color: "var(--admin-text-muted)" }}>{s.status}: {s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">👥 User Signups (12w)</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">⏰ Bookings by Hour</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={(hourly || []).filter((h: any) => h.count > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip {...TOOLTIP_STYLE} labelFormatter={(v) => `${v}:00`} />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Shops by Revenue */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <div className="admin-card-title">🏆 Top 10 Shops by Revenue</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topShops || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="shopName" width={130} tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Approval Quick Action */}
      {pendingShops.length > 0 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">⏳ Quick Approvals</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {pendingShops.slice(0, 6).map((shop: any) => (
              <div key={shop._id} style={{
                background: "var(--admin-surface-2)",
                border: "1px solid var(--admin-border)",
                borderRadius: 12, padding: 16,
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{shop.shopName}</div>
                <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{shop.address}</div>
                {shop.phone && <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>📞 {shop.phone}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="admin-btn admin-btn-success admin-btn-sm" style={{ flex: 1 }} onClick={() => handleApprove(shop._id)}>
                    <CheckCircle size={12} /> Approve
                  </button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }} onClick={() => handleReject(shop._id)}>
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
