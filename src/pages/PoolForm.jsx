import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, Users, LifeBuoy, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { poolForm } from '../data/content.js';
import { submitForm, endpoints } from '../lib/forms.js';
import PageHero from '../components/PageHero.jsx';
import { Reveal } from '../components/Motion.jsx';
import { Field, SuccessModal } from '../components/FormBits.jsx';

const ackIcons = [LifeBuoy, Users, ShieldAlert];
const empty = { first: '', last: '', email: '', address1: '', address2: '', city: '', state: '', postal: '', acks: [false, false, false] };

export default function PoolForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState(empty);
  const [state, setState] = useState({ sending: false, done: false, via: null, error: '' });
  const set = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggle = (i) => setD((p) => ({ ...p, acks: p.acks.map((a, j) => (j === i ? !a : a)) }));

  const next = (e) => {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) setStep(1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setState({ sending: true, done: false, via: null, error: '' });
    try {
      const r = await submitForm({
        endpoint: endpoints.pool,
        subject: 'Swimming Pool Use Waiver Form – Willow Valley RV Resort',
        data: {
          Name: `${d.first} ${d.last}`,
          Email: d.email,
          Address: [d.address1, d.address2, d.city, d.state, d.postal].filter(Boolean).join(', '),
          ...Object.fromEntries(poolForm.acknowledgements.map((a, i) => [a, d.acks[i] ? poolForm.ackLabel : '—'])),
        },
      });
      setState({ sending: false, done: true, via: r.via, error: '' });
      setD(empty);
      setStep(0);
    } catch (err) {
      setState({ sending: false, done: false, via: null, error: err.message });
    }
  };

  return (
    <>
      <PageHero title="Pool Use Form" image="2023/06/Image-8.jpg" eyebrow="Willow Valley RV Resort Pool Membership Form" size="sm" />
      <section className="section">
        <div className="container pool">
          <Reveal className="pool__card">
            <h2 className="h2 pool__title">{poolForm.title}</h2>
            <ol className="steps" aria-label="Form progress">
              {['Your details', 'Pool acknowledgements'].map((s, i) => (
                <li key={s} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                  <span>{i < step ? <Check size={14} /> : i + 1}</span>{s}
                </li>
              ))}
              <motion.span className="steps__bar" animate={{ scaleX: step === 0 ? 0.5 : 1 }} />
            </ol>

            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.form key="s0" className="form" onSubmit={next} noValidate={false}
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                  <fieldset>
                    <legend>Name *</legend>
                    <div className="form__row">
                      <Field label="First" name="first" required value={d.first} onChange={set} autoComplete="given-name" />
                      <Field label="Last" name="last" required value={d.last} onChange={set} autoComplete="family-name" />
                    </div>
                  </fieldset>
                  <Field label="Email" name="email" type="email" required value={d.email} onChange={set} autoComplete="email" />
                  <fieldset>
                    <legend>Address</legend>
                    <Field label="Address Line 1" name="address1" value={d.address1} onChange={set} autoComplete="address-line1" />
                    <Field label="Address Line 2" name="address2" value={d.address2} onChange={set} autoComplete="address-line2" />
                    <div className="form__row form__row--3">
                      <Field label="City" name="city" value={d.city} onChange={set} autoComplete="address-level2" />
                      <Field label="State" name="state" type="select" value={d.state} onChange={set} autoComplete="address-level1">
                        <option value="">--- Select state ---</option>
                        {poolForm.states.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Field>
                      <Field label="Zip Code" name="postal" value={d.postal} onChange={set} autoComplete="postal-code" />
                    </div>
                  </fieldset>
                  <button className="btn btn--forest btn--lg" type="submit">Continue <ArrowRight size={18} /></button>
                </motion.form>
              ) : (
                <motion.form key="s1" className="form" onSubmit={submit}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35 }}>
                  <div className="acks">
                    {poolForm.acknowledgements.map((a, i) => {
                      const Icon = ackIcons[i];
                      return (
                        <label key={a} className={`ack ${d.acks[i] ? 'is-checked' : ''}`}>
                          <input type="checkbox" checked={d.acks[i]} onChange={() => toggle(i)} />
                          <span className="ack__icon"><Icon size={22} /></span>
                          <span className="ack__text"><strong>{a}</strong><span>{poolForm.ackLabel}</span></span>
                          <span className="ack__box">
                            <motion.span initial={false} animate={{ scale: d.acks[i] ? 1 : 0 }}><Check size={16} /></motion.span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {state.error && <p className="form__error" role="alert">{state.error}</p>}
                  <div className="form__actions">
                    <button type="button" className="btn btn--outline" onClick={() => setStep(0)}><ArrowLeft size={18} /> Back</button>
                    <button className="btn btn--ember btn--lg" type="submit" disabled={state.sending}>{state.sending ? 'Sending…' : poolForm.submit}</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
      <SuccessModal open={state.done} via={state.via} onClose={() => setState((s) => ({ ...s, done: false }))} title="Waiver ready!" />
    </>
  );
}
