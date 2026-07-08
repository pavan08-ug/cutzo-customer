import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface KPICardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string; // CSS color for accent
  bg: string;    // CSS color for icon bg
  prefix?: string;
  suffix?: string;
  index?: number;
  animate?: boolean;
}

function useCountUp(target: number, duration = 900, enabled = true) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!enabled || typeof target !== "number") return;
    const start = Date.now();
    const from = 0;
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * ease));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, enabled]);
  return enabled && typeof target === "number" ? value : target;
}

export default function KPICard({ icon, label, value, color, bg, prefix = "", suffix = "", index = 0, animate = true }: KPICardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value)) || 0;
  const displayNum = useCountUp(numericValue, 800 + index * 80, animate && typeof value === "number");

  const display = typeof value === "number"
    ? numericValue >= 100000
      ? `${prefix}${(numericValue / 100000).toFixed(1)}L${suffix}`
      : numericValue >= 1000
      ? `${prefix}${(numericValue / 1000).toFixed(1)}K${suffix}`
      : `${prefix}${animate ? displayNum : numericValue}${suffix}`
    : `${prefix}${value}${suffix}`;

  return (
    <motion.div
      className="admin-kpi-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
    >
      {icon && icon.trim() !== "" && (
        <div className="admin-kpi-icon" style={{ background: bg }}>
          <span>{icon}</span>
        </div>
      )}
      <div className="admin-kpi-value" style={{ color }}>{display}</div>
      <div className="admin-kpi-label">{label}</div>
    </motion.div>
  );
}
