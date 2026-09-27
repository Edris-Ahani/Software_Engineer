# Logging, Monitoring, and Observability

## What is it?
Once your backend application is running in production, you are effectively flying blind unless you have a way to see what it's doing. **Observability** is the ability to measure the internal states of a system by examining its outputs. It consists of three main pillars:
1. **Logs**: Immutable records of discrete events that happened over time (e.g., "User X logged in at 10:05 PM").
2. **Metrics**: Numbers measured over intervals of time (e.g., CPU usage %, memory consumption, number of HTTP 500 errors per minute).
3. **Traces**: A representation of a single user's journey or request as it travels through a distributed system (essential for microservices).

## What Problems Does It Solve?
- **Debugging Production Issues**: When a user reports a bug, logs allow you to see exactly what happened leading up to the error.
- **Proactive Alerting**: Monitoring tools can send a Slack message or SMS to an on-call engineer *before* a system crashes (e.g., when CPU usage hits 90%).
- **Performance Tuning**: Traces help you identify exactly which database query or microservice is causing a slow API response.

## Popular Tools in the Industry
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana), Datadog, Splunk.
- **Monitoring & Metrics**: Prometheus (for collecting metrics) and Grafana (for visualizing them).
- **Tracing**: Jaeger, Zipkin, OpenTelemetry.

## Examples

### Good vs Bad Logging (Node.js)
```javascript
// BAD LOGGING (Hard to search, missing context)
console.log("Error occurred!");
console.log(err.message);

// GOOD LOGGING (Structured JSON logging using a library like Winston or Pino)
// Structured logs are easily searchable in tools like Kibana.
logger.error({
    message: "Failed to process payment",
    userId: 12345,
    orderId: "ORD-999",
    errorMessage: err.message,
    stackTrace: err.stack,
    timestamp: new Date().toISOString()
});
```
