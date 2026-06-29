import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
} from "lucide-react";

// ---- Mock data — swap for your real API/backend call ----
const STUDENTS = [
  { id: "MPEC23CS001", name: "Aarav Sharma", branch: "CSE", batch: "2027", cgpa: 8.9, leetcode: 412, readiness: 87, status: "Placed" },
  { id: "MPEC23CS014", name: "Ishita Verma", branch: "CSE (AI)", batch: "2027", cgpa: 9.2, leetcode: 530, readiness: 94, status: "Eligible" },
  { id: "MPEC23IT007", name: "Rohan Gupta", branch: "IT", batch: "2027", cgpa: 7.4, leetcode: 120, readiness: 58, status: "Not Eligible" },
  { id: "MPEC23CS022", name: "Sneha Pillai", branch: "CSE", batch: "2027", cgpa: 8.1, leetcode: 287, readiness: 76, status: "Eligible" },
  { id: "MPEC23EC009", name: "Karan Mehta", branch: "ECE", batch: "2027", cgpa: 6.9, leetcode: 64, readiness: 41, status: "Not Eligible" },
  { id: "MPEC23CS031", name: "Priya Nair", branch: "CSE (AI)", batch: "2027", cgpa: 9.5, leetcode: 601, readiness: 97, status: "Placed" },
  { id: "MPEC23ME004", name: "Devansh Joshi", branch: "ME", batch: "2027", cgpa: 7.8, leetcode: 95, readiness: 62, status: "Eligible" },
  { id: "MPEC23CS018", name: "Ananya Singh", branch: "CSE", batch: "2027", cgpa: 8.6, leetcode: 349, readiness: 81, status: "Eligible" },
];

const STATUS_STYLES = {
  Placed: "bg-[color-mix(in_oklab,var(--accent)_16%,white)] text-[var(--accent)]",
  Eligible: "bg-secondary text-secondary-foreground",
  "Not Eligible": "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[var(--destructive)]",
};

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReadinessBar({ value }) {
  const color =
    value >= 80 ? "var(--accent)" : value >= 60 ? "var(--chart-4)" : "var(--destructive)";
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm tabular-nums text-muted-foreground w-8">{value}</span>
    </div>
  );
}

const PAGE_SIZE = 6;

export function StudentsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const branches = useMemo(
    () => ["All", ...Array.from(new Set(STUDENTS.map((s) => s.branch)))],
    []
  );
  const statuses = ["All", "Placed", "Eligible", "Not Eligible"];

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.id.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      const matchesBranch = branchFilter === "All" || s.branch === branchFilter;
      return matchesQuery && matchesStatus && matchesBranch;
    });
  }, [query, statusFilter, branchFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((s) => selected.includes(s.id));

  function toggleAll() {
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageItems.some((s) => s.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageItems.map((s) => s.id)])]);
    }
  }

  function toggleOne(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered.length} of {STUDENTS.length} students · readiness scores update nightly
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <Download className="size-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="size-4" />
            Add student
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or roll number"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={branchFilter}
          onChange={(e) => {
            setBranchFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {branches.map((b) => (
            <option key={b} value={b}>
              {b === "All" ? "All branches" : b}
            </option>
          ))}
        </select>

        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {(query || statusFilter !== "All" || branchFilter !== "All") && (
          <button
            onClick={() => {
              setQuery("");
              setStatusFilter("All");
              setBranchFilter("All");
              setPage(1);
            }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-2"
          >
            <X className="size-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Selection bar */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">
          <span>{selected.length} selected</span>
          <div className="flex items-center gap-3">
            <button className="hover:underline">Email</button>
            <button className="hover:underline">Export selected</button>
            <button onClick={() => setSelected([])} className="hover:underline">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAll}
                    className="size-4 rounded accent-[var(--primary)]"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">CGPA</th>
                <th className="px-4 py-3 font-medium">LeetCode</th>
                <th className="px-4 py-3 font-medium">Readiness</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageItems.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleOne(s.id)}
                      className="size-4 rounded accent-[var(--primary)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shrink-0">
                        {initials(s.name)}
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{s.name}</div>
                        <div className="text-muted-foreground text-xs">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.branch}</td>
                  <td className="px-4 py-3 text-foreground tabular-nums">{s.cgpa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-foreground tabular-nums">{s.leetcode}</td>
                  <td className="px-4 py-3">
                    <ReadinessBar value={s.readiness} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    No students match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center size-8 rounded-md border border-border text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center size-8 rounded-md border border-border text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}