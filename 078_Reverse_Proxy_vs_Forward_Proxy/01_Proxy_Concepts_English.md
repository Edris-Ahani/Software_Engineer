# Forward Proxy vs Reverse Proxy

## What is a Proxy?
A proxy is a middleman server that sits between a client (you) and the destination server (the internet). Depending on whose identity it is trying to hide or protect, it is classified as either a Forward Proxy or a Reverse Proxy.

## 1. Forward Proxy (Hides the Client)
- **Concept**: A Forward Proxy sits in front of the **Client**. When you try to visit `google.com`, your request first goes to the proxy. The proxy then makes the request to Google on your behalf, gets the result, and sends it back to you.
- **Why use it?**
  1. **Anonymity**: Google only sees the IP address of the proxy server, not your actual home IP address (this is exactly how VPNs work).
  2. **Content Filtering**: Corporations or schools use forward proxies to block access to certain websites (e.g., social media). The proxy simply refuses to forward your request if the destination is on a blacklist.
  3. **Caching**: If 50 students in a school network request the same Wikipedia page, the proxy downloads it once and serves the cached copy to the other 49 students, saving bandwidth.

### Forward Proxy Example (Squid)
Squid is a popular open-source forward proxy. You can configure it to allow access only to specific domains.
```conf
# /etc/squid/squid.conf
acl allowed_domains dstdomain .google.com .wikipedia.org
http_access allow allowed_domains
http_access deny all
```

## 2. Reverse Proxy (Hides the Server)
- **Concept**: A Reverse Proxy sits in front of the **Backend Servers**. When a client tries to visit your website, their request hits the reverse proxy (like Nginx, Cloudflare, or HAProxy). The proxy decides which backend server should handle it, gets the response, and sends it back to the client.
- **Why use it?**
  1. **Security**: The client never interacts directly with your backend database or application servers. They only see the IP address of the Reverse Proxy, protecting your internal servers from direct DDoS attacks.
  2. **Load Balancing**: The reverse proxy can distribute incoming traffic evenly across 10 different backend servers.
  3. **SSL Termination**: Instead of configuring SSL certificates on all 10 backend servers, you put the SSL certificate only on the Reverse Proxy. The proxy decrypts incoming HTTPS traffic and sends fast, plain HTTP traffic to the backend servers inside your private network.

### Reverse Proxy Example (Nginx)
Nginx is widely used as a reverse proxy. Here is a basic configuration to forward traffic from port 80 to a backend server running on port 3000.
```nginx
# /etc/nginx/sites-available/default
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
