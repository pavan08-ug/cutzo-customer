import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onReady?: () => void;
}

export default function SplashScreen({ onReady }: SplashScreenProps = {}) {
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (onReadyRef.current) {
        onReadyRef.current();
      }
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#5B21B6]">
      {/* ── Central content (Logo) ─────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        <img
          src="/logo.webp"
          className="w-[260px] md:w-[300px] h-auto drop-shadow-lg"
          alt="Cutzo Logo"
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    </div>
  );
}
