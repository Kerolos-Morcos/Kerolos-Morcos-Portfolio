import { inject, provide, readonly, ref } from 'vue';
const key = Symbol('portfolio-system-mode');

export function provideSystemMode() {
  let saved = false;
  try { saved = sessionStorage.getItem('portfolio-system-mode') === 'on'; } catch { /* Optional persistence. */ }
  const enabled = ref(saved);
  function set(value) {
    enabled.value = value;
    try { sessionStorage.setItem('portfolio-system-mode', value ? 'on' : 'off'); } catch { /* Optional persistence. */ }
  }
  const state = { enabled: readonly(enabled), set, toggle: () => set(!enabled.value) };
  provide(key, state);
  return state;
}
export const useSystemMode = () => inject(key);
