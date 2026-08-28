# Shahm Frontend

## Overview

The Shahm frontend is the bilingual React public website and JWT-protected management dashboard. It consumes the Shahm Django API and renders CMS pages, services, dynamic forms, request-access workflows, appointments, careers, messaging, and administration.

## Tech Stack

- React 19 and Create React App (`react-scripts` 5)
- React Router 6, Zustand, Axios
- i18next / react-i18next
- SunEditor, SweetAlert2, react-hot-toast
- DOMPurify for CMS rich text
- Noto Kufi Arabic as the single interface typeface, served from the build

## Application Architecture

`src/index.js` initializes i18n and `BrowserRouter`, then renders `App`. `AppRouter` composes public, authentication, and protected dashboard routes. Domain API modules share one Axios client; Zustand stores coordinate shared remote/session state.

## Repository Structure

```text
src/
├── api/                    Axios client, route constants, domain APIs
├── assets/                 Fonts and source images/icons
├── components/
│   ├── common/
│   ├── forms/
│   └── layout/
├── pages/
│   ├── auth/
│   ├── dashboard/          Domain-grouped management pages
│   └── public/
├── router/
├── store/
├── styles/                 Domain-organized CSS
└── utils/
```

## Public Application

Public routes provide home, services, about, blog, legal content, contact, FAQ, and temporary request-access pages. CMS navigation may link directly to stable URLs.

## Dashboard

Protected domains include users, CMS, forms, services, appointments, careers/applications, blog, messages, SEO, site settings, SMTP settings, and email templates.

## Dynamic Forms

- `DynamicPublicForm` manages schema loading, values, validation, multipart payloads, and submission results.
- `DynamicFieldRenderer` selects field components from API-provided types.
- `components/forms/fields/` contains field implementations.
- Sections, keys, options, validation, dynamic sources, and success responses come from Django and are runtime contracts.

## CMS Form Layer

Dashboard content screens share one set of form parts instead of rebuilding a
form per screen.

- `components/forms/cms/BilingualField` is a single labelled field holding both
  languages, with a language switch, a marker when the second language is still
  empty, a marker on the language the server rejected, and a copy-from-Arabic
  action. It replaces the Arabic input beside an English input that every
  translated value used to need.
- `components/forms/cms/FieldRow` gives an untranslated control the same label,
  hint and error placement.
- `components/forms/cms/SaveBar` states whether an edit is pending and disables
  the save when nothing changed.
- `components/forms/cms/DraftNotice` offers back an interrupted edit.
- `hooks/useResourceForm` holds values, tracks which fields changed, runs the
  save, and puts the server's per-field messages back on the fields.
- `hooks/useFormDraft` keeps an unsaved edit in `localStorage` and warns before
  the window closes while one is pending. In-app navigation is not blocked:
  the app uses `BrowserRouter`, whose router does not expose a navigation
  blocker, so the draft is the safety net there.
- `utils/apiErrors` parses the API failure envelope
  (`{ success, message, errors: { field: [...] } }`, plain DRF serializer
  errors, `detail`, `non_field_errors`) into a form message plus per-field
  messages, and reports a cancelled request as cancelled rather than failed.

`styles/forms/cms-form.css` styles them through `--sf-*` tokens whose defaults
match the current dashboard. A screen hands the layer its own palette with one
rule rather than restyling controls:

```css
.cnt-section-content { --sf-border: var(--cnt-border); }
```

`pages/dashboard/contact/ContactCardsCMS.jsx` is the screen migrated onto the
layer. Screens still on the old pattern keep working; they are migrated one at
a time.

## State Management

Zustand stores cover authentication, public initialization, CMS/about/blog/contact/FAQ data, dashboard statistics, users/settings/email, messaging, form building, and request-access workflows. Page-local UI state remains in components.

## API Layer

`src/api/axiosClient.js` owns base URL configuration, JWT attachment, refresh/retry, and multipart handling. `src/api/routes.js` is the single source of API paths; domain modules contain request functions but no embedded endpoint literals. The backend repository publishes the exhaustive machine-readable mapping in `docs/API_CONTRACT_MATRIX.json`.

Duplicate-request cancellation is opt-in. A request passing `dedupe: true`
replaces an identical request that is still in flight, which is what typeahead
search needs; every other request runs to completion. Cancelling every request
that shared a method and URL also aborted legitimate parallel calls, so two
components loading the same resource left one of them empty. A caller that
supplies its own `signal` keeps it.

## Internationalization

`src/i18n.js` loads `public/translation/ar.json` and `en.json`. `App` synchronizes document language, RTL/LTR direction, and body classes.

## Styling Architecture

```text
src/styles/
├── auth/
├── common/
├── dashboard/
│   ├── cms/
│   └── content/
├── forms/
├── layout/
│   ├── dashboard/
│   └── public/
└── pages/
```

Selectors were preserved during organization. Component imports retain the existing cascade.

### Typeface

The interface is set in Noto Kufi Arabic alone. `src/assets/fonts/fonts.css`
declares the variable font across weights 100 to 900 and is the only place a
font file is referenced; no font host is contacted, so the site renders text
without a third-party request. The three family variables
(`--font-ar-heading`, `--font-en-heading`, `--font-content`) are kept so every
existing selector still resolves, and they all point at that one family:
headings separate from body text by weight and size, not by typeface.

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

The fallback is same-origin `/api`; separate-host deployments must set this at build time.

## Local Development

```bash
npm ci
npm start
```

The committed `.npmrc` selects the legacy peer resolver required by CRA 5's optional TypeScript range and i18next's modern optional peer. This keeps a plain `npm ci` reproducible.

## Production Build

```bash
npm run build
```

`build/` is generated and ignored.

## Testing

```bash
npm test -- --watchAll=false
```

The smoke suite verifies router/login/public rendering, protected-route behavior, centralized API paths, Axios authentication behavior, dynamic option and phone values, safe navigation, and HTML sanitization. Network and editor packages are mocked only at external boundaries.

## Linting

```bash
npm run lint
```

## Backend Integration

Requests use `REACT_APP_API_BASE_URL`. Login and refresh use `/accounts/login/` and `/accounts/refresh/`; search uses `/cms/public/search/`.

## Routing

- `PublicRoutes.jsx`: anonymous pages and compatibility redirects
- `AuthRoutes.jsx`: login
- `DashboardRoutes.jsx`: routes nested beneath `ProtectedRoute`
- `ProtectedRoute.jsx`: auth gate and dashboard layout outlet

Route URLs are contracts and are independent of page file locations.

## Deployment

The SPA requires history fallback to `index.html`. `public/.htaccess` contains Apache HTTPS/canonical-host redirects and React Router fallback for `shahmlaw.sa`. Set the API variable before building and deploy generated `build/` output through the hosting pipeline, not Git.

## Security Considerations

- CMS HTML is sanitized before `dangerouslySetInnerHTML`.
- CMS-configured links are validated by `src/utils/safeNavigation.js`; new-window links use `noopener,noreferrer`.
- `src/utils/tokenStorage.js` is the only module that reads or writes the stored tokens, and it tolerates a browser that refuses storage. The Axios client and the authentication store both go through it, so a refresh cannot update one and miss the other.
- There is no idle timeout. A session lasts until the editor signs out or the refresh token expires, which the JWT settings govern. The dashboard used to sign an editor out after ten idle minutes, which is shorter than the time it takes to write one page of content.
- JWTs are currently persisted in browser `localStorage`. This increases the impact of a successful XSS attack. The application therefore relies on strict HTML sanitization, safe URL handling, minimizing script-injection surfaces, and a restrictive Content Security Policy at the deployment proxy. Moving tokens to HttpOnly cookies is a separate authentication-architecture change.
- The API client sends Bearer credentials only to relative API requests or absolute URLs beneath the configured API origin/path. Tokens are cleared on logout and unrecoverable refresh failure, are never logged or placed in URLs, and failed refreshes reject all queued requests.
- Do not commit environment files or build output.
- Treat external links and uploads as untrusted.

## Handoff Notes

- This frontend remains on Create React App 5. As of August 27, 2026, `npm audit` reports 31 advisories (9 low, 7 moderate, 15 high, 0 critical). Most are inherited through CRA's build, development-server, Jest/jsdom, Workbox, and webpack chains. React Router v6 has direct runtime advisories whose offered remediation is the forbidden v7 major upgrade, and SunEditor has a direct high-severity embed-plugin DOM-XSS advisory whose offered remediation is a semver-major upgrade. These findings must not be represented as zero known frontend vulnerabilities.
- Plan a separately tested Vite/current-router migration. Do not use `npm audit fix --force` as a release shortcut; it replaces React Router v6 with v7 and changes the supported toolchain.
- Keep React Router on the compatible v6 line while CRA/Jest 27 remains.
- Update backend API docs and frontend modules together.
- Run build, tests, lint, and API-path scans before releases.

## Troubleshooting

- A cross-origin request failure usually means the build-time API base and backend CORS/CSRF origins do not agree.
- A direct SPA route returning 404 requires the web server to fall back to `index.html`.
- Use `npm ci`, not a partially updated `node_modules`, when reproducing lockfile behavior.
- Browser compatibility database notices are toolchain maintenance notices; they do not replace lint, tests, or a production build.

## Project Attribution

Project source developed by **ENG. FAHAD ALSHWIHANI**.

- Portfolio: [https://fyaa.io](https://fyaa.io)
- GitHub: [https://github.com/FahadAlshwihani](https://github.com/FahadAlshwihani)
- LinkedIn: [https://www.linkedin.com/in/fahad-alshwihani/](https://www.linkedin.com/in/fahad-alshwihani/)

Copyright © 2026 ENG. FAHAD ALSHWIHANI. No open-source license is granted by this repository unless a separate `LICENSE` file is supplied.
