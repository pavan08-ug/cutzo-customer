import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const TOOLTIP_STYLE = {
  contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};

function ActionBadge({ action }: { action: string }) {
  const cls = action.includes("delete") || action.includes("ban") ? "admin-badge-danger"
    : action.includes("approve") ? "admin-badge-success"
    : action.includes("reject") ? "admin-badge-warning"
    : action.includes("update") || action.includes("edit") ? "admin-badge-info"
    : action.includes("send") || action.includes("notif") ? "admin-badge-violet"
    : "admin-badge-muted";
  return <span className={`admin-badge ${cls}`}>{action.replace(/_/g, " ")}</span>;
}

export default function ActivityLogPage() {
  const { results: logs, loadMore, status } = usePaginatedQuery(
    api.admin.adminGetAdminLogs,
    { adminId: undefined, actionFilter: undefined },
    { initialNumItems: 50 }
  );

  const [actionFilter, setActionFilter] = useState("all");

  const allActions = Array.from(new Set((logs || []).map((l: any) => l.action)));

  const actionFreq = allActions.map((action) => ({
    action,
    count: (logs || []).filter((l: any) => l.action === action).length,
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  const filtered = (logs || []).filter((l: any) => actionFilter === "all" || l.action === actionFilter);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity Log</h1>
          <p className="admin-page-subtitle">Full audit trail of all admin actions</p>
        </div>
      </div>

      {/* Action Frequency Chart */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-title" style={{ marginBottom: 12 }}>Most Common Admin Actions</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={actionFreq} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis type="category" dataKey="action" width={160} tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => v.replace(/_/g, " ")} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter */}
      <div className="admin-card" style={{ marginBottom: 16, padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select className="admin-select" style={{ maxWidth: 240 }} value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <option value="all">All Actions</option>
            {allActions.map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
            ))}
          </select>
          <span style={{ fontSize: 13, color: "var(--admin-text-muted)", marginLeft: "auto" }}>
            {filtered.length} entries
          </span>
        </div>
      </div>

      {/* Log Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Admin</th>
              <th>Target</th>
              <th>Details</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--admin-text-muted)" }}>
                  No log entries yet. Admin actions will appear here.
                </td>
              </tr>
            ) : (
              filtered.map((log: any) => (
                <tr key={log._id}>
                  <td><ActionBadge action={log.action} /></td>
                  <td style={{ fontSize: 12, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                    {log.adminId?.slice(-8) || "—"}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                    {log.targetId?.slice(-8) || "—"}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--admin-text-muted)", maxWidth: 200 }}>
                    {log.details ? (
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                        {typeof log.details === "string" ? log.details : JSON.stringify(log.details).slice(0, 60)}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={{ fontSize: 11, color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>
                    {formatDistanceToNow(new Date(log._creationTime), { addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {status === "CanLoadMore" && (
        <div className="admin-pagination">
          <button className="admin-btn admin-btn-secondary" onClick={() => loadMore(50)}>Load More Logs</button>
        </div>
      )}
    </div>
  );
}
