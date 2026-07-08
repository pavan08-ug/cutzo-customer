import { useState } from "react";

export interface Column<T> {
 key: string;
 label: string;
 sortable?: boolean;
 render?: (row: T) => React.ReactNode;
 width?: string;
}

interface DataTableProps<T extends Record<string, any>> {
 columns: Column<T>[];
 data: T[];
 pageSize?: number;
 onRowClick?: (row: T) => void;
 loading?: boolean;
 emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
 columns, data, pageSize = 20, onRowClick, loading, emptyMessage = "No data found",
}: DataTableProps<T>) {
 const [page, setPage] = useState(0);
 const [sortKey, setSortKey] = useState<string | null>(null);
 const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

 const sorted = [...data].sort((a, b) => {
 if (!sortKey) return 0;
 const va = a[sortKey] ?? "";
 const vb = b[sortKey] ?? "";
 const cmp = typeof va === "number" && typeof vb === "number"
 ? va - vb
 : String(va).localeCompare(String(vb));
 return sortDir === "asc" ? cmp : -cmp;
 });

 const totalPages = Math.ceil(sorted.length / pageSize);
 const slice = sorted.slice(page * pageSize, (page + 1) * pageSize);

 const handleSort = (key: string) => {
 if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
 else { setSortKey(key); setSortDir("asc"); }
 setPage(0);
 };

 if (loading) {
 return (
 <div className="admin-table-wrap" style={{ padding: 40, textAlign: "center", color: "var(--admin-text-muted)", fontSize: 14 }}>
 Loading…
 </div>
 );
 }

 return (
 <div>
 <div className="admin-table-wrap">
 <table className="admin-table">
 <thead>
 <tr>
 {columns.map((col) => (
 <th
 key={col.key}
 style={{ width: col.width }}
 onClick={() => col.sortable && handleSort(col.key)}
 >
 <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
 {col.label}
 {col.sortable && sortKey === col.key && (
 sortDir === "asc" ? "↑" : "↓"
 )}
 </div>
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {slice.length === 0 ? (
 <tr>
 <td colSpan={columns.length} style={{ textAlign: "center", padding: 40, color: "var(--admin-text-muted)" }}>
 {emptyMessage}
 </td>
 </tr>
 ) : (
 slice.map((row, i) => (
 <tr
 key={row._id || i}
 onClick={() => onRowClick?.(row)}
 style={{ cursor: onRowClick ? "pointer" : undefined }}
 >
 {columns.map((col) => (
 <td key={col.key}>
 {col.render ? col.render(row) : row[col.key] ?? "—"}
 </td>
 ))}
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {totalPages > 1 && (
 <div className="admin-pagination">
 <button
 className="admin-btn admin-btn-secondary admin-btn-sm"
 disabled={page === 0}
 onClick={() => setPage((p) => p - 1)}
 >
 ← Prev
 </button>
 <span style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>
 Page {page + 1} of {totalPages}
 </span>
 <button
 className="admin-btn admin-btn-secondary admin-btn-sm"
 disabled={page >= totalPages - 1}
 onClick={() => setPage((p) => p + 1)}
 >
 Next →
 </button>
 </div>
 )}
 </div>
 );
}
