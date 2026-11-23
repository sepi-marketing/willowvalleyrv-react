import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Images, ArrowUpRight } from 'lucide-react';
import { galleryHub } from '../data/content.js';
import { gallery, eventGallery } from '../lib/media.js';
import PageHero from '../components/PageHero.jsx';
import Img from '../components/Img.jsx';
import MasonryGallery from '../components/MasonryGallery.jsx';
import { Stagger, StaggerItem } from '../components/Motion.jsx';
import { SectionHead } from '../components/Bits.jsx';

export function EventCards({ items }) {
  return (
    <Stagger className="event-cards" gap={0.07}>
      {items.map((e, i) => {
        const photos = eventGallery(e.key);
        return (
          <StaggerItem key={e.to} className={`event-card ${i === 0 ? 'event-card--wide' : ''}`}>
            <Link to={e.to}>
              <motion.div className="event-card__media" whileHover={{ scale: 1.06 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <Img k={photos[0]} alt="" cover sizes="(max-width: 760px) 100vw, 33vw" />
              </motion.div>
              <span className="event-card__shade" />
              <span className="event-card__count"><Images size={14} /> {photos.length}</span>
              <span className="event-card__body">
                <h3>{e.title}</h3>
                <span className="event-card__go"><ArrowUpRight size={18} /></span>
              </span>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export default function Gallery() {
  return (
    <>
      <PageHero title={galleryHub.title} image="2025/11/IMG_7056-1-scaled.jpg" eyebrow="Memories from the valley" />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Seasons at Willow Valley" title="Around the resort" />
          <MasonryGallery items={gallery('galleryMain')} title="Gallery" initial={37} />
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Event albums" title="Celebrations & holidays" />
          <EventCards items={galleryHub.events} />
        </div>
      </section>
    </>
  );
}
