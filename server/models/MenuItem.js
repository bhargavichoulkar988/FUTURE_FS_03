// ============================================================
// Elite Dine - Menu Item Model
// Defines the schema for restaurant menu items
// ============================================================
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    // Name of the dish
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    // Detailed description of the dish
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Price in dollars
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },

    // Menu category for filtering
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Special Combos', 'Indian Starters', 'Indian Main Course', 'Indian Breads & Rice', 'Indian Desserts'],
      trim: true
    },

    // URL to the dish image
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    },

    // Whether this item is featured on the homepage
    featured: {
      type: Boolean,
      default: false
    },

    // Whether this item is currently available
    available: {
      type: Boolean,
      default: true
    },

    // Dietary tags (e.g., vegetarian, vegan, gluten-free)
    tags: {
      type: [String],
      default: []
    },

    // Spice level: 0 = none, 1 = mild, 2 = medium, 3 = hot
    spiceLevel: {
      type: Number,
      min: 0,
      max: 3,
      default: 0
    },

    // Preparation time in minutes
    prepTime: {
      type: Number,
      default: 20
    }
  },
  {
    timestamps: true
  }
);

// Index for faster category-based queries
menuItemSchema.index({ category: 1, available: 1 });
menuItemSchema.index({ featured: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
