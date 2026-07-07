import { useState } from "react";
import { Calendar } from "lucide-react";

export interface DateRange { from: string; to: string; }

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function daysAgo(n: number) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().split("T")[0];
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function DateRangePicker({ value, onChange }: Props) {
  const [custom, setCustom] = useState(false);

  const setPreset = (days: number) => {
    setCustom(false);
    onChange({ from: daysAgo(days), to: today() });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <Calendar size={14} style={{ color: "var(--admin-text-muted)" }} />
      {PRESETS.map((p) => (
        <button
          key={p.label}
          className={`admin-btn admin-btn-sm ${value.from === daysAgo(p.days) && value.to === today() && !custom ? "admin-btn-primary" : "admin-btn-secondary"}`}
          onClick={() => setPreset(p.days)}
        >
          Last {p.label}
        </button>
      ))}
      <button
        className={`admin-btn admin-btn-sm ${custom ? "admin-btn-primary" : "admin-btn-secondary"}`}
        onClick={() => setCustom(!custom)}
      >
        Custom
      </button>
      {custom && (
        <>
          <input
            type="date"
            className="admin-input"
            style={{ width: "auto", padding: "5px 10px", fontSize: 12 }}
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
          />
          <span style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>→</span>
          <input
            type="date"
            className="admin-input"
            style={{ width: "auto", padding: "5px 10px", fontSize: 12 }}
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
          />
        </>
      )}
    </div>
  );
}
