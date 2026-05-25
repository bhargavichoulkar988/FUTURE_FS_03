// ============================================================
// Elite Dine - Contact Routes
// Handles contact form submissions
// ============================================================
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const {
  sendContactNotification,
  sendContactAutoReply
} = require('../utils/emailService');

// ============================================================
// Validation Rules for Contact Form
// ============================================================
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// ============================================================
// POST /api/contact
// Submit a contact form message
// ============================================================
router.post('/', contactValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Save the contact message to the database
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    // Send notification to admin and auto-reply to sender
    Promise.allSettled([
      sendContactNotification({ name, email, subject, message }),
      sendContactAutoReply({ name, email, subject, message })
    ]).then((results) => {
      results.forEach((result, index) => {
        const emailType = index === 0 ? 'Admin notification' : 'Auto-reply';
        if (result.status === 'fulfilled') {
          console.log(`✅ ${emailType} email sent successfully`);
        } else {
          console.error(`❌ ${emailType} email failed:`, result.reason?.message);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again or contact us directly.'
    });
  }
});

// ============================================================
// GET /api/contact
// Get all contact messages (admin use)
// ============================================================
router.get('/', async (req, res) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [messages, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

module.exports = router;
