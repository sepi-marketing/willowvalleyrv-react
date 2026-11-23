import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Download, Move } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Modal from '../components/Modal.jsx';
import { img } from '../lib/media.js';
import { Reveal } from '../components/Motion.jsx';
import { SectionHead, CtaBand } from '../components/Bits.jsx';
import { BOOK_URL } from '../data/site.js';

const MAP = '2025/10/Willow-Valley-RV-Resort-2025Sitemap_.jpg';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Pan & zoom viewer: drag, wheel, pinch, double-tap.
function ZoomViewer({ src, alt, full = false }) {
  const box = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0, s: 1 });
  const pointers = useRef(new Map());
  const last = useRef(null);

  const bound = useCallback((x, y, s) => {
    const el = box.current;
    if (!el) return { x, y, s };
    const mx = ((s - 1) * el.clientWidth) / 2;
    const my = ((s - 1) * el.clientHeight) / 2;
    return { x: clamp(x, -mx, mx), y: clamp(y, -my, my), s };
  }, []);

  const zoom = useCallback((f) => setT((p) => bound(p.x * f, p.y * f, clamp(p.s * f, 1, 5))), [bound]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15); };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom]);

  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); last.current = null; };
  const move = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (last.current) { const f = d / last.current; setT((p) => bound(p.x * f, p.y * f, clamp(p.s * f, 1, 5))); }
      last.current = d;
    } else {
      setT((p) => bound(p.x + (e.clientX - prev.x), p.y + (e.clientY - prev.y), p.s));
    }
  };
  const up = (e) => { pointers.current.delete(e.pointerId); last.current = null; };

  return (
    <div className={`zoom ${full ? 'zoom--full' : ''}`}>
      <div ref={box} className="zoom__stage" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onDoubleClick={() => (t.s > 1 ? setT({ x: 0, y: 0, s: 1 }) : zoom(2.2))} style={{ cursor: t.s > 1 ? 'grab' : 'zoom-in' }}>
        <motion.img src={src} alt={alt} draggable={false} animate={{ x: t.x, y: t.y, scale: t.s }} transition={{ type: 'tween', duration: 0.12 }} />
      </div>
      <div className="zoom__tools">
        <button onClick={() => zoom(1.4)} aria-label="Zoom in"><ZoomIn size={18} /></button>
        <span>{Math.round(t.s * 100)}%</span>
        <button onClick={() => zoom(1 / 1.4)} aria-label="Zoom out"><ZoomOut size={18} /></button>
        <button onClick={() => setT({ x: 0, y: 0, s: 1 })} aria-label="Reset view"><RotateCcw size={18} /></button>
      </div>
    </div>
  );
}

export default function ParkMap() {
  const [full, setFull] = useState(false);
  const m = img(MAP);
  return (
    <>
      <PageHero title="Park Map" image="2025/10/Drone-Pic-1.png" eyebrow="58 full hook-up sites" />
      <section className="section">
        <div className="container">
          <div className="split-head">
            <SectionHead eyebrow="Find your spot" title="Explore the resort">
              <p><Move size={14} /> Drag to pan · scroll or pinch to zoom · double-click to zoom in.</p>
            </SectionHead>
            <Reveal className="split-head__actions" delay={0.15}>
              <button className="btn btn--forest" onClick={() => setFull(true)}><Maximize2 size={16} /> Full screen</button>
              <a className="btn btn--outline" href={m.src} target="_blank" rel="noopener"><Download size={16} /> Open image</a>
            </Reveal>
          </div>
          <Reveal className="map-frame">
            <ZoomViewer src={m.src} alt="Willow Valley RV Resort 2025 site map" />
          </Reveal>
        </div>
      </section>
      <Modal open={full} onClose={() => setFull(false)} label="Park map full screen" variant="full" className="map-modal">
        <ZoomViewer src={m.src} alt="Willow Valley RV Resort 2025 site map" full />
      </Modal>
      <CtaBand title="Picked your favorite site?" image="2025/10/IMG_6387-1-scaled.jpg" text="The site you choose is not a guarantee, but we will try our best to accommodate your preference." />
    </>
  );
}
