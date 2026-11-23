import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { attractions, stubPages } from '../data/content.js';
import PageHero from '../components/PageHero.jsx';
import Img from '../components/Img.jsx';
import { Reveal, SplitText } from '../components/Motion.jsx';
import { SectionHead, Html } from '../components/Bits.jsx';
import { AttractionGrid, AttractionModal } from './LocalAttractions.jsx';

// Pages that existed in WordPress without body copy. They reuse the matching Local Attractions entry.
export default function StubPage({ path }) {
  const stub = stubPages.find((s) => s.path === path);
  const item = attractions.items.find((a) => a.id === stub?.attraction);
  const others = attractions.items.filter((a) => a.id !== item?.id).slice(0, 6);
  const [open, setOpen] = useState(null);

  return (
    <>
      <PageHero title={stub.title} image={item?.image || '2022/12/things-to-do-8.jpg'} eyebrow="Local Attractions" crumb={<Link to="/local-attractions/">Local Attractions</Link>} size="sm" />
      {item && (
        <section className="section">
          <div className="container stub">
            <Reveal className="stub__media" x={-30} y={0}><Img k={item.image} alt={item.title} /></Reveal>
            <div className="stub__copy">
              <SplitText as="h2" className="display" text={item.title} />
              <Reveal><Html className="prose" html={item.html} /></Reveal>
              <Reveal className="stub__actions" delay={0.1}>
                <a className="btn btn--ember" href={item.href} target="_blank" rel="noopener">Visit Us <ArrowUpRight size={16} /></a>
                <Link className="btn btn--outline" to="/local-attractions/"><ArrowLeft size={16} /> All attractions</Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}
      <section className={`section ${item ? 'section--sand' : ''}`}>
        <div className="container">
          <SectionHead eyebrow="Near Willow Valley" title="More local attractions" />
          <AttractionGrid items={others} onOpen={setOpen} />
        </div>
      </section>
      <AttractionModal item={open} onClose={() => setOpen(null)} />
    </>
  );
}
