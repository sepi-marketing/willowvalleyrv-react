import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Expand } from 'lucide-react';
import { img } from '../lib/media.js';
import Lightbox from './Lightbox.jsx';

const PAGE = 24;

// Masonry photo wall with progressive loading and a lightbox.
export default function MasonryGallery({ items, title, initial = PAGE }) {
  const [count, setCount] = useState(Math.min(initial, items.length));
  const [index, setIndex] = useState(null);
  const sentinel = useRef(null);

  useEffect(() => {
    if (!sentinel.current || count >= items.length) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setCount((c) => Math.min(c + PAGE, items.length));
    }, { rootMargin: '800px 0px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [count, items.length]);

  return (
    <>
      <div className="masonry">
        {items.slice(0, count).map((k, i) => {
          const m = img(k);
          return (
            <motion.button
              key={k}
              className="masonry__item"
              onClick={() => setIndex(i)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.05 }}
              aria-label={`Open photo ${i + 1} of ${items.length}${title ? ` — ${title}` : ''}`}
            >
              <img src={m.sm || m.src} width={m.w} height={m.h} alt={`${title || 'Willow Valley RV Resort'} photo ${i + 1}`} loading="lazy" decoding="async" />
              <span className="masonry__zoom"><Expand size={18} /></span>
            </motion.button>
          );
        })}
      </div>
      {count < items.length && (
        <div ref={sentinel} className="masonry__more">
          <button className="btn btn--outline" onClick={() => setCount((c) => Math.min(c + PAGE, items.length))}>
            Load more photos ({items.length - count} left)
          </button>
        </div>
      )}
      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} title={title} />
    </>
  );
}
