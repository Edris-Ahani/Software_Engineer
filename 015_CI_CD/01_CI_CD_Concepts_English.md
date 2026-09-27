# CI/CD (Continuous Integration & Continuous Deployment)

## What is it?
CI/CD is a method to frequently deliver apps to customers by introducing automation into the stages of app development. The main concepts are Continuous Integration, Continuous Delivery, and Continuous Deployment.

## Key Concepts
- **Continuous Integration (CI)**: The practice of automating the integration of code changes from multiple contributors into a single software project. When developers push code to a repository (like GitHub), automated tests and builds are triggered to ensure the new code doesn't break anything.
- **Continuous Delivery (CD)**: An extension of CI. It ensures that you can release new changes to your customers quickly in a sustainable way. The code is ready to be deployed at any time, but the actual deployment to production is triggered manually.
- **Continuous Deployment (CD)**: Goes one step further than Continuous Delivery. Every change that passes all stages of your production pipeline is released to your customers automatically, with no human intervention.

## What Problems Does It Solve?
- **Integration Hell**: Developers no longer spend days or weeks merging their branches together.
- **Manual Errors**: Automating the build and deployment process eliminates the chance of human error during releases.
- **Slow Release Cycles**: Companies can release new features or bug fixes multiple times a day instead of once every few months.

## When and Where to Use It?
CI/CD should be used in almost all modern software projects. Popular tools include **GitHub Actions**, **GitLab CI**, **Jenkins**, and **CircleCI**.

## Examples

### GitHub Actions Workflow (YAML)
```yaml
name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
```
