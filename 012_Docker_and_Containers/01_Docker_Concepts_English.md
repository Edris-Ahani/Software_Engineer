# Docker and Containers

## What is it?
Docker is an open-source platform that automates the deployment, scaling, and management of applications inside lightweight, portable environments called **containers**. A container packages the application code along with all its dependencies, libraries, and configuration files, ensuring it runs consistently across different environments.

## Virtual Machines vs. Containers
- **Virtual Machines (VMs)**: Include a full copy of an operating system (Guest OS), a virtual copy of the hardware, and the application. They are heavy and slow to start.
- **Containers**: Share the host system's OS kernel and isolate the application processes. They are much lighter, use fewer resources, and start almost instantly.

## What Problems Does It Solve?
- **"It works on my machine" Syndrome**: Eliminates discrepancies between development, testing, and production environments. If it runs in a Docker container on your laptop, it will run exactly the same way on the production server.
- **Microservices Deployment**: Containers are the perfect fit for microservices, allowing you to deploy and scale hundreds of small, isolated services independently.
- **Resource Efficiency**: You can run many more containers on a single physical machine compared to traditional Virtual Machines.

## Key Concepts
- **Dockerfile**: A text document containing all the commands a user could call on the command line to assemble an image.
- **Image**: A read-only template with instructions for creating a Docker container. It's like a snapshot of your application.
- **Container**: A runnable instance of an image.

## Examples

### A Simple Node.js Dockerfile
```dockerfile
# 1. Use the official Node.js image as the base image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the application code
COPY . .

# 5. Expose the port the app runs on
EXPOSE 3000

# 6. Define the command to run the app
CMD ["node", "app.js"]
```
