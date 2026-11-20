# Expense Deadline Tracker v1, spec

## Intent
A tool for the person who handles expense report compliance (the coordinator). It shows every open expense item sorted by how close it is to the expense platform's auto-approval date, writes a personal reminder for each late employee to send on Teams or by text instead of email, and records who has been contacted and when. The job: keep reports from being auto-approved around the compliance controls, without the coordinator writing and tracking every follow-up by hand. Requirements and sources: [discovery/requirements.md](../discovery/requirements.md).

## Stories and acceptance criteria
See [user-stories.md](user-stories.md):
- **S1 (FR-1, FR-2):** add open items and see them sorted by days left before auto-approval, with a status label.
- **S2 (FR-3):** write and copy a personal reminder listing everything an employee still owes.
- **S3 (FR-4):** log follow-ups, mark items submitted (with undo), and delete with confirmation.

## Screens and flow
- Flow: [design/flow.md](../design/flow.md)
- Chosen mockup: [design/mockups/b-employee-cards.html](../design/mockups/b-employee-cards.html), with sorting from Mockup A. The reasons are in [design/decision.md](../design/decision.md).

One page, top to bottom:
1. **Settings** (collapsed): report due day and auto-approval day.
2. **Add an open item** form.
3. **Open items**: one card per employee, most urgent first. Each card has Write reminder, a channel picker, and Log follow-up. Each item has a status label, Submitted, and Delete.
4. **Submitted**: items marked submitted, each with Undo.

## Data
Stored in the browser's localStorage under the key `expense-deadline-tracker-v1`. No server and no database in v1. A real database comes in Lab 6.

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

**Settings**: `deadlineDays` (default 30) and `autoApproveDays` (default 45, must be greater than `deadlineDays`).

**Calculated, not stored**: days since charge, days left, and status. The rules are at the top of `user-stories.md`.

## Decisions already made
- **Stack:** Next.js with TypeScript and Tailwind, deployed to Vercel from the `app/` folder (course standard). Tests use Vitest.
- **Data in the browser for v1**, so nothing about real employees leaves the coordinator's computer, and there's no login to build yet.
- **The tool writes the message; the coordinator sends it.** Interview 1 says email doesn't work, but automatic Teams or text sending needs company IT approval. Copy-and-paste tests the riskiest assumption without that.
- **Group by employee**, so one reminder covers all of a person's late items.
- **The rules live in `app/src/lib/expenses.ts`** as plain functions, so they can be tested apart from the screen.
- **Made-up sample data** ("Load sample data") for demos and usability tests.

## Considered and rejected
- **Automatic Teams/SMS sending:** needs IT approval, API keys, and cost. It's not needed to test whether personal reminders work.
- **A table of individual charges (Mockup A):** leads to one message per charge instead of one per person.
- **A one-at-a-time queue (Mockup C):** hides the overall picture of who's late.
- **Connecting to the company's expense platform:** no access, and it would use real data.

## Out of scope for v1
From the MVP scope: manager escalation messages (FR-5) and a manager view (FR-6), CSV import (FR-7), employee self-service and phone receipt upload (FR-8, FR-9), monthly on-time reporting (FR-10), automatic sending (FR-11), and changing the platform's auto-approval rule (FR-12). Also out: sign-in, multiple coordinators sharing data, and syncing across devices.

## Open questions
- What are the real submission deadline and auto-approval day at this company? 30 and 45 are placeholders, which is why they can be changed in Settings.
- Do employees respond better to Teams or to text? Interview 2 says email and calendar alerts get missed but doesn't say which channel works. The riskiest-assumption test should answer this.
- How many days before auto-approval should managers be told (FR-5)? Interview 3 wants notice "before expenses reach automatic approval" but didn't give a number.
- How should the same employee typed two ways be matched (for example "E-1042" vs "E1042")?
- Would the coordinator rather import the expense platform's overdue report than type items in?
