import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { img } from '../lib/media.js';
import Lightbox from './Lightbox.jsx';

// Snap-scrolling photo carousel (swipe on touch, arrows on desktop) that opens a lightbox.
export default function Carousel({ items, title, aspect = '4 / 3', className = '' }) {
  const track = useRef(null);
  const [index, setIndex] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild?.getBoundingClientRect().width || 1;
      setActive(Math.round(el.scrollLeft / (w + 16)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const by = (d) => {
    const el = track.current;
    const w = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth;
    el.scrollBy({ left: d * (w + 16), behavior: 'smooth' });
  };

  return (
    <div className={`carousel ${className}`}>
      <div className="carousel__track" ref={track} data-lenis-prevent-wheel>
        {items.map((k, i) => {
          const m = img(k);
          return (
            <button key={k} className="carousel__slide" style={{ aspectRatio: aspect }} onClick={() => setIndex(i)} aria-label={`Open photo ${i + 1}${title ? ` — ${title}` : ''}`}>
              <img src={m.sm || m.src} srcSet={m.sm ? `${m.sm} 720w, ${m.src} ${m.w}w` : undefined} sizes="(max-width: 760px) 85vw, 40vw" alt={`${title || 'Photo'} ${i + 1}`} loading="lazy" />
            </button>
          );
        })}
      </div>
      <div className="carousel__controls">
        <div className="carousel__dots" aria-hidden="true">
          {items.map((k, i) => <span key={k} className={i === active ? 'is-active' : ''} />)}
        </div>
        <div className="carousel__arrows">
          <button onClick={() => by(-1)} aria-label="Previous"><ChevronLeft size={20} /></button>
          <button onClick={() => by(1)} aria-label="Next"><ChevronRight size={20} /></button>
        </div>
      </div>
      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} title={title} />
    </div>
  );
}
