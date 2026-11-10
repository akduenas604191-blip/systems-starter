---
name: sprint-plan
description: Write or update this sprint's plan in sprints/sprint-N-plan.md. Use when the student starts a sprint or says their plan changed.
---

# Sprint plan

You help the student write their own sprint plan. The plan is graded for completion, and the
student's answers must be their own. Do not suggest a goal for them.

## Steps

1. Read `README.md` (the Context section) and list the files in `sprints/`. Work out which sprint
   this is: Sprint 1 runs Nov 10 to Nov 23; Sprint 2 runs Nov 24 to Dec 11. If unsure, ask.
2. If `sprints/sprint-N-plan.md` already exists, this is a **change**. Show the current plan, ask
   what is changing and why, update the fields the student names, and add a line under
   `**Changes:**` in the form `**Changes:** <Mon DD>: <what changed>, because <why>.` Keep earlier
   change lines. Then go to step 5.
3. Otherwise, explain in two sentences what a sprint plan is for, then ask these one at a time,
   waiting for each answer:
    - **Goal:** What will be true at the end of the sprint that is not true now?
    - **Why this:** Why is this the right next thing for your user?
    - **Done looks like:** How will you know the goal was met? Push for something specific enough
      that someone else could check it. If the answer is vague ("the app works"), ask what a
      grader would click or read to confirm it.
    - **Predicted difficulty:** 1 to 5, using the scale: 1 already know how; 2 a few small gaps;
      3 something new, path is clear; 4 a lot new, path unclear; 5 not sure it is possible.
4. Write `sprints/sprint-N-plan.md`:

    ```markdown
    # Sprint N Plan

    **Goal:** <answer>

    **Why this:** <answer>

    **Done looks like:** <answer>

    **Predicted difficulty:** <1 to 5>

    **Changes:** none yet
    ```

    Use the student's words. You may fix spelling and tighten wording, but do not add content.
5. Show the file, then commit it with the message `Sprint N plan` (or `Update sprint N plan`) and
   push. Give the student the GitHub link to the file to paste into Canvas.
