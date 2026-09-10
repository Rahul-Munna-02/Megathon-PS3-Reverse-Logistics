# MEDTRACE

Track. Verify. Prevent Re-entry.

Phase 1 frontend for pharmaceutical reverse-chain compliance, built in the existing Next.js application with React, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The VS Code `MEDTRACE development` task also starts the development server on port 3000.

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

## Phase 1 Scope

- Responsive landing page with a five-stage custody trace, sample batch passport, and simulated destroyed-batch re-entry alert.
- Login validation, password visibility, loading and success states, and four demo roles.
- Application shell with responsive navigation, sidebar collapse, destination search, notifications, account details, and sign-out.
- Shared buttons, inputs, cards, badges, modals, drawers, tooltips, toasts, skeletons, empty states, and error states.

Overview is a welcome surface, not an operational dashboard. Batch Registry, Trace Scanner, Returns, Destruction, Fraud Monitor, Certificates, Notifications, and Settings are explicit future-phase placeholders. No backend, Supabase integration, live scanning, regulatory workflow, or compliance operation is implemented.

## Demo Access

Select a role on the login page to prefill its credentials. All roles use the password `Medtrace@2026`.

| Role | Email |
| --- | --- |
| Authority | authority@demo.medtrace.com |
| Manufacturer | manufacturer@demo.medtrace.com |
| Distributor | distributor@demo.medtrace.com |
| Retailer | retailer@demo.medtrace.com |

Authentication is a frontend demonstration only. It stores role, email, and an eight-hour expiry in tab-local `sessionStorage`; it does not store the password. The client route guard is not a security boundary, and roles do not grant production permissions. Replace [src/lib/demo-auth.ts](src/lib/demo-auth.ts) with real authentication and server-side authorization before using real data.

## Structure

- [app/](app/) is the active Next.js App Router, including landing, login, shell, placeholder routes, and error pages.
- [app/globals.css](app/globals.css) defines design tokens and shared component styling. [app/landing.css](app/landing.css) and [app/workspace.css](app/workspace.css) provide page-specific responsive styles.
- [src/components/ui/primitives.tsx](src/components/ui/primitives.tsx) contains reusable UI controls.
- [src/components/landing/Landing.tsx](src/components/landing/Landing.tsx) owns the interactive landing experience.
- [src/components/layout/](src/components/layout/) contains the shell, navigation, and welcome surface.
- [src/lib/demo.ts](src/lib/demo.ts) contains illustrative batch and role data.
- [src/lib/navigation.ts](src/lib/navigation.ts) defines the nine shell destinations.

The root `app` directory takes precedence over `src/app`. Existing source dashboard and module files remain preserved but are not served by the active Phase 1 routes. The root login route imports the login view from [src/app/login/page.tsx](src/app/login/page.tsx).

## Sample Data And Assets

The sample `MED-2026-001` batch contains 100 units of OncoSafe 500, expiring 30 Jun 2026. Its custody events, pharmacy re-entry, and sample certificate are illustrative only. They are not proof of destruction or regulatory evidence.

The locally served [public/medicine.jpg](public/medicine.jpg) pharmaceutical photograph is sourced from [Unsplash](https://images.unsplash.com/photo-1584308666744-24d5c474f2ae). Geist and Geist Mono are loaded through `next/font/google`. Motion respects the system reduced-motion preference.

## Verification

Browser checks cover trace selection/reset, evidence dialog dismissal and focus return, re-entry simulation, login validation and all four roles, session persistence/expiry, reserved routes, shell controls, and mobile layouts. These checks were performed interactively; no automated test suite is included.
