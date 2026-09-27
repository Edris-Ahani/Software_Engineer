# Linux Basics for Backend Developers

## What is it?
The vast majority of backend servers, cloud instances, and Docker containers run on Linux. As a backend developer, you must be comfortable navigating and managing Linux environments using the Command Line Interface (CLI).

## Key Concepts
1. **The Filesystem Hierarchy**:
   - `/`: The root directory.
   - `/home`: User personal directories.
   - `/etc`: System configuration files.
   - `/var`: Variable data files (like logs in `/var/log`).
2. **Permissions (chmod / chown)**:
   - Linux is a multi-user system. Every file has an owner and belongs to a group.
   - Permissions are split into Read (`r`), Write (`w`), and Execute (`x`).
3. **Processes and Ports**:
   - You need to know how to find out what programs are running, how much memory they use, and what ports they are listening on.
4. **Cron Jobs**:
   - A time-based job scheduler. It's used to run scripts or commands automatically at specified intervals (e.g., "Run this backup script every day at 3 AM").

## Essential Commands Every Developer Should Know

### Navigation & Files
- `pwd`: Print Working Directory.
- `ls -la`: List all files, including hidden ones, with details.
- `cd /path`: Change directory.
- `tail -f /var/log/syslog`: View the end of a file and follow new lines as they are added (crucial for reading live logs).
- `grep "error" app.log`: Search for the word "error" inside `app.log`.
- `find . -name "*.js"`: Find all Javascript files in the current directory and subdirectories.

### Process Management
- `top` or `htop`: View real-time system resources (CPU, RAM) and running processes.
- `ps aux | grep node`: Find the Process ID (PID) of running Node.js applications.
- `kill -9 <PID>`: Forcefully stop a process using its ID.

### Networking
- `curl -I http://example.com`: Send an HTTP request to see the response headers.
- `netstat -tulpn` or `ss -tulpn`: See which processes are listening on which ports (useful if you get a "Port 3000 is already in use" error).
