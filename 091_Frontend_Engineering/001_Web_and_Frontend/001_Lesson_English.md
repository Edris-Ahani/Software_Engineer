# 001 — The web and frontend engineering

[Persian](./001_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A website is a set of documents and assets identified by URLs. A browser retrieves them, interprets HTML as structure, CSS as presentation, and JavaScript as behavior. A server handles trusted operations such as authorizing payments. The client is under the user's control: hiding a button never enforces permission.

Progressive enhancement starts with useful HTML, adds presentation, then adds interaction. Client-side rendering can improve rich interactions but introduces downloading, parsing, and execution costs. A senior engineer starts with users, device constraints, and failure modes before choosing a framework.

## Common mistakes

Do not equate frontend with React or assume a fast laptop represents every user.

## Exercise and acceptance criteria

Map a checkout into browser, API, database, and payment-provider responsibilities. Specify behavior when JavaScript or the network fails.

## Solution guidance

The browser collects input and explains status; the server validates price, inventory, identity, and idempotency. Keep a readable failure page and a safe retry path.

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development)

[Next](../002_Environment_and_Installation/002_Lesson_English.md)
