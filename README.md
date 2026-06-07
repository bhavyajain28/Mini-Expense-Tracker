# Mini Expense Tracker

## Project Title & Brief Description

Mini Expense Tracker is a full-stack web application built to help users track daily expenses, manage category-wise budgets, and analyze spending habits through interactive dashboards and visualizations. The project was developed as a production-ready expense management solution featuring expense CRUD operations, analytics, budget tracking, filtering, CSV export, and responsive UI support.

---

## Live Demo Links

**Frontend:** https://gentle-forest-0a3cd2f00.7.azurestaticapps.net/

**Backend API:** https://expense-tracker-eme7g4ghdkggg7f2.eastasia-01.azurewebsites.net

---

## Tech Stack

### Frontend
- React.js – Component-based UI development
- Vite – Fast development and build tool
- React Router – Client-side routing
- Tailwind CSS – Responsive styling
- Recharts – Data visualization and analytics charts
- Axios – API communication

### Backend
- Node.js – Runtime environment
- Express.js – REST API framework
- express-validator – Request validation
- UUID – Unique ID generation

### Storage
- JSON File Storage – Lightweight persistence for expenses and budgets

### Testing
- Vitest
- React Testing Library
- Supertest

### Deployment
- Azure Static Web Apps (Frontend)
- Azure App Service (Backend)

---

## How to Run Locally

### Prerequisites

- Node.js (v18 or later)

### Clone Repository

```bash
git clone https://github.com/bhavyajain28/Mini-Expense-Tracker.git
cd Mini-Expense-Tracker
```

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### Frontend Setup

Open a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Update the .env file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Documentation

### Base URL

```text
http://localhost:5000
```

### Health Check

#### GET /health

Response

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

---

### Expenses

#### GET /api/expenses

Returns all expenses.

#### GET /api/expenses/:id

Returns a single expense.

#### POST /api/expenses

Request

```json
{
  "amount": 500,
  "category": "Food",
  "date": "2026-01-01",
  "note": "Lunch"
}
```

Response

```json
{
  "success": true,
  "data": {}
}
```

#### PUT /api/expenses/:id

Updates an existing expense.

#### DELETE /api/expenses/:id

Deletes an expense.

---

### Budgets

#### GET /api/budgets

Returns all budgets.

#### POST /api/budgets

Request

```json
{
  "category": "Food",
  "amount": 5000
}
```

Response

```json
{
  "success": true,
  "data": {}
}
```

#### PUT /api/budgets/:category

Updates a budget.

#### DELETE /api/budgets/:category

Deletes a budget.

### Standard Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Project Structure

```text
mini-expense-tracker/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── data/
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

### Folder Overview

- client/ → React frontend application
- server/ → Express backend API
- controllers/ → Route handling logic
- services/ → Business logic
- routes/ → API endpoints
- middleware/ → Validation and error handling
- data/ → JSON-based persistence storage

---

## Next Steps

The following features were intentionally left out to keep the project focused and manageable:

- User Authentication & Authorization
- Multi-user expense management
- Database migration to PostgreSQL or MongoDB
- Recurring expenses
- PDF export support
- Email budget alerts
- Dark mode
- Mobile application version
- Bank statement import

Future development would focus on authentication, cloud database integration, recurring transactions, and advanced financial reporting.

---

## Acknowledgements

This project was designed, implemented, and deployed by the author. During development, AI-assisted tools were used for guidance, documentation refinement, deployment troubleshooting, and best-practice recommendations. In particular, Claude AI was used to help improve the README structure and assist with Azure deployment-related guidance. All final implementation decisions, code integration, testing, and deployment were completed by the author.
