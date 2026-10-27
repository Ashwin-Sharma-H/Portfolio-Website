# Ashwin Sharma — AI/ML Engineer Portfolio

A responsive portfolio built with Next.js App Router, React, and TypeScript. It presents public projects as engineering case studies and describes professional work in generalized terms to avoid exposing company-specific or client-confidential details.

## Technology

- Next.js App Router with React Server Components by default
- TypeScript and responsive CSS
- Dynamic static case-study routes from `lib/content.ts`
- Contact form submissions handled by Formspree
- Metadata, Open Graph image, JSON-LD, sitemap, and robots route

## Requirements

- Node.js 20.9 or newer
- pnpm 9 or newer (or npm if available)

## Local development

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. The portfolio and case studies render without contact-service credentials. The contact form needs a Formspree form ID to submit messages.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL used for metadata and sitemap |

`.env.example` contains the environment variable names used by the app.

## Update profile information

- Home-page copy, experience, and section structure live in `app/page.tsx`.
- External profile links live in `lib/content.ts`.
- The visual style and responsive breakpoints live in `app/globals.css`.
- Update the person's structured data in `app/layout.tsx` if the public role or profile URLs change.

## Add or edit projects

Update the `projects` array in `lib/content.ts`. Each entry supplies its slug, overview, role, problem, approach, architecture layers, stack, and links. Project detail pages are generated at `/work/[slug]`. Keep claims supported by public project documentation or confirmed contribution details. Professional project entries use generic titles and descriptions; do not add internal company names, client details, source code, credentials, private endpoints, or proprietary implementation information.

## Update professional experience

Edit the Experience section in `app/page.tsx`. Current reviewed timeline:

- AI/ML Intern: May 2025–August 2025
- Associate AI/ML Engineer: August 2025–Present

Professional case-study summaries are maintained in `professionalProjects` in `lib/content.ts`; keep them at the approved, high level.

## Certifications

The five reviewed LinkedIn-listed certifications are in `certifications` in `lib/content.ts`. Credential IDs and certificate images are intentionally omitted.

## Add or replace the resume

The current downloadable file is `public/resume/Ashwin_Sharma_Resume.pdf`. Replace that file to update the resume while keeping its path stable, or update the link in `app/page.tsx` if the filename changes.

## GitHub integration

GitHub is linked as a profile and repository evidence source. The site does not use a GitHub token, call the GitHub API from the browser, or display private-repository information.

## Contact form

`components/contact-form.tsx` uses Formspree's React hook to submit messages to form `mbggoezw`. Set the notification inbox and verify it in the Formspree dashboard. The form includes Formspree's `_gotcha` honeypot field. Configure spam filtering and allowed domains in the Formspree dashboard as needed.

## Checks

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push this project to a Git provider and import it into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS portfolio domain.
3. Configure and verify the recipient email for form `mbggoezw` in Formspree; no API key or Vercel environment variable is needed.
4. Deploy. Check `/sitemap.xml`, `/robots.txt`, the case-study routes, and submit a contact form message.

No private GitHub credentials or company repository content are required for deployment.
