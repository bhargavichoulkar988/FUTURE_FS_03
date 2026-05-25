// ============================================================
// Elite Dine - Contact Section
// Saves to MongoDB + sends email via EmailJS
// ============================================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone, FiMail, FiClock, FiSend,
  FiUser, FiMessageSquare, FiAlignLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './Contact.css';

const CONTACT_INFO = [
  {
    icon: <FiPhone size={22} />,
    title: 'Phone',
    lines: ['+91 91216 13958'],
  },
  {
    icon: <FiMail size={22} />,
    title: 'Email',
    lines: ['bhargavichoulkar988@gmail.com'],
  },
  {
    icon: <FiClock size={22} />,
    title: 'Opening Hours',
    lines: ['Mon – Fri: 12 PM – 11 PM', 'Sat – Sun: 11 AM – 11 PM'],
  },
];

const initialForm = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email.';
    if (!form.subject.trim() || form.subject.trim().length < 3) errs.subject = 'Subject must be at least 3 characters.';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
      // 1. Save to MongoDB via backend
      const res = await axios.post('/api/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      if (res.data.success) {
        // 2. Send email notification to bhargavichoulkar988@gmail.com via EmailJS
        emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_CONTACT_TEMPLATE_ID,
          {
            to_email:   'bhargavichoulkar988@gmail.com',
            from_name:  form.name.trim(),
            from_email: form.email.trim(),
            subject:    form.subject.trim(),
            message:    form.message.trim(),
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        ).catch(err => console.warn('Email notification failed:', err));

        setSent(true);
        setForm(initialForm);
        toast.success("Message sent! We'll get back to you within 24 hours.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact section" aria-labelledby="contact-title">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Get in Touch</span>
          <h2 className="section-title" id="contact-title">Contact Us</h2>
          <div className="divider" />
          <p className="section-description">
            Have a question or special request? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="contact__layout">
          {/* Left: Info only */}
          <motion.div
            className="contact__info-col"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Info Cards */}
            <div className="contact__info-cards">
              {CONTACT_INFO.map((info, i) => (
                <div key={i} className="contact__info-card">
                  <div className="contact__info-icon" aria-hidden="true">{info.icon}</div>
                  <div>
                    <h4 className="contact__info-title">{info.title}</h4>
                    {info.lines.map((line, j) => (
                      <p key={j} className="contact__info-line">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            className="contact__form-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {sent ? (
              <div className="contact__success">
                <div className="contact__success-icon">✉️</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button className="btn-primary" onClick={() => setSent(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <h3 className="contact__form-title">Send Us a Message</h3>

                {/* Name */}
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    <FiUser aria-hidden="true" /> Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    aria-required="true"
                  />
                  {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    <FiMail aria-hidden="true" /> Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-required="true"
                  />
                  {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">
                    <FiMessageSquare aria-hidden="true" /> Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    className={`form-input ${errors.subject ? 'form-input--error' : ''}`}
                    placeholder="Reservation inquiry, feedback..."
                    value={form.subject}
                    onChange={handleChange}
                    aria-required="true"
                  />
                  {errors.subject && <span className="form-error" role="alert">{errors.subject}</span>}
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">
                    <FiAlignLeft aria-hidden="true" /> Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    maxLength={2000}
                    aria-required="true"
                  />
                  {errors.message && <span className="form-error" role="alert">{errors.message}</span>}
                  <span className="form-char-count">{form.message.length}/2000</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="contact__submit-btn"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span className="reservation__spinner" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
