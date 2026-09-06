<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { EASING, MOTION } from '../../motion';

defineProps({ title: { type: String, required: true }, closeLabel: { type: String, required: true }, compact: Boolean });
const emit = defineEmits(['close']);
const dialog = ref(null);
let returnTarget;
let previousOverflow;
let effect;
let closing = false;
let backdropDown = false;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function release() {
  if (previousOverflow !== undefined) {
    document.documentElement.style.overflow = previousOverflow;
    previousOverflow = undefined;
  }
  if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
}
async function close() {
  if (closing) return;
  closing = true;
  effect?.cancel();
  if (!reduced() && dialog.value?.animate) {
    effect = dialog.value.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(12px)' }], { duration: MOTION.fast, easing: EASING });
    await effect.finished.catch(() => {});
  }
  dialog.value?.close();
  release();
  emit('close');
}
onMounted(async () => {
  await nextTick();
  returnTarget = document.activeElement;
  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  dialog.value.showModal();
  if (!reduced() && dialog.value.animate) {
    effect = dialog.value.animate([{ opacity: 0, transform: 'translateY(20px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: MOTION.slow, easing: EASING });
  }
});
onUnmounted(() => { effect?.cancel(); dialog.value?.close(); release(); });
defineExpose({ close });
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="v2-dialog" :class="{ 'v2-dialog--compact': compact }" aria-labelledby="v2-dialog-title" @cancel.prevent="close" @pointerdown="backdropDown = $event.target === dialog" @pointerup="if (backdropDown && $event.target === dialog) close(); backdropDown = false">
      <header class="v2-dialog-header">
        <span id="v2-dialog-title">{{ title }}</span>
        <button type="button" class="v2-icon-button" :aria-label="closeLabel" autofocus @click="close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </header>
      <slot :close="close" />
    </dialog>
  </Teleport>
</template>

<style scoped>
.v2-dialog { color: var(--v2-text); background: var(--v2-surface); border: 1px solid var(--v2-border); border-radius: 1.5rem; padding: 0; margin: auto; width: min(1040px, calc(100% - 3rem)); max-width: none; max-height: calc(100dvh - 4rem); overflow: auto; overscroll-behavior: contain; box-shadow: 0 32px 100px rgb(0 0 0 / .3); }
.v2-dialog--compact { width: min(760px, calc(100% - 3rem)); }
.v2-dialog::backdrop { background: rgb(2 6 23 / .72); backdrop-filter: blur(5px); }
.v2-dialog-header { position: sticky; top: 0; z-index: 4; display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 72px; padding: .75rem 1.5rem; border-bottom: 1px solid var(--v2-border); background: var(--v2-surface); font-weight: 700; }
@media (max-width: 640px) { .v2-dialog, .v2-dialog--compact { width: 100%; height: 100dvh; max-height: 100dvh; border: 0; border-radius: 0; } .v2-dialog-header { padding-inline: 1rem; } }
</style>
