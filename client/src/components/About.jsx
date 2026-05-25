// ============================================================
// Elite Dine - About Us Section
// Restaurant story, values, and team highlights
// ============================================================
import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiUsers, FiStar } from 'react-icons/fi';
import { GiCook, GiGrapes, GiKnifeFork } from 'react-icons/gi';
import './About.css';

const values = [
  {
    icon: <GiCook size={28} />,
    title: 'Master Craftsmanship',
    desc: 'Our executive chef brings 20+ years of Michelin-starred experience to every plate.'
  },
  {
    icon: <GiGrapes size={28} />,
    title: 'Finest Ingredients',
    desc: 'We source only the freshest seasonal produce from local farms and trusted global suppliers.'
  },
  {
    icon: <FiHeart size={28} />,
    title: 'Passion & Soul',
    desc: 'Every dish is crafted with love, creativity, and an unwavering commitment to excellence.'
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Warm Hospitality',
    desc: 'Our team treats every guest like family, ensuring a memorable and personal experience.'
  },
];

const milestones = [
  { year: '2009', event: 'Elite Dine opens its doors in the heart of the city' },
  { year: '2012', event: 'Awarded "Best Fine Dining Restaurant" by City Food Guide' },
  { year: '2015', event: 'Expanded to a 120-seat venue with a private dining room' },
  { year: '2018', event: 'Chef Marco receives the prestigious Golden Fork Award' },
  { year: '2021', event: 'Launched our signature tasting menu and wine pairing program' },
  { year: '2024', event: 'Celebrating 15 years of culinary excellence' },
];

const About = () => {
  return (
    <section className="about section" aria-labelledby="about-title">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Our Story</span>
          <h2 className="section-title" id="about-title">About Elite Dine</h2>
          <div className="divider" />
        </motion.div>

        {/* Main Content: Image + Story */}
        <div className="about__main">
          {/* Images */}
          <motion.div
            className="about__images"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="about__img-primary-wrap">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop"
                alt="Elite Dine restaurant interior"
                className="about__img-primary"
                loading="lazy"
              />
            </div>
            <div className="about__img-secondary-wrap">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop"
                alt="Our executive chef at work"
                className="about__img-secondary"
                loading="lazy"
              />
              <div className="about__award-badge">
                <FiAward size={24} aria-hidden="true" />
                <span className="about__award-num">8</span>
                <span className="about__award-label">Awards</span>
              </div>
            </div>
          </motion.div>

          {/* Story Text */}
          <motion.div
            className="about__story"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="section-subtitle">Since 2009</span>
            <h3 className="about__story-title">
              A Legacy of <span className="text-gold">Culinary Excellence</span>
            </h3>
            <p className="about__story-text">
              Elite Dine was born from a simple yet profound belief — that dining is not merely 
              eating, but an art form. Founded in 2009 by Chef Marco Rossi and his partner 
              Sofia Patel, our restaurant has grown from a cozy 30-seat bistro into one of the 
              city's most celebrated fine dining destinations.
            </p>
            <p className="about__story-text">
              Our philosophy is rooted in the harmony of tradition and innovation. We honor 
              classic culinary techniques while embracing modern creativity, resulting in dishes 
              that are both familiar and surprising. Every ingredient is chosen with intention, 
              every flavor combination crafted with precision.
            </p>
            <p className="about__story-text">
              Over 15 years, we've had the privilege of hosting over 50,000 guests — from 
              intimate anniversary dinners to grand celebrations. Each visit is a new chapter 
              in our shared story of exceptional food and genuine hospitality.
            </p>

            {/* Quick stats */}
            <div className="about__stats">
              {[
                { icon: <FiStar />, num: '15+', label: 'Years of Excellence' },
                { icon: <GiKnifeFork />, num: '50K+', label: 'Happy Guests' },
                { icon: <FiAward />, num: '8', label: 'Awards Won' },
              ].map((stat, i) => (
                <div key={i} className="about__stat">
                  <span className="about__stat-icon">{stat.icon}</span>
                  <span className="about__stat-num">{stat.num}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="about__values">
          {values.map((val, i) => (
            <motion.div
              key={i}
              className="about__value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="about__value-icon" aria-hidden="true">{val.icon}</div>
              <h4 className="about__value-title">{val.title}</h4>
              <p className="about__value-desc">{val.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          className="about__timeline-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="about__timeline-heading">Our Journey</h3>
          <div className="about__timeline">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className={`about__milestone ${i % 2 === 0 ? 'about__milestone--left' : 'about__milestone--right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="about__milestone-dot" aria-hidden="true" />
                <div className="about__milestone-card">
                  <span className="about__milestone-year">{m.year}</span>
                  <p className="about__milestone-event">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
