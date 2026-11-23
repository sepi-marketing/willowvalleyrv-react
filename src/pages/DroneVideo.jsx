import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Expand, ArrowUpRight } from 'lucide-react';
import { gallery } from '../lib/media.js';
import { VIRTUAL_TOUR_URL } from '../data/site.js';
import PageHero from '../components/PageHero.jsx';
import Img from '../components/Img.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { Stagger, StaggerItem, Reveal } from '../components/Motion.jsx';
import { SectionHead } from '../components/Bits.jsx';

export default function DroneVideo() {
  const frames = gallery('drone');
  const [index, setIndex] = useState(null);
  return (
    <>
      <PageHero title="Drone Video" image={frames[0]} eyebrow="Willow Valley from above" />
      <section className="section section--ink">
        <div className="container">
          <SectionHead eyebrow="Aerial views" title="The valley from the sky" light />
          <Stagger className="drone-grid" gap={0.08}>
            {frames.map((k, i) => (
              <StaggerItem key={k} className={`drone-frame drone-frame--${i}`}>
                <motion.button onClick={() => setIndex(i)} whileHover={{ scale: 0.985 }} aria-label={`Open aerial frame ${i + 1}`}>
                  <Img k={k} alt={`Aerial drone frame ${i + 1} of Willow Valley RV Resort`} cover sizes="(max-width: 760px) 100vw, 50vw" />
                  <span className="drone-frame__hud" aria-hidden="true"><i /><i /><i /><i /></span>
                  <span className="drone-frame__zoom"><Expand size={18} /></span>
                </motion.button>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="center" delay={0.1}>
            <a className="btn btn--ghost-light btn--lg" href={VIRTUAL_TOUR_URL} target="_blank" rel="noopener">Take the Virtual Tour <ArrowUpRight size={18} /></a>
          </Reveal>
        </div>
      </section>
      <Lightbox items={frames} index={index} onIndex={setIndex} onClose={() => setIndex(null)} title="Drone Video" />
    </>
  );
}
