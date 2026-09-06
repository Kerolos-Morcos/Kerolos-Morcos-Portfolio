<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import HeroSystemScene from './HeroSystemScene.vue';
import { claimHeroEntrance, clampDepth } from '../../lib/v3';
import { EASING } from '../../motion';
defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
defineEmits(['open-terminal']);
const root = ref(null);
const scene = ref(null);
const intro = ref(false);
const paused = ref(false);
const visible = ref(true);
const motionAllowed = ref(true);
let reduced, fine, observer, frame, bounds, target, effects = [], inViewport = true;
function settle() { effects.forEach(effect => effect.cancel()); effects = []; }
function resetDepth() {
  cancelAnimationFrame(frame); frame = null; bounds = null;
  scene.value?.style.setProperty('--depth-x', '0'); scene.value?.style.setProperty('--depth-y', '0');
}
function move(event) {
  if (!fine?.matches || reduced?.matches || paused.value || event.pointerType === 'touch') return;
  bounds ||= scene.value.getBoundingClientRect();
  target = { x: clampDepth((event.clientX - bounds.left) / bounds.width * 2 - 1), y: clampDepth((event.clientY - bounds.top) / bounds.height * 2 - 1) };
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = null;
    scene.value.style.setProperty('--depth-x', String(target.x));
    scene.value.style.setProperty('--depth-y', String(target.y));
  });
}
function preferences() { motionAllowed.value = !reduced.matches; resetDepth(); if (reduced.matches) settle(); }
function visibility() { visible.value = inViewport && !document.hidden; if (document.hidden) { settle(); resetDepth(); } }
function pause() { paused.value = !paused.value; if (paused.value) { resetDepth(); settle(); } }
onMounted(() => {
  reduced = matchMedia('(prefers-reduced-motion: reduce)'); fine = matchMedia('(hover: hover) and (pointer: fine)');
  preferences();
  let first = false;
  try { first = claimHeroEntrance(sessionStorage); } catch { first = true; }
  intro.value = first && !reduced.matches && !document.hidden && scrollY < 40 && !location.hash && !location.search;
  if (intro.value && root.value.animate) {
    root.value.querySelectorAll('[data-hero-enter]').forEach((element, index) => {
      effects.push(element.animate([{ opacity: .25, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 680, delay: Math.min(index * 75, 375), easing: EASING }));
    });
  }
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => { inViewport = entry.isIntersecting; visible.value = inViewport && !document.hidden; if (!inViewport) resetDepth(); });
    observer.observe(root.value);
  }
  reduced.addEventListener('change', preferences); fine.addEventListener('change', resetDepth);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('resize', resetDepth, { passive: true });
  window.addEventListener('scroll', resetDepth, { passive: true });
});
onUnmounted(() => {
  settle(); resetDepth(); observer?.disconnect();
  reduced?.removeEventListener('change', preferences); fine?.removeEventListener('change', resetDepth);
  document.removeEventListener('visibilitychange', visibility); window.removeEventListener('resize', resetDepth); window.removeEventListener('scroll', resetDepth);
});
</script>
<template>
  <section id="hero-section" ref="root" class="signature-hero" :class="{ 'motion-paused': paused || !visible || !motionAllowed }" :data-intro="intro" aria-labelledby="hero-title">
    <div class="hero-field" aria-hidden="true"></div>
    <div class="signature-inner">
      <div class="signature-topline"><span class="signature-label" dir="ltr">K/M <span>—</span> {{ t('v3.hero.signature') }}</span><span class="signature-availability"><i aria-hidden="true"></i>{{ t('hero.available') }}</span></div>
      <div class="signature-composition">
        <div class="signature-copy">
          <h1 id="hero-title" :aria-label="t('hero.name')"><span data-hero-enter>{{ t('v3.hero.first') }}</span><span class="signature-name-edge" data-hero-enter>{{ t('v3.hero.last') }}<i aria-hidden="true">.</i></span></h1>
          <div class="signature-role" data-hero-enter><strong>{{ t('v3.hero.role') }}</strong><span dir="ltr">{{ t('v3.hero.stack') }}</span></div>
          <p class="signature-statement" data-hero-enter>{{ t('v3.hero.statement') }}<br /><span>{{ t('v3.hero.statementEnd') }}</span></p>
          <div class="signature-proof"><span><b dir="ltr">1+</b> {{ t('v3.hero.year') }}</span><span><b dir="ltr">20+</b> {{ t('v3.hero.projects') }}</span></div>
          <div class="signature-actions" data-hero-enter>
            <a v-magnetic href="#contact" class="v2-button v2-button--primary"><span>{{ t('hero.contactCta') }}</span><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
            <a v-magnetic v-track="'cv_download'" href="/Kerolos-Morcos-Full-Stack-Developer-CV.pdf" download class="v2-button"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>{{ t('footer.cv') }}</a>
          </div>
        </div>
        <div ref="scene" class="signature-scene" data-hero-enter @pointermove="move" @pointerleave="resetDepth" @pointercancel="resetDepth"><HeroSystemScene :t="t" /><button type="button" class="signature-pause" :aria-label="t(paused ? 'v3.hero.resume' : 'v3.hero.pause')" :aria-pressed="paused" @click="pause"><i :class="paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'" aria-hidden="true"></i></button></div>
      </div>
      <div class="signature-footer">
        <a href="#portfolio">{{ t('v3.hero.visit') }} <span aria-hidden="true">↓</span></a>
        <a href="#engineering">{{ t('v2.engineeringLink') }} <span aria-hidden="true">↗</span></a>
        <button type="button" :data-cursor-label="t('v3.pointer.open')" @click="$emit('open-terminal')"><span aria-hidden="true">&gt;_</span> {{ t('v2.terminal.open') }}</button>
      </div>
    </div>
    <div v-if="intro" class="signature-boot" aria-hidden="true"><span>{{ t('v3.hero.ready') }}</span><i></i></div>
  </section>
</template>
<style scoped>
.signature-hero { position: relative; overflow: hidden; isolation: isolate; background: var(--v2-inset); color: var(--v2-text); padding: 116px 2.5rem 1.5rem; min-height: 100svh; display: flex; align-items: center; }
.hero-field { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(ellipse at 80% 45%, rgb(var(--accent-primary-rgb) / .12), transparent 55%), linear-gradient(90deg, transparent 49.9%, rgb(var(--accent-primary-rgb) / .04) 50%, transparent 50.1%); }
.hero-field::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(var(--v2-muted) .7px, transparent .7px); background-size: 26px 26px; opacity: .13; mask-image: linear-gradient(transparent, black 35%, transparent); }
.signature-inner { width: 100%; max-width: 1440px; margin: auto; }
.signature-topline { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.signature-label { font: 11px/1.5 monospace; letter-spacing: .16em; color: var(--v2-muted); }
.signature-label > span { color: var(--color-primary); margin-inline: .5rem; }
.signature-availability { display: inline-flex; gap: .6rem; align-items: center; font-size: .85rem; color: var(--v2-accent-text); }
.signature-availability i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 5px rgb(var(--accent-primary-rgb) / .09); }
.signature-composition { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 1.5rem; }
.signature-copy { min-width: 0; position: relative; z-index: 2; }
h1 { font-size: clamp(70px, 7.7vw, 128px); font-weight: 900; line-height: .96; letter-spacing: -.065em; text-transform: uppercase; margin: 0 0 1.5rem; }
h1 > span { display: block; }
.signature-name-edge { color: var(--v2-accent-text); }
.signature-name-edge i { color: var(--color-primary); font-style: normal; }
h1:dir(rtl) { letter-spacing: 0; line-height: 1.16; }
.signature-role { display: flex; align-items: center; flex-wrap: wrap; gap: .45rem 1rem; font-size: 1.15rem; }
.signature-role strong { font-weight: 800; }
.signature-role > span { color: var(--v2-accent-text); font: .95rem monospace; }
.signature-statement { font-size: 1.3rem; color: var(--v2-muted); line-height: 1.55; margin-block: 1.25rem; }
.signature-statement span { color: var(--v2-text); }
.signature-proof { display: flex; align-items: center; gap: 1.75rem; margin-block: 1.5rem; font-size: .85rem; color: var(--v2-muted); }
.signature-proof b { font-size: 1.45rem; color: var(--v2-text); margin-inline-end: .25rem; }
.signature-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.signature-actions > a { min-height: 52px; padding-inline: 1.4rem; }
.signature-scene { position: relative; min-width: 0; perspective: 1000px; --depth-x: 0; --depth-y: 0; }
.signature-footer { border-top: 1px solid var(--v2-border); margin-top: 2.5rem; padding-top: .75rem; display: flex; align-items: center; gap: 1.5rem; color: var(--v2-muted); font-size: .85rem; }
.signature-footer a, .signature-footer button { min-height: 44px; display: inline-flex; align-items: center; gap: .75rem; }
.signature-footer a:hover, .signature-footer button:hover { color: var(--v2-accent-text); }
.signature-pause { position: absolute; bottom: 0; left: 0; width: 44px; height: 44px; display: grid; place-items: center; color: var(--v2-muted); background: var(--v2-inset); border: 1px solid var(--v2-border); border-radius: 50%; font-size: 12px; }
.signature-boot { position: absolute; inset-inline: 0; top: 86px; height: 20px; pointer-events: none; font: 9px monospace; color: var(--v2-accent-text); animation: boot-away 1.15s ease both; }
.signature-boot span { margin-inline-start: 3rem; }
.signature-boot i { position: absolute; inset-inline-start: 0; bottom: 0; width: 100%; height: 1px; background: var(--color-primary); transform-origin: left; animation: boot-line .8s ease both; }
@keyframes boot-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes boot-away { 0%, 70% { opacity: 1; } 100% { opacity: 0; } }
@media (min-width: 1600px) { .signature-composition { gap: 4rem; } }
@media (max-width: 1023px) { .signature-hero { padding-inline: 1.5rem; } h1 { font-size: clamp(60px, 8.3vw, 90px); } .signature-role { font-size: 1rem; } .signature-statement { font-size: 1.1rem; } }
@media (max-width: 767px) {
  .signature-hero { padding: 84px 16px 16px; min-height: auto; }
  .signature-topline { margin-bottom: 1.2rem; gap: .7rem; }
  .signature-label { font-size: 8px; letter-spacing: .06em; }
  .signature-label > span { margin-inline: .1rem; }
  .signature-availability { font-size: 10px; gap: .4rem; }
  .signature-composition { grid-template-columns: 1fr; gap: 1rem; }
  h1 { font-size: clamp(50px, 15.2vw, 72px); line-height: .95; margin-bottom: .8rem; }
  h1 > span { display: inline; } h1 > span + span::before { content: ' '; }
  h1:dir(rtl) { font-size: clamp(46px, 15vw, 68px); line-height: 1.15; }
  .signature-role { gap: .3rem .7rem; font-size: 14px; }
  .signature-role > span { font-size: 12px; }
  .signature-statement { margin-block: .6rem; font-size: 14px; }
  .signature-statement br { display: none; }
  .signature-statement span { margin-inline-start: .3rem; }
  .signature-proof { margin-block: .65rem; gap: 1.25rem; font-size: 11px; }
  .signature-proof b { font-size: 18px; }
  .signature-actions > a { min-height: 44px; font-size: 12px; padding: .65rem 1rem; }
  .signature-footer { margin-top: .75rem; gap: .4rem 1rem; flex-wrap: wrap; font-size: 11px; }
  .signature-footer a, .signature-footer button { gap: .4rem; }
  .signature-boot { top: 68px; }
}
@media (prefers-reduced-motion: reduce) { .signature-boot { display: none; } }
</style>
