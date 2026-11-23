import { contact } from '../data/site.js';

// Forms used to post to WordPress (Elementor Forms / WPForms). After the migration they post to a
// form endpoint (e.g. Formspree, Basin, Web3Forms, Netlify function) configured via .env:
//   VITE_CONTACT_FORM_ENDPOINT=...   VITE_POOL_FORM_ENDPOINT=...
// If no endpoint is configured, the visitor's email app opens with the message pre-filled.
export async function submitForm({ endpoint, subject, data }) {
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, ...data }),
    });
    if (!res.ok) throw new Error('Something went wrong sending the form. Please call us at ' + contact.phone + '.');
    return { via: 'endpoint' };
  }
  const body = Object.entries(data)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');
  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { via: 'mailto' };
}

export const endpoints = {
  contact: import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '',
  pool: import.meta.env.VITE_POOL_FORM_ENDPOINT || '',
};
