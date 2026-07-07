type StatusType =
  | "pending" | "confirmed" | "active" | "completed" | "cancelled"
  | "approved" | "rejected"
  | "banned" | "active_user"
  | "customer" | "shop_owner" | "admin"
  | "idle" | "busy" | "closed";

const CONFIG: Record<StatusType, { label: string; cls: string }> = {
  pending:     { label: "Pending",   cls: "admin-badge-warning" },
  confirmed:   { label: "Confirmed", cls: "admin-badge-info" },
  active:      { label: "Active",    cls: "admin-badge-success" },
  completed:   { label: "Completed", cls: "admin-badge-success" },
  cancelled:   { label: "Cancelled", cls: "admin-badge-danger" },
  approved:    { label: "Approved",  cls: "admin-badge-success" },
  rejected:    { label: "Rejected",  cls: "admin-badge-danger" },
  banned:      { label: "Banned",    cls: "admin-badge-danger" },
  active_user: { label: "Active",    cls: "admin-badge-success" },
  customer:    { label: "Customer",  cls: "admin-badge-muted" },
  shop_owner:  { label: "Shop Owner", cls: "admin-badge-violet" },
  admin:       { label: "Admin",     cls: "admin-badge-info" },
  idle:        { label: "Idle",      cls: "admin-badge-success" },
  busy:        { label: "Busy",      cls: "admin-badge-danger" },
  closed:      { label: "Closed",    cls: "admin-badge-muted" },
};

interface Props {
  status: string;
  dot?: boolean;
}

export default function StatusBadge({ status, dot = false }: Props) {
  const cfg = CONFIG[status as StatusType] || { label: status, cls: "admin-badge-muted" };
  return (
    <span className={`admin-badge ${cfg.cls}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />}
      {cfg.label}
    </span>
  );
}
