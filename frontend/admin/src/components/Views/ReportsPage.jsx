import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";

function StatCard({ label, value, suffix = "" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <span className="text-2xl text-foreground font-medium tabular-nums">{value}{suffix}</span>
      </div>
    </div>
  );
}

function BranchBarChart({ data }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">No student data yet.</p>;
  }
  const max = Math.max(...data.map((b) => b.total));
  return (
    <div className="space-y-4">
      {data.map((b) => {
        const pct = b.total ? (b.placed / b.total) * 100 : 0;
        const widthPct = (b.total / max) * 100;
        return (
          <div key={b.branch} className="flex items-center gap-3">
            <span className="w-32 text-sm text-muted-foreground shrink-0 truncate">{b.branch}</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden" style={{ width: `${widthPct}%` }}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
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

function TrendChart({ data }) {
  const max = Math.max(1, ...data.map((t) => t.value));
  const w = 560;
  const h = 160;
  const padX = 8;
  const step = (w - padX * 2) / (data.length - 1 || 1);

  const points = data.map((t, i) => {
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
      {data.map((t, i) => (
        <text key={t.month} x={points[i][0]} y={h + 18} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
          {t.month}
        </text>
      ))}
    </svg>
  );
}

export function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [statsRes, branchRes, trendRes] = await Promise.all([
          api.get("/reports/stats"),
          api.get("/reports/branch-placements"),
          api.get("/reports/trend"),
        ]);
        setStats(statsRes);
        setBranchData(branchRes);
        setTrend(trendRes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live placement performance and trends, computed from your student & drive records
        </p>
      </div>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
          <Loader2 className="size-4 animate-spin" /> Loading reports…
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Placements" value={stats.totalPlacements} />
            <StatCard label="Avg. Package (LPA)" value={stats.avgPackageLPA} />
            <StatCard label="Eligible Pool" value={stats.eligiblePool} />
            <StatCard label="Companies Visited" value={stats.companiesVisited} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Placements by branch</h3>
                <span className="text-xs text-muted-foreground">placed / eligible</span>
              </div>
              <BranchBarChart data={branchData} />
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Monthly placement trend</h3>
                <span className="text-xs text-muted-foreground">students placed this year</span>
              </div>
              <TrendChart data={trend} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}