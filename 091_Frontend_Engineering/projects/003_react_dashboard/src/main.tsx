import { StrictMode, useReducer, useState } from "react";
import { createRoot } from "react-dom/client";
import { taskReducer, type Task } from "../../../lib/tasks.mjs";
import "../../../assets/base.css";

const initialTasks: Task[] = [
  { id: "one", title: "Review accessibility", done: false },
  { id: "two", title: "Measure interaction latency", done: true },
];
type Filter = "all" | "open" | "done";

function App() {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState("Local demo. Reload restores the sample data.");
  const visible = tasks.filter(task => filter === "all" || task.done === (filter === "done"));
  function addTask(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || title.trim().length > 120 || tasks.length >= 1000) {
      setMessage("Enter a title of 1 to 120 characters; at most 1000 tasks are allowed."); return;
    }
    dispatch({ type: "add", id: crypto.randomUUID(), title: title.trim() });
    setTitle(""); setMessage("Task added");
  }
  return <main>
    <h1>Typed task dashboard</h1>
    <form onSubmit={addTask}>
      <label htmlFor="title">Task title</label>{" "}
      <input id="title" required maxLength={120} value={title} onChange={event => setTitle(event.target.value)} />{" "}
      <button>Add task</button>
    </form>
    <p><label htmlFor="filter">Show tasks</label>{" "}
      <select id="filter" value={filter} onChange={event => setFilter(event.target.value as Filter)}>
        <option value="all">All</option><option value="open">Open</option><option value="done">Done</option>
      </select></p>
    <p role="status">{message}</p>
    <p>{tasks.filter(task => task.done).length} of {tasks.length} completed</p>
    {visible.length === 0 ? <p>No matching tasks</p> : <ul>
      {visible.map(task => <li key={task.id}>
        <label><input type="checkbox" checked={task.done} onChange={() => dispatch({ type: "toggle", id: task.id })} />{" "}
          {task.title}</label>
      </li>)}
    </ul>}
  </main>;
}
const root = document.getElementById("root");
if (!root) throw new Error("Root element missing");
createRoot(root).render(<StrictMode><App /></StrictMode>);
