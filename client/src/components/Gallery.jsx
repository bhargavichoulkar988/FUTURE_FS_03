// ============================================================
// Elite Dine - Image Gallery Component
// Masonry-style gallery with lightbox
// ============================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import './Gallery.css';

const GALLERY_IMAGES = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop',
    alt: 'Elegant restaurant dining room',
    category: 'Ambiance',
    span: 'wide',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&auto=format&fit=crop',
    alt: 'Perfectly seared filet mignon',
    category: 'Food',
    span: 'normal',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop',
    alt: 'Pan-seared salmon with asparagus',
    category: 'Food',
    span: 'normal',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop',
    alt: 'Chef preparing a dish',
    category: 'Kitchen',
    span: 'tall',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
    alt: 'Chocolate lava cake dessert',
    category: 'Food',
    span: 'normal',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop',
    alt: 'Romantic table setting for two',
    category: 'Ambiance',
    span: 'wide',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop',
    alt: 'Premium wine selection',
    category: 'Beverages',
    span: 'normal',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop',
    alt: 'Lobster linguine pasta',
    category: 'Food',
    span: 'normal',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop',
    alt: 'Beautifully plated gourmet dish',
    category: 'Food',
    span: 'normal',
  },
];

const FILTER_TABS = ['All', 'Food', 'Ambiance', 'Kitchen', 'Beverages'];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = activeFilter === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeFilter);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    setLightboxIndex(prev => (prev - 1 + filtered.length) % filtered.length);
  };

  const nextImage = () => {
    setLightboxIndex(prev => (prev + 1) % filtered.length);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <section className="gallery section" aria-labelledby="gallery-title">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Visual Journey</span>
          <h2 className="section-title" id="gallery-title">Our Gallery</h2>
          <div className="divider" />
          <p className="section-description">
            A glimpse into the world of Elite Dine — where food becomes art and spaces inspire.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="gallery__filters" role="tablist" aria-label="Gallery categories">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeFilter === tab}
              className={`gallery__filter-btn ${activeFilter === tab ? 'gallery__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div className="gallery__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                className={`gallery__item gallery__item--${img.span}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.alt}`}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
              >
                <img
                  src={img.thumb}
                  alt={img.alt}
                  className="gallery__img"
                  loading="lazy"
                />
                <div className="gallery__item-overlay">
                  <FiZoomIn size={28} className="gallery__zoom-icon" aria-hidden="true" />
                  <span className="gallery__item-category">{img.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            tabIndex={-1}
          >
            {/* Close */}
            <button
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <FiX size={24} />
            </button>

            {/* Prev */}
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous image"
            >
              <FiChevronLeft size={28} />
            </button>

            {/* Image */}
            <motion.div
              className="lightbox__img-wrap"
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex]?.src}
                alt={filtered[lightboxIndex]?.alt}
                className="lightbox__img"
              />
              <div className="lightbox__caption">
                <span>{filtered[lightboxIndex]?.alt}</span>
                <span className="lightbox__counter">
                  {lightboxIndex + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              aria-label="Next image"
            >
              <FiChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
