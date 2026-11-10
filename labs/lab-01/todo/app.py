"""A simple to-do list app. Streamlit draws the page; todos.json stores the data."""

import json
import os
import uuid
from pathlib import Path

import streamlit as st

# The "database": a JSON file next to this script, so it works no matter where you run it from.
DB_FILE = Path(__file__).parent / "todos.json"


def load_todos():
    """Read all to-dos from the JSON file. Returns [] if the file doesn't exist yet."""
    if not DB_FILE.exists():
        return []
    try:
        return json.loads(DB_FILE.read_text())
    except json.JSONDecodeError:
        st.error(f"{DB_FILE.name} is not valid JSON. Fix or delete it to start fresh.")
        st.stop()


def save_todos(todos):
    """Write all to-dos to the JSON file.

    We write to a temporary file first, then swap it into place. If the app crashes
    mid-write, the old file is still intact instead of half-written.
    """
    tmp = DB_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(todos, indent=2))
    os.replace(tmp, DB_FILE)


# --- Actions: each one loads, changes, and saves ---

def add_todo():
    text = st.session_state.new_todo.strip()
    if text:
        todos = load_todos()
        todos.append({"id": uuid.uuid4().hex, "text": text, "done": False})
        save_todos(todos)
    st.session_state.new_todo = ""  # clear the input box


def toggle_todo(todo_id):
    todos = load_todos()
    for todo in todos:
        if todo["id"] == todo_id:
            todo["done"] = not todo["done"]
    save_todos(todos)


def delete_todo(todo_id):
    save_todos([t for t in load_todos() if t["id"] != todo_id])


def clear_completed():
    save_todos([t for t in load_todos() if not t["done"]])


# --- The page ---

st.title("✅ To-Do List")

st.text_input(
    "Add a task",
    key="new_todo",
    on_change=add_todo,
    placeholder="What needs doing? Press Enter to add.",
)

todos = load_todos()

if not todos:
    st.info("Nothing to do yet. Add your first task above.")
else:
    for todo in todos:
        check_col, delete_col = st.columns([0.9, 0.1])
        with check_col:
            label = f"~~{todo['text']}~~" if todo["done"] else todo["text"]
            st.checkbox(
                label,
                value=todo["done"],
                key=f"done_{todo['id']}",
                on_change=toggle_todo,
                args=(todo["id"],),
            )
        with delete_col:
            st.button(
                "🗑️",
                key=f"delete_{todo['id']}",
                on_click=delete_todo,
                args=(todo["id"],),
                help="Delete this task",
            )

    done_count = sum(t["done"] for t in todos)
    st.caption(f"{done_count} of {len(todos)} done")
    if done_count:
        st.button("Clear completed", on_click=clear_completed)
