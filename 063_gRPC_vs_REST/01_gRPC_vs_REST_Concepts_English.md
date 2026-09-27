# gRPC vs REST

## The Problem with REST
REST (Representational State Transfer) is the standard for web APIs. It uses JSON over HTTP/1.1. 
However, for internal Microservice-to-Microservice communication, REST has drawbacks:
1. **JSON is bloated**: JSON is text-based. It requires parsing strings, matching brackets, and converting data types (like parsing the string `"123"` into an integer), which is slow and wastes CPU cycles.
2. **No Strict Contract**: In REST, you don't strictly know what the JSON response will look like unless you use third-party tools like OpenAPI/Swagger.

## Enter gRPC
Created by Google, gRPC (gRPC Remote Procedure Calls) is a modern, high-performance framework designed specifically for internal microservice communication.

1. **Protocol Buffers (Protobuf)**: Instead of JSON, gRPC uses Protobuf. You define your data structure in a `.proto` file. The framework then compiles this into binary format. Binary is incredibly small, fast to transmit, and requires almost zero parsing by the CPU.
2. **Strict Contracts**: The `.proto` file acts as a strict, unbreakable contract between the client and server. It auto-generates the client code in any language (Go, Python, Java, Node.js).
3. **HTTP/2 by Default**: REST traditionally uses HTTP/1.1 (one request per connection). gRPC requires HTTP/2, which supports multiplexing (sending multiple parallel requests over a single TCP connection) and bidirectional streaming.

## When to use which?
- **REST**: Use for external public APIs, browser clients, and mobile apps. Browsers have limited support for raw HTTP/2 and gRPC.
- **gRPC**: Use for internal, backend-to-backend microservice communication where high performance, low latency, and strict type-safety are critical.
