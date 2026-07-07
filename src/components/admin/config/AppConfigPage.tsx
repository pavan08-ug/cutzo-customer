import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AppConfigPage() {
  const configs = useQuery(api.admin.adminGetAppConfig);
  const setConfig = useMutation(api.admin.adminSetConfig);

  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const getValue = (key: string, fallback: string = "") => {
    if (key in localValues) return localValues[key];
    const found = (configs || []).find((c: any) => c.key === key);
    return found?.value ?? fallback;
  };

  const handleSave = async (key: string) => {
    const value = localValues[key];
    if (value === undefined) return;
    setSaving(key);
    try {
      await setConfig({ key, value });
      toast.success(`Config "${key}" saved!`);
      setLocalValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(null); }
  };

  const CONFIG_FIELDS: { key: string; label: string; description: string; type?: string; section: string }[] = [
    // General
    { section: "General", key: "app.name", label: "App Name", description: "Display name shown in the app header" },
    { section: "General", key: "app.tagline", label: "App Tagline", description: "Subtitle shown on home screen" },
    { section: "General", key: "app.supportEmail", label: "Support Email", description: "Customer-facing support email address" },
    { section: "General", key: "app.announcement", label: "Announcement Banner", description: "Shown at top of home screen (leave blank to hide)" },
    // Booking Policies
    { section: "Booking Policy", key: "booking.cancelWindowHours", label: "Cancellation Window (hours)", description: "How many hours before booking a customer can cancel", type: "number" },
    { section: "Booking Policy", key: "booking.noShowStrikeLimit", label: "No-show Strike Limit", description: "Strikes before booking ban is triggered", type: "number" },
    { section: "Booking Policy", key: "booking.staleSessionMinutes", label: "Stale Session Threshold (min)", description: "Minutes over estimated duration before flagging as stale", type: "number" },
    { section: "Booking Policy", key: "booking.maxAdvanceDays", label: "Max Advance Booking (days)", description: "How many days ahead customers can book", type: "number" },
    // Business
    { section: "Business", key: "business.platformFeePercent", label: "Platform Fee (%)", description: "Percentage fee charged on each booking", type: "number" },
    { section: "Business", key: "business.defaultCurrency", label: "Default Currency", description: "Currency symbol (e.g. ₹)" },
    // Notifications
    { section: "Notifications", key: "notif.reminderHours", label: "Booking Reminder (hours before)", description: "How many hours before booking to send reminder", type: "number" },
    { section: "Notifications", key: "notif.fcmEnabled", label: "FCM Push Enabled", description: "Whether FCM push notifications are active (true/false)" },
    // Feature Flags
    { section: "Feature Flags", key: "feature.walkInEnabled", label: "Walk-in Mode", description: "Enable/disable walk-in booking globally (true/false)" },
    { section: "feature.reviewsEnabled", key: "feature.reviewsEnabled", label: "Reviews Enabled", description: "Enable/disable review submission (true/false)" },
    { section: "Feature Flags", key: "feature.maintenanceMode", label: "Maintenance Mode", description: "Blocks all new bookings with a maintenance message (true/false)" },
  ];

  const sections = Array.from(new Set(CONFIG_FIELDS.map((f) => f.section)));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">App Configuration</h1>
          <p className="admin-page-subtitle">Global platform settings and feature flags</p>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section} className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-title" style={{ marginBottom: 16 }}>
            {section === "General" && "⚙️ "}
            {section === "Booking Policy" && "📅 "}
            {section === "Business" && "💼 "}
            {section === "Notifications" && "🔔 "}
            {section === "Feature Flags" && "🚩 "}
            {section}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CONFIG_FIELDS.filter((f) => f.section === section).map((field) => {
              const val = getValue(field.key);
              const isDirty = field.key in localValues;
              return (
                <div key={field.key}>
                  <label className="admin-label">{field.label}</label>
                  <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 6 }}>{field.description}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="admin-input"
                      type={field.type === "number" ? "number" : "text"}
                      value={val}
                      onChange={(e) => setLocalValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      style={{ borderColor: isDirty ? "var(--admin-accent)" : undefined }}
                    />
                    {isDirty && (
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => handleSave(field.key)}
                        disabled={saving === field.key}
                        style={{ flexShrink: 0 }}
                      >
                        <Save size={13} />
                        {saving === field.key ? "Saving…" : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Raw JSON View */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 12 }}>📦 Raw Config (All Keys)</div>
        <pre style={{
          background: "var(--admin-surface-2)", padding: 16, borderRadius: 10,
          fontSize: 12, color: "#94a3b8", overflowX: "auto", fontFamily: "monospace",
        }}>
          {JSON.stringify(
            Object.fromEntries((configs || []).map((c: any) => [c.key, c.value])),
            null, 2
          )}
        </pre>
      </div>
    </div>
  );
}
