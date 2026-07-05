import React from "react";
import { X } from "lucide-react";
import { TermsAndConditions, PrivacyPolicy } from "./LegalContent";

interface LegalModalProps {
  type: "terms" | "privacy";
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  const isTerms = type === "terms";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 px-4 pb-4 pt-10 backdrop-blur-sm sm:items-center sm:p-6 animate-fade-in">
      <div className="slide-up relative flex h-[85vh] w-full max-w-[500px] flex-col rounded-[28px] bg-card text-card-foreground shadow-[0_24px_70px_rgba(15,23,42,0.45)] border border-border/50 overflow-hidden">
        {/* Sticky Header */}
        <div className="customer-header shrink-0 flex items-center justify-between px-6 py-5 border-b border-border/40">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Cutzo Legal</span>
            <h2 className="text-lg font-extrabold text-white">
              {isTerms ? "Terms of Service" : "Privacy Policy"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white scale-tap"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-muted">
          {isTerms ? <TermsAndConditions /> : <PrivacyPolicy />}
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 bg-muted/30 px-6 py-4 border-t border-border/40 flex justify-end">
          <button
            onClick={onClose}
            className="customer-gradient px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-[0_4px_12px_rgba(143,0,255,0.25)] scale-tap hover:opacity-90 active:scale-95 transition-all"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
}
