import { computed, onMounted, onUnmounted, ref } from 'vue';
import { REQUEST_STATES, nextRequestState } from '../lib/v3';
export function useRequestJourney() {
  const state = ref('idle');
  const reduced = ref(false);
  const running = computed(() => state.value !== 'idle' && state.value !== 'complete');
  const step = computed(() => REQUEST_STATES.indexOf(state.value) - 1);
  let timer, query;
  function cancel(resolve = false) {
    clearTimeout(timer); timer = null;
    if (running.value) state.value = resolve ? 'complete' : 'idle';
  }
  function advance() {
    state.value = nextRequestState(state.value);
    if (running.value) timer = setTimeout(advance, 460);
  }
  function run() {
    if (running.value) return;
    clearTimeout(timer);
    state.value = reduced.value ? 'complete' : 'request';
    if (running.value) timer = setTimeout(advance, 460);
  }
  function preference() { reduced.value = query.matches; if (reduced.value) cancel(true); }
  function visibility() { if (document.hidden) cancel(); }
  onMounted(() => {
    query = matchMedia('(prefers-reduced-motion: reduce)'); preference();
    query.addEventListener('change', preference); document.addEventListener('visibilitychange', visibility);
  });
  onUnmounted(() => { cancel(); query?.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility); });
  return { state, step, running, reduced, run };
}
