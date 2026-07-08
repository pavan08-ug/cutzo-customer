import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ConfirmDialog from "../shared/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

function OfferFormDrawer({
 offer,
 onClose,
}: {
 offer?: any;
 onClose: () => void;
}) {
 const createOffer = useMutation(api.admin.adminCreateOffer);
 const updateOffer = useMutation(api.admin.adminUpdateOffer);

 const [form, setForm] = useState({
 title: offer?.title || "",
 discount: offer?.discount || "",
 city: offer?.city || "",
 expiryDate: offer?.expiryDate || "",
 });

 const handleSubmit = async () => {
 if (!form.title || !form.discount || !form.city || !form.expiryDate) {
 toast.error("Please fill all fields");
 return;
 }
 try {
 if (offer) {
 await updateOffer({ offerId: offer._id, ...form });
 toast.success("Offer updated!");
 } else {
 await createOffer(form);
 toast.success("Offer created!");
 }
 onClose();
 } catch (e: any) { toast.error(e.message); }
 };

 return (
 <>
 <motion.div className="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
 <motion.div className="admin-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}>
 <div className="admin-drawer-header">
 <div className="admin-drawer-title">{offer ? "Edit Offer" : "Create Offer"}</div>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={onClose}>×</button>
 </div>
 <div className="admin-drawer-body">
 <div className="admin-form-group">
 <label className="admin-label">Offer Title</label>
 <input className="admin-input" placeholder="e.g. Summer Discount 20%" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Discount</label>
 <input className="admin-input" placeholder="e.g. 20% or ₹50 off" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">City</label>
 <input className="admin-input" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
 </div>
 <div className="admin-form-group">
 <label className="admin-label">Expiry Date</label>
 <input type="date" className="admin-input" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} />
 </div>

 {/* Preview */}
 {form.title && (
 <div style={{ border: "1px solid var(--admin-border)", borderRadius: 12, padding: 16, background: "rgba(124,58,237,0.05)" }}>
 <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 6 }}>PREVIEW</div>
 <div style={{ fontWeight: 700, fontSize: 16 }}>{form.title}</div>
 <div style={{ color: "var(--admin-success)", fontWeight: 700, fontSize: 20 }}>{form.discount}</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 4 }}>{form.city} • Expires {form.expiryDate}</div>
 </div>
 )}

 <button className="admin-btn admin-btn-primary" style={{ width: "100%" }} onClick={handleSubmit}>
 {offer ? "Save Changes" : "Create Offer"}
 </button>
 </div>
 </motion.div>
 </>
 );
}

export default function OffersPage() {
 const offers = useQuery(api.admin.adminGetAllOffers);
 const deleteOffer = useMutation(api.admin.adminDeleteOffer);
 const [showForm, setShowForm] = useState(false);
 const [editOffer, setEditOffer] = useState<any>(null);
 const [confirmDelete, setConfirmDelete] = useState<any>(null);

 const now = new Date().toISOString().split("T")[0];
 const active = (offers || []).filter((o: any) => o.expiryDate >= now);
 const expired = (offers || []).filter((o: any) => o.expiryDate < now);
 const expiringSoon = active.filter((o: any) => {
 const diff = (new Date(o.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
 return diff <= 7;
 });

 const handleDelete = async () => {
 if (!confirmDelete) return;
 try { await deleteOffer({ offerId: confirmDelete._id }); toast.success("Offer deleted"); }
 catch (e: any) { toast.error(e.message); }
 finally { setConfirmDelete(null); }
 };

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Offers Management</h1>
 <p className="admin-page-subtitle">{active.length} active offers</p>
 </div>
 <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>
 + Create Offer
 </button>
 </div>

 {/* Quick Stats */}
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-success)" }}>{active.length}</div>
 <div className="admin-kpi-label">Active Offers</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: expiringSoon.length > 0 ? "var(--admin-warning)" : "var(--admin-text-muted)" }}>{expiringSoon.length}</div>
 <div className="admin-kpi-label">Expiring in 7 Days</div>
 </div>
 <div className="admin-kpi-card">
 <div className="admin-kpi-value" style={{ color: "var(--admin-text-muted)" }}>{expired.length}</div>
 <div className="admin-kpi-label">Expired Offers</div>
 </div>
 </div>

 {expiringSoon.length > 0 && (
 <div className="admin-alert admin-alert-warning" style={{ marginBottom: 20 }}>
 <div>
 <div style={{ fontWeight: 600, color: "#fbbf24" }}>Offers Expiring Soon</div>
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
 {expiringSoon.map((o: any) => o.title).join(", ")} — expiring within 7 days
 </div>
 </div>
 </div>
 )}

 {/* Active Offers Grid */}
 {active.length > 0 && (
 <div className="admin-card" style={{ marginBottom: 24 }}>
 <div className="admin-card-title" style={{ marginBottom: 16 }}> Active Offers</div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
 {active.map((offer: any) => (
 <div key={offer._id} style={{
 background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)",
 borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8,
 }}>
 <div style={{ fontWeight: 700, fontSize: 15 }}>{offer.title}</div>
 <div style={{ color: "var(--admin-success)", fontWeight: 800, fontSize: 22 }}>{offer.discount}</div>
 <div style={{ display: "flex", gap: 6 }}>
 <span className="admin-badge admin-badge-info">{offer.city}</span>
 <span className="admin-badge admin-badge-muted">Exp: {offer.expiryDate}</span>
 </div>
 <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
 <button className="admin-btn admin-btn-secondary admin-btn-sm" style={{ flex: 1 }} onClick={() => setEditOffer(offer)}>
 Edit
 </button>
 <button className="admin-btn admin-btn-danger admin-btn-sm" style={{ flex: 1 }} onClick={() => setConfirmDelete(offer)}>
 Delete
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Expired Offers */}
 {expired.length > 0 && (
 <div className="admin-card" style={{ padding: 0 }}>
 <div style={{ padding: "16px 20px" }} className="admin-card-title"> Expired Offers ({expired.length})</div>
 <div className="admin-table-wrap" style={{ border: "none", borderRadius: 0 }}>
 <table className="admin-table">
 <thead><tr><th>Title</th><th>Discount</th><th>City</th><th>Expired</th><th>Actions</th></tr></thead>
 <tbody>
 {expired.map((offer: any) => (
 <tr key={offer._id}>
 <td style={{ color: "var(--admin-text-muted)" }}>{offer.title}</td>
 <td>{offer.discount}</td>
 <td>{offer.city}</td>
 <td style={{ fontSize: 12, color: "var(--admin-danger)" }}>{offer.expiryDate}</td>
 <td>
 <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setConfirmDelete(offer)}>
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 <AnimatePresence>
 {(showForm || editOffer) && (
 <OfferFormDrawer offer={editOffer} onClose={() => { setShowForm(false); setEditOffer(null); }} />
 )}
 </AnimatePresence>

 <ConfirmDialog
 open={!!confirmDelete}
 title={`Delete "${confirmDelete?.title}"?`}
 description="This offer will be permanently deleted."
 confirmLabel="Delete Offer"
 onConfirm={handleDelete}
 onCancel={() => setConfirmDelete(null)}
 danger
 />
 </div>
 );
}
