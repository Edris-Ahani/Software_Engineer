# GraphQL Deep Dive (Dataloader & Federation)

## What is it?
We established earlier that GraphQL solves the "Over-fetching" and "Under-fetching" problems of REST by letting the client ask for exactly what it needs. However, GraphQL introduces its own severe problems on the backend if not handled correctly.

## 1. The N+1 Problem in GraphQL
Because a GraphQL query resolves field-by-field, a query asking for 100 users and their related posts will often trigger 1 database query to get the users, and then 100 separate database queries to get the posts for each user. This is the N+1 problem on steroids.
**The Solution: DataLoader**
DataLoader is a utility library (originally built by Facebook). It intercepts all the individual requests for posts, waits a few milliseconds, batches them all together into a single database query (e.g., `SELECT * FROM posts WHERE user_id IN (1,2,3...100)`), and then distributes the results back to the individual GraphQL resolvers.

## 2. Apollo Federation (Microservices with GraphQL)
- **The Problem**: A single, massive GraphQL schema in a monolithic application is easy to manage. But what if you have a Microservices architecture? You don't want 10 different GraphQL endpoints. You want one unified endpoint for the frontend.
- **The Solution (Federation)**: Apollo Federation allows you to have multiple independent GraphQL APIs (e.g., an independent Orders API and an independent Users API). A central "Gateway" server stitches these schemas together into one massive Supergraph. 
- The frontend client only queries the central Gateway, and the Gateway intelligently splits the query up, routes it to the correct underlying microservices, and merges the responses together.
