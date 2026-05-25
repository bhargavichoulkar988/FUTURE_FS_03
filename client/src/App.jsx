// ============================================================
// Elite Dine - Main App Component
// Sets up routing, theme, and renders all page sections
// ============================================================
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// Import all components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedDishes from './components/FeaturedDishes';
import About from './components/About';
import Menu from './components/Menu';
import SpecialOffers from './components/SpecialOffers';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    // ThemeProvider wraps everything to provide dark/light theme
    <ThemeProvider>
      <Router>
        {/* Toast notifications for form submissions */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#C9A84C',
                secondary: '#1a1a1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#8B0000',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Sticky navigation bar */}
        <Navbar />

        {/* Main content - all sections on single page */}
        <main>
          {/* Hero section - full screen landing */}
          <section id="home">
            <Hero />
          </section>

          {/* Featured dishes showcase */}
          <section id="featured">
            <FeaturedDishes />
          </section>

          {/* About the restaurant */}
          <section id="about">
            <About />
          </section>

          {/* Full interactive menu */}
          <section id="menu">
            <Menu />
          </section>

          {/* Special combo offers */}
          <section id="offers">
            <SpecialOffers />
          </section>

          {/* Photo gallery */}
          <section id="gallery">
            <Gallery />
          </section>

          {/* Table reservation form */}
          <section id="reservations">
            <Reservation />
          </section>

          {/* Customer testimonials */}
          <section id="testimonials">
            <Testimonials />
          </section>

          {/* Contact form and info */}
          <section id="contact">
            <Contact />
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
