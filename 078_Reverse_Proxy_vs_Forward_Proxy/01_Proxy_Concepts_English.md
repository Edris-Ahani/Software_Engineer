# Forward Proxy vs Reverse Proxy

## What is a Proxy?
A proxy is a middleman server that sits between a client (you) and the destination server (the internet). Depending on whose identity it is trying to hide or protect, it is classified as either a Forward Proxy or a Reverse Proxy.

## 1. Forward Proxy (Hides the Client)
- **Concept**: A Forward Proxy sits in front of the **Client**. When you try to visit `google.com`, your request first goes to the proxy. The proxy then makes the request to Google on your behalf, gets the result, and sends it back to you.
- **Why use it?**
  1. **Anonymity**: Google only sees the IP address of the proxy server, not your actual home IP address (this is exactly how VPNs work).
  2. **Content Filtering**: Corporations or schools use forward proxies to block access to certain websites (e.g., social media). The proxy simply refuses to forward your request if the destination is on a blacklist.
  3. **Caching**: If 50 students in a school network request the same Wikipedia page, the proxy downloads it once and serves the cached copy to the other 49 students, saving bandwidth.

## 2. Reverse Proxy (Hides the Server)
- **Concept**: A Reverse Proxy sits in front of the **Backend Servers**. When a client tries to visit your website, their request hits the reverse proxy (like Nginx, Cloudflare, or HAProxy). The proxy decides which backend server should handle it, gets the response, and sends it back to the client.
- **Why use it?**
  1. **Security**: The client never interacts directly with your backend database or application servers. They only see the IP address of the Reverse Proxy, protecting your internal servers from direct DDoS attacks.
  2. **Load Balancing**: The reverse proxy can distribute incoming traffic evenly across 10 different backend servers.
  3. **SSL Termination**: Instead of configuring SSL certificates on all 10 backend servers, you put the SSL certificate only on the Reverse Proxy. The proxy decrypts incoming HTTPS traffic and sends fast, plain HTTP traffic to the backend servers inside your private network.
