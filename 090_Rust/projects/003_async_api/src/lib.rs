use axum::{
    extract::{DefaultBodyLimit, Path, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::{collections::BTreeMap, sync::{Arc, Mutex}};

const MAX_TASKS: usize = 1_000;
const MAX_TITLE_CHARACTERS: usize = 120;
const MAX_BODY_BYTES: usize = 8 * 1_024;

#[derive(Clone, Debug, Serialize)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub completed: bool,
}

#[derive(Deserialize)]
struct CreateTask { title: String }

#[derive(Default)]
struct Store {
    next_id: u64,
    tasks: BTreeMap<u64, Task>,
}

type SharedStore = Arc<Mutex<Store>>;
type ApiError = (StatusCode, &'static str);

fn internal_error() -> ApiError { (StatusCode::INTERNAL_SERVER_ERROR, "Internal error") }

async fn health() -> &'static str { "ok" }

async fn list_tasks(State(store): State<SharedStore>) -> Result<Json<Vec<Task>>, ApiError> {
    let store = store.lock().map_err(|_| internal_error())?;
    Ok(Json(store.tasks.values().cloned().collect()))
}

async fn create_task(
    State(store): State<SharedStore>,
    Json(input): Json<CreateTask>,
) -> Result<(StatusCode, Json<Task>), ApiError> {
    let title = input.title.trim();
    if title.is_empty() || title.chars().count() > MAX_TITLE_CHARACTERS {
        return Err((StatusCode::UNPROCESSABLE_ENTITY, "Title must contain 1 to 120 characters"));
    }
    let mut store = store.lock().map_err(|_| internal_error())?;
    if store.tasks.len() >= MAX_TASKS {
        return Err((StatusCode::SERVICE_UNAVAILABLE, "Task capacity reached"));
    }
    let id = store.next_id.checked_add(1).ok_or_else(internal_error)?;
    let task = Task { id, title: title.to_owned(), completed: false };
    store.tasks.insert(id, task.clone());
    store.next_id = id;
    Ok((StatusCode::CREATED, Json(task)))
}

async fn get_task(
    State(store): State<SharedStore>, Path(id): Path<u64>,
) -> Result<Json<Task>, ApiError> {
    let store = store.lock().map_err(|_| internal_error())?;
    store.tasks.get(&id).cloned().map(Json)
        .ok_or((StatusCode::NOT_FOUND, "Task not found"))
}

async fn complete_task(
    State(store): State<SharedStore>, Path(id): Path<u64>,
) -> Result<Json<Task>, ApiError> {
    let mut store = store.lock().map_err(|_| internal_error())?;
    let task = store.tasks.get_mut(&id).ok_or((StatusCode::NOT_FOUND, "Task not found"))?;
    task.completed = true;
    Ok(Json(task.clone()))
}

pub fn app() -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/tasks", get(list_tasks).post(create_task))
        .route("/tasks/{id}", get(get_task).patch(complete_task))
        .layer(DefaultBodyLimit::max(MAX_BODY_BYTES))
        .with_state(Arc::new(Mutex::new(Store::default())))
}
