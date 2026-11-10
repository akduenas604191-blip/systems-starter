"""A simple expense / budget tracker. Streamlit draws the page; expenses.json stores the data."""

import json
import os
import uuid
from datetime import date, timedelta
from pathlib import Path

import pandas as pd
import streamlit as st

# The "database": a JSON file next to this script, so it works no matter where you run it from.
DB_FILE = Path(__file__).parent / "expenses.json"

CATEGORIES = ["Food", "Drinks", "Groceries", "Transport", "Rent & Bills", "Fun", "School", "Other"]
DEFAULT_WEEKLY_BUDGET = 400.0


def load_data():
    """Read everything from the JSON file. Returns a fresh structure if the file doesn't exist yet."""
    if not DB_FILE.exists():
        return {"weekly_budget": DEFAULT_WEEKLY_BUDGET, "expenses": []}
    try:
        return json.loads(DB_FILE.read_text())
    except json.JSONDecodeError:
        st.error(f"{DB_FILE.name} is not valid JSON. Fix or delete it to start fresh.")
        st.stop()


def save_data(data):
    """Write to a temp file first, then swap it into place, so a crash never leaves a half-written file."""
    tmp = DB_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2))
    os.replace(tmp, DB_FILE)


def week_start(d):
    """Monday of the week that contains date d."""
    return d - timedelta(days=d.weekday())


# --- Actions: each one loads, changes, and saves ---

def add_expense():
    amount = st.session_state.amount
    if amount <= 0:
        st.session_state.form_error = "Amount must be more than $0."
        return
    data = load_data()
    data["expenses"].append({
        "id": uuid.uuid4().hex,
        "date": st.session_state.when.isoformat(),
        "amount": round(amount, 2),
        "category": st.session_state.category,
        "note": st.session_state.note.strip(),
    })
    save_data(data)
    st.session_state.form_error = None
    st.session_state.amount = 0.0  # clear the form
    st.session_state.note = ""


def delete_expense(expense_id):
    data = load_data()
    data["expenses"] = [e for e in data["expenses"] if e["id"] != expense_id]
    save_data(data)


def set_budget():
    data = load_data()
    data["weekly_budget"] = st.session_state.budget
    save_data(data)


# --- The page ---

st.title("💸 Budget Tracker")

data = load_data()
today = date.today()
this_week = week_start(today)

# Sidebar: the weekly budget setting
with st.sidebar:
    st.number_input(
        "Weekly budget ($)",
        min_value=0.0,
        step=10.0,
        value=float(data["weekly_budget"]),
        key="budget",
        on_change=set_budget,
    )

# Add-an-expense form
with st.form("add", clear_on_submit=False, border=True):
    st.subheader("Add an expense")
    c1, c2 = st.columns(2)
    c1.number_input("Amount ($)", min_value=0.0, step=1.0, format="%.2f", key="amount")
    c2.date_input("Date", value=today, max_value=today, key="when")
    c1.selectbox("Category", CATEGORIES, key="category")
    c2.text_input("Note (optional)", placeholder="e.g. lunch with Sam", key="note")
    st.form_submit_button("Add expense", on_click=add_expense, type="primary")

if st.session_state.get("form_error"):
    st.error(st.session_state.form_error)

expenses = data["expenses"]
if not expenses:
    st.info("No expenses yet. Add your first one above.")
    st.stop()

df = pd.DataFrame(expenses)
df["date"] = pd.to_datetime(df["date"]).dt.date
df["week"] = df["date"].apply(week_start)

# This week at a glance
budget = float(data["weekly_budget"])
spent = df.loc[df["week"] == this_week, "amount"].sum()
left = budget - spent

st.subheader(f"This week (since {this_week:%a %b %d})")
m1, m2, m3 = st.columns(3)
m1.metric("Spent", f"${spent:,.2f}")
m2.metric("Budget", f"${budget:,.2f}")
m3.metric("Left", f"{'-' if left < 0 else ''}${abs(left):,.2f}", delta="over budget" if left < 0 else None, delta_color="inverse")
if budget > 0:
    st.progress(min(spent / budget, 1.0))
if left < 0:
    st.warning(f"You're ${-left:,.2f} over this week's budget.")

# Charts
tab_cat, tab_week = st.tabs(["By category (this week)", "Weekly totals"])
with tab_cat:
    by_cat = df[df["week"] == this_week].groupby("category")["amount"].sum()
    if by_cat.empty:
        st.caption("Nothing spent this week yet.")
    else:
        st.bar_chart(by_cat, horizontal=True, x_label="$", y_label="")
with tab_week:
    by_week = df.groupby("week")["amount"].sum().tail(8)
    by_week.index = [w.strftime("%b %d") for w in by_week.index]
    st.bar_chart(by_week, x_label="Week of", y_label="$")

# The list, newest first
st.subheader("All expenses")
for e in sorted(expenses, key=lambda e: e["date"], reverse=True):
    text_col, delete_col = st.columns([0.9, 0.1])
    note = f" — {e['note']}" if e["note"] else ""
    text_col.write(f"**${e['amount']:,.2f}** · {e['category']} · {e['date']}{note}")
    delete_col.button(
        "🗑️",
        key=f"delete_{e['id']}",
        on_click=delete_expense,
        args=(e["id"],),
        help="Delete this expense",
    )
