# Antonio Duenas: Systems Analysis and Design project

## Context

- **My user:** the person who handles employee expense report compliance in the finance team at my workplace (a mid-size company, not named here)
- **Their problem:** employees often miss expense report deadlines, so reports auto-approve and skip every compliance check. The system's reminder emails and personal follow-up emails get ignored, chasing people one by one takes a lot of time, and employees who are owed reimbursements lose that money.
- **The system:** a tracker that lists open expense items by how close they are to auto-approval, writes a personal reminder to send on Teams or by text, and records who has been contacted.
- **Working alone or in a pair:** *(fill in)*
- **Data:** the app uses made-up sample data and employee IDs only. No real names or company data are committed.

## Where the work lives

| What | Link |
|---|---|
| Live app | *(paste your Vercel URL here after deploying)* |
| Requirements | [discovery/requirements.md](discovery/requirements.md) |
| v1 spec | [specs/v1-spec.md](specs/v1-spec.md) |
| User stories | [specs/user-stories.md](specs/user-stories.md) |
| Process flow | [design/flow.md](design/flow.md) |
| Interviews | [discovery/](discovery/) |
| Architecture diagram | [architecture/diagram.md](architecture/diagram.md) |
| Data model | [architecture/erd.md](architecture/erd.md) |
| AI feature eval | [specs/ai-eval-results.md](specs/ai-eval-results.md) |

## Folders

| Folder | What goes in it |
|---|---|
| `labs/` | One folder per lab: `lab-01/` to `lab-08/` |
| `sprints/` | Sprint plans and reviews, written by `/sprint-plan` and `/sprint-review` |
| `discovery/` | Interview notes (names removed) and `requirements.md` |
| `design/` | Flows, mockups, design decisions, usability test notes |
| `specs/` | User stories, feature specs, task lists, AI evals |
| `architecture/` | Architecture diagrams, ERD, SQL schema and policies |
| `app/` | The code for your system |
| `peer-review/` | Your peer code review of a classmate's system |
