import React from 'react';
import { Phone, Navigation, CalendarCheck } from 'lucide-react';
import { contact, BOOK_URL } from '../data/site.js';

// Thumb-reach action bar on phones.
export default function MobileDock() {
  return (
    <nav className="mobile-dock" aria-label="Quick actions">
      <a href={contact.phoneHref}><Phone size={18} /><span>Call</span></a>
      <a href={contact.directionsHref} target="_blank" rel="noopener"><Navigation size={18} /><span>Directions</span></a>
      <a className="mobile-dock__book" href={BOOK_URL} target="_blank" rel="noopener"><CalendarCheck size={18} /><span>Book Now</span></a>
    </nav>
  );
}
