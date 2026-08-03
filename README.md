<div align="center">

# ⚡ EVENTIX

### *The Future of Event Management*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

**Eventix** is a full-stack, serverless event management platform that lets organizers create, manage, and monetize events — and lets attendees discover and register seamlessly — all powered by Firebase's real-time infrastructure.

[🚀 Get Started](#-quick-start) · [✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [⚙️ Configuration](#️-environment-variables)

</div>

---

## ✨ Features

### 🎟️ Smart Ticketing
Create and sell tickets in real-time with dynamic pricing. The platform integrates **Razorpay** for secure, frictionless payments (INR), and auto-generates a unique ticket ID for every confirmed registration. Supports both free and paid events.

### 📊 Live Analytics Dashboard
Monitor your event in real-time. Charts dynamically reflect ticket sales, revenue, check-in rates, and attendance capacity — all sourced directly from Firestore using **onSnapshot** live listeners.

### ✅ Real-Time Check-Ins
QR code-based attendee verification with live gate tracking. A kanban-style board in the landing page shows who has arrived and who is pending validation — updated the moment a registration changes status.

### 🔔 Automated Notifications
Upon successful payment, **EmailJS** automatically delivers a beautifully formatted confirmation email to the attendee, complete with a unique ticket ID and a QR code link for entry.

### 🛡️ Role-Based Access
- **Public Landing** — Explore events and register without signing in.
- **User Dashboard** — Browse events, register with team/individual options, view personal tickets, and check announcements.
- **Admin Command Center** — Create/delete events with banner uploads (via **ImageKit**), broadcast platform-wide announcements with priority levels, and manage the entire event registry.

### 🌗 Light & Dark Mode
A full theming system (`ThemeContext` + CSS custom properties) allows users to toggle between dark and light modes anywhere in the app, with smooth transitions.

### 🎨 Premium Animations
Built with **Framer Motion** for cinematic page transitions, staggered card reveals, magnetic hover buttons, and scroll-driven animations. The hero section features a custom **OGL light pillar** WebGL shader that reacts to the active theme.

---

## 🏗️ Architecture

```
ServerLess/
├── Backend/                   # Express 5 API Server
│   ├── index.js               # Server entry point
│   │   ├── POST /api/upload        # Image upload via ImageKit (multer)
│   │   └── POST /api/create-order  # Razorpay order creation
│   ├── package.json
│   └── .env                   # Backend secrets
│
├── Frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx            # Router & Provider tree
│   │   ├── firebase.js        # Firebase SDK initialization
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Hero with WebGL light pillar
│   │   │   ├── Section1.jsx           # Live features bento grid
│   │   │   ├── Section2.jsx           # Event discovery & Razorpay checkout
│   │   │   ├── Section3.jsx           # Footer
│   │   │   ├── Auth.jsx               # Sign In / Sign Up
│   │   │   ├── Dashboard.jsx          # User dashboard shell
│   │   │   ├── AdminDashboard.jsx     # Admin command center
│   │   │   └── DashboardViews/
│   │   │       ├── EventsView.jsx         # Browse & register for events
│   │   │       ├── AnnouncementsView.jsx  # Read platform announcements
│   │   │       └── TicketsView.jsx        # View personal tickets
│   │   │
│   │   ├── components/
│   │   │   ├── LightPillar.jsx    # Custom OGL WebGL shader
│   │   │   ├── RippleGrid.jsx     # Animated ripple grid component
│   │   │   ├── Marquee.jsx        # Infinite scrolling text marquee
│   │   │   ├── Sidebar.jsx        # Dashboard navigation sidebar
│   │   │   ├── SmoothScroll.jsx   # Locomotive Scroll wrapper
│   │   │   ├── ThemeToggle.jsx    # Dark/light mode toggle button
│   │   │   ├── ProtectedRoute.jsx # Auth-guarded route HOC
│   │   │   └── AdminRoute.jsx     # Admin-only route guard HOC
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx    # Firebase Auth state & custom hooks
│   │   │   └── ThemeContext.jsx   # Global theme state & custom hooks
│   │   │
│   │   └── services/
│   │       └── registrationService.js  # Firestore registration business logic
│   │
│   ├── package.json
│   └── .env                   # Frontend secrets
│
└── package.json               # Root build & start scripts
```

---

## 🗄️ Firebase Collections

| Collection | Purpose |
|---|---|
| `events` | All event documents (title, date, location, price, seats, image, category) |
| `registrations` | Confirmed bookings (userId, eventId, ticketId, paymentId, status) |
| `tickets` | Issued entry tickets linked to registrations |
| `announcements` | Admin-posted platform-wide messages with priority type |

---

## 🚀 Quick Start

### Prerequisites
- Node.js `>= 18`
- A **Firebase** project (Firestore + Authentication enabled)
- A **Razorpay** account (for payments)
- An **ImageKit** account (for image uploads)
- An **EmailJS** account (for confirmation emails)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eventix.git
cd eventix
```

### 2. Configure Environment Variables

**`Backend/.env`**
```env
PORT=5000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**`Frontend/.env`**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

VITE_EMAIL_SERVICE_ID=your_emailjs_service_id
VITE_EMAIL_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

### 3. Install & Run (Development)

```bash
# Install and start the backend (with nodemon)
cd Backend && npm install && npm run dev

# In a separate terminal — install and start the frontend dev server
cd Frontend && npm install && npm run dev
```

The app will be available at `http://localhost:5173` (Vite) with the backend API at `http://localhost:5000`.

### 4. Build & Run (Production)

```bash
# From the project root — builds frontend and installs all deps
npm run build

# Start the Express server (serves API + compiled frontend SPA)
npm start
```

In production, the Express server serves the compiled React SPA from `Frontend/dist` and handles all API routes with SPA fallback routing.

---

## ⚙️ Environment Variables

### Backend
| Variable | Description |
|---|---|
| `PORT` | Server port (defaults to `5000`) |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | Your ImageKit CDN URL endpoint |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |

### Frontend
| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key (client-side checkout) |
| `VITE_EMAIL_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAIL_TEMPLATE_ID` | EmailJS email template ID |
| `VITE_EMAIL_PUBLIC_KEY` | EmailJS public key |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| **React** | 19 | UI library |
| **Vite** | 8 | Build tool & dev server |
| **React Router** | v7 | Client-side routing |
| **Framer Motion** | 12 | Animations & transitions |
| **OGL / Three.js** | latest | WebGL hero shader (LightPillar) |
| **Locomotive Scroll** | 5 | Smooth scroll & parallax |
| **Firebase SDK** | 12 | Firestore (real-time DB) + Auth |
| **Razorpay Checkout** | v1 | Payment UI |
| **EmailJS** | 4 | Client-side transactional emails |
| **Tailwind CSS** | 3 | Utility-first styling |

### Backend
| Technology | Version | Role |
|---|---|---|
| **Express** | 5 | HTTP API server |
| **Multer** | 2 | Multipart file upload handling |
| **ImageKit** | 6 | Cloud image CDN & storage |
| **Razorpay** | 2 | Payment order creation |
| **dotenv** | 17 | Environment variable management |

---

## 📡 API Endpoints

### `POST /api/upload`
Uploads an event banner image to ImageKit CDN.

- **Request:** `multipart/form-data` with field `image`
- **Response:**
```json
{
  "url": "https://ik.imagekit.io/your_id/event_banners/image.jpg",
  "fileId": "abc123def456"
}
```

---

### `POST /api/create-order`
Creates a Razorpay payment order for event registration.

- **Request Body:**
```json
{
  "amount": 499,
  "currency": "INR",
  "receipt": "rcpt_eventid_userid"
}
```
- **Response:** Full Razorpay order object including `id`, `amount`, `currency`, and `status`.

---

## 🔐 Security & Access Control

- **Firebase Auth** guards all authenticated routes via `ProtectedRoute` and `AdminRoute` higher-order components.
- **Firestore transactions** atomically decrement available seats during registration, preventing race conditions and overbooking.
- **Environment variables** keep all API secrets off the client bundle — backend secrets never reach the browser.
- **Razorpay** payment verification can be added server-side for enhanced production security.

---

## 🗺️ Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page — hero, features bento, event discovery, footer |
| `/signin` | Public | Firebase email/password sign-in |
| `/signup` | Public | Firebase email/password sign-up |
| `/dashboard` | 🔒 Auth Required | User dashboard — Events view (default) |
| `/dashboard/announcements` | 🔒 Auth Required | Platform announcements from admin |
| `/dashboard/tickets` | 🔒 Auth Required | Personal registered tickets |
| `/admin` | 🔑 Admin Only | Create/delete events & broadcast announcements |

---

## 🤝 Contributing

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to your branch: `git push origin feat/amazing-feature`
5. Open a **Pull Request**

---

<div align="center">

Built with ❤️ · Powered by Firebase · Payments by Razorpay

**EVENTIX — Scale. Infinite.**

</div>
