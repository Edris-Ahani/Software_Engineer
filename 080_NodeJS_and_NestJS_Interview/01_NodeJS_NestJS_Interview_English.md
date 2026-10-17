# Interview Questions: Node.js & NestJS

A focused set of backend interview questions covering **only** the features and characteristics of the Node.js runtime and the NestJS framework.

---

# Part 1: Node.js

## 1. Runtime & Architecture

### 1. What is Node.js, and how does it differ from browser JavaScript?
**Expected answer:** Node.js is a V8-based runtime for JavaScript outside the browser. It provides filesystem, networking, process, and system APIs, but no DOM/`window`.

### 2. Why is Node.js called single-threaded?
**Expected answer:** Application JavaScript typically runs on one main thread via the Event Loop. Heavy I/O is offloaded through libuv (and a thread pool) so the main thread stays non-blocking.

### 3. What is libuv’s role?
**Expected answer:** libuv provides the async I/O abstraction: Event Loop, thread pool, timers, filesystem, sockets, and other OS APIs.

### 4. Concurrency vs parallelism in Node.js?
**Expected answer:** The Event Loop gives high I/O concurrency. True CPU parallelism usually needs Worker Threads, child_process, or cluster.

### 5. When is Node.js a poor fit?
**Expected answer:** Long CPU-bound work on the main thread blocks the Event Loop and harms latency for all requests.

---

## 2. Event Loop & Scheduling

### 6. How does the Event Loop work?
**Expected answer:** It cycles through phases (timers, pending callbacks, idle/prepare, poll, check, close callbacks) and executes ready callbacks without blocking on I/O waits.

### 7. `process.nextTick` vs Promise microtasks vs `setTimeout` vs `setImmediate`?
**Expected answer:**
- `process.nextTick`: runs before the Event Loop continues to the next phase.
- Promise microtasks: drained after the current synchronous code.
- `setTimeout(fn, 0)`: timers phase after the delay.
- `setImmediate`: check phase.

### 8. What happens if `nextTick` recursively schedules more `nextTick`s?
**Expected answer:** Possible Event Loop starvation; later phases are delayed.

### 9. Microtasks vs macrotasks?
**Expected answer:** Microtasks (Promises; nextTick has special high priority behavior) are drained with higher priority than many macrotasks like timers/`setImmediate`.

### 10. What is Event Loop lag?
**Expected answer:** Delay between expected and actual callback execution; a signal that the loop is blocked.

---

## 3. Async: Callbacks, Promises, async/await

### 11. What is callback hell, and how do you avoid it?
**Expected answer:** Deep nested callbacks. Prefer Promises, async/await, smaller functions, and clearer control flow.

### 12. `Promise.all` vs `allSettled` vs `race` vs `any`?
**Expected answer:**
- `all`: fails fast on first rejection.
- `allSettled`: waits for all outcomes.
- `race`: first settled result.
- `any`: first fulfillment; `AggregateError` if all reject.

### 13. Why do async functions always return Promises?
**Expected answer:** async/await is Promise-based; plain returns are wrapped.

### 14. What happens to an uncaught error inside an async function?
**Expected answer:** It becomes a rejected Promise; without handling it may surface as `unhandledRejection`.

### 15. Sequential `await` vs parallel Promise startup?
**Expected answer:** Sequential await is serial. Start work concurrently, then await `Promise.all` (or similar).

---

## 4. Modules & Packages

### 16. CommonJS vs ES Modules?
**Expected answer:** CJS uses `require`/`module.exports`; ESM uses `import`/`export`, is the language standard, and supports top-level await with more static analysis.

### 17. How do you mark a file/project as ESM or CJS?
**Expected answer:** `package.json` `"type"`, and/or `.mjs` / `.cjs` extensions.

### 18. What does require caching mean?
**Expected answer:** Modules are evaluated once and reused from `require.cache`.

### 19. What goes wrong with circular dependencies?
**Expected answer:** One side may observe partial exports before initialization finishes.

### 20. Important `package.json` fields?
**Expected answer:** `main`, `exports`, `type`, `engines`, scripts, dependencies — entrypoints, public API surface, module system, and runtime constraints.

---

## 5. Streams, Buffers & Data

### 21. Why are Streams important?
**Expected answer:** Process data incrementally without loading everything into memory.

### 22. Main stream types?
**Expected answer:** Readable, Writable, Duplex, Transform.

### 23. What is backpressure?
**Expected answer:** Producer outpacing consumer; flow must be controlled (`write` return value, `pipeline`, etc.) to avoid memory blowups.

### 24. `fs.readFile` vs `fs.createReadStream`?
**Expected answer:** Whole-file load vs chunked reading for large files.

### 25. What is a Buffer?
**Expected answer:** Node’s binary byte container for files, network payloads, crypto, etc.

### 26. Buffer misuse risks?
**Expected answer:** Incorrect sizing/copying or unsafe allocation patterns can leak or corrupt data.

---

## 6. Events, Process & Multiprocessing

### 27. What is EventEmitter?
**Expected answer:** Built-in pub/sub (`on`, `emit`, `once`, `off`) used widely across Node APIs.

### 28. EventEmitter memory leaks?
**Expected answer:** Adding listeners without removal on long-lived emitters.

### 29. Worker Threads vs child_process vs cluster?
**Expected answer:**
- Worker Threads: in-process parallelism for CPU work via messaging/shared memory patterns.
- child_process: separate OS processes.
- cluster: multi-process scaling of a Node server across CPU cores.

### 30. `nextTick` priority vs `setImmediate`?
**Expected answer:** nextTick before continuing loop phases; setImmediate in check phase.

### 31. Important process signals/events?
**Expected answer:** `SIGINT`, `SIGTERM`, `exit`, `uncaughtException`, `unhandledRejection` — key for graceful shutdown.

### 32. What is graceful shutdown?
**Expected answer:** Stop accepting new work, finish in-flight requests, close connections, then exit cleanly.

---

## 7. Networking, HTTP & Performance

### 33. What does the `http` module provide?
**Expected answer:** HTTP servers/clients, request/response handling, headers, status codes, streamed bodies.

### 34. Why are sync APIs dangerous in servers?
**Expected answer:** They block the Event Loop and stall concurrent requests.

### 35. Blocking vs non-blocking I/O?
**Expected answer:** Blocking waits in place; non-blocking registers work and continues, completing later via callback/Promise.

### 36. Common Node performance techniques?
**Expected answer:** Avoid CPU blocking, use streams, caching, connection pooling, clustering, workers for heavy CPU, and profile Event Loop delay/memory.

### 37. V8’s performance role?
**Expected answer:** JIT compilation, optimizing hot functions, GC — bad patterns can defeat optimizations.

### 38. GC basics you should know?
**Expected answer:** Generational heap, pause behavior, leak sources (closures, caches, listeners), heap monitoring.

---

## 8. Errors, Runtime Hygiene & Tooling

### 39. Synchronous `throw` vs Promise rejection?
**Expected answer:** Uncaught throw → `uncaughtException`; unhandled reject → `unhandledRejection`.

### 40. Should you keep the process alive after `uncaughtException`?
**Expected answer:** Usually no; state may be corrupted. Log and shut down gracefully.

### 41. npm scripts, npx, lockfiles?
**Expected answer:** Task runners, package binary execution, reproducible installs.

### 42. What does `NODE_ENV` typically affect?
**Expected answer:** Production vs development behavior: caching, logging verbosity, error exposure, optimizations.

---

# Part 2: NestJS

## 9. Core Architecture

### 43. What problem does NestJS solve?
**Expected answer:** Structured, modular, testable Node apps with strong DI and TypeScript-first architecture (Angular-inspired).

### 44. Core building blocks?
**Expected answer:** Modules, Controllers, Providers/Services, plus Guards, Interceptors, Pipes, Filters, Middleware.

### 45. Controller vs Service responsibilities?
**Expected answer:** Controllers handle transport input/routing; services own business logic. Keep controllers thin.

### 46. What does `@Module()` declare?
**Expected answer:** `imports`, `controllers`, `providers`, `exports`.

### 47. Why do `exports` matter?
**Expected answer:** Encapsulation — only exported providers are injectable in other modules.

### 48. What does `NestFactory.create` do?
**Expected answer:** Bootstraps the app, builds the DI graph, loads the root module, prepares the HTTP adapter (Express/Fastify).

---

## 10. Dependency Injection

### 49. How does DI work in Nest?
**Expected answer:** IoC container resolves constructor dependencies and manages provider lifetimes.

### 50. Provider scopes?
**Expected answer:** Singleton (default), REQUEST, TRANSIENT.

### 51. When do you need REQUEST scope?
**Expected answer:** Per-request state (user/request context) that must not live in a shared singleton.

### 52. Custom provider styles?
**Expected answer:** `useClass`, `useValue`, `useFactory`, `useExisting`.

### 53. What is an injection token?
**Expected answer:** The DI key for a provider — needed for interfaces, config values, and abstracting implementations (`@Inject`).

### 54. What does `forwardRef` solve?
**Expected answer:** Circular module/provider references during bootstrap.

### 55. `@Optional()` dependency behavior?
**Expected answer:** Missing provider injects nullish instead of failing bootstrap.

---

## 11. Request Pipeline

### 56. Approximate HTTP pipeline order?
**Expected answer:** Middleware → Guards → Interceptors (pre) → Pipes → Handler → Interceptors (post) → Exception Filters on errors.

### 57. Middleware role?
**Expected answer:** Early request processing (logging, parsing, metrics), function or class-based, Express-compatible style.

### 58. Guard vs Middleware?
**Expected answer:** Guards make authz/authn decisions with ExecutionContext and decorator metadata; middleware is lower-level and earlier.

### 59. What does `CanActivate` return?
**Expected answer:** boolean (or Promise/Observable of boolean). False denies the route.

### 60. Interceptor use cases?
**Expected answer:** Response mapping, timing logs, caching, timeouts, cross-cutting before/after handler logic via RxJS.

### 61. Why RxJS in interceptors?
**Expected answer:** Handler results are composed as Observables; operators transform/catch the stream.

### 62. What are Pipes?
**Expected answer:** Validation/transformation of inbound data (`ParseIntPipe`, `ValidationPipe`, custom pipes).

### 63. ValidationPipe companions?
**Expected answer:** `class-validator` + `class-transformer` on DTO classes.

### 64. `transform` vs `whitelist`?
**Expected answer:** `transform` instantiates DTO classes; `whitelist` strips non-decorated properties.

### 65. Exception Filters?
**Expected answer:** Centralize error response shape; global or `@Catch(SpecificError)`.

### 66. Why `HttpException` / custom exceptions?
**Expected answer:** Consistent status codes and error payloads across the API.

---

## 12. Decorators, Context & Framework Features

### 67. Common controller decorators?
**Expected answer:** `@Controller`, HTTP method decorators, `@Body`, `@Param`, `@Query`, `@Headers`, `@Req`, `@Res`, `@HttpCode`, `@Header`.

### 68. What is ExecutionContext?
**Expected answer:** Abstraction over HTTP/RPC/WS execution for guards/interceptors/filters to inspect class/handler/args.

### 69. What is Reflector for?
**Expected answer:** Reading custom decorator metadata (e.g., roles).

### 70. How do you build custom decorators?
**Expected answer:** `createParamDecorator` for params; `SetMetadata` + Reflector for route/class metadata.

### 71. Caveat when using `@Res()`?
**Expected answer:** You may bypass Nest’s automatic response handling unless `passthrough: true`.

### 72. Role of DTOs?
**Expected answer:** Input/output contracts, validation, docs, decoupling transport shape from domain entities.

---

## 13. Dynamic Modules, Config & Lifecycle

### 73. What is a Dynamic Module?
**Expected answer:** Runtime-configurable module via `forRoot` / `forRootAsync` / `register`.

### 74. `forRoot` vs `forFeature`?
**Expected answer:** Global one-time setup vs feature-level registration of entities/providers.

### 75. ConfigModule / ConfigService?
**Expected answer:** Load env/files and inject typed config, optionally with schema validation.

### 76. Important lifecycle hooks?
**Expected answer:** `onModuleInit`, `onApplicationBootstrap`, `onModuleDestroy`, `beforeApplicationShutdown`, `onApplicationShutdown`.

### 77. Practical hook uses?
**Expected answer:** Connect resources on boot; flush/close connections on shutdown.

---

## 14. Advanced Framework Capabilities

### 78. Nest microservices support?
**Expected answer:** `createMicroservice` with transports (TCP, Redis, NATS, RabbitMQ, Kafka) and `@MessagePattern` / `@EventPattern`.

### 79. Hybrid application?
**Expected answer:** Same process serves HTTP and additional microservice transports.

### 80. What are Gateways?
**Expected answer:** WebSocket layer (`@WebSocketGateway`, `@SubscribeMessage`).

### 81. GraphQL modes in Nest?
**Expected answer:** Schema-first and code-first, with DI-friendly resolvers.

### 82. API versioning?
**Expected answer:** `enableVersioning` with URI/header/media-type strategies.

### 83. Cache, scheduling, queues?
**Expected answer:** `CacheModule`, `@nestjs/schedule`, and queue integrations (e.g., Bull ecosystem modules).

### 84. CQRS idea in Nest?
**Expected answer:** Separate command and query handlers for clearer domain flow.

### 85. Swagger integration?
**Expected answer:** `@nestjs/swagger` decorators + `SwaggerModule.setup`.

---

## 15. Testing Features

### 86. What is TestingModule?
**Expected answer:** Test bootstrap utility to compose isolated modules and mock providers.

### 87. How do you replace dependencies in tests?
**Expected answer:** `overrideProvider` / `useValue` / `useFactory` in `Test.createTestingModule`.

### 88. Unit vs e2e in Nest?
**Expected answer:** Unit tests mock collaborators; e2e boots the app and hits HTTP endpoints.

### 89. Why is Nest test-friendly?
**Expected answer:** DI and module boundaries make substitution and layer isolation straightforward.

---

## 16. Senior Feature-Focused Combos

### 90. Singleton depending on REQUEST-scoped provider?
**Expected answer:** Scope mismatch — redesign or use Nest-supported patterns; don’t casually mix lifetimes.

### 91. One-liner responsibilities?
**Expected answer:** Guard = access control; Pipe = validate/transform input; Interceptor = cross-cutting before/after + response shaping.

### 92. Implementing response-time logging with Nest features?
**Expected answer:** Prefer a global Interceptor; optionally Middleware for earlier timing.

### 93. Filter vs interceptor `catchError`?
**Expected answer:** Filters are the standard error-response boundary; interceptor `catchError` handles RxJS-stream recovery/transform earlier.

### 94. Keeping modules loosely coupled?
**Expected answer:** Export only what is needed, keep shared modules thin, treat `forwardRef` as a last resort.

### 95. Configurable internal library bootstrap?
**Expected answer:** Dynamic module `forRootAsync` with `useFactory` + injected `ConfigService`.

---

## Quick Revision Checklist

**Node.js:** Event Loop, libuv, nextTick vs timers, Promise combinators, CJS/ESM, Stream/Buffer, EventEmitter, Workers/cluster, graceful shutdown.

**NestJS:** Module/Controller/Provider, DI scopes, Middleware/Guard/Interceptor/Pipe/Filter order, DTO + ValidationPipe, Dynamic Modules, lifecycle hooks, microservice/WS/GraphQL features, TestingModule.
