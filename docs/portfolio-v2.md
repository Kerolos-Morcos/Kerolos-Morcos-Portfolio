# Portfolio V2 — implementation and verification

## Vision

1. **Direction:** make real projects the evidence, use the architecture diagram to explain connected responsibilities, and keep the terminal as an optional personal detail. Existing section order, typography, portrait, color palettes, and visual identity remain recognizable.
2. **Fit:** the page now connects the stable Vue.js / Node.js positioning to application workflows, APIs, relational data, source links, and deployable products. It does not claim seniority, client outcomes, new metrics, or technologies absent from the existing content.

## Projects

3. **Case-study architecture:** every project has an overview action. Details are lazy-loaded into a shared native `<dialog>`, without introducing Vue Router. A `?project=<id>` query supports direct links, browser Back/Forward, and copying the current project link.
4. **Data model:** optional `caseStudy` metadata is merged into the existing project objects by ID. Supported content includes `problem`, `role`, `solution`, `architecture`, `features`, `stackNotes`, `result`, and `previewNote`. The presentation also supports optional `challenge`, `decisions`, and `lessons`; these are deliberately omitted when unverified. Existing title, description, category, stack, screenshot/cover, live URL, and GitHub URL are retained.
5. **Richer projects:** Mission Car Users, Fresh Cart, Adasah, and Bookly. No Saint George project was invented. Bookly's existing illustrative cover is explicitly labeled as artwork, not an application screenshot. Other projects use the neutral “Project preview” label.
6. **Transitions:** filter/page/swipe handlers and the existing TransitionGroup/height-stabilization logic are unchanged. Card images gently settle from 1.035 to 1 on fine-pointer hover. Details use a 420ms fade/20px entrance and a 220ms exit, independent of section entrances. Explicit close and browser Back were checked to preserve the exact originating scroll position and return focus to the card; one recorded desktop round trip remained at 5784px.
7. **Mobile details:** edge-to-edge, viewport-height sheet below 640px, sticky close control, scrollable content, large actions, and contained—not stretched—preview images. The background is locked with isolated root overflow handling, never fixed-body positioning.

## Engineering

8. **Architecture section:** added between Skills and Projects; no existing sections were reordered. Four DOM-based layers explain Vue.js UI, REST API contracts, Node.js / Express.js logic, and MySQL data.
9. **Interaction:** hover previews a layer on desktop; click/keyboard selection persists it. Adjacent connections highlight, and a small decorative signal uses transforms. Mobile uses a vertical sequence with tap-selectable nodes. Code samples keep LTR direction in Arabic.
10. **Message:** a user action travels through components, requests, validation, server logic, and relational data. Authentication/permissions and deployment/debugging notes explain cross-cutting concerns. The diagram is explicitly a conceptual model, not an undocumented claim about every project.

## Motion

11. **Section entrances:** accepted timing, easing, trigger margins, grouping, one-time completion, and resize/visibility behavior were preserved. Only the existing easing constant moved into a shared module. Engineering adds three groups to that same coordinator, not another observer architecture.
12. **Hero:** retained the accepted portrait, badge spacing, six-group entrance, orbit/pulse/ping/float/sheen timing, and stable role. Added a concise 1+ year / 20+ projects proof line, CV link, architecture shortcut, and terminal entry point. Copy now connects UI, APIs, and MySQL. The heading's accessible name avoids repeating the decorative text copy.
13. **Magnetic effects:** fine-pointer-only, bounded to 4px per axis, on the Hero contact/CV actions and the existing Projects contact CTA. Existing transforms and theme feedback remain separate. A browser sample measured approximately −3.23px / −1.73px, within the bound.
14. **Pointer spotlight:** a restrained theme-derived radial highlight inside project cards; coalesced with requestAnimationFrame. No layout writes, global mousemove listener, custom cursor, or 3D tilt. Pointer listeners and media-query listeners are cleaned up.
15. **Marquee:** a 65-second technology rail between Hero and About, masked edges, localized control, and pause on hover/focus or explicit button selection. Arabic reverses the rail direction without mirroring text.
16. **Continuous effects:** existing Hero motion is unchanged in normal mode. New continuous motion is limited to the rail, diagram signal, terminal caret, and supported scroll-progress decoration. No sound, autoplay media, canvas, WebGL, or animation framework was added.
17. **Reduced motion:** existing immediate-content handling is preserved. New pointer motion, ambient rail/signal/caret, progress decoration, and dialog entrance/exit are disabled or made static. V2 also stops Hero ambient effects under the preference. CSS/JS paths were reviewed; the operating system preference was not toggled during browser QA, so this is not a physical-device reduced-motion certification.

## Features

18. **Terminal:** local-only commands `help`, `whoami`, `stack`, `projects`, `experience`, `contact`, and `clear`; Enter execution, Up/Down history, Escape close, command chips, contextual section shortcuts, and screen-reader status feedback. History is capped at 30 commands and output at 20 entries. It never evaluates code or executes server commands. Initial focus stays on the close control, not the mobile keyboard.
19. **Easter egg:** `kerolos` reveals a short Full-Stack message. No extra hidden interaction competes with the main content.
20. **Scroll progress:** a 2px theme-aware CSS scroll-driven bar. Unsupported browsers simply omit this decoration. It adds no scroll listener and controls no content visibility.
21. **Statistics/skills:** existing values and presentation were preserved; no new count-up, percentages, or skill-bar replay system was added. This optional idea was omitted to protect the accepted motion system.
22. **Experience:** content, timeline direction, training presentation, and the mobile 20px gap are unchanged. No new claims or work-history labels were invented.
23. **Contact:** more concrete localized invitation, LinkedIn click tracking, and success/failure event hooks only. Form fields, validation, dropdown handlers, Other handling, API request, reset-on-success, retain-on-error, and WhatsApp destination remain unchanged. No confetti or new success animation was added.

## Analytics

24. **Web Analytics:** official `@vercel/analytics` 2.0.1, initialized using `inject()` and an explicit initial `pageview()`. Automatic history tracking is disabled so opening/closing a modal does not inflate page views; those interactions use dedicated events. The package's Vue wrapper imports Vue Router, so the official framework-independent API avoids adding an unnecessary router. See [Vercel's package reference](https://vercel.com/docs/analytics/package).
25. **Speed Insights:** official `@vercel/speed-insights` 2.0.0, initialized with `injectSpeedInsights()`. No custom metrics backend. See [Vercel's package reference](https://vercel.com/docs/speed-insights/package).
26. **Custom events:** `cv_download`, `project_live_click`, `github_project_click`, `linkedin_click`, `contact_submit_success`, `contact_submit_failure`, `project_case_study_open`, and `project_case_study_live_click`. Project events may include only a known project ID. Custom-event availability is plan-dependent; Vercel documents it for Pro/Enterprise. See [custom events](https://vercel.com/docs/analytics/custom-events).
27. **Privacy:** no form text, name, email, phone, arbitrary event properties, public visitor counters, or custom fingerprinting. Event URLs lose query strings, fragments, and credentials. Tracking is disabled for development, local preview, and Do Not Track. Browser checks confirmed no Vercel scripts on the fresh local preview. Production Dashboard delivery is not claimed: enable Web Analytics and Speed Insights in the Vercel project, deploy, then confirm incoming data and plan support.

## Architecture

28. **New components:** shared PortfolioDialog, ProjectCaseStudy, EngineeringFlow, DeveloperTerminal, TechMarquee, ScrollProgress, and PortfolioAnalytics. The heavy overlay views are split into asynchronous chunks.
29. **New composable:** `useProjectDetails` owns selected project, query/history state, isolated scroll restoration, and return focus. Native dialog mechanics remain in the dialog component. Pointer effects and click tracking use small lifecycle-aware directives instead of global discovery loops.
30. **New data:** `caseStudies.js` contains bilingual editorial extensions only. Existing 13 project records, URLs, assets, and technologies remain intact. Analytics derives valid IDs from that same project array.
31. **Localization:** a separate `v2` namespace provides matching English and Arabic labels, architecture layers, terminal responses, and rail controls. Main Hero and Contact descriptions were refined in both locales. An automated test requires matching nonempty translation shapes.
32. **CSS:** feature styles stay component-scoped. `portfolio-v2.css` contains shared surfaces, actions, focus states, pointer primitives, and narrow card/Hero integration. Shared motion tokens are 220/320/420ms plus the accepted easing. Existing `portfolio-overrides.css` was not expanded. New filled-button normal/hover colors meet 4.5:1 text contrast across all six palettes in the automated test.

## Regression coverage

33. **Projects:** 1 card below 768px; 3 at 768px and above. Desktop/mobile pagination and an actual horizontal drag were exercised; the drag changed Fresh Cart back to Mission Car Users. Existing filter/pagination/swipe/transition functions remain byte-for-byte unchanged. Card alignment was inspected, with equal heights and aligned detail actions on desktop. Not every combination of all 13 projects and every filter was exhaustively traversed.
34. **Burger:** existing architecture is untouched. Mobile opening, language/mode controls, and closing via the current Projects item were exercised. One same-section check retained 5639.2px before and after. No fixed-body lock was introduced.
35. **Language/theme:** saved Arabic/RTL and light mode survived reload; English switching works. A previously unused local origin rendered English/LTR. It also showed the repository's existing dark fallback: V2 did not add or change a forced-dark policy. All six palettes were selected in both modes and shared colors updated without refresh.
36. **Contact:** local UI check verified the Other field. A local-preview failure showed the error message and retained entered fields. No live email was sent, and production Resend delivery was not retested. Email/WhatsApp/social/CV destinations remain as supplied; the CV asset was not replaced.
37. **RTL/LTR:** Arabic/English Hero, architecture, case-study, and terminal views were visually inspected at 390px and/or 1440px as detailed below. RTL scope leakage found during development was fixed at its source and covered by a compiled-CSS regression test. Native dialogs handle focus containment and Escape; close returns context to the trigger.
38. **Light/Dark:** representative full views were inspected in both modes. All six palette selections were checked in each mode; this was not a screenshot of every section in all 12 combinations. New dialogs also declare the appropriate native scrollbar color scheme.
39. **Responsive method:** native browser viewport overrides and read-only DOM geometry checks at nine widths. No horizontal page overflow or diagram overflow was found; the expected card counts were confirmed. These are browser viewport tests, not claims of testing nine physical devices.

## Validation results

| Report item | Viewport | Layout result | Additional coverage |
| --- | --- | --- | --- |
| Extra | 320 × 740 | No page/diagram overflow; 1 card | Narrow layout geometry |
| 40 | 360 × 800 | No page/diagram overflow; 1 card | Terminal screenshot, 44px command targets, no dialog overflow |
| Extra | 375 × 812 | No page/diagram overflow; 1 card | Narrow layout geometry |
| 41 | 390 × 844 | No page/diagram overflow; 1 card | Arabic/English, both modes, Hero, diagram, sheets, terminal, swipe/menu/Contact |
| 42 | 430 × 932 | No page/diagram overflow; 1 card | Fresh-origin initialization, dark terminal, keyboard command chips |
| 43 | 768 × 1024 | No page/diagram overflow; 3 cards | Tablet layout geometry |
| 44 | 1024 × 768 | No page/diagram overflow; 3 cards | Desktop breakpoint geometry |
| 45 | 1440 × 900 | No page/diagram overflow; 3 cards | Arabic/English, both modes, architecture, cards, dialogs, terminal, history and focus |
| 46 | 1920 × 1080 | No page/diagram overflow; 3 cards | Hero layout geometry and bounded pointer movement; screenshot surface was cropped by the host |

47. **Build/tests:** `npm run build` passes. `npm test` passes 7 tests: translation parity, case-study integrity, URL sanitization, event allowlisting, motion hierarchy, 12 button contrast cases, and scoped-CSS safety. The last production bundle has an approximately 71.6kB gzip main JS chunk; case study, terminal, and shared dialog JS are separate ~1–2kB gzip chunks. There is no existing TypeScript/lint script.
48. **Whitespace:** `git diff --check` passes. Git emitted Windows LF-to-CRLF normalization notices, not whitespace errors.
49. **Console:** clean production-preview checks returned no application errors/warnings. Earlier integration failures were corrected before validation. The deliberate local Contact failure is not evidence of a production delivery failure. No real-device FPS, GPU paint-cost, exhaustive screen-reader, OS reduced-motion, or production analytics-delivery claim is made. Accepted motion code is preserved, but real-device down/up/down and fast-scroll visual acceptance remains advisable before release.
50. **Complete file list:** below. No files were deleted; no commit or deployment was made.

### Modified files

```text
README.md
index.html
package.json
package-lock.json
src/App.vue
src/main.js
src/components/AboutSection.vue
src/components/ContactSection.vue
src/components/FooterSection.vue
src/components/HeroSection.vue
src/components/ProjectsSection.vue
src/composables/useEntranceMotion.js
src/composables/usePortfolio.js
src/data/projects.js
src/i18n/ar.js
src/i18n/en.js
src/i18n/index.js
```

### Created files

```text
docs/portfolio-v2.md
src/assets/portfolio-v2.css
src/components/analytics/PortfolioAnalytics.vue
src/components/engineering/EngineeringFlow.vue
src/components/portfolio/ScrollProgress.vue
src/components/portfolio/TechMarquee.vue
src/components/projects/ProjectCaseStudy.vue
src/components/terminal/DeveloperTerminal.vue
src/components/ui/PortfolioDialog.vue
src/composables/useProjectDetails.js
src/data/caseStudies.js
src/directives/pointerMotion.js
src/i18n/v2.js
src/lib/analytics.js
src/lib/analyticsPolicy.js
src/motion.js
tests/v2.test.mjs
```

## Reversibility and next steps

- **Case studies:** remove the detail action/dialog/composable wiring from ProjectsSection and the case-study merge in projects.js. Existing page/filter/swipe logic is independent.
- **Engineering/rail/progress:** remove their individual App imports/usages; their styles live with the components.
- **Terminal:** remove its App state/import/render and Hero trigger; it shares only the dialog and localized V2 labels.
- **Pointer effects:** remove the individual `v-magnetic` / `v-spotlight` bindings; no navigation logic depends on them.
- **Analytics:** remove PortfolioAnalytics plus the track bindings/hooks and SDK dependencies. Form submission does not depend on analytics success.
- **Production:** enable both Vercel products and confirm plan support, deploy through the normal workflow, and inspect Dashboard data. Nothing was published during this task.
- **Content evidence:** additional first-hand challenges/decisions/lessons would strengthen the case studies, but have not been invented. Existing project screenshots/covers and the supplied social-preview artwork are unchanged. That artwork still contains its original 1.5+ year and additional-stack text; a future approved asset update could align it with the site's 1+ year / MySQL positioning. Query-based case studies share the portfolio's static social metadata, not dynamically rendered per-project cards.
