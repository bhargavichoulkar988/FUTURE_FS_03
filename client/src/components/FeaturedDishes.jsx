// ============================================================
// Elite Dine - Featured Dishes Component
// Showcases top dishes fetched from the API
// ============================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiArrowRight } from 'react-icons/fi';
import { GiChiliPepper } from 'react-icons/gi';
import axios from 'axios';
import './FeaturedDishes.css';

// Spice level indicator
const SpiceIndicator = ({ level }) => {
  if (level === 0) return null;
  return (
    <div className="spice-indicator" aria-label={`Spice level: ${level} out of 3`}>
      {[...Array(level)].map((_, i) => (
        <GiChiliPepper key={i} className="spice-icon" aria-hidden="true" />
      ))}
    </div>
  );
};

// Tag badge
const Tag = ({ tag }) => {
  const tagColors = {
    vegetarian: 'tag--green',
    vegan: 'tag--green',
    'gluten-free': 'tag--blue',
    seafood: 'tag--blue',
    'for-two': 'tag--gold',
    romantic: 'tag--red',
  };
  return (
    <span className={`tag ${tagColors[tag] || 'tag--default'}`}>
      {tag}
    </span>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const FeaturedDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/menu?featured=true&limit=6');
        setDishes(res.data.data || []);
      } catch {
        // Fallback static data if API is unavailable
        setDishes(FALLBACK_DISHES);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="featured section" aria-labelledby="featured-title">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Chef's Selection</span>
          <h2 className="section-title" id="featured-title">Featured Dishes</h2>
          <div className="divider" />
          <p className="section-description">
            Handpicked by our executive chef — dishes that define the Elite Dine experience.
          </p>
        </motion.div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="featured__grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="featured__card skeleton-card">
                <div className="skeleton featured__card-img-skeleton" />
                <div className="featured__card-body">
                  <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="featured__grid">
            {dishes.map((dish, i) => (
              <motion.article
                key={dish._id || i}
                className="featured__card card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -8 }}
              >
                {/* Image */}
                <div className="featured__card-img-wrap">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="featured__card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop';
                    }}
                  />
                  <div className="featured__card-overlay">
                    <span className="featured__card-category">{dish.category}</span>
                  </div>
                  {dish.tags?.includes('vegetarian') && (
                    <span className="featured__veg-badge" aria-label="Vegetarian">🌿</span>
                  )}
                </div>

                {/* Body */}
                <div className="featured__card-body">
                  <div className="featured__card-header">
                    <h3 className="featured__card-name">{dish.name}</h3>
                    <SpiceIndicator level={dish.spiceLevel} />
                  </div>

                  <p className="featured__card-desc">{dish.description}</p>

                  {/* Tags */}
                  {dish.tags?.length > 0 && (
                    <div className="featured__card-tags">
                      {dish.tags.slice(0, 2).map(tag => <Tag key={tag} tag={tag} />)}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="featured__card-footer">
                    <div className="featured__card-meta">
                      <span className="featured__card-price">${dish.price?.toFixed(2)}</span>
                      {dish.prepTime && (
                        <span className="featured__card-time">
                          <FiClock size={13} aria-hidden="true" />
                          {dish.prepTime} min
                        </span>
                      )}
                    </div>
                    <div className="featured__card-stars" aria-label="5 star rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="star-icon" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* View Full Menu CTA */}
        <motion.div
          className="featured__cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="btn-primary" onClick={scrollToMenu}>
            View Full Menu <FiArrowRight aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Fallback data when API is unavailable
const FALLBACK_DISHES = [
  {
    _id: '1', name: 'Filet Mignon', category: 'Main Course',
    description: 'Prime 8oz beef tenderloin, perfectly seared and finished in herb butter. Served with truffle mashed potatoes.',
    price: 52.99, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&auto=format&fit=crop',
    tags: ['gluten-free'], spiceLevel: 0, prepTime: 30
  },
  {
    _id: '2', name: 'Pan-Seared Salmon', category: 'Main Course',
    description: 'Atlantic salmon fillet with crispy skin, served on a bed of lemon risotto with asparagus.',
    price: 38.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop',
    tags: ['seafood', 'gluten-free'], spiceLevel: 0, prepTime: 25
  },
  {
    _id: '3', name: 'Chocolate Lava Cake', category: 'Desserts',
    description: 'Warm dark chocolate cake with a molten center, served with vanilla bean ice cream.',
    price: 12.99, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
    tags: ['vegetarian'], spiceLevel: 0, prepTime: 15
  },
  {
    _id: '4', name: 'Burrata Caprese', category: 'Starters',
    description: 'Creamy burrata cheese on a bed of heirloom tomatoes, fresh basil, aged balsamic glaze.',
    price: 15.99, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
    tags: ['vegetarian', 'gluten-free'], spiceLevel: 0, prepTime: 8
  },
  {
    _id: '5', name: 'Lobster Linguine', category: 'Main Course',
    description: 'Fresh linguine tossed with butter-poached lobster, cherry tomatoes, garlic, and white wine.',
    price: 58.99, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop',
    tags: ['seafood'], spiceLevel: 0, prepTime: 30
  },
  {
    _id: '6', name: 'Crème Brûlée', category: 'Desserts',
    description: 'Silky vanilla custard with a perfectly caramelized sugar crust. Served with fresh seasonal berries.',
    price: 11.99, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&auto=format&fit=crop',
    tags: ['vegetarian', 'gluten-free'], spiceLevel: 0, prepTime: 10
  },
];

export default FeaturedDishes;
