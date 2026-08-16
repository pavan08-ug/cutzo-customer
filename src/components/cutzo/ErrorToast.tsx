/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ErrorToast  ·  src/components/cutzo/ErrorToast.tsx
 *
 *  Screenshot-ready error notification component.
 *  Shows a polished card with:
 *   - A generic "Oops!" headline
 *   - A user-safe description
 *   - A clearly formatted Error Reference Code the user can quote in a screenshot
 *   - A "Copy code" button
 *
 *  The reference code is styled to stand out visually so it always appears
 *  clearly in screenshots, even on low-resolution phone cameras.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { toast } from "sonner";

// ── Imperative API (call from anywhere — hooks, event handlers, etc.) ─────────

/**
 * Fire an error toast from anywhere in the app.
 *
 * @param message       User-safe description (no tech words)
 * @param referenceCode The opaque code, e.g. "E-B1AU-74K-101". Omit to show generic toast.
 */
export function showErrorToast(message: string, referenceCode?: string): void {
  if (referenceCode) {
    toast.custom(
      () => <StructuredErrorToast message={message} referenceCode={referenceCode} />,
      {
        duration:  12000,
        id:        `err-${referenceCode}`,   // prevents duplicate toasts for the same error
        className: "cutzo-error-toast-wrapper",
      }
    );
  } else {
    toast.error(message || "An unexpected error occurred.", {
      duration: 6000,
    });
  }
}

// ── The toast card component ───────────────────────────────────────────────────

interface StructuredErrorToastProps {
  message:       string;
  referenceCode: string;
}

function StructuredErrorToast({ message, referenceCode }: StructuredErrorToastProps) {
  const copyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referenceCode).catch(() => {});
    }
  };

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        gap:           "10px",
        background:    "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border:        "1px solid rgba(239, 68, 68, 0.4)",
        borderRadius:  "14px",
        padding:       "16px 18px",
        minWidth:      "300px",
        maxWidth:      "380px",
        boxShadow:     "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(239,68,68,0.15)",
        fontFamily:    "'Inter', sans-serif",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>⚠️</span>
        <span
          style={{
            fontWeight:  700,
            fontSize:    "15px",
            color:       "#f8fafc",
            letterSpacing: "0.01em",
          }}
        >
          Oops! Something went wrong.
        </span>
      </div>

      {/* User message */}
      <p
        style={{
          margin:     0,
          fontSize:   "13px",
          color:      "#94a3b8",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>

      {/* Reference code block — SCREENSHOT TARGET */}
      <div
        style={{
          background:    "rgba(239, 68, 68, 0.08)",
          border:        "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius:  "8px",
          padding:       "10px 12px",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"space-between",
          gap:           "8px",
        }}
      >
        <div>
          <div
            style={{
              fontSize:      "10px",
              color:         "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom:  "3px",
            }}
          >
            Error Reference Code
          </div>
          <div
            id={`error-code-${referenceCode}`}
            style={{
              fontFamily:    "'Courier New', Courier, monospace",
              fontSize:      "17px",
              fontWeight:    700,
              color:         "#ef4444",
              letterSpacing: "0.12em",
              userSelect:    "all",
            }}
          >
            {referenceCode}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={copyCode}
          aria-label="Copy error code"
          style={{
            background:   "rgba(239, 68, 68, 0.15)",
            border:       "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "6px",
            color:        "#ef4444",
            cursor:       "pointer",
            fontSize:     "11px",
            fontWeight:   600,
            padding:      "5px 10px",
            whiteSpace:   "nowrap",
            transition:   "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(239,68,68,0.28)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
          }}
        >
          Copy
        </button>
      </div>

      {/* Helper text */}
      <p
        style={{
          margin:        0,
          fontSize:      "11px",
          color:         "#475569",
          lineHeight:    "1.4",
        }}
      >
        Please quote this code if you need support or share a screenshot.
      </p>
    </div>
  );
}
