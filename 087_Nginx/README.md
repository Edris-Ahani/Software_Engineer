# Nginx — راهنمای جامع / Practical Handbook

<div dir="rtl">

این مجموعهٔ دوزبانه در ادامهٔ فصل‌های مخزن با نام `087_Nginx` ساخته شده است. پوشه‌های داخلی با `001_` شروع می‌شوند و ترتیب آن‌ها مسیر پیشنهادی یادگیری است؛ ابتدا مهارت لازم برای راه‌اندازی و عیب‌یابی، سپس قابلیت‌های کاربردی و در آخر سناریوهای تخصصی.

هر درس دو فایل مستقل `..._Persian.md` و `..._English.md` دارد. هر دو نسخه شامل توضیح مفهومی، پیش‌نیاز، مثال واضح، محل قرارگیری تنظیمات، روش بررسی نتیجه و تمرین همراه پاسخ هستند. کدها در بلوک‌های چپ‌به‌راست نگه داشته شده‌اند.

</div>

This bilingual chapter follows the repository naming convention. Read the numbered lessons in order: essential operation first, common application features next, and specialized deployments last. Persian and English lessons cover the same concepts and examples.

- [راهنمای اجرا — فارسی](00_HOW_TO_RUN_Persian.md)
- [Run guide — English](00_HOW_TO_RUN_English.md)
- [Complete local lab configuration / تنظیمات کامل آزمایشگاه](_lab/nginx.conf)
- [Behavior checks / بررسی رفتار](_lab/smoke_test.py)

## مسیر یادگیری / Learning path

| شماره / No. | فارسی | English |
| --- | --- | --- |
| `001` | [نقش Nginx و مسیر پردازش درخواست](001_fundamentals/01_001_fundamentals_Persian.md) | [What Nginx does and how requests flow](001_fundamentals/01_001_fundamentals_English.md) |
| `002` | [نصب، مسیرها، اعتبارسنجی و بارگذاری امن](002_installation_and_commands/01_002_installation_and_commands_Persian.md) | [Installation, paths, validation, and safe reload](002_installation_and_commands/01_002_installation_and_commands_English.md) |
| `003` | [ساختار تنظیمات، context و include](003_configuration_contexts/01_003_configuration_contexts_Persian.md) | [Configuration structure, contexts, and includes](003_configuration_contexts/01_003_configuration_contexts_English.md) |
| `004` | [انتخاب سرور مجازی و location](004_server_and_location_matching/01_004_server_and_location_matching_Persian.md) | [Virtual hosts and location selection](004_server_and_location_matching/01_004_server_and_location_matching_English.md) |
| `005` | [فایل ایستا، root، alias و مسیریابی SPA](005_static_files_and_spa/01_005_static_files_and_spa_Persian.md) | [Static files, root, alias, and SPA routing](005_static_files_and_spa/01_005_static_files_and_spa_English.md) |
| `006` | [پراکسی معکوس و اسلش پایانی proxy_pass](006_reverse_proxy_and_proxy_pass/01_006_reverse_proxy_and_proxy_pass_Persian.md) | [Reverse proxy and the proxy_pass trailing slash](006_reverse_proxy_and_proxy_pass/01_006_reverse_proxy_and_proxy_pass_English.md) |
| `007` | [هدرهای پراکسی، IP واقعی و مرز اعتماد](007_headers_real_ip_and_trust/01_007_headers_real_ip_and_trust_Persian.md) | [Forwarded headers, real client IP, and trust](007_headers_real_ip_and_trust/01_007_headers_real_ip_and_trust_English.md) |
| `008` | [HTTPS، گواهینامه، SNI و تمدید](008_https_tls_and_certificates/01_008_https_tls_and_certificates_Persian.md) | [HTTPS, certificates, SNI, and renewal](008_https_tls_and_certificates/01_008_https_tls_and_certificates_English.md) |
| `009` | [لاگ، زمان‌بندی، پایش و عیب‌یابی](009_logs_monitoring_and_troubleshooting/01_009_logs_monitoring_and_troubleshooting_Persian.md) | [Logs, timing, monitoring, and troubleshooting](009_logs_monitoring_and_troubleshooting/01_009_logs_monitoring_and_troubleshooting_English.md) |
| `010` | [upstream، توزیع بار، keepalive و تلاش مجدد](010_upstreams_and_load_balancing/01_010_upstreams_and_load_balancing_Persian.md) | [Upstreams, balancing, keepalive, and retries](010_upstreams_and_load_balancing/01_010_upstreams_and_load_balancing_English.md) |
| `011` | [کش پراکسی، کلید کش و کش مرورگر](011_proxy_cache_and_browser_cache/01_011_proxy_cache_and_browser_cache_Persian.md) | [Proxy cache, cache keys, and browser caching](011_proxy_cache_and_browser_cache/01_011_proxy_cache_and_browser_cache_English.md) |
| `012` | [محدودیت نرخ، burst و محدودیت اتصال](012_rate_and_connection_limiting/01_012_rate_and_connection_limiting_Persian.md) | [Rate limits, bursts, and connection limits](012_rate_and_connection_limiting/01_012_rate_and_connection_limiting_English.md) |
| `013` | [کنترل دسترسی، Basic Auth، CORS و هدرهای امنیتی](013_access_control_cors_and_security/01_013_access_control_cors_and_security_Persian.md) | [Access control, Basic Auth, CORS, and security headers](013_access_control_cors_and_security/01_013_access_control_cors_and_security_English.md) |
| `014` | [redirect، بازنویسی داخلی، متغیر و map](014_redirects_rewrites_and_map/01_014_redirects_rewrites_and_map_Persian.md) | [Redirects, internal rewrites, variables, and map](014_redirects_rewrites_and_map/01_014_redirects_rewrites_and_map_English.md) |
| `015` | [WebSocket، SSE و پاسخ جریانی](015_websocket_and_sse/01_015_websocket_and_sse_Persian.md) | [WebSocket, SSE, and streaming responses](015_websocket_and_sse/01_015_websocket_and_sse_English.md) |
| `016` | [آپلود، بافر، timeout و بودجهٔ درخواست](016_uploads_buffers_and_timeouts/01_016_uploads_buffers_and_timeouts_Persian.md) | [Uploads, buffers, timeouts, and request budgets](016_uploads_buffers_and_timeouts/01_016_uploads_buffers_and_timeouts_English.md) |
| `017` | [کارایی، فشرده‌سازی و برنامه‌ریزی ظرفیت](017_performance_compression_and_capacity/01_017_performance_compression_and_capacity_Persian.md) | [Performance, compression, and capacity planning](017_performance_compression_and_capacity/01_017_performance_compression_and_capacity_English.md) |
| `018` | [FastCGI، PHP-FPM و مسیریابی امن اسکریپت](018_fastcgi_and_php_fpm/01_018_fastcgi_and_php_fpm_Persian.md) | [FastCGI, PHP-FPM, and safe script routing](018_fastcgi_and_php_fpm/01_018_fastcgi_and_php_fpm_English.md) |
| `019` | [Docker، DNS سرویس و تنظیمات قابل‌بازتولید](019_docker_networks_and_dns/01_019_docker_networks_and_dns_Persian.md) | [Docker, service DNS, and reproducible configuration](019_docker_networks_and_dns/01_019_docker_networks_and_dns_English.md) |
| `020` | [gRPC، جریان TCP/UDP، HTTP/2 و HTTP/3](020_grpc_stream_and_http3/01_020_grpc_stream_and_http3_Persian.md) | [gRPC, TCP/UDP streams, HTTP/2, and HTTP/3](020_grpc_stream_and_http3/01_020_grpc_stream_and_http3_English.md) |
| `021` | [بررسی TLS بک‌اند و TLS دوطرفه](021_upstream_tls_and_mtls/01_021_upstream_tls_and_mtls_Persian.md) | [Upstream TLS verification and mutual TLS](021_upstream_tls_and_mtls/01_021_upstream_tls_and_mtls_English.md) |
| `022` | [روند استقرار، بازبینی و تمرین نهایی](022_production_workflow_and_review/01_022_production_workflow_and_review_Persian.md) | [Deployment workflow, review, and final exercises](022_production_workflow_and_review/01_022_production_workflow_and_review_English.md) |

<div dir="rtl">

**اولویت اول: ۰۰۱ تا ۰۰۹.** نقش Nginx، نصب و مدیریت، context، انتخاب route، فایل ایستا، پراکسی، هدر قابل‌اعتماد، TLS و عیب‌یابی. برای هر کسی که یک سرویس پشت Nginx نگه می‌دارد ضروری‌اند.

**اولویت دوم: ۰۱۰ تا ۰۱۶.** توزیع بار، کش، محدودیت، کنترل دسترسی، rewrite، streaming و آپلود. بسته به کاربرد فعال می‌شوند؛ دانستن خطرهایشان قبل از استفاده ضروری است.

**اولویت سوم: ۰۱۷ تا ۰۲۲.** ظرفیت، PHP-FPM، Docker/DNS، پروتکل‌های تخصصی، mTLS و روند تولید. Docker آزمایشگاه را می‌توانید از ابتدای مطالعه استفاده کنید؛ درس ۰۱۹ جزئیات شبکه و عملیات آن را توضیح می‌دهد. PHP و gRPC/QUIC را در صورت نیاز پشتهٔ خود بخوانید.

</div>

**Priority 1 — 001–009:** essential operation and diagnosis. **Priority 2 — 010–016:** common application features and their failure modes. **Priority 3 — 017–022:** capacity and specialized deployments. You can run Docker immediately; lesson 019 explains its details. PHP/gRPC/QUIC are optional for stacks that use them.

## ساختار / Structure

```text
087_Nginx/
├── README.md
├── 00_HOW_TO_RUN_English.md
├── 00_HOW_TO_RUN_Persian.md
├── 001_fundamentals/
│   ├── 01_001_fundamentals_English.md
│   └── 01_001_fundamentals_Persian.md
├── ... through 022_production_workflow_and_review/
├── _lab/
│   ├── compose.yaml
│   ├── nginx.conf
│   ├── proxy_headers.conf
│   ├── backend.py
│   ├── smoke_test.py
│   └── html/
└── _shared/
    └── validate_docs.py
```

## محدودهٔ مثال‌ها / Example scope

<div dir="rtl">

آزمایشگاه محلی برای فایل ایستا، پراکسی، هدرها، دو بک‌اند، کش، محدودیت نرخ، SSE، redirect و اندازهٔ آپلود اجرایی است. فقط روی loopback هاست منتشر می‌شود و TLS عمومی ندارد. مثال‌های TLS/mTLS، PHP-FPM، gRPC، stream و HTTP/3 پیش‌نیازهای مستقل و صریح دارند؛ در آزمایشگاه عمومی ادغام نشده‌اند.

هر قطعه مشخص می‌کند فایل کامل، بلوک `server`، قطعهٔ `http` یا `location` است. نمونه‌های مستقل را یکجا در یک فایل نریزید. اعداد ظرفیت و timeout نمونه‌اند؛ انتخاب تولید نیازمند اندازه‌گیری است.

</div>

The executable local lab covers static files, reverse proxying, trusted headers, two backends, public cache, rate limits, SSE, redirects and upload size. It publishes only on host loopback and uses local HTTP. TLS/mTLS, PHP-FPM, gRPC, stream and HTTP/3 examples state their own prerequisites. Each snippet identifies its required configuration context. Capacity and timeout values are illustrative.

## منابع و فصل‌های مرتبط / Sources and related chapters

Each lesson links directly to its official directive references. Module availability, defaults and syntax depend on the installed build: inspect `nginx -v`, `nginx -V`, and the loaded configuration before adapting examples.

<div dir="rtl">

در پایان هر درس منابع رسمی همان موضوع آمده‌اند. نسخه، build و ماژول‌های نصب‌شده را پیش از تطبیق مثال‌ها بررسی کنید.

</div>

- [Official Nginx documentation](https://nginx.org/en/docs/)
- [Existing reverse proxy introduction — English](../020_Web_Servers_and_Reverse_Proxies/01_Nginx_and_Proxies_English.md)
- [Existing reverse proxy introduction — فارسی](../020_Web_Servers_and_Reverse_Proxies/01_Nginx_and_Proxies_Persian.md)
- [Existing private CA/mTLS chapter — English](../079_Nginx_mTLS_Private_CA/01_Nginx_mTLS_Private_CA_English.md)
- [Existing private CA/mTLS chapter — فارسی](../079_Nginx_mTLS_Private_CA/01_Nginx_mTLS_Private_CA_Persian.md)
