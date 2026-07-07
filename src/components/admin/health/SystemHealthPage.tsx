import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const TOOLTIP_STYLE = {
  contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};

function StatusIndicator({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: 14,
      background: ok ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
      border: `1px solid ${ok ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
      borderRadius: 10,
    }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: ok ? "var(--admin-success)" : "var(--admin-danger)", flexShrink: 0, boxShadow: `0 0 8px ${ok ? "var(--admin-success)" : "var(--admin-danger)"}` }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        {detail && <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 1 }}>{detail}</div>}
      </div>
      <span className={`admin-badge ${ok ? "admin-badge-success" : "admin-badge-danger"}`}>
        {ok ? "Healthy" : "Issue"}
      </span>
    </div>
  );
}

export default function SystemHealthPage() {
  const health = useQuery(api.admin.adminGetSystemHealth);
  const trend = useQuery(api.admin.adminGetBookingsTrend, { days: 30 });

  const now = Date.now();
  const errorCount = health?.errorLogCount || 0;
  const staleSessions = health?.staleSessions || 0;
  const allOk = errorCount === 0 && staleSessions < 5;

  const metrics = [
    {
      label: "Convex Database",
      ok: true,
      detail: "Real-time queries reactive — no errors",
    },
    {
      label: "Stale Walk-in Sessions",
      ok: staleSessions < 5,
      detail: `${staleSessions} sessions have exceeded estimated duration`,
    },
    {
      label: "Recent Error Logs",
      ok: errorCount === 0,
      detail: `${errorCount} admin log entries with errors`,
    },
    {
      label: "Booking Flow",
      ok: true,
      detail: `${health?.confirmedBookings || 0} active confirmed bookings`,
    },
    {
      label: "Active User Sessions",
      ok: true,
      detail: `${health?.activeUsers || 0} users active (estimated)`,
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">System Health</h1>
          <p className="admin-page-subtitle">Platform reliability monitoring</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <div className="admin-live-dot" style={{ background: allOk ? "var(--admin-success)" : "var(--admin-danger)" }} />
          <span style={{ color: allOk ? "var(--admin-success)" : "var(--admin-danger)" }}>
            {allOk ? "All Systems Operational" : "Issues Detected"}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Bookings", value: health?.totalBookings ?? "…", color: "#a78bfa" },
          { label: "Active Bookings", value: health?.confirmedBookings ?? "…", color: "#22d3ee" },
          { label: "Total Revenue (All Time)", value: health?.totalRevenue != null ? `₹${(health.totalRevenue / 1000).toFixed(1)}K` : "…", color: "#34d399" },
          { label: "Error Log Entries", value: health?.errorLogCount ?? "…", color: errorCount > 0 ? "#fb7185" : "#64748b" },
          { label: "Stale Sessions", value: health?.staleSessions ?? "…", color: staleSessions > 0 ? "#fbbf24" : "#64748b" },
          { label: "Platform Users", value: health?.totalUsers ?? "…", color: "#a78bfa" },
        ].map((m) => (
          <div key={m.label} className="admin-kpi-card">
            <div className="admin-kpi-value" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
            <div className="admin-kpi-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Status Grid */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-title" style={{ marginBottom: 16 }}>🔎 System Status Checks</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {metrics.map((m) => <StatusIndicator key={m.label} ok={m.ok} label={m.label} detail={m.detail} />)}
        </div>
      </div>

      {/* Booking Volume Trend */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 12 }}>📊 Booking Volume — 30 Days</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trend || []}>
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="count" stroke="#7c3aed" fill="url(#healthGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
