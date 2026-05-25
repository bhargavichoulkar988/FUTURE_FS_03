// ============================================================
// Elite Dine - Email Service
// Handles sending confirmation and notification emails
// using Nodemailer with Gmail SMTP
// ============================================================
const nodemailer = require('nodemailer');

// ============================================================
// Create Nodemailer Transporter
// Uses Gmail SMTP - requires an App Password (not regular password)
// To get App Password: Google Account > Security > 2-Step Verification > App Passwords
// ============================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// ============================================================
// Send Reservation Confirmation Email to Customer
// ============================================================
const sendReservationConfirmation = async (reservationData) => {
  const transporter = createTransporter();

  const { name, email, date, time, guests, specialRequests, bookingRef } = reservationData;

  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"Elite Dine Restaurant" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Reservation Confirmed - ${bookingRef} | Elite Dine`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Georgia', serif; background-color: #f8f5f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: #C9A84C; font-size: 32px; margin: 0; letter-spacing: 3px; }
          .header p { color: #ccc; margin: 8px 0 0; font-style: italic; }
          .body { padding: 40px 30px; }
          .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
          .booking-card { background: #f8f5f0; border-left: 4px solid #C9A84C; padding: 25px; border-radius: 8px; margin: 25px 0; }
          .booking-card h3 { color: #1a1a1a; margin: 0 0 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0d9d0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; font-size: 14px; }
          .detail-value { color: #1a1a1a; font-weight: bold; font-size: 14px; }
          .ref-badge { background: #C9A84C; color: #1a1a1a; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; margin: 15px 0; letter-spacing: 2px; }
          .info-box { background: #fff8e7; border: 1px solid #C9A84C; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-box p { margin: 5px 0; color: #555; font-size: 14px; }
          .footer { background: #1a1a1a; padding: 25px 30px; text-align: center; }
          .footer p { color: #888; font-size: 12px; margin: 5px 0; }
          .footer a { color: #C9A84C; text-decoration: none; }
          .social-links { margin: 15px 0; }
          .social-links a { color: #C9A84C; text-decoration: none; margin: 0 10px; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽 ELITE DINE</h1>
            <p>Where Every Meal is a Masterpiece</p>
          </div>
          <div class="body">
            <p class="greeting">Dear ${name},</p>
            <p style="color: #555; line-height: 1.7;">
              Thank you for choosing Elite Dine! We are delighted to confirm your reservation. 
              We look forward to providing you with an exceptional dining experience.
            </p>

            <div style="text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Your Booking Reference</p>
              <div class="ref-badge">${bookingRef}</div>
            </div>

            <div class="booking-card">
              <h3>📋 Reservation Details</h3>
              <div class="detail-row">
                <span class="detail-label">👤 Guest Name</span>
                <span class="detail-value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📅 Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Time</span>
                <span class="detail-value">${time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">👥 Guests</span>
                <span class="detail-value">${guests} ${guests === 1 ? 'Person' : 'People'}</span>
              </div>
              ${specialRequests ? `
              <div class="detail-row">
                <span class="detail-label">📝 Special Requests</span>
                <span class="detail-value">${specialRequests}</span>
              </div>` : ''}
            </div>

            <div class="info-box">
              <p><strong>📍 Address:</strong> 123 Gourmet Avenue, Fine Dining District, City - 400001</p>
              <p><strong>📞 Phone:</strong> +91 91216 13958</p>
              <p><strong>⏰ Please arrive:</strong> 10 minutes before your reservation time</p>
              <p><strong>❌ Cancellation:</strong> Please cancel at least 2 hours in advance</p>
            </div>

            <p style="color: #555; line-height: 1.7;">
              If you need to modify or cancel your reservation, please contact us at 
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #C9A84C;">${process.env.EMAIL_USER}</a> 
              or call us at +91 91216 13958.
            </p>

            <p style="color: #555;">We look forward to seeing you!</p>
            <p style="color: #1a1a1a; font-weight: bold;">Warm regards,<br>The Elite Dine Team 🍽</p>
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
            <p>© 2024 Elite Dine Restaurant. All rights reserved.</p>
            <p>123 Gourmet Avenue, Fine Dining District | +91 91216 13958</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// ============================================================
// Send Reservation Notification Email to Restaurant Admin
// ============================================================
const sendAdminReservationNotification = async (reservationData) => {
  const transporter = createTransporter();

  const { name, email, phone, date, time, guests, specialRequests, bookingRef } = reservationData;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"Elite Dine System" <${process.env.EMAIL_USER}>`,
    to: 'bhargavichoulkar988@gmail.com', // Admin notification email
    subject: `🔔 New Reservation: ${bookingRef} - ${name} (${guests} guests) on ${formattedDate}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #1a1a1a; padding: 25px; text-align: center; }
          .header h1 { color: #C9A84C; margin: 0; font-size: 22px; }
          .header p { color: #aaa; margin: 5px 0 0; font-size: 13px; }
          .alert-badge { background: #C9A84C; color: #1a1a1a; text-align: center; padding: 12px; font-weight: bold; font-size: 15px; }
          .body { padding: 30px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 12px 15px; border-bottom: 1px solid #eee; font-size: 14px; }
          td:first-child { color: #666; width: 40%; font-weight: bold; }
          td:last-child { color: #1a1a1a; }
          .ref { background: #f8f5f0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .ref span { font-size: 20px; font-weight: bold; color: #C9A84C; letter-spacing: 2px; }
          .action-btn { display: block; background: #C9A84C; color: #1a1a1a; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; font-size: 15px; }
          .footer { background: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽 ELITE DINE - Admin Panel</h1>
            <p>New Reservation Notification</p>
          </div>
          <div class="alert-badge">
            🔔 NEW TABLE RESERVATION RECEIVED
          </div>
          <div class="body">
            <div class="ref">
              <p style="margin: 0 0 5px; color: #666; font-size: 13px;">Booking Reference</p>
              <span>${bookingRef}</span>
            </div>

            <table>
              <tr>
                <td>👤 Customer Name</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td>📧 Email</td>
                <td><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td>
              </tr>
              <tr>
                <td>📞 Phone</td>
                <td><a href="tel:${phone}" style="color: #C9A84C;">${phone}</a></td>
              </tr>
              <tr>
                <td>📅 Date</td>
                <td><strong>${formattedDate}</strong></td>
              </tr>
              <tr>
                <td>🕐 Time</td>
                <td><strong>${time}</strong></td>
              </tr>
              <tr>
                <td>👥 Number of Guests</td>
                <td><strong>${guests} ${guests === 1 ? 'Person' : 'People'}</strong></td>
              </tr>
              <tr>
                <td>📝 Special Requests</td>
                <td>${specialRequests || 'None'}</td>
              </tr>
              <tr>
                <td>⏰ Submitted At</td>
                <td>${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</td>
              </tr>
            </table>

            <p style="color: #555; font-size: 14px; margin-top: 20px;">
              Please confirm this reservation and prepare the table accordingly. 
              The customer has been sent an automatic confirmation email.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Elite Dine Reservation System</p>
            <p>© 2024 Elite Dine Restaurant</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// ============================================================
// Send Contact Form Notification to Admin
// ============================================================
const sendContactNotification = async (contactData) => {
  const transporter = createTransporter();

  const { name, email, subject, message } = contactData;

  const mailOptions = {
    from: `"Elite Dine Contact Form" <${process.env.EMAIL_USER}>`,
    to: 'bhargavichoulkar988@gmail.com',
    subject: `📩 New Contact Message: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; }
          .header { background: #1a1a1a; padding: 20px; text-align: center; }
          .header h1 { color: #C9A84C; margin: 0; font-size: 20px; }
          .body { padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .value { font-size: 15px; color: #333; padding: 12px; background: #f8f5f0; border-radius: 6px; border-left: 3px solid #C9A84C; }
          .message-box { background: #f8f5f0; padding: 20px; border-radius: 8px; border-left: 4px solid #C9A84C; line-height: 1.7; color: #333; }
          .footer { background: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 New Contact Message - Elite Dine</h1>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${name} &lt;<a href="mailto:${email}" style="color: #C9A84C;">${email}</a>&gt;</div>
            </div>
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <p style="color: #888; font-size: 13px;">
              Received at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST
            </p>
          </div>
          <div class="footer">
            <p>Elite Dine Contact Form Notification</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// ============================================================
// Send Auto-Reply to Contact Form Submitter
// ============================================================
const sendContactAutoReply = async (contactData) => {
  const transporter = createTransporter();

  const { name, email, subject } = contactData;

  const mailOptions = {
    from: `"Elite Dine Restaurant" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Re: ${subject} - We've received your message`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Georgia, serif; background: #f8f5f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: #1a1a1a; padding: 35px; text-align: center; }
          .header h1 { color: #C9A84C; margin: 0; font-size: 28px; letter-spacing: 3px; }
          .body { padding: 40px 30px; }
          .footer { background: #1a1a1a; padding: 20px; text-align: center; }
          .footer p { color: #888; font-size: 12px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽 ELITE DINE</h1>
          </div>
          <div class="body">
            <p style="font-size: 18px; color: #333;">Dear ${name},</p>
            <p style="color: #555; line-height: 1.8;">
              Thank you for reaching out to Elite Dine! We have received your message regarding 
              "<strong>${subject}</strong>" and our team will get back to you within 24 hours.
            </p>
            <p style="color: #555; line-height: 1.8;">
              In the meantime, if you have an urgent inquiry, please don't hesitate to call us at 
              <strong>+91 91216 13958</strong>.
            </p>
            <p style="color: #555;">We appreciate your interest in Elite Dine.</p>
            <p style="color: #1a1a1a; font-weight: bold;">Warm regards,<br>The Elite Dine Team 🍽</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Dine Restaurant. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendReservationConfirmation,
  sendAdminReservationNotification,
  sendContactNotification,
  sendContactAutoReply
};
