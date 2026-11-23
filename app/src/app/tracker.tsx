"use client";

import { useEffect, useId, useState } from "react";
import {
  AUTO_APPROVE_DAYS,
  buildReminder,
  CHANNELS,
  daysLeft,
  deleteItem,
  groupOpenItems,
  ITEM_TYPES,
  logFollowUp,
  markSubmitted,
  money,
  sampleItems,
  shortDate,
  STATUS_LABELS,
  statusOf,
  todayISO,
  TYPE_LABELS,
  undoSubmitted,
  validateNewItem,
  validateSettings,
  type Channel,
  type EmployeeGroup,
  type ExpenseItem,
  type ItemType,
  type Settings,
  type Status,
} from "@/lib/expenses";
import { loadData, newId, saveData } from "@/lib/storage";

const input =
  "rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900";
const button =
  "rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
const primary =
  "rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900";

const STATUS_STYLES: Record<Status, string> = {
  on_track: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  overdue: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  past: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900",
};

const EMPTY_FORM = {
  employee: "",
  department: "",
  merchant: "",
  amount: "",
  chargeDate: "",
  type: "card" as ItemType,
};

// `today` can be passed in by tests; the app uses the real date.
export default function Tracker({ today: fixedToday }: { today?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState(fixedToday ?? "");
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ deadlineDays: 30, autoApproveDays: 45 });

  // Load saved data once, in the browser only (S1 criterion 5).
  useEffect(() => {
    const data = loadData();
    setItems(data.items);
    setSettings(data.settings);
    if (!fixedToday) setToday(todayISO());
    setLoaded(true);
  }, [fixedToday]);

  // Save every change.
  useEffect(() => {
    if (loaded) saveData({ items, settings });
  }, [loaded, items, settings]);

  if (!loaded || today === "") {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  const groups = groupOpenItems(items, today, settings);
  const submitted = items
    .filter((item) => item.submittedOn !== null)
    .sort((a, b) => (b.submittedOn ?? "").localeCompare(a.submittedOn ?? ""));

  return (
    <div className="flex flex-col gap-8">
      <SettingsForm settings={settings} onSave={setSettings} />

      <AddItemForm
        today={today}
        onAdd={(item) => setItems((current) => [...current, item])}
      />

      <section className="flex flex-col gap-4" aria-labelledby="open-heading">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="open-heading" className="text-lg font-semibold">
            Open items
          </h2>
          <p className="text-sm text-zinc-500" aria-live="polite">
            {countLabel(groups.reduce((n, g) => n + g.items.length, 0), "open item")},{" "}
            {countLabel(groups.length, "employee")}
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
            <p>No open items. Add one above, or load sample data.</p>
            <button
              type="button"
              className={button}
              onClick={() =>
                setItems((current) => [
                  ...current,
                  ...sampleItems(today).map((item) => ({ ...item, id: newId() })),
                ])
              }
            >
              Load sample data
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {groups.map((group) => (
              <EmployeeCard
                key={group.employee.trim().toUpperCase()}
                group={group}
                today={today}
                settings={settings}
                onLogFollowUp={(channel) =>
                  setItems((current) =>
                    logFollowUp(current, group.employee, channel, new Date().toISOString()),
                  )
                }
                onSubmitted={(id) => setItems((current) => markSubmitted(current, id, today))}
                onDelete={(id) => setItems((current) => deleteItem(current, id))}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="submitted-heading">
        <h2 id="submitted-heading" className="text-lg font-semibold">
          Submitted
        </h2>
        {submitted.length === 0 ? (
          <p className="text-sm text-zinc-500">Nothing marked submitted yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {submitted.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
              >
                <span>
                  {item.employee}: {item.merchant}, {money(item.amount)}. Submitted{" "}
                  {shortDate(item.submittedOn!)}
                </span>
                <button
                  type="button"
                  className={button}
                  onClick={() => setItems((current) => undoSubmitted(current, item.id))}
                >
                  Undo
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ---------- Settings (S1 criteria 4 and 8) ----------

function SettingsForm({
  settings,
  onSave,
}: {
  settings: Settings;
  onSave: (settings: Settings) => void;
}) {
  const [deadline, setDeadline] = useState(String(settings.deadlineDays));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <details className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
      <summary className="cursor-pointer font-medium">
        Settings: report due day {settings.deadlineDays}, auto-approves day{" "}
        {settings.autoApproveDays}
      </summary>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const d = Number(deadline);
          const problem = validateSettings(d, AUTO_APPROVE_DAYS);
          setError(problem);
          setSaved(problem === null);
          if (problem === null) onSave({ deadlineDays: d, autoApproveDays: AUTO_APPROVE_DAYS });
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Report due (days after charge)</span>
          <input
            type="number"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              setSaved(false);
            }}
            className={input}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Auto-approves (days after charge)</span>
          <input
            type="number"
            value={AUTO_APPROVE_DAYS}
            readOnly
            aria-readonly="true"
            className={`${input} cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-800`}
          />
          <span className="text-xs text-zinc-500">Fixed by the expense platform</span>
        </label>
        <button type="submit" className={primary}>
          Save settings
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      {saved && <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">Saved.</p>}
    </details>
  );
}

// ---------- Add item (S1 criteria 1, 6, 7) ----------

function AddItemForm({ today, onAdd }: { today: string; onAdd: (item: ExpenseItem) => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const set = (field: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <section className="flex flex-col gap-3" aria-labelledby="add-heading">
      <h2 id="add-heading" className="text-lg font-semibold">
        Add an open item
      </h2>
      <form
        noValidate
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          const result = validateNewItem(form, today);
          if (!result.ok) {
            setErrors(result.errors);
            return;
          }
          onAdd({ ...result.item, id: newId(), followUps: [], submittedOn: null });
          setErrors([]);
          setForm({ ...EMPTY_FORM, type: form.type });
        }}
      >
        <Field label="Employee (initials or ID)" value={form.employee} onChange={set("employee")} placeholder="e.g. E-1042" />
        <Field label="Department" value={form.department} onChange={set("department")} placeholder="optional" />
        <Field label="Merchant" value={form.merchant} onChange={set("merchant")} placeholder="e.g. Harbor Hotel" />
        <Field label="Amount ($)" value={form.amount} onChange={set("amount")} placeholder="e.g. 128.50" inputMode="decimal" />
        <Field label="Charge date" value={form.chargeDate} onChange={set("chargeDate")} type="date" max={today} />
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Type</span>
          <select
            value={form.type}
            onChange={(e) => set("type")(e.target.value)}
            className={input}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-3">
          <button type="submit" className={primary}>
            Add item
          </button>
        </div>
      </form>
      {errors.length > 0 && (
        <ul role="alert" className="list-disc pl-5 text-sm text-red-700 dark:text-red-400">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  max?: string;
  inputMode?: "decimal";
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={input} {...rest} />
    </label>
  );
}

// ---------- One employee's open items (S2 and S3) ----------

function EmployeeCard({
  group,
  today,
  settings,
  onLogFollowUp,
  onSubmitted,
  onDelete,
}: {
  group: EmployeeGroup;
  today: string;
  settings: Settings;
  onLogFollowUp: (channel: Channel) => void;
  onSubmitted: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showReminder, setShowReminder] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [channel, setChannel] = useState<Channel>("Teams");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const uid = useId();
  const reminder = buildReminder(group, today, settings);
  const departments = [...new Set(group.items.map((i) => i.department).filter(Boolean))];

  async function copy() {
    try {
      await navigator.clipboard.writeText(reminder);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            {group.employee}
            {departments.length > 0 && (
              <span className="font-normal text-zinc-500"> · {departments.join(", ")}</span>
            )}
          </h3>
          <p className="text-sm text-zinc-500">
            {group.lastFollowUp
              ? `Last contacted ${formatDateTime(group.lastFollowUp.at)} via ${group.lastFollowUp.channel} · ${group.followUpCount} follow-up${group.followUpCount === 1 ? "" : "s"}`
              : "Not contacted yet"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={primary}
            onClick={() => {
              setShowReminder((s) => !s);
              setCopyState("idle");
            }}
          >
            {showReminder ? "Hide reminder" : "Write reminder"}
          </button>
          <label className="sr-only" htmlFor={`${uid}-channel`}>
            Channel
          </label>
          <select
            id={`${uid}-channel`}
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
            className="rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {CHANNELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button type="button" className={button} onClick={() => onLogFollowUp(channel)}>
            Log follow-up
          </button>
        </div>
      </div>

      {showReminder && (
        <div className="flex flex-col gap-2">
          <label className="sr-only" htmlFor={`${uid}-reminder`}>
            Reminder message
          </label>
          <textarea
            id={`${uid}-reminder`}
            readOnly
            value={reminder}
            rows={group.items.length * 2 + 4}
            className={`${input} font-mono text-sm`}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="flex items-center gap-3">
            <button type="button" className={primary} onClick={copy}>
              Copy
            </button>
            <span aria-live="polite" className="text-sm">
              {copyState === "copied" && "Copied"}
              {copyState === "failed" && "Couldn't copy. Select the text and copy it yourself."}
            </span>
          </div>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {group.items.map((item) => {
          const left = daysLeft(item, today, settings);
          const status = statusOf(item, today, settings);
          return (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div className="flex flex-col">
                <span>
                  {item.merchant} · {money(item.amount)}
                </span>
                <span className="text-xs text-zinc-500">
                  {TYPE_LABELS[item.type]} · charged {shortDate(item.chargeDate)} ·{" "}
                  {left > 0 ? `${left} day${left === 1 ? "" : "s"} left` : "past auto-approval"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
                >
                  {STATUS_LABELS[status]}
                </span>
                {confirmDelete === item.id ? (
                  <>
                    <span className="text-sm">Delete this item?</span>
                    <button type="button" className={button} onClick={() => onDelete(item.id)}>
                      Yes, delete
                    </button>
                    <button type="button" className={button} onClick={() => setConfirmDelete(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={button} onClick={() => onSubmitted(item.id)}>
                      Submitted
                    </button>
                    <button type="button" className={button} onClick={() => setConfirmDelete(item.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

// 1 -> "1 open item", 2 -> "2 open items"
function countLabel(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
