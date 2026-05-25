// ============================================================
// Elite Dine - Footer Component
// ============================================================
import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiArrowUp } from 'react-icons/fi';
import { GiKnifeFork } from 'react-icons/gi';
import './Footer.css';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Menu', href: '#menu' },
  { label: 'Special Offers', href: '#offers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reservations', href: '#reservations' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const OPENING_HOURS = [
  { day: 'Monday – Thursday', hours: '12:00 PM – 10:30 PM' },
  { day: 'Friday', hours: '12:00 PM – 11:00 PM' },
  { day: 'Saturday', hours: '11:00 AM – 11:00 PM' },
  { day: 'Sunday', hours: '11:00 AM – 10:00 PM' },
  { day: 'Public Holidays', hours: '12:00 PM – 9:00 PM' },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      {/* Main Footer Content */}
      <div className="footer__main">
        <div className="container footer__grid">

          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo">
              <GiKnifeFork className="footer__logo-icon" aria-hidden="true" />
              <span className="footer__logo-text">Elite Dine</span>
            </div>
            <p className="footer__tagline">Where Every Meal is a Masterpiece</p>
            <p className="footer__brand-desc">
              Since 2009, Elite Dine has been crafting extraordinary dining experiences
              with world-class cuisine, impeccable service, and an atmosphere of refined elegance.
            </p>

            {/* Contact Info — no location, updated phone & email */}
            <div className="footer__contact-info">
              <a href="tel:+919121613958" className="footer__contact-item">
                <FiPhone aria-hidden="true" />
                <span>+91 91216 13958</span>
              </a>
              <a href="mailto:bhargavichoulkar988@gmail.com" className="footer__contact-item">
                <FiMail aria-hidden="true" />
                <span>bhargavichoulkar988@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h3 className="footer__col-title">Quick Links</h3>
            <ul className="footer__links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="footer__link"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    <span className="footer__link-arrow" aria-hidden="true">›</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="footer__col">
            <h3 className="footer__col-title">Opening Hours</h3>
            <ul className="footer__hours">
              {OPENING_HOURS.map((item, i) => (
                <li key={i} className="footer__hours-item">
                  <span className="footer__hours-day">{item.day}</span>
                  <span className="footer__hours-time">{item.hours}</span>
                </li>
              ))}
            </ul>
            <div className="footer__reservation-cta">
              <p>Ready to dine with us?</p>
              <a
                href="#reservations"
                className="footer__reserve-btn"
                onClick={(e) => handleNavClick(e, '#reservations')}
              >
                Reserve a Table
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Elite Dine Restaurant. All rights reserved.
          </p>
          <p className="footer__credits">
            Crafted with ❤️ for exceptional dining experiences
          </p>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        className="footer__scroll-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <FiArrowUp size={20} aria-hidden="true" />
      </motion.button>
    </footer>
  );
};

export default Footer;
