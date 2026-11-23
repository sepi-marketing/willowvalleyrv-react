import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Images } from 'lucide-react';
import { eventPages, galleryHub } from '../data/content.js';
import { eventGallery } from '../lib/media.js';
import PageHero from '../components/PageHero.jsx';
import MasonryGallery from '../components/MasonryGallery.jsx';
import { Reveal } from '../components/Motion.jsx';
import { SectionHead } from '../components/Bits.jsx';
import { EventCards } from './Gallery.jsx';

export default function EventGallery({ eventKey }) {
  const page = eventPages.find((e) => e.key === eventKey);
  const photos = eventGallery(eventKey);
  const order = galleryHub.events;
  const idx = order.findIndex((e) => e.key === eventKey);
  const prev = order[(idx - 1 + order.length) % order.length];
  const next = order[(idx + 1) % order.length];
  const more = order.filter((e) => e.key !== eventKey).slice(0, 3);

  return (
    <>
      <PageHero title={page.heading} image={photos[0]} eyebrow={page.heading !== page.title ? page.title : 'Event album'} crumb={<Link to="/gallery-2/">Gallery</Link>}>
        <span className="pill pill--light"><Images size={14} /> {photos.length} photos</span>
      </PageHero>
      <section className="section">
        <div className="container">
          <MasonryGallery items={photos} title={page.title} />
          <Reveal className="album-nav">
            <Link to={prev.to} className="album-nav__link"><ArrowLeft size={18} /><span><small>Previous album</small>{prev.title}</span></Link>
            <Link to="/gallery-2/" className="btn btn--outline">All albums</Link>
            <Link to={next.to} className="album-nav__link album-nav__link--next"><span><small>Next album</small>{next.title}</span><ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Keep browsing" title="More albums" />
          <EventCards items={more} />
        </div>
      </section>
    </>
  );
}
