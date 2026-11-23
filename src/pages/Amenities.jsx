import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { amenities } from '../data/content.js';
import { gallery } from '../lib/media.js';
import PageHero from '../components/PageHero.jsx';
import AmenityIcon from '../components/AmenityIcon.jsx';
import Carousel from '../components/Carousel.jsx';
import { Stagger, StaggerItem } from '../components/Motion.jsx';
import { SectionHead, CtaBand } from '../components/Bits.jsx';

// Card that tilts toward the cursor.
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  return (
    <motion.div ref={ref} className={className} style={{ rotateX: rx, rotateY: ry }} onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}>
      {children}
    </motion.div>
  );
}

export default function Amenities() {
  return (
    <>
      <PageHero title={amenities.title} image="2025/12/IMG_4689-scaled.jpg" eyebrow="Pool · Splash Pad · Dog Park · Pavilion" />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Everything included" title="Made for slow mornings and long summer evenings" />
          <Stagger className="amenity-cards" gap={0.06}>
            {amenities.items.map((a, i) => (
              <StaggerItem key={a.text}>
                <TiltCard className="amenity-card">
                  <span className="amenity-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="amenity-card__icon"><AmenityIcon name={a.icon} size={34} /></span>
                  <h2 className="amenity-card__title">{a.text}</h2>
                  {a.sub && <p className="amenity-card__sub">{a.sub}</p>}
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section section--forest">
        <div className="container">
          <SectionHead eyebrow="Around the park" title="Take a look around" light />
          <Carousel items={gallery('galleryMain').filter((k) => !/206x|157x|285094235|292287539|263937069|292218006|292245229/.test(k)).slice(0, 12)} title="Willow Valley RV Resort" />
        </div>
      </section>
      <CtaBand title="Your site is waiting" image="2023/06/Image-8.jpg" />
    </>
  );
}
