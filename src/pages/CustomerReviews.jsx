import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, MapPin } from 'lucide-react';
import { reviews, ratingBars, aboutLong, home } from '../data/content.js';
import { contact } from '../data/site.js';
import PageHero from '../components/PageHero.jsx';
import Img from '../components/Img.jsx';
import Modal from '../components/Modal.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { Stars, RatingBar, SectionHead, MapEmbed, CtaBand } from '../components/Bits.jsx';

export default function CustomerReviews() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <PageHero title="Customer Review" image="2025/12/IMG_4705-scaled.jpg" eyebrow="Willow Valley RV Resort">
        <div className="hero-rating"><Stars size={20} /><span>5 out of 5</span></div>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Rated 5 out of 5" title="Willow Valley RV Resort" />
          <Stagger className="review-wall" gap={0.1}>
            {reviews.map((r, i) => (
              <StaggerItem key={r.name} className={`review-card review-card--${i % 3}`}>
                <motion.button onClick={() => setOpen(r)} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} aria-label={`Read review by ${r.name}`}>
                  <div className="review-card__media"><Img k={r.image} alt="" cover sizes="(max-width: 760px) 100vw, 33vw" /></div>
                  <div className="review-card__body">
                    <Stars size={16} />
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="review-card__who">— {r.name}</span>
                  </div>
                </motion.button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container about-rating">
          <div className="about-rating__score">
            <SectionHead eyebrow="Guest rating" title="About" />
            <Reveal className="score score--dark"><span className="score__num">{home.rating}</span><Stars size={22} /></Reveal>
            <div className="rating-bars">{ratingBars.map((b, i) => <RatingBar key={b.title} {...b} delay={i * 0.12} />)}</div>
          </div>
          <div className="about-rating__text">
            <Reveal as="p" className="prose">{aboutLong}</Reveal>
            <Reveal className="review-map" delay={0.1}>
              <MapEmbed src={contact.mapSrcFull} title="323 Yorkhouse Road Rd, Rabun Gap, GA 30568-2428" />
              <p><MapPin size={16} /> 323 Yorkhouse Road Rd, Rabun Gap, GA 30568-2428</p>
            </Reveal>
          </div>
        </div>
      </section>

      <Modal open={!!open} onClose={() => setOpen(null)} label={open ? `Review by ${open.name}` : 'Review'} className="review-modal">
        {open && (
          <>
            <div className="review-modal__media"><Img k={open.image} alt="" cover /></div>
            <div className="review-modal__body">
              <Quote size={40} className="review-modal__quote" />
              <Stars size={18} />
              <h2 className="h3">{open.title}</h2>
              <blockquote>{open.text}</blockquote>
              <p className="review-card__who">— {open.name}</p>
            </div>
          </>
        )}
      </Modal>

      <CtaBand title="Come write your own story" image="2025/10/IMG_6441-scaled.jpg" />
    </>
  );
}
