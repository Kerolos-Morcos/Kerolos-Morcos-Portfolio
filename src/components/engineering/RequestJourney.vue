<script setup>
import { computed, watch } from 'vue';
import { useRequestJourney } from '../../composables/useRequestJourney';
defineProps({ t: { type: Function, required: true } });
const emit = defineEmits(['stage']);
const { state, step, running, reduced, run } = useRequestJourney();
const layer = computed(() => state.value === 'idle' ? null : [0, 1, 2, 3, 1, 0][step.value]);
watch(layer, value => emit('stage', value));
</script>
<template>
  <div class="request-journey" :class="{ 'is-running': running, 'is-complete': state === 'complete' }" :data-request-state="state">
    <div class="request-header"><div><p class="request-simulation">{{ t('v3.request.simulation') }}</p><h3>{{ t('v3.request.title') }}</h3><p>{{ t('v3.request.subtitle') }}</p></div><button type="button" class="v2-button v2-button--primary" :disabled="running" :data-cursor-label="t('v3.pointer.run')" @click="run"><i :class="running ? 'fa-solid fa-circle-nodes' : 'fa-solid fa-play'" aria-hidden="true"></i>{{ t(running ? 'v3.request.running' : state === 'complete' ? 'v3.request.again' : 'v3.request.run') }}</button></div>
    <slot />
    <div class="request-trace">
      <ol :aria-label="t('v3.request.title')"><li v-for="(label, index) in t('v3.request.steps')" :key="index" :class="{ 'is-current': step === index, 'is-done': step > index }" :aria-current="step === index ? 'step' : undefined"><span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>{{ label }}</li></ol>
      <div class="request-result"><code dir="ltr">{{ state === 'complete' ? '{ status: 200, data: [...] }' : 'GET /api/projects' }}</code><p>{{ state === 'idle' ? t('v3.request.idle') : t('v3.request.descriptions')[step] }}</p><strong v-if="state === 'complete'">{{ t('v3.request.complete') }}</strong></div>
      <p class="request-note">{{ t('v3.request.evidence') }}</p>
      <p class="sr-only" role="status">{{ state === 'complete' ? t(reduced ? 'v3.request.reduced' : 'v3.request.complete') : running ? t('v3.request.running') : '' }}</p>
    </div>
  </div>
</template>
<style scoped>
.request-header { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 1.75rem 2rem 0; }
.request-simulation { font: 10px/1.6 monospace; color: var(--v2-accent-text); letter-spacing: .08em; }
.request-header h3 { font-size: 1.8rem; font-weight: 900; margin-top: .5rem; }
.request-header p:not(.request-simulation) { font-size: .9rem; color: var(--v2-muted); margin-top: .35rem; }
.request-header button { flex-shrink: 0; }.request-header button:disabled { opacity: .65; cursor: wait; }
.request-trace { padding: 0 2rem 1.5rem; }
.request-trace ol { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); list-style: none; padding: 0; margin: 0; gap: .5rem; }
.request-trace li { font-size: .75rem; color: var(--v2-muted); border-top: 2px solid var(--v2-border); padding-block: .75rem; transition: border-color .25s, color .25s; }
.request-trace li span { display: block; font: 9px monospace; opacity: .6; margin-bottom: .35rem; }
.request-trace li.is-current, .request-trace li.is-done { border-color: var(--color-primary); color: var(--v2-accent-text); }
.request-result { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem 1rem; align-items: center; padding: 1rem 1.2rem; border: 1px solid var(--v2-border); border-radius: .75rem; background: var(--v2-surface); min-height: 105px; }
.request-result code { font-size: .85rem; overflow-wrap: anywhere; color: var(--v2-accent-text); }.request-result p { color: var(--v2-muted); font-size: .9rem; }.request-result strong { grid-column: 1 / -1; font-size: .85rem; color: var(--v2-accent-text); }
.request-note { font-size: .75rem; color: var(--v2-muted); margin-top: .75rem; }
@media (max-width: 767px) { .request-header { flex-direction: column; align-items: stretch; padding: 1.25rem 1.25rem 0; gap: 1rem; }.request-header h3 { font-size: 1.65rem; }.request-header button { align-self: flex-start; }.request-trace { padding: 0 1.25rem 1.25rem; }.request-trace ol { grid-template-columns: repeat(3, minmax(0, 1fr)); }.request-result { grid-template-columns: 1fr; min-height: 120px; }.request-simulation { letter-spacing: 0; } }
@media (prefers-reduced-motion: reduce) { .request-trace li { transition: none; } }
</style>
