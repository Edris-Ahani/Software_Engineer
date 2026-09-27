# Deployment Strategies: Blue/Green vs Canary vs Rolling

## The Problem
When you want to release version 2.0 of your app, you can't just turn off version 1.0, wait 5 minutes for the new code to boot up, and then turn it on. That causes downtime. We need Zero-Downtime Deployment strategies.

## 1. Rolling Deployment
- **How it works**: You update servers one by one (or in small batches). If you have 10 servers running V1, you take Server 1 offline, update it to V2, and bring it back. Then Server 2, etc.
- **Pros**: Requires no extra servers.
- **Cons**: For a few minutes, both V1 and V2 are running at the same time. If V2 requires a different database schema than V1, things will break. Rollbacks are slow.

## 2. Blue/Green Deployment
- **How it works**: You maintain two identical production environments. Environment "Blue" is currently live running V1. Environment "Green" is completely idle. You deploy V2 to the "Green" servers and test it privately. When ready, you flip the Load Balancer switch to instantly route 100% of traffic from Blue to Green.
- **Pros**: Instant switch. Zero downtime. If V2 crashes, you can flip the switch back to Blue in 1 second.
- **Cons**: Expensive. You have to pay for 2x the amount of servers.

## 3. Canary Deployment
- **How it works**: Named after the "canary in the coal mine", you deploy V2 to just a tiny subset of servers (e.g., 5% of traffic). You monitor the logs for errors. If the canary survives (no errors), you slowly increase the traffic to 10%, 25%, 50%, until it reaches 100%.
- **Pros**: The safest method. If V2 has a critical bug, only 5% of your users experience it before you detect and stop the rollout.
- **Cons**: Complex to set up and requires advanced observability and load balancing tools.
