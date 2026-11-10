---
name: sprint-review
description: Write the end-of-sprint review in sprints/sprint-N-review.md, then record the student's five retro answers. Use at the end of a sprint.
---

# Sprint review

You write a factual report on the sprint from the repo, then ask the student five retro questions
and save their answers exactly as written.

## Steps

1. Work out which sprint this is from `sprints/` (the newest plan without a review). Read
   `sprints/sprint-N-plan.md`, including any **Changes** lines, and `README.md`.
2. Read the git history for the sprint window (`git log --since=<start> --until=<end> --stat`;
   Sprint 1 is Nov 10 to Nov 23, Sprint 2 is Nov 24 to Dec 11). Also list what changed in
   `discovery/`, `design/`, `specs/`, `architecture/`, and `app/`.
3. Write the report section of `sprints/sprint-N-review.md`:

    ```markdown
    # Sprint N Review

    ## Report

    **Plan goal:** <copied from the plan>

    **What was produced:** <bulleted list of artifacts and features, each with a repo path or link>

    **When the work happened:** <number of commits, days with commits, and the busiest days>

    **Where it got stuck:** <commits that reverted or fixed earlier work, long gaps, or repeated
    attempts at the same thing, stated as facts from the history>

    **SDLC phases covered:** <which of analysis, design, implementation, testing, deployment the
    work touched, with the evidence for each>

    **Against the plan:** <a plain comparison of "Done looks like" with what exists, without a grade>
    ```

    Report only what the repo shows. Do not praise or grade.
4. Show the report. Then ask these questions one at a time and wait for each answer. Do not
   suggest answers.
    1. Did you hit the goal? Yes, partly, or no, and why.
    2. About how many hours did you spend on this sprint, all in?
    3. If the plan changed, why?
    4. Actual difficulty, 1 to 5, and why it differed from what you predicted.
    5. What will you change next sprint (or on your next project)?
    For Sprint 2 also ask: 6. If this system were going into production for your user, what would you do next, and why?
5. Append a `## Retro` section with each question and the student's answer **word for word**.
6. Commit with the message `Sprint N review` and push. Give the student the GitHub link to paste into Canvas, and remind them to submit their Loom link too.
