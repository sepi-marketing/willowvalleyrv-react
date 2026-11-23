import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { attractions } from '../data/content.js';
import PageHero from '../components/PageHero.jsx';
import Modal from '../components/Modal.jsx';
import Img from '../components/Img.jsx';
import { Stagger, StaggerItem } from '../components/Motion.jsx';
import { SectionHead, Html, CtaBand } from '../components/Bits.jsx';

export function AttractionModal({ item, onClose }) {
  return (
    <Modal open={!!item} onClose={onClose} label={item?.title || 'Attraction'} className="attraction-modal">
      {item && (
        <>
          <div className="attraction-modal__media"><Img k={item.image} alt={item.title} cover /></div>
          <div className="attraction-modal__body">
            <p className="eyebrow">Local Attractions</p>
            <h2 className="h2">{item.title}</h2>
            <Html className="prose" html={item.html} />
            <div className="attraction-modal__actions">
              <a className="btn btn--ember" href={item.href} target="_blank" rel="noopener">Visit Us <ArrowUpRight size={16} /></a>
              {item.page && <Link className="btn btn--outline" to={item.page} onClick={onClose}>Read more</Link>}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export function AttractionGrid({ items, onOpen }) {
  return (
    <Stagger className="attraction-grid" gap={0.08}>
      {items.map((a, i) => (
        <StaggerItem key={a.id} className={`attraction-card attraction-card--${i % 5}`}>
          <motion.button onClick={() => onOpen(a)} whileHover="hover" initial="rest" animate="rest" aria-label={`${a.title} — details`}>
            <motion.div className="attraction-card__media" variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <Img k={a.image} alt="" cover sizes="(max-width: 760px) 100vw, 33vw" />
            </motion.div>
            <span className="attraction-card__shade" />
            <span className="attraction-card__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="attraction-card__body">
              <h3>{a.title}</h3>
              <motion.span className="attraction-card__more" variants={{ rest: { opacity: 0.8 }, hover: { opacity: 1 } }}>
                <Plus size={16} /> Details
              </motion.span>
            </span>
          </motion.button>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default function LocalAttractions() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <PageHero title={attractions.title} image="2022/12/things-to-do-7.jpg" eyebrow="Waterfalls · Lakes · Vineyards · Trails" />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Rabun County, Georgia" title="Outdoor mountain adventures, minutes away">
            <p>Tap any card for details and links.</p>
          </SectionHead>
          <AttractionGrid items={attractions.items} onOpen={setOpen} />
        </div>
      </section>
      <AttractionModal item={open} onClose={() => setOpen(null)} />
      <CtaBand title="Make Willow Valley your basecamp" image="2022/12/things-to-do-4.jpg" />
    </>
  );
}
