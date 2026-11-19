# Design decision: v1 layout

> **Draft for you to confirm.** Picking the design is your call. Check the three mockups and change this if you'd rather go another way.

**Chosen: Mockup B (employee cards), with Mockup A's urgency sorting.**

Interview 1 describes chasing *people*: "I have to individually reach out." So the screen groups items by employee and writes one reminder that covers everything a person owes. Mockup A's per-charge table would mean two messages for someone with two late charges. From Mockup A, B keeps the most-urgent-first order and the colored status labels, so the coordinator can still see at a glance who's closest to auto-approval. Mockup C's one-at-a-time queue was rejected for v1 because it hides the full list. The coordinator would lose the overview of who's late, which is the thing they track by hand today.

## Checked against two of Nielsen's usability heuristics

1. **Visibility of system status.** Every item shows days left and a status label (On track, Overdue, Urgent, Past auto-approval). Each employee shows "Last contacted … via …" or "Not contacted yet". Copying shows "Copied". The coordinator never has to remember or work out where things stand. **Passes.**
2. **Error prevention.** The add form refuses missing fields, amounts of 0 or less, and future dates, and names the problem. Settings refuse an auto-approval day that isn't after the deadline. Delete asks "Delete this item?" first, and "Submitted" can be undone. **Passes.** One weakness: the same employee typed two ways ("E-1042" vs "E1042") becomes two cards. Matching ignores capital letters and extra spaces at the ends, but not dashes. That's an open question for v2.
