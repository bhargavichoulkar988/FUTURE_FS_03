// ============================================================
// Elite Dine - Contact Message Model
// Stores messages submitted through the contact form
// ============================================================
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // Sender's full name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    // Sender's email address
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },

    // Subject of the message
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },

    // The actual message content
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },

    // Track if the message has been read/responded to
    isRead: {
      type: Boolean,
      default: false
    },

    // Optional reply from the restaurant
    reply: {
      type: String,
      default: ''
    }
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
  }
);

// Index for faster queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isRead: 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
