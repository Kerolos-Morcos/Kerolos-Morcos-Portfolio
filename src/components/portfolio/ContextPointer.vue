<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
const follower = ref(null);
const host = ref('body');
let allowed, frame, x = 0, y = 0, label = '', shown = false;
function hide() { shown = false; label = ''; cancelAnimationFrame(frame); frame = null; if (follower.value) follower.value.style.opacity = '0'; }
function move(event) {
  if (!allowed.matches || event.pointerType === 'touch') return hide();
  const target = event.target instanceof Element ? event.target.closest('[data-cursor-label]') : null;
  if (!target || target.matches(':disabled')) return hide();
  const nextLabel = target.dataset.cursorLabel;
  if (!nextLabel) return hide();
  // Native dialogs paint above body content; keep their companion in the same top layer.
  host.value = target.closest('dialog[open]') || 'body';
  if (label !== nextLabel) { label = nextLabel; follower.value.textContent = label; }
  x = Math.min(event.clientX + 18, innerWidth - 85); y = Math.min(event.clientY + 20, innerHeight - 35);
  if (!shown) { follower.value.style.transitionProperty = 'opacity'; shown = true; }
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = null; follower.value.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    follower.value.style.opacity = '1'; follower.value.style.transitionProperty = 'opacity, transform';
  });
}
onMounted(() => {
  allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  document.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', hide);
  document.addEventListener('pointercancel', hide); document.addEventListener('visibilitychange', hide);
  window.addEventListener('blur', hide); window.addEventListener('scroll', hide, { passive: true }); allowed.addEventListener('change', hide);
});
onUnmounted(() => {
  hide(); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide);
  document.removeEventListener('pointercancel', hide); document.removeEventListener('visibilitychange', hide);
  window.removeEventListener('blur', hide); window.removeEventListener('scroll', hide); allowed?.removeEventListener('change', hide);
});
</script>
<template><Teleport :to="host"><span ref="follower" class="context-pointer" aria-hidden="true"></span></Teleport></template>
<style scoped>
.context-pointer { position: fixed; top: 0; left: 0; z-index: 90; pointer-events: none; opacity: 0; padding: 5px 8px; border-radius: 5px; color: var(--v2-text); border: 1px solid var(--v2-border); background: var(--v2-surface); font: 10px/1.5 monospace; transition: opacity .12s ease, transform .09s linear; box-shadow: 0 3px 12px rgb(0 0 0 / .08); }
@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) { .context-pointer { display: none; } }
</style>
