# Ashwin Sharma — AI/ML Engineer Portfolio

A responsive portfolio built with Next.js App Router, React, and TypeScript. It presents public projects as engineering case studies and describes professional work in generalized terms to avoid exposing company-specific or client-confidential details.

## Technology

- Next.js App Router with React Server Components by default
- TypeScript and responsive CSS
- Dynamic static case-study routes from `lib/content.ts`
- Server-side contact endpoint using the Resend API
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

Open `http://localhost:3000`. The portfolio and case studies render without contact-service credentials. The form returns a configuration message until the email variables below are set.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-side API key for sending contact messages through Resend |
| `CONTACT_TO_EMAIL` | Inbox that receives portfolio messages |
| `CONTACT_FROM_EMAIL` | Verified sender address for Resend |
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL used for metadata and sitemap |

Keep real values in `.env.local` or deployment secrets. Never put service credentials in client-side code. `.env.example` contains names only.

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

`app/api/contact/route.ts` validates form fields, uses a hidden honeypot field, applies a basic per-process rate limit, and sends plain-text email from the server through Resend. The email credentials stay server-side. The in-memory limiter is a lightweight abuse barrier and is not shared between serverless instances; for a high-volume deployment, configure provider-level rate limiting or a shared rate-limit store. Do not test the live form with real personal information unless you are ready to receive the email.

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
3. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` as server-side environment variables.
4. Deploy. Check `/sitemap.xml`, `/robots.txt`, the case-study routes, and the contact endpoint configuration after deployment.

No private GitHub credentials or company repository content are required for deployment.
