import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Ruler, Check, ArrowUpRight, Columns2 } from 'lucide-react';
import { rentals } from '../data/content.js';
import { BOOK_URL, contact } from '../data/site.js';
import { gallery } from '../lib/media.js';
import PageHero from '../components/PageHero.jsx';
import Carousel from '../components/Carousel.jsx';
import Modal from '../components/Modal.jsx';
import Img from '../components/Img.jsx';
import { Reveal, SplitText, Stagger, StaggerItem } from '../components/Motion.jsx';
import { CtaBand } from '../components/Bits.jsx';

function Unit({ u, flip }) {
  const photos = gallery(u.gallery);
  return (
    <section className={`section rental ${flip ? 'rental--flip' : ''}`} id={u.id}>
      <div className="container rental__grid">
        <Reveal className="rental__media" x={flip ? 40 : -40} y={0}>
          <Carousel items={photos} title={u.name} aspect="4 / 3" />
        </Reveal>
        <div className="rental__copy">
          <Reveal as="p" className="eyebrow">RV Rental</Reveal>
          <SplitText as="h2" className="display" text={u.name} />
          <Reveal className="rental__specs" delay={0.1}>
            <span><BedDouble size={18} /> Sleeps {u.sleeps}</span>
            <span><Ruler size={18} /> {u.length}</span>
          </Reveal>
          <Reveal as="p" className="prose" delay={0.15}>{u.description}</Reveal>
          <Stagger as="ul" className="checklist" gap={0.05}>
            {u.features.map((f) => (
              <StaggerItem as="li" key={f} y={12}><Check size={16} />{f}</StaggerItem>
            ))}
          </Stagger>
          <Reveal className="rental__actions" delay={0.2}>
            <a className="btn btn--ember" href={BOOK_URL} target="_blank" rel="noopener">Book Now <ArrowUpRight size={16} /></a>
            <a className="btn btn--outline" href={contact.phoneHref}>Call {contact.phone}</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function RvRentals() {
  const [compare, setCompare] = useState(false);
  return (
    <>
      <PageHero title={rentals.title} image="2026/02/IMG_4198.jpeg" eyebrow="Stay without towing">
        <div className="hero-pills">
          {rentals.units.map((u) => <a key={u.id} href={`#${u.id}`} className="pill pill--light">{u.short} · {u.length}</a>)}
          <button className="pill pill--light" onClick={() => setCompare(true)}><Columns2 size={14} /> Compare</button>
        </div>
      </PageHero>

      {rentals.units.map((u, i) => <Unit key={u.id} u={u} flip={i % 2 === 1} />)}

      <section className="section section--sand compare-teaser">
        <div className="container compare-teaser__inner">
          <SplitText as="h2" className="h2" text="Laredo or Rockwood?" />
          <Reveal delay={0.1}><button className="btn btn--forest" onClick={() => setCompare(true)}><Columns2 size={18} /> Compare side by side</button></Reveal>
        </div>
      </section>

      <Modal open={compare} onClose={() => setCompare(false)} label="Compare RV rentals" className="compare">
        <h2 className="h3">Compare RV Rentals</h2>
        <div className="compare__grid">
          {rentals.units.map((u, i) => (
            <motion.div key={u.id} className="compare__col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
              <Img k={gallery(u.gallery)[0]} alt={u.name} cover className="compare__img" />
              <h3>{u.name}</h3>
              <div className="rental__specs"><span><BedDouble size={16} /> Sleeps {u.sleeps}</span><span><Ruler size={16} /> {u.length}</span></div>
              <ul className="checklist">{u.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}</ul>
              <a className="btn btn--ember btn--block" href={BOOK_URL} target="_blank" rel="noopener">Book {u.short}</a>
            </motion.div>
          ))}
        </div>
      </Modal>

      <CtaBand title="Everything included — just bring your bags" image="2026/02/IMG_4196-scaled.jpeg" />
    </>
  );
}
