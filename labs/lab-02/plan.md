# Lab 02 Plan

These are the plans Claude Code wrote in plan mode for the status feature. Plan 1 covers the
Next.js app (`systems-starter/app`). Plan 2 covers `simple-problem-tracker`.

## Plan 1: Next.js app (systems-starter/app), status + dropdown filter


### Context
The Problems page (`systems-starter/app`) can search by title, but problems have no status, so there's no way to see what still needs work. This adds a `status` to each problem (open, in progress, solved) and a **dropdown** that filters by it. The dropdown works together with the title search, and the page shows **all problems** on first load. Both choices were made by the student.

Everything still uses sample data. Supabase isn't connected yet, so no database or SQL changes are part of this.

### Changes

#### 1. `app/src/lib/problems.ts`: data and filter logic
- Add the list of allowed statuses, defined once, with the TypeScript type built from it so the two can't drift apart:
  ```ts
  export const STATUSES = ["open", "in_progress", "solved"] as const;
  export type ProblemStatus = (typeof STATUSES)[number];
  export const STATUS_LABELS: Record<ProblemStatus, string> = {
    open: "Open", in_progress: "In progress", solved: "Solved",
  };
  ```
  The stored value is `in_progress` (no spaces, safe for a future database column). The label shown to the user is "In progress".
- Add `status: ProblemStatus` to the `Problem` type, and give each of the 5 sample problems a status. Include at least one of each, plus two "printer" problems with different statuses so the combined filter is easy to see.
- Keep `filterProblemsByTitle` exactly as it is (its tests stay valid).
- Add `filterProblemsByStatus(problems, status: ProblemStatus | "all")`: `"all"` returns everything.
- Add `filterProblems(problems, { query, status })`, which applies both filters (title AND status). The component calls only this function.

#### 2. `app/src/app/problem-list.tsx`: the UI
- Add a second state value: `const [status, setStatus] = useState<ProblemStatus | "all">("all")`.
- Put the search box and a labelled `<select>` ("Status") side by side, stacking on narrow screens. The options are All, then one per `STATUSES` entry using `STATUS_LABELS`.
- Switch the list calculation from `filterProblemsByTitle` to `filterProblems`.
- Show a small status badge on each problem row, using `STATUS_LABELS`.
- Fix the empty message: today it says *No problems match "…"*, which reads oddly when the search box is empty and only the status filter applies. Change it to "No problems match your filters."
- Leave the "Showing X of Y problems" line as it is.

#### 3. `app/src/app/page.tsx`
No change. It already passes `sampleProblems` through.

#### 4. Tests
- `app/src/lib/problems.test.ts`: add `status` to the test data (TypeScript will require it). Add tests that:
  - `"all"` returns everything
  - each status returns only its own problems
  - status + title together keep only problems that pass both
- `app/src/app/problem-list.test.tsx`: add `status` to the test data. Add tests that:
  - picking "Solved" in the dropdown (`getByLabelText("Status")`) narrows the list
  - typing a title and picking a status at the same time works
  - each row shows its status label
  - the new empty message appears when nothing matches

### Later, not part of this change
When the Supabase table is created, `architecture/schema.sql` should get
`status text not null default 'open' check (status in ('open','in_progress','solved'))`. `STATUSES` in `problems.ts` is the matching list on the app side.

### Verification
1. In `systems-starter/app`, run `npm test`: the existing 8 tests plus the new ones all pass.
2. Run `npx tsc --noEmit` and `npm run lint`: both come back clean.
3. Run `npm run dev`, then open http://localhost:3000:
   - On load, all 5 problems show, each with a status badge.
   - Picking "Solved" shows only solved problems, and the count updates.
   - Typing "printer" with "Open" selected shows only the open printer problem.
   - Picking a status with no matches shows "No problems match your filters."
4. The student checks it in the browser. Then I commit, if the student asks.

## Plan 2: simple-problem-tracker, status + color-swatch filter

> Note: I changed the status filter from a word dropdown to color swatches before approving this plan.


### Context
The Problem Log (`simple-problem-tracker/index.html`) records problems, but there's no way to mark progress on them.
Add a **status** field (open / in progress / solved) that can be changed on each card, plus a filter that
works together with the existing title search. Project rules (`simple-problem-tracker/CLAUDE.md`): vanilla JS
only, everything in `index.html`, `textContent` for user text, and a migration in `load()` or a storage-key bump if the data shape changes.

### Only file changed
`simple-problem-tracker/index.html` (and a short update to `simple-problem-tracker/CLAUDE.md`).

### Steps

#### 1. Data + migration (keep key `problemLog.simple.v1`)
- Add `const STATUSES = [['open','Open'], ['in-progress','In progress'], ['solved','Solved']];` next to `FREQUENCIES`/`SEVERITIES`.
- In `load()`, default old entries: `data.map(p => ({ ...p, status: p.status || 'open' }))`.
  Adding a field doesn't break anything, so a migration is enough and the key stays the same. Existing entries become "Open".
- In the form `submit` handler, give new problems `status: 'open'`. The form doesn't get a status field because new problems always start open.

#### 2. Status pill on each card
- Reuse `ratingSelect(p, 'status', STATUSES, 'status', 'Status')`, placed first in the `.meta` row (before severity).
- Give `ratingSelect` an optional `onChange` callback. For status, it calls `render()` when a status filter is active,
  so a card that no longer matches the filter (for example, one marked Solved while viewing "Open") drops out right away.
  When the filter is "All", skip the re-render so the dropdown keeps focus.
- CSS, following the `.freq`/`.sev` pattern, using the shared status color variables from step 3
  (blue = open, orange = in progress, green = solved).

#### 3. Status filter: color swatches, no words
- Instead of a dropdown, show a row of three round **color swatch buttons** (no visible text), one per status.
  Each uses the same color as its card pill, so the swatch color is the filter:
  `<div id="status-filter" class="swatches" role="group" aria-label="Filter by status">`
  with `<button class="swatch" data-status="open">` and the matching buttons for `in-progress` and `solved`.
- Define each status color once as a CSS variable (`--status-open`, `--status-in-progress`, `--status-solved`)
  and use it for both the swatch and the `.status[data-value=…]` pill, so the two always match.
  Choose colors that stay distinct for most color-blind viewers: **blue** (open), **orange** (in progress), **green** (solved).
- Behavior: click a swatch to show only that status, and click the active swatch again to show all. Store the choice
  in a `statusFilter` variable (`'all'` by default) instead of reading a `<select>`.
- Active state: `aria-pressed="true"` plus a dark ring/outline. Inactive swatches are slightly faded while a filter is on.
- Accessibility: words are hidden but not removed. Each button gets `aria-label` and `title`
  (for example, "Show solved only"), so screen readers and hover tooltips still name the status.
- Put the swatches beside `#search` in a `.filters` flex row under the "Problems" heading. One delegated `click`
  listener on the group updates `statusFilter` and the `aria-pressed` values, then calls `render()`.

#### 4. `render()` combines both filters
- `visible = problems.filter(p => matchesSearch(p, query) && (status === 'all' || p.status === status))`.
- Count shows `"X of Y"` when either filter is active, and the plain total otherwise. This builds on the existing logic.
- Empty-state message: "No problems logged yet." when the list is empty, otherwise "No problems match these filters."
  Drop the quoted query so the message makes sense for status-only filtering too.

#### 5. Docs
- Update `simple-problem-tracker/CLAUDE.md`: add `status` to the data-shape list and the overview, and note the `load()` migration.

### Not included
- Saving the selected filter across reloads, a "solved at" timestamp, and dimming solved cards. Each is easy to add later.

### Verification
1. `node --check` on the extracted `<script>` (same method as the search change).
2. Open `index.html` in the browser. Existing problems should show an **Open** pill and none should be missing.
3. Change a card to Solved, reload, and check that the status was saved.
4. Click the blue swatch: the solved card disappears and the count reads "N of M". Mark another card Solved while on "Open" and it should disappear right away.
5. Click the blue swatch again: all problems come back and none of the swatches looks selected.
6. Combine a swatch with a title search, and check the empty-state message when nothing matches.
7. Hover a swatch to see its tooltip, and tab to the swatches to check that the keyboard focus ring and Enter/Space work.
