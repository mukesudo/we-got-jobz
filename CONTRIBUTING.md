# Contributing to Freelance Marketplace

First off, thank you for your interest in contributing! We welcome all types of contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/freelance-marketplace.git
   cd freelance-marketplace
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original/freelance-marketplace.git
   ```
4. Follow [GETTING_STARTED.md](GETTING_STARTED.md) to set up locally

## Development Workflow

### 1. Create Feature Branch

Use descriptive branch names:

```bash
# Feature
git checkout -b feature/add-user-profile

# Bug fix
git checkout -b fix/login-button

# Documentation
git checkout -b docs/update-readme

# Performance
git checkout -b perf/optimize-queries

# Refactoring
git checkout -b refactor/simplify-bidding-logic
```

### 2. Make Changes

```bash
# Make your changes
nano apps/frontend/src/page-name/page.tsx

# Run linter to check style
pnpm lint --fix

# Type check
pnpm type-check

# Run tests
pnpm test --filter=package-name
```

### 3. Create Commits

Write clear, atomic commits:

```bash
# Stage changes
git add apps/frontend/src/components/button.tsx

# Commit with conventional message
git commit -m "feat(ui): add button component with loading state"
```

### 4. Push Changes

```bash
git push origin feature/add-user-profile
```

### 5. Create Pull Request

Go to GitHub and create a PR with:
- Clear title and description
- Reference to any related issues
- Screenshots if UI changes
- Test results

### 6. Wait for Review

- Address feedback from reviewers
- Make updates on the same branch
- Push updates (don't force push)

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` types
- Use proper types and interfaces
- Comment complex logic

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  // implementation
};

// ❌ Avoid
const getUser = (id: any): any => {
  // implementation
};
```

### React/Next.js

- Use functional components
- Use hooks for state
- Proper key props in lists
- Accessible (a11y) components

```typescript
// ✅ Good
export default function JobCard({ job }: { job: Job }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={job.title}
    >
      {/* content */}
    </div>
  );
}

// ❌ Avoid
function JobCard(props: any) {
  // class component or improper structure
}
```

### NestJS

- Use dependency injection
- Proper error handling
- DTOs for validation
- Service layer pattern

```typescript
// ✅ Good
@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createJobDto: CreateJobDto) {
    return this.prisma.project.create({ data: createJobDto });
  }
}

// ❌ Avoid
export class JobsService {
  create(data: any) {
    // direct database call
  }
}
```

### Styling

- Use Tailwind CSS classes
- Create component-level styles if needed
- Maintain consistency with existing design
- Test on mobile devices

```typescript
// ✅ Good
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Submit
</button>

// ❌ Avoid
<button style={{ backgroundColor: 'blue' }}>
  Submit
</button>
```

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Build, dependencies, tooling
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(jobs): add job filtering by category"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs: update deployment guide"

# Refactoring
git commit -m "refactor(api): simplify error handling middleware"

# With body
git commit -m "feat(payments): add Stripe webhook support

- Implement webhook endpoint
- Add signature verification
- Handle payment events
- Update database on success"
```

### Commit Subject Rules

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters
- Reference issues when relevant

```bash
# ✅ Good
fix(jobs): prevent duplicate job submissions

# ❌ Bad
Fixed some bugs in job submission
```

## Pull Request Process

### Before Creating PR

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] No commented code
- [ ] No unnecessary dependencies
- [ ] Updated documentation if needed
- [ ] Rebased on main branch

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123
Related to #456

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Tested in development
- [ ] Cross-browser tested

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Code Review** - Team reviews for quality
2. **Automated Checks** - CI/CD pipeline runs
3. **Testing** - Tests must pass
4. **Approval** - Minimum 1 approval required
5. **Merge** - Squash and merge preferred

### After PR is Merged

- Delete your feature branch
- Update your local main:
  ```bash
  git checkout main
  git pull upstream main
  ```

## Testing

### Unit Tests

```bash
# Run specific test file
pnpm test src/services/jobs.service.spec.ts

# Watch mode
pnpm test --watch

# Coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run specific spec
pnpm test:e2e --spec=src/auth.e2e-spec.ts
```

### Test Writing Guidelines

```typescript
// ✅ Good
describe('JobsService', () => {
  let service: JobsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // setup
  });

  describe('create', () => {
    it('should create a job with valid data', async () => {
      const jobData = { title: 'Test Job' };
      const result = await service.create(jobData);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Job');
    });

    it('should throw error with invalid data', async () => {
      const invalidData = { title: '' };
      await expect(service.create(invalidData)).rejects.toThrow();
    });
  });
});
```

## Areas for Contribution

### High Priority

- [ ] Fixing bugs (check issues)
- [ ] Writing tests
- [ ] Performance optimization
- [ ] Documentation

### Medium Priority

- [ ] New features (after discussion)
- [ ] UI/UX improvements
- [ ] Code refactoring
- [ ] Accessibility improvements

### Low Priority

- [ ] Style updates
- [ ] Minor documentation changes

### Not Accepting

- Major architecture changes without discussion
- New dependencies without approval
- Commented code
- Code that breaks existing tests

## Questions?

- **GitHub Issues** - Technical questions
- **GitHub Discussions** - General questions
- **Email** - For private matters

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**

See [README.md](README.md) for more project information.
