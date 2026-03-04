# 🎓 IPMA Quiz

A Next.js-based quiz application for IPMA (International Project Management Association) certification preparation.

PMA-Quiz is an educational, multimedia quiz application developed to support candidates preparing for the IPMA certification. The project delivers a fully client-side solution, accessible on any modern device. All questions and multimedia content are statically provided as JSON and asset files. There is no backend.

## Key Documents

-   [**Game Design Document (GDD)**](https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1081345 "https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1081345")**:** Outlines gameplay, user flows, quiz logic, and feature set
    
-   [**Technical Design Document (TDD)**](https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1114113 "https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1114113")**:** Details technical architecture, data structures (e.g. question JSON), media handling, and UI components

## 🚀 Live Deployments

- **🌟 Production**: [https://patrikmueller.github.io/IPMA-Quiz/](https://patrikmueller.github.io/IPMA-Quiz/)
- **📋 All Deployments**: [https://patrikmueller.github.io/IPMA-Quiz/deployments.html](https://patrikmueller.github.io/IPMA-Quiz/deployments.html)

### Branch-Specific Deployments

This project features **automatic branch-specific deployments**:

- **Main Branch** → `https://patrikmueller.github.io/IPMA-Quiz/` (Production)
- **Feature Branches** → `https://patrikmueller.github.io/IPMA-Quiz/[branch-name]/` (Preview)

Each branch gets its own independent deployment for testing and review!

## 🛠️ Development

```bash
# Install dependencies
cd src
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📁 Project Structure

```
├── src/                    # Next.js application
│   ├── app/               # App Router pages
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
├── DEPLOYMENT.md          # Detailed deployment docs
└── README.md             # This file
```

## 🔄 CI/CD Pipeline

Every push triggers:

1. **🔍 Lint**: ESLint validation (non-blocking)
2. **🔨 Build**: Next.js static export with branch-specific paths
3. **🚀 Deploy**: 
   - Main branch → Root directory
   - Feature branches → Subdirectories
4. **📦 Artifact**: HTML redirect page with correct URLs
5. **💬 Comment**: PR comments with deployment links

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment setup and troubleshooting
- **[deployments.html](https://patrikmueller.github.io/IPMA-Quiz/deployments.html)** - Live deployment overview

## 🎯 Features

- ✅ Branch-specific deployments
- ✅ Automatic cleanup when branches are deleted  
- ✅ HTML redirect artifacts with correct URLs
- ✅ Real-time deployment overview page
- ✅ PR comments with deployment links
- ✅ ESLint validation on every push
