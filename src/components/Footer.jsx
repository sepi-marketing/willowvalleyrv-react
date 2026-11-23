import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { contact, nav, copyright, BOOK_URL } from '../data/site.js';
import { home } from '../data/content.js';
import { img } from '../lib/media.js';
import { Reveal, SplitText } from './Motion.jsx';
import Ridges from './Ridges.jsx';

const logo = img('2022/12/cropped-Willow-Valley-RV-Resort-logo.png');

export default function Footer() {
  return (
    <footer className="site-footer">
      <Ridges className="site-footer__ridges" />
      <div className="container">
        <div className="footer-cta">
          <p className="eyebrow eyebrow--light">Blue Ridge Mountains · Northeast Georgia</p>
          <SplitText as="h2" className="footer-cta__title" text="I Hear The Mountains Calling, And I Must Go!!!!" />
          <Reveal delay={0.2} className="footer-cta__actions">
            <a className="btn btn--ember btn--lg" href={BOOK_URL} target="_blank" rel="noopener">Book Now</a>
            <a className="btn btn--ghost-light btn--lg" href={contact.phoneHref}><Phone size={18} /> {contact.phone}</a>
          </Reveal>
        </div>

        <div className="footer-grid">
          <div className="footer-col footer-col--brand">
            <img src={logo.png} alt="Willow Valley RV Resort logo" width="88" height="88" loading="lazy" />
            <p>{home.locationText}</p>
          </div>

          <div className="footer-col">
            <h2 className="footer-col__title">Contact Us</h2>
            <ul className="footer-contact">
              <li><Phone size={16} /><a href={contact.phoneHref}>{contact.phone}</a></li>
              <li><Mail size={16} /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li><MapPin size={16} /><a href={contact.directionsHref} target="_blank" rel="noopener">{contact.address}</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-col__title">Explore</h2>
            <ul className="footer-links">
              {nav.map((n) => (
                <li key={n.text}>
                  {n.to ? <Link to={n.to}>{n.text}</Link> : <a href={n.href} target="_blank" rel="noopener">{n.text} <ArrowUpRight size={13} /></a>}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-col__title">Office Hours</h2>
            <p className="footer-hours">{home.notices[0]}</p>
            <p className="footer-hours"><strong>{home.winter.title}</strong><br />{home.winter.lines[0]}<br />{home.winter.lines[1]}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{copyright}</p>
          <a className="btn btn--ember btn--sm" href={BOOK_URL} target="_blank" rel="noopener">Book Now</a>
        </div>
      </div>
    </footer>
  );
}
