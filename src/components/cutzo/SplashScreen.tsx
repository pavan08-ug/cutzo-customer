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
  const [phase, setPhase] = useState<"logo" | "brand" | "tagline" | "complete">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("brand"), 700);
    const t2 = setTimeout(() => setPhase("tagline"), 1150);
    const t3 = setTimeout(() => setPhase("complete"), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="splash-screen-bg relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">

      {/* ── Animated background orbs ─────────────────────────────────────── */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(180,50,255,0.35) 0%, transparent 70%)",
          top: "-15%",
          left: "-20%",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(80, 0, 200, 0.5) 0%, transparent 70%)",
          bottom: "-10%",
          right: "-15%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      {/* ── Grid / mesh overlay for texture ─────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Central content ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-0">

        {/* Logo mark with glow ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-7"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-6 rounded-[44px]"
            style={{
              background: "radial-gradient(circle, rgba(180,80,255,0.3) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />

          {/* Orbit particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <OrbitParticle delay={0.9} radius={70} size={5} duration={3.5} />
            <OrbitParticle delay={1.2} radius={85} size={4} duration={4.5} />
            <OrbitParticle delay={1.5} radius={58} size={3} duration={2.8} />
          </div>

          {/* Brand icon — full Cutzo logo */}
          <CutzoLogoIcon
            className="h-[120px] w-[120px] rounded-[30px]"
          />
        </motion.div>

        {/* Brand name — letter reveal */}
        <AnimatePresence>
          {(phase === "brand" || phase === "tagline" || phase === "complete") && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-0 overflow-hidden"
            >
              {"CUTZO".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[52px] font-black tracking-tight text-white"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    textShadow: "0 4px 24px rgba(180,80,255,0.6), 0 0 60px rgba(143,0,255,0.35)",
                    display: "inline-block",
                    transformOrigin: "bottom center",
                    perspective: "400px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline */}
        <AnimatePresence>
          {(phase === "tagline" || phase === "complete") && (
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em]"
              style={{
                color: "rgba(220,190,255,0.85)",
                letterSpacing: "0.32em",
              }}
            >
              Book · Sit · Look Sharp
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom progress bar ───────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-14 left-0 right-0 flex flex-col items-center gap-3"
          >
            {/* Progress track */}
            <div className="h-[2px] w-[100px] rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #C060FF, #80DFFF)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edge vignette for depth ───────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(30,0,80,0.45) 100%)",
        }}
      />
    </div>
  );
}
