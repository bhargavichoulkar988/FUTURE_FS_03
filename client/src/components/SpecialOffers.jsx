// ============================================================
// Elite Dine - Special Offers / Featured Combos Section
// ============================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTag, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import './SpecialOffers.css';

const STATIC_OFFERS = [
  {
    _id: 'o1',
    name: 'The Elite Experience',
    description: 'Our signature tasting menu for two: Burrata Caprese + Filet Mignon (2) + Chocolate Lava Cake (2) + Wine pairing. The ultimate dining experience.',
    price: 149.99,
    originalPrice: 185.00,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop',
    badge: 'Most Popular',
    badgeColor: 'gold',
    serves: 2,
    prepTime: 45,
    includes: ['Burrata Caprese', 'Filet Mignon x2', 'Chocolate Lava Cake x2', 'Wine Pairing'],
  },
  {
    _id: 'o2',
    name: 'Date Night Package',
    description: 'Perfect for two: Shrimp Cocktail + Pan-Seared Salmon + Chicken Marsala + Tiramisu (2) + Mocktails (2). Includes complimentary rose.',
    price: 119.99,
    originalPrice: 148.00,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop',
    badge: 'Romantic',
    badgeColor: 'red',
    serves: 2,
    prepTime: 40,
    includes: ['Shrimp Cocktail', 'Pan-Seared Salmon', 'Chicken Marsala', 'Tiramisu x2', 'Mocktails x2', 'Complimentary Rose'],
  },
  {
    _id: 'o3',
    name: 'Family Feast',
    description: 'Designed for 4: Bruschetta + Calamari + 2 Main Courses of choice + 2 Desserts + 4 Fresh Juices. Perfect for family celebrations.',
    price: 189.99,
    originalPrice: 240.00,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop',
    badge: 'Best Value',
    badgeColor: 'green',
    serves: 4,
    prepTime: 50,
    includes: ['Bruschetta', 'Crispy Calamari', '2 Main Courses', '2 Desserts', '4 Fresh Juices'],
  },
  {
    _id: 'o4',
    name: 'Business Lunch Set',
    description: 'Weekday lunch special (12–3 PM): Soup of the day + Main Course + Dessert + Coffee. Efficient, elegant, and satisfying.',
    price: 39.99,
    originalPrice: 55.00,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop',
    badge: 'Weekday Only',
    badgeColor: 'blue',
    serves: 1,
    prepTime: 25,
    includes: ['Soup of the Day', 'Main Course', 'Dessert', 'Coffee or Tea'],
  },
];

const badgeClasses = {
  gold: 'offer-badge--gold',
  red: 'offer-badge--red',
  green: 'offer-badge--green',
  blue: 'offer-badge--blue',
};

const SpecialOffers = () => {
  const [offers, setOffers] = useState(STATIC_OFFERS);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await axios.get('/api/menu?category=Special+Combos&limit=4');
        if (res.data.data?.length > 0) {
          // Merge API data with static badge/includes info
          const merged = res.data.data.map((item, i) => ({
            ...STATIC_OFFERS[i] || {},
            ...item,
          }));
          setOffers(merged);
        }
      } catch {
        // Keep static offers
      }
    };
    fetchCombos();
  }, []);

  const scrollToReservations = () => {
    const el = document.getElementById('reservations');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="offers section" aria-labelledby="offers-title">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Limited Time</span>
          <h2 className="section-title" id="offers-title">Special Offers & Combos</h2>
          <div className="divider" />
          <p className="section-description">
            Curated packages designed for every occasion — from romantic evenings to family celebrations.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="offers__grid">
          {offers.map((offer, i) => {
            const savings = offer.originalPrice
              ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)
              : null;

            return (
              <motion.article
                key={offer._id}
                className="offer-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                {/* Image */}
                <div className="offer-card__img-wrap">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="offer-card__img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop';
                    }}
                  />
                  <div className="offer-card__img-overlay" />
                  {offer.badge && (
                    <span className={`offer-badge ${badgeClasses[offer.badgeColor] || 'offer-badge--gold'}`}>
                      <FiTag size={11} aria-hidden="true" /> {offer.badge}
                    </span>
                  )}
                  {savings && (
                    <span className="offer-savings">Save {savings}%</span>
                  )}
                </div>

                {/* Body */}
                <div className="offer-card__body">
                  <h3 className="offer-card__name">{offer.name}</h3>
                  <p className="offer-card__desc">{offer.description}</p>

                  {/* Includes list */}
                  {offer.includes && (
                    <ul className="offer-card__includes" aria-label="Package includes">
                      {offer.includes.map((item, j) => (
                        <li key={j} className="offer-card__include-item">
                          <span className="offer-card__include-dot" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Meta */}
                  <div className="offer-card__meta">
                    {offer.serves && (
                      <span className="offer-card__meta-item">
                        <FiUsers size={14} aria-hidden="true" />
                        Serves {offer.serves}
                      </span>
                    )}
                    {offer.prepTime && (
                      <span className="offer-card__meta-item">
                        <FiClock size={14} aria-hidden="true" />
                        ~{offer.prepTime} min
                      </span>
                    )}
                  </div>

                  {/* Pricing + CTA */}
                  <div className="offer-card__footer">
                    <div className="offer-card__pricing">
                      <span className="offer-card__price">${offer.price?.toFixed(2)}</span>
                      {offer.originalPrice && (
                        <span className="offer-card__original">${offer.originalPrice?.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      className="offer-card__btn"
                      onClick={scrollToReservations}
                      aria-label={`Book ${offer.name}`}
                    >
                      Book Now <FiArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          className="offers__banner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="offers__banner-content">
            <h3 className="offers__banner-title">Custom Event Planning?</h3>
            <p className="offers__banner-text">
              Planning a corporate dinner, birthday, or wedding reception? 
              Contact us for a bespoke menu tailored to your occasion.
            </p>
          </div>
          <button className="btn-primary" onClick={scrollToReservations}>
            Make a Reservation <FiArrowRight aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffers;
