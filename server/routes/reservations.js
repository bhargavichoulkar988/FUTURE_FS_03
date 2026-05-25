// ============================================================
// Elite Dine - Reservation Routes
// Handles creating and retrieving table reservations
// ============================================================
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const {
  sendReservationConfirmation,
  sendAdminReservationNotification
} = require('../utils/emailService');

// ============================================================
// Validation Rules for Creating a Reservation
// ============================================================
const reservationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]{7,20}$/).withMessage('Please provide a valid phone number'),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Please provide a valid date')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),

  body('time')
    .trim()
    .notEmpty().withMessage('Time is required'),

  body('guests')
    .notEmpty().withMessage('Number of guests is required')
    .isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),

  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters')
];

// ============================================================
// POST /api/reservations
// Create a new reservation and send confirmation emails
// ============================================================
router.post('/', reservationValidation, async (req, res) => {
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
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    // Create the reservation in the database
    const reservation = new Reservation({
      name,
      email,
      phone,
      date: new Date(date),
      time,
      guests: parseInt(guests),
      specialRequests: specialRequests || '',
      status: 'pending'
    });

    // Save to MongoDB (pre-save hook will generate bookingRef)
    await reservation.save();

    // Prepare data for email
    const emailData = {
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      specialRequests: reservation.specialRequests,
      bookingRef: reservation.bookingRef
    };

    // Send emails asynchronously (don't block the response)
    // We use Promise.allSettled so one email failure doesn't affect the other
    Promise.allSettled([
      sendReservationConfirmation(emailData),
      sendAdminReservationNotification(emailData)
    ]).then((results) => {
      results.forEach((result, index) => {
        const emailType = index === 0 ? 'Customer confirmation' : 'Admin notification';
        if (result.status === 'fulfilled') {
          console.log(`✅ ${emailType} email sent successfully`);
        } else {
          console.error(`❌ ${emailType} email failed:`, result.reason?.message);
        }
      });
    });

    // Respond with success immediately (don't wait for emails)
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully! A confirmation email has been sent.',
      data: {
        bookingRef: reservation.bookingRef,
        name: reservation.name,
        email: reservation.email,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status
      }
    });

  } catch (error) {
    console.error('Reservation creation error:', error);

    // Handle duplicate booking reference (extremely rare)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A duplicate booking reference was generated. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create reservation. Please try again or call us directly.'
    });
  }
});

// ============================================================
// GET /api/reservations
// Get all reservations (admin use)
// ============================================================
router.get('/', async (req, res) => {
  try {
    const {
      status,
      date,
      page = 1,
      limit = 20,
      sortBy = 'date',
      order = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Fetch reservations with pagination
    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Reservation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: reservations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations'
    });
  }
});

// ============================================================
// GET /api/reservations/:id
// Get a single reservation by ID
// ============================================================
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservation'
    });
  }
});

// ============================================================
// PATCH /api/reservations/:id/status
// Update reservation status (admin use)
// ============================================================
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      message: `Reservation status updated to ${status}`,
      data: reservation
    });

  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation status'
    });
  }
});

module.exports = router;
