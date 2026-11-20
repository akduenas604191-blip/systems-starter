import { describe, expect, it } from "vitest";
import {
  buildReminder,
  DEFAULT_SETTINGS,
  deleteItem,
  groupOpenItems,
  logFollowUp,
  markSubmitted,
  REIMBURSEMENT_LINE,
  statusOf,
  daysLeft,
  undoSubmitted,
  validateNewItem,
  validateSettings,
  type ExpenseItem,
} from "./expenses";

const TODAY = "2026-11-20";

function item(overrides: Partial<ExpenseItem>): ExpenseItem {
  return {
    id: "x",
    employee: "E-1",
    department: "Sales",
    merchant: "Hotel",
    amount: 100,
    chargeDate: "2026-11-01",
    type: "card",
    followUps: [],
    submittedOn: null,
    ...overrides,
  };
}

describe("days left and status (S1 criterion 3)", () => {
  it("counts days left from the charge date to the auto-approval day", () => {
    // charged 19 days ago, auto-approves at day 45 -> 26 days left
    expect(daysLeft(item({}), TODAY, DEFAULT_SETTINGS)).toBe(26);
  });

  it("labels each item using the status rules", () => {
    const at = (daysAgo: number) =>
      statusOf(item({ chargeDate: shift(daysAgo) }), TODAY, DEFAULT_SETTINGS);
    expect(at(10)).toBe("on_track");
    expect(at(30)).toBe("overdue"); // reached the 30-day deadline
    expect(at(39)).toBe("overdue"); // 6 days left
    expect(at(40)).toBe("urgent"); // 5 days left
    expect(at(44)).toBe("urgent"); // 1 day left
    expect(at(45)).toBe("past"); // 0 days left
    expect(at(60)).toBe("past");
  });

  it("recalculates when the settings change (S1 criterion 4)", () => {
    const i = item({ chargeDate: shift(20) });
    expect(statusOf(i, TODAY, DEFAULT_SETTINGS)).toBe("on_track");
    expect(statusOf(i, TODAY, { deadlineDays: 14, autoApproveDays: 21 })).toBe("urgent");
  });
});

describe("validateNewItem (S1 criteria 1, 6, 7)", () => {
  const good = {
    employee: " E-7 ",
    department: "Ops",
    merchant: "Taxi",
    amount: "25.5",
    chargeDate: "2026-11-18",
    type: "card" as const,
  };

  it("accepts a complete item and trims spaces", () => {
    const result = validateNewItem(good, TODAY);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.item.employee).toBe("E-7");
  });

  it("names every missing field", () => {
    const result = validateNewItem(
      { ...good, employee: "", merchant: " ", amount: "", chargeDate: "" },
      TODAY,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual([
        "Employee is required.",
        "Merchant is required.",
        "Amount must be a number greater than 0.",
        "Charge date is required.",
      ]);
    }
  });

  it("rejects zero, negative, and non-number amounts", () => {
    for (const amount of ["0", "-5", "abc"]) {
      expect(validateNewItem({ ...good, amount }, TODAY).ok).toBe(false);
    }
  });

  it("rejects a charge date in the future", () => {
    const result = validateNewItem({ ...good, chargeDate: "2026-11-21" }, TODAY);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toEqual(["Charge date can't be in the future."]);
  });
});

describe("validateSettings (S1 criterion 8)", () => {
  it("accepts an auto-approval day after the deadline", () => {
    expect(validateSettings(30, 45)).toBeNull();
  });

  it("rejects an auto-approval day that is not after the deadline", () => {
    expect(validateSettings(30, 30)).not.toBeNull();
    expect(validateSettings(30, 20)).not.toBeNull();
  });
});

describe("groupOpenItems (S1 criterion 2)", () => {
  const items = [
    item({ id: "a", employee: "E-1", chargeDate: shift(10) }),
    item({ id: "b", employee: "E-2", chargeDate: shift(44) }),
    item({ id: "c", employee: "e-1 ", chargeDate: shift(40) }),
    item({ id: "d", employee: "E-3", chargeDate: shift(50), submittedOn: TODAY }),
  ];

  it("groups by employee, most urgent first, and leaves out submitted items", () => {
    const groups = groupOpenItems(items, TODAY, DEFAULT_SETTINGS);
    expect(groups.map((g) => g.employee)).toEqual(["E-2", "e-1 "]);
    expect(groups[1].items.map((i) => i.id)).toEqual(["c", "a"]);
  });

  it("returns no groups when there are no open items (S1 criterion 9)", () => {
    expect(groupOpenItems([], TODAY, DEFAULT_SETTINGS)).toEqual([]);
  });
});

describe("buildReminder (S2)", () => {
  it("lists every open item with merchant, amount, date, and days left", () => {
    const [group] = groupOpenItems(
      [item({ merchant: "Harbor Hotel", amount: 412.8, chargeDate: shift(42) })],
      TODAY,
      DEFAULT_SETTINGS,
    );
    const text = buildReminder(group, TODAY, DEFAULT_SETTINGS);
    expect(text).toContain("Hi E-1, you have 1 open expense item that still needs a report:");
    expect(text).toContain("Harbor Hotel, $412.80, charged Oct 9: 3 days left before it auto-approves");
    expect(text).not.toContain(REIMBURSEMENT_LINE);
  });

  it("adds the reimbursement line and describes past items (criteria 2 and 3)", () => {
    const [group] = groupOpenItems(
      [
        item({ id: "a", type: "reimbursement", chargeDate: shift(5) }),
        item({ id: "b", merchant: "Rental car", chargeDate: shift(50) }),
      ],
      TODAY,
      DEFAULT_SETTINGS,
    );
    const text = buildReminder(group, TODAY, DEFAULT_SETTINGS);
    expect(text).toContain(REIMBURSEMENT_LINE);
    expect(text).toContain("Rental car, $100.00, charged Oct 1: past the auto-approval date");
  });
});

describe("follow-ups and closing items (S3)", () => {
  const items = [
    item({ id: "a", employee: "E-1" }),
    item({ id: "b", employee: "e-1" }),
    item({ id: "c", employee: "E-2" }),
  ];

  it("logs a follow-up on each of the employee's open items", () => {
    const after = logFollowUp(items, "E-1", "Teams", "2026-11-20T09:00:00.000Z");
    expect(after.find((i) => i.id === "a")!.followUps).toHaveLength(1);
    expect(after.find((i) => i.id === "b")!.followUps).toHaveLength(1);
    expect(after.find((i) => i.id === "c")!.followUps).toHaveLength(0);

    const [group] = groupOpenItems(after, TODAY, DEFAULT_SETTINGS).filter((g) => g.employee === "E-1");
    expect(group.lastFollowUp?.channel).toBe("Teams");
    expect(group.followUpCount).toBe(1);
  });

  it("marks an item submitted and undoes it, keeping its history", () => {
    const logged = logFollowUp(items, "E-2", "Text", "2026-11-20T09:00:00.000Z");
    const submitted = markSubmitted(logged, "c", TODAY);
    expect(submitted.find((i) => i.id === "c")!.submittedOn).toBe(TODAY);

    const undone = undoSubmitted(submitted, "c");
    const c = undone.find((i) => i.id === "c")!;
    expect(c.submittedOn).toBeNull();
    expect(c.followUps).toHaveLength(1);
  });

  it("deletes only the chosen item", () => {
    expect(deleteItem(items, "b").map((i) => i.id)).toEqual(["a", "c"]);
  });
});

// The date `daysAgo` days before TODAY.
function shift(daysAgo: number): string {
  const d = new Date(Date.UTC(2026, 10, 20 - daysAgo));
  return d.toISOString().slice(0, 10);
}
