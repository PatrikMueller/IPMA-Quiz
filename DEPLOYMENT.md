# GitHub Actions CI/CD Setup

This document explains the automated deployment pipeline for the IPMA-Quiz Next.js application.

## Overview

The project uses GitHub Actions to automatically:
- **Lint** code with ESLint on every push
- **Build** the Next.js app as a static export
- **Deploy** each branch to its own subdirectory on GitHub Pages
- **Clean up** deployments when branches are deleted

## Deployment URLs

### Main Branch
- **URL**: `https://patrikmueller.github.io/IPMA-Quiz/`
- **Source**: `main` or `master` branch

### Feature Branches
- **URL Pattern**: `https://patrikmueller.github.io/IPMA-Quiz/[branch-name]/`
- **Example**: `https://patrikmueller.github.io/IPMA-Quiz/feature-user-auth/`

Branch names are automatically sanitized (special characters become hyphens, lowercase).

## Repository Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose **gh-pages** branch and **/ (root)** folder
5. Click **Save**

### 2. Configure Action Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

## How It Works

### Workflow Triggers

The GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on:

- **Push to any branch**: Lints, builds, and deploys
- **Pull request**: Lints, builds, deploys, and adds preview comment
- **Branch deletion**: Removes the corresponding deployment

### Deployment Process

1. **Lint Job**: Runs ESLint (continues even if linting fails)
2. **Build Job**: Creates Next.js static export with branch-specific configuration
3. **Deploy Job**: 
   - Checks out or creates `gh-pages` branch
   - Creates/updates branch subdirectory
   - Commits and pushes changes
   - Updates deployment tracking

### Branch-Specific Configuration

Each branch gets its own:
- **Subdirectory** in the `gh-pages` branch
- **Base path** configuration for assets
- **Deployment tracking** entry

## File Structure

### Repository Structure
```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Main CI/CD workflow
├── src/                        # Next.js application
├── README.md
└── DEPLOYMENT.md              # This file
```

### GitHub Pages Structure (gh-pages branch)
```
├── index.html                 # Main branch deployment
├── _next/                     # Main branch assets
├── feature-auth/              # Feature branch deployment
│   ├── index.html
│   └── _next/
├── .deployments.json          # Deployment tracking
└── .nojekyll                  # Disable Jekyll processing
```

## Configuration Files

### Next.js Configuration (`src/next.config.ts`)
- **Static export**: `output: 'export'`
- **Dynamic base path**: Based on branch name
- **Asset prefix**: Configured for GitHub Pages URLs
- **Image optimization**: Disabled for static hosting

### Package.json Scripts
- **build**: Creates static export in `out/` directory
- **lint**: Runs ESLint validation

## Workflow Features

### ✅ Automatic Deployments
- Every push triggers a new deployment
- No manual intervention required
- Independent deployments per branch

### ✅ Pull Request Previews
- Automatic deployment comments on PRs
- Direct links to preview deployments
- Updated with each new commit

### ✅ Automatic Cleanup
- Branch deployments are removed when branches are deleted
- No manual maintenance required
- Keeps gh-pages branch clean

### ✅ Build Optimization
- NPM dependency caching
- Fast subsequent builds
- Parallel job execution

## Usage Examples

### Creating a Feature Branch
```bash
git checkout -b feature-user-login
git push origin feature-user-login
# Automatic deployment to: https://patrikmueller.github.io/IPMA-Quiz/feature-user-login/
```

### Creating a Pull Request
```bash
# After pushing your branch, create a PR
# The workflow will automatically add a comment with the preview URL
```

### Deleting a Branch
```bash
git branch -d feature-user-login
git push origin --delete feature-user-login
# Deployment is automatically cleaned up
```

## Monitoring Deployments

### GitHub Actions Tab
- View workflow runs and status
- Check build logs for issues
- Monitor deployment success/failure

### Deployment Tracking
The `.deployments.json` file in the `gh-pages` branch tracks all active deployments:

```json
{
  "deployments": [
    {
      "branch": "main",
      "path": "",
      "deployed_at": "2026-03-04T15:20:30Z",
      "commit": "abc123..."
    },
    {
      "branch": "feature-auth",
      "path": "feature-auth/",
      "deployed_at": "2026-03-04T15:25:45Z",
      "commit": "def456..."
    }
  ]
}
```

## Troubleshooting

### Deployment Failures

**Problem**: Workflow fails during build
- **Solution**: Check the Actions tab for detailed error logs
- **Common causes**: TypeScript errors, missing dependencies, configuration issues

**Problem**: Deployment URL returns 404
- **Solution**: Ensure GitHub Pages is enabled and pointing to `gh-pages` branch

**Problem**: Assets not loading correctly
- **Solution**: Check the `basePath` and `assetPrefix` configuration in `next.config.ts`

### Branch Name Issues

**Problem**: Special characters in branch names
- **Solution**: The workflow automatically sanitizes branch names (e.g., `feature/user-auth` becomes `feature-user-auth`)

### Permission Issues

**Problem**: Workflow can't push to `gh-pages`
- **Solution**: Ensure "Read and write permissions" are enabled in repository settings

## Security Notes

- The workflow uses `GITHUB_TOKEN` (automatically provided)
- No additional secrets or tokens required
- All operations are contained within the repository
- Branch-specific deployments are publicly accessible

## Development Workflow

1. **Create feature branch**: `git checkout -b feature-name`
2. **Develop and commit**: Make your changes
3. **Push branch**: `git push origin feature-name`
4. **Review deployment**: Check the automatically generated URL
5. **Create PR**: Open pull request with automatic preview
6. **Merge**: Merge to main for production deployment
7. **Cleanup**: Delete branch to remove deployment

This setup provides a complete CI/CD pipeline with zero configuration required after initial setup!
