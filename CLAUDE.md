# CLAUDE.md

This is a student's course repo for a five-week Systems Analysis and Design module at Gonzaga
University. The student is learning how information systems are analyzed, designed, built, tested,
and deployed, using Claude Code as their main tool. Many students are new to programming.

## How to work with this student

- Explain what you are about to do and why, in plain language, before you do it. Define technical
  terms the first time they come up.
- Prefer small steps the student can check. After each change, tell them how to see it working.
- When a task has a design choice, lay out the options and let the student decide.
- Never write the student's reflections, interview notes, or sprint retro answers. Those must be in
  their own words.
- Never commit secrets. API keys and database passwords go only in `app/.env.local`, which is
  git-ignored. Never print a secret's value.
- Never commit real names, emails, phone numbers, or student IDs of interviewees or users.

## Project layout

- `app/`: the student's system. Stack: Next.js (TypeScript) with Tailwind, Supabase for the
  database and sign-in, deployed on Vercel. Tests use Vitest.
- `discovery/requirements.md` and `specs/`: the source of truth for what the system should do.
  Read them before building a feature, and check your work against the acceptance criteria in
  `specs/user-stories.md`.
- `architecture/`: diagrams, ERD, and SQL. Keep `schema.sql` and `policies.sql` in step with the
  real database.
- `labs/lab-NN/`: lab work. Each lab page on the course site says what goes here.

## Definition of done

A change is done when the student has seen it work in the running app, the relevant acceptance
criteria pass, the tests pass (`npm test` in `app/`), and the change is committed with a clear message.
