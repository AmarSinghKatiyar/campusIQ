import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Building2,
  Shield,
  Camera,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { api, clearToken } from "../lib/api";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "institution", label: "Institution", icon: Building2 },
  { key: "security", label: "Security", icon: Shield },
];

function SectionCard({ title, desc, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h3 className="text-foreground">{title}</h3>
      {desc && <p className="text-muted-foreground text-sm mt-1 mb-5">{desc}</p>}
      {!desc && <div className="mb-5" />}
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-border bg-[var(--input-background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0"
      style={{ backgroundColor: checked ? "var(--primary)" : "var(--switch-background)" }}
    >
      <span
        className="inline-block size-4 rounded-full bg-white transition-transform"
        style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm text-foreground font-medium">{title}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SaveBar({ onSave, saving, saved }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {saved && (
        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)]">
          <Check className="size-4" />
          Saved
        </span>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving && <Loader2 className="size-4 animate-spin" />}
        Save changes
      </button>
    </div>
  );
}

function ProfileTab({ admin, onUpdated }) {
  const [form, setForm] = useState({
    name: admin.name || "",
    email: admin.email || "",
    jobTitle: admin.jobTitle || "Placement Admin",
    phone: admin.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      const updated = await api.put("/settings/profile", form);
      onUpdated(updated);
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard title="Profile" desc="Your personal info and how you appear across the dashboard.">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex items-center justify-center size-16 rounded-full bg-secondary text-secondary-foreground text-lg font-medium">
            {form.name.slice(0, 2).toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground">
            <Camera className="size-3.5" />
          </button>
        </div>
        <div>
          <p className="text-foreground font-medium">{form.name}</p>
          <p className="text-muted-foreground text-sm">{form.jobTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name">
          <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Role">
          <TextInput value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
        </Field>
        <Field label="Email">
          <TextInput type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <TextInput value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} />
    </SectionCard>
  );
}

function NotificationsTab({ admin, onUpdated }) {
  const [prefs, setPrefs] = useState(admin.notificationPrefs || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key, val) {
    setPrefs((p) => ({ ...p, [key]: val }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      const updated = await api.put("/settings/notifications", prefs);
      onUpdated({ notificationPrefs: updated });
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard title="Notifications" desc="Choose what you get notified about, and how.">
      <ToggleRow title="New student application" desc="When a student applies to a published drive" checked={!!prefs.newApplication} onChange={(v) => set("newApplication", v)} />
      <ToggleRow title="Student shortlisted or placed" desc="When a candidate's stage changes to Shortlisted, Offered, or Placed" checked={!!prefs.studentShortlisted} onChange={(v) => set("studentShortlisted", v)} />
      <ToggleRow title="Drive deadline reminders" desc="24 hours before a published drive's application deadline" checked={!!prefs.driveDeadline} onChange={(v) => set("driveDeadline", v)} />
      <ToggleRow title="Weekly digest" desc="Summary of placements, applications, and readiness trends" checked={!!prefs.weeklyDigest} onChange={(v) => set("weeklyDigest", v)} />
      <ToggleRow title="Product updates" desc="New CampusIQ features and changes" checked={!!prefs.productUpdates} onChange={(v) => set("productUpdates", v)} />
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </SectionCard>
  );
}

function InstitutionTab({ admin, onUpdated }) {
  const [form, setForm] = useState({
    name: admin.institution?.name || "",
    code: admin.institution?.code || "",
    city: admin.institution?.city || "",
    academicYear: admin.institution?.academicYear || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      const updated = await api.put("/settings/institution", form);
      onUpdated({ institution: updated });
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard title="Institution" desc="Defaults applied across drives and eligibility checks.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Institution name">
          <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Institution code">
          <TextInput value={form.code} onChange={(e) => update("code", e.target.value)} />
        </Field>
        <Field label="City">
          <TextInput value={form.city} onChange={(e) => update("city", e.target.value)} />
        </Field>
        <Field label="Current academic year">
          <TextInput value={form.academicYear} onChange={(e) => update("academicYear", e.target.value)} placeholder="e.g. 2026–27" />
        </Field>
      </div>
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </SectionCard>
  );
}

function DeleteAccountSection() {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const canDelete = confirmText === "DELETE";

  async function confirmDelete() {
    setDeleting(true);
    try {
      await api.del("/settings/account");
      clearToken();
      window.location.reload();
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  return (
    <SectionCard title="Delete account">
      <div className="flex items-start gap-3 rounded-lg border border-[color-mix(in_oklab,var(--destructive)_30%,var(--border))] bg-[color-mix(in_oklab,var(--destructive)_6%,white)] p-4">
        <AlertTriangle className="size-4 text-[var(--destructive)] shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-foreground font-medium">This action is permanent</p>
          <p className="text-muted-foreground mt-1">
            Deleting your account removes your admin access and profile. Drives, students, and
            placement records tied to your institution are not deleted with it.
          </p>
        </div>
      </div>

      {!open ? (
        <button onClick={() => setOpen(true)} className="rounded-lg border border-[var(--destructive)] text-[var(--destructive)] px-4 py-2 text-sm font-medium hover:bg-[color-mix(in_oklab,var(--destructive)_8%,white)] transition-colors">
          Delete my account
        </button>
      ) : (
        <div className="space-y-3">
          <Field label={'Type "DELETE" to confirm'}>
            <TextInput value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" />
          </Field>
          <div className="flex items-center gap-2">
            <button
              disabled={!canDelete || deleting}
              onClick={confirmDelete}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--destructive)] px-4 py-2 text-sm text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Confirm deletion
            </button>
            <button onClick={() => { setOpen(false); setConfirmText(""); }} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function SecurityTab({ admin, onUpdated }) {
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(admin.twoFactorEnabled || false);
  const [savingPw, setSavingPw] = useState(false);
  const [saved, setSaved] = useState(false);

  const mismatch = pw.next && pw.confirm && pw.next !== pw.confirm;

  async function savePassword() {
    if (mismatch || !pw.current || !pw.next) return;
    setSavingPw(true);
    try {
      await api.put("/settings/password", { currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingPw(false);
    }
  }

  async function toggleTwoFA(value) {
    setTwoFA(value);
    try {
      await api.put("/settings/two-factor", { enabled: value });
      onUpdated({ twoFactorEnabled: value });
    } catch (err) {
      alert(err.message);
      setTwoFA(!value);
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Password" desc="Update the password used to sign in to the admin dashboard.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Current password">
            <TextInput type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
          </Field>
          <div className="hidden sm:block" />
          <Field label="New password">
            <TextInput type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
          </Field>
          <Field label="Confirm new password">
            <TextInput type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
          </Field>
        </div>
        {mismatch && <p className="text-xs text-[var(--destructive)]">Passwords don't match.</p>}
        <SaveBar onSave={savePassword} saving={savingPw} saved={saved && !mismatch} />
      </SectionCard>

      <SectionCard title="Two-factor authentication">
        <ToggleRow title="Require a verification code at sign-in" desc="Adds an extra step using an authenticator app" checked={twoFA} onChange={toggleTwoFA} />
      </SectionCard>

      <DeleteAccountSection />
    </div>
  );
}

export function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/settings/profile")
      .then(setAdmin)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function applyUpdate(partial) {
    setAdmin((a) => ({ ...a, ...partial }));
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your profile, notifications, institution defaults, and account security
        </p>
      </div>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

      {loading || !admin ? (
        <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
          <Loader2 className="size-4 animate-spin" /> Loading settings…
        </div>
      ) : (
        <>
          <nav className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm whitespace-nowrap transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div>
            {tab === "profile" && <ProfileTab admin={admin} onUpdated={applyUpdate} />}
            {tab === "notifications" && <NotificationsTab admin={admin} onUpdated={applyUpdate} />}
            {tab === "institution" && <InstitutionTab admin={admin} onUpdated={applyUpdate} />}
            {tab === "security" && <SecurityTab admin={admin} onUpdated={applyUpdate} />}
          </div>
        </>
      )}
    </div>
  );
}