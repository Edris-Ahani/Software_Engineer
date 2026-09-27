# Consistent Hashing

## The Problem with Simple Hashing
Imagine you have 3 Redis cache servers (A, B, C) and you want to store a user's session. You might use simple hashing: `server_index = hash(user_id) % 3`.
This works perfectly until your traffic spikes and you add a 4th server (D). Suddenly, the math becomes `hash(user_id) % 4`. This changes the `server_index` for almost *every* user. All your cached data is now on the "wrong" server, causing a massive cache miss storm that could crash your database!

## What is Consistent Hashing?
Consistent Hashing is a distributed hashing scheme that solves this problem. Instead of a simple modulo array, it maps both the servers and the data keys onto a **Hash Ring** (a circle from 0 to 360 degrees, or `0` to `2^32 - 1`).

## How it works
1. **Place the Servers**: You hash the IP addresses of Servers A, B, and C, and place them on the circle.
2. **Place the Data**: You hash the `user_id` and place it on the circle.
3. **Find the Server**: To find where a user's data belongs, you travel clockwise around the ring from the user's position until you hit the first server.
4. **Adding/Removing a Server**: If you add Server D to the ring, it only takes over the keys immediately counter-clockwise to it. **Only `1/N` of the data needs to be moved**, where `N` is the number of servers! The rest of the keys stay exactly where they are.

## Real World Usage
It is the backbone of systems like Amazon DynamoDB, Apache Cassandra, and Discord's Discord Gateway architecture.
