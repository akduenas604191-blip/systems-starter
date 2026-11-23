# Expense Deadline Tracker v1, spec

## Intent
The Expense Deadline Tracker is for the expense compliance specialist in Finance / Accounts Payable: the person who chases employees when expense reports are late. It shows every open expense item sorted by how close it is to the expense platform's auto-approval date, writes a personal reminder for each late employee to send on Teams or by text instead of email, and records who has been contacted and when. The job: keep reports from being auto-approved without compliance review, and cut down the repetitive individual follow-ups, so employees get their reimbursements on time. Requirements, interviews, and sources: [discovery/requirements.md](../discovery/requirements.md).

## Stories and acceptance criteria
Full stories and EARS criteria: [user-stories.md](user-stories.md).
- **S1 (FR-1, FR-2): See who to chase first.** Add open items and see them grouped by employee, most urgent first, with days left and a status label.
- **S2 (FR-3): Write a personal reminder.** One click writes a message listing everything an employee still owes, ready to copy into Teams or a text.
- **S3 (FR-4): Log follow-ups and close items.** Record each contact and its channel, mark items submitted (with Undo), and delete with confirmation.

## Screens and flow
- **Flow:** [design/flow.md](../design/flow.md), which shows the S2 flow from opening the list to logging the follow-up, with every decision, error, and exit.
- **Chosen mockup:** [design/mockups/b-employee-cards.html](../design/mockups/b-employee-cards.html), combined with the most-urgent-first sorting and status labels from Mockup A. The reasons and the heuristic checks are in [design/decision.md](../design/decision.md).

One page, top to bottom:
1. **Settings** (collapsed): the report due day and the auto-approval day.
2. **Add an open item** form.
3. **Open items:** one card per employee, most urgent first. Each card has Write reminder, a channel picker, and Log follow-up. Each item shows its status label, with Submitted and Delete buttons. When there are no items, it says "No open items. Add one above, or load sample data."
4. **Submitted:** items marked submitted, each with Undo.

## Data
Stored in the browser's localStorage under the key `expense-deadline-tracker-v1`. There's no server and no database in v1. A real database comes in Lab 6.

**ExpenseItem**
| Field | Type | Notes |
|---|---|---|
| id | text | random ID |
| employee | text | initials or employee ID only, never a name (NFR-1) |
| department | text | optional |
| merchant | text | required |
| amount | number | greater than 0, rounded to cents |
| chargeDate | date (YYYY-MM-DD) | not in the future |
| type | `card` or `reimbursement` | |
| followUps | list of { at: date-time, channel: Teams / Text / Email / In person } | saved on each of the employee's open items |
| submittedOn | date or empty | empty means still open |

**Settings:** `deadlineDays` (default 30) and `autoApproveDays` (default 45, must be greater than `deadlineDays`).

**Calculated, not stored:** days since charge, days left, and status. The rules are at the top of [user-stories.md](user-stories.md).

## Decisions already made
- **Stack:** Next.js (TypeScript) with Tailwind, deployed to Vercel from the `app/` folder. Tests use Vitest.
- **Data stays in the browser for v1,** so nothing about real employees leaves the compliance specialist's computer, and there's no sign-in to build yet.
- **The tool writes the message; the compliance specialist sends it.** All three interviews say email gets overlooked or buried, but sending Teams messages or texts automatically needs company IT approval. Copy and paste is enough to test the riskiest assumption.
- **Group by employee** (Mockup B), so one reminder covers everything a person owes. Interview 1 describes following up with employees individually.
- **The rules live in `app/src/lib/expenses.ts`** as plain functions, so they can be tested separately from the screen.
- **Made-up sample data** ("Load sample data") for demos and usability tests. No real names or company data.

## Considered and rejected
- **Sending Teams messages or texts automatically:** needs IT approval, API keys, and cost. It isn't needed to test whether personal reminders work.
- **A table of individual charges (Mockup A):** one message per charge instead of one per person.
- **A one-at-a-time follow-up queue (Mockup C):** hides the overall picture of who's late, which Interview 3 says is the hard part.
- **Connecting to the company's expense platform:** no access, and it would bring in real data.

## Out of scope for v1
From the MVP scope in [requirements.md](../discovery/requirements.md):
- manager escalation messages (FR-5) and a manager view (FR-6)
- CSV import (FR-7)
- employee self-service and phone receipt upload (FR-8, FR-9)
- monthly on-time reporting (FR-10)
- automatic sending (FR-11)
- changing the platform's auto-approval rule (FR-12)

Also out: sign-in, more than one compliance specialist sharing data, and syncing across devices.

## Open questions
- What are the real submission deadline and auto-approval day at this company? 30 and 45 are placeholders, which is why they can be changed in Settings.
- Do employees respond better to Teams or to text? Interview 2 says email and calendar alerts get missed but doesn't say which channel works. The riskiest-assumption test should answer this.
- Should clicking Copy log the follow-up automatically? [flow.md](../design/flow.md) marks Log follow-up as the step to cut first.
- How long should the compliance specialist wait before following up again, and what happens if an employee submits only some of their items?
- How many days before auto-approval should managers be told (FR-5)? Interview 3 wants notice "before expenses reach automatic approval" but didn't give a number.
- How should the same employee typed two ways be matched (for example "E-1042" and "E1042")?
- Would the compliance specialist rather import the expense platform's overdue report than type items in?
