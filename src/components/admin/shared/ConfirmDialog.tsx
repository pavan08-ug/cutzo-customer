import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  open, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel",
  onConfirm, onCancel, danger = false, children,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="admin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <div className="admin-modal-wrap" style={{ zIndex: 300 }}>
            <motion.div
              className="admin-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {danger && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, background: "rgba(244,63,94,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriangle size={24} style={{ color: "var(--admin-danger)" }} />
                  </div>
                </div>
              )}
              <div className="admin-modal-title">{title}</div>
              {description && <div className="admin-modal-desc">{description}</div>}
              {children}
              <div className="admin-modal-actions">
                <button className="admin-btn admin-btn-secondary" onClick={onCancel}>{cancelLabel}</button>
                <button
                  className={`admin-btn ${danger ? "admin-btn-danger" : "admin-btn-primary"}`}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
