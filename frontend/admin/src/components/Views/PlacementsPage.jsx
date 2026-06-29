import { useMemo, useState } from "react";
import {
  Briefcase,
  Plus,
  Link as LinkIcon,
  X,
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Trash2,
} from "lucide-react";

// ---- Mock data — swap for your real API/backend call ----
const INITIAL_DRIVES = [
  {
    id: "d1",
    company: "Microsoft",
    role: "Software Engineer Intern",
    link: "https://careers.microsoft.com/students/us/en/job/1234",
    description: "Work on cloud infrastructure teams. DSA-heavy interview process across 3 rounds.",
    package: "₹1,10,000/mo",
    location: "Hyderabad",
    eligibleBranches: ["CSE", "CSE (AI)", "IT"],
    minCgpa: 7.5,
    deadline: "2026-07-15",
    status: "Published",
  },
  {
    id: "d2",
    company: "Razorpay",
    role: "Backend Developer",
    link: "https://razorpay.com/jobs/backend-dev",
    description: "Full-time role on the payments core team. Node.js/Go, system design round included.",
    package: "₹18 LPA",
    location: "Bengaluru",
    eligibleBranches: ["CSE", "CSE (AI)", "IT", "ECE"],
    minCgpa: 7.0,
    deadline: "2026-07-08",
    status: "Published",
  },
  {
    id: "d3",
    company: "TCS",
    role: "Ninja Developer",
    link: "https://nextstep.tcs.com",
    description: "Mass recruitment drive, aptitude + technical + HR rounds.",
    package: "₹3.6 LPA",
    location: "Pan India",
    eligibleBranches: ["CSE", "IT", "ECE", "ME"],
    minCgpa: 6.0,
    deadline: "2026-06-30",
    status: "Closed",
  },
  {
    id: "d4",
    company: "Zoho",
    role: "Member of Technical Staff",
    link: "",
    description: "Draft — waiting on confirmed package details from the company before publishing.",
    package: "TBD",
    location: "Chennai",
    eligibleBranches: ["CSE", "CSE (AI)"],
    minCgpa: 7.0,
    deadline: "2026-08-01",
    status: "Draft",
  },
];

const INITIAL_CANDIDATES = {
  d1: [
    { id: "MPEC23CS031", name: "Priya Nair", branch: "CSE (AI)", cgpa: 9.5, stage: "Placed" },
    { id: "MPEC23CS014", name: "Ishita Verma", branch: "CSE (AI)", cgpa: 9.2, stage: "Offered" },
    { id: "MPEC23CS001", name: "Aarav Sharma", branch: "CSE", cgpa: 8.9, stage: "Interview" },
    { id: "MPEC23CS018", name: "Ananya Singh", branch: "CSE", cgpa: 8.6, stage: "Shortlisted" },
    { id: "MPEC23IT007", name: "Rohan Gupta", branch: "IT", cgpa: 7.4, stage: "Applied" },
  ],
  d2: [
    { id: "MPEC23CS022", name: "Sneha Pillai", branch: "CSE", cgpa: 8.1, stage: "Shortlisted" },
    { id: "MPEC23EC009", name: "Karan Mehta", branch: "ECE", cgpa: 6.9, stage: "Rejected" },
  ],
  d3: [
    { id: "MPEC23ME004", name: "Devansh Joshi", branch: "ME", cgpa: 7.8, stage: "Placed" },
  ],
  d4: [],
};

const STAGES = ["Applied", "Shortlisted", "Interview", "Offered", "Placed", "Rejected"];

const STAGE_STYLES = {
  Applied: "bg-muted text-muted-foreground",
  Shortlisted: "bg-secondary text-secondary-foreground",
  Interview: "bg-[color-mix(in_oklab,var(--chart-4)_16%,white)] text-[var(--chart-4)]",
  Offered: "bg-[color-mix(in_oklab,var(--chart-3)_16%,white)] text-[var(--chart-3)]",
  Placed: "bg-[color-mix(in_oklab,var(--accent)_16%,white)] text-[var(--accent)]",
  Rejected: "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[var(--destructive)]",
};

const DRIVE_STATUS_STYLES = {
  Draft: "bg-muted text-muted-foreground",
  Published: "bg-[color-mix(in_oklab,var(--accent)_16%,white)] text-[var(--accent)]",
  Closed: "bg-[color-mix(in_oklab,var(--destructive)_10%,white)] text-[var(--destructive)]",
};

const ALL_BRANCHES = ["CSE", "CSE (AI)", "IT", "ECE", "ME"];

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function emptyDraft() {
  return {
    company: "",
    role: "",
    link: "",
    description: "",
    package: "",
    location: "",
    eligibleBranches: [],
    minCgpa: "",
    deadline: "",
  };
}

function DriveForm({ onPublish, onSaveDraft, onCancel }) {
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

  const valid = form.company.trim() && form.role.trim();

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
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="e.g. Microsoft"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
          <input
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="e.g. Software Engineer Intern"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">Job link</label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={form.link}
            onChange={(e) => update("link", e.target.value)}
            placeholder="https://careers.company.com/job/..."
            className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Role overview, interview process, what to expect..."
          rows={3}
          className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Package</label>
          <input
            value={form.package}
            onChange={(e) => update("package", e.target.value)}
            placeholder="e.g. ₹12 LPA"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Location</label>
          <input
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Bengaluru"
            className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
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

      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">Application deadline</label>
        <div className="relative max-w-xs">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            className="w-full rounded-lg border border-border bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={!valid}
          onClick={() => onSaveDraft(form)}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40"
        >
          Save as draft
        </button>
        <button
          disabled={!valid}
          onClick={() => onPublish(form)}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Publish to students
        </button>
      </div>
    </div>
  );
}

function DriveCard({ drive, candidateCount, shortlistedCount, placedCount, onOpen, onDelete }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground">{drive.company}</h3>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${DRIVE_STATUS_STYLES[drive.status]}`}>
              {drive.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{drive.role}</p>
        </div>
        <button
          onClick={() => onDelete(drive.id)}
          className="text-muted-foreground hover:text-[var(--destructive)] transition-colors"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><IndianRupee className="size-3.5" />{drive.package}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{drive.location || "—"}</span>
        <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" />Deadline {drive.deadline || "—"}</span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{drive.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {drive.eligibleBranches.map((b) => (
          <span key={b} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {b}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-foreground">
            <Users className="size-3.5 text-muted-foreground" />
            {candidateCount} applied
          </span>
          <span className="inline-flex items-center gap-1.5 text-foreground">
            <CheckCircle2 className="size-3.5 text-[var(--accent)]" />
            {placedCount} placed
          </span>
        </div>
        <div className="flex items-center gap-3">
          {drive.link && (
            <a
              href={drive.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
              Listing
            </a>
          )}
          <button
            onClick={() => onOpen(drive.id)}
            className="text-sm text-primary hover:underline"
          >
            View candidates →
          </button>
        </div>
      </div>
    </div>
  );
}

function CandidateTable({ drive, candidates, onChangeStage }) {
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
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
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
                  <td className="px-4 py-3 text-foreground tabular-nums">{c.cgpa.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={c.stage}
                      onChange={(e) => onChangeStage(drive.id, c.id, e.target.value)}
                      className={`rounded-md border-0 px-2.5 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-ring ${STAGE_STYLES[c.stage]}`}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
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
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [candidatesByDrive, setCandidatesByDrive] = useState(INITIAL_CANDIDATES);
  const [showForm, setShowForm] = useState(false);
  const [openDriveId, setOpenDriveId] = useState(null);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Published", "Draft", "Closed"];

  const filteredDrives = useMemo(
    () => drives.filter((d) => filter === "All" || d.status === filter),
    [drives, filter]
  );

  function addDrive(form, status) {
    const id = `d${Date.now()}`;
    setDrives((prev) => [{ id, ...form, status }, ...prev]);
    setCandidatesByDrive((prev) => ({ ...prev, [id]: [] }));
    setShowForm(false);
  }

  function deleteDrive(id) {
    setDrives((prev) => prev.filter((d) => d.id !== id));
    if (openDriveId === id) setOpenDriveId(null);
  }

  function changeStage(driveId, studentId, stage) {
    setCandidatesByDrive((prev) => ({
      ...prev,
      [driveId]: prev[driveId].map((c) => (c.id === studentId ? { ...c, stage } : c)),
    }));
  }

  const openDrive = drives.find((d) => d.id === openDriveId);

  // ---- Candidate detail view ----
  if (openDrive) {
    const candidates = candidatesByDrive[openDrive.id] || [];
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <button
          onClick={() => setOpenDriveId(null)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to all drives
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-foreground">{openDrive.company} — {openDrive.role}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {candidates.length} applicant{candidates.length === 1 ? "" : "s"} ·{" "}
              {candidates.filter((c) => c.stage === "Placed").length} placed
            </p>
          </div>
          <span className={`inline-flex self-start items-center rounded-full px-2.5 py-1 text-xs font-medium ${DRIVE_STATUS_STYLES[openDrive.status]}`}>
            {openDrive.status}
          </span>
        </div>

        <CandidateTable drive={openDrive} candidates={candidates} onChangeStage={changeStage} />
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
            Publish job openings to students and track shortlists through to placement
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

      {showForm && (
        <DriveForm
          onPublish={(form) => addDrive(form, "Published")}
          onSaveDraft={(form) => addDrive(form, "Draft")}
          onCancel={() => setShowForm(false)}
        />
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDrives.map((drive) => {
          const candidates = candidatesByDrive[drive.id] || [];
          return (
            <DriveCard
              key={drive.id}
              drive={drive}
              candidateCount={candidates.length}
              shortlistedCount={candidates.filter((c) => c.stage === "Shortlisted").length}
              placedCount={candidates.filter((c) => c.stage === "Placed").length}
              onOpen={setOpenDriveId}
              onDelete={deleteDrive}
            />
          );
        })}

        {filteredDrives.length === 0 && (
          <div className="lg:col-span-2 rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No drives match this filter.
          </div>
        )}
      </div>
    </div>
  );
}