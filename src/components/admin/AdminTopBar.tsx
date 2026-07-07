import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { auth } from "@/lib/firebase";

interface Props { onMenuToggle?: () => void; }

export default function AdminTopBar({ onMenuToggle }: Props) {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const initials = (user?.displayName || user?.email || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="admin-topbar">
      {onMenuToggle && (
        <button className="admin-btn admin-btn-icon admin-btn-secondary" onClick={onMenuToggle} title="Toggle sidebar">
          <Menu size={16} />
        </button>
      )}

      {/* Global Search */}
      <div className="admin-search-wrap">
        <Search className="admin-search-icon" />
        <input
          className="admin-search-input"
          placeholder="Search users, shops, bookings…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setShowSearch(true)}
          onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          id="admin-global-search"
        />
        {showSearch && searchVal.length >= 2 && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "var(--admin-surface-2)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            zIndex: 500,
            padding: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--admin-text-muted)" }}>
              Press Enter to search across all entities
            </div>
            <button
              className="admin-btn admin-btn-secondary"
              style={{ width: "100%", justifyContent: "flex-start" }}
              onMouseDown={() => { navigate(`/admin/users`); setSearchVal(""); }}
            >
              <Search size={14} /> Search for "{searchVal}" in Users
            </button>
            <button
              className="admin-btn admin-btn-secondary"
              style={{ width: "100%", justifyContent: "flex-start", marginTop: 4 }}
              onMouseDown={() => { navigate(`/admin/shops`); setSearchVal(""); }}
            >
              <Search size={14} /> Search for "{searchVal}" in Shops
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--admin-success)" }}>
        <div className="admin-live-dot" />
        Live
      </div>

      {/* Admin Avatar */}
      <div
        className="admin-avatar"
        style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", cursor: "pointer" }}
        title={user?.email || "Admin"}
      >
        {initials}
      </div>
    </div>
  );
}
