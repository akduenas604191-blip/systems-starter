"use client";

import { useState } from "react";
import {
  filterProblems,
  STATUS_LABELS,
  STATUSES,
  type Problem,
  type ProblemStatus,
} from "@/lib/problems";

export default function ProblemList({ problems }: { problems: Problem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProblemStatus | "all">("all");
  const visible = filterProblems(problems, { query, status });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium">Search by title</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. printer"
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ProblemStatus | "all")}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="all">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-zinc-500" aria-live="polite">
        Showing {visible.length} of {problems.length} problems
      </p>

      {visible.length === 0 ? (
        <p>No problems match your filters.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((problem) => (
            <li
              key={problem.id}
              className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <span>{problem.title}</span>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {STATUS_LABELS[problem.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
