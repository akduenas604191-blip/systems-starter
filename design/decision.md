# Design decision: v1 main screen

> **Draft for you to confirm.** Picking the design is your call. Open the three mockups in a browser, and change this if you'd rather go another way.

## The three options

| Mockup | Layout and flow | Main trade-off |
|---|---|---|
| [A: Urgency table](mockups/a-urgency-table.html) | One flat table of every charge, most urgent first. Remind and Submitted buttons on each row | Easy to scan, but one reminder per *charge*, so an employee with two late charges gets two messages |
| [B: Employee cards](mockups/b-employee-cards.html) | One card per employee, most urgent employee first. One "Write reminder" covers everything they owe | One message per *person*, but slightly longer to scan than a table |
| [C: Follow-up queue](mockups/c-follow-up-queue.html) | One employee at a time with a progress bar. Copy, pick channel, then "Done, next employee" | Nobody gets skipped, but the full list is hidden |

## Chosen: Mockup B (employee cards), with Mockup A's urgency sorting and status labels

- **Follow-ups are about people, not charges.** In Interview 1 the compliance specialist describes having to "reach out to them individually and sometimes follow up multiple times." Mockup B writes one reminder per employee that lists every open item, which is what the S2 flow in [flow.md](flow.md) needs. Mockup A would send a separate message for each charge.
- **The overview matters.** In Interview 3 the manager's hardest part was "not having enough visibility into which employees had outstanding expense reports." Mockup C hides everyone except the current employee, so it was rejected. Mockup B keeps the whole list on one screen.
- **Taken from Mockup A:** the most-urgent-first order and the colored status labels (On track, Overdue, Urgent, Past auto-approval), so the specialist can see at a glance who is closest to auto-approval.
- **Kept in mind from Mockup C:** the "Pick the channel, then log it" step. The flow marks Log follow-up as the step to cut first, by logging automatically on Copy, as C's single-screen sequence suggests.

## Checked against two of Nielsen's heuristics

1. **Visibility of system status.** *Does the design always tell people what is going on, with timely feedback?* Every item shows days left and a status label. Each employee shows "Last contacted … via …" or "Not contacted yet". Clicking Copy shows "Copied". The specialist never has to work out where things stand. **Passes.**
2. **Error prevention.** *Does the design stop errors before they happen?* The add form refuses missing fields, amounts of 0 or less, and future dates, and says which field is wrong. Settings refuse an auto-approval day that isn't after the deadline. Delete asks "Delete this item?" first, and "Submitted" can be undone. **Mostly passes.** One gap: the same employee typed two ways ("E-1042" and "E1042") shows up as two cards. That's an open question in [v1-spec.md](../specs/v1-spec.md).
