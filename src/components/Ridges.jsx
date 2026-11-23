import React from 'react';

// Layered Blue Ridge silhouette used as a section divider.
export default function Ridges({ className = '', flip = false }) {
  return (
    <svg className={`ridges ${className}`} viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true" style={flip ? { transform: 'scaleY(-1)' } : undefined}>
      <path className="ridges__back" d="M0 92 L90 58 L170 80 L260 34 L350 70 L430 46 L520 84 L610 30 L700 66 L790 44 L880 78 L980 26 L1070 64 L1160 40 L1250 74 L1350 38 L1440 62 L1440 160 L0 160 Z" />
      <path className="ridges__mid" d="M0 118 L110 86 L210 108 L320 72 L420 102 L520 80 L640 112 L740 76 L850 104 L960 70 L1080 106 L1190 82 L1300 110 L1440 84 L1440 160 L0 160 Z" />
      <path className="ridges__front" d="M0 140 L140 120 L260 136 L400 112 L540 134 L680 116 L820 138 L960 114 L1100 136 L1240 118 L1360 134 L1440 124 L1440 160 L0 160 Z" />
    </svg>
  );
}
