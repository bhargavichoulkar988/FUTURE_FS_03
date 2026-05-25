// ============================================================
// Elite Dine - Customer Testimonials / Reviews Section
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Food Critic, City Magazine',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
    rating: 5,
    review: 'Elite Dine is simply extraordinary. The Filet Mignon was cooked to absolute perfection — a masterclass in technique. The ambiance is sophisticated yet warm, and the service is impeccable. This is fine dining at its finest.',
    date: 'November 2024',
  },
  {
    id: 2,
    name: 'James & Emily Chen',
    role: 'Anniversary Dinner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
    rating: 5,
    review: 'We celebrated our 10th anniversary here and it was absolutely magical. The Date Night Package was perfect — every course was a revelation. The staff remembered our anniversary and surprised us with a complimentary dessert. We will be back every year!',
    date: 'October 2024',
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    role: 'Regular Guest',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop',
    rating: 5,
    review: 'I have dined at Elite Dine over 20 times and it never disappoints. The Lobster Linguine is my absolute favorite — rich, indulgent, and perfectly balanced. Chef Marco\'s passion for food is evident in every single dish.',
    date: 'December 2024',
  },
  {
    id: 4,
    name: 'Robert Thompson',
    role: 'Business Dinner Host',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
    rating: 5,
    review: 'I regularly host business dinners at Elite Dine and it never fails to impress my clients. The private dining room is exceptional, the wine selection is world-class, and the service is always professional and discreet.',
    date: 'September 2024',
  },
  {
    id: 5,
    name: 'Maria Gonzalez',
    role: 'Birthday Celebration',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop',
    rating: 5,
    review: 'Celebrated my 30th birthday here with the Family Feast package. The food was outstanding — every dish was beautifully presented and bursting with flavor. The Chocolate Lava Cake was the highlight of the evening. Absolutely unforgettable!',
    date: 'August 2024',
  },
  {
    id: 6,
    name: 'David & Lisa Park',
    role: 'First-time Visitors',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
    rating: 5,
    review: 'We visited Elite Dine for the first time last month and were completely blown away. From the moment we walked in, the atmosphere was magical. The Burrata Caprese was the best we\'ve ever had. We\'ve already made our next reservation!',
    date: 'July 2024',
  },
];

const StarRating = ({ rating }) => (
  <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`star ${i < rating ? 'star--filled' : ''}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoPlayRef = useRef(null);

  const total = TESTIMONIALS.length;

  const goTo = (index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  };

  const prev = () => goTo((current - 1 + total) % total, -1);
  const next = () => goTo((current + 1) % total, 1);

  // Auto-advance every 5 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [total]);

  const resetAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % total);
    }, 5000);
  };

  const handlePrev = () => { prev(); resetAutoPlay(); };
  const handleNext = () => { next(); resetAutoPlay(); };

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className="testimonials section" aria-labelledby="testimonials-title">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">What Our Guests Say</span>
          <h2 className="section-title" id="testimonials-title">Guest Reviews</h2>
          <div className="divider" />
          <p className="section-description">
            Real experiences from our valued guests — their words inspire us every day.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="testimonials__carousel" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              className="testimonials__slide"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="testimonials__card">
                <FaQuoteLeft className="testimonials__quote-icon" aria-hidden="true" />

                <StarRating rating={TESTIMONIALS[current].rating} />

                <blockquote className="testimonials__review">
                  "{TESTIMONIALS[current].review}"
                </blockquote>

                <div className="testimonials__author">
                  <img
                    src={TESTIMONIALS[current].avatar}
                    alt={TESTIMONIALS[current].name}
                    className="testimonials__avatar"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop';
                    }}
                  />
                  <div className="testimonials__author-info">
                    <span className="testimonials__author-name">{TESTIMONIALS[current].name}</span>
                    <span className="testimonials__author-role">{TESTIMONIALS[current].role}</span>
                    <span className="testimonials__author-date">{TESTIMONIALS[current].date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="testimonials__nav">
            <button
              className="testimonials__nav-btn"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <FiChevronLeft size={22} />
            </button>

            {/* Dots */}
            <div className="testimonials__dots" role="tablist" aria-label="Testimonial navigation">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`testimonials__dot ${i === current ? 'testimonials__dot--active' : ''}`}
                  onClick={() => { goTo(i, i > current ? 1 : -1); resetAutoPlay(); }}
                />
              ))}
            </div>

            <button
              className="testimonials__nav-btn"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <FiChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          className="testimonials__stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { num: '4.9', label: 'Average Rating', sub: 'Based on 2,400+ reviews' },
            { num: '98%', label: 'Would Recommend', sub: 'To friends and family' },
            { num: '50K+', label: 'Happy Guests', sub: 'Since 2009' },
          ].map((stat, i) => (
            <div key={i} className="testimonials__stat">
              <span className="testimonials__stat-num">{stat.num}</span>
              <span className="testimonials__stat-label">{stat.label}</span>
              <span className="testimonials__stat-sub">{stat.sub}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
