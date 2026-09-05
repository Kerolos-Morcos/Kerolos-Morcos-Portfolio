# Entrance motion implementation and verification

Verified locally on 5 September 2026. No deployment was performed.

## Outcome and limits

The old CSS-hidden reveal system has been replaced with visible-by-default, finite browser animations. Desktop entrances are measurable and visible again. Mobile slow-scroll, fast-scroll, reverse-scroll, repeated-pass, delayed-observer, reload, and back-navigation checks did not expose invisible entrance content.

This is not a claim of zero dropped frames on every device. The embedded Chromium tests recorded occasional longer frames. Physical-phone profiling and GPU layer/paint traces were not available. Existing navbar active-link layout shifts were observed and were not changed because navbar behavior is explicitly out of scope.

## Requested 36-point report

1. **Why the previous rewrite failed:** `reveal-pending` still set real content to `opacity: 0`. Adding `is-visible` only started a CSS transition; it did not immediately make the pixels opaque. Entire content groups, including the contact form card and supporting-skills grid, could therefore appear empty or incomplete even after an observer callback. Desktop Hero had no dedicated entrance sequence.
2. **Exact bottleneck found:** the visibility dependency itself, compounded by CSS specificity. The old `.main-skill-card.is-visible` and `.training-card.is-visible` rules specified a 700ms opacity transition and outranked the generic 460ms mobile rule. A class-state audit could incorrectly report these as already visible.
3. **Classification:** a confirmed reveal-state/CSS-transition problem, with observer-delivery latency making it worse. Image decode, layout, paint, and GPU compositing were audited, but none was established as the root cause of the old hidden-content failure. The original mutation observer also enrolled replacement carousel content unnecessarily.
4. **Final architecture:** `useEntranceMotion.js` owns enrollment, profiles, observer delivery, native `Element.animate()` effects, lifecycle cleanup, and interaction cancellation. No pending CSS opacity is applied. Only the initial responsive composition is enrolled, after Vue's first mount update.
5. **Old code removed:** `useReveal.js`, its subtree MutationObserver, global `reveal-enabled` state, `data-reveal`, `reveal-pending`, `is-visible`, old reveal-specific hover overrides, mobile/reduced-motion reveal CSS, and inline `--reveal-delay` values. Searches found no remaining legacy reveal references in active source/styles.
6. **Observers:** one shared entrance IntersectionObserver. The existing, separate active-navigation IntersectionObserver remains unchanged. No entrance MutationObserver or per-element observer.
7. **Targets:** compact headings, paragraphs/groups, image surfaces, card interiors, individual supporting statistics, and static form fields. The desktop composition contains 63 targets including seven Hero targets. There are no nested entrance targets. Replacement project/training pages are immediately visible and retain their own existing transitions.
8. **Always-visible wrappers:** all sections, main/page containers, project grid and frame, skills grids, timeline structure/markers, training carousel, contact form/card shell, CTA frames, and footer. Runtime wrapper checks returned opacity 1 and no entrance ownership.
9. **Hero sequence:** availability/role and portrait; title; description; CTA row; technology row. Independent of IntersectionObserver. Desktop finishes within 880ms, tablet within 720ms, and mobile within 520ms. Reload, back/forward navigation, fragment navigation, and restored scroll do not deliberately replay the Hero.
10. **Desktop variants:** fade-up, fade-in, and a 16px logical-direction fade-side for alternating Experience card interiors only.
11. **Mobile variants:** fade-up and fade-in. Experience's side variant becomes a small vertical entrance.
12. **Desktop profile:** 640ms, 20px content distance, 16px heading distance; 16px horizontal distance only for the justified timeline variant. Tablet uses 560ms, 14px content and 12px heading distances.
13. **Mobile profile:** 420ms, 8px content distance, 7px heading distance. All profiles intentionally fade from 0.35 to 1 rather than 0 to 1. This safety floor prevents an actively delayed animation from becoming a completely blank surface during a fast scroll. Unanimated content remains fully opaque.
14. **Easing:** `cubic-bezier(.22, 1, .36, 1)` across all entrance profiles.
15. **Stagger:** mobile 25ms steps, capped at 100ms; tablet 40ms, capped at 160ms; desktop 60ms, capped at 240ms. Steps clamp to 0–4. Native animation delays are finite; there is no JavaScript timer queue or indefinitely increasing index delay.
16. **Observer trigger:** threshold 0. Pixel root margins use the initial viewport height: 18% on mobile, 12% on tablet/desktop, on both vertical edges. At 390×844 this is `152px 0px 152px 0px`; at 1440×900 it is `108px 0px 108px 0px`.
17. **Initially visible content:** anything inside, above, or near the viewport is not enrolled for a scroll entrance. Its normal visible styling remains in place. The separate first-navigation Hero sequence is the intentional exception.
18. **Viewport safety:** before starting an entrance, the observer callback checks current geometry and delivery age. Already-visible/above-viewport targets, zero-sized targets, and callbacks older than 100ms are skipped and unobserved. They remain opaque. Pointer interaction, keyboard focus, resizing, reduced-motion changes, page backgrounding, and persisted-page restoration release active effects. Effects have no forwards fill and cannot leave a completed target hidden.
19. **Reveal scroll listener:** none. The site's pre-existing scroll-to-top listener is untouched.
20. **Reveal rAF loop:** none. Existing navigation/menu rAF usage is untouched. Frame sampling existed only in the external test harness, not shipped code.
21. **Timer fallback:** none. The artificial 800ms callback delay existed only in the external fault-injection test.
22. **Paint/compositing findings:** existing gradient, blur, shadow, and translucent card layers were inspected. Entrances now generally animate card contents instead of their large filtered shells. Three small About statistics still own their existing translucent surfaces. No filter, backdrop blur, shadow, layout dimension, or permanent `will-change` is animated/added by this system. GPU promotion/demotion and image-decode traces could not be inspected directly, so no unsupported GPU-causality claim is made.
23. **Mobile optimizations:** smaller movement, shorter duration, tighter stagger, earlier approach trigger, stale-delivery skipping, no whole-section fading, no nested opacity owners, bounded initial enrollment, immediate unobserve, and lifecycle cleanup. Hero image retains explicit 900×900 dimensions/eager priority/async decoding. Project images retain 1265×712 dimensions, reserved card image height, lazy loading, and async decoding. Loaded Fresh Cart image dimensions were verified at runtime. Font loading was checked; no font assets or typography were changed.
24. **Slow scroll:** at native 390×844, an 80-step Arabic/light run caught 32 samples with an active fade, no invisible targets, p95 frame interval 16.9ms, maximum 17.1ms, no long tasks, and no recorded layout shifts. At 1440×900, 45 of 80 samples caught an active fade, with no invisible targets; p95 16.9ms, maximum 66.5ms, and no recorded long tasks. These are measurements, not a pending-class count.
25. **Fast scroll:** all seven viewport sizes passed sampled visibility checks during 800px down/up increments. Five full mobile round trips at 390×844 recorded no invisible targets; entrance count stayed at 15 after the first pass, proving no repeated entrances. Fast jumps intentionally skip some motion.
26. **Reverse scroll / pauses:** no disappearing entrance content was observed on reverse passes. Pauses throughout slow scrolling and at restored positions retained visible content. Native child-document reload and browser back both restored 4,200px with zero new entrances and visible targets at opacity 1. Resizing 390×844 to 430×932 retained visibility and did not replay entrances.
27. **360×800:** visually checked; no horizontal document overflow or nested entrance targets; fast down/up visibility passed. See timing table below.
28. **390×844:** full slow, fast, five-repeat, fault, language/theme, and restoration checks described above passed visibility/replay checks.
29. **430×932:** visually checked; fast down/up visibility passed; native resize from 390px did not replay entrances or hide content.
30. **768×1024:** visually checked; tablet layout and fast down/up visibility passed.
31. **1024×900:** visually checked; desktop profile active; fast down/up visibility passed. This run had the highest p95 frame interval, 33.4ms, so it is not reported as a flawless 60fps result.
32. **1440×900:** full slow/fast and visual checks completed, including English/light and Arabic/dark. Desktop fades were directly sampled while active.
33. **1920×1080:** native layout/fast down/up checks completed. Full-width visual inspection used a fitted outer preview scale because the embedded browser clipped the unscaled screenshot; the application retained its native 1920px layout width.
34. **Files changed:** listed below. No portfolio copy, assets, themes, initialization, contact actions/API, menu logic, carousel handlers, project pagination/filter/swipe handlers, or Experience gap rules were edited.
35. **`npm run build`:** passed, Vite 7.3.6, 49 modules. No runtime dependency was added.
36. **`git diff --check`:** passed. Git's LF-to-CRLF notices are repository line-ending advisories, not whitespace errors.

## Fast down/up timing samples

Each row is a fresh document, 28 sampled scroll increments. These are rAF interval measurements in embedded desktop Chromium, not physical-device benchmarks. No long tasks were recorded in these runs. Occasional frame-time outliers remain.

| Native viewport | Invisible targets observed | p95 interval | Maximum interval |
| --- | ---: | ---: | ---: |
| 360×800 | 0 | 16.9ms | 33.3ms |
| 390×844 | 0 | 17.0ms | 33.3ms |
| 430×932 | 0 | 17.0ms | 49.9ms |
| 768×1024 | 0 | 16.9ms | 33.6ms |
| 1024×900 | 0 | 33.4ms | 66.6ms |
| 1440×900 | 0 | 16.9ms | 50.0ms |
| 1920×1080 | 0 | 16.9ms | 50.0ms |

## Additional regression and fault checks

- Arabic/English and light/dark were visually reviewed. Switching language and mode at the bottom kept scroll at 9,108.8px and entrance count at 57; existing persistence was not edited.
- All six palette controls were exercised after restoration. None restarted entrances.
- Mission Car Users → Fresh Cart → Mission Car Users pagination worked; replacing cards did not add entrance animations.
- The existing mobile Experience gap rule remains 1.25rem, unchanged; this pass did not alter responsive font sizing or gap rules.
- An 800ms delayed observer and a missing observer produced fully opaque section content. Hero remained independent.
- The reduced-motion JavaScript branch was simulated before app startup: zero Hero/section entrances, all content opaque. Native OS-level reduced-motion emulation was not available; this was not an OS-settings test.
- A fresh, uninstrumented production-preview tab had no console warnings/errors. Application error/rejection listeners in the later instrumented runs also recorded none. Two earlier host-tab MutationObserver errors were not reproduced in that clean preview; there is no MutationObserver in the new application source.
- Existing navbar active-link `font-weight: 600` changes produced small, identified layout shifts at desktop widths. These were left unchanged. An earlier mobile run that included screenshot capture also recorded two unattributed shifts totaling approximately 0.0884; the later source-instrumented run without capture recorded none. Their cause was not established, so they are not silently counted as fixed.

## Test harness caveat

The in-app browser's requested top-level viewport did not match native application dimensions (native height was 4096px). Those early top-level measurements were discarded. Final tests used explicit-size child documents and checked dimensions in application-side telemetry. A test-only observer adapter used the child document as its root, allowing an early root margin without outer-frame clipping. The adapter, artificial failures, performance observers, sampling loop, and diagnostic controls live outside the repository and are not production code.

This workaround provides useful behavior and layout evidence, but not an exact reproduction of mobile browser chrome, a phone GPU, or a standalone browser's compositing pipeline. Physical-device validation remains advisable before claiming the user's absolute no-hitch quality bar has been met.

## Changed files

- Added `src/composables/useEntranceMotion.js`.
- Deleted `src/composables/useReveal.js`.
- Updated `src/App.vue` and `src/assets/portfolio-overrides.css`.
- Updated entrance presentation in `src/components/HeroSection.vue`, `AboutSection.vue`, `SkillsSection.vue`, `ProjectsSection.vue`, `ExperienceSection.vue`, `TestimonialsSection.vue`, `StatisticsSection.vue`, `ContactSection.vue`, and `FooterSection.vue`.
- Added this report: `docs/motion-system-verification.md`.

No production deployment, contact submission, WhatsApp navigation, or production application data change was performed.
