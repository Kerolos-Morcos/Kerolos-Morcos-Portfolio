<script setup>
import { computed, ref } from 'vue';
import RequestJourney from './RequestJourney.vue';
const props = defineProps({ t: { type: Function, required: true } });
const selected = ref(0);
const hovered = ref(null);
const journeyLayer = ref(null);
const active = computed(() => journeyLayer.value ?? hovered.value ?? selected.value);
const layers = computed(() => props.t('v2.engineering.layers'));
const layer = computed(() => layers.value[active.value]);
function hoverNode(index, event) {
  if (event.pointerType === 'mouse') hovered.value = index;
}
</script>

<template>
  <section id="engineering" class="engineering-section" aria-labelledby="engineering-title" data-motion-section>
    <div class="engineering-inner">
      <div class="engineering-heading" data-motion="fade-up" data-motion-heading>
        <p class="v2-eyebrow">{{ t('v2.engineering.eyebrow') }}</p>
        <h2 id="engineering-title">{{ t('v2.engineering.title') }}<br /><span>{{ t('v2.engineering.accent') }}</span></h2>
        <p class="engineering-intro">{{ t('v2.engineering.intro') }}</p>
      </div>
      <div class="engineering-console" data-motion="fade-up" data-motion-step="1">
        <div class="engineering-toolbar"><span class="console-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>{{ t('v2.engineering.model') }}</span><code dir="ltr" aria-hidden="true">0{{ active + 1 }} / 04</code></div>
        <RequestJourney :t="t" @stage="journeyLayer = $event">
        <div class="engineering-nodes" @pointerleave="hovered = null">
          <template v-for="(node, index) in layers" :key="node.tech">
            <button class="engineering-node" type="button" :aria-pressed="selected === index" :class="{ 'is-active': active === index, 'is-connected': Math.abs(active - index) === 1 }" aria-controls="engineering-detail" @click="selected = index; journeyLayer = null" @focus="hovered = null" @pointerenter="hoverNode(index, $event)">
              <span class="node-index" aria-hidden="true">0{{ index + 1 }}</span><i :class="node.icon" aria-hidden="true"></i><strong>{{ node.title }}</strong><bdi>{{ node.tech }}</bdi><small>{{ node.brief }}</small>
            </button>
            <span v-if="index < layers.length - 1" class="engineering-connection" :class="{ 'is-connected': index === active || index + 1 === active }" aria-hidden="true"><i></i></span>
          </template>
        </div>
        </RequestJourney>
        <div id="engineering-detail" class="engineering-detail" :aria-live="journeyLayer === null ? 'polite' : 'off'" aria-atomic="true">
          <div><p class="v2-eyebrow">{{ layer.output }}</p><h3>{{ layer.title }}</h3><p>{{ layer.detail }}</p></div><code dir="ltr">{{ layer.code }}</code>
        </div>
        <p class="engineering-hint">{{ t('v2.engineering.hint') }}</p>
      </div>
      <div class="engineering-bottom" data-motion="fade-up" data-motion-step="2">
        <div><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><h3>{{ t('v2.engineering.auth') }}</h3><p>{{ t('v2.engineering.authText') }}</p></div>
        <div><i class="fa-solid fa-code-branch" aria-hidden="true"></i><h3>{{ t('v2.engineering.delivery') }}</h3><p>{{ t('v2.engineering.deliveryText') }}</p></div>
        <a href="#portfolio" class="engineering-evidence">{{ t('v2.engineering.evidence') }}<i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.engineering-section { position: relative; padding: 6rem 2rem; overflow: hidden; background: var(--v2-surface); border-block: 1px solid var(--v2-border); }
.engineering-section::before { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .2; background-image: radial-gradient(var(--v2-border) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(transparent, black, transparent); }
.engineering-inner { position: relative; max-width: 1280px; margin-inline: auto; }
.engineering-heading { max-width: 780px; margin-bottom: 2.5rem; }
h2 { font-size: clamp(2.4rem, 4vw, 3.75rem); line-height: 1.2; font-weight: 900; margin-block: .75rem 1rem; }
h2 span { color: var(--v2-accent-text); }
.engineering-intro { font-size: 1.15rem; line-height: 1.85; color: var(--v2-muted); }
.engineering-console { border: 1px solid var(--v2-border); border-radius: 1.5rem; overflow: hidden; background: var(--v2-inset); }
.engineering-toolbar { padding: 1.1rem 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid var(--v2-border); color: var(--v2-muted); font-size: .85rem; }
.engineering-toolbar code { margin-inline-start: auto; opacity: .6; }
.console-dots { display: flex; gap: 5px; }
.console-dots i { width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%; opacity: .5; }
.engineering-nodes { padding: 2rem; display: grid; grid-template-columns: 1fr 2rem 1fr 2rem 1fr 2rem 1fr; align-items: center; }
.engineering-node { display: flex; flex-direction: column; align-items: flex-start; position: relative; min-width: 0; padding: 1.5rem 1.25rem; border: 1px solid var(--v2-border); border-radius: 1rem; background: var(--v2-surface); text-align: start; transition: border-color var(--motion-medium), box-shadow var(--motion-medium), background-color var(--motion-medium); }
.engineering-node > i { font-size: 1.6rem; color: var(--v2-accent-text); margin-bottom: 1.5rem; }
.engineering-node strong { font-size: 1.05rem; margin-bottom: .5rem; }
.engineering-node bdi { font: .8rem monospace; color: var(--v2-muted); overflow-wrap: anywhere; }
.engineering-node small { color: var(--v2-muted); margin-top: .75rem; }
.node-index { position: absolute; inset-inline-end: 1rem; top: 1.25rem; color: var(--v2-muted); font: .75rem monospace; opacity: .55; }
.engineering-node.is-active { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 7%, var(--v2-surface)); box-shadow: 0 0 0 4px rgb(var(--accent-primary-rgb) / .07); }
.engineering-node.is-connected { border-color: color-mix(in srgb, var(--color-primary) 45%, var(--v2-border)); }
.engineering-connection { height: 1px; background: var(--v2-border); position: relative; overflow: hidden; }
.engineering-connection i { position: absolute; width: 10px; height: 2px; background: var(--color-primary); left: -10px; animation: signal 4s linear infinite; }
.engineering-connection.is-connected { background: var(--color-primary); }
.request-journey.is-running .engineering-connection.is-connected i { animation-duration: .65s; }
.engineering-detail { min-height: 190px; display: grid; grid-template-columns: 1.5fr 1fr; align-items: center; gap: 2rem; border-top: 1px solid var(--v2-border); padding: 2rem; }
.engineering-detail h3 { font-size: 1.35rem; font-weight: 800; margin-block: .4rem; }
.engineering-detail p:not(.v2-eyebrow) { color: var(--v2-muted); line-height: 1.75; max-width: 620px; }
.engineering-detail code { padding: 1.25rem; border: 1px solid var(--v2-border); border-radius: .75rem; color: var(--v2-accent-text); font-size: .85rem; text-align: center; background: var(--v2-surface); overflow-wrap: anywhere; }
.engineering-hint { padding: 0 2rem 1.25rem; font-size: .8rem; color: var(--v2-muted); }
.engineering-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; }
.engineering-bottom > div { border-inline-start: 2px solid var(--v2-border); padding-inline-start: 1.25rem; }
.engineering-bottom h3 { display: inline; font-weight: 700; margin-inline-start: .6rem; }
.engineering-bottom i { color: var(--v2-accent-text); }
.engineering-bottom p { color: var(--v2-muted); line-height: 1.7; margin-top: .65rem; }
.engineering-evidence { grid-column: 1/-1; display: inline-flex; align-items: center; gap: 1rem; font-weight: 700; justify-self: start; min-height: 44px; color: var(--v2-accent-text); }
@keyframes signal { to { transform: translateX(42px); } }
.engineering-connection:dir(rtl) { scale: -1 1; }
@media (max-width: 767px) { .engineering-section { padding: 4rem 1rem; } .engineering-nodes { grid-template-columns: 1fr; padding: 1.25rem; } .engineering-node { padding: 1rem; display: grid; grid-template-columns: 2.5rem 1fr; gap: .25rem .75rem; align-items: center; } .engineering-node > i { grid-row: 1/4; margin: 0; } .engineering-node strong, .engineering-node bdi, .engineering-node small { grid-column: 2; margin: 0; } .node-index { display: none; } .engineering-connection { width: 1px; height: 1rem; margin-inline: 2.25rem; } .engineering-connection i { width: 2px; height: 6px; inset: -6px 0 auto; animation-name: signal-vertical; } .engineering-detail { grid-template-columns: 1fr; min-height: 240px; padding: 1.25rem; gap: 1rem; } .engineering-toolbar { padding: 1rem; } .engineering-toolbar code { display: none; } .engineering-bottom { grid-template-columns: 1fr; } }
@keyframes signal-vertical { to { transform: translateY(22px); } }
@media (prefers-reduced-motion: reduce) { .engineering-connection i { animation: none; } .engineering-node { transition: none; } }
</style>
