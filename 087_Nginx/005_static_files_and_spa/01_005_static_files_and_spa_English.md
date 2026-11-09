[← Contents and learning path](../README.md) | [فارسی](01_005_static_files_and_spa_Persian.md)

# 005 — Static files, root, alias, and SPA routing

## Goal and prerequisites
Serve files from predictable disk paths and keep API failures separate from SPA navigation. Prerequisite: location matching. This **server block** belongs inside `http`. Create the referenced directories and files before testing.


```nginx
server {
    listen 8082;
    server_name localhost;
    root /srv/www/site;
    index index.html;
    autoindex off;

    location ^~ /api/ { return 404; }
    location ^~ /assets/ {
        try_files $uri =404;
    }
    location /downloads/ {
        alias /srv/downloads/;
    }
    location = /index.html {
        add_header Cache-Control "no-cache";
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## How paths are built

| Request | Directive | Disk file |
| --- | --- | --- |
| `/assets/app.js` | `root /srv/www/site` | `/srv/www/site/assets/app.js` |
| `/downloads/manual.pdf` | `alias /srv/downloads/` | `/srv/downloads/manual.pdf` |

`root` appends the URI. `alias` replaces the matching location prefix; keep the trailing slashes aligned in this prefix example. The SPA fallback internally redirects unknown navigation paths to `index.html`, letting the frontend router decide the page. Do not apply this fallback to missing JS files or API errors: returning HTML with status 200 hides broken deployments.

The exact `/index.html` location is reached by the fallback too. `no-cache` allows storage with revalidation; it does not mean `no-store`. The global `mime.types` include ensures JavaScript and CSS receive suitable content types.


```bash
sudo mkdir -p /srv/www/site/assets /srv/downloads
printf '<h1>SPA shell</h1>\n' | sudo tee /srv/www/site/index.html
printf 'console.log("asset loaded");\n' | sudo tee /srv/www/site/assets/app.js
printf 'sample download\n' | sudo tee /srv/downloads/manual.txt
sudo nginx -t && sudo systemctl reload nginx
curl -i http://127.0.0.1:8082/orders/42
curl -i http://127.0.0.1:8082/assets/missing.js
curl -i http://127.0.0.1:8082/api/missing
curl -i http://127.0.0.1:8082/downloads/manual.txt
```

## Verification and operational details
Expect SPA HTML for `/orders/42`, 404 for both missing asset and API, and the download text for the last request. The worker needs read access to files and execute/traverse access to parent directories. Inspect ownership and parent permissions; `chmod 777` is not a reasonable repair.

Keep uploads outside executable application directories. Disable directory indexes unless listing is intentional. Symlinks and alias paths deserve review when file trees are writable by users.

## Exercise and answer
Remove `/api/` and request a missing API path. It now falls back to HTML. Restore the block and explain why a frontend error such as “unexpected token <” can actually be a server routing mistake.

## Official references

- [root, alias and try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html)
