import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import ProblemList from "./problem-list";
import type { Problem } from "@/lib/problems";

const problems: Problem[] = [
  { id: 1, title: "Printer jammed", status: "open" },
  { id: 2, title: "Wi-Fi drops", status: "in_progress" },
  { id: 3, title: "Library printer out of toner", status: "solved" },
];

afterEach(cleanup);

function typeSearch(text: string) {
  fireEvent.change(screen.getByLabelText("Search by title"), { target: { value: text } });
}

function pickStatus(value: string) {
  fireEvent.change(screen.getByLabelText("Status"), { target: { value } });
}

describe("ProblemList", () => {
  it("shows all problems before anything is chosen", () => {
    render(<ProblemList problems={problems} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("filters the list as the user types", () => {
    render(<ProblemList problems={problems} />);
    typeSearch("wi-fi");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText("Wi-Fi drops")).toBeTruthy();
    expect(screen.getByText("Showing 1 of 3 problems")).toBeTruthy();
  });

  it("filters the list by status from the dropdown", () => {
    render(<ProblemList problems={problems} />);
    pickStatus("solved");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText("Library printer out of toner")).toBeTruthy();
  });

  it("applies the title search and the status together", () => {
    render(<ProblemList problems={problems} />);
    typeSearch("printer");
    pickStatus("open");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText("Printer jammed")).toBeTruthy();
  });

  it("shows each problem's status label", () => {
    render(<ProblemList problems={problems} />);
    const [first, second, third] = screen.getAllByRole("listitem");
    expect(within(first).getByText("Open")).toBeTruthy();
    expect(within(second).getByText("In progress")).toBeTruthy();
    expect(within(third).getByText("Solved")).toBeTruthy();
  });

  it("shows a message when nothing matches", () => {
    render(<ProblemList problems={problems} />);
    typeSearch("wi-fi");
    pickStatus("solved");

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByText("No problems match your filters.")).toBeTruthy();
  });
});
