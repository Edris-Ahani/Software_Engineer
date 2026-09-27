# Clean Code Principles (Beyond SOLID)

## What is it?
Writing clean code is about writing code for your future self and your teammates. Code is read 10 times more often than it is written. While SOLID principles dictate object-oriented design, the following principles apply universally to all coding styles.

## 1. DRY (Don't Repeat Yourself)
- **Concept**: Every piece of knowledge or logic must have a single, unambiguous, authoritative representation within a system.
- **The Problem**: If you copy-paste a 10-line block of logic into 4 different files, and a bug is found later, you have to remember to fix it in 4 places. If you forget one, the bug persists.
- **The Solution**: Abstract the logic into a reusable function, class, or module.

## 2. KISS (Keep It Simple, Stupid)
- **Concept**: Most systems work best if they are kept simple rather than made complex. Simplicity should be a key goal in design, and unnecessary complexity should be avoided.
- **The Problem**: Developers sometimes try to show off by using a complex, heavily abstracted design pattern for a problem that could be solved with a simple `if/else` statement. 
- **The Solution**: Always write the simplest code that works and is easy to read. Complex code is hard to debug and hard to test.

## 3. YAGNI (You Aren't Gonna Need It)
- **Concept**: Always implement things when you actually need them, never when you just foresee that you *might* need them.
- **The Problem**: Over-engineering. You spend 2 weeks building a dynamic plugin system because you think "we might need to support 10 different payment gateways in the future", but the business only ever uses Stripe. You wasted time and added unnecessary complexity.
- **The Solution**: Build exactly what the current requirements demand. Refactor later when new requirements actually arrive.

## 4. Boy Scout Rule
- **Concept**: "Always leave the campground cleaner than you found it."
- **Application**: Whenever you open a file to add a feature or fix a bug, if you see a badly named variable, a useless comment, or messy formatting, fix it right then and there. Over time, the codebase becomes remarkably cleaner.
