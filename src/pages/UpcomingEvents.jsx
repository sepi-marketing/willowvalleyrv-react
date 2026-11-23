import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CalendarHeart, ArrowRight } from 'lucide-react';
import { events, galleryHub } from '../data/content.js';
import { eventGallery } from '../lib/media.js';
import PageHero from '../components/PageHero.jsx';
import Img from '../components/Img.jsx';
import Lottie from '../components/Lottie.jsx';
import { Reveal, SplitText } from '../components/Motion.jsx';
import { SectionHead, CtaBand } from '../components/Bits.jsx';
import { useRef } from 'react';

// Image shown with each recurring event; Halloween uses the latest Halloween gallery.
const eventImage = (e) => (e.title === 'HalloweenFest' ? eventGallery('halloween-2025')[3] || e.image : e.image);

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="timeline">
      <motion.span className="timeline__line" style={{ scaleY: line }} aria-hidden="true" />
      {events.items.map((e, i) => (
        <article key={e.title} className={`timeline__item ${i % 2 ? 'timeline__item--right' : ''}`}>
          <Reveal className="timeline__dot" y={0}><CalendarHeart size={18} /></Reveal>
          <Reveal className="timeline__card" x={i % 2 ? 40 : -40} y={0}>
            <div className="timeline__media"><Img k={eventImage(e)} alt={e.title} cover /></div>
            <div className="timeline__body">
              <span className="timeline__month">{e.month}</span>
              <h2 className="h3">{e.title}</h2>
              <p>{e.when}</p>
            </div>
          </Reveal>
        </article>
      ))}
    </div>
  );
}

export default function UpcomingEvents({ calendar = false }) {
  return (
    <>
      <PageHero title={calendar ? 'Calendar' : 'Upcoming Events'} image="2025/10/IMG_6854-1-scaled.jpg" eyebrow="Traditions at Willow Valley" />
      <section className="section">
        <div className="container events-intro">
          <div>
            <SectionHead eyebrow="Every year" title={events.title} />
            <Reveal as="p" className="lead" delay={0.1}>Mark your calendar — these are the gatherings our guests come back for.</Reveal>
          </div>
          <Lottie k={events.lottie} className="events-intro__lottie" />
        </div>
        <div className="container"><Timeline /></div>
      </section>
      <section className="section section--forest">
        <div className="container">
          <div className="split-head">
            <SectionHead eyebrow="Look back" title="Past event photos" light />
            <Reveal delay={0.15}><Link className="btn btn--ghost-light" to="/gallery-2/">Full gallery <ArrowRight size={16} /></Link></Reveal>
          </div>
          <div className="mini-events">
            {galleryHub.events.slice(0, 4).map((e, i) => (
              <Reveal key={e.to} delay={i * 0.08}>
                <Link to={e.to} className="mini-event">
                  <Img k={eventGallery(e.key)[0]} alt="" cover sizes="(max-width: 760px) 50vw, 25vw" />
                  <span>{e.title}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Join us for the next one" image="2025/11/IMG_7057-1-scaled.jpg" />
    </>
  );
}
