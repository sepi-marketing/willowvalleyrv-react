import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Reveal, SplitText } from './Motion.jsx';
import { BOOK_URL, contact } from '../data/site.js';
import Img from './Img.jsx';

export function Stars({ value = 5, size = 18, label = 'Rated 5 out of 5' }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.span key={i} initial={{ scale: 0, rotate: -40 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 + i * 0.08 }}>
          <Star size={size} fill={i < value ? 'currentColor' : 'none'} />
        </motion.span>
      ))}
    </span>
  );
}

export function SectionHead({ eyebrow, title, children, align = 'left', light = false, as = 'h2' }) {
  return (
    <div className={`section-head section-head--${align} ${light ? 'section-head--light' : ''}`}>
      {eyebrow && <Reveal as="p" className={`eyebrow ${light ? 'eyebrow--light' : ''}`} y={16}>{eyebrow}</Reveal>}
      <SplitText as={as} className="section-head__title" text={title} />
      {children && <Reveal className="section-head__lead" delay={0.15}>{children}</Reveal>}
    </div>
  );
}

export function RatingBar({ title, percent, delay = 0 }) {
  return (
    <div className="rating-bar">
      <div className="rating-bar__row"><span>{title}</span><span>{percent}%</span></div>
      <div className="rating-bar__track">
        <motion.div className="rating-bar__fill" initial={{ scaleX: 0 }} whileInView={{ scaleX: percent / 100 }} viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }} />
      </div>
    </div>
  );
}

export function CtaBand({ title = 'Ready for the mountains?', image = '2025/12/IMG_4705-scaled.jpg', text }) {
  return (
    <section className="cta-band">
      <div className="cta-band__media"><Img k={image} alt="" cover sizes="100vw" /></div>
      <div className="cta-band__shade" />
      <div className="container cta-band__inner">
        <SplitText as="h2" className="cta-band__title" text={title} />
        {text && <Reveal as="p" className="cta-band__text" delay={0.1}>{text}</Reveal>}
        <Reveal className="cta-band__actions" delay={0.2}>
          <a className="btn btn--ember btn--lg" href={BOOK_URL} target="_blank" rel="noopener">Book Now</a>
          <a className="btn btn--ghost-light btn--lg" href={contact.phoneHref}>Call {contact.phone}</a>
        </Reveal>
      </div>
    </section>
  );
}

export function MapEmbed({ src, title }) {
  return (
    <div className="map-embed">
      <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" aria-label={title} />
    </div>
  );
}

// Renders trusted, migrated HTML snippets (bold text, links, line breaks from the old site).
export function Html({ html, as: Tag = 'div', className }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
