# Process flow: S2, write a personal reminder

**Why this story:** S2 ([user-stories.md](../specs/user-stories.md)) is the core of the system. All three interviews say email reminders get overlooked or buried, and the riskiest assumption is that a personal Teams message or text works better. The flow starts at the list from S1 and ends by logging the follow-up from S3, so it covers the whole task of chasing one late employee.

## The flow in words

**GOAL:** Get the most urgent late employee to submit their expense report before it auto-approves.

**ENTRY:** The compliance specialist opens the Expense Deadline Tracker.

**STEPS (happy path):**
1. Open the tracker and see employees sorted by fewest days left.
2. Find the employee at the top of the list.
3. Click **Write reminder**.
4. Click **Copy**.
5. Paste the message into Teams or a text and send it.
6. Pick the channel and click **Log follow-up**.

**DECISIONS:**
- Are there any open items? If not, the empty state appears.
- Is an item past auto-approval? If so, the reminder says "past the auto-approval date" instead of giving days left.
- Are any items reimbursements? If so, the reminder adds a line saying the employee won't be paid back until they submit.
- Send it now, or cancel?
- Did copying work? If not, an error message appears and the specialist copies the text by hand.
- Did the employee submit?
- If not, are there days left before auto-approval?

**EXITS:**
- **Success:** the employee submits, the specialist marks the items Submitted, and they leave the open list.
- **Cancel:** the specialist clicks **Hide reminder** without sending.
- **Error:** copying fails, so the specialist copies by hand and continues. This doesn't end the task.
- **Giving up:** the deadline passes with no report. The item shows **Past auto-approval**, and the specialist notes it for audit.
- **Try again later:** days remain, so the employee stays on the list for another follow-up.

## Diagram

```mermaid
flowchart TD
    subgraph Specialist["Compliance specialist"]
        A(["Start: open the tracker"])
        A2["Add an item or load sample data"]
        C["Find the employee at the top of the list"]
        E["Click 'Write reminder'"]
        O{"Send it now?"}
        X1(["Exit, cancel: click 'Hide reminder'"])
        G["Click 'Copy'"]
        H2["Select the message and copy it by hand"]
        I["Paste into Teams or a text and send"]
        J["Pick the channel and click 'Log follow-up'"]
        K{"Did the employee submit?"}
        L["Mark the items 'Submitted'"]
        Z1(["Exit, success: employee leaves the open list"])
        M{"Any days left before auto-approval?"}
        Z2(["Exit, try again later: employee stays on the list"])
        N(["Exit, giving up: item shows 'Past auto-approval', note it for audit"])
    end

    subgraph Tracker["Tracker (the system)"]
        B{"Any open items?"}
        B0["Empty state: 'No open items. Add one above, or load sample data.'"]
        D["Show employees sorted by fewest days left, with status labels"]
        F1{"Is an item past auto-approval?"}
        F2["Write 'past the auto-approval date' for that item"]
        F3["Write the days left for that item"]
        F4{"Any reimbursement items?"}
        F5["Add 'You won't be paid back...' line"]
        F6["Show the message in a text box"]
        V{"Did copying work?"}
        V1["Show 'Copied'"]
        V2["Error: 'Couldn't copy. Select the text and copy it yourself.'"]
        W["Save date, time, and channel. Show 'Last contacted'"]
    end

    subgraph Employee["Employee"]
        P["Gets the Teams message or text"]
        Q{"Acts on it?"}
        R["Submits the report in the expense platform"]
        S["Ignores it"]
    end

    A --> B
    B -- No --> B0 --> A2 --> B
    B -- Yes --> D --> C --> E --> F1
    F1 -- Yes --> F2 --> F4
    F1 -- No --> F3 --> F4
    F4 -- Yes --> F5 --> F6
    F4 -- No --> F6
    F6 --> O
    O -- No --> X1
    O -- Yes --> G --> V
    V -- Yes --> V1 --> I
    V -- No --> V2 --> H2 --> I
    I --> P --> Q
    Q -- Yes --> R
    Q -- No --> S
    I --> J --> W --> K
    R -.-> K
    S -.-> K
    K -- Yes --> L --> Z1
    K -- No --> M
    M -- Yes --> Z2
    M -- No --> N

    classDef success fill:#d1fae5,stroke:#065f46,color:#065f46
    classDef exit fill:#f4f4f5,stroke:#71717a,color:#3f3f46
    classDef error fill:#fee2e2,stroke:#991b1b,color:#991b1b
    class Z1 success
    class X1,Z2,N exit
    class B0,V2 error
```

Green is the success exit, gray marks the other exits, and red marks the error and empty states. Dotted lines show the specialist checking the expense platform to see whether the employee submitted.

## What the flow shows

- **Six steps on the happy path**, which is right at the limit. The step to cut first is **6, Log follow-up**: the tracker could log it automatically when the specialist clicks Copy, using the channel already picked. That would make it five steps.
- **Every exit leads somewhere useful.** Cancel returns to the list, a copy error still lets the message be sent, and "try again later" keeps the employee at the top of the list.
- **Questions it raises:**
  - How long should the specialist wait before following up again?
  - Should the manager be told at the "giving up" point, before auto-approval (FR-5, Interview 3)?
  - What if the employee submits only some of their items?
