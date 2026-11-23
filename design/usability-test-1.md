# Usability test 1

> **How to run it (Lab 4, step 7):** use someone who hasn't seen the app. Read them the task below, not instructions. Ask them to think aloud, then stay silent while they work. Write what they *do* and *say*, not what you think they meant. Record roles only, never names (CLAUDE.md privacy rule).

| | |
|---|---|
| **Tester (role only, no name)** |financial assistant|
| **Date** |11/23/26|
| **Device and browser** |mac, safari |
| **App version** (local `localhost:3000` or Vercel URL) | |
| **Start time / end time** |11:20/11:25 |

**Task given (read it word for word):** "You're the person who chases late expense reports. Load the sample data, find the employee you should contact first, send them a reminder, and record that you contacted them on Teams."

**What success looks like:** the tester loads the sample data, picks the employee card at the top, copies their reminder, and logs a follow-up with the channel set to Teams. The card then shows "Last contacted … via Teams".

---

## 1. Step by step

One row per step of the S2 happy path in [flow.md](flow.md). Fill in what you saw at each step.

| # | Step | Done? (yes / no / with help) | Hesitated? (where, about how long) | Notes |
|---|---|---|---|---|
| 0 | Load sample data | got it | | |
| 1 | See employees sorted by fewest days left | yes | | |
| 2 | Find the employee at the top of the list | yes | | |
| 3 | Click **Write reminder** | yes | | |
| 4 | Click **Copy** | yes | | |
| 5 | (Pretend to) paste into Teams and send | yes | | |
| 6 | Pick **Teams** and click **Log follow-up** | yes | | |

## 2. Where they hesitated

Any pause, scroll back, re-read, or "hmm". Note what was on screen at the time.
the merchant section

| Where on the page | What they were trying to do | What seemed to confuse them |
|---|---|---|
| | Trying to change the auto-approve date, but to stay in compliance that shouldnt change | |


## 3. What they said

Exact words in quotes. These are the evidence for your changes.

| Quote | At which step |
|---|---|
| "why is there multiple options for auto approve dates. those need to be consistent" | |

## 4. What they clicked that did nothing

nothing, everything they clicked on worked

| What they clicked | What they expected to happen | What actually happened |
|---|---|---|
| tried to click on merchants expecting a dropdown menu to select | | |

## 5. Did they finish?

- **Finished the task:** Yes
- **If with help, what you told them:**
- **Clicks from "Write reminder" to "Copied":** 4
- **Did they log the follow-up with the right channel (Teams)?** yes
- **Time taken:** 5 mins
- **Anything they did that wasn't part of the task:** N/A

---

## 6. Top two changes

Choose from what you saw above. Each change should point to an observation and to the story it improves ([user-stories.md](../specs/user-stories.md)).
Change the auto approve days to stay at 1 selection.

| # | Change | Evidence (section and row above) | Story / criteria | Effort (small / medium / large) |
|---|---|---|---|---|
| 1 | out of compliance if we auto approve different expenses after they expire | | | |
| 2 | multiple options confuse employees that dont know what they should select | | | |

## 7. Change I made

Changed the auto approval to only be for 45 days

| | |
|---|---|
| **Which change (1 or 2)** | 1 |
| **What I changed in the app** | removed multiple options for auto approve date |
| **Files changed** | yes|
| **Commit** | yes|
| **How to see it working** | check the website|
| **Does it still pass `npm test`?** |yes |

**Why I picked this one first:**
Because it was the most confusing to the user

**What I'd watch for in the next usability test:**
See if that streamlines the creation process.