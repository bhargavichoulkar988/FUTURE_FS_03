// ============================================================
// Elite Dine - Hero Section
// Full-screen landing section with animated entrance
// ============================================================
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { GiKnifeFork } from 'react-icons/gi';
import './Hero.css';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const Hero = () => {
  // Smooth scroll to reservations section
  const scrollToReservations = (e) => {
    e.preventDefault();
    const el = document.getElementById('reservations');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Smooth scroll to menu section
  const scrollToMenu = (e) => {
    e.preventDefault();
    const el = document.getElementById('menu');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Scroll down arrow handler
  const scrollDown = () => {
    const el = document.getElementById('featured');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="hero" role="banner">
      {/* Background image with overlay */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&auto=format&fit=crop&q=80"
          alt=""
          className="hero__bg-image"
          loading="eager"
        />
        <div className="hero__overlay" />
      </div>

      {/* Decorative pattern overlay */}
      <div className="hero__pattern" aria-hidden="true" />

      {/* Main content */}
      <motion.div
        className="hero__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top badge */}
        <motion.div className="hero__badge" variants={itemVariants}>
          <GiKnifeFork aria-hidden="true" />
          <span>Fine Dining Experience</span>
          <GiKnifeFork aria-hidden="true" />
        </motion.div>

        {/* Main heading */}
        <motion.h1 className="hero__title" variants={itemVariants}>
          Welcome to{' '}
          <span className="hero__title-highlight">Elite Dine</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p className="hero__tagline" variants={itemVariants}>
          Where Every Meal is a Masterpiece
        </motion.p>

        {/* Description */}
        <motion.p className="hero__description" variants={itemVariants}>
          Indulge in an extraordinary culinary journey where world-class cuisine
          meets impeccable service in an atmosphere of refined elegance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="hero__buttons" variants={itemVariants}>
          <button
            className="hero__btn hero__btn--primary"
            onClick={scrollToReservations}
            aria-label="Reserve a table at Elite Dine"
          >
            Reserve a Table
          </button>
          <button
            className="hero__btn hero__btn--outline"
            onClick={scrollToMenu}
            aria-label="View our menu"
          >
            View Menu
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div className="hero__stats" variants={itemVariants} aria-label="Restaurant highlights">
          <div className="hero__stat">
            <span className="hero__stat-number">15+</span>
            <span className="hero__stat-label">Years of Excellence</span>
          </div>
          <div className="hero__stat-divider" aria-hidden="true" />
          <div className="hero__stat">
            <span className="hero__stat-number">50K+</span>
            <span className="hero__stat-label">Happy Guests</span>
          </div>
          <div className="hero__stat-divider" aria-hidden="true" />
          <div className="hero__stat">
            <span className="hero__stat-number">120+</span>
            <span className="hero__stat-label">Menu Items</span>
          </div>
          <div className="hero__stat-divider" aria-hidden="true" />
          <div className="hero__stat">
            <span className="hero__stat-number">8</span>
            <span className="hero__stat-label">Awards Won</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll down indicator */}
      <motion.button
        className="hero__scroll-down"
        onClick={scrollDown}
        aria-label="Scroll down to see more"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <FiArrowDown size={24} aria-hidden="true" />
        </motion.span>
      </motion.button>
    </div>
  );
};

export default Hero;
