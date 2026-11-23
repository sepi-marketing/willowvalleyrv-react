import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Clock, Snowflake, ThermometerSnowflake, Plus, ChevronLeft, ChevronRight, Quote, Play } from 'lucide-react';
import { home, reviews } from '../data/content.js';
import { BOOK_URL, contact } from '../data/site.js';
import { gallery, img, mediaSrc } from '../lib/media.js';
import Img from '../components/Img.jsx';
import Ridges from '../components/Ridges.jsx';
import Lottie from '../components/Lottie.jsx';
import Lightbox from '../components/Lightbox.jsx';
import AmenityIcon from '../components/AmenityIcon.jsx';
import { Reveal, SplitText, Stagger, StaggerItem, Parallax } from '../components/Motion.jsx';
import { Stars, SectionHead, MapEmbed } from '../components/Bits.jsx';

const heroSlides = gallery('homeHero');

function Hero() {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero__media" style={{ scale: mediaScale }}>
        <AnimatePresence initial={false}>
          <motion.div key={heroSlides[i]} className="hero__slide"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6, ease: 'easeInOut' }}>
            <Img k={heroSlides[i]} alt="" eager={i === 0} cover sizes="100vw" className="kenburns" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="hero__shade" />

      <motion.div className="container hero__content" style={{ y: contentY, opacity: contentO }}>
        <motion.p className="eyebrow eyebrow--light" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          Blue Ridge Mountains · Northeast Georgia
        </motion.p>
        <SplitText as="h1" className="hero__title" text={home.heroTitle} immediate delay={0.35} stagger={0.09} />
        <SplitText as="p" className="hero__subtitle" text={home.heroSubtitle} immediate delay={0.75} stagger={0.05} />
        <motion.div className="hero__actions" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }}>
          <a className="btn btn--ember btn--lg" href={BOOK_URL} target="_blank" rel="noopener">{home.bookLabel}</a>
          <Link className="btn btn--ghost-light btn--lg" to="/rates/">See Rates <ArrowRight size={18} /></Link>
        </motion.div>
        <div className="hero__pager" aria-hidden="true">
          {heroSlides.map((k, n) => (
            <button key={k} className={n === i ? 'is-active' : ''} onClick={() => setI(n)} tabIndex={-1}>
              <span style={{ animationDuration: n === i ? '6.5s' : '0s' }} />
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div className="hero__hours glass" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.8 }}>
        <Clock size={18} />
        <div>
          <strong>Office Hours</strong>
          <span>{home.notices[0]}</span>
        </div>
      </motion.div>

      <a href="#welcome" className="hero__scroll" aria-label="Scroll to content"><ArrowDown size={18} /></a>
      <Ridges className="hero__ridges" />
    </section>
  );
}

function Marquee() {
  const facts = ['58 full hook-up sites', '30/50 AMPs', 'Blue Ridge Mountains', '2 hours north of Atlanta, Ga.', '2 hours south of Asheville, NC', '4 distinct seasons', 'Lake Burton · Lake Rabun · Lake Seed'];
  const row = [...facts, ...facts];
  return (
    <div className="marquee" aria-label={facts.join(', ')}>
      <div className="marquee__track" aria-hidden="true">
        {row.map((f, i) => <span key={i}>{f}<i>✦</i></span>)}
      </div>
    </div>
  );
}

function Welcome() {
  const collage = gallery('homeCarousel');
  return (
    <section id="welcome" className="section welcome">
      <div className="container welcome__grid">
        <div className="welcome__copy">
          <Reveal as="p" className="eyebrow" y={16}>Willow Valley RV Resort</Reveal>
          <SplitText as="h2" className="display" text={home.welcome} />
          <Stagger className="notice-list" gap={0.12}>
            <StaggerItem className="notice">
              <span className="notice__icon"><Clock size={20} /></span>
              <p>{home.notices[0]}</p>
            </StaggerItem>
            <StaggerItem className="notice notice--alert">
              <span className="notice__icon"><ThermometerSnowflake size={20} /></span>
              <p>{home.notices[1]}</p>
            </StaggerItem>
            <StaggerItem className="notice notice--winter">
              <Lottie k="2022/12/winter-holidays-1.json" className="notice__lottie" />
              <div>
                <h3><Snowflake size={16} /> {home.winter.title}</h3>
                <p>{home.winter.lines[0]}<br />{home.winter.lines[1]}</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
        <div className="welcome__collage">
          <Parallax speed={0.08} className="welcome__img welcome__img--a"><Img k={collage[2]} alt="Splash pad and playground at Willow Valley RV Resort" cover /></Parallax>
          <Parallax speed={0.18} className="welcome__img welcome__img--b"><Img k={collage[0]} alt="Evening fire pit by the pavilion" cover /></Parallax>
          <Parallax speed={0.12} className="welcome__img welcome__img--c"><Img k={collage[4]} alt="Mountain sunset over the campground" cover /></Parallax>
          <motion.div className="welcome__badge" initial={{ rotate: -20, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120 }}>
            <strong>5.0</strong><span>Guest rating</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Desktop: vertical scroll drives a pinned horizontal filmstrip. Mobile: native swipe.
function Filmstrip() {
  const items = gallery('homeCarousel');
  const ref = useRef(null);
  const [index, setIndex] = useState(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-58%']);
  return (
    <section ref={ref} className="filmstrip">
      <div className="filmstrip__sticky">
        <div className="container filmstrip__head">
          <SectionHead eyebrow="Life at the resort" title="Days by the river, nights by the fire" light />
        </div>
        <motion.div className="filmstrip__track" style={{ x }}>
          {items.map((k, n) => (
            <button key={k} className={`filmstrip__frame filmstrip__frame--${n % 3}`} onClick={() => setIndex(n)} aria-label={`Open photo ${n + 1}`}>
              <Img k={k} alt={`Willow Valley RV Resort photo ${n + 1}`} cover sizes="(max-width: 760px) 80vw, 40vw" />
              <span className="filmstrip__num">{String(n + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </motion.div>
      </div>
      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} title="Willow Valley RV Resort" />
    </section>
  );
}

function Amenities() {
  return (
    <section className="section amenities-home">
      <div className="container">
        <div className="split-head">
          <SectionHead eyebrow="Everything you need" title={home.amenitiesTitle} />
          <Reveal delay={0.2}>
            <Link className="btn btn--outline" to="/amenities/">All Amenities <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
        <Stagger className="amenity-grid" gap={0.06}>
          {home.amenities.map((a) => (
            <StaggerItem key={a.text} className="amenity-tile">
              <span className="amenity-tile__icon"><AmenityIcon name={a.icon} /></span>
              <h3>{a.text}</h3>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Reviews() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  useEffect(() => {
    const t = setInterval(() => { setDir(1); setI((n) => (n + 1) % reviews.length); }, 9000);
    return () => clearInterval(t);
  }, [i]);
  const r = reviews[i];
  const go = (d) => { setDir(d); setI((n) => (n + d + reviews.length) % reviews.length); };
  return (
    <section className="section reviews-home">
      <div className="container reviews-home__grid">
        <div className="reviews-home__score">
          <Reveal as="p" className="eyebrow eyebrow--light">Tripadvisor</Reveal>
          <SplitText as="h2" className="display display--light" text={home.reviewsTitle} />
          <Reveal className="score" delay={0.1}>
            <span className="score__num">{home.rating}</span>
            <Stars size={22} />
          </Reveal>
          <Reveal delay={0.2}>
            <Link className="btn btn--ghost-light" to="/customer-reviews/">Reviews <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
        <div className="testimonial">
          <Quote className="testimonial__quote" size={64} aria-hidden="true" />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure key={i} className="testimonial__card"
              initial={{ opacity: 0, x: dir * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <h3 className="testimonial__title">{r.homeTitle || r.title}</h3>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <img src={img(r.homeImage).sm} alt="" width="56" height="56" loading="lazy" />
                <span><strong>{r.name}</strong><Stars size={14} /></span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="testimonial__nav">
            <button onClick={() => go(-1)} aria-label="Previous review"><ChevronLeft size={20} /></button>
            <span>{i + 1} / {reviews.length}</span>
            <button onClick={() => go(1)} aria-label="Next review"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationNews() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section location">
      <div className="container location__grid">
        <Reveal className="location__map" x={-30} y={0}>
          <MapEmbed src={contact.mapSrc} title={contact.mapTitle} />
          <a className="location__pin glass" href={contact.directionsHref} target="_blank" rel="noopener">
            <strong>Get directions</strong><span>{contact.address}</span>
          </a>
        </Reveal>
        <div className="location__copy">
          <Reveal className="location__news-img"><Img k={home.newsImage} alt="Campground news" /></Reveal>
          <Reveal as="p" className="lead" delay={0.1}>{home.locationText}</Reveal>
          <div className="accordion">
            {home.news.map((n, idx) => (
              <Reveal key={n.title} className={`accordion__item ${open === idx ? 'is-open' : ''}`} delay={idx * 0.05} y={20}>
                <button className="accordion__head" onClick={() => setOpen(open === idx ? -1 : idx)} aria-expanded={open === idx}>
                  <span>{n.title}</span>
                  <motion.span animate={{ rotate: open === idx ? 45 : 0 }}><Plus size={20} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === idx && (
                    <motion.div className="accordion__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                      <div>{n.body.map((p) => <p key={p}>{p}</p>)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Video({ k, n }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  return (
    <Reveal className="video-card" delay={n * 0.1}>
      <video ref={ref} src={`${mediaSrc(k)}#t=0.5`} controls={playing} preload="metadata" playsInline controlsList="nodownload"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {!playing && (
        <button className="video-card__play" onClick={() => { ref.current?.play(); setPlaying(true); }} aria-label={`Play video ${n + 1}`}>
          <span><Play size={28} fill="currentColor" /></span>
        </button>
      )}
    </Reveal>
  );
}

function Videos() {
  return (
    <section className="section videos">
      <div className="container">
        <SectionHead eyebrow="See it for yourself" title="Willow Valley in motion" align="center" />
        <div className="videos__grid">
          {home.videos.map((k, n) => <Video key={k} k={k} n={n} />)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Welcome />
      <Filmstrip />
      <Amenities />
      <Reviews />
      <LocationNews />
      <Videos />
    </>
  );
}
