[← Contents and learning path](../README.md) | [فارسی](01_002_installation_and_commands_Persian.md)

# 002 — Installation, paths, validation, and safe reload

## Learning goal and environment
Install a distribution package on a disposable Ubuntu/Debian machine, find the actual configuration, and reload it safely. Linux commands in this course run in Linux or WSL; they are not PowerShell commands. For Windows without a Linux service manager, use the Docker lab.

Distribution packages and nginx.org packages may use different defaults, users, module builds, and service files. Do not mix their installation recipes. The example below uses the distribution repository; check package security updates through that distribution.


```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable --now nginx
nginx -v
nginx -V 2>&1
sudo nginx -t
sudo systemctl status nginx --no-pager
curl -I http://127.0.0.1/
```

## Commands and why they matter

| Command | Purpose |
| --- | --- |
| `nginx -v` | Report version |
| `nginx -V` | Report build options and compiled paths |
| `nginx -t` | Check syntax and opening referenced files |
| `nginx -T` | Check and print the loaded configuration with includes |
| `systemctl reload nginx` | Ask the existing service to load a new configuration |
| `nginx -s quit` | Graceful shutdown for a directly managed instance |
| `nginx -s stop` | Fast shutdown; can interrupt active work |

`nginx -T` can print sensitive inline settings; inspect locally and redact before sharing. A passing `-t` does not prove a backend is reachable, certificates match the public domain, or routing matches your intent.


```bash
# After editing the loaded configuration:
sudo nginx -t && sudo systemctl reload nginx
sudo journalctl -u nginx -n 30 --no-pager
sudo tail -n 30 /var/log/nginx/error.log
curl -i http://127.0.0.1/
```

## Paths and permissions
Common paths are `/etc/nginx/nginx.conf`, `/etc/nginx/conf.d/`, and `/var/log/nginx/`. Debian-family packages often include `sites-enabled/`; this is a packaging convention, not a mandatory Nginx directory. A file has no effect unless the active configuration includes it. Follow `nginx -V` and `nginx -T`, rather than assuming a path.

On reload, existing workers can finish active requests while replacement workers use the new configuration. Long lived WebSockets may keep old workers alive. Avoid starting a second Nginx manually when systemd already owns port 80.

## Common failure and recovery
An unknown directive can mean a missing module or unsupported version. A permission error can mean a missing directory traversal permission or a key unreadable by the master. Read the exact filename and line number. Restore the known good file, run `-t`, reload, and test an actual request.

## Exercise and answer
Place an invalid directive in a disposable config and run `-t`. It must fail; do not reload it. After removing it, both `-t` and the HTTP probe should succeed. In production, stage this experiment away from live configuration.

## Official references

- [Command line switches](https://nginx.org/en/docs/switches.html)
- [Official Linux packaging](https://nginx.org/en/linux_packages.html)
