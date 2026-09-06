<script setup>
import { onMounted, ref } from 'vue';
import { useSystemMode } from '../../composables/useSystemMode';
defineProps({ t: { type: Function, required: true }, controlsHidden: Boolean });
const { enabled, toggle } = useSystemMode();
const ready = ref(false);
const sections = [
  ['hero-section', '01 / IDENTITY', 'CLIENT · INTERACTION'], ['about', '02 / PROFILE', 'CONTEXT'],
  ['skills-section', '03 / TOOLKIT', 'CAPABILITIES'], ['engineering', '04 / ARCHITECTURE', 'REQUEST → RESPONSE'],
  ['portfolio', '05 / EVIDENCE', 'PROJECTS · CASE STUDIES'], ['experience', '06 / EXPERIENCE', 'TIMELINE'],
  ['testimonials', '07 / PRINCIPLES', 'PROCESS'], ['contact', '08 / CONTACT', 'INPUT → VALIDATION → DELIVERY'],
];
onMounted(() => { ready.value = true; });
</script>
<template>
  <button v-show="!controlsHidden" type="button" class="system-toggle" :class="{ 'is-on': enabled }" :aria-pressed="enabled" :aria-label="t('v3.system.title')" @click="toggle"><span aria-hidden="true">&lt;/&gt;</span>{{ t('v3.system.label') }}<i aria-hidden="true"></i></button>
  <template v-if="ready">
    <Teleport v-for="[id, label, note] in sections" :key="id" :to="`#${id}`">
      <div class="system-overlay" :class="{ 'is-on': enabled }" aria-hidden="true"><span dir="ltr">{{ label }}</span><span class="system-note" dir="ltr">{{ note }}</span><i></i></div>
    </Teleport>
  </template>
</template>
<style scoped>
.system-toggle { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 45; display: flex; align-items: center; gap: .65rem; min-height: 44px; padding: .65rem 1rem; border: 1px solid var(--v2-border); border-radius: 100px; color: var(--v2-text); background: var(--v2-surface); box-shadow: 0 6px 24px rgb(0 0 0 / .12); font-size: .85rem; font-weight: 700; cursor: pointer; transition: border-color .3s, box-shadow .3s; }
.system-toggle > span { font-family: monospace; color: var(--v2-accent-text); }
.system-toggle i { width: 6px; height: 6px; border-radius: 50%; background: var(--v2-muted); }
.system-toggle.is-on { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgb(var(--accent-primary-rgb) / .12); }
.system-toggle.is-on i { background: var(--color-primary); }
.system-overlay { position: absolute; inset: 8px; z-index: 15; pointer-events: none; opacity: 0; border: 1px solid color-mix(in srgb, var(--color-primary) 32%, transparent); transition: opacity .5s ease; background-image: linear-gradient(to right, rgb(var(--accent-primary-rgb) / .025) 1px, transparent 1px), linear-gradient(rgb(var(--accent-primary-rgb) / .025) 1px, transparent 1px); background-size: 64px 64px; }
.system-overlay.is-on { opacity: 1; }
.system-overlay span { position: absolute; top: 5px; inset-inline-start: 8px; font: 10px/1.5 monospace; letter-spacing: .06em; color: var(--v2-accent-text); padding: 2px 6px; background: var(--v2-surface); }
.system-overlay .system-note { top: auto; bottom: 5px; inset-inline-start: auto; inset-inline-end: 8px; }
.system-overlay i { position: absolute; width: 7px; height: 7px; background: var(--color-primary); top: -4px; inset-inline-end: -4px; }
@media (max-width: 767px) { .system-toggle { right: .75rem; bottom: .75rem; padding-inline: .8rem; } .system-overlay { background-size: 48px 48px; } }
@media (prefers-reduced-motion: reduce) { .system-overlay, .system-toggle { transition: none; } }
</style>
