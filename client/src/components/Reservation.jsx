// ============================================================
// Elite Dine - Reservation / Table Booking Component
// Saves to MongoDB + sends email via EmailJS
// ============================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiUsers, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { GiKnifeFork } from 'react-icons/gi';
import toast from 'react-hot-toast';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './Reservation.css';

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM',
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: null,
  time: '',
  guests: '',
  specialRequests: '',
};

const Reservation = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Please enter your full name (min 2 characters).';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.phone.trim() || !/^[\d\s\-+()]{7,20}$/.test(form.phone)) errs.phone = 'Please enter a valid phone number.';
    if (!form.date) errs.date = 'Please select a reservation date.';
    if (!form.time) errs.time = 'Please select a time slot.';
    if (!form.guests) errs.guests = 'Please select the number of guests.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, date }));
    if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date.toISOString(),
        time: form.time,
        guests: parseInt(form.guests),
        specialRequests: form.specialRequests.trim(),
      };

      // 1. Save to MongoDB via backend
      const res = await axios.post('/api/reservations', payload);

      if (res.data.success) {
        const data = res.data.data;

        // 2. Send email notification to bhargavichoulkar988@gmail.com via EmailJS
        const formattedDate = form.date.toLocaleDateString('en-IN', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_RESERVATION_TEMPLATE_ID,
          {
            to_email:        'bhargavichoulkar988@gmail.com',
            booking_ref:     data.bookingRef,
            from_name:       data.name,
            from_email:      data.email,
            phone:           form.phone.trim(),
            date:            formattedDate,
            time:            data.time,
            guests:          data.guests,
            special_requests: form.specialRequests.trim() || 'None',
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        ).catch(err => console.warn('Email notification failed:', err));

        setConfirmed(data);
        setForm(initialForm);
        toast.success('Reservation confirmed! Saved successfully.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit reservation. Please try again.';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach(e => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetConfirmation = () => setConfirmed(null);

  // Disable past dates
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <section className="reservation section" aria-labelledby="reservation-title">
      <div className="reservation__bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&auto=format&fit=crop&q=60"
          alt=""
          className="reservation__bg-img"
        />
        <div className="reservation__bg-overlay" />
      </div>

      <div className="container reservation__container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle" style={{ color: 'var(--color-primary)' }}>Book Your Table</span>
          <h2 className="section-title" id="reservation-title" style={{ color: '#fff' }}>
            Reserve a Table
          </h2>
          <div className="divider" />
          <p className="section-description" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Secure your spot for an unforgettable dining experience. A confirmation will be sent to your email.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {confirmed ? (
            /* ---- Confirmation Card ---- */
            <motion.div
              key="confirmed"
              className="reservation__confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="confirmed__icon-wrap">
                <FiCheck size={40} aria-hidden="true" />
              </div>
              <h3 className="confirmed__title">Reservation Confirmed!</h3>
              <p className="confirmed__subtitle">
                A confirmation email has been sent to <strong>{confirmed.email}</strong>
              </p>

              <div className="confirmed__details">
                <div className="confirmed__ref">
                  <span className="confirmed__ref-label">Booking Reference</span>
                  <span className="confirmed__ref-value">{confirmed.bookingRef}</span>
                </div>
                <div className="confirmed__grid">
                  <div className="confirmed__item">
                    <FiCalendar aria-hidden="true" />
                    <div>
                      <span className="confirmed__item-label">Date</span>
                      <span className="confirmed__item-value">
                        {new Date(confirmed.date).toLocaleDateString('en-US', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="confirmed__item">
                    <FiClock aria-hidden="true" />
                    <div>
                      <span className="confirmed__item-label">Time</span>
                      <span className="confirmed__item-value">{confirmed.time}</span>
                    </div>
                  </div>
                  <div className="confirmed__item">
                    <FiUsers aria-hidden="true" />
                    <div>
                      <span className="confirmed__item-label">Guests</span>
                      <span className="confirmed__item-value">{confirmed.guests} {confirmed.guests === 1 ? 'Person' : 'People'}</span>
                    </div>
                  </div>
                  <div className="confirmed__item">
                    <FiUser aria-hidden="true" />
                    <div>
                      <span className="confirmed__item-label">Name</span>
                      <span className="confirmed__item-value">{confirmed.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="confirmed__note">
                Please arrive 10 minutes before your reservation. To modify or cancel, call us at <strong>+91 91216 13958</strong>.
              </p>

              <button className="btn-primary" onClick={resetConfirmation}>
                Make Another Reservation
              </button>
            </motion.div>
          ) : (
            /* ---- Booking Form ---- */
            <motion.div
              key="form"
              className="reservation__card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="reservation__card-header">
                <GiKnifeFork size={28} aria-hidden="true" />
                <h3>Book Your Table</h3>
              </div>

              <form className="reservation__form" onSubmit={handleSubmit} noValidate>
                {/* Row 1: Name + Email */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="res-name" className="form-label">
                      <FiUser aria-hidden="true" /> Full Name *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      name="name"
                      className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                      placeholder="John Smith"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby={errors.name ? 'res-name-error' : undefined}
                    />
                    {errors.name && <span id="res-name-error" className="form-error" role="alert">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-email" className="form-label">
                      <FiMail aria-hidden="true" /> Email Address *
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      name="email"
                      className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      aria-required="true"
                      aria-describedby={errors.email ? 'res-email-error' : undefined}
                    />
                    {errors.email && <span id="res-email-error" className="form-error" role="alert">{errors.email}</span>}
                  </div>
                </div>

                {/* Row 2: Phone + Guests */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="res-phone" className="form-label">
                      <FiPhone aria-hidden="true" /> Phone Number *
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      name="phone"
                      className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      aria-required="true"
                      aria-describedby={errors.phone ? 'res-phone-error' : undefined}
                    />
                    {errors.phone && <span id="res-phone-error" className="form-error" role="alert">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-guests" className="form-label">
                      <FiUsers aria-hidden="true" /> Number of Guests *
                    </label>
                    <select
                      id="res-guests"
                      name="guests"
                      className={`form-input form-select ${errors.guests ? 'form-input--error' : ''}`}
                      value={form.guests}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.guests ? 'res-guests-error' : undefined}
                    >
                      <option value="">Select guests</option>
                      {GUEST_OPTIONS.map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                    {errors.guests && <span id="res-guests-error" className="form-error" role="alert">{errors.guests}</span>}
                  </div>
                </div>

                {/* Row 3: Date + Time */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="res-date" className="form-label">
                      <FiCalendar aria-hidden="true" /> Reservation Date *
                    </label>
                    <DatePicker
                      id="res-date"
                      selected={form.date}
                      onChange={handleDateChange}
                      minDate={minDate}
                      placeholderText="Select a date"
                      dateFormat="MMMM d, yyyy"
                      className={`form-input ${errors.date ? 'form-input--error' : ''}`}
                      aria-required="true"
                      aria-describedby={errors.date ? 'res-date-error' : undefined}
                    />
                    {errors.date && <span id="res-date-error" className="form-error" role="alert">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-time" className="form-label">
                      <FiClock aria-hidden="true" /> Preferred Time *
                    </label>
                    <select
                      id="res-time"
                      name="time"
                      className={`form-input form-select ${errors.time ? 'form-input--error' : ''}`}
                      value={form.time}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.time ? 'res-time-error' : undefined}
                    >
                      <option value="">Select time</option>
                      <optgroup label="Lunch (12 PM – 3 PM)">
                        {TIME_SLOTS.slice(0, 6).map(t => <option key={t} value={t}>{t}</option>)}
                      </optgroup>
                      <optgroup label="Dinner (6 PM – 10 PM)">
                        {TIME_SLOTS.slice(6).map(t => <option key={t} value={t}>{t}</option>)}
                      </optgroup>
                    </select>
                    {errors.time && <span id="res-time-error" className="form-error" role="alert">{errors.time}</span>}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="form-group">
                  <label htmlFor="res-special" className="form-label">
                    <FiMessageSquare aria-hidden="true" /> Special Requests (Optional)
                  </label>
                  <textarea
                    id="res-special"
                    name="specialRequests"
                    className="form-input form-textarea"
                    placeholder="Dietary requirements, allergies, special occasions, seating preferences..."
                    value={form.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                  />
                  <span className="form-char-count">{form.specialRequests.length}/500</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="reservation__submit-btn"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span className="reservation__spinner" aria-hidden="true" />
                      Confirming Reservation...
                    </>
                  ) : (
                    <>
                      <GiKnifeFork aria-hidden="true" />
                      Confirm Reservation
                    </>
                  )}
                </button>

                <p className="reservation__note">
                  By reserving, you agree to our cancellation policy. Please cancel at least 2 hours in advance.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Reservation;
