import { MOTION } from '../motion';

const cleanup = new WeakMap();
function attach(element, magnetic) {
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame;
  let bounds;
  let point;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = null;
    bounds = null;
    element.style.removeProperty('--pointer-x');
    element.style.removeProperty('--pointer-y');
    element.style.removeProperty('--magnet-x');
    element.style.removeProperty('--magnet-y');
    element.classList.remove('pointer-active');
  };
  const move = (event) => {
    if (!allowed.matches || event.pointerType === 'touch') return;
    bounds ||= element.getBoundingClientRect();
    point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      element.classList.add('pointer-active');
      if (magnetic) {
        const clamp = (value) => Math.max(-MOTION.magneticDistance, Math.min(MOTION.magneticDistance, value));
        element.style.setProperty('--magnet-x', `${clamp((point.x / bounds.width - .5) * 8)}px`);
        element.style.setProperty('--magnet-y', `${clamp((point.y / bounds.height - .5) * 8)}px`);
      } else {
        element.style.setProperty('--pointer-x', `${point.x}px`);
        element.style.setProperty('--pointer-y', `${point.y}px`);
      }
    });
  };
  element.classList.add(magnetic ? 'v2-magnetic' : 'v2-spotlight');
  element.addEventListener('pointermove', move, { passive: true });
  element.addEventListener('pointerleave', reset);
  element.addEventListener('pointercancel', reset);
  element.addEventListener('blur', reset);
  allowed.addEventListener('change', reset);
  cleanup.set(element, () => {
    reset();
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerleave', reset);
    element.removeEventListener('pointercancel', reset);
    element.removeEventListener('blur', reset);
    allowed.removeEventListener('change', reset);
  });
}
const unmount = (element) => { cleanup.get(element)?.(); cleanup.delete(element); };
export const magnetic = { mounted: (el) => attach(el, true), unmounted: unmount };
export const spotlight = { mounted: (el) => attach(el, false), unmounted: unmount };
