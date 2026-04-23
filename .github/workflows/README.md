# GitHub Workflows Note

CI/test workflows are intentionally disabled for automatic `push` and `pull_request` events in this branch to support experimental development.

Currently manual-only workflows:
- `ci.yml`
- `tests.yml`

They can still be run from the GitHub Actions UI using `workflow_dispatch`.

## Re-enable automatic CI

To re-enable CI/test on `push` and PRs, update the `on:` section in each workflow to include:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
```
