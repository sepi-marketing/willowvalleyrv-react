import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Img from './Img.jsx';
import Ridges from './Ridges.jsx';
import { SplitText } from './Motion.jsx';

// Interior page hero: parallax photo, masked title reveal, breadcrumb, ridge divider.
export default function PageHero({ title, image, eyebrow, children, crumb, size = 'md' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className={`page-hero page-hero--${size}`}>
      <motion.div className="page-hero__media" style={{ y, scale }}>
        {image && <Img k={image} alt="" eager cover sizes="100vw" />}
      </motion.div>
      <div className="page-hero__shade" />
      <motion.div className="container page-hero__content" style={{ opacity: fade }}>
        <motion.nav className="crumbs" aria-label="Breadcrumb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          {crumb && (<>{crumb}<ChevronRight size={14} /></>)}
          <span aria-current="page">{title}</span>
        </motion.nav>
        {eyebrow && (
          <motion.p className="eyebrow eyebrow--light" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            {eyebrow}
          </motion.p>
        )}
        <SplitText as="h1" className="page-hero__title" text={title} immediate delay={0.25} />
        {children && (
          <motion.div className="page-hero__extra" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
            {children}
          </motion.div>
        )}
      </motion.div>
      <Ridges className="page-hero__ridges" />
    </section>
  );
}
