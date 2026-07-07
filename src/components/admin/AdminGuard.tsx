import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { ADMIN_TOKEN_IDENTIFIERS } from "../../../convex/adminConfig";
import { onIdTokenChanged, getIdToken, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Lock, LogIn, CheckCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface Props { children: React.ReactNode; }

export default function AdminGuard({ children }: Props) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied" | "unauthenticated">("loading");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setStatus("unauthenticated");
        return;
      }
      const token = await getIdToken(user).catch(() => null);
      const uid = user.uid;

      const isDirectAccess = ADMIN_TOKEN_IDENTIFIERS.includes("*");
      if (isDirectAccess) {
        setStatus("allowed");
        return;
      }

      const isAdmin =
        ADMIN_TOKEN_IDENTIFIERS.length === 0
          ? false
          : ADMIN_TOKEN_IDENTIFIERS.some(
              (id) =>
                id === uid ||
                id.endsWith(`|${uid}`) ||
                id === token
            );

      if (ADMIN_TOKEN_IDENTIFIERS.length === 0) {
        setStatus("denied");
      } else {
        setStatus(isAdmin ? "allowed" : "denied");
      }
    });
    return unsub;
  }, []);

  const handleAdminSignIn = async () => {
    setSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in! Accessing Admin Portal…");
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Sign-in failed: " + error.message);
      }
    } finally {
      setSigningIn(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#09090b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Verifying Admin Security Portal…</p>
        </div>
      </div>
    );
  }

  // Admin Login Portal when unauthenticated
  if (status === "unauthenticated") {
    const isDirectAccess = ADMIN_TOKEN_IDENTIFIERS.includes("*");
    return (
      <div className="admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", background: "radial-gradient(circle at 50% 20%, rgba(124,58,237,0.15) 0%, #09090b 70%)", padding: 20 }}>
        <div style={{
          background: "rgba(30, 30, 46, 0.7)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 24,
          padding: 40, maxWidth: 440, width: "100%", textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.15)",
        }}>
          <div style={{
            width: 64, height: 64, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            color: "#a78bfa", boxShadow: "0 8px 24px rgba(124,58,237,0.25)"
          }}>
            <Lock size={28} />
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", marginBottom: 8, letterSpacing: "-0.02em" }}>
            Cutzo Admin Portal
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.5, marginBottom: 28 }}>
            Restricted system. Please authenticate to manage shops, bookings, users, and live operations.
          </p>

          {isDirectAccess && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
              background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: 12, marginBottom: 24, textAlign: "left"
            }}>
              <CheckCircle size={18} style={{ color: "#34d399", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>Direct Access Mode Active</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Sign in with any account to instantly access the dashboard.</div>
              </div>
            </div>
          )}

          <button
            onClick={handleAdminSignIn}
            disabled={signingIn}
            style={{
              width: "100%", padding: "14px 20px", borderRadius: 14,
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              color: "white", fontWeight: 700, fontSize: 15, border: "none",
              cursor: signingIn ? "not-allowed" : "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)", transition: "all 0.2s ease",
              opacity: signingIn ? 0.7 : 1
            }}
          >
            <LogIn size={18} />
            {signingIn ? "Authenticating…" : "Sign In to Admin Portal"}
          </button>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ShieldAlert size={14} />
            <span>Encrypted Convex Real-time Session</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    if (ADMIN_TOKEN_IDENTIFIERS.length === 0) {
      return (
        <div className="admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#09090b" }}>
          <div className="admin-card" style={{ maxWidth: 480, textAlign: "center", padding: 36 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#f8fafc" }}>Admin Panel Setup Required</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              The admin allowlist is empty. Open <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4, color: "#a78bfa" }}>convex/adminConfig.ts</code> and add your Firebase UID or set <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4, color: "#34d399" }}>"*"</code> for direct access.
            </p>
          </div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
