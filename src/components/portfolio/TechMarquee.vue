<script setup>
import { ref } from 'vue';
defineProps({ t: { type: Function, required: true } });
const paused = ref(false);
const technologies = ['Vue.js', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'REST APIs', 'Git', 'HTML5', 'CSS3', 'Vite'];
</script>

<template>
  <div class="tech-rail" :class="{ 'is-paused': paused }" :aria-label="t('v2.rail')">
    <span class="rail-label">{{ t('v2.rail') }}</span>
    <div class="rail-mask"><div class="rail-track"><ul v-for="copy in 2" :key="copy" :aria-hidden="copy === 2 ? 'true' : undefined"><li v-for="technology in technologies" :key="technology"><span aria-hidden="true">✦</span><bdi>{{ technology }}</bdi></li></ul></div></div>
    <button type="button" class="v2-icon-button rail-pause" :aria-label="t(paused ? 'v2.play' : 'v2.pause')" :aria-pressed="paused" @click="paused = !paused"><i :class="paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'" aria-hidden="true"></i></button>
  </div>
</template>

<style scoped>
.tech-rail { display: flex; align-items: center; gap: 1rem; padding: 1rem max(1rem, calc((100vw - 1280px) / 2)); background: var(--v2-surface); border-block: 1px solid var(--v2-border); overflow: hidden; }
.rail-label { font-size: .8rem; font-weight: 700; color: var(--v2-muted); flex-shrink: 0; }
.rail-mask { flex: 1; min-width: 0; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent); direction: ltr; }
.rail-track { display: flex; width: max-content; animation: rail 65s linear infinite; }
.rail-track ul { list-style: none; display: flex; align-items: center; flex-shrink: 0; gap: 2.5rem; padding: 0 2.5rem 0 0; }
.rail-track li { white-space: nowrap; display: flex; align-items: center; gap: 2.5rem; font: .9rem monospace; color: var(--v2-muted); }
.rail-track li span { color: var(--color-primary); font-size: .65rem; }
.tech-rail:hover .rail-track, .tech-rail:focus-within .rail-track, .is-paused .rail-track { animation-play-state: paused; }
:global(html[dir='rtl'] .rail-track) { animation-direction: reverse; }
@keyframes rail { to { transform: translateX(-50%); } }
@media (max-width: 640px) { .rail-label { display: none; } }
@media (prefers-reduced-motion: reduce) { .rail-track { animation: none; } .rail-pause { display: none; } .rail-mask { overflow-x: auto; } .rail-track ul[aria-hidden] { display: none; } }
</style>
