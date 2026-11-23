import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis, prefersReducedMotion } from '../lib/lenis.js';

// Buttery inertial scrolling on desktop; native scrolling on touch devices / reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    setLenis(lenis);
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
