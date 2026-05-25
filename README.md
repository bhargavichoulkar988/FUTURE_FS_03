# 🍽 Elite Dine — Restaurant Website

A full-stack, professional restaurant website built with **React.js**, **Node.js**, and **MongoDB**.

---

## ✨ Features

| Feature | Details |
|---|---|
| Responsive Design | Mobile, tablet, and desktop |
| Hero Banner | Full-screen with animated entrance and stats |
| Featured Dishes | API-driven with fallback data |
| Interactive Menu | Category filters + live search |
| Special Offers | Combo packages with savings badges |
| Image Gallery | Masonry grid with lightbox |
| Table Reservation | Full form with date picker, email confirmation |
| Testimonials | Auto-advancing carousel |
| Contact Form | With Google Maps embed |
| Social Media | Facebook, Instagram, Twitter, Yelp, TripAdvisor |
| Dark / Light Theme | Persisted in localStorage |
| Smooth Scrolling | Navbar with active section tracking |
| Animations | Framer Motion throughout |
| Email Notifications | Booking confirmation → customer + admin |
| SEO | Meta tags, Open Graph, Twitter Card |

---

## 🗂 Project Structure

```
elitedine/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html       # SEO meta tags, Google Fonts
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx / .css
│       │   ├── Hero.jsx / .css
│       │   ├── FeaturedDishes.jsx / .css
│       │   ├── About.jsx / .css
│       │   ├── Menu.jsx / .css
│       │   ├── SpecialOffers.jsx / .css
│       │   ├── Gallery.jsx / .css
│       │   ├── Reservation.jsx / .css
│       │   ├── Testimonials.jsx / .css
│       │   ├── Contact.jsx / .css
│       │   └── Footer.jsx / .css
│       ├── context/
│       │   └── ThemeContext.jsx
│       ├── App.jsx
│       ├── index.js
│       └── index.css        # Global styles + CSS variables
│
└── server/                  # Node.js + Express backend
    ├── models/
    │   ├── Reservation.js
    │   ├── Contact.js
    │   └── MenuItem.js
    ├── routes/
    │   ├── reservations.js
    │   ├── contact.js
    │   └── menu.js
    ├── utils/
    │   └── emailService.js  # Nodemailer (Gmail SMTP)
    ├── data/
    │   └── seedMenu.js      # 25 menu items seed script
    ├── index.js             # Express server entry
    └── .env                 # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Gmail account with App Password enabled

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elitedine
EMAIL_USER=bhargavichoulkar988@gmail.com
EMAIL_PASS=your_gmail_app_password_here
NODE_ENV=development
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

### 3. Seed the Menu Database

```bash
cd server
node data/seedMenu.js
```

This inserts 25 menu items across 5 categories.

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📧 Email Flow

| Event | Recipient | Content |
|---|---|---|
| New Reservation | Customer | Booking confirmation with reference number |
| New Reservation | Admin (bhargavichoulkar988@gmail.com) | Full booking details |
| Contact Form | Admin | Customer message |
| Contact Form | Customer | Auto-reply acknowledgment |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/menu` | All menu items (supports `?category=`, `?search=`, `?featured=true`) |
| GET | `/api/menu/categories` | List of all categories |
| POST | `/api/reservations` | Create a reservation |
| GET | `/api/reservations` | List all reservations |
| PATCH | `/api/reservations/:id/status` | Update reservation status |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | List all contact messages |

---

## 🎨 Design System

- **Primary Color:** `#C9A84C` (Gold)
- **Accent:** `#8B0000` (Deep Red)
- **Heading Font:** Playfair Display (Google Fonts)
- **Body Font:** Lato (Google Fonts)
- **Dark/Light:** CSS custom properties with `data-theme` attribute

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `> 1024px` | Desktop |
| `768px – 1024px` | Tablet |
| `< 768px` | Mobile |
| `< 480px` | Small Mobile |
