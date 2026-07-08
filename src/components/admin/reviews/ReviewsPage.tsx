import { useState } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable, { Column } from "../shared/DataTable";
import ConfirmDialog from "../shared/ConfirmDialog";
import ExportCSVButton from "../shared/ExportCSVButton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import {
 BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
 LineChart, Line,
} from "recharts";

const TOOLTIP_STYLE = {
 contentStyle: { background: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#f1f5f9" },
};

function StarRating({ rating }: { rating: number }) {
 return (
 <div style={{ display: "flex", gap: 2 }}>
 {Array.from({ length: 5 }).map((_, i) => (
 <span key={i} style={{ fontSize: 13, color: i < rating ? "#fbbf24" : "#334155" }}>★</span>
 ))}
 </div>
 );
}

function ReviewModal({ review, onClose, onDelete }: { review: any; onClose: () => void; onDelete: () => void }) {
 return (
 <>
 <motion.div className="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ zIndex: 200 }} />
 <div className="admin-modal-wrap" style={{ zIndex: 201 }}>
 <motion.div
 className="admin-modal"
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 >
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
 <h3 style={{ fontWeight: 700, fontSize: 17 }}>Review Detail</h3>
 <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={onClose}>×</button>
 </div>
 <StarRating rating={review.rating} />
 <div style={{ margin: "12px 0", padding: 14, background: "var(--admin-surface-2)", borderRadius: 10, fontSize: 14, lineHeight: 1.6 }}>
 {review.reviewText}
 </div>
 {review.tags && review.tags.length > 0 && (
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
 {review.tags.map((tag: string) => (
 <span key={tag} className="admin-badge admin-badge-violet">{tag}</span>
 ))}
 </div>
 )}
 <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginBottom: 16 }}>
 By {review.customerName || "Anonymous"} — {review.createdAt ? format(new Date(review.createdAt), "dd MMM yyyy") : "—"}
 </div>
 <div className="admin-modal-actions">
 <button className="admin-btn admin-btn-secondary" onClick={onClose}>Close</button>
 <button className="admin-btn admin-btn-danger" onClick={onDelete}>
 Delete Review
 </button>
 </div>
 </motion.div>
 </div>
 </>
 );
}

export default function ReviewsPage() {
 const { results: reviews, loadMore, status } = usePaginatedQuery(
 api.admin.adminGetAllReviews,
 { ratingFilter: undefined, shopId: undefined },
 { initialNumItems: 50 }
 );
 const tagFrequency = useQuery(api.admin.adminGetReviewTagFrequency);
 const deleteReview = useMutation(api.admin.adminDeleteReview);

 const [selectedReview, setSelectedReview] = useState<any>(null);
 const [confirmDelete, setConfirmDelete] = useState(false);
 const [ratingFilter, setRatingFilter] = useState(0);

 const filtered = (reviews || []).filter((r: any) => {
 if (ratingFilter && r.rating !== ratingFilter) return false;
 return true;
 });

 // Rating distribution
 const ratingDist = [1, 2, 3, 4, 5].map((r) => ({
 rating: `${r}★`,
 count: (reviews || []).filter((rv: any) => rv.rating === r).length,
 }));

 const handleDelete = async () => {
 if (!selectedReview) return;
 try {
 await deleteReview({ reviewId: selectedReview._id });
 toast.success("Review deleted");
 setSelectedReview(null);
 setConfirmDelete(false);
 } catch (e: any) { toast.error(e.message); }
 };

 const columns: Column<any>[] = [
 { key: "customerName", label: "Customer", sortable: true, render: (r) => r.customerName || "Anonymous" },
 { key: "rating", label: "Rating", sortable: true, render: (r) => <StarRating rating={r.rating} /> },
 { key: "reviewText", label: "Review", render: (r) => <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{r.reviewText?.slice(0, 80)}{r.reviewText?.length > 80 ? "…" : ""}</span> },
 { key: "tags", label: "Tags", render: (r) => <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(r.tags || []).slice(0, 3).map((t: string) => <span key={t} className="admin-badge admin-badge-violet" style={{ fontSize: 10 }}>{t}</span>)}</div> },
 { key: "createdAt", label: "Date", sortable: true, render: (r) => r.createdAt ? format(new Date(r.createdAt), "dd MMM yyyy") : "—" },
 { key: "actions", label: "Actions", render: (r) => (
 <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedReview(r); setConfirmDelete(true); }}>
 Delete
 </button>
 )},
 ];

 return (
 <div>
 <div className="admin-page-header">
 <div>
 <h1 className="admin-page-title">Reviews Management</h1>
 <p className="admin-page-subtitle">{(reviews || []).length} reviews loaded</p>
 </div>
 <ExportCSVButton data={filtered} columns={[
 { key: "customerName", label: "Customer" }, { key: "rating", label: "Rating" },
 { key: "reviewText", label: "Review" }, { key: "createdAt", label: "Date" },
 ]} filename="reviews.csv" />
 </div>

 {/* Analytics */}
 <div className="admin-chart-grid admin-chart-grid-2" style={{ marginBottom: 24 }}>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Rating Distribution</div>
 <ResponsiveContainer width="100%" height={160}>
 <BarChart data={ratingDist}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="rating" tick={{ fontSize: 12, fill: "#64748b" }} />
 <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
 <Tooltip {...TOOLTIP_STYLE} />
 <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 <div className="admin-card">
 <div className="admin-card-title" style={{ marginBottom: 12 }}> Most Common Tags</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {(tagFrequency || []).slice(0, 15).map((t: any) => (
 <div key={t.tag} className="admin-badge admin-badge-violet" style={{ fontSize: 11 }}>
 {t.tag} <span style={{ opacity: 0.6, marginLeft: 2 }}>{t.count}</span>
 </div>
 ))}
 {!tagFrequency?.length && <span style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>No tags yet</span>}
 </div>
 </div>
 </div>

 {/* Filter */}
 <div className="admin-card" style={{ marginBottom: 16, padding: "14px 16px" }}>
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
 <select className="admin-select" value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
 <option value={0}>All Ratings</option>
 {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
 </select>
 <span style={{ fontSize: 13, color: "var(--admin-text-muted)", marginLeft: "auto" }}>{filtered.length} reviews</span>
 </div>
 </div>

 <DataTable
 columns={columns}
 data={filtered}
 pageSize={25}
 onRowClick={(r) => setSelectedReview(r)}
 loading={status === "LoadingFirstPage"}
 />

 {status === "CanLoadMore" && (
 <div style={{ textAlign: "center", marginTop: 16 }}>
 <button className="admin-btn admin-btn-secondary" onClick={() => loadMore(50)}>Load More</button>
 </div>
 )}

 <AnimatePresence>
 {selectedReview && !confirmDelete && (
 <ReviewModal
 review={selectedReview}
 onClose={() => setSelectedReview(null)}
 onDelete={() => setConfirmDelete(true)}
 />
 )}
 </AnimatePresence>

 <ConfirmDialog
 open={confirmDelete}
 title="Delete this review?"
 description="This will permanently remove the review and update the shop's rating."
 confirmLabel="Delete Review"
 onConfirm={handleDelete}
 onCancel={() => { setConfirmDelete(false); setSelectedReview(null); }}
 danger
 />
 </div>
 );
}
