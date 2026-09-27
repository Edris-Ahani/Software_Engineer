# API Gateways & BFF (Backend for Frontend)

## What is an API Gateway?
In a Microservices architecture, you might have 20 different services (Auth, Users, Orders, Inventory, etc.). It is a terrible practice to have the frontend client directly call all 20 of these services. 
An **API Gateway** acts as a single entry point (a reverse proxy) for all client requests. 

**Benefits of an API Gateway:**
- **Routing**: Routes `/api/users` to the User Service, and `/api/orders` to the Order Service.
- **Cross-cutting Concerns**: Handles SSL termination, Authentication (verifying JWT tokens), Rate Limiting, and CORS centrally, so individual microservices don't have to.
- **Aggregation**: It can call multiple microservices in parallel and combine their responses into a single JSON object for the client.

## What is BFF (Backend for Frontend)?
As your application grows, you might have different types of clients: a Web App, an iOS App, and an Android App. 
- A mobile app might need less data (to save bandwidth and battery).
- A web app might need complex, aggregated data for a dashboard.

Instead of forcing a single API Gateway to handle the messy logic of formatting data differently for every platform, the **BFF Pattern** suggests creating *multiple* smaller API Gateways—one specifically tailored for each frontend type (e.g., `Web BFF`, `iOS BFF`).
The frontend team usually manages their own BFF, allowing them to shape the backend data exactly how their specific UI needs it.
