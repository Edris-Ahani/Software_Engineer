[← Contents and learning path](../README.md) | [فارسی](01_020_high_availability_and_failover_Persian.md)

# 020 — High Availability Architectures: Patroni and etcd

## Learning Goals
Architect enterprise High Availability (HA) clusters for PostgreSQL. Understand RPO/RTO metrics, eliminate split-brain disasters via distributed consensus (etcd/Raft), and master automated failover with **Patroni** and **HAProxy**.

---

## 1. High Availability Metrics: RPO and RTO

- **Recovery Point Objective (RPO):** Maximum acceptable data loss measured in time (e.g., RPO = 0 means zero committed transaction loss).
- **Recovery Time Objective (RTO):** Maximum allowable downtime until service is restored (e.g., RTO < 30 seconds).

---

## 2. The Split-Brain Catastrophe

A split-brain occurs when a network partition cuts off communication between nodes, causing two independent nodes to both believe they are the legitimate Primary:

```text
[ NETWORK PARTITION ]
Clients (Subnet A) ───> Primary Node A (Writes accepted)
                               X (Disconnected)
Clients (Subnet B) ───> Former Standby Promoted to Primary B (Writes accepted)
```
**Outcome:** Both nodes advance WAL timelines independently (`Timeline 2` on Node A vs `Timeline 2` on Node B). Their data diverges permanently, making automated reconciliation mathematically impossible!

### Prevention: Distributed Consensus and Quorum
Automated failover must never rely on simple point-to-point heartbeats. It requires a distributed consensus store (like **etcd** or Consul) with an **odd number of voting members** (minimum 3) to establish strict majority quorum ($N/2 + 1$).

---

## 3. Patroni Architecture: The Industry Standard

Patroni is a template and supervisor daemon written in Python that manages PostgreSQL lifecycle via distributed consensus:

```text
                           +----------------------+
                           |  Client Applications |
                           +----------------------+
                                      │
                                      v
                           +----------------------+
                           |   HAProxy / VIP      |
                           +----------------------+
                            /        │         \
   HTTP Health Check       /         │          \   HTTP Health Check
   (Port 8008 /primary)   /          │           \  (Port 8008 /replica)
                         v           v            v
                 +------------+ +------------+ +------------+
                 |  Node #1   | |  Node #2   | |  Node #3   |
                 | (Primary)  | | (Standby)  | | (Standby)  |
                 |  Patroni   | |  Patroni   | |  Patroni   |
                 | PostgreSQL | | PostgreSQL | | PostgreSQL |
                 +------------+ +------------+ +------------+
                         \           │            /
                          \          │           /
                           v         v          v
                 +------------------------------------------+
                 |         Distributed Consensus Store      |
                 |           (3-Node etcd Cluster)          |
                 +------------------------------------------+
```

### Automated Failover Sequence:
1. The Primary Patroni node holds a leader lock key in `etcd` with a short TTL (e.g., 10 seconds).
2. Primary refreshes the lease every 2 seconds.
3. If the Primary machine crashes, the lease in `etcd` expires.
4. The remaining standby nodes compare their replay LSNs. The standby with the **highest LSN (least replication lag)** claims the leader lock in `etcd`.
5. Patroni promotes this standby to Primary.
6. HAProxy's HTTP health checks detect that Node #2 now answers `HTTP 200` on `/primary` and immediately switches all write traffic to Node #2 within 5 seconds!

---

## 4. HAProxy Integration with Patroni REST API

Patroni exposes a built-in REST API on port `8008`:
- `GET http://node:8008/primary` -> Returns `HTTP 200 OK` if the node is currently the Primary; `503 Service Unavailable` otherwise.
- `GET http://node:8008/replica` -> Returns `HTTP 200 OK` if the node is an active healthy standby.

### HAProxy Configuration (`haproxy.cfg`):
```haproxy
listen postgres_write_pool
    bind 0.0.0.0:5000
    mode tcp
    option httpchk GET /primary
    http-check expect status 200
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server pg1 10.0.1.11:5432 maxconn 100 check port 8008
    server pg2 10.0.1.12:5432 maxconn 100 check port 8008
    server pg3 10.0.1.13:5432 maxconn 100 check port 8008

listen postgres_read_pool
    bind 0.0.0.0:5001
    mode tcp
    balance roundrobin
    option httpchk GET /replica
    http-check expect status 200
    server pg1 10.0.1.11:5432 check port 8008
    server pg2 10.0.1.12:5432 check port 8008
    server pg3 10.0.1.13:5432 check port 8008
```

---

## 5. Exercise and Verification

**Exercise:**
A 2-node PostgreSQL cluster has an automated failover script running on Node 2 that promotes Node 2 if Node 1 fails to respond to ping for 5 seconds. Why is this a severe architectural flaw?

**Answer:**
A 2-node cluster cannot establish a quorum majority. If a temporary network switch glitch occurs between the two nodes, Node 2 will falsely assume Node 1 has died and promote itself to Primary. Because Node 1 is still alive and accepting client writes, you now have two conflicting primary nodes accepting writes (**Split-Brain**). Production HA requires at least 3 consensus nodes (e.g., 3 etcd nodes) to validate leader election mathematically.

---

## Official References
- [Patroni Documentation & Architecture](https://patroni.readthedocs.io/)
- [PostgreSQL Documentation: Failover and High Availability Solutions](https://www.postgresql.org/docs/current/different-replication-solutions.html)

