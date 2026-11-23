// Global site facts — migrated verbatim from willowvalleyrv.com header & footer.
export const BOOK_URL = 'https://willow.bookmysites.com/reservations/checkout-availability';
export const VIRTUAL_TOUR_URL = 'https://willowvalley.campgroundvirtualtour.com/';
export const TRIPADVISOR_ICON = true;

export const contact = {
  name: 'Willow Valley RV Resort',
  phone: '706-746-0078',
  phoneHref: 'tel:7067460078',
  email: 'willowvalleyrvresort@gmail.com',
  address: '323 Yorkhouse Road Rabun Gap, GA 30568',
  addressLines: ['323 Yorkhouse Road', 'Rabun Gap, GA 30568'],
  mapSrc:
    'https://maps.google.com/maps?q=323%20Yorkhouse%20Road%20Rabun%20Gap%2C%20GA%2030568&t=m&z=10&output=embed&iwloc=near',
  mapSrcFull:
    'https://maps.google.com/maps?q=323%20Yorkhouse%20Road%20Rd%2C%20Rabun%20Gap%2C%20GA%2030568-2428&t=m&z=10&output=embed&iwloc=near',
  mapTitle: '323 Yorkhouse Road Rabun Gap, GA 30568',
  directionsHref: 'https://www.google.com/maps/dir/?api=1&destination=323+Yorkhouse+Road+Rabun+Gap+GA+30568',
};

export const copyright =
  'Copyright © 2025 Willow Valley Resort Park. All rights reserved. Website Design & Marketing by SEPI Marketing';

// Main menu, same order and URLs as the WordPress nav.
export const nav = [
  { text: 'About Us', to: '/about-us/' },
  { text: 'Amenities', to: '/amenities/' },
  { text: 'Rates', to: '/rates/' },
  { text: 'RV Rentals', to: '/rv-rentals/' },
  { text: 'Rules', to: '/rules/' },
  { text: 'Local Attractions', to: '/local-attractions/' },
  { text: 'Park Map', to: '/park-map/' },
  { text: 'Upcoming Events', to: '/upcoming-events/' },
  { text: 'Gallery', to: '/gallery-2/' },
  { text: 'Drone Video', to: '/drone-video/' },
  { text: 'Customer Reviews', to: '/customer-reviews/' },
  { text: 'Pool Use Form', to: '/willow-valley-rv-resort-pool-membership-form/' },
  { text: 'Virtual Tour', href: VIRTUAL_TOUR_URL },
  { text: 'Contact Us', to: '/contact-us/' },
];

// Short list shown inline in the desktop header; the full menu lives in the overlay.
export const primaryNav = ['/about-us/', '/amenities/', '/rates/', '/rv-rentals/', '/gallery-2/', '/contact-us/'];
