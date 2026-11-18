# Runnable example guide

[Persian](README_Persian.md) · [Course](../README_English.md) · [Setup and execution](../RUNNING_English.md)

All paths and commands run from the course root. Execute independent mjs programs with Node; worker files are loaded only by their HTML owner. For HTML, run the finite local server and select a lab from its home page:

```bat
cmd /c node examples/003_values.mjs
cmd /c node scripts/serve.mjs --duration=600
```

| File | Input and execution | Expected result |
| --- | --- | --- |
| [001_semantic_form.html](001_semantic_form.html) | Browser: valid email and display name | Local signup preview; invalid email blocks submission |
| [002_responsive_layout.html](002_responsive_layout.html) | Browser: resize 320–1440px | Grid adapts; long identifier wraps |
| [003_values.mjs](003_values.mjs) | Node, fixed cart | 9700 cents; nullish 0 versus falsy 10; negative value rejected |
| [004_closures.mjs](004_closures.mjs) | Node, independent counters and two rapid calls | 1 2 1, then Settled: new |
| [005_objects.mjs](005_objects.mjs) | Node, immutable address update | Berlin Hamburg; Address shared: false; Alex |
| [006_collections.mjs](006_collections.mjs) | Node, known and missing categories | Accessories and Unknown; 2 unique ids |
| [007_event_loop.mjs](007_event_loop.mjs) | Node, scheduled callbacks | start, end, promise, microtask, timer |
| [008_dom_events.html](008_dom_events.html) | Browser: submit a title and remove it | Literal title, updated count, restored input focus |
| [009_fetch.html](009_fetch.html) | Browser: load, failure, cancel buttons | 3 products; HTTP 503; cancellation status |
| [010_types.ts](010_types.ts) | Node type stripping; project typecheck separately | 1 products and 4500; exhaustive state description |
| [011_storage.html](011_storage.html) | Browser: choose a theme | Saved preference or honest storage failure |
| [012_worker.html](012_worker.html) | Browser: calculate and independent click | 500000500000; click counter remains independent |
| [013_sum_worker.mjs](013_sum_worker.mjs) | Support file, loaded by 012; limit 0–10000000 | Message with request id and sum; invalid limit rejected |
| [014_custom_element.html](014_custom_element.html) | Browser: increment custom element | Count and observed value increase; valuechange event |
| [015_offline/index.html](015_offline/index.html) | Browser: register, reload online, then offline | One document available offline; remove named cache afterward |
| [015_offline/016_service_worker.js](015_offline/016_service_worker.js) | Support worker, registered only by offline demo | Versioned cache of one document; no private API caching |
| [017_canvas.html](017_canvas.html) | Browser: fixed values 3, 5, 2 | Three bars and equivalent readable table |
| [018_intl.html](018_intl.html) | Browser: en-US / fa-IR, fixed UTC timestamp | Localized EUR/date; explicit Berlin time zone and direction |
| [019_sse.html](019_sse.html) | Browser: receive three events | Events 1–3; stream closes |
| [020_motion.html](020_motion.html) | Browser: open disclosure, toggle reduced motion | Readable disclosure with optional animation |

## Limitations and verification

There are 20 code files: 18 independent entry points and two supporting workers. Core examples use no external libraries. Fetch depends on the local server endpoints; cancellation of a fast request can happen after completion, and the cancellation status remains explicit. The worker sum demonstrates messaging; an O(1) closed formula would be more efficient for this actual calculation.

The storage demo saves only a preference, never credentials. The offline example caches only index.html; CSS and the home link are not guaranteed offline, and a first visit without a network does not work. Remove its cache and close the tab afterward. Canvas includes an alternative table and is not a complete charting system. Exact Intl output can vary with browser and locale-data versions.

Node execution does not type-check TypeScript; the React project's typecheck includes this example. Browser Console should contain no execution errors for the tested path. Automation checks selected flows in Chromium; visual appearance, screen readers, service workers, and other engines need additional review. The [report](../VALIDATION_English.md) distinguishes checks actually run.

## Further exercises

Add extra validation to the DOM demo, a malformed schema response to fetch, computation cancellation to the worker, and a category filter to the catalog. Define the observable outcome and failure mode before changing code, then run the relevant checks.
