// ============================================================
// Elite Dine - Menu Routes
// Handles fetching menu items with filtering and search
// ============================================================
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// ============================================================
// GET /api/menu
// Get all available menu items with optional filters
// Query params: category, search, featured, page, limit
// ============================================================
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      featured,
      page = 1,
      limit = 50,
      sortBy = 'category',
      order = 'asc'
    } = req.query;

    // Build the filter object
    const filter = { available: true };

    // Filter by category if provided
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter featured items only
    if (featured === 'true') {
      filter.featured = true;
    }

    // Text search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      MenuItem.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
});

// ============================================================
// GET /api/menu/categories
// Get list of all available categories
// ============================================================
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category', { available: true });
    res.json({
      success: true,
      data: ['All', ...categories]
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// ============================================================
// GET /api/menu/:category
// Get menu items by specific category
// ============================================================
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;

    // Validate category
    const validCategories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Special Combos', 'Indian Starters', 'Indian Main Course', 'Indian Breads & Rice', 'Indian Desserts'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const items = await MenuItem.find({
      category,
      available: true
    }).sort({ name: 1 }).lean();

    res.json({
      success: true,
      data: items,
      category,
      count: items.length
    });

  } catch (error) {
    console.error('Get menu by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
});

module.exports = router;
