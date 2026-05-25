// ============================================================
// Elite Dine - Admin Routes
// View all reservations and contact messages from MongoDB
// Access: http://localhost:5000/api/admin/reservations
//         http://localhost:5000/api/admin/contacts
// ============================================================
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Contact = require('../models/Contact');

// ============================================================
// GET /api/admin/reservations
// View all reservations in a clean HTML page
// ============================================================
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .lean();

    const rows = reservations.map(r => `
      <tr>
        <td><strong>${r.bookingRef}</strong></td>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.phone}</td>
        <td>${new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
        <td>${r.time}</td>
        <td>${r.guests}</td>
        <td>${r.specialRequests || '-'}</td>
        <td><span class="badge badge-${r.status}">${r.status.toUpperCase()}</span></td>
        <td>${new Date(r.createdAt).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Elite Dine — Reservations</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; background: #f8f5f0; color: #2c2c2c; }
          .header { background: #1a1a1a; padding: 20px 30px; display: flex; align-items: center; justify-content: space-between; }
          .header h1 { color: #C9A84C; font-size: 1.4rem; }
          .header a { color: #C9A84C; text-decoration: none; font-size: 0.9rem; border: 1px solid #C9A84C; padding: 6px 14px; border-radius: 20px; }
          .header a:hover { background: #C9A84C; color: #1a1a1a; }
          .container { padding: 30px; max-width: 1400px; margin: 0 auto; }
          .stats { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
          .stat-card { background: #fff; border-radius: 10px; padding: 16px 24px; border-left: 4px solid #C9A84C; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .stat-card .num { font-size: 1.8rem; font-weight: 700; color: #C9A84C; }
          .stat-card .label { font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
          .table-wrap { background: #fff; border-radius: 12px; overflow: auto; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
          table { width: 100%; border-collapse: collapse; min-width: 900px; }
          th { background: #1a1a1a; color: #C9A84C; padding: 12px 14px; text-align: left; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; }
          td { padding: 12px 14px; border-bottom: 1px solid #f0ebe3; font-size: 0.88rem; vertical-align: top; }
          tr:hover td { background: #fef9f0; }
          .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
          .badge-pending { background: #fff3cd; color: #856404; }
          .badge-confirmed { background: #d1e7dd; color: #0a3622; }
          .badge-cancelled { background: #f8d7da; color: #842029; }
          .badge-completed { background: #cfe2ff; color: #084298; }
          .empty { text-align: center; padding: 60px; color: #888; }
          h2 { margin-bottom: 20px; color: #2c2c2c; font-size: 1.1rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🍽 Elite Dine — Reservations</h1>
          <a href="/api/admin/contacts">📩 View Contact Messages</a>
        </div>
        <div class="container">
          <div class="stats">
            <div class="stat-card">
              <div class="num">${reservations.length}</div>
              <div class="label">Total Reservations</div>
            </div>
            <div class="stat-card">
              <div class="num">${reservations.filter(r => r.status === 'pending').length}</div>
              <div class="label">Pending</div>
            </div>
            <div class="stat-card">
              <div class="num">${reservations.filter(r => r.status === 'confirmed').length}</div>
              <div class="label">Confirmed</div>
            </div>
            <div class="stat-card">
              <div class="num">${reservations.filter(r => {
                const today = new Date(); today.setHours(0,0,0,0);
                const d = new Date(r.date); d.setHours(0,0,0,0);
                return d.getTime() === today.getTime();
              }).length}</div>
              <div class="label">Today</div>
            </div>
          </div>
          <h2>All Reservations (newest first)</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Special Requests</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="10" class="empty">No reservations yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<h2>Error: ${err.message}</h2>`);
  }
});

// ============================================================
// GET /api/admin/contacts
// View all contact messages in a clean HTML page
// ============================================================
router.get('/contacts', async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    const rows = messages.map(m => `
      <tr>
        <td>${m.name}</td>
        <td>${m.email}</td>
        <td><strong>${m.subject}</strong></td>
        <td style="max-width:300px; white-space:pre-wrap;">${m.message}</td>
        <td><span class="badge ${m.isRead ? 'badge-read' : 'badge-unread'}">${m.isRead ? 'READ' : 'NEW'}</span></td>
        <td>${new Date(m.createdAt).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Elite Dine — Contact Messages</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; background: #f8f5f0; color: #2c2c2c; }
          .header { background: #1a1a1a; padding: 20px 30px; display: flex; align-items: center; justify-content: space-between; }
          .header h1 { color: #C9A84C; font-size: 1.4rem; }
          .header a { color: #C9A84C; text-decoration: none; font-size: 0.9rem; border: 1px solid #C9A84C; padding: 6px 14px; border-radius: 20px; }
          .header a:hover { background: #C9A84C; color: #1a1a1a; }
          .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
          .stats { display: flex; gap: 16px; margin-bottom: 24px; }
          .stat-card { background: #fff; border-radius: 10px; padding: 16px 24px; border-left: 4px solid #C9A84C; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .stat-card .num { font-size: 1.8rem; font-weight: 700; color: #C9A84C; }
          .stat-card .label { font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
          .table-wrap { background: #fff; border-radius: 12px; overflow: auto; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
          table { width: 100%; border-collapse: collapse; }
          th { background: #1a1a1a; color: #C9A84C; padding: 12px 14px; text-align: left; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; }
          td { padding: 12px 14px; border-bottom: 1px solid #f0ebe3; font-size: 0.88rem; vertical-align: top; }
          tr:hover td { background: #fef9f0; }
          .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
          .badge-unread { background: #fff3cd; color: #856404; }
          .badge-read { background: #d1e7dd; color: #0a3622; }
          .empty { text-align: center; padding: 60px; color: #888; }
          h2 { margin-bottom: 20px; color: #2c2c2c; font-size: 1.1rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🍽 Elite Dine — Contact Messages</h1>
          <a href="/api/admin/reservations">📋 View Reservations</a>
        </div>
        <div class="container">
          <div class="stats">
            <div class="stat-card">
              <div class="num">${messages.length}</div>
              <div class="label">Total Messages</div>
            </div>
            <div class="stat-card">
              <div class="num">${messages.filter(m => !m.isRead).length}</div>
              <div class="label">Unread</div>
            </div>
          </div>
          <h2>All Contact Messages (newest first)</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Received At</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="6" class="empty">No messages yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<h2>Error: ${err.message}</h2>`);
  }
});

module.exports = router;
