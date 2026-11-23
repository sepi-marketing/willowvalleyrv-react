import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

// Fade/slide an element in when it scrolls into view.
export function Reveal({ children, as = 'div', delay = 0, y = 40, x = 0, className, amount = 0.2, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Parent + child pair that staggers children into view.
export function Stagger({ children, as = 'div', className, gap = 0.08, amount = 0.15, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function StaggerItem({ children, as = 'div', className, y = 30, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Word-by-word masked headline reveal.
export function SplitText({ text, as = 'h2', className = '', delay = 0, stagger = 0.06, immediate = false }) {
  const M = motion[as] || motion.h2;
  const words = text.split(' ');
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.4 } };
  return (
    <M className={`split ${className}`} initial="hidden" {...trigger} aria-label={text}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="split__mask" aria-hidden="true">
            <motion.span className="split__word" variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease } } }}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </M>
  );
}

// Image/element that drifts vertically as the page scrolls past.
export function Parallax({ children, speed = 0.15, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <div ref={ref} className={`parallax ${className || ''}`}>
      <motion.div className="parallax__inner" style={{ y }}>{children}</motion.div>
    </div>
  );
}

// Animated number for prices/counters. Accepts strings like "$1,100" or "$ 42.85".
export function AnimatedNumber({ value, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const target = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const decimals = (String(value).split('.')[1] || '').replace(/\D/g, '').length;
  const prefix = String(value).trim().startsWith('$') ? '$' : '';
  const [display, setDisplay] = useState(format(target, decimals, prefix));
  const last = useRef(target);

  useEffect(() => {
    if (!inView) return;
    const from = last.current === target ? target * 0.6 : last.current;
    const controls = animate(from, target, {
      duration: 0.9,
      ease,
      onUpdate: (v) => setDisplay(format(v, decimals, prefix)),
    });
    last.current = target;
    return () => controls.stop();
  }, [target, inView, decimals, prefix]);

  return <span ref={ref} className={className}>{display}</span>;
}

function format(v, decimals, prefix) {
  return prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
