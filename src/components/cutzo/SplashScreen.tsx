import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Cutzo Brand Icon (uses the real icon.svg asset) ────────────────
function CutzoLogoIcon({ className }: { className?: string }) {
  return (
    <img
      src="/icon.svg"
      alt="Cutzo"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// ── Orbiting particles ───────────────────────────────────────────────────────
function OrbitParticle({ delay, radius, size, duration }: { delay: number; radius: number; size: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/30"
      style={{ width: size, height: size }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.8, 0.8, 0],
        x: [
          Math.cos(0) * radius,
          Math.cos(Math.PI * 0.5) * radius,
          Math.cos(Math.PI) * radius,
          Math.cos(Math.PI * 1.5) * radius,
          Math.cos(Math.PI * 2) * radius,
        ],
        y: [
          Math.sin(0) * radius,
          Math.sin(Math.PI * 0.5) * radius,
          Math.sin(Math.PI) * radius,
          Math.sin(Math.PI * 1.5) * radius,
          Math.sin(Math.PI * 2) * radius,
        ],
      }}
      transition={{
        duration,
        delay,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
}

export default function SplashScreen() {
  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#8F00FF" }}
    >
      {/* ── Brand icon — full Cutzo logo from splash.svg ─────────────────── */}
      <motion.img
        src="/splash.svg"
        alt="Cutzo"
        className="w-[280px] object-contain"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
