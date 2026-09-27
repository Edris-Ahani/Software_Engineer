# Web Servers & Reverse Proxies

## What are they?
While application servers (like Node.js/Express, Python/Django) handle business logic, they are usually placed behind a **Web Server** or **Reverse Proxy** to handle the heavy lifting of raw internet traffic.

## Reverse Proxy vs. Forward Proxy
- **Forward Proxy**: Sits in front of a *client* and ensures that no origin server ever communicates directly with that specific client (e.g., a corporate VPN or internet filter). It protects the *client*.
- **Reverse Proxy**: Sits in front of a *web server* and ensures that no client ever communicates directly with that specific server. It protects the *server*.

## What Problems Does a Reverse Proxy Solve?
1. **Load Balancing**: Distributing incoming requests across multiple backend application servers.
2. **SSL Termination**: Decrypting incoming HTTPS requests so your application server only has to deal with unencrypted HTTP, saving CPU cycles.
3. **Caching**: Storing static content (like images, CSS, JS files) and serving them directly to the user without even bothering the backend server.
4. **Compression**: Compressing outbound files (e.g., using Gzip or Brotli) to reduce bandwidth and speed up load times.
5. **Security**: Hiding the existence and characteristics of your backend servers. They can act as a web application firewall (WAF).

## Nginx
**Nginx** (pronounced "engine-x") is the most popular open-source web server used as a reverse proxy, load balancer, and HTTP cache. 

### Examples

**A basic Nginx Reverse Proxy Configuration:**
```nginx
server {
    # Listen on port 80 (HTTP)
    listen 80;
    server_name mywebsite.com;

    location / {
        # Forward all requests to the local Node.js app running on port 3000
        proxy_pass http://localhost:3000;
        
        # Pass necessary headers to the backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
