// Shared handle to the Lenis smooth-scroll instance so modals can pause it.
let instance = null;
export const setLenis = (l) => { instance = l; };
export const getLenis = () => instance;

export function lockScroll(lock) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('is-locked', lock);
  if (instance) (lock ? instance.stop() : instance.start());
}

export function scrollToTop(immediate = true) {
  if (instance) instance.scrollTo(0, { immediate });
  else if (typeof window !== 'undefined') window.scrollTo(0, 0);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
