// Core rules for the Expense Deadline Tracker. Everything here is a plain function with no
// browser or React code, so the rules in specs/user-stories.md can be tested directly.

export const ITEM_TYPES = ["card", "reimbursement"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];
export const TYPE_LABELS: Record<ItemType, string> = {
  card: "Corporate card",
  reimbursement: "Reimbursement",
};

export const CHANNELS = ["Teams", "Text", "Email", "In person"] as const;
export type Channel = (typeof CHANNELS)[number];

export type Status = "on_track" | "overdue" | "urgent" | "past";
export const STATUS_LABELS: Record<Status, string> = {
  on_track: "On track",
  overdue: "Overdue",
  urgent: "Urgent",
  past: "Past auto-approval",
};

// An item is Urgent when this many days or fewer are left before auto-approval.
export const URGENT_WITHIN_DAYS = 5;

export type FollowUp = { at: string; channel: Channel }; // at = ISO date-time

export type ExpenseItem = {
  id: string;
  employee: string; // initials or employee ID only, never a real name (NFR-1)
  department: string;
  merchant: string;
  amount: number;
  chargeDate: string; // YYYY-MM-DD
  type: ItemType;
  followUps: FollowUp[];
  submittedOn: string | null; // YYYY-MM-DD when marked submitted, otherwise null
};

export type Settings = {
  deadlineDays: number; // days after the charge the report is due
  autoApproveDays: number; // days after the charge the platform auto-approves it
};

// The expense platform auto-approves reports 45 days after the charge. This is fixed by the
// platform, so the tracker shows it in Settings but doesn't let anyone change it.
export const AUTO_APPROVE_DAYS = 45;

export const DEFAULT_SETTINGS: Settings = { deadlineDays: 30, autoApproveDays: AUTO_APPROVE_DAYS };

// ---------- Dates ----------

// Turns "YYYY-MM-DD" into a whole-day number, ignoring time zones.
function dayNumber(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function isValidDate(isoDate: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

// Today's date in the user's own time zone, as YYYY-MM-DD.
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// The date `days` before `isoDate`, as YYYY-MM-DD (used for sample data).
export function shiftDate(isoDate: string, days: number): string {
  const date = new Date((dayNumber(isoDate) + days) * 86_400_000);
  return date.toISOString().slice(0, 10);
}

export function daysSinceCharge(item: Pick<ExpenseItem, "chargeDate">, today: string): number {
  return dayNumber(today) - dayNumber(item.chargeDate);
}

export function daysLeft(
  item: Pick<ExpenseItem, "chargeDate">,
  today: string,
  settings: Settings,
): number {
  return settings.autoApproveDays - daysSinceCharge(item, today);
}

// Status rules from specs/user-stories.md (S1, criterion 3).
export function statusOf(
  item: Pick<ExpenseItem, "chargeDate">,
  today: string,
  settings: Settings,
): Status {
  const left = daysLeft(item, today, settings);
  if (left <= 0) return "past";
  if (left <= URGENT_WITHIN_DAYS) return "urgent";
  if (daysSinceCharge(item, today) >= settings.deadlineDays) return "overdue";
  return "on_track";
}

// "2026-11-03" -> "Nov 3"
export function shortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function money(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// ---------- Validation (S1 criteria 6–8) ----------

export type NewItemInput = {
  employee: string;
  department: string;
  merchant: string;
  amount: string;
  chargeDate: string;
  type: ItemType;
};

export type ValidationResult =
  | { ok: true; item: Omit<ExpenseItem, "id" | "followUps" | "submittedOn"> }
  | { ok: false; errors: string[] };

export function validateNewItem(input: NewItemInput, today: string): ValidationResult {
  const errors: string[] = [];
  const employee = input.employee.trim();
  const merchant = input.merchant.trim();
  const amountText = input.amount.trim();
  const amount = Number(amountText);

  if (employee === "") errors.push("Employee is required.");
  if (merchant === "") errors.push("Merchant is required.");
  if (amountText === "" || !Number.isFinite(amount) || amount <= 0) {
    errors.push("Amount must be a number greater than 0.");
  }
  if (input.chargeDate === "" || !isValidDate(input.chargeDate)) {
    errors.push("Charge date is required.");
  } else if (dayNumber(input.chargeDate) > dayNumber(today)) {
    errors.push("Charge date can't be in the future.");
  }

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    item: {
      employee,
      department: input.department.trim(),
      merchant,
      amount: Math.round(amount * 100) / 100,
      chargeDate: input.chargeDate,
      type: input.type,
    },
  };
}

export function validateSettings(deadlineDays: number, autoApproveDays: number): string | null {
  if (!Number.isInteger(deadlineDays) || deadlineDays < 1) {
    return "Submission deadline must be a whole number of days, 1 or more.";
  }
  if (!Number.isInteger(autoApproveDays)) {
    return "Auto-approval day must be a whole number.";
  }
  if (autoApproveDays <= deadlineDays) {
    return `Report due day must be less than the auto-approval day (${autoApproveDays}).`;
  }
  return null;
}

// ---------- Grouping and sorting (S1 criterion 2) ----------

export type EmployeeGroup = {
  employee: string;
  items: ExpenseItem[]; // sorted, fewest days left first
  minDaysLeft: number;
  lastFollowUp: FollowUp | null;
  followUpCount: number;
};

// Employees are matched without regard to case or extra spaces ("ab" and " AB " are the same person).
export function employeeKey(employee: string): string {
  return employee.trim().toUpperCase();
}

export function openItems(items: ExpenseItem[]): ExpenseItem[] {
  return items.filter((item) => item.submittedOn === null);
}

export function groupOpenItems(
  items: ExpenseItem[],
  today: string,
  settings: Settings,
): EmployeeGroup[] {
  const groups = new Map<string, ExpenseItem[]>();
  for (const item of openItems(items)) {
    const key = employeeKey(item.employee);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  const result: EmployeeGroup[] = [];
  for (const groupItems of groups.values()) {
    const sorted = [...groupItems].sort(
      (a, b) =>
        daysLeft(a, today, settings) - daysLeft(b, today, settings) ||
        a.merchant.localeCompare(b.merchant),
    );
    const followUps = latestFollowUps(sorted);
    result.push({
      employee: sorted[0].employee,
      items: sorted,
      minDaysLeft: daysLeft(sorted[0], today, settings),
      lastFollowUp: followUps.last,
      followUpCount: followUps.count,
    });
  }

  return result.sort(
    (a, b) => a.minDaysLeft - b.minDaysLeft || a.employee.localeCompare(b.employee),
  );
}

// Follow-ups are saved on every open item of the employee at once, so the item with the most
// follow-ups holds the employee's full history.
function latestFollowUps(items: ExpenseItem[]): { last: FollowUp | null; count: number } {
  let longest: FollowUp[] = [];
  for (const item of items) if (item.followUps.length > longest.length) longest = item.followUps;
  return { last: longest.at(-1) ?? null, count: longest.length };
}

// ---------- Actions (S3) ----------

export function logFollowUp(
  items: ExpenseItem[],
  employee: string,
  channel: Channel,
  at: string,
): ExpenseItem[] {
  const key = employeeKey(employee);
  return items.map((item) =>
    item.submittedOn === null && employeeKey(item.employee) === key
      ? { ...item, followUps: [...item.followUps, { at, channel }] }
      : item,
  );
}

export function markSubmitted(items: ExpenseItem[], id: string, today: string): ExpenseItem[] {
  return items.map((item) => (item.id === id ? { ...item, submittedOn: today } : item));
}

export function undoSubmitted(items: ExpenseItem[], id: string): ExpenseItem[] {
  return items.map((item) => (item.id === id ? { ...item, submittedOn: null } : item));
}

export function deleteItem(items: ExpenseItem[], id: string): ExpenseItem[] {
  return items.filter((item) => item.id !== id);
}

// ---------- Reminder message (S2) ----------

export const REIMBURSEMENT_LINE =
  "You won't be paid back for the reimbursement items until the report is submitted.";

export function buildReminder(group: EmployeeGroup, today: string, settings: Settings): string {
  const count = group.items.length;
  const lines = group.items.map((item) => {
    const left = daysLeft(item, today, settings);
    const when =
      left <= 0
        ? "past the auto-approval date"
        : `${left} day${left === 1 ? "" : "s"} left before it auto-approves`;
    return `• ${item.merchant}, ${money(item.amount)}, charged ${shortDate(item.chargeDate)}: ${when}`;
  });

  const message = [
    `Hi ${group.employee}, you have ${count} open expense item${count === 1 ? "" : "s"} that still need${count === 1 ? "s" : ""} a report:`,
    ...lines,
  ];
  if (group.items.some((item) => item.type === "reimbursement")) message.push(REIMBURSEMENT_LINE);
  message.push(
    "Can you submit today? Reply with a photo of the receipt and I'll help get it attached. Thanks!",
  );
  return message.join("\n");
}

// ---------- Sample data (all made up) ----------

export function sampleItems(today: string): ExpenseItem[] {
  const item = (
    id: string,
    employee: string,
    department: string,
    merchant: string,
    amount: number,
    daysAgo: number,
    type: ItemType,
  ): ExpenseItem => ({
    id,
    employee,
    department,
    merchant,
    amount,
    chargeDate: shiftDate(today, -daysAgo),
    type,
    followUps: [],
    submittedOn: null,
  });
  return [
    item("s1", "E-1042", "Sales", "Harbor Hotel", 412.8, 42, "card"),
    item("s2", "E-1042", "Sales", "Airport parking", 36, 41, "reimbursement"),
    item("s3", "E-2290", "Marketing", "Print shop", 128.5, 33, "card"),
    item("s4", "E-3317", "Operations", "Rental car", 289.99, 47, "card"),
    item("s5", "E-4471", "Sales", "Client lunch", 74.25, 12, "card"),
    item("s6", "E-2290", "Marketing", "Mileage", 58.4, 8, "reimbursement"),
  ];
}
