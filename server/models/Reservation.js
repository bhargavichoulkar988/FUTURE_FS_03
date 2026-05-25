// ============================================================
// Elite Dine - Reservation Model
// Defines the schema for table reservations stored in MongoDB
// ============================================================
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    // Customer's full name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    // Customer's email address for confirmation
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },

    // Customer's phone number
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\d\s\-\+\(\)]{7,20}$/, 'Please provide a valid phone number']
    },

    // Reservation date
    date: {
      type: Date,
      required: [true, 'Reservation date is required']
    },

    // Reservation time slot (e.g., "7:00 PM")
    time: {
      type: String,
      required: [true, 'Reservation time is required'],
      trim: true
    },

    // Number of guests
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
      max: [20, 'Maximum 20 guests per reservation']
    },

    // Any special requests or dietary requirements
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
      default: ''
    },

    // Reservation status - managed by restaurant staff
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },

    // Unique booking reference number
    bookingRef: {
      type: String,
      unique: true
    }
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
  }
);

// ============================================================
// Pre-save Hook: Generate a unique booking reference
// ============================================================
reservationSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    // Generate a reference like "ED-1234567890-ABC"
    const timestamp = Date.now().toString().slice(-7);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.bookingRef = `ED-${timestamp}-${random}`;
  }
  next();
});

// ============================================================
// Index for faster queries by date and status
// ============================================================
reservationSchema.index({ date: 1, status: 1 });
reservationSchema.index({ email: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
