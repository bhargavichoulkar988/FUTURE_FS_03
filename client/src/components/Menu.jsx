// ============================================================
// Elite Dine - Interactive Menu Component
// Full menu with category filters and search
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { GiChiliPepper } from 'react-icons/gi';
import axios from 'axios';
import './Menu.css';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Special Combos', 'Indian Starters', 'Indian Main Course', 'Indian Breads & Rice', 'Indian Desserts'];

const SpiceLevel = ({ level }) => {
  if (!level) return null;
  return (
    <span className="menu-item__spice" aria-label={`Spice level ${level}`}>
      {[...Array(level)].map((_, i) => <GiChiliPepper key={i} aria-hidden="true" />)}
    </span>
  );
};

const MenuItem = ({ item, index }) => (
  <motion.article
    className="menu-item"
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
    whileHover={{ y: -4 }}
  >
    <div className="menu-item__img-wrap">
      <img
        src={item.image}
        alt={item.name}
        
        className="menu-item__img"
        loading="lazy"
  
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop';
        }}
      />
      {item.featured && (
        <span className="menu-item__featured-badge">⭐ Featured</span>
      )}
    </div>
    <div className="menu-item__body">
      <div className="menu-item__top">
        <h3 className="menu-item__name">{item.name}</h3>
        <span className="menu-item__price">${item.price?.toFixed(2)}</span>
      </div>
      <p className="menu-item__desc">{item.description}</p>
      <div className="menu-item__footer">
        <div className="menu-item__tags">
          {item.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="menu-item__tag">{tag}</span>
          ))}
        </div>
        <SpiceLevel level={item.spiceLevel} />
      </div>
    </div>
  </motion.article>
);

const Menu = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all menu items once
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('/api/menu?limit=100');
        setItems(res.data.data || []);
        setFiltered(res.data.data || []);
      } catch {
        setItems(FALLBACK_MENU);
        setFiltered(FALLBACK_MENU);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Filter whenever category or search changes
  const applyFilters = useCallback((category, query) => {
    let result = [...items];
    if (category !== 'All') {
      result = result.filter(item => item.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [items]);

  useEffect(() => {
    applyFilters(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, applyFilters]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  const clearSearch = () => setSearchQuery('');

  return (
    <section className="menu-section section" aria-labelledby="menu-title">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Explore Our Menu</span>
          <h2 className="section-title" id="menu-title">Our Culinary Offerings</h2>
          <div className="divider" />
          <p className="section-description">
            From delicate starters to indulgent desserts — every dish tells a story.
          </p>
        </motion.div>

        {/* Controls: Search + Category Filters */}
        <div className="menu-controls">
          {/* Search */}
          <div className="menu-search" role="search">
            <FiSearch className="menu-search__icon" aria-hidden="true" />
            <input
              type="search"
              className="menu-search__input"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search menu items"
            />
            {searchQuery && (
              <button
                className="menu-search__clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="menu-categories" role="tablist" aria-label="Menu categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`menu-cat-btn ${activeCategory === cat ? 'menu-cat-btn--active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="menu-results-count" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
            {searchQuery && ` for "${searchQuery}"`}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </p>
        )}

        {/* Menu Grid */}
        {loading ? (
          <div className="menu-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="menu-item menu-item--skeleton">
                <div className="skeleton" style={{ height: 180 }} />
                <div className="menu-item__body">
                  <div className="skeleton" style={{ height: 18, width: '65%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 13, width: '90%', marginBottom: 5 }} />
                  <div className="skeleton" style={{ height: 13, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="menu-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="menu-empty__icon">🍽</span>
            <h3>No dishes found</h3>
            <p>Try a different search term or category.</p>
            <button className="btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
              Show All Items
            </button>
          </motion.div>
        ) : (
          <motion.div className="menu-grid" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <MenuItem key={item._id || item.name} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// Fallback menu data
const FALLBACK_MENU = [
  { _id: 'f1', name: 'Bruschetta al Pomodoro', category: 'Starters', description: 'Toasted artisan bread topped with fresh Roma tomatoes, garlic, basil, and extra virgin olive oil.', price: 12.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&auto=format&fit=crop', tags: ['vegetarian'], spiceLevel: 0, featured: true },
  { _id: 'f2', name: 'Crispy Calamari', category: 'Starters', description: 'Tender rings of squid lightly dusted in seasoned flour, fried to golden perfection.', price: 16.99, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop', tags: ['seafood'], spiceLevel: 1, featured: true },
  { _id: 'f3', name: 'Filet Mignon', category: 'Main Course', description: 'Prime 8oz beef tenderloin, perfectly seared and finished in herb butter.', price: 52.99, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&auto=format&fit=crop', tags: ['gluten-free'], spiceLevel: 0, featured: true },
  { _id: 'f4', name: 'Pan-Seared Salmon', category: 'Main Course', description: 'Atlantic salmon fillet with crispy skin, served on a bed of lemon risotto.', price: 38.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop', tags: ['seafood', 'gluten-free'], spiceLevel: 0, featured: true },
  { _id: 'f5', name: 'Chocolate Lava Cake', category: 'Desserts', description: 'Warm dark chocolate cake with a molten center, served with vanilla bean ice cream.', price: 12.99, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop', tags: ['vegetarian'], spiceLevel: 0, featured: true },
  { _id: 'f6', name: 'Classic Tiramisu', category: 'Desserts', description: 'Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with premium cocoa.', price: 10.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop', tags: ['vegetarian'], spiceLevel: 0, featured: false },
  { _id: 'f7', name: 'Signature Mocktail', category: 'Beverages', description: 'A refreshing blend of fresh passion fruit, mango, mint, and sparkling water.', price: 8.99, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop', tags: ['vegan', 'non-alcoholic'], spiceLevel: 0, featured: false },
  { _id: 'f8', name: 'The Elite Experience', category: 'Special Combos', description: 'Our signature tasting menu for two: Burrata + Filet Mignon + Lava Cake + Wine pairing.', price: 149.99, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop', tags: ['for-two'], spiceLevel: 0, featured: true },
  // Indian Starters
  { _id: 'i1', name: 'Paneer Tikka', category: 'Indian Starters', description: 'Succulent cottage cheese cubes marinated in spiced yogurt, grilled in a tandoor. Served with mint chutney.', price: 14.99, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian'], spiceLevel: 2, featured: true },
  { _id: 'i2', name: 'Chicken Tikka', category: 'Indian Starters', description: 'Tender boneless chicken marinated overnight in yogurt and aromatic spices, chargrilled in a clay tandoor.', price: 16.99, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop', tags: ['indian'], spiceLevel: 2, featured: true },
  { _id: 'i3', name: 'Samosa (4 pcs)', category: 'Indian Starters', description: 'Crispy golden pastry filled with spiced potatoes and green peas. Served with tamarind and mint chutney.', price: 9.99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'vegan'], spiceLevel: 1, featured: false },
  { _id: 'i4', name: 'Seekh Kebab', category: 'Indian Starters', description: 'Minced lamb with fresh herbs, ginger, garlic and spices, shaped on skewers and grilled over charcoal.', price: 18.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop', tags: ['indian'], spiceLevel: 2, featured: false },
  { _id: 'i5', name: 'Prawn Koliwada', category: 'Indian Starters', description: 'Juicy prawns in a fiery coastal spice blend, deep fried until crispy. A Mumbai street food classic.', price: 19.99, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop', tags: ['seafood', 'indian'], spiceLevel: 3, featured: true },
  // Indian Main Course
  { _id: 'i6', name: 'Butter Chicken', category: 'Indian Main Course', description: "Tender chicken in a rich, velvety tomato-cream sauce with aromatic spices. India's most beloved dish.", price: 22.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop', tags: ['indian'], spiceLevel: 1, featured: true },
  { _id: 'i7', name: 'Dal Makhani', category: 'Indian Main Course', description: 'Black lentils and kidney beans slow-cooked overnight with butter, cream, and whole spices. A Punjabi classic.', price: 17.99, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 1, featured: true },
  { _id: 'i8', name: 'Chicken Biryani', category: 'Indian Main Course', description: 'Fragrant basmati rice layered with spiced chicken, caramelized onions, saffron, and fresh mint. Dum style.', price: 24.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop', tags: ['indian', 'gluten-free'], spiceLevel: 2, featured: true },
  { _id: 'i9', name: 'Palak Paneer', category: 'Indian Main Course', description: 'Fresh cottage cheese in a smooth spinach gravy seasoned with cumin, garam masala, and a touch of cream.', price: 19.99, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 1, featured: false },
  { _id: 'i10', name: 'Lamb Rogan Josh', category: 'Indian Main Course', description: 'Slow-braised tender lamb in a bold Kashmiri sauce of whole spices and dried chilies. A royal Mughal recipe.', price: 26.99, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop', tags: ['indian', 'gluten-free'], spiceLevel: 2, featured: true },
  { _id: 'i11', name: 'Paneer Butter Masala', category: 'Indian Main Course', description: 'Soft paneer cubes in a luscious mildly spiced tomato-cashew gravy. Rich, creamy and satisfying.', price: 20.99, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 1, featured: false },
  // Indian Breads & Rice
  { _id: 'i12', name: 'Garlic Naan', category: 'Indian Breads & Rice', description: 'Soft pillowy leavened bread baked in a tandoor, brushed with garlic butter and fresh coriander.', price: 4.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian'], spiceLevel: 0, featured: false },
  { _id: 'i13', name: 'Butter Naan', category: 'Indian Breads & Rice', description: 'Classic tandoor-baked naan generously brushed with pure butter. Light, fluffy and perfect with any curry.', price: 3.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian'], spiceLevel: 0, featured: false },
  { _id: 'i14', name: 'Saffron Basmati Rice', category: 'Indian Breads & Rice', description: 'Long-grain aged basmati rice infused with saffron, cardamom, and rose water. Garnished with fried onions.', price: 6.99, image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9b1b5?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 0, featured: false },
  // Indian Desserts
  { _id: 'i15', name: 'Gulab Jamun', category: 'Indian Desserts', description: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup, served warm with vanilla ice cream.', price: 8.99, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian'], spiceLevel: 0, featured: true },
  { _id: 'i16', name: 'Mango Kulfi', category: 'Indian Desserts', description: 'Traditional Indian ice cream made with condensed milk and fresh Alphonso mango pulp. Dense and creamy.', price: 9.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 0, featured: true },
  { _id: 'i17', name: 'Rasmalai', category: 'Indian Desserts', description: 'Delicate cottage cheese patties soaked in chilled saffron-cardamom milk, garnished with pistachios.', price: 10.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 0, featured: false },
  { _id: 'i18', name: 'Mango Lassi', category: 'Indian Desserts', description: 'Thick chilled yogurt drink blended with sweet Alphonso mango pulp, cardamom and rose water.', price: 6.99, image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&auto=format&fit=crop', tags: ['vegetarian', 'indian', 'gluten-free'], spiceLevel: 0, featured: false },
];

export default Menu;
