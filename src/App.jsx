import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { routes, findRoute } from './routes.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileDock from './components/MobileDock.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import { scrollToTop } from './lib/lenis.js';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Amenities from './pages/Amenities.jsx';
import Rates from './pages/Rates.jsx';
import RvRentals from './pages/RvRentals.jsx';
import Rules from './pages/Rules.jsx';
import LocalAttractions from './pages/LocalAttractions.jsx';
import ParkMap from './pages/ParkMap.jsx';
import UpcomingEvents from './pages/UpcomingEvents.jsx';
import Gallery from './pages/Gallery.jsx';
import EventGallery from './pages/EventGallery.jsx';
import DroneVideo from './pages/DroneVideo.jsx';
import CustomerReviews from './pages/CustomerReviews.jsx';
import PoolForm from './pages/PoolForm.jsx';
import Contact from './pages/Contact.jsx';
import StubPage from './pages/StubPage.jsx';
import NotFound from './pages/NotFound.jsx';

function pageFor(r) {
  switch (r.page) {
    case 'home': return <Home />;
    case 'about': return <About />;
    case 'amenities': return <Amenities />;
    case 'rates': return <Rates />;
    case 'rentals': return <RvRentals />;
    case 'rules': return <Rules />;
    case 'attractions': return <LocalAttractions />;
    case 'map': return <ParkMap />;
    case 'events': return <UpcomingEvents />;
    case 'calendar': return <UpcomingEvents calendar />;
    case 'gallery': return <Gallery />;
    case 'event': return <EventGallery eventKey={r.event} />;
    case 'drone': return <DroneVideo />;
    case 'reviews': return <CustomerReviews />;
    case 'pool': return <PoolForm />;
    case 'contact': return <Contact />;
    case 'stub': return <StubPage path={r.stub} />;
    case 'redirect': return <Navigate to={r.to} replace />;
    default: return <NotFound />;
  }
}

function Page({ children }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  const route = findRoute(location.pathname);

  useEffect(() => {
    if (typeof document !== 'undefined') document.title = route?.title || 'Page not found – Willow Valley RV';
  }, [route]);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollProgress />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollToTop(true)}>
        <Routes location={location} key={location.pathname}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={<Page>{pageFor(r)}</Page>} />
          ))}
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <MobileDock />
    </MotionConfig>
  );
}
