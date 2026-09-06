import { clampDepth } from '../lib/v3';
const cleanup = new WeakMap();
export const projectDepth = {
  mounted(element) {
    const query = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame, bounds, x = 0, y = 0;
    const reset = () => { cancelAnimationFrame(frame); frame = null; bounds = null; element.style.setProperty('--image-x', '0px'); element.style.setProperty('--image-y', '0px'); };
    const move = event => {
      if (!query.matches || event.pointerType === 'touch') return;
      bounds ||= element.getBoundingClientRect();
      x = clampDepth((event.clientX - bounds.left) / bounds.width * 2 - 1) * 4;
      y = clampDepth((event.clientY - bounds.top) / bounds.height * 2 - 1) * 4;
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = null; element.style.setProperty('--image-x', `${x}px`); element.style.setProperty('--image-y', `${y}px`); });
    };
    element.addEventListener('pointermove', move, { passive: true }); element.addEventListener('pointerleave', reset); element.addEventListener('pointercancel', reset);
    window.addEventListener('resize', reset, { passive: true }); window.addEventListener('scroll', reset, { passive: true }); window.addEventListener('blur', reset); query.addEventListener('change', reset);
    cleanup.set(element, () => { reset(); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); element.removeEventListener('pointercancel', reset); window.removeEventListener('resize', reset); window.removeEventListener('scroll', reset); window.removeEventListener('blur', reset); query.removeEventListener('change', reset); });
  },
  unmounted(element) { cleanup.get(element)?.(); cleanup.delete(element); },
};
