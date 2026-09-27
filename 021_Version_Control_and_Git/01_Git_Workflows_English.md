# Version Control & Git Workflows

## What is it?
Version control systems (VCS) record changes to a file or set of files over time so that you can recall specific versions later. **Git** is the most widely used distributed version control system today. 

## Git Branching Strategies (Workflows)
To work effectively in a team, developers agree on a specific workflow. The most common ones are:

### 1. Feature Branch Workflow
- The `main` (or `master`) branch always contains production-ready code.
- Whenever a developer starts working on a new feature or bug fix, they create a new branch off `main` (e.g., `feature/login-page`).
- Once the work is done, they open a Pull Request (PR) or Merge Request (MR) to merge it back into `main`.

### 2. Gitflow Workflow
- A more structured and complex model.
- Uses two long-lived branches: `main` (production history) and `develop` (integration branch for features).
- Uses short-lived branches for: `feature/*` (branched from `develop`), `release/*` (branched from `develop` when ready for production), and `hotfix/*` (branched directly from `main` to fix production bugs).

### 3. Trunk-Based Development
- All developers merge their code into a central branch (`trunk` or `main`) multiple times a day.
- Features are often hidden behind **Feature Flags** (Feature Toggles) until they are fully complete.
- This is highly recommended for CI/CD environments as it prevents "Merge Hell".

## What Problems Does It Solve?
- **Collaboration**: Allows dozens or hundreds of developers to work on the exact same codebase simultaneously without overwriting each other's changes.
- **History and Rollback**: If a new feature breaks the production server, you can instantly revert to the previous working commit.
- **Code Review**: Pull requests force code to be reviewed by peers before it affects the main product.

## Key Commands
```bash
git clone <url>      # Downloads a repository
git checkout -b <br> # Creates a new branch and switches to it
git commit -am "Msg" # Stages all modified files and commits them
git push origin <br> # Pushes the branch to the remote server
git rebase main      # Reapplies your branch's commits on top of main
```
