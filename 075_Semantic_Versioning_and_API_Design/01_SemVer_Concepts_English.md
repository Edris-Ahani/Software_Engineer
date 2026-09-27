# Semantic Versioning (SemVer)

## What is it?
When you release a software package, an API, or a library, you need a standard way to tell developers what has changed. **Semantic Versioning (SemVer)** is the universal standard for version numbers, formatted as `MAJOR.MINOR.PATCH` (e.g., `v2.14.3`).

## 1. MAJOR (Breaking Changes)
- **Format**: Increments from `1.0.0` to `2.0.0`.
- **When to use**: When you make **incompatible API changes**. If you delete a function, change a JSON response structure, or rename a database table that clients depend on, you MUST increment the Major version.
- **Meaning**: Developers who upgrade to this version must rewrite some of their code, otherwise their app will break.

## 2. MINOR (New Features)
- **Format**: Increments from `2.1.0` to `2.2.0` (and resets PATCH to 0).
- **When to use**: When you add new functionality in a **backwards-compatible** manner. E.g., adding a new endpoint `/api/v1/user/profile`, or adding an optional new parameter to a function.
- **Meaning**: Developers can safely upgrade to this version. Old code will continue to work perfectly.

## 3. PATCH (Bug Fixes)
- **Format**: Increments from `2.1.3` to `2.1.4`.
- **When to use**: When you make backwards-compatible **bug fixes**. E.g., fixing a memory leak or a miscalculation in the backend.
- **Meaning**: Developers should always upgrade to the latest Patch version immediately for stability and security.

## Caret (^) and Tilde (~) in package.json
If you look at NPM `package.json`:
- `"react": "^18.2.0"` means: Auto-install any Minor or Patch updates (like `18.3.0`), but NEVER auto-install `19.0.0` (Major), because it might break my app!
- `"react": "~18.2.0"` means: Only auto-install Patch updates (like `18.2.1`). Do not install new features (`18.3.0`).
