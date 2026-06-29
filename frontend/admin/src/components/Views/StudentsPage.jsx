import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { api } from "../lib/api";

const STATUS_STYLES = {
  Placed: "bg-[color-mix(in_oklab,var(--accent)_16%,white)] text-[var(--accent)]",
  "In-Progress": "bg-secondary text-secondary-foreground",
  Unplaced: "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[var(--destructive)]",
};

const BRANCHES = [
  "Computer Science",
  "Computer Science (AI)",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function ReadinessBar({ value = 0 }) {
  const color =
    value >= 80 ? "var(--accent)" : value >= 60 ? "var(--chart-4)" : "var(--destructive)";
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm tabular-nums text-muted-foreground w-8">{value}</span>
    </div>
  );
}

function emptyForm() {
  return { name: "", email: "", rollNumber: "", branch: BRANCHES[0], cgpa: "", batch: "" };
}

function AddStudentModal({ onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/students", {
        ...form,
        cgpa: parseFloat(form.cgpa),
        batch: parseInt(form.batch, 10),
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground">Add student</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Full name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Roll number</label>
              <input
                required
                value={form.rollNumber}
                onChange={(e) => update("rollNumber", e.target.value)}
                className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Branch</label>
              <select
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Batch year</label>
              <input
                required
                type="number"
                value={form.batch}
                onChange={(e) => update("batch", e.target.value)}
                placeholder="2027"
                className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">CGPA</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.cgpa}
                onChange={(e) => update("cgpa", e.target.value)}
                className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Add student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const PAGE_SIZE = 6;

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/students", {
        search: query || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        branch: branchFilter !== "All" ? branchFilter : undefined,
      });
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(loadStudents, 300); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, statusFilter, branchFilter]);

  const branches = useMemo(
    () => ["All", ...Array.from(new Set(students.map((s) => s.branch)))],
    [students]
  );
  const statuses = ["All", "Placed", "In-Progress", "Unplaced"];

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const pageItems = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((s) => selected.includes(s._id));

  function toggleAll() {
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageItems.some((s) => s._id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageItems.map((s) => s._id)])]);
    }
  }

  function toggleOne(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function removeStudent(id) {
    if (!confirm("Remove this student? This cannot be undone.")) return;
    try {
      await api.del(`/students/${id}`);
      loadStudents();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {students.length} students · readiness scores computed from CGPA, aptitude, communication & projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <Download className="size-4" />
            Export
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity"
          >
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
            <option key={b} value={b}>{b === "All" ? "All branches" : b}</option>
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
                statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
            <button onClick={() => setSelected([])} className="hover:underline">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {error && (
          <div className="px-4 py-3 text-sm text-[var(--destructive)] border-b border-border">{error}</div>
        )}
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
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    <Loader2 className="size-4 animate-spin inline mr-2" />
                    Loading students…
                  </td>
                </tr>
              )}

              {!loading && pageItems.map((s) => (
                <tr key={s._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(s._id)}
                      onChange={() => toggleOne(s._id)}
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
                        <div className="text-muted-foreground text-xs">{s.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.branch}</td>
                  <td className="px-4 py-3 text-foreground tabular-nums">{s.cgpa?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-foreground tabular-nums">{s.leetcode ?? 0}</td>
                  <td className="px-4 py-3"><ReadinessBar value={s.readiness} /></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[s.placementStatus]}`}>
                      {s.placementStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeStudent(s._id)} className="text-muted-foreground hover:text-[var(--destructive)]">
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && pageItems.length === 0 && (
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
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
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

      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadStudents();
          }}
        />
      )}
    </div>
  );
}