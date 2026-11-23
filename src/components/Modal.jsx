import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { lockScroll } from '../lib/lenis.js';

// Accessible animated dialog rendered into <body>.
export default function Modal({ open, onClose, children, label = 'Dialog', variant = 'panel', className = '' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false); };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`modal modal--${variant}`}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
          data-lenis-prevent
        >
          <div className="modal__backdrop" onClick={onClose} />
          <motion.div
            className={`modal__body ${className}`}
            initial={variant === 'sheet' ? { y: '100%' } : { opacity: 0, y: 40, scale: 0.96 }}
            animate={variant === 'sheet' ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={variant === 'sheet' ? { y: '100%' } : { opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="modal__close" onClick={onClose} aria-label="Close"><X size={20} /></button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
