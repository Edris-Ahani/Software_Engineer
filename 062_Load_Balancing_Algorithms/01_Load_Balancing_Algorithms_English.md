# Load Balancing Algorithms

## What is a Load Balancer?
A Load Balancer is a reverse proxy (like Nginx, HAProxy, or AWS ALB) that sits in front of your backend servers and distributes incoming client traffic across multiple servers. This ensures no single server becomes overwhelmed and crashes.
But *how* does it decide which server gets the next request? It uses specific algorithms.

## 1. Round Robin
- **How it works**: It distributes requests sequentially in a circular order. Request 1 goes to Server A, Request 2 to Server B, Request 3 to Server C, Request 4 back to Server A.
- **Best for**: When all servers have identical hardware specifications and the requests take roughly the same amount of time to process.
- **Problem**: If Server A receives a very heavy video-processing request, and then gets its turn again in the cycle, it might get overwhelmed because Round Robin doesn't care how busy the server is.

## 2. Least Connections
- **How it works**: The load balancer keeps track of how many active connections each server currently has. When a new request comes in, it routes it to the server with the *fewest* active connections.
- **Best for**: Applications where sessions are kept open for varying lengths of time (like WebSockets, long database queries, or heavy computations), ensuring no server is unfairly bogged down.

## 3. IP Hash
- **How it works**: The load balancer takes the client's IP address, applies a mathematical hash function, and uses the result to map the client to a specific server.
- **Best for**: "Sticky Sessions". If a user logs in and their session data is stored only on Server B's RAM, they *must* be routed to Server B for all future requests. IP Hashing guarantees that a specific client will always hit the exact same server, as long as the server pool remains unchanged.
