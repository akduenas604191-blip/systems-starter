# v1 build tasks

Each task names the story and acceptance criteria it covers. **Built** means the code is written and passed automated checks. **I checked it** (it is checked) is yours: run `npm run dev` in `app/`, try the criteria yourself in the browser, and tick the box. Don't rely on the agent's report (Lab 4).

| # | Task | Story / criteria | Built | I checked it |
|---|---|---|---|---|
| 1 | Rules as plain functions: days left, status, sorting, grouping (`src/lib/expenses.ts`) | S1 c2–c4 | [x] | [x] |
| 2 | Add-item form with validation and error messages | S1 c1, c6, c7 | [x] | [x] |
| 3 | Save and load from the browser (`src/lib/storage.ts`) | S1 c5 | [x] | [x] |
| 4 | Settings form with validation | S1 c4, c8 | [x] | [x] |
| 5 | Open list grouped by employee, status labels, empty state, sample data | S1 c2, c3, c9 | [x] | [x] |
| 6 | Write reminder and Copy, with copy-failure message | S2 c1–c6 | [x] | [x] |
| 7 | Log follow-up with channel, plus "Last contacted" / "Not contacted yet" | S3 c1–c3 | [x] | [x] |
| 8 | Mark submitted, Submitted list, and Undo | S3 c4–c5 | [x] | [x] |
| 9 | Delete with confirm and cancel | S3 c6–c7 | [x] | [x] |
| 10 | Tests: `src/lib/expenses.test.ts` and `src/app/tracker.test.tsx` (`npm test`) | all | [x] | [x] |
| 11 | Deploy to Vercel (Root Directory `app`) and put the URL in the README | — | [x] | [x] |

**How tasks 1–10 were checked before handoff:** the rules passed 16 checks run directly in Node. The page was bundled with esbuild and clicked through in a headless Chrome browser, where it passed 25 checks covering every acceptance criterion, plus phone width and no console errors. `npm test` and `npm run build` couldn't run in that environment (package installs were blocked), so run both yourself before deploying.
