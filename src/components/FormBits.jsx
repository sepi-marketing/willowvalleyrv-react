import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Modal from './Modal.jsx';

// Floating-label input.
export function Field({ label, name, type = 'text', required, value, onChange, autoComplete, children, className = '' }) {
  const id = `f-${name}`;
  const common = { id, name, required, value, onChange, autoComplete, placeholder: ' ' };
  return (
    <div className={`field ${type === 'textarea' ? 'field--area' : ''} ${className}`}>
      {type === 'textarea' ? <textarea rows={5} {...common} /> : type === 'select' ? <select {...common}>{children}</select> : <input type={type} {...common} />}
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    </div>
  );
}

export function SuccessModal({ open, onClose, title, via }) {
  return (
    <Modal open={open} onClose={onClose} label={title} className="success-modal">
      <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}>
        <CheckCircle2 size={64} className="success-modal__icon" />
      </motion.div>
      <h2 className="h3">{title}</h2>
      <p>
        {via === 'mailto'
          ? 'Your email app has opened with your message ready — just press send.'
          : 'Thank you! We received your submission and will be in touch soon.'}
      </p>
      <button className="btn btn--forest" onClick={onClose}>Close</button>
    </Modal>
  );
}
