import React, { useEffect, useRef } from 'react';
import { mediaSrc } from '../lib/media.js';

// Client-only Lottie player (lottie-web touches the DOM at import time, so load it lazily).
export default function Lottie({ k, loop = true, className = '', label }) {
  const ref = useRef(null);
  useEffect(() => {
    let anim;
    let cancelled = false;
    const io = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || anim) return;
      io.disconnect();
      const [{ default: lottie }, data] = await Promise.all([
        import('lottie-web/build/player/lottie_light'),
        fetch(mediaSrc(k)).then((r) => r.json()),
      ]);
      if (cancelled || !ref.current) return;
      anim = lottie.loadAnimation({ container: ref.current, renderer: 'svg', loop, autoplay: true, animationData: data });
    });
    if (ref.current) io.observe(ref.current);
    return () => { cancelled = true; io.disconnect(); anim?.destroy(); };
  }, [k, loop]);
  return <div ref={ref} className={`lottie ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
