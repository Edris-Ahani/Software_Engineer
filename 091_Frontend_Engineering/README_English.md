# Frontend engineering: foundations to senior-level practice

[Persian](README_Persian.md) · [Language selector](README.md)

This handbook has 64 ordered lessons. Each has complete English and Persian versions, mechanism explanations, common mistakes, an exercise with acceptance criteria, solution guidance, and an official reference. Start with the web and HTML, then progress to architecture, system design, and delivery. The goal is practical knowledge; seniority also requires product experience, technical judgment, and collaboration.

## Prerequisites and starting point

No programming experience is required to start; ordinary computer and file-management skills are enough. Read lessons 001 and 002 first. Core examples require only Node 24 or newer and a current browser, with no npm installation. React and browser tests have separate optional installations. All code, data, tests, and guides stay inside this topic.

[Installation and execution](RUNNING_English.md) · [Example guide](examples/README_English.md) · [Validation report](VALIDATION_English.md)

## Staged path

1. Lessons 001–015: web, environment, Git, HTTP, browser internals, HTML, forms, accessibility, and CSS.
2. Lessons 016–028: JavaScript, algorithms, asynchronous work, DOM, APIs, storage, routing, TypeScript, and tooling.
3. Lessons 029–039: debugging, testing, React, data ownership, routing, rendering strategies, and framework choices.
4. Lessons 040–049: security, identity, performance, caching, workers, offline, realtime, accessibility, localization, and SEO.
5. Lessons 050–058: design systems, architecture, system design, large data, graphics, delivery, observability, dependencies, and collaboration.
6. Lessons 059–064: three projects, assessment, troubleshooting, and continued learning.

Start project 1 after HTML/CSS, project 2 after DOM and storage, and project 3 after React and testing. Open the project chapters early and revisit them after advanced sections.

For each lesson, predict an output, execute the code, add a boundary case, and solve the exercise before consulting guidance. Assess your work with lesson 062. A suggested schedule is 16 weeks: four for foundations, four for JavaScript/TypeScript, three for React/testing, three for advanced engineering, and two for projects/review. Actual time depends on practice and experience.

## Ordered lesson index

| Lesson | Subject |
| --- | --- |
| [001](001_Web_and_Frontend/001_Lesson_English.md) | The web and frontend engineering |
| [002](002_Environment_and_Installation/002_Lesson_English.md) | Environment and installation |
| [003](003_Git_and_Workflow/003_Lesson_English.md) | Git and development workflow |
| [004](004_Internet_HTTP_and_DNS/004_Lesson_English.md) | Internet, DNS, and HTTP |
| [005](005_Browser_Rendering/005_Lesson_English.md) | Browser rendering and runtime |
| [006](006_Semantic_HTML/006_Lesson_English.md) | Semantic HTML |
| [007](007_Forms_and_Validation/007_Lesson_English.md) | Forms and validation |
| [008](008_Images_Media_and_SVG/008_Lesson_English.md) | Images, media, and SVG |
| [009](009_Accessibility_Foundations/009_Lesson_English.md) | Accessibility foundations |
| [010](010_CSS_Cascade_and_Selectors/010_Lesson_English.md) | CSS cascade and selectors |
| [011](011_Box_Model_and_Positioning/011_Lesson_English.md) | Box model, flow, and positioning |
| [012](012_Flexbox_and_Grid/012_Lesson_English.md) | Flexbox and Grid |
| [013](013_Responsive_and_Container_Queries/013_Lesson_English.md) | Responsive design and container queries |
| [014](014_Typography_Color_and_Design/014_Lesson_English.md) | Typography, color, and visual design |
| [015](015_CSS_Architecture_and_Motion/015_Lesson_English.md) | CSS architecture and motion |
| [016](016_JavaScript_Fundamentals/016_Lesson_English.md) | JavaScript fundamentals |
| [017](017_Functions_Scope_and_Closures/017_Lesson_English.md) | Functions, scope, and closures |
| [018](018_Objects_Prototypes_and_This/018_Lesson_English.md) | Objects, prototypes, and this |
| [019](019_Collections_and_Algorithms/019_Lesson_English.md) | Collections and practical algorithms |
| [020](020_Modules_and_Error_Handling/020_Lesson_English.md) | Modules and error handling |
| [021](021_Async_Event_Loop_and_Cancellation/021_Lesson_English.md) | Async, the event loop, and cancellation |
| [022](022_DOM_Events_and_Lifecycle/022_Lesson_English.md) | DOM events and lifecycle |
| [023](023_Fetch_APIs_and_Resilience/023_Lesson_English.md) | Fetch, API contracts, and resilience |
| [024](024_Storage_and_IndexedDB/024_Lesson_English.md) | Storage and IndexedDB |
| [025](025_URLs_and_Client_Routing/025_Lesson_English.md) | URLs and client-side routing |
| [026](026_TypeScript_Fundamentals/026_Lesson_English.md) | TypeScript fundamentals |
| [027](027_Advanced_Types_and_Runtime_Schemas/027_Lesson_English.md) | Advanced types and runtime schemas |
| [028](028_Packages_Build_Tools_and_Linting/028_Lesson_English.md) | Packages, build tools, and linting |
| [029](029_Debugging_and_DevTools/029_Lesson_English.md) | Debugging and DevTools |
| [030](030_Unit_and_Integration_Testing/030_Lesson_English.md) | Unit and integration testing |
| [031](031_Browser_E2E_and_Visual_Testing/031_Lesson_English.md) | Browser, end-to-end, and visual testing |
| [032](032_React_Components_and_Rendering/032_Lesson_English.md) | React components and rendering |
| [033](033_React_State_and_Reducers/033_Lesson_English.md) | React state and reducers |
| [034](034_Effects_Refs_and_Cleanup/034_Lesson_English.md) | Effects, refs, and cleanup |
| [035](035_React_Performance_and_Suspense/035_Lesson_English.md) | React performance and Suspense |
| [036](036_Server_State_Forms_and_Data/036_Lesson_English.md) | Server state, forms, and data management |
| [037](037_Application_Routing_and_Boundaries/037_Lesson_English.md) | Application routing and boundaries |
| [038](038_SSR_SSG_Nextjs_and_RSC/038_Lesson_English.md) | SSR, SSG, Next.js, and Server Components |
| [039](039_Frameworks_and_Web_Components/039_Lesson_English.md) | Frameworks and Web Components |
| [040](040_Frontend_Security/040_Lesson_English.md) | Frontend security |
| [041](041_Authentication_and_Sessions/041_Lesson_English.md) | Authentication and sessions |
| [042](042_Performance_and_Core_Web_Vitals/042_Lesson_English.md) | Performance and Core Web Vitals |
| [043](043_Caching_CDN_and_Delivery/043_Lesson_English.md) | Caching, CDN, and delivery |
| [044](044_Workers_Streams_and_WASM/044_Lesson_English.md) | Workers, streams, and WebAssembly |
| [045](045_PWA_and_Offline/045_Lesson_English.md) | Progressive web apps and offline behavior |
| [046](046_Realtime_SSE_WebSocket_and_WebRTC/046_Lesson_English.md) | Realtime: SSE, WebSocket, and WebRTC |
| [047](047_Advanced_Accessibility/047_Lesson_English.md) | Advanced accessibility |
| [048](048_Internationalization_and_RTL/048_Lesson_English.md) | Internationalization and RTL |
| [049](049_SEO_and_Metadata/049_Lesson_English.md) | SEO and metadata |
| [050](050_Design_Systems_and_Component_APIs/050_Lesson_English.md) | Design systems and component APIs |
| [051](051_Frontend_Architecture/051_Lesson_English.md) | Frontend architecture |
| [052](052_Frontend_System_Design/052_Lesson_English.md) | Frontend system design |
| [053](053_Large_Data_Tables_and_Visualization/053_Lesson_English.md) | Large data tables and visualization |
| [054](054_Graphics_Animation_and_Specialized_APIs/054_Lesson_English.md) | Graphics, animation, and specialized APIs |
| [055](055_CI_CD_and_Deployment/055_Lesson_English.md) | CI/CD and deployment |
| [056](056_Observability_Analytics_and_Privacy/056_Lesson_English.md) | Observability, analytics, and privacy |
| [057](057_Dependencies_and_Supply_Chain/057_Lesson_English.md) | Dependencies and supply-chain security |
| [058](058_Senior_Engineering_and_Collaboration/058_Lesson_English.md) | Senior engineering and collaboration |
| [059](059_Project_Accessible_Catalog/059_Lesson_English.md) | Project 1: accessible catalog |
| [060](060_Project_Persistent_Task_Board/060_Lesson_English.md) | Project 2: persistent task board |
| [061](061_Project_React_Dashboard/061_Lesson_English.md) | Project 3: React and TypeScript dashboard |
| [062](062_Interview_Code_Review_and_Assessment/062_Lesson_English.md) | Interview, code review, and assessment |
| [063](063_Troubleshooting_and_Compatibility/063_Lesson_English.md) | Troubleshooting and compatibility |
| [064](064_Glossary_and_Continued_Learning/064_Lesson_English.md) | Glossary and continued learning |

## Projects and coverage boundaries

- [001 — Accessible catalog](projects/001_accessible_catalog/README_English.md): HTML, CSS, search, and URL history.
- [002 — Task board](projects/002_persistent_board/README_English.md): pure reducer, validation, persistence, and failure recovery.
- [003 — React dashboard](projects/003_react_dashboard/README_English.md): TypeScript, state, filters, and a production build.

The core is framework independent; React is the main practical framework, while Vue, Angular, Svelte, and Web Components have a comparative lesson. SSR, Next.js, RSC, microfrontends, GraphQL, WebRTC, and WebAssembly include mechanisms, tradeoffs, and design exercises; each does not have a separate production lab. Projects are local teaching applications and do not implement a real backend, payments, or production authentication.

Continue with [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development), [React](https://react.dev/learn), [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html), [WAI](https://www.w3.org/WAI/tutorials/), and each chapter's reference. Installation and tooling guidance were checked against official documentation, and dependency versions are recorded in isolated manifests and lockfiles.
