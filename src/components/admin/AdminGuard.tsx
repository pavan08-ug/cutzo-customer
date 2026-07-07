import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { ADMIN_TOKEN_IDENTIFIERS } from "../../../convex/adminConfig";
import { onIdTokenChanged, getIdToken } from "firebase/auth";

interface Props { children: React.ReactNode; }

export default function AdminGuard({ children }: Props) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setStatus("denied");
        return;
      }
      // Build tokenIdentifier using the Firebase ID token subject
      // The tokenIdentifier format in Convex is: "issuer|uid"
      // For Firebase, issuer is the Firebase auth domain
      const token = await getIdToken(user).catch(() => null);
      // Check if this user's UID is in the admin list OR the full tokenIdentifier
      const uid = user.uid;
      const isAdmin =
        ADMIN_TOKEN_IDENTIFIERS.length === 0 // if empty list, allow (development mode)
          ? false
          : ADMIN_TOKEN_IDENTIFIERS.some(
              (id) =>
                id === uid ||
                id.endsWith(`|${uid}`) ||
                id === token
            );
      if (ADMIN_TOKEN_IDENTIFIERS.length === 0) {
        // Allowlist is empty — show helpful message but block access
        setStatus("denied");
      } else {
        setStatus(isAdmin ? "allowed" : "denied");
      }
    });
    return unsub;
  }, []);

  if (status === "loading") {
    return (
      <div className="admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(124,58,237,0.3)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#64748b", fontSize: 14 }}>Checking admin access…</p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    if (ADMIN_TOKEN_IDENTIFIERS.length === 0) {
      return (
        <div className="admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
          <div className="admin-card" style={{ maxWidth: 480, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Admin Panel Setup Required</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              The admin allowlist is empty. Open <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>convex/adminConfig.ts</code> and add your Firebase UID to <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>ADMIN_TOKEN_IDENTIFIERS</code>.
            </p>
          </div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
