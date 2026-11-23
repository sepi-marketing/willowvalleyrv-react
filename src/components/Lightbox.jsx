import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { img } from '../lib/media.js';
import { lockScroll } from '../lib/lenis.js';

// Full-screen photo viewer: keyboard arrows, swipe/drag, thumbnail rail.
export default function Lightbox({ items, index, onClose, onIndex, title }) {
  const open = index !== null && index !== undefined;
  const [dir, setDir] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rail = useRef(null);
  useEffect(() => setMounted(true), []);

  const go = useCallback((d) => {
    setDir(d);
    onIndex((i) => (i + d + items.length) % items.length);
  }, [items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false); };
  }, [open, go, onClose]);

  useEffect(() => {
    if (!open || !rail.current) return;
    rail.current.querySelector('.is-current')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [index, open]);

  if (!mounted) return null;
  const m = open ? img(items[index]) : null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={title || 'Photo viewer'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-lenis-prevent>
          <div className="lightbox__top">
            <span className="lightbox__count">{title ? `${title} · ` : ''}{index + 1} / {items.length}</span>
            <div className="lightbox__tools">
              <a href={m.src} target="_blank" rel="noopener" aria-label="Open full size"><Download size={18} /></a>
              <button onClick={onClose} aria-label="Close viewer"><X size={22} /></button>
            </div>
          </div>

          <div className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={items[index]}
                src={m.src}
                alt={`${title || 'Photo'} ${index + 1}`}
                className="lightbox__img"
                custom={dir}
                initial={{ opacity: 0, x: dir * 120, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -120, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              />
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={28} /></button>
                <button className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={28} /></button>
              </>
            )}
          </div>

          {items.length > 1 && (
            <div className="lightbox__rail" ref={rail}>
              {items.map((k, i) => (
                <button key={k} className={i === index ? 'is-current' : ''} onClick={() => { setDir(i > index ? 1 : -1); onIndex(i); }} aria-label={`Photo ${i + 1}`}>
                  <img src={img(k).sm || img(k).src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
