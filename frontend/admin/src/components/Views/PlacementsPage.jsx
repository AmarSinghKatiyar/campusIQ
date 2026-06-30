import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Plus,
  X,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  ChevronLeft,
  Trash2,
  Loader2,
  UserPlus,
} from "lucide-react";
import { api } from "../lib/api";

// Matches Application.stage in the (separate) applications sub-resource.
const STAGES = ["Applied", "Shortlisted", "Interview", "Offered", "Placed", "Rejected"];

const STAGE_STYLES = {
  Applied: "bg-muted text-muted-foreground",
  Shortlisted: "bg-secondary text-secondary-foreground",
  Interview: "bg-[color-mix(in_oklab,var(--chart-4)_16%,white)] text-[var(--chart-4)]",
  Offered: "bg-[color-mix(in_oklab,var(--chart-3)_16%,white)] text-[var(--chart-3)]",
  Placed: "bg-[color-mix(in_oklab,var(--accent)_16%,white)] text-[var(--accent)]",
  Rejected: "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[var(--destructive)]",
};

// Matches Placement.status enum: ['Active', 'Completed', 'Cancelled']
const DRIVE_STATUSES = ["Active", "Completed", "Cancelled"];

const DRIVE_STATUS_STYLES = {
  Active: "bg-[color-mix(in_oklab,var(--accent)_16%,white)] text-[var(--accent)]",
  Completed: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-[color-mix(in_oklab,var(--destructive)_10%,white)] text-[var(--destructive)]",
};

// Matches Placement.eligibilityCriteria.branchesAllowed enum
const ALL_BRANCHES = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function emptyDraft() {
  return {
    companyName: "",
    jobRole: "",
    ctc: "",
    startDate: "",
    endDate: "",
    eligibleBranches: [],
    minCgpa: "",
  };
}

function DriveForm({ onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyDraft());

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleBranch(b) {
    setForm((f) => ({
      ...f,
      eligibleBranches: f.eligibleBranches.includes(b)
        ? f.eligibleBranches.filter((x) => x !== b)
        : [...f.eligibleBranches, b],
    }));
  }

  // Required per schema: companyName, ctc, jobRole, startDate
  const valid = form.companyName.trim() && form.jobRole.trim() && form.ctc && form.startDate;

  function buildPayload() {
    return {
      companyName: form.companyName,
      jobRole: form.jobRole,
      ctc: parseFloat(form.ctc),
      startDate: form.startDate,
      endDate: form.endDate || null,
      eligibilityCriteria: {
        minCGPA: form.minCgpa ? parseFloat(form.minCgpa) : 0,
        branchesAllowed: form.eligibleBranches,
      },
      // status defaults to "Active" per schema; omitted so the backend default applies
    };
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground">New placement drive</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Company</label>
          <input
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="e.g. Microsoft"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
          <input
            value={form.jobRole}
            onChange={(e) => update("jobRole", e.target.value)}
            placeholder="e.g. Software Engineer Intern"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">CTC (LPA)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="number"
              step="0.1"
              value={form.ctc}
              onChange={(e) => update("ctc", e.target.value)}
              placeholder="e.g. 12"
              className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Min. CGPA</label>
          <input
            type="number"
            step="0.1"
            value={form.minCgpa}
            onChange={(e) => update("minCgpa", e.target.value)}
            placeholder="e.g. 7.0"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div />
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">Eligible branches</label>
        <div className="flex flex-wrap gap-2">
          {ALL_BRANCHES.map((b) => (
            <button
              key={b}
              onClick={() => toggleBranch(b)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                form.eligibleBranches.includes(b)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Start date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">End date (optional)</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
              className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        <button
          disabled={!valid || saving}
          onClick={() => onSubmit(buildPayload())}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Create drive
        </button>
      </div>
    </div>
  );
}

function DriveCard({ drive, onOpen, onDelete, onChangeStatus }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-foreground">{drive.companyName}</h3>
          <p className="text-muted-foreground text-sm mt-0.5">{drive.jobRole}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={drive.status}
            onChange={(e) => onChangeStatus(drive._id, e.target.value)}
            className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none focus:ring-2 focus:ring-ring ${DRIVE_STATUS_STYLES[drive.status]}`}
          >
            {DRIVE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => onDelete(drive._id)} className="text-muted-foreground hover:text-[var(--destructive)] transition-colors">
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><IndianRupee className="size-3.5" />{drive.ctc} LPA</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3.5" />
          Starts {drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "—"}
        </span>
        {drive.endDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            Ends {new Date(drive.endDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(drive.eligibilityCriteria?.branchesAllowed || []).map((b) => (
          <span key={b} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {b}
          </span>
        ))}
        {drive.eligibilityCriteria?.minCGPA > 0 && (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            Min CGPA {drive.eligibilityCriteria.minCGPA.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-foreground">
            <Users className="size-3.5 text-muted-foreground" />
            {drive.registeredStudents ?? 0} registered
          </span>
          <span className="inline-flex items-center gap-1.5 text-foreground">
            <CheckCircle2 className="size-3.5 text-[var(--accent)]" />
            {drive.selectedStudents ?? 0} selected
          </span>
        </div>
        <button onClick={() => onOpen(drive._id)} className="text-sm text-primary hover:underline">
          View candidates →
        </button>
      </div>
    </div>
  );
}

function AddCandidateModal({ onClose, onAdd }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/students").then(setStudents).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground">Add candidate</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground"><Loader2 className="size-4 animate-spin" /></div>
        ) : (
          <>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.name} · {s.rollNumber}</option>
              ))}
            </select>
            {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
            <div className="flex items-center justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button
                disabled={!studentId}
                onClick={() => onAdd(studentId)}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CandidateTable({ candidates, onChangeStage }) {
  const counts = STAGES.reduce((acc, s) => {
    acc[s] = candidates.filter((c) => c.stage === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <span key={s} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STAGE_STYLES[s]}`}>
            {s} · {counts[s]}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">CGPA</th>
                <th className="px-4 py-3 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.applicationId} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shrink-0">
                        {initials(c.name)}
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{c.name}</div>
                        <div className="text-muted-foreground text-xs">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{c.branch}</td>
                  <td className="px-4 py-3 text-foreground tabular-nums">{c.cgpa?.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={c.stage}
                      onChange={(e) => onChangeStage(c.applicationId, e.target.value)}
                      className={`rounded-md border-0 px-2.5 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-ring ${STAGE_STYLES[c.stage]}`}
                    >
                      {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}

              {candidates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No applicants yet for this drive.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function PlacementsPage() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [savingDrive, setSavingDrive] = useState(false);
  const [openDriveId, setOpenDriveId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [filter, setFilter] = useState("All");

  const filters = ["All", ...DRIVE_STATUSES];

  async function loadDrives() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/placements", { status: filter !== "All" ? filter : undefined });
      setDrives(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDrives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function createDrive(payload) {
    setSavingDrive(true);
    try {
      await api.post("/placements", payload);
      setShowForm(false);
      loadDrives();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingDrive(false);
    }
  }

  async function deleteDrive(id) {
    if (!confirm("Delete this drive and all its applications?")) return;
    try {
      await api.del(`/placements/${id}`);
      if (openDriveId === id) setOpenDriveId(null);
      loadDrives();
    } catch (err) {
      alert(err.message);
    }
  }

  async function changeDriveStatus(id, status) {
    try {
      await api.put(`/placements/${id}`, { status });
      loadDrives();
    } catch (err) {
      alert(err.message);
    }
  }

  async function loadCandidates(driveId) {
    setCandidatesLoading(true);
    try {
      const data = await api.get(`/placements/${driveId}/applications`);
      setCandidates(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setCandidatesLoading(false);
    }
  }

  function openDrive(id) {
    setOpenDriveId(id);
    loadCandidates(id);
  }

  async function changeStage(applicationId, stage) {
    try {
      await api.put(`/placements/${openDriveId}/applications/${applicationId}`, { stage });
      loadCandidates(openDriveId);
    } catch (err) {
      alert(err.message);
    }
  }

  async function addCandidate(studentId) {
    try {
      await api.post(`/placements/${openDriveId}/applications`, { studentId });
      setShowAddCandidate(false);
      loadCandidates(openDriveId);
      loadDrives();
    } catch (err) {
      alert(err.message);
    }
  }

  const drive = drives.find((d) => d._id === openDriveId);

  // ---- Candidate detail view ----
  if (openDriveId && drive) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <button onClick={() => setOpenDriveId(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
          Back to all drives
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-foreground">{drive.companyName} — {drive.jobRole}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {drive.registeredStudents ?? candidates.length} registered ·{" "}
              {drive.selectedStudents ?? candidates.filter((c) => c.stage === "Placed").length} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${DRIVE_STATUS_STYLES[drive.status]}`}>
              {drive.status}
            </span>
            <button
              onClick={() => setShowAddCandidate(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <UserPlus className="size-3.5" />
              Add candidate
            </button>
          </div>
        </div>

        {candidatesLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center"><Loader2 className="size-4 animate-spin" /> Loading candidates…</div>
        ) : (
          <CandidateTable candidates={candidates} onChangeStage={changeStage} />
        )}

        {showAddCandidate && <AddCandidateModal onClose={() => setShowAddCandidate(false)} onAdd={addCandidate} />}
      </div>
    );
  }

  // ---- Drive list view ----
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground flex items-center gap-2">
            <Briefcase className="size-5 text-primary" />
            Placement Drives
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track placement drives from kickoff through to final selections
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" />
            New drive
          </button>
        )}
      </div>

      {showForm && <DriveForm onSubmit={createDrive} onCancel={() => setShowForm(false)} saving={savingDrive} />}

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center"><Loader2 className="size-4 animate-spin" /> Loading drives…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {drives.map((d) => (
            <DriveCard key={d._id} drive={d} onOpen={openDrive} onDelete={deleteDrive} onChangeStatus={changeDriveStatus} />
          ))}

          {drives.length === 0 && (
            <div className="lg:col-span-2 rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No drives match this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}