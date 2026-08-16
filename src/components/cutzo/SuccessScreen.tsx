import { format, parseISO } from "date-fns";
import { ArrowRight, Calendar, Clock, Copy, MapPin, Scissors, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Service, Shop } from "./types";

interface Props {
  shop: Shop;
  services: Service[];
  date: string;
  time: string;
  onGoHome: () => void;
  onViewBookings: () => void;
  id?: string;
  otp?: number;
}

const formatBookingDate = (value: string) => {
  try {
    return format(parseISO(value), "EEE, MMM d");
  } catch {
    return value;
  }
};

function PhonePeTickMark() {
  const [key, setKey] = useState(0);

  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([80, 50, 120]);
      } catch (e) {
        // ignore if not supported
      }
    }
  };

  useEffect(() => {
    triggerVibration();
  }, [key]);

  return (
    <div
      onClick={() => {
        setKey((prev) => prev + 1);
        triggerVibration();
      }}
      className="relative flex items-center justify-center py-6 cursor-pointer select-none group"
      title="Tap to replay animation"
    >
      {/* Outer Ripple Ring 1 (PhonePe Shockwave) */}
      <motion.div
        key={`ring1-${key}`}
        initial={{ scale: 0.8, opacity: 0.9 }}
        animate={{ scale: [0.8, 2.2, 2.8], opacity: [0.9, 0.35, 0] }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute h-24 w-24 rounded-full border-2 border-[#00C853] bg-[#00C853]/15"
      />
      {/* Outer Ripple Ring 2 */}
      <motion.div
        key={`ring2-${key}`}
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: [0.8, 1.6, 2.1], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
        className="absolute h-24 w-24 rounded-full border border-[#00C853]/70"
      />

      {/* Continuous Subtle Pulse */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute h-24 w-24 rounded-full bg-[#00C853]"
      />

      {/* Confetti / Burst Particles around the circle */}
      {[...Array(10)].map((_, i) => {
        const angle = (i * 360) / 10;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 68;
        const y = Math.sin(rad) * 68;
        return (
          <motion.div
            key={`particle-${key}-${i}`}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: [0, 1.3, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.75, delay: 0.2 + i * 0.03, ease: "easeOut" }}
            className="absolute h-2.5 w-2.5 rounded-full shadow-sm"
            style={{
              backgroundColor: i % 3 === 0 ? "#00C853" : i % 3 === 1 ? "#00D084" : "#8F00FF",
            }}
          />
        );
      })}

      {/* Main Solid Green Circle */}
      <motion.div
        key={`circle-${key}`}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.18, 1] }}
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1], // Springy overshoot
        }}
        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#00C853] via-[#00D084] to-[#10B981] shadow-[0_8px_28px_rgba(0,200,83,0.5)] group-active:scale-95 transition-transform"
      >
        {/* Animated Checkmark Path (PhonePe Tick Draw) */}
        <svg
          className="h-12 w-12 text-white drop-shadow-sm"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            key={`path-${key}`}
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.25,
              ease: "easeOut",
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default function SuccessScreen({ shop, services, date, time, onGoHome, onViewBookings, id, otp }: Props) {
  const [copied, setCopied] = useState(false);
  const total = services.reduce((acc, service) => acc + service.price, 0);
  const displayId = id || `TR${Math.floor(Math.random() * 900000 + 100000)}`;
  const displayOtp = otp || Math.floor(1000 + Math.random() * 9000);

  const handleCopy = () => {
    navigator.clipboard?.writeText(String(displayOtp));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `Booking Confirmed at ${shop.name}!\nDate: ${formatBookingDate(date)} at ${time}\nServices: ${services.map(s => s.name).join(", ")}\nService OTP: ${displayOtp}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cutzo Booking - ${shop.name}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or failed
      }
    } else {
      navigator.clipboard?.writeText(shareText);
      alert("Booking details copied to clipboard!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-muted px-4 pb-10 pt-8 overflow-x-hidden">
      {/* PhonePe Celebratory Checkmark Header */}
      <div className="mb-5 flex flex-col items-center">
        <PhonePeTickMark />
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-center text-3xl font-extrabold text-[#00C853] tracking-tight mt-1"
        >
          Booking Confirmed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-1.5 text-center text-sm text-muted-foreground max-w-xs leading-relaxed"
        >
          Your appointment is locked in! Share your massive OTP code with the shop when you arrive.
        </motion.p>
      </div>

      {/* Booking Details Card (Slide up right after checkmark completes) */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.48, ease: "easeOut" }}
        className="w-full max-w-sm overflow-hidden rounded-[20px] bg-card card-shadow"
      >
        <div className="customer-header p-5 rounded-b-none">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-lg font-bold text-white">{shop.name}</p>
            <div className="rounded-full bg-white/20 px-2.5 py-1">
              <p className="text-xs font-semibold text-white">#{displayId.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <p className="text-xs text-light-text">{shop.address}</p>
        </div>

        <div className="relative mx-0 h-0 border-t-2 border-dashed border-muted">
          <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-muted" />
          <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-muted" />
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="text-sm font-semibold text-foreground">{formatBookingDate(date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Time
                </p>
                <p className="text-sm font-semibold text-foreground">{time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Scissors className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Services
              </p>
              <p className="text-sm font-semibold text-foreground">
                {services.map((service) => service.name).join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Location
              </p>
              <p className="text-sm font-semibold text-foreground">{shop.address.split(",")[0]}</p>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-dashed border-border pt-3">
            <p className="text-sm font-medium text-muted-foreground">Amount Payable</p>
            <p className="text-base font-bold text-accent">Rs {total}</p>
          </div>
        </div>

        {/* Massive OTP Display */}
        <div className="mx-5 mb-5 rounded-2xl bg-gradient-to-br from-[#F8F0FF] to-[#F2E5FF] border-2 border-[#8F00FF]/50 p-5 text-center shadow-[0_0_20px_rgba(143,0,255,0.25)]">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8F00FF]/80 mb-1.5">Service OTP Code</p>
          <div className="py-2.5 my-1.5 bg-white/95 rounded-xl border border-[#8F00FF]/30 shadow-inner">
            <p className="text-5xl font-black tracking-[0.25em] ml-[0.25em] text-[#8F00FF] font-mono select-all">
              {displayOtp}
            </p>
          </div>
          <p className="mt-2 text-xs font-bold text-[#8F00FF]/80">
            ⚡ Keep this code handy — show it at the salon to start!
          </p>
        </div>

        {/* Native Copy Code & Share buttons */}
        <div className="grid grid-cols-2 gap-2.5 px-5 pb-5">
          <button
            onClick={handleCopy}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-[#8F00FF] bg-white text-sm font-bold text-[#8F00FF] scale-tap transition-all hover:bg-[#8F00FF]/5 active:scale-95 shadow-sm"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied! ✅" : "Copy Code"}
          </button>
          <button
            onClick={handleShare}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8F00FF] to-[#5F00CC] text-sm font-bold text-white shadow-md scale-tap transition-all hover:opacity-95 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-5 flex w-full max-w-sm flex-col gap-3"
      >
        <button
          onClick={onViewBookings}
          className="customer-gradient flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold text-white scale-tap transition-transform shadow-[0_0_15px_rgba(143,0,255,0.3)]"
        >
          View My Bookings
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onGoHome}
          className="h-[56px] w-full rounded-2xl bg-white border border-[#8F00FF] text-sm font-semibold text-[#8F00FF] scale-tap transition-transform"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}

