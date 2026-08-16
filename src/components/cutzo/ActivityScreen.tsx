import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  Check,
  Clock,
  MapPin,
  RotateCcw,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Booking, Review } from "./types";

interface Props {
  bookings: Booking[];
  bookingsLoading?: boolean;
  canLoadMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onGoHome: () => void;
  reviewedBookingIds: Set<string>;
  onSubmitReview: (review: Omit<Review, "reviewId" | "createdAt">) => void;
  onCancelBooking: (bookingId: string) => Promise<void>; // Convex mutation
  onRescheduleBooking: (bookingId: string, newDate: string, newTime: string) => Promise<void>; // Convex mutation
  onRebook?: (booking: Booking) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const REVIEW_TAGS = ["Clean", "Fast Service", "Good Staff", "Affordable", "On Time"];

function getEstimatedServiceStart(timeStr: string): string {
  try {
    const ampmMatch = /(\d+):(\d+)\s*(AM|PM)/i.exec(timeStr);
    let hours = 0;
    let minutes = 0;
    let hasAmPm = false;
    
    if (ampmMatch) {
      hasAmPm = true;
      hours = parseInt(ampmMatch[1], 10);
      minutes = parseInt(ampmMatch[2], 10);
      const period = ampmMatch[3].toUpperCase();
      if (period === "AM" && hours === 12) hours = 0;
      if (period === "PM" && hours !== 12) hours += 12;
    } else {
      const plain = /(\d+):(\d+)/.exec(timeStr);
      if (plain) {
        hours = parseInt(plain[1], 10);
        minutes = parseInt(plain[2], 10);
      } else {
        return `${timeStr} (approx)`;
      }
    }

    const startMin = minutes + 5;
    const endMin = minutes + 15;

    const formatTime = (totalMins: number) => {
      let h = hours + Math.floor(totalMins / 60);
      const m = totalMins % 60;
      h = h % 24;
      if (hasAmPm || ampmMatch) {
        const period = h >= 12 ? "PM" : "AM";
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        return `${h12}:${String(m).padStart(2, "0")} ${period}`;
      } else {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }
    };

    const t1 = formatTime(startMin);
    const t2 = formatTime(endMin);
    const p1 = t1.slice(-2);
    const p2 = t2.slice(-2);
    if ((p1 === "AM" || p1 === "PM") && p1 === p2) {
      return `${t1.slice(0, -3)}–${t2}`;
    }
    return `${t1}–${t2}`;
  } catch {
    return `${timeStr} (approx)`;
  }
}

function fmtDate(value: string) {
  try {
    return format(parseISO(value), "EEE, d MMM yyyy");
  } catch {
    return value;
  }
}

// Build a grid of time slots between openTime and closeTime (hourly)
function buildSlots(openTime = "09:00", closeTime = "21:00"): string[] {
  const slots: string[] = [];
  const [startH] = openTime.split(":").map(Number);
  const [endH] = closeTime.split(":").map(Number);
  for (let h = startH; h < endH; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h + 0.5 < endH) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

// ─── Status Badge ──────────────────────────────────────────────────────────

const STATUS_META: Record<
  Booking["status"],
  { bg: string; text: string; dot: string; label: string }
> = {
  pending: {
    bg: "#FEF3C7",
    text: "#D97706",
    dot: "#F59E0B",
    label: "Pending",
  },
  confirmed: {
    bg: "#E0F2FE",
    text: "#0284C7",
    dot: "#0EA5E9",
    label: "Confirmed",
  },
  active: {
    bg: "#F3E8FF",
    text: "#7C3AED",
    dot: "#8B5CF6",
    label: "Active",
  },
  completed: {
    bg: "#D1FAE5",
    text: "#059669",
    dot: "#10B981",
    label: "Completed",
  },
  cancelled: {
    bg: "#FEE2E2",
    text: "#DC2626",
    dot: "#EF4444",
    label: "Cancelled",
  },
};

function StatusBadge({ status }: { status: Booking["status"] }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
      style={{ background: m.bg, color: m.text }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: m.dot }}
      />
      {m.label}
    </span>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return createPortal(
    <div className="fixed bottom-28 left-0 right-0 z-[200] flex justify-center pointer-events-none px-4">
      <div
        className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl"
        style={{ background: "hsl(142,72%,36%)", maxWidth: 320 }}
      >
        <Check className="h-4 w-4 shrink-0" />
        {message}
      </div>
    </div>,
    document.body
  );
}

// ─── Cancel Confirmation Bottom Sheet ──────────────────────────────────────

function CancelSheet({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/50"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[28px] bg-background px-5 pb-10 pt-5 slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-border" />

        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "hsl(0,86%,95%)" }}
        >
          <X className="h-7 w-7" style={{ color: "hsl(0,86%,48%)" }} />
        </div>

        <h2 className="text-center text-xl font-bold text-foreground">
          Cancel Booking?
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Are you sure you want to cancel your appointment at{" "}
          <strong>{booking.shopName}</strong>? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="h-[52px] w-full rounded-[14px] text-base font-bold text-white scale-tap"
            style={{ background: "hsl(0,86%,48%)" }}
          >
            Yes, Cancel Booking
          </button>
          <button
            onClick={onClose}
            className="h-[52px] w-full rounded-[14px] border border-border text-base font-semibold text-foreground scale-tap"
          >
            No, Keep It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Review Modal ──────────────────────────────────────────────────────────

function ReviewModal({
  booking,
  onClose,
  onSubmit,
}: {
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string, tags: string[]) => void;
}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleTag = (tag: string) =>
    setSelectedTags((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
    );

  const handleSubmit = () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    onSubmit(rating, reviewText.trim(), selectedTags);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/55" onClick={onClose}>
      <div
        className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[25px] bg-background flex flex-col slide-up"
        style={{ maxHeight: "calc(100dvh - 40px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="shrink-0 pt-4 pb-2 flex justify-center">
          <div className="h-1 w-12 rounded-full bg-border" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rate your experience</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">{booking.shopName}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{booking.service}</p>
            </div>
            <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Star rating */}
          <div className="flex justify-center gap-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => { setRating(i + 1); setError(""); }} className="scale-tap">
                <Star
                  className="h-9 w-9"
                  style={{ fill: i < rating ? "#facc15" : "transparent", color: i < rating ? "#facc15" : "hsl(var(--border))" }}
                />
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="rounded-full px-3.5 py-2 text-xs font-semibold transition-all scale-tap"
                  style={{
                    background: selectedTags.includes(tag) ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    color: selectedTags.includes(tag) ? "#fff" : "hsl(var(--foreground))",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <label className="mt-5 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Review (optional)</span>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px] rounded-[16px] border border-border bg-card px-4 py-3 text-sm font-medium outline-none"
              placeholder="Tell others how the service felt…"
            />
          </label>

          {error && (
            <div className="mt-3 rounded-[12px] bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Sticky submit button — always visible at bottom of sheet */}
        <div className="shrink-0 px-5 pt-3 pb-6 border-t border-border/50 bg-background">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg scale-tap"
            style={{ height: "56px", borderRadius: "16px" }}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Booking Details View ──────────────────────────────────────────────────

function BookingDetailsView({
  booking,
  reviewed,
  onBack,
  onCancel,
  onReschedule,
  onOpenReview,
  onRebook,
}: {
  booking: Booking;
  reviewed: boolean;
  onBack: () => void;
  onCancel: () => void;
  onReschedule: () => void;
  onOpenReview: () => void;
  onRebook?: (booking: Booking) => void;
}) {
  const canAct = booking.status === "pending" || booking.status === "confirmed";
  const m = STATUS_META[booking.status];

  return (
    <div className="flex flex-col bg-background" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="shrink-0 customer-header px-4 pb-6 pt-4 safe-top">
        <button
          onClick={onBack}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 scale-tap"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white animate-fade-slide-up">Booking Details</h1>
        <p className="mt-1 text-sm text-white/70 animate-fade-in-delayed">Full appointment information</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3">

        {/* Status Banner */}
        <div
          className="flex items-center gap-3 rounded-[16px] px-4 py-3"
          style={{ background: m.bg }}
        >
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: m.dot }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: m.text }}>
              Booking Status
            </p>
            <p className="text-sm font-bold" style={{ color: m.text }}>{m.label}</p>
          </div>
        </div>

        {booking.expectedStartTime && (booking.status === "active" || booking.status === "confirmed" || booking.status === "pending") && (
          <div className="flex items-center gap-3 rounded-[16px] px-4 py-3 bg-amber-50 border border-amber-300 dark:bg-amber-950/50 dark:border-amber-700 animate-pulse">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                Running {booking.delayMinutes || "?"} Mins Behind Schedule
              </p>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Expected Start: <span className="underline decoration-amber-500 font-black">{booking.expectedStartTime}</span> <span className="text-xs font-normal opacity-80">(was {booking.time})</span>
              </p>
            </div>
          </div>
        )}

        {/* Shop Card */}
        <div className="rounded-[18px] bg-card overflow-hidden card-shadow">
          {booking.shopImage && (
            <img
              src={booking.shopImage}
              alt={booking.shopName}
              className="h-40 w-full object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
          )}
          <div className="p-4">
            <h2 className="text-lg font-bold text-foreground">{booking.shopName}</h2>
            <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <p className="text-xs font-medium">{booking.address}</p>
            </div>
          </div>
        </div>

        {/* Date / Time / Price */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Calendar, label: "Date", value: fmtDate(booking.date) },
            { icon: Clock, label: "Time", value: booking.expectedStartTime ? `${booking.expectedStartTime} (Late)` : booking.time },
            { icon: CalendarCheck, label: "Total", value: `₹${booking.price}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-[14px] bg-card p-3 text-center card-shadow">
              <Icon className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-xs font-bold text-foreground leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Live Booking Status - Timing Breakdown */}
        {(booking.status === "active" || booking.status === "confirmed" || booking.status === "pending") && (
          <div className="rounded-[18px] bg-gradient-to-r from-primary/10 via-card to-accent/10 p-4 card-shadow border border-primary/20">
            <p className="text-xs font-bold uppercase tracking-wide text-primary mb-2.5 flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Live Booking Schedule
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 dark:bg-card/80 p-3 rounded-[14px] border border-border/60">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Expected Arrival</p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {booking.expectedStartTime ? (
                    <>
                      <span className="line-through text-muted-foreground mr-1 font-normal text-xs">{booking.time}</span>
                      <span className="text-amber-600 dark:text-amber-400">{booking.expectedStartTime}</span>
                    </>
                  ) : (
                    booking.time
                  )}
                </p>
              </div>
              <div className="bg-white/80 dark:bg-card/80 p-3 rounded-[14px] border border-border/60">
                <p className="text-[10px] font-bold uppercase text-primary">Estimated Service Start</p>
                <p className="text-sm font-extrabold text-accent mt-0.5">{getEstimatedServiceStart(booking.expectedStartTime || booking.time)}</p>
              </div>
            </div>
            {booking.preferredBarber && (
              <div className="mt-2.5 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Professional Assigned:</span>
                <span className="font-bold text-foreground">✂️ {booking.preferredBarber}</span>
              </div>
            )}
          </div>
        )}

        {/* Services */}
        <div className="rounded-[18px] bg-card p-4 card-shadow">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Services Booked
          </p>
          {booking.service.split(",").map((svc) => (
            <div
              key={svc}
              className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
            >
              <p className="text-sm font-medium text-foreground">{svc.trim()}</p>
              <Check className="h-4 w-4 text-accent" />
            </div>
          ))}
        </div>

        {/* OTP Collection Box — only show for non-cancelled bookings */}
        {booking.otp && booking.status !== "cancelled" && (
          <div className="rounded-[20px] bg-gradient-to-br from-[#F8F0FF] to-[#F2E5FF] border-2 border-[#8F00FF]/50 p-5 text-center shadow-[0_0_20px_rgba(143,0,255,0.2)]">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8F00FF]/80 mb-2">Service OTP Code</p>
            <div className="py-3 my-2 bg-white/95 rounded-xl border border-[#8F00FF]/30 shadow-inner">
              <p className="text-4xl leading-tight font-black tracking-[0.25em] ml-[0.25em] text-[#8F00FF] font-mono select-all">
                {booking.otp}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(String(booking.otp));
                alert("OTP copied to clipboard!");
              }}
              className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8F00FF]/10 text-xs font-bold text-[#8F00FF] hover:bg-[#8F00FF]/20 transition-all scale-tap"
            >
              Copy OTP Code
            </button>
            <p className="mt-2.5 text-xs font-bold text-[#8F00FF]/80">
              {booking.status === "active" || booking.status === "completed"
                ? "OTP verified ✅" 
                : "⚡ Show this code at the salon to start your service."}
            </p>
          </div>
        )}

        {/* Booking ID */}
        <div className="rounded-[14px] bg-muted px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Booking ID
          </p>
          <p className="mt-0.5 font-mono text-xs text-foreground">{booking.id}</p>
        </div>
      </div>

      {/* Actions */}
      {(canAct || ((booking.status === "completed" || booking.status === "cancelled" || (booking.status as string) === "expired") && (onRebook || (!reviewed && booking.status === "completed")))) && (
        <div
          className="shrink-0 px-4 pt-3 space-y-2.5"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(14px)",
            borderTop: "1px solid hsl(var(--border)/0.5)",
            paddingBottom: "calc(90px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {canAct && (
            <div className="flex gap-2">
              <button
                onClick={onReschedule}
                className="flex-1 h-[52px] rounded-[14px] bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white text-sm font-bold shadow-[0_4px_14px_rgba(0,180,216,0.35)] hover:opacity-95 transition-all scale-tap flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reschedule</span>
              </button>
              <button
                onClick={onCancel}
                className="flex-1 h-[52px] rounded-[14px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100/80 dark:hover:bg-red-900/40 transition-all scale-tap flex items-center justify-center gap-1.5"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {booking.status === "completed" && !reviewed && (
            <button
              onClick={onOpenReview}
              className="customer-gradient h-[52px] w-full rounded-[14px] text-base font-semibold text-white shadow-[0_0_15px_rgba(143,0,255,0.3)] transition-all scale-tap hover:opacity-95 flex items-center justify-center gap-1.5"
            >
              ⭐ Add Review
            </button>
          )}

          {(booking.status === "cancelled" || (booking.status as string) === "expired" || booking.status === "completed") && onRebook && (
            <button
              onClick={() => onRebook(booking)}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#8F00FF] to-[#5F00CC] text-base font-bold text-white shadow-[0_0_15px_rgba(143,0,255,0.3)] transition-all scale-tap hover:opacity-95"
            >
              <span>⚡</span>
              <span>Book Again</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Reschedule View ───────────────────────────────────────────────────────

function RescheduleView({
  booking,
  onBack,
  onConfirm,
}: {
  booking: Booking;
  onBack: () => void;
  onConfirm: (newDate: string, newTime: string) => void;
}) {
  const getLocalDateStr = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const todayStr = getLocalDateStr(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Sync "now" for past-time filtering
  const [clientNow, setClientNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setClientNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Build next 14 days starting from user's local date
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return getLocalDateStr(d);
  });

  // Bug 8: use the actual shop hours from the booking instead of hardcoded values.
  // (The booking enrichment in getBookingsByCustomer returns shopOpenTime/shopCloseTime
  // if present; fall back to sensible defaults.)
  const openTime = (booking as any).shopOpenTime || "09:00";
  const closeTime = (booking as any).shopCloseTime || "21:00";
  const fallbackSlots = buildSlots(openTime, closeTime);

  const availableSlots = useQuery(
    api.shops.getAvailableSlots,
    booking.shopId ? {
      shopId: booking.shopId as Id<"shops">,
      date: selectedDate,
      clientNow,
      timezoneOffset: new Date().getTimezoneOffset(),
    } : "skip"
  );

  const isSlotPastLocally = (timeStr: string, dateStr: string) => {
    if (dateStr === todayStr) {
      const now = new Date();
      const [h, m] = timeStr.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(h, m, 0, 0);
      return slotTime < now;
    }
    return false;
  };

  const slots = (availableSlots ?? fallbackSlots.map((t) => ({ time: t, available: true, status: "available" as const }))).map((slotObj) => {
    const pastLocally = isSlotPastLocally(slotObj.time, selectedDate);
    const isCurrentBookingSlot = slotObj.time === booking.time && selectedDate === booking.date;
    if (pastLocally && !isCurrentBookingSlot) {
      return { ...slotObj, available: false, status: "past" as const };
    }
    return slotObj;
  });

  const selectedSlotObj = slots.find((s) => s.time === selectedTime);
  const canConfirm = selectedTime !== null && selectedSlotObj?.available === true;

  return (
    <div className="flex flex-col bg-background" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="shrink-0 customer-header px-4 pb-6 pt-4 safe-top">
        <button
          onClick={onBack}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 scale-tap"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white animate-fade-slide-up">Reschedule</h1>
        <p className="mt-1 text-sm text-white/70 animate-fade-in-delayed">{booking.shopName}</p>
      </div>
      
      {/* Original Booking Info */}
      <div className="mx-4 mt-4 overflow-hidden rounded-[16px] bg-primary/5 border border-primary/10 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Current Booking</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <p className="text-sm font-bold text-foreground">{fmtDate(booking.date)}</p>
          </div>
          <div className="flex items-center gap-2">
             <Clock className="h-4 w-4 text-primary" />
             <p className="text-sm font-bold text-foreground">{booking.time}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(120px + env(safe-area-inset-bottom, 0px))" }}>

        {/* Date Picker */}
        <div className="px-4 pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Pick a Date
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {dates.map((d) => {
              const isSelected = d === selectedDate;
              const dateObj = new Date(d + "T00:00:00");
              const dayName = format(dateObj, "EEE");
              const dayNum = format(dateObj, "d");
              const mon = format(dateObj, "MMM");
              return (
                <button
                  key={d}
                  onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                  className="shrink-0 flex flex-col items-center rounded-[14px] px-3 py-2.5 w-14 scale-tap transition-all relative"
                  style={{
                    background: isSelected ? "hsl(var(--primary))" : "hsl(var(--card))",
                    color: isSelected ? "#fff" : "hsl(var(--foreground))",
                    boxShadow: isSelected ? "0 4px 12px hsl(var(--primary)/0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
                    border: d === booking.date ? "1.5px solid hsl(var(--primary)/0.3)" : "1.5px solid transparent",
                  }}
                >
                  {d === booking.date && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white ring-2 ring-background">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                  <span className="text-[10px] font-bold opacity-80">{dayName}</span>
                  <span className="text-lg font-extrabold leading-tight">{dayNum}</span>
                  <span className="text-[10px] font-semibold opacity-80">{mon}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="px-4 pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Pick a Time
          </p>
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slotObj) => {
              const isSelected = slotObj.time === selectedTime;
              const isCurrent = slotObj.time === booking.time && selectedDate === booking.date;
              const isAvailable = slotObj.available;
              return (
                <button
                  key={slotObj.time}
                  onClick={() => isAvailable && setSelectedTime(slotObj.time)}
                  disabled={!isAvailable}
                  className={`rounded-[12px] py-2.5 text-xs font-bold scale-tap transition-all relative ${
                    !isAvailable
                      ? "opacity-40 cursor-not-allowed bg-muted/60 text-muted-foreground line-through"
                      : ""
                  }`}
                  style={{
                    background: isSelected ? "hsl(var(--accent))" : isAvailable ? "hsl(var(--card))" : undefined,
                    color: isSelected ? "#fff" : isAvailable ? "hsl(var(--foreground))" : undefined,
                    boxShadow: isSelected ? "0 4px 10px hsl(var(--accent)/0.30)" : isAvailable ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                    border: isCurrent ? "1.5px solid hsl(var(--accent)/0.3)" : "1.5px solid transparent",
                  }}
                >
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-accent text-[8px] font-black text-white ring-2 ring-background shadow-sm not-italic no-underline">
                      CURRENT
                    </span>
                  )}
                  {slotObj.time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div
        className="shrink-0 fixed bottom-0 left-0 right-0 z-30 px-4 pt-3"
        style={{
          maxWidth: 430,
          margin: "0 auto",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid hsl(var(--border)/0.6)",
          borderRadius: "20px 20px 0 0",
          paddingBottom: "calc(90px + env(safe-area-inset-bottom, 0px))"
        }}
      >
        {selectedTime && (
          <p className="mb-2 text-center text-sm font-semibold text-muted-foreground">
            {fmtDate(selectedDate)} at {selectedTime}
          </p>
        )}
        <button
          onClick={() => canConfirm && onConfirm(selectedDate, selectedTime!)}
          disabled={!canConfirm}
          className="w-full h-[52px] rounded-[14px] text-base font-bold text-white scale-tap disabled:opacity-50"
          style={{
            background: canConfirm
              ? "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)"
              : "hsl(var(--muted))",
            color: canConfirm ? "#fff" : "hsl(var(--muted-foreground))",
          }}
        >
          {canConfirm ? "Confirm New Time" : "Select a time slot"}
        </button>
      </div>
    </div>
  );
}

// ─── Booking Card ──────────────────────────────────────────────────────────

function BookingCard({
  booking,
  reviewed,
  onViewDetails,
  onReschedule,
  onCancel,
  onOpenReview,
  onRebook,
}: {
  booking: Booking;
  reviewed: boolean;
  onViewDetails: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onOpenReview: () => void;
  onRebook?: () => void;
}) {
  const canAct = booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="mb-4 mx-4 overflow-hidden rounded-[24px] bg-white dark:bg-card shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800 transition-all">
      {/* Top section */}
      <div className="p-4">
        <div className="flex gap-3.5">
          <img
            src={booking.shopImage}
            alt={booking.shopName}
            className="h-16 w-16 shrink-0 rounded-[16px] object-cover border border-gray-100 dark:border-gray-800 shadow-sm"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between gap-2">
              <p className="text-base font-bold leading-tight text-gray-900 dark:text-white truncate">{booking.shopName}</p>
              <StatusBadge status={booking.status} />
            </div>
            <p className="mb-1.5 truncate text-sm font-semibold text-[#00B4D8]">{booking.service}</p>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{fmtDate(booking.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{booking.expectedStartTime ? `${booking.expectedStartTime} (Late)` : booking.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3.5 border-t border-gray-100 dark:border-gray-800" />

        {/* Price + Actions */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-extrabold text-gray-900 dark:text-white">₹{booking.price}</p>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Details button — always visible */}
            <button
              onClick={onViewDetails}
              className="rounded-full border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors scale-tap shadow-sm"
            >
              Details
            </button>

            {/* Reschedule — pending/confirmed */}
            {canAct && (
              <button
                onClick={onReschedule}
                className="flex items-center gap-1.5 rounded-full border border-[#00B4D8] bg-white dark:bg-card px-3.5 py-1.5 text-xs font-semibold text-[#00B4D8] hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors scale-tap shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reschedule
              </button>
            )}

            {/* Cancel — pending/confirmed */}
            {canAct && (
              <button
                onClick={onCancel}
                className="rounded-full border border-red-500 bg-white dark:bg-card px-4 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors scale-tap shadow-sm"
              >
                Cancel
              </button>
            )}

            {/* Rate Experience — completed + not reviewed */}
            {booking.status === "completed" && !reviewed && (
              <button
                onClick={onOpenReview}
                className="flex items-center gap-1.5 rounded-full bg-[#8F00FF] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#7C00FF] transition-colors scale-tap"
              >
                <Star className="h-3.5 w-3.5 fill-current text-white" />
                Rate
              </button>
            )}

            {/* Already reviewed */}
            {booking.status === "completed" && reviewed && (
              <div className="rounded-full bg-green-100 dark:bg-green-950/50 px-3.5 py-1.5 text-xs font-semibold text-green-700 dark:text-green-300">
                ✓ Reviewed
              </div>
            )}

            {/* Book Again Button for Cancelled / Expired / Completed */}
            {(booking.status === "cancelled" || (booking.status as string) === "expired" || booking.status === "completed") && onRebook && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRebook();
                }}
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#8F00FF] to-[#5F00CC] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm scale-tap transition-transform active:scale-95"
              >
                <span>⚡</span>
                <span>Book Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ActivityScreen ───────────────────────────────────────────────────

type ActiveView = "list" | "details" | "reschedule";

export default function ActivityScreen({
  bookings,
  bookingsLoading = false,
  canLoadMore = false,
  isLoadingMore = false,
  onLoadMore,
  reviewedBookingIds = new Set(),
  onSubmitReview,
  onGoHome,
  onCancelBooking,
  onRescheduleBooking,
  onRebook,
}: Props) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [view, setView] = useState<ActiveView>("list");
  const [focusedBooking, setFocusedBooking] = useState<Booking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const upcoming = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed" || b.status === "active"
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled" || (b.status as string) === "expired"
  );
  const list = activeTab === "upcoming" ? upcoming : past;

  const reviewedIds = reviewedBookingIds;

  // ── Actions ──────────────────────────────────────────────────────────────

  const openDetails = (booking: Booking) => {
    setFocusedBooking(booking);
    setView("details");
  };

  const openReschedule = (booking: Booking) => {
    setFocusedBooking(booking);
    setView("reschedule");
  };

  const openCancelSheet = (booking: Booking) => {
    setFocusedBooking(booking);
    setShowCancelSheet(true);
  };

  const handleConfirmCancel = async () => {
    if (!focusedBooking) return;
    try {
      await onCancelBooking(focusedBooking.id);
    } catch (err) {
      // error already shown by parent
    }
    setShowCancelSheet(false);
    setView("list");
    setFocusedBooking(null);
    setActiveTab("past");
    setToast("Booking cancelled successfully");
  };

  const handleConfirmReschedule = async (newDate: string, newTime: string) => {
    if (!focusedBooking) return;
    try {
      await onRescheduleBooking(focusedBooking.id, newDate, newTime);
    } catch (err) {
      // error already shown by parent
    }
    setView("list");
    setFocusedBooking(null);
    setToast("Booking rescheduled successfully");
  };

  const handleOpenReview = (booking: Booking) => {
    setReviewTarget(booking);
  };

  const handleSubmitReview = (rating: number, reviewText: string, tags: string[]) => {
    if (!reviewTarget) return;
    onSubmitReview({
      userId: reviewTarget.userId,
      shopId: reviewTarget.shopId,
      bookingId: reviewTarget.id,
      rating,
      reviewText,
      tags,
    });
    setReviewTarget(null);
    setToast("Review submitted, thank you!");
  };

  const backToList = () => {
    setView("list");
    setFocusedBooking(null);
  };

  // ── Sub-view routing ──────────────────────────────────────────────────────

  if (view === "details" && focusedBooking) {
    return (
      <>
        <BookingDetailsView
          booking={focusedBooking}
          reviewed={reviewedIds.has(focusedBooking.id)}
          onBack={backToList}
          onCancel={() => openCancelSheet(focusedBooking)}
          onReschedule={() => openReschedule(focusedBooking)}
          onOpenReview={() => handleOpenReview(focusedBooking)}
          onRebook={onRebook}
        />
        {showCancelSheet && focusedBooking && (
          <CancelSheet
            booking={focusedBooking}
            onClose={() => setShowCancelSheet(false)}
            onConfirm={handleConfirmCancel}
          />
        )}
        {reviewTarget && (
          <ReviewModal
            booking={reviewTarget}
            onClose={() => setReviewTarget(null)}
            onSubmit={handleSubmitReview}
          />
        )}
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </>
    );
  }

  if (view === "reschedule" && focusedBooking) {
    return (
      <>
        <RescheduleView
          booking={focusedBooking}
          onBack={backToList}
          onConfirm={handleConfirmReschedule}
        />
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </>
    );
  }

  // ── Booking List ──────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#f0f4f8] dark:bg-background pb-28">
        {/* Header */}
        <div className="customer-header px-6 pb-8 pt-8 safe-top rounded-b-[36px] shadow-[0_10px_25px_rgba(143,0,255,0.25)]">
          <h1 className="text-3xl font-extrabold text-white tracking-tight animate-fade-slide-up">My Bookings</h1>
          <p className="mt-1 text-sm font-medium text-white/80 animate-fade-in-delayed">Manage your appointments</p>
        </div>

        <div className="pt-2">
          {/* Tab Toggle */}
          <div className="mx-4 mt-3 mb-4 flex rounded-[24px] bg-white dark:bg-card p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800">
            {(["upcoming", "past"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="h-12 flex-1 rounded-[18px] text-sm font-bold capitalize transition-all scale-tap flex items-center justify-center gap-1.5"
                  style={{
                    background: isActive ? "#8F00FF" : "transparent",
                    color: isActive ? "#fff" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <span>{tab === "upcoming" ? "Upcoming" : "Past"}</span>
                  <span
                    className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs font-bold"
                    style={{
                      background: isActive ? "rgba(255, 255, 255, 0.25)" : "#f0f4f8",
                      color: isActive ? "#fff" : "#475569",
                    }}
                  >
                    {tab === "upcoming" ? upcoming.length : past.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Booking List */}
          {bookingsLoading ? (
            <div className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
              <div className="flex gap-2">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} className="h-2.5 w-2.5 rounded-full bg-primary/60 dot-wave" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
              <p className="text-sm font-medium">Loading your bookings...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="mx-4 py-20 text-center text-muted-foreground bg-white dark:bg-card rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <Search className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p className="font-semibold">No {activeTab} bookings</p>
              <p className="mt-1 mb-5 text-xs">Your appointments will appear here</p>
              <button
                onClick={onGoHome}
                className="gradient-btn h-10 rounded-[10px] px-6 text-sm font-semibold text-white"
              >
                Browse Shops
              </button>
            </div>
          ) : (
            list.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                reviewed={reviewedIds.has(booking.id)}
                onViewDetails={() => openDetails(booking)}
                onReschedule={() => openReschedule(booking)}
                onCancel={() => openCancelSheet(booking)}
                onOpenReview={() => handleOpenReview(booking)}
                onRebook={onRebook ? () => onRebook(booking) : undefined}
              />
            ))
          )}

          {canLoadMore && (
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="mx-4 mt-2 mb-6 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white dark:bg-card py-4 text-sm font-bold text-primary shadow-sm hover:bg-primary/5 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "Load More Bookings"
              )}
            </button>
          )}

        </div>
      </div>

      {/* Cancel Confirmation Sheet */}
      {showCancelSheet && focusedBooking && (
        <CancelSheet
          booking={focusedBooking}
          onClose={() => setShowCancelSheet(false)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
