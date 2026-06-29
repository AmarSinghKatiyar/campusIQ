import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronDown,
} from "lucide-react";

// ---- Mock data — swap for your real API/backend call ----
const STATS = [
  { label: "Total Placements", value: "184", delta: "+12%", trend: "up" },
  { label: "Avg. Package (LPA)", value: "7.2", delta: "+0.8", trend: "up" },
  { label: "Eligible Pool", value: "412", delta: "-3%", trend: "down" },
  { label: "Companies Visited", value: "38", delta: "+6", trend: "up" },
];

const BRANCH_PLACEMENTS = [
  { branch: "CSE", placed: 62, total: 80 },
  { branch: "CSE (AI)", placed: 51, total: 60 },
  { branch: "IT", placed: 34, total: 55 },
  { branch: "ECE", placed: 21, total: 50 },
  { branch: "ME", placed: 16, total: 45 },
];

const TREND = [
  { month: "Jan", value: 8 },
  { month: "Feb", value: 14 },
  { month: "Mar", value: 11 },
  { month: "Apr", value: 22 },
  { month: "May", value: 19 },
  { month: "Jun", value: 31 },
  { month: "Jul", value: 27 },
  { month: "Aug", value: 35 },
  { month: "Sep", value: 41 },
];

const REPORTS = [
  { name: "Placement Summary — 2027 Batch", type: "PDF", date: "Jun 24, 2026", size: "1.2 MB" },
  { name: "Branch-wise Eligibility Report", type: "XLSX", date: "Jun 20, 2026", size: "640 KB" },
  { name: "Company-wise Offer Breakdown", type: "XLSX", date: "Jun 18, 2026", size: "812 KB" },
  { name: "Year-over-Year Comparison", type: "PDF", date: "Jun 10, 2026", size: "2.1 MB" },
  { name: "Student Readiness Audit", type: "PDF", date: "Jun 02, 2026", size: "980 KB" },
];

const TYPE_STYLES = {
  PDF: { icon: FileText, classes: "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[var(--destructive)]" },
  XLSX: { icon: FileSpreadsheet, classes: "bg-[color-mix(in_oklab,var(--accent)_14%,white)] text-[var(--accent)]" },
};

const RANGES = ["This week", "This month", "This quarter", "This year"];

function StatCard({ label, value, delta, trend }) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;
  const color = trend === "up" ? "var(--accent)" : "var(--destructive)";
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <span className="text-2xl text-foreground font-medium tabular-nums">{value}</span>
        <span
          className="inline-flex items-center gap-1 text-xs font-medium"
          style={{ color }}
        >
          <Icon className="size-3.5" />
          {delta}
        </span>
      </div>
    </div>
  );
}

function BranchBarChart() {
  const max = Math.max(...BRANCH_PLACEMENTS.map((b) => b.total));
  return (
    <div className="space-y-4">
      {BRANCH_PLACEMENTS.map((b) => {
        const pct = (b.placed / b.total) * 100;
        const widthPct = (b.total / max) * 100;
        return (
          <div key={b.branch} className="flex items-center gap-3">
            <span className="w-20 text-sm text-muted-foreground shrink-0">{b.branch}</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden" style={{ width: `${widthPct}%` }}>
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-16 text-right text-sm tabular-nums text-foreground shrink-0">
              {b.placed}/{b.total}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TrendChart() {
  const max = Math.max(...TREND.map((t) => t.value));
  const w = 560;
  const h = 160;
  const padX = 8;
  const step = (w - padX * 2) / (TREND.length - 1);

  const points = TREND.map((t, i) => {
    const x = padX + i * step;
    const y = h - (t.value / max) * (h - 24) - 4;
    return [x, y];
  });

  const linePath = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendFill)" />
      <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--primary)" />
      ))}
      {TREND.map((t, i) => (
        <text
          key={t.month}
          x={points[i][0]}
          y={h + 18}
          textAnchor="middle"
          fontSize="11"
          fill="var(--muted-foreground)"
        >
          {t.month}
        </text>
      ))}
    </svg>
  );
}

export function ReportsPage() {
  const [range, setRange] = useState("This quarter");
  const [rangeOpen, setRangeOpen] = useState(false);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placement performance, trends, and exportable reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setRangeOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Calendar className="size-4" />
              {range}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {rangeOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card shadow-lg py-1 z-10">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRange(r);
                      setRangeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                      r === range ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity">
            <Download className="size-4" />
            Generate report
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Placements by branch</h3>
            <span className="text-xs text-muted-foreground">placed / eligible</span>
          </div>
          <BranchBarChart />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Monthly placement trend</h3>
            <span className="text-xs text-muted-foreground">students placed</span>
          </div>
          <TrendChart />
        </div>
      </div>

      {/* Report list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-foreground">Generated reports</h3>
          <span className="text-xs text-muted-foreground">{REPORTS.length} files</span>
        </div>
        <div className="divide-y divide-border">
          {REPORTS.map((r) => {
            const { icon: Icon, classes } = TYPE_STYLES[r.type];
            return (
              <div
                key={r.name}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex items-center justify-center size-9 rounded-lg shrink-0 ${classes}`}>
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{r.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {r.date} · {r.size}
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0 ml-4">
                  <Download className="size-3.5" />
                  Download
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}