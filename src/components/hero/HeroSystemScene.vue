<script setup>
import { ref } from 'vue';
import profileImage from '../../assets/profile/kerolos-morcos.webp';
defineProps({ t: { type: Function, required: true } });
const selected = ref(0);
const nodes = [{ name: 'Vue.js', type: 'CLIENT', icon: 'fa-brands fa-vuejs' }, { name: 'REST API', type: 'CONTRACT', icon: 'fa-solid fa-arrow-right-arrow-left' }, { name: 'Node.js', type: 'SERVER', icon: 'fa-brands fa-node-js' }, { name: 'MySQL', type: 'DATA', icon: 'fa-solid fa-database' }];
</script>
<template>
  <div class="system-scene" :aria-label="t('v3.hero.scene')" role="group">
    <div class="scene-plane">
      <div class="scene-grid" aria-hidden="true"></div>
      <span class="scene-coordinate" aria-hidden="true" dir="ltr">K/M — FULL-STACK<br />CLIENT / SERVER / DATA</span>
      <svg class="scene-circuit" viewBox="0 0 600 540" fill="none" aria-hidden="true">
        <path class="circuit-base" d="M100 120H215L260 75H440V190L500 240V370H365L320 465H120V355L68 303V175Z" />
        <path class="circuit-signal" d="M100 120H215L260 75H440V190L500 240V370H365L320 465H120V355L68 303V175Z" />
        <path class="circuit-inner" d="M120 160H245L275 125H405V205L460 250V335H340L300 425H160V340L110 290V200Z" />
        <circle cx="300" cy="270" r="182" class="scene-ring" /><circle cx="300" cy="270" r="170" class="scene-ring scene-ring--inner" />
      </svg>
      <div class="scene-portrait"><img :src="profileImage" :alt="t('hero.heroImageAlt')" width="900" height="900" loading="eager" fetchpriority="high" decoding="async" /><span aria-hidden="true">K/M</span></div>
      <button v-for="(node, index) in nodes" :key="node.name" type="button" class="scene-node" :class="[`scene-node--${index}`, { 'is-selected': selected === index }]" :aria-pressed="selected === index" aria-controls="hero-layer-detail" @click="selected = index"><i :class="node.icon" aria-hidden="true"></i><span><small>{{ node.type }}</small><bdi>{{ node.name }}</bdi></span><b aria-hidden="true">0{{ index + 1 }}</b></button>
      <div class="scene-caption" dir="ltr" aria-hidden="true"><span>01</span> Vue → API → Node / Express → MySQL <span>04</span></div>
    </div>
    <div id="hero-layer-detail" class="scene-detail" aria-live="polite"><span>{{ t('v3.hero.build') }}</span><p>{{ t('v3.hero.layers')[selected] }}</p></div>
  </div>
</template>
<style scoped>
.system-scene { position: relative; }
.scene-plane { position: relative; width: 100%; aspect-ratio: 600/540; transform-style: preserve-3d; transform: rotateX(calc(var(--depth-y) * -3deg)) rotateY(calc(var(--depth-x) * 4deg)); transition: transform .65s cubic-bezier(.22,1,.36,1); }
.scene-grid { position: absolute; inset: 8% 0 4%; border: 1px solid rgb(var(--accent-primary-rgb) / .15); border-radius: 38% 12% 32% 10%; background: radial-gradient(ellipse, rgb(var(--accent-primary-rgb) / .09), transparent 66%); transform: rotate(-8deg); }
.scene-coordinate { position: absolute; top: 1%; inset-inline-end: 8%; font: 9px/1.8 monospace; letter-spacing: .08em; color: var(--v2-muted); opacity: .7; }
.scene-circuit { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.circuit-base { stroke: var(--color-primary); stroke-width: 1; opacity: .35; }
.circuit-inner { stroke: var(--color-secondary); stroke-width: .7; opacity: .25; }
.circuit-signal { stroke: var(--color-primary); stroke-width: 2; stroke-dasharray: 28 1480; animation: circuit-travel 9s linear infinite; }
.scene-ring { stroke: var(--color-primary); stroke-width: .8; opacity: .22; stroke-dasharray: 3 7; transform-origin: 300px 270px; animation: circuit-orbit 90s linear infinite; }
.scene-ring--inner { stroke-dasharray: none; opacity: .14; animation: none; }
.scene-portrait { position: absolute; inset: 22% 23% 22%; overflow: hidden; border-radius: 46% 46% 12% 12%; border: 2px solid var(--color-primary); box-shadow: 0 25px 65px rgb(var(--accent-primary-rgb) / .17), 0 0 0 8px rgb(var(--accent-primary-rgb) / .045); transform: translateZ(18px); }
.scene-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.scene-portrait > span { position: absolute; inset-inline-end: .5rem; bottom: .4rem; font: 700 22px monospace; color: white; text-shadow: 0 1px 8px #020617; }
.scene-node { position: absolute; display: flex; align-items: center; gap: .65rem; padding: .8rem; min-width: 145px; min-height: 60px; border: 1px solid var(--v2-border); border-radius: 12px; background: var(--v2-surface); color: var(--v2-text); box-shadow: 0 8px 22px rgb(0 0 0 / .07); transform: translateZ(35px); text-align: start; transition: border-color .3s, box-shadow .3s; }
.scene-node > i { font-size: 1.4rem; color: var(--v2-accent-text); }
.scene-node span { display: grid; gap: 3px; }.scene-node small { font: 8px monospace; color: var(--v2-muted); letter-spacing: .08em; }.scene-node bdi { font-size: .85rem; font-weight: 800; }.scene-node > b { font: 9px monospace; color: var(--v2-muted); align-self: flex-start; margin-inline-start: auto; }
.scene-node.is-selected, .scene-node:hover { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgb(var(--accent-primary-rgb) / .08), 0 8px 22px rgb(0 0 0 / .07); }
.scene-node--0 { top: 13%; left: 2%; }.scene-node--1 { top: 28%; right: -1%; }.scene-node--2 { bottom: 23%; left: -1%; }.scene-node--3 { bottom: 9%; right: 5%; }
.scene-caption { position: absolute; bottom: 0; inset-inline: 5%; display: flex; justify-content: space-between; align-items: center; font: 9px monospace; color: var(--v2-muted); }.scene-caption > span { color: var(--v2-accent-text); }
.scene-detail { padding: 1.1rem 48px 0; text-align: center; color: var(--v2-muted); font-size: .85rem; min-height: 65px; }.scene-detail > span { font-size: .75rem; }.scene-detail p { color: var(--v2-accent-text); font-weight: 700; margin-top: .3rem; }
@keyframes circuit-travel { to { stroke-dashoffset: -1508; } } @keyframes circuit-orbit { to { transform: rotate(360deg); } }
:global(.motion-paused .circuit-signal), :global(.motion-paused .scene-ring) { animation-play-state: paused; }
@media (max-width: 1023px) { .scene-node { min-width: 115px; padding: .6rem; gap: .4rem; }.scene-node bdi { font-size: 12px; }.scene-node > b { display: none; }.scene-coordinate { font-size: 8px; } }
@media (max-width: 767px) {
  .system-scene { width: min(100%, 390px); margin-inline: auto; }.scene-plane { height: 255px; aspect-ratio: auto; transform: none; }
  .scene-portrait { inset: 15% 26% 13%; }.scene-node { min-height: 44px; min-width: 98px; padding: .5rem; border-radius: 9px; }.scene-node > i { font-size: 17px; }.scene-node small { font-size: 7px; }.scene-node bdi { font-size: 11px; }
  .scene-node--0 { top: 7%; left: 0; }.scene-node--1 { top: 22%; right: 0; }.scene-node--2 { bottom: 24%; left: 0; }.scene-node--3 { bottom: 8%; right: 0; }
  .scene-caption { font-size: 7px; inset-inline: 0; }.scene-coordinate { display: none; }.scene-detail { padding-top: .5rem; min-height: 36px; font-size: 11px; }.scene-detail > span { display: none; }.scene-detail p { margin-top: 0; }
}
@media (max-width: 359px) { .scene-plane { height: 220px; }.scene-node { min-width: 88px; gap: .3rem; } }
@media (prefers-reduced-motion: reduce) { .scene-plane { transform: none; transition: none; }.scene-ring, .circuit-signal { animation: none; }.scene-node { transition: none; } }
</style>
