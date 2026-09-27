# Caching

## What is it?
Caching is the process of storing copies of files or data in a temporary storage location (cache) so they can be accessed more quickly. In backend development, caching is typically used to store the results of expensive database queries, external API calls, or complex calculations.

## Types of Caching
1. **Client-Side/Browser Caching**: Storing static assets (HTML, CSS, JS, Images) on the user's browser.
2. **CDN (Content Delivery Network)**: Caching static assets on servers distributed globally to be closer to users.
3. **Web Server Caching**: Caching responses directly at the web server level (e.g., Nginx).
4. **Application/Database Caching**: Storing frequently accessed database records in memory (e.g., Redis, Memcached).

## What Problems Does It Solve?
- **Reduces Latency**: Retrieving data from memory (RAM) is orders of magnitude faster than retrieving it from a disk (Database) or over a network.
- **Reduces Load**: It protects your primary database from being overwhelmed by repetitive queries, preventing system crashes during traffic spikes.
- **Cost Efficiency**: Reduces the amount of compute required on expensive database servers.

## When and Where to Use It?
Use caching for data that is read frequently but modified infrequently (high read-to-write ratio). Examples include user sessions, product catalogs, configuration settings, or daily leaderboards.

## Common Caching Strategies
- **Cache-Aside (Lazy Loading)**: Application checks the cache first. If a miss occurs, it fetches from the DB, saves it to the cache, and returns the data.
- **Write-Through**: Data is written into the cache and the corresponding database at the same time.

## Examples

### Node.js Example (using Redis for Cache-Aside)
```javascript
const redis = require('redis');
const client = redis.createClient();

async function getUserProfile(userId) {
    // 1. Check if data is in the cache
    const cachedProfile = await client.get(`user:${userId}`);
    
    if (cachedProfile) {
        // Cache Hit
        return JSON.parse(cachedProfile);
    }
    
    // 2. Cache Miss - Fetch from Database
    const dbProfile = await database.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (dbProfile) {
        // 3. Save to cache for future requests (with a time-to-live of 3600 seconds)
        await client.setEx(`user:${userId}`, 3600, JSON.stringify(dbProfile));
    }
    
    return dbProfile;
}
```
