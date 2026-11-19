// Saves the tracker's data in the browser (localStorage). v1 has no server or database:
// data stays on the coordinator's own computer (NFR-1). A real database comes in Lab 6.
import { DEFAULT_SETTINGS, type ExpenseItem, type Settings } from "./expenses";

const KEY = "expense-deadline-tracker-v1";

export type SavedData = { items: ExpenseItem[]; settings: Settings };

export function loadData(): SavedData {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { items: [], settings: DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SavedData>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      settings: parsed.settings ?? DEFAULT_SETTINGS,
    };
  } catch {
    // Storage blocked or data unreadable: start empty rather than crash.
    return { items: [], settings: DEFAULT_SETTINGS };
  }
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
