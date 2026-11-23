import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';
import { contactPage } from '../data/content.js';
import { contact } from '../data/site.js';
import { submitForm, endpoints } from '../lib/forms.js';
import PageHero from '../components/PageHero.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { SectionHead, MapEmbed } from '../components/Bits.jsx';
import { Field, SuccessModal } from '../components/FormBits.jsx';

export default function Contact() {
  const [data, setData] = useState({ name: '', email: '', phone: '', message: '' });
  const [state, setState] = useState({ sending: false, done: false, via: null, error: '' });
  const set = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ sending: true, done: false, via: null, error: '' });
    try {
      const r = await submitForm({
        endpoint: endpoints.contact,
        subject: 'Website contact form – Willow Valley RV Resort',
        data: { 'Full Name': data.name, Email: data.email, Phone: data.phone, Message: data.message },
      });
      setState({ sending: false, done: true, via: r.via, error: '' });
      setData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setState({ sending: false, done: false, via: null, error: err.message });
    }
  };

  return (
    <>
      <PageHero title={contactPage.title} image="2025/12/IMG_6442-1-scaled.jpg" eyebrow="We’d love to hear from you" />

      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-form-card" x={-30} y={0}>
            <h2 className="h3">Send us a message</h2>
            <form onSubmit={onSubmit} className="form">
              {contactPage.form.fields.map((f) => (
                <Field key={f.name} {...f} value={data[f.name]} onChange={set} autoComplete={f.name === 'name' ? 'name' : f.name} />
              ))}
              {state.error && <p className="form__error" role="alert">{state.error}</p>}
              <button className="btn btn--ember btn--lg" type="submit" disabled={state.sending}>
                {state.sending ? 'Sending…' : contactPage.form.submit} <Send size={18} />
              </button>
            </form>
          </Reveal>

          <div className="contact-side">
            <Stagger className="contact-cards" gap={0.1}>
              <StaggerItem><a className="contact-card" href={contact.phoneHref}><Phone size={20} /><span>Call</span><strong>{contact.phone}</strong></a></StaggerItem>
              <StaggerItem><a className="contact-card" href={`mailto:${contact.email}`}><Mail size={20} /><span>Email</span><strong>{contact.email}</strong></a></StaggerItem>
            </Stagger>

            <Reveal className="info-card">
              <h2 className="h4"><Clock size={18} /> {contactPage.checkInTitle}</h2>
              <ul className="dot-list">{contactPage.checkIn.map((c) => <li key={c}>{c}</li>)}</ul>
            </Reveal>

            <Reveal className="info-card" delay={0.1}>
              <h2 className="h4">{contactPage.aboutTitle}</h2>
              {contactPage.about.map((p) => <p key={p}><em>{p}</em></p>)}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container contact-map">
          <div className="contact-map__card">
            <SectionHead eyebrow="Find us" title={contactPage.addressTitle} />
            <Reveal className="address">
              <strong>{contact.name}</strong>
              <p>{contact.addressLines[0]}<br />{contact.addressLines[1]}<br />
                <a href="tel:706-746-0078">{contact.phone}</a><br />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <a className="btn btn--forest" href={contact.directionsHref} target="_blank" rel="noopener"><MapPin size={16} /> Get directions</a>
            </Reveal>
          </div>
          <Reveal className="contact-map__map" delay={0.1}>
            <MapEmbed src={contact.mapSrcFull} title="323 Yorkhouse Road Rd, Rabun Gap, GA 30568-2428" />
          </Reveal>
        </div>
      </section>

      <SuccessModal open={state.done} via={state.via} onClose={() => setState((s) => ({ ...s, done: false }))} title="Message ready!" />
    </>
  );
}
