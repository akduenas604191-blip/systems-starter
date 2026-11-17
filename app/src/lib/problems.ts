// The allowed statuses, listed once. The ProblemStatus type is built from this list,
// so the two can never disagree. Keep in step with the check constraint in architecture/schema.sql.
export const STATUSES = ["open", "in_progress", "solved"] as const;
export type ProblemStatus = (typeof STATUSES)[number];

// What the user sees for each stored status value.
export const STATUS_LABELS: Record<ProblemStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  solved: "Solved",
};

// A "problem" in the system.
// When the Supabase table exists, keep this type in step with architecture/schema.sql.
export type Problem = {
  id: number;
  title: string;
  status: ProblemStatus;
};

// Placeholder data until the app reads from Supabase.
export const sampleProblems: Problem[] = [
  { id: 1, title: "Printer in room 204 is jammed", status: "open" },
  { id: 2, title: "Wi-Fi drops in the library", status: "in_progress" },
  { id: 3, title: "Projector has no signal", status: "solved" },
  { id: 4, title: "Cannot log in to the student portal", status: "open" },
  { id: 5, title: "Library printer out of toner", status: "solved" },
];

// Returns the problems whose title contains the search text.
// Case-insensitive, ignores spaces at the ends, and an empty search returns everything.
export function filterProblemsByTitle(problems: Problem[], query: string): Problem[] {
  const search = query.trim().toLowerCase();
  if (search === "") return problems;
  return problems.filter((problem) => problem.title.toLowerCase().includes(search));
}

// Returns the problems with the given status, or all of them for "all".
export function filterProblemsByStatus(
  problems: Problem[],
  status: ProblemStatus | "all",
): Problem[] {
  if (status === "all") return problems;
  return problems.filter((problem) => problem.status === status);
}

// Applies both filters: a problem must match the title search AND the status.
export function filterProblems(
  problems: Problem[],
  filters: { query: string; status: ProblemStatus | "all" },
): Problem[] {
  return filterProblemsByStatus(filterProblemsByTitle(problems, filters.query), filters.status);
}
