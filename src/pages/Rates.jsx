import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Snowflake, Sun, Ruler, CalendarClock, PhoneCall, Percent, CalendarX, Check, Sparkles, ArrowUpRight, Info } from 'lucide-react';
import { rates } from '../data/content.js';
import { BOOK_URL } from '../data/site.js';
import PageHero from '../components/PageHero.jsx';
import { AnimatedNumber, Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { SectionHead, CtaBand } from '../components/Bits.jsx';

const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;
const seasonForMonth = (m) => (rates.seasons.find((s) => s.months.includes(m)) || rates.seasons[1]).id;
const recommendFor = (ft) => (ft <= 30 ? 'economy' : ft <= 39 ? 'premium' : 'super');
const policyIcons = [CalendarClock, PhoneCall, Percent, CalendarX];

function Segmented({ options, value, onChange, layoutId, label }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={value === o.id ? 'is-active' : ''} onClick={() => onChange(o.id)}>
          {value === o.id && <motion.span layoutId={layoutId} className="segmented__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
          <span className="segmented__label">{o.icon}{o.label}</span>
          {o.tag && <span className="segmented__tag">{o.tag}</span>}
        </button>
      ))}
    </div>
  );
}

// Ambient particles: snow for winter, fireflies for the warm season.
function Atmosphere({ season }) {
  const dots = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ left: (i * 37) % 100, delay: (i * 0.73) % 9, size: 3 + ((i * 7) % 5), dur: 8 + ((i * 5) % 7) })), []);
  return (
    <div className={`atmosphere atmosphere--${season}`} aria-hidden="true">
      {dots.map((d, i) => (
        <span key={i} style={{ left: `${d.left}%`, width: d.size, height: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  );
}

function SiteCard({ site, price, daily, duration, recommended, maxTotal }) {
  const total = num(price.total);
  const savings = duration.nights > 1 ? Math.round((1 - total / (num(daily.total) * duration.nights)) * 100) : 0;
  return (
    <motion.article layout className={`rate-card ${recommended ? 'is-recommended' : ''}`} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
      <AnimatePresence>
        {recommended && (
          <motion.span className="rate-card__badge" initial={{ opacity: 0, y: -10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.8 }}>
            <Sparkles size={14} /> Fits your rig
          </motion.span>
        )}
      </AnimatePresence>
      <p className="rate-card__range">{site.range}</p>
      <h3 className="rate-card__name">{site.short}</h3>
      <p className="rate-card__label">{duration.id === 'daily' ? site.label : site.weeklyLabel || site.label}</p>
      <div className="rate-card__price">
        <AnimatedNumber value={price.total} />
        <span className="rate-card__unit">/ {duration.unit}</span>
      </div>
      <div className="rate-card__meter"><motion.span animate={{ scaleX: total / maxTotal }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
      <div className="rate-card__meta">
        <AnimatePresence mode="wait">
          <motion.p key={price.perNight || 'nightly'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="rate-card__per">
            {price.perNight ? `${price.perNight} – ${price.total}` : 'Per night'}
          </motion.p>
        </AnimatePresence>
        {savings > 0 && <span className="rate-card__save">≈ {savings}% less than nightly</span>}
      </div>
      <a className="btn btn--forest btn--block" href={BOOK_URL} target="_blank" rel="noopener">
        Book {site.short} <ArrowUpRight size={16} />
      </a>
    </motion.article>
  );
}

function Matrix({ season, duration }) {
  return (
    <div className="matrix-wrap" data-lenis-prevent-wheel>
      <table className="matrix">
        <caption className="sr-only">All Willow Valley RV Resort rates by season, stay length and site type</caption>
        <thead>
          <tr>
            <th rowSpan={2} scope="col" className="matrix__corner">Site</th>
            {rates.seasons.map((s) => (
              <th key={s.id} colSpan={3} scope="colgroup" className={`matrix__season ${s.id === season ? 'is-active' : ''}`}>
                {s.id === 'winter' ? <Snowflake size={14} /> : <Sun size={14} />} {s.label}
              </th>
            ))}
          </tr>
          <tr>
            {rates.seasons.map((s) => rates.durations.map((d) => (
              <th key={s.id + d.id} scope="col" className={s.id === season && d.id === duration ? 'is-active' : ''}>{d.label}</th>
            )))}
          </tr>
        </thead>
        <tbody>
          {rates.siteTypes.map((t) => (
            <tr key={t.id}>
              <th scope="row">{d0(t)}</th>
              {rates.seasons.map((s) => rates.durations.map((d) => {
                const p = s.prices[d.id][t.id];
                return (
                  <td key={s.id + d.id} className={s.id === season && d.id === duration ? 'is-active' : ''}>
                    <strong>{p.total}</strong>
                    {p.perNight && <small>{p.perNight}</small>}
                  </td>
                );
              }))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const d0 = (t) => t.label;

export default function Rates() {
  const [season, setSeason] = useState('peak');
  const [current, setCurrent] = useState(null);
  const [duration, setDuration] = useState('daily');
  const [ft, setFt] = useState(32);

  useEffect(() => {
    const s = seasonForMonth(new Date().getMonth() + 1);
    setSeason(s);
    setCurrent(s);
  }, []);

  const S = rates.seasons.find((s) => s.id === season);
  const D = rates.durations.find((d) => d.id === duration);
  const rec = recommendFor(ft);
  const maxTotal = Math.max(...rates.siteTypes.map((t) => num(S.prices[duration][t.id].total)));

  return (
    <>
      <PageHero title={rates.title} image="2025/10/IMG_6387-1-scaled.jpg" eyebrow="Full hook-up · 30/50 AMP sites">
        <p className="page-hero__lead">Pick your season, your stay and your rig — we’ll show you the right site.</p>
      </PageHero>

      <section className={`section planner planner--${season}`}>
        <Atmosphere season={season} />
        <div className="container planner__grid">
          <aside className="planner__controls">
            <Reveal as="p" className="eyebrow">Stay planner</Reveal>
            <Reveal as="h2" className="h2">Find your rate</Reveal>

            <div className="control">
              <span className="control__label">Season</span>
              <Segmented
                label="Season"
                layoutId="season-pill"
                value={season}
                onChange={setSeason}
                options={rates.seasons.map((s) => ({
                  id: s.id,
                  label: s.label,
                  icon: s.id === 'winter' ? <Snowflake size={16} /> : <Sun size={16} />,
                  tag: current === s.id ? 'Now' : null,
                }))}
              />
            </div>

            <div className="control">
              <span className="control__label">Stay length</span>
              <Segmented label="Stay length" layoutId="duration-pill" value={duration} onChange={setDuration} options={rates.durations} />
            </div>

            <div className="control">
              <label className="control__label" htmlFor="rig-length"><Ruler size={16} /> RV length</label>
              <div className="rig">
                <div className="rig__readout">
                  <AnimatedNumber value={String(ft)} /><span>{ft >= 45 ? '+ ft' : ' ft'}</span>
                </div>
                <input id="rig-length" type="range" min="15" max="45" value={ft} onChange={(e) => setFt(+e.target.value)}
                  style={{ '--fill': `${((ft - 15) / 30) * 100}%` }} aria-valuetext={`${ft} feet`} />
                <div className="rig__scale"><span>15</span><span>30</span><span>40</span><span>45+</span></div>
                <motion.div className="rig__truck" animate={{ width: `${30 + ((ft - 15) / 30) * 70}%` }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} aria-hidden="true">
                  <svg viewBox="0 0 120 40" preserveAspectRatio="none"><rect x="2" y="4" width="100" height="26" rx="6" /><rect x="102" y="14" width="16" height="16" rx="3" /><circle cx="24" cy="33" r="5" /><circle cx="84" cy="33" r="5" /></svg>
                </motion.div>
              </div>
              <p className="control__hint">
                <Check size={16} /> Best fit: <strong>{rates.siteTypes.find((t) => t.id === rec).short}</strong> ({rates.siteTypes.find((t) => t.id === rec).range})
              </p>
            </div>

            <div className="planner__season-note">
              <AnimatePresence mode="wait">
                <motion.p key={season} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {season === 'winter' ? <Snowflake size={16} /> : <Sun size={16} />} {S.name}: <strong>{S.label}</strong>
                </motion.p>
              </AnimatePresence>
            </div>
          </aside>

          <div className="planner__cards">
            {rates.siteTypes.map((t) => (
              <SiteCard
                key={t.id}
                site={t}
                price={S.prices[duration][t.id]}
                daily={S.prices.daily[t.id]}
                duration={D}
                recommended={t.id === rec}
                maxTotal={maxTotal}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Every rate, one table" title="Rates at a glance">
            <p>The highlighted column follows your selection above.</p>
          </SectionHead>
          <Reveal><Matrix season={season} duration={duration} /></Reveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Good to know" title="Deposits & cancellations" />
          <Stagger className="policy-grid" gap={0.1}>
            {rates.policies.map((p, i) => {
              const Icon = policyIcons[i];
              return (
                <StaggerItem key={p} className="policy">
                  <span className="policy__icon"><Icon size={22} /></span>
                  <p>{p}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal as="p" className="fineprint" delay={0.2}><Info size={14} /> Savings shown are calculated from the published nightly rate for the same season and site.</Reveal>
        </div>
      </section>

      <CtaBand title="Lock in your site" image="2025/10/IMG_6853-1-scaled.jpg" />
    </>
  );
}
