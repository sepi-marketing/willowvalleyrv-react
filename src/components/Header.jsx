import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { nav, primaryNav, BOOK_URL } from '../data/site.js';
import { img } from '../lib/media.js';
import MenuOverlay from './MenuOverlay.jsx';

const logo = img('2022/12/cropped-Willow-Valley-RV-Resort-logo.png');

export default function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 400 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => setOpen(false), [location.pathname]);

  const items = primaryNav.map((to) => nav.find((n) => n.to === to));

  return (
    <>
      <motion.header
        className={`site-header ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="site-header__inner">
          <Link to="/" className="brand" aria-label="Willow Valley RV Resort — home">
            <img src={logo.png} alt="Willow Valley RV Resort logo" width="56" height="56" />
            <span className="brand__text">
              <strong>Willow Valley</strong>
              <em>RV Resort · Dillard, GA</em>
            </span>
          </Link>

          <nav className="primary-nav" aria-label="Primary">
            {items.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {n.text}
                <span className="primary-nav__dot" />
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <a className="btn btn--ember btn--sm hide-sm" href={BOOK_URL} target="_blank" rel="noopener">
              Book Now
            </a>
            <button
              className="menu-toggle"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
              <span className="menu-toggle__bars" aria-hidden="true">
                <i /><i />
              </span>
            </button>
          </div>
        </div>
      </motion.header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
