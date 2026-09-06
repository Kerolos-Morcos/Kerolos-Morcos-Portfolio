import { track } from '@vercel/analytics';
import { projects } from '../data/projects';
import { allowedEvents, interactionProperties, sanitizedUrl } from './analyticsPolicy';

const projectIds = new Set(projects.map(project => project.id));
export const analyticsEnabled = () => import.meta.env.PROD && typeof window !== 'undefined' && !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) && navigator.doNotTrack !== '1';

export function redactEvent(event) {
  if (!analyticsEnabled()) return null;
  const url = sanitizedUrl(event.url);
  return url ? { ...event, url } : null;
}

export function trackEvent(name, projectId) {
  if (!allowedEvents.has(name) || !analyticsEnabled()) return;
  // Only known product IDs can enter the payload; never text, URLs, or form data.
  const properties = interactionProperties(projectId, projectIds);
  try { track(name, properties); } catch { /* Analytics cannot interrupt a user action. */ }
}

const bindings = new WeakMap();
export const trackClick = {
  mounted(element, binding) {
    const state = { value: binding.value, handler: null };
    state.handler = () => {
      const value = state.value;
      if (typeof value === 'string') trackEvent(value);
      else if (value) trackEvent(value.name, value.project);
    };
    bindings.set(element, state);
    element.addEventListener('click', state.handler);
  },
  updated(element, binding) { const state = bindings.get(element); if (state) state.value = binding.value; },
  unmounted(element) { element.removeEventListener('click', bindings.get(element)?.handler); bindings.delete(element); },
};
