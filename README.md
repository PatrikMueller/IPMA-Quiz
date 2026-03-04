# IPMA-Quiz

PMA-Quiz is an educational, multimedia quiz application developed to support candidates preparing for the IPMA certification. The project delivers a fully client-side solution, accessible on any modern device. All questions and multimedia content are statically provided as JSON and asset files. There is no backend.

## Deployments

The application is automatically deployed to GitHub Pages with branch-specific deployments:

- **🚀 Production**: [https://patrikmueller.github.io/IPMA-Quiz/](https://patrikmueller.github.io/IPMA-Quiz/) (main branch)
- **📋 All Deployments**: [https://patrikmueller.github.io/IPMA-Quiz/deployments.html](https://patrikmueller.github.io/IPMA-Quiz/deployments.html)

### Branch Deployments
Each feature branch gets its own independent deployment:
- Format: `https://patrikmueller.github.io/IPMA-Quiz/[branch-name]/`
- Automatic deployment on every push
- Cleanup when branch is deleted
- Download HTML redirect artifacts from GitHub Actions for correct URLs

### Development
To run locally:
```bash
cd src
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Documents

-   [**Game Design Document (GDD)**](https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1081345 "https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1081345")**:** Outlines gameplay, user flows, quiz logic, and feature set
    
-   [**Technical Design Document (TDD)**](https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1114113 "https://patrikmueller.atlassian.net/wiki/spaces/IQ/pages/1114113")**:** Details technical architecture, data structures (e.g. question JSON), media handling, and UI components
