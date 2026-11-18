# 038 — SSR, SSG, Next.js, and Server Components

[Persian](./038_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

CSR builds UI in the browser; SSR generates HTML per request; SSG generates it ahead of time. Revalidation updates precomputed content according to an explicit freshness strategy. Choose per route based on personalization, freshness, cacheability, and interaction needs rather than choosing one mode for an entire product.

Hydration attaches client behavior to compatible server markup. Nondeterministic dates, random values, and browser-only branches can cause mismatches. React Server Components run on the server and can reduce client JavaScript, but they are distinct from SSR. A client boundary sends required client code and serializable props to the browser. Server actions and server functions must validate inputs and authorization like other public mutation endpoints. Cache APIs and defaults vary by framework release.

## Common mistakes

Do not cache private HTML under a public key or assume "use client" means the component never participates in server rendering.

## Exercise and acceptance criteria

Choose rendering modes for a marketing page, public catalog, account dashboard, and live inventory indicator. Explain freshness and privacy.

## Solution guidance

Prebuild stable public content, revalidate shared catalog data, isolate authenticated responses, and update live inventory through a client channel or uncached read.

## Official reference

[Primary documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components)

[Previous](../037_Application_Routing_and_Boundaries/037_Lesson_English.md) · [Next](../039_Frameworks_and_Web_Components/039_Lesson_English.md)
