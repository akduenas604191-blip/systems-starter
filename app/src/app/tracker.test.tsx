import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Tracker from "./tracker";

const TODAY = "2026-11-20";

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  // Remove any fake clipboard a test added.
  Reflect.deleteProperty(navigator, "clipboard");
});

function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", { value, configurable: true });
}

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

async function addItem(employee = "E-7", merchant = "Harbor Hotel", chargeDate = "2026-10-09") {
  fill("Employee (initials or ID)", employee);
  fill("Merchant", merchant);
  fill("Amount ($)", "412.80");
  fill("Charge date", chargeDate);
  fireEvent.click(screen.getByRole("button", { name: "Add item" }));
  await screen.findByText(`${merchant} · $412.80`);
}

describe("Tracker", () => {
  it("shows the empty state, and sample data fills the list (S1 criterion 9)", async () => {
    render(<Tracker today={TODAY} />);
    expect(await screen.findByText("No open items. Add one above, or load sample data.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Load sample data" }));
    expect(screen.getByText("6 open items, 4 employees")).toBeTruthy();
  });

  it("names missing fields and does not save (S1 criterion 6)", async () => {
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(screen.getByText("Employee is required.")).toBeTruthy();
    expect(screen.getByText("Merchant is required.")).toBeTruthy();
    expect(screen.getByText("0 open items, 0 employees")).toBeTruthy();
  });

  it("adds an item with its days left and status, and keeps it after a reload (S1)", async () => {
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    await addItem();
    expect(screen.getByText(/3 days left/)).toBeTruthy();
    expect(screen.getByText("Urgent")).toBeTruthy();

    cleanup();
    render(<Tracker today={TODAY} />);
    expect(await screen.findByText("Harbor Hotel · $412.80")).toBeTruthy();
  });

  it("locks the auto-approval day at 45, even if an older save says otherwise", async () => {
    window.localStorage.setItem(
      "expense-deadline-tracker-v1",
      JSON.stringify({ items: [], settings: { deadlineDays: 20, autoApproveDays: 60 } }),
    );
    render(<Tracker today={TODAY} />);
    expect(await screen.findByText("Settings: report due day 20, auto-approves day 45")).toBeTruthy();
    const field = screen.getByLabelText(/Auto-approves/) as HTMLInputElement;
    expect(field.readOnly).toBe(true);
    expect(field.value).toBe("45");
  });

  it("rejects a report due day of 45 or more and keeps the old settings (S1 criterion 8)", async () => {
    render(<Tracker today={TODAY} />);
    await screen.findByText("Settings: report due day 30, auto-approves day 45");
    fireEvent.change(screen.getByLabelText(/Report due/), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: "Save settings" }));
    expect(screen.getByRole("alert").textContent).toBe("Report due day must be less than the auto-approval day (45).");
    expect(screen.getByText("Settings: report due day 30, auto-approves day 45")).toBeTruthy();
  });

  it("writes a reminder and reports a failed copy (S2 criteria 1 and 5)", async () => {
    setClipboard(undefined);
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    await addItem();
    fireEvent.click(screen.getByRole("button", { name: "Write reminder" }));
    const box = screen.getByLabelText("Reminder message") as HTMLTextAreaElement;
    expect(box.value).toContain("Hi E-7, you have 1 open expense item");
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(
      await screen.findByText("Couldn't copy. Select the text and copy it yourself."),
    ).toBeTruthy();
  });

  it("shows Copied when the clipboard works (S2 criterion 4)", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    await addItem();
    fireEvent.click(screen.getByRole("button", { name: "Write reminder" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByText("Copied")).toBeTruthy();
    expect(writeText).toHaveBeenCalledOnce();
  });

  it("logs a follow-up (S3 criteria 1–3)", async () => {
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    await addItem();
    expect(screen.getByText("Not contacted yet")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Channel"), { target: { value: "Text" } });
    fireEvent.click(screen.getByRole("button", { name: "Log follow-up" }));
    expect(screen.getByText(/Last contacted .* via Text · 1 follow-up$/)).toBeTruthy();
  });

  it("marks an item submitted and undoes it (S3 criteria 4–5)", async () => {
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    await addItem();
    fireEvent.click(screen.getByRole("button", { name: "Submitted" }));
    expect(screen.getByText("E-7: Harbor Hotel, $412.80. Submitted Nov 20")).toBeTruthy();
    expect(screen.getByText("0 open items, 0 employees")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByText("1 open item, 1 employee")).toBeTruthy();
  });

  it("asks before deleting, and Cancel keeps the item (S3 criteria 6–7)", async () => {
    render(<Tracker today={TODAY} />);
    await screen.findByText("Add an open item");
    await addItem();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Delete this item?")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Harbor Hotel · $412.80")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete" }));
    expect(screen.queryByText("Harbor Hotel · $412.80")).toBeNull();
  });
});
