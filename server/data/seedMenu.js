// ============================================================
// Elite Dine - Menu Seed Script
// Run this script to populate the database with menu items:
//   node server/data/seedMenu.js
// ============================================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MenuItem = require('../models/MenuItem');

// ============================================================
// Menu Data - 45 items across 9 categories (includes Indian cuisine)
// ============================================================
const menuItems = [
  // ==================== STARTERS ====================
  {
    name: 'Bruschetta al Pomodoro',
    description: 'Toasted artisan bread topped with fresh Roma tomatoes, garlic, basil, and a drizzle of extra virgin olive oil. A classic Italian starter.',
    price: 12.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian'],
    spiceLevel: 0,
    prepTime: 10
  },
  {
    name: 'Crispy Calamari',
    description: 'Tender rings of squid lightly dusted in seasoned flour, fried to golden perfection. Served with zesty marinara sauce and lemon wedges.',
    price: 16.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['seafood'],
    spiceLevel: 1,
    prepTime: 15
  },
  {
    name: 'Burrata Caprese',
    description: 'Creamy burrata cheese on a bed of heirloom tomatoes, fresh basil, aged balsamic glaze, and premium olive oil.',
    price: 15.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 8
  },

  // ==================== MAIN COURSE ====================
  {
    name: 'Filet Mignon',
    description: 'Prime 8oz beef tenderloin, perfectly seared and finished in herb butter. Served with truffle mashed potatoes and seasonal vegetables.',
    price: 52.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['gluten-free'],
    spiceLevel: 0,
    prepTime: 30
  },
  {
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon fillet with crispy skin, served on a bed of lemon risotto with asparagus and a dill cream sauce.',
    price: 38.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['seafood', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 25
  },
  {
    name: 'Lobster Linguine',
    description: 'Fresh linguine tossed with butter-poached lobster, cherry tomatoes, garlic, white wine, and fresh herbs.',
    price: 58.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['seafood'],
    spiceLevel: 0,
    prepTime: 30
  },

  // ==================== DESSERTS ====================
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with a molten center, served with vanilla bean ice cream and fresh raspberry coulis.',
    price: 12.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian'],
    spiceLevel: 0,
    prepTime: 15
  },
  {
    name: 'Crème Brûlée',
    description: 'Silky vanilla custard with a perfectly caramelized sugar crust. Served with fresh seasonal berries.',
    price: 11.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 10
  },
  {
    name: 'Classic Tiramisu',
    description: 'Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with premium cocoa powder. Made fresh daily.',
    price: 10.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian'],
    spiceLevel: 0,
    prepTime: 5
  },

  // ==================== BEVERAGES ====================
  {
    name: 'Signature Mocktail',
    description: 'A refreshing blend of fresh passion fruit, mango, mint, and sparkling water. Garnished with edible flowers.',
    price: 8.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegan', 'non-alcoholic'],
    spiceLevel: 0,
    prepTime: 5
  },
  {
    name: 'Artisan Coffee Selection',
    description: 'Choose from Ethiopian pour-over, Italian espresso, or creamy cappuccino. Made with single-origin beans.',
    price: 6.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['non-alcoholic'],
    spiceLevel: 0,
    prepTime: 5
  },
  {
    name: 'Premium Wine Selection',
    description: 'Curated selection of Old and New World wines. Ask your server for our sommelier\'s recommendation.',
    price: 14.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['alcoholic'],
    spiceLevel: 0,
    prepTime: 2
  },

  // ==================== SPECIAL COMBOS ====================
  {
    name: 'The Elite Experience',
    description: 'Signature tasting menu for two: Burrata Caprese + Filet Mignon (2) + Chocolate Lava Cake (2) + Wine pairing.',
    price: 149.99,
    category: 'Special Combos',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['for-two'],
    spiceLevel: 0,
    prepTime: 45
  },
  {
    name: 'Date Night Package',
    description: 'Perfect for two: Shrimp Cocktail + Pan-Seared Salmon + Chicken Marsala + Tiramisu (2) + Mocktails (2). Includes complimentary rose.',
    price: 119.99,
    category: 'Special Combos',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['for-two', 'romantic'],
    spiceLevel: 0,
    prepTime: 40
  },
  {
    name: 'Indian Feast for Two',
    description: 'A royal Indian spread: Paneer Tikka + Butter Chicken + Dal Makhani + Garlic Naan (4) + Gulab Jamun (2) + Mango Lassi (2).',
    price: 89.99,
    category: 'Special Combos',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['for-two', 'indian', 'spicy'],
    spiceLevel: 2,
    prepTime: 40
  },

  // ==================== INDIAN STARTERS ====================
  {
    name: 'Paneer Tikka',
    description: 'Succulent cubes of cottage cheese marinated in spiced yogurt, grilled in a tandoor oven. Served with mint chutney and sliced onions.',
    price: 14.99,
    category: 'Indian Starters',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 2,
    prepTime: 20
  },
  {
    name: 'Chicken Tikka',
    description: 'Tender boneless chicken pieces marinated overnight in yogurt and aromatic spices, chargrilled to perfection in a clay tandoor.',
    price: 16.99,
    category: 'Indian Starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['indian'],
    spiceLevel: 2,
    prepTime: 25
  },
  {
    name: 'Samosa (4 pcs)',
    description: 'Crispy golden pastry filled with spiced potatoes and green peas. Served with tamarind chutney and fresh mint chutney.',
    price: 9.99,
    category: 'Indian Starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'vegan'],
    spiceLevel: 1,
    prepTime: 15
  },
  {
    name: 'Seekh Kebab',
    description: 'Minced lamb mixed with fresh herbs, ginger, garlic and spices, shaped on skewers and grilled over charcoal. Served with raita.',
    price: 18.99,
    category: 'Indian Starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['indian'],
    spiceLevel: 2,
    prepTime: 25
  },
  {
    name: 'Dahi Puri',
    description: 'Crispy hollow puris filled with spiced chickpeas, tangy tamarind chutney, fresh yogurt, and topped with sev and coriander.',
    price: 10.99,
    category: 'Indian Starters',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 1,
    prepTime: 10
  },
  {
    name: 'Prawn Koliwada',
    description: 'Juicy prawns marinated in a fiery coastal spice blend, deep fried until crispy. A Mumbai street food classic elevated for fine dining.',
    price: 19.99,
    category: 'Indian Starters',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['seafood', 'indian'],
    spiceLevel: 3,
    prepTime: 20
  },

  // ==================== INDIAN MAIN COURSE ====================
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, velvety tomato-cream sauce with aromatic spices. India\'s most beloved dish, slow-cooked to perfection.',
    price: 22.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['indian'],
    spiceLevel: 1,
    prepTime: 30
  },
  {
    name: 'Dal Makhani',
    description: 'Black lentils and kidney beans slow-cooked overnight with butter, cream, and a blend of whole spices. A Punjabi classic.',
    price: 17.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 1,
    prepTime: 35
  },
  {
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese cubes in a smooth, vibrant spinach gravy seasoned with cumin, garam masala, and a touch of cream.',
    price: 19.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 1,
    prepTime: 25
  },
  {
    name: 'Lamb Rogan Josh',
    description: 'Slow-braised tender lamb in a bold Kashmiri sauce of whole spices, dried chilies, and aromatic herbs. A royal Mughal recipe.',
    price: 26.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['indian', 'gluten-free'],
    spiceLevel: 2,
    prepTime: 45
  },
  {
    name: 'Prawn Masala',
    description: 'Juicy tiger prawns cooked in a tangy, spiced onion-tomato masala with coastal Indian spices and fresh curry leaves.',
    price: 28.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['seafood', 'indian', 'gluten-free'],
    spiceLevel: 2,
    prepTime: 25
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken, caramelized onions, saffron, and fresh mint. Slow-cooked in the dum style.',
    price: 24.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['indian', 'gluten-free'],
    spiceLevel: 2,
    prepTime: 40
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Soft paneer cubes in a luscious, mildly spiced tomato-cashew gravy. Rich, creamy and utterly satisfying.',
    price: 20.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 1,
    prepTime: 25
  },
  {
    name: 'Vegetable Korma',
    description: 'Seasonal vegetables in a fragrant, mild coconut-cashew cream sauce with whole spices. A delicate and aromatic royal dish.',
    price: 18.99,
    category: 'Indian Main Course',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'vegan', 'indian', 'gluten-free'],
    spiceLevel: 1,
    prepTime: 30
  },

  // ==================== INDIAN BREADS & RICE ====================
  {
    name: 'Garlic Naan',
    description: 'Soft, pillowy leavened bread baked in a tandoor oven, brushed with garlic butter and fresh coriander. Served hot.',
    price: 4.99,
    category: 'Indian Breads & Rice',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 0,
    prepTime: 10
  },
  {
    name: 'Butter Naan',
    description: 'Classic tandoor-baked naan generously brushed with pure butter. Light, fluffy and perfect with any curry.',
    price: 3.99,
    category: 'Indian Breads & Rice',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 0,
    prepTime: 8
  },
  {
    name: 'Laccha Paratha',
    description: 'Flaky, multi-layered whole wheat flatbread cooked on a griddle with ghee. Crispy on the outside, soft inside.',
    price: 4.49,
    category: 'Indian Breads & Rice',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 0,
    prepTime: 10
  },
  {
    name: 'Saffron Basmati Rice',
    description: 'Long-grain aged basmati rice infused with saffron, cardamom, and rose water. Garnished with fried onions and cashews.',
    price: 6.99,
    category: 'Indian Breads & Rice',
    image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9b1b5?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 15
  },
  {
    name: 'Peshwari Naan',
    description: 'Sweet tandoor-baked naan stuffed with coconut, almonds, and sultanas. A delightful contrast to spicy curries.',
    price: 5.49,
    category: 'Indian Breads & Rice',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 0,
    prepTime: 10
  },

  // ==================== INDIAN DESSERTS ====================
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup, served warm with a scoop of vanilla ice cream.',
    price: 8.99,
    category: 'Indian Desserts',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian', 'indian'],
    spiceLevel: 0,
    prepTime: 10
  },
  {
    name: 'Mango Kulfi',
    description: 'Traditional Indian ice cream made with condensed milk and fresh Alphonso mango pulp. Dense, creamy and intensely flavoured.',
    price: 9.99,
    category: 'Indian Desserts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop',
    featured: true,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 5
  },
  {
    name: 'Rasmalai',
    description: 'Delicate cottage cheese patties soaked in chilled saffron-cardamom milk, garnished with pistachios and rose petals.',
    price: 10.99,
    category: 'Indian Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 5
  },
  {
    name: 'Gajar Ka Halwa',
    description: 'Slow-cooked carrot pudding with ghee, milk, sugar, and cardamom. Topped with slivered almonds and served warm.',
    price: 8.49,
    category: 'Indian Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 10
  },
  {
    name: 'Mango Lassi',
    description: 'Thick, chilled yogurt drink blended with sweet Alphonso mango pulp, a pinch of cardamom and rose water.',
    price: 6.99,
    category: 'Indian Desserts',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&auto=format&fit=crop',
    featured: false,
    available: true,
    tags: ['vegetarian', 'indian', 'gluten-free'],
    spiceLevel: 0,
    prepTime: 5
  },
];

// ============================================================
// Seed Function
// ============================================================
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elitedine');
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert all menu items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`✅ Successfully seeded ${inserted.length} menu items`);

    // Display summary by category
    const categories = [...new Set(menuItems.map(item => item.category))];
    categories.forEach(cat => {
      const count = menuItems.filter(item => item.category === cat).length;
      console.log(`   📋 ${cat}: ${count} items`);
    });

    console.log('\n🎉 Database seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
