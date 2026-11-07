# Interview Questions: Node.js & NestJS

A bilingual interview guide from junior fundamentals to senior production scenarios: JavaScript/TypeScript, the Node.js runtime, NestJS, and their backend integrations. No fixed list can cover every interview; practise explaining decisions, failure modes, and tradeoffs as well as definitions.

Sections 1–16 retain the original 95 questions and runnable examples `001`–`016`. Sections 17–32 extend the bank to **223 questions**. Extra demos `017`–`020` cover selected cross-cutting topics; section numbers after 16 do not map one-to-one to demo numbers. See [the run guide](00_HOW_TO_RUN_Persian.md).

**Version context:** Examples use the existing NestJS 10 / Express 4 / TypeScript 5 dependencies and Node.js 20.19+ APIs. This is an example compatibility baseline; choose a currently supported Node release for production. NestJS 11 / Express 5 differences are called out separately. This expansion does not upgrade dependencies.

**Study route:** Junior: 1–12, 17–18, 22. Mid-level: add 13–15, 19–21, 23–26, 29. Senior: add 16, 27–28, 30–32. The final sections include exercises and incident scenarios.

---

# Part 1: Node.js

## 1. Runtime & Architecture

### 1. What is Node.js, and how does it differ from browser JavaScript?
**Expected answer:** Node.js is a V8-based runtime for JavaScript outside the browser. It provides filesystem, networking, process, and system APIs, but no DOM/`window`.

### 2. Why is Node.js called single-threaded?
**Expected answer:** JavaScript runs on one thread per isolate by default, while Node also uses OS facilities, libuv workers, and V8 background threads. Network I/O generally uses OS readiness/completion mechanisms; asynchronous filesystem work, `dns.lookup`, and some crypto/zlib APIs use the libuv pool. Not every async operation needs a worker. Worker Threads add independent JavaScript isolates.

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
**Expected answer:** Promise callbacks and `queueMicrotask` use the microtask queue; `process.nextTick` has a separate Node-specific queue. At ordinary CJS callback boundaries, nextTick runs before Promise microtasks; ESM top-level evaluation can change the observed order. Timers and immediates belong to Event Loop phases; “macrotask” is a teaching shorthand. Both recursively replenished queues can starve I/O.

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
**Expected answer:** CJS uses `require`/`module.exports`; ESM uses `import`/`export`, live bindings, and top-level await. `exports` initially aliases module.exports: assigning `exports = value` does not replace the exported value. CJS exposes `__dirname`/`__filename`; ESM uses import.meta-based equivalents appropriate to the Node version. `process.cwd()` is the working directory, not the module directory.

### 17. How do you mark a file/project as ESM or CJS?
**Expected answer:** `package.json` `"type"`, and/or `.mjs` / `.cjs` extensions.

### 18. What does require caching mean?
**Expected answer:** Modules are evaluated once and reused from `require.cache`.

### 19. What goes wrong with circular dependencies?
**Expected answer:** CJS cycles can expose partially initialized exports. ESM uses live bindings and may throw a temporal-dead-zone `ReferenceError` when a binding is read too early. Break the cycle by extracting a shared contract or changing dependency direction; file reordering is fragile.

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
**Expected answer:** Become unready, stop accepting new work, drain requests/jobs within a deadline, close dependencies and flush telemetry. Prefer natural exit with `process.exitCode`; immediate `process.exit()` can truncate pending output. Force termination only after the shutdown deadline. `exit` listeners cannot finish asynchronous cleanup.

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
**Expected answer:** An uncaught synchronous throw can reach uncaughtException; an unhandled rejected Promise triggers rejection handling. In modern Node, the default unhandled-rejections policy can escalate an unhandled rejection to a fatal exception; flags/listeners affect the behavior. `try/catch` only handles a rejection when the Promise is awaited or otherwise connected to that control flow.

### 40. Should you keep the process alive after `uncaughtException`?
**Expected answer:** Usually no; state may be corrupted. Log and shut down gracefully.

### 41. npm scripts, npx, lockfiles?
**Expected answer:** Scripts run project tasks using local binaries; npx/npm exec may download a missing package, so do not run unknown names blindly. npm install may update the lockfile; npm ci requires consistency and recreates node_modules. dependencies are runtime needs, devDependencies build/test tools, peerDependencies host compatibility constraints. Semver ranges permit upgrades; the lockfile records the resolved dependency tree.

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
**Expected answer:** A missing optional dependency is injected as `undefined` instead of failing resolution. The consumer must handle that case. Optional injection is not a reason to silently ignore required infrastructure.

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
**Expected answer:** `transform` returns transformed values/DTO instances; `whitelist` removes properties without class-validator decorators. `forbidNonWhitelisted: true` rejects such fields instead. Type declarations alone do not validate input, and validation decorators must match the accepted contract. Nested DTOs need explicit nested validation and type metadata.

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
**Expected answer:** These are naming conventions, not reserved framework methods: `forRoot` usually configures shared infrastructure and `forFeature` registers feature-specific providers. A module is global only when explicitly configured as global; calling `forRoot` does not make it global or automatically enforce one call.

### 75. ConfigModule / ConfigService?
**Expected answer:** Load env/files and inject typed config, optionally with schema validation.

### 76. Important lifecycle hooks?
**Expected answer:** `onModuleInit`, `onApplicationBootstrap`, `onModuleDestroy`, `beforeApplicationShutdown`, `onApplicationShutdown`. Call `enableShutdownHooks()` to react to supported process signals; `app.close()` also triggers shutdown hooks. Request-scoped classes do not participate in these application lifecycle hooks. Signal support differs on Windows.

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
**Expected answer:** REQUEST scope bubbles up the injection chain: a default-scoped consumer and dependent controller become effectively request-scoped. This is supported, but increases per-request allocations; unrelated providers remain singletons. TRANSIENT dependencies do not automatically make consumers transient. Use explicit context parameters or AsyncLocalStorage where appropriate. See [injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes).

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

# Part 3: Language Fundamentals and Deeper Node.js

## 17. JavaScript Fundamentals

### 96. `var`, `let`, `const`, hoisting, and the temporal dead zone?
**Expected answer:** `var` is function-scoped and initialized to `undefined`; `let`/`const` are block-scoped and inaccessible before initialization. `const` prevents rebinding, not object mutation. `let` creates per-iteration bindings in loops, unlike a shared `var` binding captured by callbacks.

### 97. How do closures help, and how can they retain memory?
**Expected answer:** A function retains access to its lexical environment after the outer call returns. Closures implement factories and encapsulation, but retained callbacks can keep large reachable objects alive. Release listeners/timers and inspect retaining paths; a closure is not inherently a leak.

### 98. How is `this` determined? Arrow vs regular functions?
**Expected answer:** A regular function's `this` depends on its call site; a detached method loses its receiver. `call`, `apply`, and `bind` supply a receiver. Arrows capture lexical `this` and cannot be rebound or constructed. Passing a class method as a callback often needs binding or a wrapper.

### 99. How do prototypes, classes, and inheritance work?
**Expected answer:** Property lookup walks the prototype chain. Class instance methods normally live on the prototype; arrow fields create functions per instance. `class` adds syntax and semantics over prototype-based inheritance. Distinguish own properties from inherited ones using `Object.hasOwn`; composition often avoids brittle inheritance chains.

### 100. `===`, `==`, `Object.is`, `null`, and `undefined`?
**Expected answer:** `===` avoids type coercion; object equality compares identity. `Object.is` treats `NaN` as equal to itself and distinguishes signed zero. `undefined` often means absent/unassigned; `null` is explicit absence. `??` defaults only for nullish values, while `||` also replaces valid `0`, `false`, and empty strings.

### 101. Shallow vs deep copying, and `structuredClone` limitations?
**Expected answer:** Spread and `Object.assign` copy one level, leaving nested references shared. JSON roundtripping loses types and fails on cycles/BigInt. `structuredClone` supports cycles and many built-ins, but not functions and arbitrary class behavior. Copying is distinct from freezing; `Object.freeze` is shallow too.

### 102. When should you use Object, Map, Set, or WeakMap?
**Expected answer:** Objects model records; Map supports arbitrary key identities and explicit size/iteration; Set deduplicates values by its equality rules. WeakMap keys do not keep otherwise unreachable objects alive and cannot be enumerated. None provides structural equality for separate object instances. Choose by access pattern and ownership.

### 103. How do destructuring, rest/spread, and optional chaining fail unexpectedly?
**Expected answer:** Destructuring defaults apply to `undefined`, not `null`; spreading nested objects is shallow. Optional chaining protects only the guarded path, not validation of an external payload. `a?.b` still fails if `a` is undeclared. Avoid silently defaulting a missing required field into an apparently valid request.

---

## 18. TypeScript for NestJS

### 104. `type` vs `interface` vs runtime class?
**Expected answer:** Types and interfaces describe compile-time shapes and disappear at runtime. Interfaces support declaration merging; aliases also express unions and mapped types. Classes have runtime constructors, so Nest can use them as DI tokens and DTO metadata. An interface needs an explicit runtime injection token.

### 105. `any`, `unknown`, `never`, and narrowing?
**Expected answer:** `any` disables checking; `unknown` requires validation/narrowing before use. `never` represents impossible values or functions that never return and supports exhaustive checks. Treat JSON, message payloads, and caught exceptions as untrusted values; narrow with actual checks rather than asserting the desired type.

### 106. What do generics solve, and what do they not solve?
**Expected answer:** Generics preserve relationships between input and output types and constrain reusable APIs. A generic repository can express `Promise<T>`, but `T` is erased: it cannot automatically validate JSON or become runtime decorator metadata. Supply a constructor or schema when runtime behavior needs a concrete type.

### 107. `Partial`, `Pick`, `Omit`, `Readonly`, and Nest mapped DTOs?
**Expected answer:** TypeScript utilities only change static types. Nest `PartialType`, `PickType`, and `OmitType` create DTO classes and can preserve relevant decorator metadata. Choose the package appropriate to plain validation, Swagger, or GraphQL. `Partial`/`Readonly` are shallow; optional PATCH fields still need validation and explicit authorization.

### 108. Union vs intersection and discriminated unions?
**Expected answer:** `A | B` means one allowed variant; `A & B` requires both contracts. A literal field such as `kind` lets a switch narrow each variant safely. An exhaustive `never` branch catches newly added variants. Static exhaustiveness cannot protect a malformed message unless its runtime discriminator is validated first.

### 109. How do decorators and emitted metadata power Nest?
**Expected answer:** Decorators attach metadata that Nest reads to register routes/providers. This project's legacy decorator configuration uses `experimentalDecorators`, `emitDecoratorMetadata`, and `reflect-metadata`. Interfaces/generics do not supply runtime constructors; `import type` also erases values. Standard JavaScript decorators and this legacy setup are not drop-in interchangeable.

### 110. Why does transpiling TypeScript not guarantee correctness?
**Expected answer:** Transpilation can remove types without checking them. `ts-node --transpile-only`, used by the original demos, does exactly that. Run `tsc --noEmit` separately with strict checking; `as`, non-null assertions, and definite-assignment assertions suppress compiler concerns but perform no runtime validation.

### 111. Do `paths`, `target`, and `module` change runtime resolution?
**Expected answer:** `target` controls emitted syntax and `module` controls module output. `paths` helps TypeScript resolve aliases but does not generally rewrite emitted imports; configure the runtime/bundler too. Align Node package type, module resolution, and output extensions. `lib`/`@types` declarations do not polyfill missing runtime APIs.

---

## 19. Cancellation, Scheduling, and Concurrency Limits

### 112. Does `await` block Node? Does creating a Promise start a thread?
**Expected answer:** `await` suspends that async function, allowing other callbacks to run; CPU work before or after it still blocks its thread. A Promise executor runs synchronously. Promises represent eventual completion; the underlying API decides whether work uses the OS, a pool, or the current thread.

### 113. Why is `forEach(async ...)` usually a bug?
**Expected answer:** `forEach` ignores callback return values, so it does not await promises or aggregate failures. Use `for...of` for ordered sequential work, `map` plus `Promise.all` for bounded-size independent sets, or a worker pool for large sets. Catch errors at the level owning the full operation.

### 114. Why is `Promise.race` not a timeout/cancellation solution by itself?
**Expected answer:** It settles the wrapper but does not stop losing operations. Use `AbortController`/`AbortSignal` with an API that supports cancellation, and clean up timers/listeners. Cancellation is cooperative and may not undo a remote side effect already committed; a retry may need an idempotency key.

### 115. How do you limit 10,000 outbound requests to ten at a time?
**Expected answer:** Use a fixed worker pool or semaphore with at most ten in-flight operations and a bounded input queue. Preserve required result ordering, define failure/cancellation policy, and release permits in `finally`. Concurrency limits simultaneous work; rate limiting limits starts over time. Eager `Promise.all` does neither.

### 116. How do you design safe retries?
**Expected answer:** Retry transient failures within an overall deadline and attempt limit, with exponential backoff and jitter. Honor `Retry-After` when applicable. Do not retry validation failures or non-idempotent side effects indiscriminately. Retrying at every service layer can multiply load; identify which layer owns the retry budget.

### 117. Can a single-threaded Node program have race conditions?
**Expected answer:** Yes. Two handlers can read the same balance, await, then overwrite one another. An in-process mutex only coordinates that process. Use a database atomic update, uniqueness constraint, optimistic version check, or transaction with suitable locking/isolation across replicas. Serial JavaScript execution does not make multi-step I/O atomic.

### 118. What are `util.promisify` and error-first callbacks?
**Expected answer:** Conventional callbacks receive `(error, result)` and should be invoked once. `promisify` adapts compatible APIs; preserve the receiver when wrapping methods and handle custom/nonstandard callback signatures explicitly. A synchronous `try/catch` around scheduling a callback cannot catch an exception thrown later inside that callback.

### 119. When should CPU work yield, and what keeps a process alive?
**Expected answer:** Chunk moderate work and yield with `setImmediate`; `await Promise.resolve()` only yields to microtasks and can still starve I/O. Use pooled workers for sustained CPU work. Active referenced handles keep Node alive; a pending Promise alone does not. Timer `unref()` allows exit but does not cancel the timer.

Selected practice: [`017_async_control/index.js`](017_async_control/index.js). Runtime reference: [Node globals and cancellation](https://nodejs.org/api/globals.html).

---

## 20. Deeper Runtime, Modules, Streams, and Diagnostics

### 120. How does async context propagate across requests?
**Expected answer:** `AsyncLocalStorage.run` attaches a store to the async work created within its callback, allowing correlation IDs without threading a parameter through every call. Avoid a global mutable current-user variable. Custom callbacks can lose context and may require AsyncResource; worker/process boundaries require explicit propagation.

### 121. How would you diagnose rising memory?
**Expected answer:** Track RSS, heapUsed/heapTotal, external memory, and arrayBuffers across comparable load and GC cycles. RSS growth alone does not prove a JavaScript heap leak. Compare heap retaining paths and allocation profiles; bound caches and remove retained listeners. Heap snapshots can pause execution and contain sensitive data.

### 122. `write(false)`, `drain`, `highWaterMark`, and `pipeline`?
**Expected answer:** A false write result means stop writing until `drain`; the chunk was accepted. `highWaterMark` is a buffering threshold, not a hard memory cap, and counts objects in object mode. `pipeline` coordinates backpressure, failures, and teardown. Never ignore rejected pipeline promises or stream cancellation during HTTP delivery.

### 123. Why can decoding each Buffer chunk corrupt UTF-8?
**Expected answer:** A character's bytes can span chunks; decoding each independently can insert replacement characters. Use `StringDecoder` or streaming `TextDecoder`. `Buffer.subarray` shares backing memory, while `Buffer.from(buffer)` copies bytes. A string's `.length` counts UTF-16 code units; `Buffer.byteLength` measures encoded bytes.

### 124. Does EventEmitter await async listeners? What about `'error'`?
**Expected answer:** Ordinary `emit` invokes listeners synchronously in registration order and does not await returned promises. An unhandled `'error'` event throws. Explicitly handle async listener failures or configure `captureRejections` appropriately. A listener-count warning is a diagnostic signal, not a hard listener cap; increasing it does not fix a leak.

### 125. `spawn`, `exec`, `execFile`, worker transfer, and pool sizing?
**Expected answer:** `spawn` streams child output; `exec` runs through a shell and buffers output; `execFile` runs an executable directly by default. Avoid shell interpolation of input. Workers can clone, transfer ownership of transferable buffers, or share SharedArrayBuffer with Atomics. Pool sizing must reflect CPU/memory limits and queue pressure.

### 126. What makes CJS/ESM interop and package installation tricky?
**Expected answer:** ESM has URL-based resolution and explicit relative extensions; CJS and ESM maintain different caches. Use `import()` when appropriate; modern `require(ESM)` support is version-dependent and cannot synchronously load graphs requiring top-level await. Respect package `exports`. `npm ci` enforces lockfile consistency; install scripts still run unless disabled.

### 127. How do timer ordering, DNS, and HTTP clients affect latency?
**Expected answer:** Top-level timer/immediate order is not a portable guarantee; inside an I/O callback, immediate normally precedes a newly scheduled timer. libuv 1.45 changed timer handling. `dns.lookup` competes for pool capacity unlike `dns.resolve`. Tune connection reuse and deadlines; built-in fetch uses Undici, not `http.globalAgent`, and HTTP error statuses do not reject fetch.

Selected practice: [`018_context_streams/index.js`](018_context_streams/index.js). References: [async context](https://nodejs.org/api/async_context.html), [streams](https://nodejs.org/api/stream.html), [Event Loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick).

---

## 21. Runtime and API Security

### 128. How do you prevent command injection and unsafe file access?
**Expected answer:** Prefer fixed executables and argument arrays without a shell; validate allowed operations. For user-controlled paths, resolve against an allowed root and verify path boundaries, including symlink escape where relevant. String concatenation, `path.join`, and a naive prefix check alone do not establish containment.

### 129. What is SSRF in a Node HTTP client?
**Expected answer:** User-supplied URLs can access internal services or metadata endpoints. Restrict schemes/destinations, account for DNS resolution, redirects, alternate IP forms, and rebinding, and enforce outbound network policy. Limit response size and duration. Checking the initial URL string alone does not secure later connections or redirects.

### 130. What can block Node besides an obvious CPU loop?
**Expected answer:** Catastrophic regex backtracking, large JSON parse/stringify, synchronous crypto/compression, huge validation payloads, and excessive logging. Put limits on bytes, nesting, batch sizes, and execution time; profile before offloading. Moving work into an async function does not move CPU work off the main thread.

### 131. Why are prototype pollution and mass assignment different concerns?
**Expected answer:** Unsafe merging of untrusted keys can alter object prototypes and inherited behavior. Mass assignment accepts fields such as `isAdmin` that callers should not control. Use safe data structures, explicit field mappings, DTO allowlists, and object-level authorization. Validation of a field's type does not grant permission to change it.

### 132. CORS, CSRF, and security headers: which problem does each solve?
**Expected answer:** CORS controls browser access to cross-origin responses; it is not authentication or a general server firewall. Cookie-authenticated state changes may need CSRF tokens and origin checks alongside SameSite settings. Security headers reduce browser attack surface but do not fix authorization. Credentialed CORS needs an explicit trusted origin policy.

### 133. How should passwords, tokens, and secrets be handled?
**Expected answer:** Passwords need a purpose-built salted password hash such as Argon2id with tuned cost; ordinary fast hashes are unsuitable. Use cryptographically secure randomness for tokens, hash stored opaque credentials where appropriate, rotate keys, and redact logs. JWT signing is integrity, not encryption; do not put secrets in readable claims.

### 134. How do you validate an uploaded file safely?
**Expected answer:** Bound size, count, processing time, and decompressed expansion; inspect content instead of trusting filename/MIME alone. Generate storage keys, prevent executable delivery, scan where required, and authorize downloads. Stream large bodies. Nest's Multer-based Express integration is not automatically compatible with Fastify; choose adapter-specific tooling.

### 135. What does dependency and production hardening involve?
**Expected answer:** Reproducible lockfiles, reviewed upgrades/install scripts, minimal privileges, patched supported runtimes, and restricted diagnostics access. Audit findings need exploitability assessment; a clean audit is not proof of safety. Do not expose inspector ports publicly. Limit request bodies, header handling, and timeouts at both proxy and app layers.

Reference: [Node security guidance](https://nodejs.org/learn/getting-started/security-best-practices). For deeper background see the repository's chapters 014, 034, and 054–056.

---

# Part 4: Production NestJS and Backend Integrations

## 22. DTOs, Validation, Serialization, and HTTP

### 136. Why does a DTO interface not validate an HTTP body?
**Expected answer:** Interfaces are erased. Use a runtime DTO class/schema plus an enabled validation pipe; class-validator needs validation decorators. `@ApiProperty` describes OpenAPI and is not a validation rule. A return type annotation also does not sanitize or validate the actual response at runtime.

### 137. How are nested objects and arrays validated?
**Expected answer:** For class-based DTOs use `@ValidateNested` and `@Type(() => ChildDto)`; arrays typically need `{ each: true }` plus array/size constraints. Validate primitive arrays explicitly and use ParseArrayPipe or a wrapper DTO where appropriate. TypeScript `ChildDto[]` alone provides insufficient runtime item metadata.

### 138. What are dangerous automatic input conversions?
**Expected answer:** Query/path values arrive as strings. Use deliberate DTO transforms/validators or explicit parsing, enums, and ranges. Generic Boolean conversion makes `"false"` truthy. A global transforming ValidationPipe can coerce typed primitive parameters before parameter pipes; then even ParseBoolPipe may see a boolean instead of the original invalid string. Demo `019` deliberately uses unknown metadata at this boundary so strict parameter pipes inspect original values.

### 139. How should PATCH handle absent fields vs null?
**Expected answer:** Missing means leave unchanged; null may mean clear the value if allowed. `@IsOptional` normally skips validation for both undefined and null, so a PartialType-based DTO may accept null unexpectedly. Encode the intended contract explicitly, reject updates to protected fields, and avoid passing a DTO wholesale into the ORM.

### 140. How do you keep passwords and internal fields out of responses?
**Expected answer:** Map to an explicit output DTO and/or use ClassSerializerInterceptor with correctly instantiated classes and exclusion rules. Returning an arbitrary plain object does not reliably apply class metadata. ORM entity shape is not the public API. Add a contract assertion that sensitive properties are absent, including nested relations.

### 141. Which HTTP and routing defaults matter in Nest interviews?
**Expected answer:** POST normally returns 201, most other handlers 200; 204 responses have no body. `@HttpCode`, headers, redirects, StreamableFile, global prefixes, and versioning change the contract. Check static vs parameterized route precedence. Express and Fastify differ; avoid leaking adapter-specific request/response assumptions into services.

### 142. How should webhook signatures and streamed responses be handled?
**Expected answer:** Verify webhook signatures against exact raw bytes before normalization, validate timestamp/replay rules, and acknowledge after durable acceptance. Configure Nest raw-body support with body-size limits. For streaming/SSE, handle disconnects and teardown, bound buffering, and configure proxy buffering/timeouts. A response already partially sent cannot become a fresh JSON error.

### 143. What changes when moving from NestJS 10 to 11?
**Expected answer:** Review the migration guide and compatible peer dependencies. Nest 11 uses Express 5 by default: wildcard routes and query parsing behavior change; it requires Node 20+. Cache integration changes also need attention. Keep these demos on their declared Nest 10 baseline; test routes, validation, errors, and serialization during a real migration.

Selected practice: [`019_nestjs_contracts/main.ts`](019_nestjs_contracts/main.ts). References: [validation](https://docs.nestjs.com/techniques/validation), [migration guide](https://docs.nestjs.com/migration-guide).

---

## 23. DI and Request Lifecycle in Depth

### 144. Why does “Nest can't resolve dependencies” occur?
**Expected answer:** Check the failing constructor index/token, provider registration, exports/imports, missing runtime types, duplicate package copies, and circular references. Registering the same class separately in feature modules can create separate instances. Import the owning module rather than duplicating a provider just to silence the error.

### 145. `useExisting` vs `useClass`, and async factories?
**Expected answer:** `useExisting` aliases an existing provider instance; `useClass` creates the provider for that registration and can yield a separate instance. `useFactory` can inject dependencies and await initialization. Export the token consumers need; provide a meaningful startup failure if required configuration or infrastructure is unavailable.

### 146. `ModuleRef.get` vs `resolve` and ContextIdFactory?
**Expected answer:** `get` retrieves static providers; `resolve` supports scoped providers in a DI context. Reuse the intended context ID to share scoped instances; independent contexts create independent instances. Register a request for a manually created context when injecting REQUEST. Do not use service-location everywhere instead of clear constructor dependencies.

### 147. Why use `APP_GUARD`, `APP_PIPE`, `APP_INTERCEPTOR`, or `APP_FILTER`?
**Expected answer:** Module-registered global enhancers participate in DI. Manually constructing one in `main.ts` bypasses constructor resolution unless dependencies are supplied explicitly. Guard return false normally produces 403; throw the appropriate authentication exception for 401. Plan public-route metadata and enhancer ordering deliberately.

### 148. What is the detailed order of guards, pipes, interceptors, and filters?
**Expected answer:** Incoming guards/interceptors generally run global → controller → route; interceptor response handling unwinds in reverse. Pipes also have parameter-level ordering details. Filters resolve from route toward global and do not behave as a normal chain of rethrows between filters. An interceptor cannot catch an earlier guard failure.

### 149. How are REQUEST and TRANSIENT lifetimes different in practice?
**Expected answer:** REQUEST follows the current request context and bubbles to dependent consumers; TRANSIENT gives distinct instances to different consumers without changing their own scopes. Injecting a transient into a singleton does not create a new transient on every method call. Keep gateways and recurring infrastructure providers singleton as required by their lifecycle.

### 150. How do Reflector metadata and global modules go wrong?
**Expected answer:** `getAllAndOverride` applies precedence; `getAllAndMerge` combines metadata, so choose based on authorization semantics. A global module reduces import repetition but must still be registered and export its providers. Hidden global dependencies and excessive shared modules weaken boundaries and make isolated tests harder.

### 151. Standalone app, lifecycle cleanup, and circular dependencies?
**Expected answer:** `createApplicationContext` boots DI without an HTTP server and must still be closed. Make cleanup idempotent and bounded; signals require shutdown hooks. `forwardRef` may break a framework resolution cycle but does not repair architectural coupling or every JavaScript initialization cycle. Prefer extracted contracts or an application orchestration service.

References: [injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes), [request lifecycle](https://docs.nestjs.com/faq/request-lifecycle).

---

## 24. Authentication and Authorization

### 152. Authentication vs authorization, and 401 vs 403?
**Expected answer:** Authentication establishes identity; authorization decides an action on a resource. Missing/invalid credentials normally yield 401; an authenticated caller lacking permission normally receives 403. A valid JWT is not proof that a user owns the requested record. Apply resource checks in services/repositories as well as route-level policy.

### 153. How do Passport strategies and guards cooperate in Nest?
**Expected answer:** A strategy extracts and validates credentials and returns the principal; the corresponding Passport guard invokes it and attaches the user to the request. Later guards/policies use that trusted principal. Keep password verification and token issuance in services; never trust a user ID or role simply supplied in a client header.

### 154. What must be validated on a JWT?
**Expected answer:** Verify the signature with trusted keys and an algorithm allowlist; enforce issuer, audience, expiry, and applicable not-before constraints. Plan clock tolerance and key rotation. Decoding is not verification. Stateless signature validity does not automatically reflect account suspension, token revocation, or permission changes.

### 155. How do refresh token rotation and logout work?
**Expected answer:** Use short-lived access tokens and protected refresh credentials; store a hash/reference and rotate refresh tokens atomically. Detect reuse according to the session-family policy and revoke related sessions when needed. Logout invalidates server-side refresh state; already issued access tokens require expiry or an explicit revocation mechanism.

### 156. Sessions vs JWTs, and cookies vs browser storage?
**Expected answer:** Sessions centralize revocation but need shared state across replicas; JWTs can reduce lookups but complicate immediate invalidation. HttpOnly/Secure/SameSite cookies reduce script access but need CSRF consideration. Browser storage is accessible to compromised scripts. Choose based on threat model, clients, deployment, and revocation needs rather than “JWT scales better.”

### 157. RBAC vs ABAC, permissions, and tenant isolation?
**Expected answer:** RBAC maps roles to permissions; ABAC also considers attributes such as ownership, tenant, and resource state. Scope every tenant data access using authenticated context, including background jobs and cache keys. Test cross-tenant access. A global role guard alone does not prevent insecure direct object references.

### 158. How should public routes and throttling be designed?
**Expected answer:** A global auth guard can use explicit public metadata; public endpoints may still need validation, throttling, and abuse controls. Choose a stable throttle identity and configure trusted proxies carefully. Multiple replicas need a shared limiter or upstream coordination. An untrusted X-Forwarded-For header can defeat IP-based limits.

### 159. Which authentication cases deserve automated checks?
**Expected answer:** Missing, malformed, expired, wrong-audience/issuer tokens; key rotation; forbidden ownership/tenant access; refresh reuse; revoked/disabled accounts; and redaction of credentials. Include both allowed and denied requests through real guards. Mocking every guard proves controller behavior, not that authentication works.

Reference: [Nest authentication](https://docs.nestjs.com/security/authentication). Background: chapters 007, 042, and 076.

---

## 25. Databases, ORM, and Transactions

### 160. How should TypeORM, Prisma, or Mongoose fit into Nest?
**Expected answer:** Encapsulate persistence behind injectable providers with a deliberate shared client/pool lifecycle. TypeORM exposes repositories/entities, Prisma a generated client, and Mongoose models/documents. They have different transaction and mapping semantics. Keep controllers independent of persistence details; do not create a connection/client for every request.

### 161. How do you prevent SQL injection when using an ORM?
**Expected answer:** Parameterize values, including raw queries. Dynamic identifiers, sort directions, and SQL fragments often need explicit allowlists because they cannot be treated as ordinary bound values. An ORM does not secure interpolated raw SQL automatically. Mongo queries also need controlled operators and validated filters; never pass arbitrary client query objects through.

### 162. What causes N+1 queries and connection-pool exhaustion?
**Expected answer:** Loading relations per row multiplies roundtrips; use appropriate joins, projections, batching, or request-scoped loaders. Pool exhaustion also comes from long transactions, leaked connections, or unbounded parallel queries. Across replicas, total pool capacity must fit the database's budget; measure query latency and pool wait separately.

### 163. How do you implement a transaction correctly?
**Expected answer:** Execute all participating statements through the transaction-scoped manager/client, commit on success, and roll back on failure. A Nest decorator does not create a database transaction by itself. Keep transactions short and avoid remote calls inside them. In TypeORM, using the global repository inside a transaction can escape its scope.

### 164. Which isolation and locking tradeoffs matter?
**Expected answer:** Default isolation may allow anomalies depending on the database. Optimistic version checks detect conflicting changes; pessimistic locks coordinate access but increase waits/deadlock risk. Serializable transactions can need retries. Atomic conditional updates plus constraints often solve simple invariants more clearly than a broad application lock.

### 165. Why are pre-checks insufficient for uniqueness and idempotency?
**Expected answer:** Two requests can both pass “does this exist?” before inserting. Put uniqueness in the database, handle conflicts, and store idempotency ownership/result atomically with the effect where possible. Reuse of a key with a different payload should be rejected. In-memory deduplication is insufficient across restarts or replicas.

### 166. How do pagination, indexes, and migrations affect APIs?
**Expected answer:** Use deterministic ordering with a unique tiebreaker. Offset is convenient but can become expensive and shift under writes; cursor pagination needs a stable indexed ordering and explicit semantics. Add indexes based on real access patterns. Production schema changes need reviewed migrations, compatibility phases, and a rollback plan, not automatic schema synchronization.

### 167. What is the safe boundary of database atomicity?
**Expected answer:** A local transaction cannot atomically commit a database update and an unrelated broker/email/payment operation. Use an outbox or a workflow with idempotency and compensation. MongoDB multi-document transactions have deployment requirements and do not eliminate schema design. Treat money as exact decimal/minor units with explicit currency, not binary floating-point arithmetic.

Background: chapters 008, 058–059, 066, 068, and 073. For transaction API details consult your installed ORM version; these are architectural questions, not version-independent ORM syntax.

---

## 26. Cache, Redis, Queues, and Scheduled Work

### 168. How does cache-aside work and what consistency does it provide?
**Expected answer:** Read cache, fetch on miss, populate with TTL; invalidate/update after committed writes according to the consistency requirement. Races can repopulate stale data, so stronger guarantees need versioning or coordination. Cache outages should have a deliberate degradation policy. A cache is not automatically a durable source of truth.

### 169. What must be included in a cache key?
**Expected answer:** Every dimension affecting the result: tenant, authorization scope/user, locale, version, filters, and pagination where relevant. Avoid putting raw secrets in keys. A route-only shared cache for personalized data can leak data. Review CacheInterceptor behavior and explicit exclusions before applying it globally.

### 170. What are stampede, penetration, TTL jitter, and cache-manager caveats?
**Expected answer:** Stampede is concurrent reload after expiry; use single-flight, jitter, or stale-while-revalidate. Repeated misses may need bounded negative caching. Bound memory/cardinality. TTL units, missing-value semantics, and Redis/Keyv store integration vary across package generations; follow the installed version instead of copying a snippet from another Nest major.

### 171. How do Bull and BullMQ compare, and why use a queue?
**Expected answer:** They are separate Redis-backed queue libraries with distinct Nest integrations (`@nestjs/bull` vs `@nestjs/bullmq`) and processor APIs. Queues decouple request latency, bound concurrency, and retry work. Returning 202 means accepted work, not completed success; persist status and expose a job/result contract when clients need one.

### 172. Why must a queue processor be idempotent?
**Expected answer:** Workers can crash after a side effect but before acknowledgement, so redelivery can repeat work. Use stable business IDs, database constraints, and a durable deduplication/result record. Retry limits, exponential backoff, dead-letter handling, and poison-message alerts prevent infinite loops. Queue deduplication alone does not guarantee exactly-once external effects.

### 173. How do you tune queue throughput and preserve order?
**Expected answer:** Distinguish worker concurrency, global rate, batch size, and partition/key ordering. Raising concurrency can overload the database or a vendor. CPU-heavy processors should run outside the HTTP event loop. Monitor oldest-job age, depth, retries, and execution time; define backpressure or rejection when admission exceeds capacity.

### 174. Why does a cron job execute multiple times after scaling Nest?
**Expected answer:** Every replica may register the same schedule. Use a dedicated scheduler, durable queue scheduler, or lease/lock with expiry and ownership checks; critical writes may require fencing. Account for overlapping runs, timezone/DST, missed runs, and restart behavior. A decorator does not make scheduling cluster-wide singleton or exactly once.

### 175. In-process events vs durable messaging and CQRS?
**Expected answer:** EventEmitter/EventEmitter2 and local CQRS buses organize work inside a process; they are not durable brokers. CQRS separates commands and queries and does not inherently require event sourcing. Business events requiring reliable cross-service delivery need durable publication, replay strategy, versioned contracts, and idempotent consumers.

References: [Nest caching](https://docs.nestjs.com/techniques/caching), [Nest queues](https://docs.nestjs.com/techniques/queues). Background: chapters 009, 011, 052–053, and 064.

---

## 27. Microservices and Distributed Reliability

### 176. `ClientProxy.send` vs `emit`, and message vs event patterns?
**Expected answer:** `send` implements request/response and returns a cold Observable: subscribe or convert it to a Promise to initiate work. `emit` publishes an event with different subscription semantics. Match `@MessagePattern` and `@EventPattern` accordingly. A broker acknowledgement is not proof that a downstream business operation has completed.

### 177. Why is a timeout necessary around a remote request?
**Expected answer:** A response may never arrive; apply an RxJS timeout and translate failure into the transport-appropriate contract. Limit in-flight calls and propagate deadlines. Cancellation/unsubscription does not guarantee the remote side undoes an effect. Review retries and idempotency together to avoid double charging or sending duplicate notifications.

### 178. How do acknowledgements, retries, and dead-letter queues cooperate?
**Expected answer:** Acknowledge after the required durable work, nack/requeue only according to a bounded retry policy, and route poison messages for inspection. With RabbitMQ manual acknowledgements, configure `noAck` and prefetch deliberately. Kafka offsets and partition ownership have different semantics; one transport's settings cannot be applied mechanically to another.

### 179. What determines message ordering and delivery guarantees?
**Expected answer:** Ordering generally applies to a queue/partition/key under specific consumer settings, not globally across a distributed system. At-least-once permits duplicates; at-most-once risks loss. “Exactly once” claims have a defined boundary and do not automatically cover external services. Encode business ordering/version checks and deduplication explicitly.

### 180. How do outbox and saga solve different problems?
**Expected answer:** Outbox writes state plus a publication record in one local transaction; a relay publishes with retries, so consumers still deduplicate. Saga coordinates a multi-step workflow with explicit compensating actions; compensation may also fail. Neither is a magic global rollback, and events must carry stable identifiers and versioned schemas.

### 181. What is a circuit breaker vs retry, timeout, or bulkhead?
**Expected answer:** Timeout bounds waiting; retry repeats selected failures; a circuit breaker temporarily stops calls to a failing dependency; a bulkhead limits how much capacity it can consume. Use an overall budget and observable state transitions. A fallback must respect business correctness, especially for authorization, money, and inventory.

### 182. Which Nest details differ in hybrid/RPC applications?
**Expected answer:** `connectMicroservice` does not inherit HTTP global configuration by default; review `inheritAppConfig` and each transport's needs. Use RPC-appropriate exceptions and filters instead of assuming HttpException semantics. HTTP, WS, GraphQL, and RPC need different context extraction. Trace/request/tenant context must be propagated across message boundaries.

### 183. When is a modular monolith better than microservices?
**Expected answer:** Prefer it when team size, independent scaling/release needs, and domain boundaries do not justify distributed operational cost. Nest modules can preserve boundaries without network hops. Microservices introduce partial failures, contract evolution, observability, and data ownership issues; extracting a service should solve a concrete constraint rather than follow a framework feature.

Reference: [Nest microservices](https://docs.nestjs.com/microservices/basics). Background: chapters 013, 018, 051–053, and 059.

---

## 28. GraphQL, WebSockets, SSE, and gRPC

### 184. Code-first vs schema-first GraphQL, and GraphQL input vs DTO?
**Expected answer:** Code-first derives schema from decorated types; schema-first starts with SDL. GraphQL validates schema shape, but business constraints still need validation and authorization. Decorated object/input classes have different roles; TypeScript types alone do not define the executable schema. Keep resolvers thin like controllers.

### 185. How does DataLoader solve N+1, and how can it leak data?
**Expected answer:** It batches and memoizes loads, usually per request. A batch function must return results aligned with input keys, including missing items. A global loader can mix permissions/tenants and serve stale data. Include authorization context and invalidate request-local entries after mutations where needed.

### 186. How do guards and interceptors apply to GraphQL?
**Expected answer:** Extract request/context with GqlExecutionContext rather than assuming switchToHttp. Configure field-resolver enhancers deliberately; they are not necessarily applied to every `@ResolveField` by default. Enforce field/resource policy and limit depth, complexity, pagination, and batching. Authentication at the top-level resolver may not protect sensitive nested fields.

### 187. How do you authenticate WebSockets throughout a connection's lifetime?
**Expected answer:** Verify the handshake, associate trusted identity, authorize message operations/room joins, and define token expiry/revocation handling for existing connections. Do not trust client room names. An HTTP guard is not automatically a correct WS guard; use WS context and WsException-compatible error handling.

### 188. What is needed to scale Socket.IO across instances?
**Expected answer:** Use a suitable shared adapter for cross-instance broadcasts and plan load-balancer affinity when HTTP long-polling is enabled. A Redis adapter is not durable history. Bound outbound buffers, handle slow clients, reconnect/replay semantics, heartbeat, and backpressure. WebSocket-only and long-polling deployments have different affinity requirements.

### 189. SSE vs WebSockets vs long polling?
**Expected answer:** SSE is one-way server-to-client text over HTTP with reconnection support; WebSockets provide duplex messaging. Long polling works through ordinary request cycles at added overhead. Choose by direction, latency, proxy support, and client constraints. SSE needs teardown, replay/Last-Event-ID policy, and proxy buffering/timeouts configured for streaming.

### 190. Which gRPC details commonly cause production bugs?
**Expected answer:** Protobuf field numbers are contract identifiers; evolve schemas compatibly and avoid unsafe renumbering/reuse. Set deadlines, handle status codes and streaming cancellation, and manage metadata/authentication. 64-bit values may not fit JavaScript's safe integer range; check loader representation rather than coercing blindly to Number. Browsers may need gRPC-Web or a gateway.

### 191. How should APIs handle errors across transports?
**Expected answer:** Keep domain errors independent, then map them at each boundary to HTTP statuses, GraphQL errors, WS events, or gRPC/RPC statuses. Do not expose stack traces or secrets. Carry a correlation ID and stable public code. Expected partial GraphQL data plus errors differs from a conventional all-or-nothing HTTP response.

Reference: [Nest GraphQL execution and enhancers](https://docs.nestjs.com/graphql/other-features). Background: chapters 016–017, 043–044, and 063.

---

## 29. RxJS and Testing Strategy

### 192. Observable vs Promise, cold/hot, and completion?
**Expected answer:** A Promise settles once; an Observable can emit zero or many values and supports teardown on unsubscribe. Cold producers typically start per subscription; hot producers have independent/shared production. Unsubscription only cancels underlying work when teardown implements it. Nest waits for completion of normal Observable HTTP results; an infinite stream needs an explicit streaming contract.

### 193. `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`?
**Expected answer:** switchMap replaces the current inner subscription; mergeMap overlaps inners with configurable concurrency; concatMap queues them in order; exhaustMap ignores new arrivals while busy. Pick based on business semantics. Switching away does not guarantee a remote write is undone, so switchMap is risky for writes that must all complete.

### 194. `map`, `tap`, `catchError`, `finalize`, and `firstValueFrom`?
**Expected answer:** map transforms, tap observes side effects, catchError replaces/rethrows the failed stream, and finalize runs on complete/error/unsubscribe. firstValueFrom resolves the first emission; lastValueFrom waits for completion. Empty or never-completing streams need a deliberate default/timeout. finalize is not proof that a response reached the client.

### 195. Unit, integration, contract, and e2e: what should be mocked?
**Expected answer:** Unit tests isolate business rules; integration tests exercise real boundaries such as database constraints; contract tests check API/message compatibility; e2e follows representative user flows. Mocking a repository cannot prove transaction isolation. Use realistic infrastructure when that behavior matters, and keep a smaller set of high-value full-stack cases.

### 196. How do you override guards and scoped providers in Nest tests?
**Expected answer:** Override exact provider/guard tokens before compile. For globals registered with APP_GUARD, an alias via useExisting can expose the guard for replacement. Resolve request-scoped providers with a controlled context ID instead of static get. Ensure test bootstrap installs production pipes, serializers, prefixes, and filters when verifying those contracts.

### 197. What makes async tests flaky or misleading?
**Expected answer:** Missing awaits, assertions in callbacks that never execute, arbitrary sleeps, uncontrolled clocks/randomness, shared mutable fixtures, and unclosed handles. Return/await the work, assert failure paths, use controlled time only where appropriate, and close app/DB/queue resources in finally/after hooks. Coverage percentage does not measure whether assertions catch meaningful regressions.

### 198. How should load and resilience be tested?
**Expected answer:** Use realistic traffic/data and separate warmup from measurement. Track p50/p95/p99 latency, error rate, throughput, Event Loop delay, memory, and dependency saturation. Inject slow/unavailable dependencies and retries. A fast average can hide severe tail latency; local synthetic throughput is not a production capacity guarantee.

### 199. Which assertions give an API test real value?
**Expected answer:** Check status and response contract plus business side effects, denied access, malformed input, duplicates, and cleanup. Assert protected fields are absent and database invariants remain true after errors. A test that only asserts an endpoint returned 200 can miss data leakage or silently duplicated writes.

Selected practice: [`020_nestjs_testing_scopes/main.ts`](020_nestjs_testing_scopes/main.ts). Reference: [Nest testing](https://docs.nestjs.com/fundamentals/testing).

---

## 30. Configuration, Observability, and Deployment

### 200. How should environment configuration be validated?
**Expected answer:** Parse env strings into deliberate types and fail startup for missing/invalid required values. `ConfigService.get<number>` does not itself convert a string to a number. Validate URLs/ranges and separate secrets from committed examples. Load configuration before dependent modules initialize and document precedence and rotation behavior.

### 201. What should logs, metrics, and traces contain?
**Expected answer:** Structured logs with bounded fields and correlation IDs, request/dependency metrics with controlled cardinality, and distributed traces with propagated context. Redact credentials and personal data. Do not label metrics with every user/request ID. Record duration and outcome at the boundary whose latency you actually intend to measure.

### 202. Readiness vs liveness vs startup checks?
**Expected answer:** Liveness detects a process needing restart; readiness controls whether it should receive traffic; startup allows initialization time. Avoid restarting all replicas merely because a shared database is down. During shutdown become unready, drain bounded work, then close dependencies. Health responses should not expose sensitive configuration.

### 203. How do you run Node in containers and shut it down cleanly?
**Expected answer:** Run an unprivileged, reproducible build with suitable CPU/memory limits and a process arrangement that forwards termination signals. Use exec-form startup or a suitable init, enable Nest shutdown hooks, and fit draining within orchestrator grace periods. Per-replica connection pools and worker counts must respect the whole deployment's resource budget.

### 204. How do you diagnose slow requests with low CPU?
**Expected answer:** Break down pool wait, database queries, remote calls, DNS, connection setup, queueing, locks, and response transfer. Use traces and dependency metrics, not just CPU profiles. Apply deadlines and bounded concurrency. Increasing libuv pool size or replicas without locating the bottleneck can worsen downstream saturation.

### 205. How do you diagnose high CPU or a blocked loop?
**Expected answer:** Measure Event Loop delay/utilization, capture a CPU profile, and correlate hot paths with payloads and GC. Inspect sync APIs, regexes, serialization, validation, and logging. Separate CPU execution from I/O waiting; use workers or another service only when measurement justifies their messaging, scheduling, and memory costs.

### 206. What belongs in a Node/Nest CI pipeline?
**Expected answer:** Reproducible install, explicit typecheck, relevant tests, build, dependency/security review, and artifact validation. Keep runtime/dev dependencies and generated outputs deliberate; ts-node transpile-only is not a typecheck. Build once and promote the same artifact where feasible. Schema migrations need compatibility with both old and new application versions during rollout.

### 207. How do you discuss a senior design decision in an interview?
**Expected answer:** Clarify requirements and scale, state invariants, propose a simple design, then examine bottlenecks, failure modes, consistency, security, and observability. Explain alternatives and the evidence that would change your choice. Include a rollout/testing plan. Naming patterns without tying them to concrete constraints is insufficient.

Background: chapters 012, 015, 022, 031, 035, 040, and 067.

---

# Part 5: Coding Tasks and Incident Scenarios

## 31. Practical Exercises with Expected Solutions

### 208. Predict synchronous, nextTick, and Promise output in CJS.
**Expected answer:** For the snippet below, output is `A, B, N, P, M` in a standalone CommonJS entrypoint. Promise.then and queueMicrotask share FIFO microtask order here, after nextTick. Ask whether the interviewer means CJS, ESM top-level, or a callback context before generalizing. Do not add a universal timer/immediate ordering rule.

```js
console.log('A');
Promise.resolve().then(() => console.log('P'));
queueMicrotask(() => console.log('M'));
process.nextTick(() => console.log('N'));
console.log('B');
```

### 209. Implement ordered async mapping with concurrency three.
**Expected answer:** Start three workers sharing the next input index; each stores into its original result slot and takes the next item only after completion. Validate the limit and define failure behavior. The `017` demo uses settle-all semantics with a maximum-active assertion; a fail-fast variant must still handle already-started work and optional cancellation.

### 210. Add a real deadline to an async operation.
**Expected answer:** Create a controller, schedule abort, pass its signal to a supporting API, await the operation, and clear the timeout in finally. Propagate caller cancellation too if required. Distinguish timeout/cancellation from business failure. In `017`, cancellation of a pending timer is asserted without relying on a public network endpoint.

### 211. Stream a large export without buffering it all.
**Expected answer:** Use a source that fetches bounded batches, a Transform for encoding, and pipeline to the destination; handle cancellation and close the source cursor. Respect write backpressure and protect against CSV formula injection when applicable. The `018` demo verifies a small slow-sink pipeline; it does not simulate a database export or CSV security implementation.

### 212. Build a DTO that rejects extra fields and parses a query safely.
**Expected answer:** Use class-validator decorators, a global ValidationPipe with whitelist plus forbidNonWhitelisted, and explicit ParseBoolPipe/ParseIntPipe for primitives. `019` sends valid and invalid HTTP requests and checks that `"false"` becomes false while unexpected fields and invalid emails return 400. Swagger metadata alone is insufficient.

### 213. Build a metadata-driven authorization guard.
**Expected answer:** Use SetMetadata/Reflector, read trusted authenticated identity, and define whether handler metadata overrides or merges class policy. Register globally with APP_GUARD if needed. Test no identity, insufficient permission, permitted access, and explicit public routes. The original role-header demos illustrate the pipeline only; client-controlled role headers are not production authentication.

### 214. Demonstrate and test REQUEST scope bubbling.
**Expected answer:** A REQUEST-scoped dependency has one ID within a context; its default-scoped consumer is recreated for another request while an unrelated singleton remains shared. The `019` HTTP demo and `020` manual-context demo assert these identities. Comparing method outputs without checking instance identities can conceal an incorrect scope explanation.

### 215. Test a service failure without touching a real database.
**Expected answer:** Override its repository token with a fake that rejects, await/assert the service failure and intended public mapping, and close the TestingModule. `020` verifies successful substitution, rejection propagation, and scoped resolution. Real uniqueness, locking, and rollback behavior still need database integration tests.

---

## 32. Scenario Questions and Evaluation Criteria

### 216. A payment endpoint charged twice after a retry. What changes?
**Expected answer:** Trace the original timeout and provider response before assuming the first call failed. Add stable idempotency keys scoped to caller/operation, payload matching, atomic state transitions, and provider-side idempotency where available. Test concurrent duplicates and crash windows; reconcile ambiguous outcomes. A longer HTTP timeout alone does not establish correctness.

### 217. Memory grows for hours; restarting temporarily fixes it. What next?
**Expected answer:** Compare process/heap/external metrics and retaining paths under similar load; inspect caches, listeners, pending promises, request retention, and buffers. Reproduce safely and bound the responsible resource. Raising heap limits or scheduling restarts may mitigate symptoms but does not identify the cause. Verify a stable memory plateau after the fix.

### 218. One tenant receives another tenant's cached data. Where do you look?
**Expected answer:** Inspect cache/loader keys, singleton mutable user state, authenticated tenant extraction, and query scopes. Disable or isolate the unsafe cache path, fix all affected boundaries, and add cross-tenant tests for HTTP, jobs, and GraphQL. Cache invalidation alone does not repair missing authorization.

### 219. Adding replicas made database latency worse. Why?
**Expected answer:** Each replica adds pools, parallel requests, cron runs, and retry pressure. Measure total connections, waits, query plans, locks, and saturation. Bound admission and concurrency, tune pools globally, and address slow queries or duplicated work. More API instances cannot create more database capacity automatically.

### 220. A queued email is lost or sent twice after a worker crash. How do you reason?
**Expected answer:** Locate durable enqueue, acknowledgement, provider send, and status-commit boundaries. Outbox prevents loss between database commit and publication; consumer/provider idempotency limits duplicates after delivery. Some email providers cannot offer exact deduplication, so define acceptable guarantees and reconciliation. Do not promise exactly once without a concrete end-to-end boundary.

### 221. Shutdown drops requests or leaves jobs hanging. What is missing?
**Expected answer:** Check signal forwarding, readiness removal, load-balancer drain, new-work admission, in-flight tracking, worker pause/drain, resource close order, and hard deadlines. Enable Nest shutdown hooks and test termination during real activity. Cleanup must tolerate repeated signals; asynchronous work in an exit listener is too late.

### 222. A test passes but production rejects requests. What differs?
**Expected answer:** Compare validation pipes, auth guards, serializer/filter registration, prefixes/versioning, adapter, proxy behavior, config parsing, dependency versions, and database schema. Reuse a shared bootstrap configuration and exercise representative contracts with realistic dependencies. A controller-only unit test does not cover those boundaries.

### 223. You have 45 minutes to design an order-processing Nest service. What do you cover?
**Expected answer:** Establish scope and invariants; propose modules for orders, inventory, payments, and notifications; define API/DTO/auth boundaries, data model/transactions, idempotency/outbox, and failure transitions. Add indexes, pagination, queue policy, metrics, health/shutdown, tests, and rollout. Explain when a modular monolith suffices and what measured requirement would justify extraction.

**Practice rubric:** Give a concrete failure example, identify the invariant, explain the implementation and tradeoff, then state how you would verify it. For coding tasks also discuss empty inputs, invalid arguments, errors, concurrent requests, resource cleanup, and time/memory complexity.

---

## Quick Revision Checklist

**Node.js:** Event Loop, libuv, nextTick vs timers, Promise combinators, CJS/ESM, Stream/Buffer, EventEmitter, Workers/cluster, graceful shutdown.

**NestJS:** Module/Controller/Provider, DI scopes, Middleware/Guard/Interceptor/Pipe/Filter order, DTO + ValidationPipe, Dynamic Modules, lifecycle hooks, microservice/WS/GraphQL features, TestingModule.

**Language and production:** Closures/this/prototypes, runtime type erasure, cancellation and bounded concurrency, security and tenant isolation, ORM transactions and constraints, cache keys/invalidation, queue idempotency, transport contracts, RxJS teardown, meaningful tests, observability, supported versions, graceful shutdown, and incident reasoning.

**Official references:** [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [Node API](https://nodejs.org/api/), [Nest documentation](https://docs.nestjs.com/). Check the version selector and the installed package versions before applying API-specific examples.
