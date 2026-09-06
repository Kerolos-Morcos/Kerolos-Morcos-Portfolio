# Portfolio V3 — Signal to System

## Implementation plan

- Keep V2 as the content and behavior foundation. Do not modify the accepted entrance coordinator, navigation, training, methodology, experience, contact, or preference initialization.
- Use DOM/SVG/CSS, not WebGL. A legible four-node request circuit has more explanatory value than an abstract 3D object, and needs no new rendering dependency.
- Hero: oversized two-line name, stable Full-Stack identity, immediate Contact/CV, proof line, approved portrait framed by Vue → API → Node/Express → MySQL. Small isolated depth response; mobile retains the circuit in a compact composition.
- First-session choreography: nonblocking signal sweep and staggered name/portrait entrances under 1200ms. No loading percentage, overlay gate, or replay on state changes. Reduced motion renders the complete composition immediately.
- System Mode: one session-scoped state shared by a discoverable toggle and Terminal. Pointer-transparent section annotations are absolute overlays, not layout content.
- Request Journey: user-triggered finite-state simulation inside Engineering Flow, with sequential nodes, packet connections, a final UI result, and replay. No network call or latency claim. Cancel on unmount/hidden/reduced-motion changes.
- Projects: bounded image-only depth plus existing spotlight; preserve every pagination/filter/swipe/history function. Enhance case-study image framing without changing the native dialog.
- Context pointer: semantic opt-in labels only, native cursor retained, fine pointer only; cleanup and reduced-motion support.
- QA: production preview screenshots and interaction checks at 320, 360, 375, 390, 430, 768, 1024, 1440, 1920; English/Arabic, light/dark, six palettes; unit tests and source-boundary checks. Document tooling limitations honestly.

## Baseline

Before V3: entry JavaScript 221,161 bytes (72.12 kB gzip); entry CSS 99,437 bytes (17.23 kB gzip). No new dependency is planned. V2 Hero remains in `src/components/HeroSection.vue` for straightforward rollback.

## Reversibility

V3 features live in dedicated hero/system/pointer/request components. App integration, Terminal commands, and optional project visual directives are narrow integration points. No commit or deployment is part of this pass.

## Final local review — 7 September 2026

V3 is implemented locally for visual approval. No commit, push, deployment, new dependency, or image-asset replacement was performed.

### Creative direction (report items 1–6)

1. **Signal to System:** identity and engineering become one composition, supported by a connected stack, a request simulation, and optional System Mode.
2. It makes the Full-Stack role concrete: interface → API → Node/Express → MySQL, rather than decorative technology for its own sake.
3. No WebGL or Three.js.
4. DOM/SVG/CSS deliver the circuit, portrait depth, and theme response without a rendering engine, GPU context, or additional dependency. Essential content remains HTML.
5. The first entrance uses a nonblocking signal line and 680ms WAAPI entrances with 75ms offsets capped at 375ms. The decorative line finishes at 1150ms. No loader, fake percentage, input gate, or scroll lock.
6. The intro is claimed once in sessionStorage. A fresh tab showed `data-intro=true`; refreshing it showed `false`. Theme/language changes do not remount the Hero or replay the sequence. Deep-linked visits skip it.

### Hero (7–15)

7. Desktop pairs the identity column with the interactive portrait circuit; mobile stacks the identity, immediate CTAs, and compact scene.
8. Oversized semantic H1, two-line name, theme-derived surname accent, stable readable role. No scrambled identity or rotating role.
9. Existing approved WebP portrait, undistorted, inside an arch-shaped frame. No generated face or new photo.
10. Four selectable Vue.js / REST API / Node.js / MySQL nodes and a connected SVG path; the selected layer has a concise localized explanation.
11. Fine-pointer scene depth is bounded to ±4° horizontally and ±3° vertically. Updates are coalesced, bounds cached, and depth resets on leave/scroll/resize. Name and role remain stationary.
12. Mobile retains the circuit and ambient pulse in a 255px scene (220px below 360px), with 44px node controls. Contact/CV remain above the fold at the tested sizes.
13. Text, surfaces, borders, and accent contrast use the existing light/dark tokens. No initialization changes.
14. All six palettes were visually inspected in both modes. Circuit strokes and portrait borders changed immediately to each palette's shared primary color; accent text also updated.
15. Reduced motion skips choreography, stops circuit motion, disables depth/context pointer, and resolves the request without travel animation. Hero also has a pause control. Browser pause was verified; reduced-motion behavior was checked through source and targeted logic tests, not an OS-level emulation.

### WebGL (16–25)

16–24. Not applicable: no renderer, shaders, DPR management, WebGL RAF, GPU disposal, or context-loss path. The immediately available DOM/SVG scene is the implementation, not a late-loading canvas fallback. Hero ambient motion pauses offscreen/when the document is hidden; lifecycle listeners and pending animation frames are cleaned up.

25. No rendering dependency or WebGL bundle. Overall bundle comparison is recorded in item 62.

### System Mode (26–31)

26. A small keyboard-accessible toggle with `aria-pressed`, plus Terminal `system`, `system on`, and `system off` commands.
27. Eight numbered section annotations, with identity/toolkit/architecture/evidence/experience/process/contact labels.
28. Subtle grid, border, and corner markers; 500ms opacity transition. Decorations are aria-hidden and pointer-transparent. Comparing section positions/heights and scroll before/after activation produced identical values.
29. Terminal and toggle control the same state. `system on/off`, `theme`, `open mission-car-users`, and `goto architecture` were exercised. Opening a project uses the existing case-study mechanism; navigation uses the existing Terminal section shortcut.
30. Small provide/inject composable, with optional sessionStorage only. No new state library, localStorage preference overwrite, or query/history mutation.
31. Localized control text; logical annotation placement mirrors with direction. Technical labels remain LTR. The floating toggle stays on the physical right to avoid the existing left-side back-to-top control in both languages.

### Request Journey (32–37)

32. User action → Vue → REST API → Node/Express rules → MySQL → JSON response → UI update.
33. Finite states: idle, request, api, server, database, response, complete.
34. Sequential node/trace emphasis and the existing packet connections. A single pending timer advances the simulation. Fast packet travel is limited to `.is-running`; browser checks confirmed 0.65s while running and the original 4s ambient speed after completion.
35. Explicit Run/Run again; duplicate runs cannot start parallel timers. It never repeatedly autoplays the lifecycle.
36. Mobile uses vertical architecture nodes and a wrapping trace. English and Arabic request completion and replay were checked in the production preview, including the mobile presentation.
37. Prominent bilingual simulation/no-live-request label and an explicit illustrative-result disclaimer. No HTTP request, invented latency, or production measurement. Timers cancel on hidden/unmount/reduced-motion changes; reduced mode completes simply.

### Projects (38–41)

38. Existing spotlight plus small image-only depth; no new project assets or invented outcomes.
39. Fine-pointer image pan is bounded to ±4px with a modest fixed overscan to prevent exposed edges. It resets on exit; mobile/reduced-motion paths do not use it. Browser check showed unchanged project section height and scroll position.
40. Case-study intro gains a subtle theme wash. Verified screenshots gain a restrained browser-style frame; the explicitly illustrative Bookly cover is not presented as a real application screenshot. Native dialog behavior is untouched. VISIT companion is placed in the dialog top layer, with the native cursor retained.
41. Pagination/filter/swipe/sizing functions are unchanged. The only new behavioral integration is an exposed, allowlisted `openProjectById` wrapper for Terminal. Query-based opening, Escape/close, and browser Forward reopening were checked.

### Closed-area regressions (42–50)

42. Accepted global section entrance coordinator, timing, and observer architecture unchanged; V3 Hero choreography is independent.
43. About/code-snapshot source unchanged. Existing tests confirm no hover/pointer hooks on `kerolos.js`.
44. Training source unchanged; existing seven carousel/code tests pass. Mobile next controls and a horizontal drag were exercised; carousel height and scroll remained stable.
45. Methodology source and carousel behavior unchanged; no V3 hooks added there.
46. Project navigation implementation unchanged. Settled mobile previous/next checks retained a 1020px section height and exactly the same scroll position. No claim of a physical touch-device test.
47. Burger logic unchanged. Mobile menu and language/theme controls were used during QA; no fixed-body lock added.
48. Contact/form/dropdowns/Other project type/Resend/API/WhatsApp source unchanged; no form submission or production data action was performed.
49. Experience content/timeline/mobile gap source unchanged.
50. Existing Analytics, Speed Insights, and privacy-safe tracking integration preserved. No speculative V3 analytics events added.

### Validation (51–63)

51. Responsive review matrix: 320×740, 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080. No horizontal overflow in the measured layouts. The browser capture surface clips the far right at 1920px; that size has DOM geometry checks and partial visual evidence, not a complete full-width visual sign-off.
52. English and Arabic desktop/mobile Hero inspected; Arabic narrow-width layout and request flow checked. This was not an exhaustive language × size × palette cross-product.
53. Light/dark Hero inspected, with localized controls and readable content.
54. Purple Blue, Pink Orange, Green Emerald, Blue Cyan, Red Rose, and Amber Orange visually inspected in both modes, with screenshots and computed-token checks.
55. Reduced-motion paths and cancellation covered by source/logic tests. No physical device, OS reduced-motion toggle, GPU profiler, or full accessibility audit was available in this pass.
56. Fine-pointer Hero response/reset, project pan/reset, RUN and VISIT contextual labels checked. Native cursor retained; irrelevant targets hide the companion. No automated outside-window pointer test was available.
57. Browser-emulated phone widths checked, including mobile architecture/Terminal/training/navigation. This is not a substitute for real iOS/Android touch and battery testing.
58. `npm test`: **20 passed, 0 failed** (13 existing and 7 targeted V3 tests).
59. `npm run build`: **passed**, 90 modules transformed.
60. `git diff --check`: **passed**. Git reports normal Windows LF→CRLF notices, not whitespace errors.
61. Production-preview console checks returned no application errors or warnings during the tested flows.
62. Entry JS: **221,161 → 233,256 bytes**, gzip **72.12 → 76.94 kB** (+4.82 kB). Entry CSS: **99,437 → 116,374 bytes**, gzip **17.23 → 20.35 kB** (+3.12 kB). Terminal stays lazy (~4.82 kB JS / 2.13 kB gzip); case study stays lazy (~4.63 kB JS / 1.85 kB gzip). No dependency/asset growth.
63. Exact source inventory is below. Twelve files created, six modified, none deleted. Build output is generated/ignored, not a source change.

### Exact files

Created:

- `docs/portfolio-v3.md`
- `src/components/hero/HeroExperience.vue`
- `src/components/hero/HeroSystemScene.vue`
- `src/components/system/SystemMode.vue`
- `src/components/engineering/RequestJourney.vue`
- `src/components/portfolio/ContextPointer.vue`
- `src/composables/useSystemMode.js`
- `src/composables/useRequestJourney.js`
- `src/directives/projectDepth.js`
- `src/i18n/v3.js`
- `src/lib/v3.js`
- `tests/v3.test.mjs`

Modified:

- `src/App.vue`
- `src/components/ProjectsSection.vue`
- `src/components/engineering/EngineeringFlow.vue`
- `src/components/projects/ProjectCaseStudy.vue`
- `src/components/terminal/DeveloperTerminal.vue`
- `src/i18n/index.js`

### Visual evidence and remaining approval

Screenshots are outside the repository in:

`C:/Users/Studio/.codex/visualizations/2026/09/01/01a05de9-bf9f-7f71-b5f4-a59ede1b3fb9/portfolio-v3-review/`

Key captures include `hero-en-dark-1440-final.png`, `hero-en-dark-390-final.png`, `hero-ar-light-390-final.png`, `hero-ar-dark-320-final.png`, `request-system-en-dark-1440.png`, `request-ar-dark-390.png`, and twelve `palette-{light|dark}-*.png` images.

Entrance captures are still frames, not video. The first available instrumented capture was approximately 3.3 seconds after navigation began, with identity/CTAs visible; the tool did not capture the subsecond choreography frame by frame. Source timings, session behavior, and settled composition were verified. Visual approval and real-device motion testing remain with the user before deployment.

To remove an experiment, remove its App integration and dedicated component/composable; restore the old Hero import for the V2 Hero. Request Journey can be unwrapped from Engineering Flow, and the project directive/scoped image styles removed without changing navigation. Remove Terminal V3 commands and its project-open integration if System Mode is removed. The old Hero and accepted V2 behavior files remain intact.
