# Redis Data Structures & Advanced Use Cases

## More than just caching
Most developers only use Redis as a simple Key-Value store to cache JSON strings (`SET user:1 "{...}"`). However, Redis is actually a "Data Structure Server". Knowing its built-in data structures allows you to solve complex engineering problems instantly without writing heavy SQL queries.

## 1. Strings
- **Use case**: Caching HTML, JSON, or tracking page views.
- **Example**: `INCR article:100:views`. Redis increments numbers atomically, making it perfect for real-time counters (like YouTube views) without Race Conditions.

## 2. Hashes (HSET, HGET)
- **Concept**: A Map (or Dictionary) inside a Redis Key. 
- **Use case**: Storing user profiles. Instead of fetching a massive JSON string just to update a user's age, you can update just the specific field: `HSET user:1 age 25`.

## 3. Lists (LPUSH, RPOP)
- **Concept**: A Linked List of strings.
- **Use case**: Simple Message Queues or "Recent Activity" feeds. E.g., maintaining a user's 10 most recent searches: `LPUSH user:1:searches "shoes"`, followed by `LTRIM user:1:searches 0 9` to keep only the latest 10 items.

## 4. Sets (SADD, SISMEMBER)
- **Concept**: An unordered collection of *unique* strings.
- **Use case**: Tracking unique IP addresses that visited a page today, or implementing a "Followers" system. You can easily find mutual friends by doing an intersection (`SINTER`) between two users' friend sets.

## 5. Sorted Sets / ZSETs (ZADD, ZRANGE)
- **Concept**: A Set where every member has a "Score" (a floating-point number). Redis automatically keeps the set sorted by this score.
- **Use case**: Real-time Leaderboards (Gaming), or Rate Limiting. E.g., `ZADD global_leaderboard 9500 "Player_1"`. You can instantly fetch the top 10 players (`ZREVRANGE`) without doing a slow `ORDER BY` query in a relational database.
