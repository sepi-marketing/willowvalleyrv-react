import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { nav } from '../data/site.js';

export default function NotFound() {
  return (
    <>
      <PageHero title="Trail not found" image="2025/11/IMG_3746-1-1-scaled.jpg" eyebrow="404" size="sm" />
      <section className="section">
        <div className="container center">
          <p className="lead">This page wandered off into the mountains. Try one of these instead:</p>
          <div className="hero-pills hero-pills--dark">
            {nav.filter((n) => n.to).map((n) => <Link key={n.to} to={n.to} className="pill">{n.text}</Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
