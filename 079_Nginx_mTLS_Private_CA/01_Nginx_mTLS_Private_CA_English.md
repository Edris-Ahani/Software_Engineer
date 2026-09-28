# Setting up mTLS with a Private CA in Nginx

This exact architecture is the most secure and standard way to separate public traffic from an internal network. Since Let's Encrypt has stopped supporting client authentication certificates (`tlsclient`), setting up an internal Certificate Authority (Private CA) for the mTLS layer is the only principled solution.

In this architecture, the edge Nginx plays two completely different roles: for internet users, it acts as an HTTPS server, and for internal servers, it acts as an mTLS client.

To implement this structure, you need to go through the following three steps.

## Step 1: Create a Private CA and Internal Certificates

For internal network communications, you need to act as the Certificate Authority (CA) yourself. First, we create a CA and then sign the certificates for Nginx and the API servers with it.

### 1. Create the Root Certificate (Private CA):
```bash
# Generate the CA private key
openssl genrsa -out private-ca.key 4096

# Generate the CA certificate valid for 10 years
openssl req -x509 -new -nodes -key private-ca.key -sha256 -days 3650 -out private-ca.crt -subj "/CN=My Internal CA"
```

### 2. Create the Certificate for API Servers (e.g., API-01):
```bash
openssl genrsa -out api-01.key 2048
openssl req -new -key api-01.key -out api-01.csr -subj "/CN=api-01.internal"

# Sign the server certificate with the internal CA
openssl x509 -req -in api-01.csr -CA private-ca.crt -CAkey private-ca.key -CAcreateserial -out api-01.crt -days 825 -sha256
```

### 3. Create the Client Certificate for Nginx (so APIs can recognize it):
```bash
openssl genrsa -out nginx-client.key 2048
openssl req -new -key nginx-client.key -out nginx-client.csr -subj "/CN=Nginx Reverse Proxy"

# Sign the client certificate with the internal CA
openssl x509 -req -in nginx-client.csr -CA private-ca.crt -CAkey private-ca.key -CAcreateserial -out nginx-client.crt -days 825 -sha256
```

## Step 2: Configure the Edge Nginx (Reverse Proxy)

Here, Nginx receives traffic from the internet using a Let's Encrypt certificate and forwards it through a new mTLS tunnel to the APIs using the internal certificates.
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # ---------------------------------------------------------
    # 1. Internet Communication (Public HTTPS) - with Let's Encrypt
    # ---------------------------------------------------------
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ---------------------------------------------------------
    # 2. Internal Servers Communication (Internal mTLS) - with Private CA
    # ---------------------------------------------------------
    location /api-01/ {
        # Forward traffic to the internal server via HTTPS
        proxy_pass https://api-01.internal/;

        # Provide Nginx's client certificate to the API server for authentication
        proxy_ssl_certificate /etc/nginx/certs/nginx-client.crt;
        proxy_ssl_certificate_key /etc/nginx/certs/nginx-client.key;

        # Verify and validate the API server's certificate by Nginx (completing mTLS)
        proxy_ssl_trusted_certificate /etc/nginx/certs/private-ca.crt;
        proxy_ssl_verify on;
        proxy_ssl_verify_depth 2;
        
        # Send the server name to prevent SNI errors on the API side
        proxy_ssl_server_name on;
        proxy_ssl_name api-01.internal;

        # Forward essential headers to the backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Step 3: Configure the API Servers

The API servers (which can run with Nginx, Node.js, Go, or any other framework) must be configured to only accept requests from clients that present a certificate signed by `private-ca.crt`.

Sample Nginx configuration for API-01:
```nginx
server {
    listen 443 ssl;
    server_name api-01.internal;

    # The API server's own certificate (which edge Nginx will verify)
    ssl_certificate /etc/api-certs/api-01.crt;
    ssl_certificate_key /etc/api-certs/api-01.key;

    # Specify the internal CA and enforce client authentication (edge Nginx)
    ssl_client_certificate /etc/api-certs/private-ca.crt;
    ssl_verify_client on;

    location / {
        # If the edge Nginx doesn't provide a valid certificate, the request is rejected at the TLS layer 
        # and never reaches the main application
        proxy_pass http://localhost:8080;
    }
}
```

## Why is this architecture incredibly secure?
If an attacker somehow breaches your internal network (VPC or LAN) and attempts to send a direct request to `api-01.internal`, their connection will be rejected during the Handshake phase (returning a 400 Bad Request error) because they do not possess the private key (`nginx-client.key`). Your API servers are practically invisible and impenetrable to any request that doesn't come through the edge Nginx route.

After setting up this architecture, managing internal certificates becomes critical in the long term. Unlike Let's Encrypt, which provides tools like Certbot, you will need to manage the renewal of your Private CA certificates yourself.
