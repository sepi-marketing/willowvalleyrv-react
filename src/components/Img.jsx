import React, { useEffect, useRef, useState } from 'react';
import { img } from '../lib/media.js';

// Responsive, lazy, fade-in image driven by a migrated media key.
export default function Img({ k, alt = '', className = '', sizes = '(max-width: 760px) 100vw, 50vw', eager = false, cover = false, style, ...rest }) {
  const m = img(k);
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  // Prerendered images may finish loading before React hydrates and attaches onLoad.
  useEffect(() => { if (ref.current?.complete) setLoaded(true); }, [k]);
  return (
    <img
      ref={ref}
      src={m.src}
      srcSet={m.sm ? `${m.sm} 720w, ${m.src} ${m.w}w` : undefined}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      onLoad={() => setLoaded(true)}
      className={`img ${cover ? 'img--cover' : ''} ${loaded || eager ? 'is-loaded' : ''} ${className}`}
      style={style}
      {...rest}
    />
  );
}
