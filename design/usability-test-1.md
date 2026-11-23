# Usability test 1

> **How to run it (Lab 4, step 7):** use someone who hasn't seen the app. Read them the task below, not instructions. Ask them to think aloud, then stay silent while they work. Write what they *do* and *say*, not what you think they meant. Record roles only, never names (CLAUDE.md privacy rule).

| | |
|---|---|
| **Tester (role only, no name)** | |
| **Date** | |
| **Device and browser** | |
| **App version** (local `localhost:3000` or Vercel URL) | |
| **Start time / end time** | |

**Task given (read it word for word):** "You're the person who chases late expense reports. Load the sample data, find the employee you should contact first, send them a reminder, and record that you contacted them on Teams."

**What success looks like:** the tester loads the sample data, picks the employee card at the top, copies their reminder, and logs a follow-up with the channel set to Teams. The card then shows "Last contacted … via Teams".

---

## 1. Step by step

One row per step of the S2 happy path in [flow.md](flow.md). Fill in what you saw at each step.

| # | Step | Done? (yes / no / with help) | Hesitated? (where, about how long) | Notes |
|---|---|---|---|---|
| 0 | Load sample data | | | |
| 1 | See employees sorted by fewest days left | | | |
| 2 | Find the employee at the top of the list | | | |
| 3 | Click **Write reminder** | | | |
| 4 | Click **Copy** | | | |
| 5 | (Pretend to) paste into Teams and send | | | |
| 6 | Pick **Teams** and click **Log follow-up** | | | |

## 2. Where they hesitated

Any pause, scroll back, re-read, or "hmm". Note what was on screen at the time.

| Where on the page | What they were trying to do | What seemed to confuse them |
|---|---|---|
| | | |
| | | |
| | | |

## 3. What they said

Exact words in quotes. These are the evidence for your changes.

| Quote | At which step |
|---|---|
| "" | |
| "" | |
| "" | |

## 4. What they clicked that did nothing

Clicks on things that look clickable but aren't (labels, status badges, text), or clicks that did something different from what they expected.

| What they clicked | What they expected to happen | What actually happened |
|---|---|---|
| | | |
| | | |

## 5. Did they finish?

- **Finished the task:** yes / no / with help
- **If with help, what you told them:**
- **Clicks from "Write reminder" to "Copied"** (NFR-2 says 3 or fewer):
- **Did they log the follow-up with the right channel (Teams)?** yes / no
- **Time taken:**
- **Anything they did that wasn't part of the task:**

---

## 6. Top two changes

Choose from what you saw above. Each change should point to an observation and to the story it improves ([user-stories.md](../specs/user-stories.md)).

| # | Change | Evidence (section and row above) | Story / criteria | Effort (small / medium / large) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

## 7. Change I made

| | |
|---|---|
| **Which change (1 or 2)** | |
| **What I changed in the app** | |
| **Files changed** | |
| **Commit** | |
| **How to see it working** | |
| **Does it still pass `npm test`?** | |

**Why I picked this one first:**

**What I'd watch for in the next usability test:**
