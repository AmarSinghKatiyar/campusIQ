import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Search,
  ChevronDown,
  ArrowUpDown,
  Medal,
  Info,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";

const SORT_OPTIONS = [
  { key: "score", label: "Composite score" },
  { key: "cgpa", label: "CGPA" },
  { key: "aptitude", label: "Aptitude" },
  { key: "communication", label: "Communication" },
  { key: "projects", label: "Projects" },
];

const RANK_STYLES = {
  1: "bg-[color-mix(in_oklab,var(--chart-4)_20%,white)] text-[var(--chart-4)]",
  2: "bg-[color-mix(in_oklab,var(--muted-foreground)_14%,white)] text-muted-foreground",
  3: "bg-[color-mix(in_oklab,var(--chart-3)_16%,white)] text-[var(--chart-3)]",
};

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function RankBadge({ rank }) {
  if (rank <= 3) {
    return (
      <div className={`flex items-center justify-center size-8 rounded-full font-medium text-sm ${RANK_STYLES[rank]}`}>
        <Medal className="size-4" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center size-8 rounded-full bg-muted text-muted-foreground font-medium text-sm">
      {rank}
    </div>
  );
}

function ScoreBar({ value = 0, max = 100, color = "var(--primary)" }) {
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-7">{value}</span>
    </div>
  );
}

export function RankingsPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [weights, setWeights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [sortKey, setSortKey] = useState("score");
  const [sortOpen, setSortOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/rankings", { sort: sortKey });
      setAllStudents(data.students);
      setWeights(data.weights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey]);

  const branches = useMemo(
    () => ["All", ...Array.from(new Set(allStudents.map((s) => s.branch)))],
    [allStudents]
  );

  const ranked = useMemo(() => {
    return allStudents
      .filter((s) => branchFilter === "All" || s.branch === branchFilter)
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(query.toLowerCase()) ||
          s.id?.toLowerCase().includes(query.toLowerCase())
      );
  }, [allStudents, query, branchFilter]);

  const top3 = ranked.slice(0, 3);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground flex items-center gap-2">
            <Trophy className="size-5 text-[var(--chart-4)]" />
            Student Rankings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Composite score from CGPA, aptitude, communication & project portfolio
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Info className="size-4" />
            How it's scored
          </button>
          {infoOpen && weights && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg p-4 z-10 text-sm">
              <p className="text-foreground font-medium mb-2">Composite weighting</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex justify-between"><span>CGPA</span><span>{Math.round(weights.cgpa * 100)}%</span></li>
                <li className="flex justify-between"><span>Aptitude</span><span>{Math.round(weights.aptitude * 100)}%</span></li>
                <li className="flex justify-between"><span>Communication</span><span>{Math.round(weights.communication * 100)}%</span></li>
                <li className="flex justify-between"><span>Projects</span><span>{Math.round(weights.projects * 100)}%</span></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
          <Loader2 className="size-4 animate-spin" /> Loading rankings…
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3.map((s, i) => (
                <div
                  key={s._id}
                  className={`rounded-xl border border-border bg-card p-5 flex items-center gap-4 ${
                    i === 0 ? "sm:order-2 ring-2 ring-[var(--chart-4)]/40" : i === 1 ? "sm:order-1" : "sm:order-3"
                  }`}
                >
                  <div className="flex items-center justify-center size-12 rounded-full bg-secondary text-secondary-foreground font-medium shrink-0">
                    {initials(s.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground font-medium truncate">{s.name}</p>
                    <p className="text-muted-foreground text-xs">{s.branch}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-foreground text-xl font-medium tabular-nums">{s.score}</p>
                    <p className="text-muted-foreground text-xs">rank #{i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll number"
                className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {branches.map((b) => (
                <option key={b} value={b}>{b === "All" ? "All branches" : b}</option>
              ))}
            </select>

            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <ArrowUpDown className="size-3.5 text-muted-foreground" />
                Sort: {SORT_OPTIONS.find((o) => o.key === sortKey).label}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg py-1 z-10">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => {
                        setSortKey(o.key);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                        o.key === sortKey ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="w-14 px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">CGPA</th>
                    <th className="px-4 py-3 font-medium">Aptitude</th>
                    <th className="px-4 py-3 font-medium">Communication</th>
                    <th className="px-4 py-3 font-medium">Projects</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((s, i) => (
                    <tr key={s._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3"><RankBadge rank={i + 1} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shrink-0">
                            {initials(s.name)}
                          </div>
                          <div>
                            <div className="text-foreground font-medium">{s.name}</div>
                            <div className="text-muted-foreground text-xs">{s.branch} · {s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground tabular-nums">{s.cgpa?.toFixed(1)}</td>
                      <td className="px-4 py-3"><ScoreBar value={s.aptitude} color="var(--chart-2)" /></td>
                      <td className="px-4 py-3"><ScoreBar value={s.communication} color="var(--chart-3)" /></td>
                      <td className="px-4 py-3"><ScoreBar value={s.projects} color="var(--chart-5)" /></td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-xs font-medium tabular-nums">
                          {s.score}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {ranked.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                        No students match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}