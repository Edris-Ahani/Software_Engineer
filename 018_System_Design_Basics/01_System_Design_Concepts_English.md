# System Design Basics

## What is it?
System Design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. For backend engineers, it's about scaling applications from 100 users to 10 million users.

## Key Concepts
1. **Vertical vs. Horizontal Scaling**:
   - *Vertical Scaling (Scale-up)*: Adding more power (CPU, RAM) to your existing server. (Limited by hardware).
   - *Horizontal Scaling (Scale-out)*: Adding more servers to your pool of resources. (Infinite scaling).
2. **Load Balancing**: A reverse proxy that distributes network or application traffic across a number of servers to ensure no single server bears too much demand.
3. **CAP Theorem**: States that a distributed data store can only simultaneously provide two out of three guarantees:
   - *Consistency*: Every read receives the most recent write or an error.
   - *Availability*: Every request receives a (non-error) response, without the guarantee that it contains the most recent write.
   - *Partition tolerance*: The system continues to operate despite an arbitrary number of messages being dropped by the network between nodes.
4. **Database Sharding**: A method of distributing a single database across multiple machines to improve scalability and performance.

## What Problems Does It Solve?
- **Single Point of Failure (SPOF)**: By distributing resources, you ensure that if one server goes down, the system stays online.
- **Performance Bottlenecks**: Distributes heavy loads effectively so users don't experience slow load times.

## Examples (Architecture Evolution)
1. **Startup**: 1 Server (Frontend + Backend + DB all on the same machine).
2. **Growth**: 1 App Server + 1 DB Server.
3. **Scale**: Load Balancer -> Multiple App Servers -> Master DB (Writes) + Read Replica DBs (Reads) + Redis (Cache) + CDN (Static Files).
