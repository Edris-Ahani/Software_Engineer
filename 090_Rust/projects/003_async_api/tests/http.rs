use axum::{body::{Body, to_bytes}, http::{Request, StatusCode}};
use tower::ServiceExt;

#[tokio::test]
async fn health_works_without_a_network_port() {
    let response = async_api::app().oneshot(Request::builder().uri("/health").body(Body::empty()).unwrap()).await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(to_bytes(response.into_body(), 128).await.unwrap(), "ok");
}

#[tokio::test]
async fn creates_completes_and_reads_a_task() {
    let app = async_api::app();
    let request = Request::builder().method("POST").uri("/tasks")
        .header("content-type", "application/json")
        .body(Body::from(r#"{"title":"Read Rust"}"#)).unwrap();
    let response = app.clone().oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::CREATED);
    let request = Request::builder().method("PATCH").uri("/tasks/1").body(Body::empty()).unwrap();
    assert_eq!(app.clone().oneshot(request).await.unwrap().status(), StatusCode::OK);
    let request = Request::builder().uri("/tasks/1").body(Body::empty()).unwrap();
    let response = app.oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    let body = to_bytes(response.into_body(), 1_024).await.unwrap();
    assert!(std::str::from_utf8(&body).unwrap().contains(r#""completed":true"#));
}

#[tokio::test]
async fn rejects_blank_title_and_missing_task() {
    let app = async_api::app();
    let request = Request::builder().method("POST").uri("/tasks")
        .header("content-type", "application/json")
        .body(Body::from(r#"{"title":"   "}"#)).unwrap();
    assert_eq!(app.clone().oneshot(request).await.unwrap().status(), StatusCode::UNPROCESSABLE_ENTITY);
    let request = Request::builder().uri("/tasks/999").body(Body::empty()).unwrap();
    assert_eq!(app.oneshot(request).await.unwrap().status(), StatusCode::NOT_FOUND);
}
