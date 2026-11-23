import React from 'react';
import { about, aboutLong, ratingBars } from '../data/content.js';
import PageHero from '../components/PageHero.jsx';
import Img from '../components/Img.jsx';
import AmenityIcon from '../components/AmenityIcon.jsx';
import { Reveal, SplitText, Stagger, StaggerItem, Parallax } from '../components/Motion.jsx';
import { Stars, RatingBar, SectionHead, CtaBand } from '../components/Bits.jsx';

export default function About() {
  return (
    <>
      <PageHero title={about.title} image="2025/10/Drone-Pic-1.png" eyebrow="Northeast Georgia · Blue Ridge Mountains" />

      <section className="section">
        <div className="container about-intro">
          <Parallax speed={0.06} className="about-intro__media">
            <Img k={about.image} alt="Aerial drone view of Willow Valley RV Resort" />
          </Parallax>
          <div className="about-intro__copy prose">
            {about.paragraphs.map((p, i) => <Reveal as="p" key={i} delay={i * 0.1} className={i === 0 ? 'lead' : ''}>{p}</Reveal>)}
            <Reveal as="p" delay={0.25} className="tagline"><b>{about.tagline}</b></Reveal>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container about-rating">
          <div className="about-rating__score">
            <SectionHead eyebrow="Guest rating" title={about.aboutHeading} />
            <Reveal className="score score--dark">
              <span className="score__num">{about.rating}</span>
              <span className="score__label">{about.ratingLabel}</span>
              <Stars size={22} />
            </Reveal>
            <div className="rating-bars">
              {ratingBars.map((b, i) => <RatingBar key={b.title} {...b} delay={i * 0.12} />)}
            </div>
          </div>
          <div className="about-rating__text">
            <SplitText as="h2" className="h3" text={about.amenitiesTitle} />
            <Reveal as="p" className="prose">{aboutLong}</Reveal>
            <Stagger className="chip-grid" gap={0.05}>
              {about.amenities.map((a) => (
                <StaggerItem key={a.text} className="chip">
                  <AmenityIcon name={a.icon} size={20} />
                  <span>{a.text}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <CtaBand title="Come and experience our 4 distinct seasons" image="2025/10/IMG_6441-scaled.jpg" />
    </>
  );
}
