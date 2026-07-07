import { Download } from "lucide-react";

interface Props<T extends Record<string, any>> {
  data: T[];
  columns: { key: string; label: string }[];
  filename?: string;
}

export default function ExportCSVButton<T extends Record<string, any>>({ data, columns, filename = "export.csv" }: Props<T>) {
  const handleExport = () => {
    const header = columns.map((c) => c.label).join(",");
    const rows = data.map((row) =>
      columns.map((c) => {
        const val = row[c.key] ?? "";
        const str = String(val).replace(/"/g, '""');
        return /[,"\n]/.test(str) ? `"${str}"` : str;
      }).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="admin-btn admin-btn-secondary" onClick={handleExport} title="Export to CSV">
      <Download size={14} />
      Export CSV
    </button>
  );
}
