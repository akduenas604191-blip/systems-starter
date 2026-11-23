// Saves the tracker's data in the browser (localStorage). v1 has no server or database:
// data stays on the coordinator's own computer (NFR-1). A real database comes in Lab 6.
import {
  AUTO_APPROVE_DAYS,
  DEFAULT_SETTINGS,
  validateSettings,
  type ExpenseItem,
  type Settings,
} from "./expenses";

const KEY = "expense-deadline-tracker-v1";

export type SavedData = { items: ExpenseItem[]; settings: Settings };

export function loadData(): SavedData {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { items: [], settings: DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SavedData>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      settings: loadSettings(parsed.settings),
    };
  } catch {
    // Storage blocked or data unreadable: start empty rather than crash.
    return { items: [], settings: DEFAULT_SETTINGS };
  }
}

// The auto-approval day is always 45, even if an older save in this browser has another
// number. A saved report due day is kept only if it's still valid (less than 45).
function loadSettings(saved: Partial<Settings> | undefined): Settings {
  const deadlineDays = Number(saved?.deadlineDays);
  return validateSettings(deadlineDays, AUTO_APPROVE_DAYS) === null
    ? { deadlineDays, autoApproveDays: AUTO_APPROVE_DAYS }
    : DEFAULT_SETTINGS;
}

export function saveData(data: SavedData): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked: the app keeps working for this visit.
  }
}

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
