# Process flow: Expense Deadline Tracker v1

Swimlanes for the coordinator, the system, and the employee. The flow covers every decision point and the error and empty states, as well as the normal path.

```mermaid
flowchart TD
    subgraph Coordinator
        A([Open the tracker]) --> B{Any open items?}
        B -- No --> B1[See empty state: add an item or load sample data]
        B1 --> C[Fill in add-item form]
        B -- Yes --> D[Look at list sorted by days left]
        C --> V{Form valid?}
        V -- No --> V1[See error naming the field] --> C
        V -- Yes --> D
        D --> E[Pick most urgent employee]
        E --> F[Click Write reminder]
        F --> G[Click Copy]
        G --> H{Copied?}
        H -- No --> H1[See 'Couldn't copy', select text by hand] --> I
        H -- Yes --> I[Paste into Teams or a text and send]
        I --> J[Log follow-up with channel]
        R --> S{Employee submitted the report?}
        S -- Yes --> T[Mark item Submitted]
        T --> T1{Marked by mistake?}
        T1 -- Yes --> T2[Click Undo] --> D
        T1 -- No --> Z([Item closed])
        S -- No --> U{Days left > 0?}
        U -- Yes --> D
        U -- No --> W[Item shows Past auto-approval: note it for audit]
        W --> Z
    end

    subgraph System
        V2[Validate employee, merchant, amount, date] -.-> V
        K[Calculate days left and status from charge date and settings] -.-> D
        L[Build reminder text from the employee's open items] -.-> F
        M[Save follow-up date, time, channel to browser storage] -.-> J
        J --> M2[Show 'Last contacted' and follow-up count]
    end

    subgraph Employee
        N[Gets the Teams message or text] --> O{Acts on it?}
        O -- Yes --> P[Submits report in the expense platform]
        O -- No --> Q[Ignores it]
        P --> R[Coordinator checks the expense platform]
        Q --> R
    end

    I --> N
    M2 --> R
```
