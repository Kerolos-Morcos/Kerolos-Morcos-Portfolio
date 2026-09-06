// Accepted entrance values stay unchanged; V2 interactions share this language.
export const EASING = 'cubic-bezier(.22, 1, .36, 1)';
export const MOTION = { fast: 220, medium: 320, slow: 420, magneticDistance: 4 };
export function initializeMotionTokens() {
  const style = document.documentElement.style;
  style.setProperty('--motion-fast', `${MOTION.fast}ms`);
  style.setProperty('--motion-medium', `${MOTION.medium}ms`);
  style.setProperty('--motion-slow', `${MOTION.slow}ms`);
  style.setProperty('--motion-premium-ease', EASING);
}
