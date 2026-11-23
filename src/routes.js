// Every URL from the WordPress sitemap, with its original <title>. Used by the router, SEO tags and prerender.
import { eventPages, stubPages } from './data/content.js';

const SITE = 'Willow Valley RV';
const t = (name) => `${name} – ${SITE}`;

export const DEFAULT_DESCRIPTION =
  'Willow Valley RV Resort is Northeast Ga’s luxurious campground with 58 full hook-up sites in the Blue Ridge Mountains — 2 hours north of Atlanta and 2 hours south of Asheville, NC.';

export const routes = [
  { path: '/', page: 'home', title: 'Willow Valley RV – Campgrounds In Dillard Georgia' },
  { path: '/about-us/', page: 'about', title: t('About Us') },
  { path: '/amenities/', page: 'amenities', title: t('Amenities') },
  { path: '/rates/', page: 'rates', title: t('Rates') },
  { path: '/rv-rentals/', page: 'rentals', title: t('RV Rentals') },
  { path: '/rules/', page: 'rules', title: t('Rules') },
  { path: '/local-attractions/', page: 'attractions', title: t('Local Attractions') },
  { path: '/park-map/', page: 'map', title: t('Park Map') },
  { path: '/upcoming-events/', page: 'events', title: t('Upcoming Events') },
  { path: '/calendar/', page: 'calendar', title: t('Calendar') },
  { path: '/gallery-2/', page: 'gallery', title: t('Gallery') },
  { path: '/drone-video/', page: 'drone', title: t('Drone Video') },
  { path: '/customer-reviews/', page: 'reviews', title: t('Customer Reviews') },
  { path: '/willow-valley-rv-resort-pool-membership-form/', page: 'pool', title: t('Willow Valley RV Resort Pool Membership Form') },
  { path: '/contact-us/', page: 'contact', title: t('Contact Us') },
  ...eventPages.map((e) => ({ path: e.path, page: 'event', title: t(e.title), event: e.key })),
  ...stubPages.map((s) => ({ path: s.path, page: 'stub', title: t(s.title), stub: s.path })),
  // WordPress placeholder pages: keep the URLs alive but send visitors home.
  { path: '/sample-page/', page: 'redirect', to: '/', title: t('Sample Page') },
  { path: '/test/', page: 'redirect', to: '/', title: t('test') },
];

export const findRoute = (pathname) => {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return routes.find((r) => r.path === p);
};
