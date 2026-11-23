import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Clock, MoonStar, Gauge, Waves, X } from 'lucide-react';
import { rules } from '../data/content.js';
import { gallery } from '../lib/media.js';
import PageHero from '../components/PageHero.jsx';
import Carousel from '../components/Carousel.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { SectionHead, Html } from '../components/Bits.jsx';

const quick = [
  { icon: Clock, label: 'Check in', value: '1:00 pm' },
  { icon: Clock, label: 'Check out', value: 'by 11:00 am' },
  { icon: MoonStar, label: 'Quiet time', value: '10:00 pm – 8:00 am' },
  { icon: Gauge, label: 'Speed limit', value: '10 MPH' },
  { icon: Waves, label: 'Pool hours', value: '10:00 am – 9:00 pm' },
];
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').toLowerCase();

export default function Rules() {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const groups = useMemo(() => rules.groups
    .filter((g) => tab === 'all' || g.id === tab)
    .map((g) => ({ ...g, items: g.items.filter((i) => !q || strip(i).includes(q.toLowerCase())) }))
    .filter((g) => g.items.length), [tab, q]);

  let n = 0;
  return (
    <>
      <PageHero title={rules.title} image="2025/11/IMG_3746-1-1-scaled.jpg" eyebrow="Guest rules & policies" />

      <section className="section">
        <div className="container">
          <Stagger className="quick-facts" gap={0.07}>
            {quick.map(({ icon: Icon, label, value }) => (
              <StaggerItem key={label} className="quick-fact">
                <Icon size={20} />
                <span>{label}</span>
                <strong>{value}</strong>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container rules-layout">
          <div className="rules-main">
            <div className="rules-toolbar">
              <div className="tabs" role="tablist" aria-label="Rule sections">
                {[{ id: 'all', title: 'All' }, ...rules.groups.map((g) => ({ id: g.id, title: g.id === 'general' ? 'Park Rules' : g.id === 'cancellation' ? 'Cancellation' : 'Notice' }))].map((t) => (
                  <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
                    {tab === t.id && <motion.span layoutId="rules-tab" className="tabs__pill" />}
                    <span>{t.title}</span>
                  </button>
                ))}
              </div>
              <label className="search">
                <Search size={16} />
                <input type="search" placeholder="Search rules (e.g. pets, pool, fire)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search rules" />
                {q && <button onClick={() => setQ('')} aria-label="Clear search"><X size={14} /></button>}
              </label>
            </div>

            <AnimatePresence mode="popLayout">
              {groups.map((g) => (
                <motion.div key={g.id} layout className="rule-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {g.id !== 'general' && <h2 className="rule-group__title">{g.title}</h2>}
                  <ol className="rule-list">
                    {g.items.map((item) => {
                      n += 1;
                      return (
                        <motion.li layout key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
                          <span className="rule-list__n">{String(n).padStart(2, '0')}</span>
                          <Html as="p" html={item} />
                        </motion.li>
                      );
                    })}
                  </ol>
                </motion.div>
              ))}
            </AnimatePresence>
            {!groups.length && <p className="empty">No rules match “{q}”.</p>}
          </div>

          <aside className="rules-aside">
            <Reveal>
              <SectionHead eyebrow="Around the park" title="Enjoy your stay" as="h2" />
              <Carousel items={gallery('rulesCarousel')} title="Willow Valley RV Resort" aspect="4 / 5" />
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
