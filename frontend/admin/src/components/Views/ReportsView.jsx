import { BarChart3 } from "lucide-react";
import { PlaceholderView } from "./PlaceholderView";

export function ReportsView() {
  return (
    <PlaceholderView
      title="Reports & Analytics"
      desc="Generate placement reports, export to PDF/Excel, and view year-over-year performance trends."
      icon={<BarChart3 size={28} />}
    />
  );
}
