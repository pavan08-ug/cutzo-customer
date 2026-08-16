/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AppErrorBoundary  ·  src/components/cutzo/AppErrorBoundary.tsx
 *
 *  React Error Boundary for catching render-time exceptions.
 *  Renders a full-screen fallback with the same obfuscated reference code
 *  pattern used by the toast system.
 *
 *  Wrap your top-level App (or individual route pages) with this component:
 *
 *    <AppErrorBoundary>
 *      <App />
 *    </AppErrorBoundary>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { formatError } from "@/lib/errorUtils";

interface Props {
  children: ReactNode;
  /** Optional fallback override — defaults to the built-in screen */
  fallback?: (errorCode: string | null, retry: () => void) => ReactNode;
}

interface State {
  hasError:      boolean;
  userMessage:   string;
  referenceCode: string | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError:      false,
      userMessage:   "An unexpected error occurred.",
      referenceCode: null,
    };
  }

  static getDerivedStateFromError(err: unknown): State {
    return {
      hasError:      true,
      userMessage:   formatError(err),
      referenceCode: null,
    };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    // Log to console — visible only in developer tools / Convex dashboard
    console.error("[AppErrorBoundary]", err, info.componentStack);
  }

  retry = () => {
    this.setState({ hasError: false, userMessage: "", referenceCode: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(this.state.referenceCode, this.retry);
    }

    return (
      <ErrorFallbackScreen
        userMessage={this.state.userMessage}
        referenceCode={this.state.referenceCode}
        onRetry={this.retry}
      />
    );
  }
}

// ── Default full-screen fallback ──────────────────────────────────────────────

interface FallbackProps {
  userMessage:   string;
  referenceCode: string | null;
  onRetry:       () => void;
}

function ErrorFallbackScreen({ userMessage, referenceCode, onRetry }: FallbackProps) {
  const copyCode = () => {
    if (referenceCode && navigator.clipboard) {
      navigator.clipboard.writeText(referenceCode).catch(() => {});
    }
  };

  return (
    <div
      style={{
        minHeight:      "100dvh",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background:     "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 100%)",
        padding:        "24px",
        fontFamily:     "'Inter', sans-serif",
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>⚠️</div>

      {/* Headline */}
      <h1
        style={{
          fontFamily:    "'Montserrat', sans-serif",
          fontSize:      "28px",
          fontWeight:    800,
          color:         "#f8fafc",
          margin:        "0 0 8px",
          textAlign:     "center",
        }}
      >
        Oops! Something went wrong.
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize:   "15px",
          color:      "#94a3b8",
          textAlign:  "center",
          maxWidth:   "360px",
          lineHeight: "1.6",
          margin:     "0 0 32px",
        }}
      >
        {userMessage}
      </p>

      {/* Reference code card — the screenshot target */}
      {referenceCode && (
        <div
          style={{
            background:    "rgba(239, 68, 68, 0.07)",
            border:        "1.5px solid rgba(239, 68, 68, 0.35)",
            borderRadius:  "14px",
            padding:       "20px 24px",
            marginBottom:  "28px",
            textAlign:     "center",
            minWidth:      "280px",
          }}
        >
          <p
            style={{
              margin:        "0 0 6px",
              fontSize:      "11px",
              color:         "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Error Reference Code
          </p>
          <p
            id="error-boundary-code"
            style={{
              margin:        "0 0 14px",
              fontFamily:    "'Courier New', Courier, monospace",
              fontSize:      "26px",
              fontWeight:    700,
              color:         "#ef4444",
              letterSpacing: "0.15em",
              userSelect:    "all",
            }}
          >
            {referenceCode}
          </p>
          <button
            onClick={copyCode}
            style={{
              background:    "rgba(239, 68, 68, 0.15)",
              border:        "1px solid rgba(239,68,68,0.35)",
              borderRadius:  "8px",
              color:         "#ef4444",
              cursor:        "pointer",
              fontSize:      "12px",
              fontWeight:    600,
              padding:       "6px 16px",
              transition:    "background 0.15s",
            }}
          >
            Copy Code
          </button>
          <p
            style={{
              marginTop:  "12px",
              fontSize:   "12px",
              color:      "#475569",
            }}
          >
            Share this code when requesting support.
          </p>
        </div>
      )}

      {/* Retry button */}
      <button
        id="error-boundary-retry"
        onClick={onRetry}
        style={{
          background:    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          border:        "none",
          borderRadius:  "10px",
          color:         "#fff",
          cursor:        "pointer",
          fontSize:      "15px",
          fontWeight:    600,
          padding:       "12px 32px",
          boxShadow:     "0 4px 16px rgba(99,102,241,0.3)",
          transition:    "transform 0.1s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
          (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = "translateY(0)";
          (e.target as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)";
        }}
      >
        Try Again
      </button>
    </div>
  );
}
