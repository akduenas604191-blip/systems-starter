import { describe, expect, it } from "vitest";
import {
  filterProblems,
  filterProblemsByStatus,
  filterProblemsByTitle,
  type Problem,
} from "./problems";

const problems: Problem[] = [
  { id: 1, title: "Printer jammed", status: "open" },
  { id: 2, title: "Wi-Fi drops", status: "in_progress" },
  { id: 3, title: "Library printer out of toner", status: "solved" },
];

describe("filterProblemsByTitle", () => {
  it("returns every problem when the search is empty", () => {
    expect(filterProblemsByTitle(problems, "")).toEqual(problems);
  });

  it("treats a search of only spaces as empty", () => {
    expect(filterProblemsByTitle(problems, "   ")).toEqual(problems);
  });

  it("matches part of a title, ignoring upper/lower case", () => {
    const ids = filterProblemsByTitle(problems, "PRINTER").map((p) => p.id);
    expect(ids).toEqual([1, 3]);
  });

  it("ignores spaces around the search text", () => {
    const ids = filterProblemsByTitle(problems, "  wi-fi ").map((p) => p.id);
    expect(ids).toEqual([2]);
  });

  it("returns nothing when no title matches", () => {
    expect(filterProblemsByTitle(problems, "projector")).toEqual([]);
  });
});

describe("filterProblemsByStatus", () => {
  it('returns every problem for "all"', () => {
    expect(filterProblemsByStatus(problems, "all")).toEqual(problems);
  });

  it.each([
    ["open", [1]],
    ["in_progress", [2]],
    ["solved", [3]],
  ] as const)("returns only %s problems", (status, expectedIds) => {
    const ids = filterProblemsByStatus(problems, status).map((p) => p.id);
    expect(ids).toEqual(expectedIds);
  });
});

describe("filterProblems", () => {
  it("keeps only problems that match both the title and the status", () => {
    const ids = filterProblems(problems, { query: "printer", status: "solved" }).map((p) => p.id);
    expect(ids).toEqual([3]);
  });

  it("returns everything when the search is empty and the status is all", () => {
    expect(filterProblems(problems, { query: "", status: "all" })).toEqual(problems);
  });

  it("returns nothing when the title matches but the status does not", () => {
    expect(filterProblems(problems, { query: "wi-fi", status: "solved" })).toEqual([]);
  });
});
