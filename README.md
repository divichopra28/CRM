# Divi CRM

A lightweight CRM (Customer Relationship Management) application for managing leads, tracking statuses, and recording follow-up notes. Built with a Node.js/Express backend, MongoDB database, and a vanilla HTML/CSS/JS frontend.

## Features

- **Password-protected admin login**
- **Lead management** — create, view, update, and delete leads
- **Status tracking** — categorize leads as `new`, `contacted`, or `converted`
- **Follow-up notes** — append timestamped notes to any lead
- **Status filtering** — filter the lead list by status
- **Responsive frontend** served directly by the Express server

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Backend  | Node.js, Express 5          |
| Database | MongoDB (via Mongoose 9)    |
| Frontend | HTML, CSS, vanilla JS       |
| Auth     | Simple token-based (Bearer) |

## Project Structure

```
backend/
  index.js            # Express server entry point
  package.json
  middleware/
    auth.js           # Bearer-token auth middleware
  models/
    Lead.js           # Mongoose lead & follow-up schemas
  routes/
    authRoutes.js     # POST /api/auth/login
    leadRoutes.js     # CRUD + follow-up routes for leads
frontend/
  login.html          # Admin login page
  login.js
  dashboard.html      # Lead management dashboard
  dashboard.js
  styles.css
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd divi-crm-only
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Create a `.env` file** in the `backend/` directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/divi-crm
   ADMIN_PASSWORD=your_admin_password
   PORT=5000
   ```

4. **Start the server**

   ```bash
   # Development (auto-restart on changes)
   npm run dev

   # Production
   npm start
   ```

5. **Open the app** — navigate to `http://localhost:5000` in your browser.

## API Reference

All `/api/leads` routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | `/api/auth/login` | Login with admin password |

### Leads

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/leads`              | List all leads (optional `?status=` filter) |
| GET    | `/api/leads/:id`          | Get a single lead        |
| POST   | `/api/leads`              | Create a new lead        |
| PUT    | `/api/leads/:id`          | Update a lead            |
| DELETE | `/api/leads/:id`          | Delete a lead            |
| POST   | `/api/leads/:id/followup` | Add a follow-up note     |

## License
    login password - admin123
ISC
