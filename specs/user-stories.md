# User stories: Expense Deadline Tracker v1

Source: the Must requirements in [discovery/requirements.md](../discovery/requirements.md).
Acceptance criteria use the EARS pattern ("WHEN… THE SYSTEM SHALL…"). Each one can be checked with yes or no.

**Terms used below**
- **Days since charge** = today's date minus the item's charge date, in whole days.
- **Days left** = auto-approval day (setting, default 45) minus days since charge.
- **Status:** *Past auto-approval* if days left ≤ 0. Otherwise *Urgent* if days left ≤ 5. Otherwise *Overdue* if days since charge ≥ the submission deadline (setting, default 30). Otherwise *On track*.

---

## S1 (FR-1, FR-2): See who to chase first

As the **expense compliance coordinator**, I want **to add open expense items and see them sorted by how close they are to auto-approval** so that **I chase the most urgent people first**.

**Acceptance criteria**
1. WHEN the coordinator submits the add-item form with an employee, merchant, amount, and charge date, THE SYSTEM SHALL add the item to the open list.
2. WHEN the open list is shown, THE SYSTEM SHALL group items by employee, list the employee with the fewest days left first, and sort each employee's items by fewest days left first.
3. THE SYSTEM SHALL show each item's days left and a status label (On track, Overdue, Urgent, or Past auto-approval) using the rules above.
4. WHEN the coordinator changes the submission deadline or auto-approval day in Settings, THE SYSTEM SHALL recalculate days left and status for every item.
5. WHEN the page is reloaded, THE SYSTEM SHALL still show every item and setting entered before.
6. IF the employee, merchant, or charge date is empty, or the amount is not a number greater than 0, THE SYSTEM SHALL show an error naming the field and SHALL NOT save the item.
7. IF the charge date is in the future, THE SYSTEM SHALL show "Charge date can't be in the future" and SHALL NOT save the item.
8. IF the auto-approval day entered in Settings is not greater than the submission deadline, THE SYSTEM SHALL show an error and keep the previous settings.
9. IF there are no open items, THE SYSTEM SHALL show "No open items. Add one above, or load sample data."

## S2 (FR-3): Write a personal reminder

As the **expense compliance coordinator**, I want **a ready-to-send reminder listing everything an employee still owes** so that **I can paste it into Teams or a text instead of writing each follow-up from scratch**.

**Acceptance criteria**
1. WHEN the coordinator clicks "Write reminder" for an employee, THE SYSTEM SHALL show a message that names the employee and lists each of their open items with merchant, amount, charge date, and days left.
2. WHEN any of that employee's open items is a reimbursement, THE SYSTEM SHALL add the line "You won't be paid back for the reimbursement items until the report is submitted."
3. WHEN an item in the reminder is past auto-approval, THE SYSTEM SHALL describe it as "past the auto-approval date" instead of giving days left.
4. WHEN the coordinator clicks "Copy", THE SYSTEM SHALL copy the message to the clipboard and show "Copied".
5. IF copying to the clipboard fails, THE SYSTEM SHALL show "Couldn't copy. Select the text and copy it yourself." and leave the message on screen.
6. THE SYSTEM SHALL let the coordinator write and copy a reminder in 3 clicks or fewer (NFR-2).

## S3 (FR-4): Log follow-ups and close items

As the **expense compliance coordinator**, I want **to record each follow-up and mark items submitted** so that **I know who I've already contacted and stop chasing people who are done**.

**Acceptance criteria**
1. WHEN the coordinator logs a follow-up for an employee and picks a channel (Teams, Text, Email, or In person), THE SYSTEM SHALL save the date, time, and channel on each of that employee's open items.
2. THE SYSTEM SHALL show each employee's most recent follow-up as "Last contacted <date> via <channel>" and the number of follow-ups so far.
3. IF an employee has never been followed up, THE SYSTEM SHALL show "Not contacted yet".
4. WHEN the coordinator marks an item "Submitted", THE SYSTEM SHALL remove it from the open list and show it in a Submitted list with the date it was marked.
5. WHEN the coordinator clicks "Undo" on a submitted item, THE SYSTEM SHALL move it back to the open list with its follow-up history unchanged.
6. WHEN the coordinator clicks "Delete" on an item, THE SYSTEM SHALL ask "Delete this item?" and remove it only after the coordinator confirms.
7. IF the coordinator cancels the delete, THE SYSTEM SHALL keep the item unchanged.
