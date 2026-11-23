import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import { nav, contact, BOOK_URL } from '../data/site.js';
import { home } from '../data/content.js';
import { img } from '../lib/media.js';
import { lockScroll } from '../lib/lenis.js';

// Preview image shown beside each menu item on hover (desktop).
const previews = {
  '/about-us/': '2025/10/Drone-Pic-1.png',
  '/amenities/': '2025/12/IMG_4689-scaled.jpg',
  '/rates/': '2025/10/IMG_6387-1-scaled.jpg',
  '/rv-rentals/': '2026/02/IMG_4198.jpeg',
  '/rules/': '2025/11/IMG_3746-1-1-scaled.jpg',
  '/local-attractions/': '2022/12/things-to-do-7.jpg',
  '/park-map/': '2025/10/Willow-Valley-RV-Resort-2025Sitemap_.jpg',
  '/upcoming-events/': '2025/10/IMG_6854-1-scaled.jpg',
  '/gallery-2/': '2025/11/IMG_7056-1-scaled.jpg',
  '/drone-video/': '2023/01/Screen-Shot-2023-01-11-at-4.04.48-PM.png',
  '/customer-reviews/': '2025/12/IMG_4705-scaled.jpg',
  '/willow-valley-rv-resort-pool-membership-form/': '2023/06/Image-8.jpg',
  virtual: '2025/10/IMG_6441-scaled.jpg',
  '/contact-us/': '2025/12/IMG_6442-1-scaled.jpg',
};

const list = { show: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } }, hide: {} };
const item = {
  hide: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function MenuOverlay({ open, onClose }) {
  const [hover, setHover] = useState('/about-us/');
  const location = useLocation();

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-overlay"
          className="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
          data-lenis-prevent
        >
          <div className="menu-overlay__grid">
            <motion.ul className="menu-overlay__links" variants={list} initial="hide" animate="show" exit="hide">
              {nav.map((n, i) => {
                const key = n.to || 'virtual';
                const active = n.to && location.pathname === n.to;
                const inner = (
                  <>
                    <span className="menu-overlay__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="menu-overlay__text">{n.text}</span>
                    {n.href && <ArrowUpRight size={22} />}
                  </>
                );
                return (
                  <li key={key} className="menu-overlay__item" onMouseEnter={() => setHover(key)} onFocus={() => setHover(key)}>
                    <motion.div variants={item}>
                      {n.to ? (
                        <Link to={n.to} onClick={onClose} className={active ? 'is-active' : ''}>{inner}</Link>
                      ) : (
                        <a href={n.href} target="_blank" rel="noopener">{inner}</a>
                      )}
                    </motion.div>
                  </li>
                );
              })}
            </motion.ul>

            <motion.aside
              className="menu-overlay__aside"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <div className="menu-overlay__preview">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={hover}
                    src={img(previews[hover] || previews['/about-us/']).src}
                    alt=""
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  />
                </AnimatePresence>
              </div>
              <div className="menu-overlay__contact">
                <a href={contact.phoneHref}><Phone size={16} /> {contact.phone}</a>
                <a href={`mailto:${contact.email}`}><Mail size={16} /> {contact.email}</a>
                <a href={contact.directionsHref} target="_blank" rel="noopener"><MapPin size={16} /> {contact.address}</a>
              </div>
              <p className="menu-overlay__hours">
                {home.notices[0]}<br />
                {home.winter.title}: {home.winter.lines.join(' · ')}
              </p>
              <a className="btn btn--ember" href={BOOK_URL} target="_blank" rel="noopener">Book Now</a>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
