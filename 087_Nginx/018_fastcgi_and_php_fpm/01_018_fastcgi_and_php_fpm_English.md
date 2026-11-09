[← Contents and learning path](../README.md) | [فارسی](01_018_fastcgi_and_php_fpm_Persian.md)

# 018 — FastCGI, PHP-FPM, and safe script routing

## Goal and environment
Understand why PHP-FPM is not an HTTP upstream. Prerequisites: files, locations and proxy concepts. This example is for a **Linux PHP-FPM front-controller application** with an installed pool listening on the shown Unix socket. Socket names vary by PHP package; inspect the actual pool configuration. The course does not install or run PHP-FPM for you.


```nginx
server {
    listen 8090;
    server_name localhost;
    root /srv/php-app/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Only this entry point may execute as PHP.
    location = /index.php {
        try_files $uri =404;
        include /etc/nginx/fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php-fpm.sock;
    }

    # Do not execute or serve other PHP scripts as source.
    location ~* \.php(?:/|$) { return 404; }
    location ~ /\. { deny all; }
}
```

## What travels over this connection?
FastCGI carries request metadata and body in its own protocol, not a plain HTTP exchange. `fastcgi_pass` connects to PHP-FPM; `proxy_pass http://...` expects an HTTP server. Confusing these produces protocol failures.

`SCRIPT_FILENAME` tells PHP-FPM which file to execute. The public document root should contain the public entry point and assets, not application secrets. The exact location allows only `index.php`; the PHP-deny regex catches other script-looking paths. File existence is checked before dispatch.

Packaged `fastcgi_params` and `fastcgi.conf` may differ. Inspect them and avoid conflicting duplicate `SCRIPT_FILENAME` definitions. Unix socket permissions must let the Nginx worker connect. If FPM uses a TCP port instead, bind it privately and limit network access.


```bash
# On the PHP test host:
sudo nginx -t
ls -l /run/php/
curl -i http://127.0.0.1:8090/
curl -i http://127.0.0.1:8090/orders/42
curl -i http://127.0.0.1:8090/uploads/evil.php
curl -i http://127.0.0.1:8090/.env
```

## Expected results and limits
Valid routes reach the front controller. Other PHP paths return 404 and dotfiles are denied. Test that a PHP response executes rather than exposing source. Keep uploads outside the executable/public script tree where possible. The dotfile example also blocks `/.well-known/`; add a deliberate challenge route if needed.

PHP frameworks differ: path-info applications and applications with multiple entry points need a reviewed adaptation. Do not paste a permissive regex for arbitrary uploaded PHP. Application authorization, FPM pool limits and timeouts remain separate responsibilities.

## Exercise and answer
Why is `/uploads/evil.php` dangerous under a catch-all PHP executor? User content might become executable code. An allow list of entry points, storage separation, and application-side upload validation address different parts of that risk.

## Official references

- [FastCGI module](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html)
