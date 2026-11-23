import React from 'react';
import {
  CircleParking, Waves, Music, FerrisWheel, Wifi, Footprints, PawPrint, Mountain, BookOpen, Tv, Flame,
  Droplets, WashingMachine, Dices, Bath, Dog, ShowerHead, Store,
} from 'lucide-react';

const Basketball = (p) => (
  <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="none" stroke="currentColor" strokeWidth={p.strokeWidth || 1.6} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2v20" /><path d="M4.9 4.9c3.5 3 3.5 11.2 0 14.2M19.1 4.9c-3.5 3-3.5 11.2 0 14.2" />
  </svg>
);
const Soccer = (p) => (
  <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="none" stroke="currentColor" strokeWidth={p.strokeWidth || 1.6} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="m12 7 4 3-1.5 4.5h-5L8 10z" /><path d="M12 7V2.5M16 10l4.5-1.5M14.5 14.5l3 3.5M9.5 14.5l-3 3.5M8 10 3.5 8.5" />
  </svg>
);

const map = {
  parking: CircleParking, pool: Waves, music: Music, playground: FerrisWheel, wifi: Wifi, hiking: Footprints,
  pets: PawPrint, mountain: Mountain, books: BookOpen, tv: Tv, fire: Flame, water: Droplets, laundry: WashingMachine,
  basketball: Basketball, games: Dices, bath: Bath, dog: Dog, soccer: Soccer, splash: ShowerHead, pavilion: Store,
};

export default function AmenityIcon({ name, size = 26 }) {
  const I = map[name] || Mountain;
  return <I size={size} strokeWidth={1.6} aria-hidden="true" />;
}
