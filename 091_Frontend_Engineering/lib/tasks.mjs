/** @typedef {{ id: string, title: string, done: boolean }} Task */
/** @typedef {{ type: "add", id: string, title: string } | { type: "toggle" | "remove", id: string }} Action */
export const TASK_LIMIT = 1000;

/** @param {unknown} value @returns {value is Task} */
function isTask(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const task = /** @type {Record<string, unknown>} */ (value);
  return typeof task.id === "string" && /^[a-zA-Z0-9-]{1,64}$/.test(task.id)
    && typeof task.title === "string" && task.title.trim().length > 0
    && task.title.length <= 120 && typeof task.done === "boolean";
}

/** @param {unknown} value @returns {Task[]} */
export function validateTasks(value) {
  if (!Array.isArray(value) || value.length > TASK_LIMIT || !value.every(isTask)) {
    throw new TypeError("Invalid task records");
  }
  const ids = new Set(value.map(task => task.id));
  if (ids.size !== value.length) throw new TypeError("Duplicate task id");
  return value.map(task => ({ id: task.id, title: task.title.trim(), done: task.done }));
}

/** @param {Task[]} tasks @param {Action} action @returns {Task[]} */
export function taskReducer(tasks, action) {
  switch (action.type) {
    case "add":
      if (tasks.some(task => task.id === action.id)) throw new TypeError("Duplicate task id");
      if (tasks.length >= TASK_LIMIT) throw new RangeError("Task limit reached");
      return [...tasks, ...validateTasks([{ id: action.id, title: action.title, done: false }])];
    case "toggle":
      return tasks.map(task => task.id === action.id ? { ...task, done: !task.done } : task);
    case "remove":
      return tasks.filter(task => task.id !== action.id);
    default:
      throw new TypeError("Unknown task action");
  }
}

/** @param {string | null} raw @returns {Task[]} */
export function decodeTasks(raw) {
  if (raw === null) return [];
  const snapshot = JSON.parse(raw);
  if (snapshot === null || typeof snapshot !== "object" || snapshot.version !== 1) {
    throw new TypeError("Unsupported task schema");
  }
  return validateTasks(snapshot.tasks);
}

/** @param {Task[]} tasks @returns {string} */
export function encodeTasks(tasks) {
  return JSON.stringify({ version: 1, tasks: validateTasks(tasks) });
}
