import { NavLink, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  LayoutDashboard, Users, Store, CalendarDays, Star, TrendingUp,
  Radio, Gift, Bell, HeartPulse, Settings, FileText, LogOut
} from "lucide-react";
import { auth } from "@/lib/firebase";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/shops", label: "Shops", icon: Store },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/analytics", label: "Growth Analytics", icon: TrendingUp },
  { to: "/admin/live", label: "Live Ops", icon: Radio, live: true },
  { to: "/admin/offers", label: "Offers", icon: Gift },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/health", label: "System Health", icon: HeartPulse },
  { to: "/admin/config", label: "App Config", icon: Settings },
  { to: "/admin/logs", label: "Activity Log", icon: FileText },
];

export default function AdminSidebar() {
  const stats = useQuery(api.admin.adminGetDashboardStats);
  const location = useLocation();

  return (
    <nav className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-icon">C</div>
        <div>
          <div className="admin-sidebar-logo-text">Cutzo Admin</div>
          <div style={{ fontSize: 10, color: "var(--admin-text-muted)", marginTop: 1 }}>Super Dashboard</div>
        </div>
      </div>

      <div className="admin-sidebar-section-label">Navigation</div>

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.end
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`admin-nav-item${isActive ? " active" : ""}`}
            end={item.end}
          >
            <Icon className="nav-icon" />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.live && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div className="admin-live-dot" style={{ width: 6, height: 6 }} />
              </div>
            )}
            {item.label === "Shops" && (stats?.pendingShops ?? 0) > 0 && (
              <span className="nav-badge">{stats!.pendingShops}</span>
            )}
            {item.label === "Live Ops" && (stats?.liveActiveSessions ?? 0) > 0 && (
              <span className="nav-badge">{stats!.liveActiveSessions}</span>
            )}
          </NavLink>
        );
      })}

      <div style={{ flex: 1 }} />

      <div style={{ padding: "12px 8px 16px", borderTop: "1px solid var(--admin-border)" }}>
        <button
          onClick={() => auth.signOut()}
          className="admin-nav-item admin-btn"
          style={{ width: "100%", margin: 0 }}
        >
          <LogOut className="nav-icon" style={{ width: 16, height: 16 }} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
