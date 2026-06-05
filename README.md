# Mini Expense Tracker

A production-ready full-stack web application for tracking daily expenses, analyzing spending patterns, managing category budgets, and visualizing financial data.

---

## Features

### Core
- **Expense CRUD** — Create, read, update, and delete expenses
- **Expense Fields** — Amount, Category, Date, optional Note
- **Category Filtering** — Filter by category and date range
- **Persistent Filters** — Last used filters saved to localStorage

### Analytics Dashboard
- Total spent this month
- Highest expense
- Total spending by category
- Category pie chart and bar chart

### Budget Management
- Set monthly budgets per category
- Real-time budget vs. spend progress bars
- Visual warnings for near-limit and exceeded budgets

### Export
- CSV export of currently filtered expenses

### UI
- Mobile-first responsive design (mobile, tablet, desktop)
- Skeleton loaders during data fetch
- Empty states and error states
- Modern SaaS-style card-based dashboard

---

## Screenshots

| Dashboard | Expenses | Analytics | Budgets |
|-----------|----------|-----------|---------|
| _(add screenshot)_ | _(add screenshot)_ | _(add screenshot)_ | _(add screenshot)_ |

---

## Architecture

```
mini-expense-tracker/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── api/              # Axios API layer
│       ├── components/       # Reusable UI components
│       │   ├── shared/       # Button, Card, Modal, Input, Badge, Skeleton
│       │   ├── expenses/     # ExpenseForm, ExpenseTable, ExpenseModal, ExpenseFilters
│       │   ├── analytics/    # Charts, AnalyticsCard
│       │   └── budget/       # BudgetCard, BudgetForm, BudgetProgress
│       ├── hooks/            # useExpenses, useFilters, useAnalytics, useBudgets
│       ├── layouts/          # AppLayout, Sidebar
│       ├── pages/            # Dashboard, Expenses, Analytics, Budgets, NotFound
│       ├── routes/           # React Router config
│       └── utils/            # currency, date, csv, categories
│
└── server/                   # Node.js + Express backend
    └── src/
        ├── config/           # Environment config
        ├── controllers/      # Route handlers
        ├── services/         # Business logic
        ├── middleware/       # Error, validation, notFound
        ├── routes/           # Express routers
        ├── utils/            # response helpers, file store
        └── data/             # expenses.json, budgets.json (JSON persistence)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, React Router, Tailwind CSS |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Node.js, Express |
| Validation | express-validator |
| IDs | UUID |
| Persistence | JSON files |
| Testing | Vitest, React Testing Library, Supertest |
| Containers | Docker, Docker Compose |
| Deployment | Azure Static Web Apps (frontend), Azure App Service (backend) |

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### Frontend

```bash
cd client
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev
```

App opens at `http://localhost:5173`

---

## Docker Setup

### Development

```bash
docker compose up --build
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:5000`

### Production

```bash
# Create .env with:
# API_URL=https://your-backend-url.azurewebsites.net
# CLIENT_URL=https://your-frontend.azurestaticapps.net

docker compose -f docker-compose.prod.yml up --build
```

---

## Azure Deployment

### Backend — Azure App Service (Container)

1. **Create Resource Group**
   ```bash
   az group create --name expense-tracker-rg --location eastus
   ```

2. **Create Container Registry**
   ```bash
   az acr create --resource-group expense-tracker-rg \
     --name expensetrackercr --sku Basic
   az acr login --name expensetrackercr
   ```

3. **Build and Push Backend Image**
   ```bash
   cd server
   docker build -t expensetrackercr.azurecr.io/expense-server:latest .
   docker push expensetrackercr.azurecr.io/expense-server:latest
   ```

4. **Create App Service Plan**
   ```bash
   az appservice plan create --name expense-tracker-plan \
     --resource-group expense-tracker-rg --sku B1 --is-linux
   ```

5. **Deploy Backend**
   ```bash
   az webapp create --resource-group expense-tracker-rg \
     --plan expense-tracker-plan \
     --name expense-tracker-api \
     --deployment-container-image-name expensetrackercr.azurecr.io/expense-server:latest
   ```

6. **Set Backend Environment Variables**
   ```bash
   az webapp config appsettings set \
     --resource-group expense-tracker-rg \
     --name expense-tracker-api \
     --settings \
       PORT=5000 \
       NODE_ENV=production \
       ALLOWED_ORIGIN=https://your-frontend.azurestaticapps.net
   ```

### Frontend — Azure Static Web Apps

1. **Build Frontend**
   ```bash
   cd client
   VITE_API_BASE_URL=https://expense-tracker-api.azurewebsites.net npm run build
   ```

2. **Deploy via Azure CLI**
   ```bash
   az staticwebapp create \
     --name expense-tracker-frontend \
     --resource-group expense-tracker-rg \
     --source ./client/dist \
     --location eastus
   ```

   Or deploy via GitHub Actions by connecting your repository in the Azure Portal.

---

## API Documentation

### Base URL
`http://localhost:5000`

### Health

```
GET /health
→ { success: true, data: { status: "ok", timestamp: "..." } }
```

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | List all expenses |
| GET | /api/expenses/:id | Get single expense |
| POST | /api/expenses | Create expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |

**POST /api/expenses body:**
```json
{
  "amount": 45.50,
  "category": "Food",
  "date": "2024-01-15",
  "note": "Lunch"
}
```

**Validation rules:**
- `amount` — required, positive number
- `category` — required, must be: Food, Transport, Housing, Entertainment, Healthcare, Shopping, Education, Other
- `date` — required, ISO date, cannot be in the future
- `note` — optional string

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/budgets | List all budgets |
| POST | /api/budgets | Create/update budget |
| PUT | /api/budgets/:category | Update budget amount |
| DELETE | /api/budgets/:category | Remove budget |

### Response Format

**Success:**
```json
{ "success": true, "data": {} }
```

**Error:**
```json
{ "success": false, "message": "Error message" }
```

---

## Testing

### Backend Tests

```bash
cd server
npm test
```

Tests cover:
- GET /health
- Expense CRUD (all endpoints)
- Validation: negative amount, future date, missing category
- Budget CRUD

### Frontend Tests

```bash
cd client
npm test
```

Tests cover:
- ExpenseForm rendering
- Form validation (amount, category)
- Submit with correct data
- Initial values when editing
- Analytics calculation logic

---

## Future Improvements

- Authentication and multi-user support
- Recurring expenses
- Multiple currencies
- Dark mode
- Mobile native app (React Native)
- Export to PDF
- Email budget alerts
- Bank CSV import
- PostgreSQL backend for scale
- GraphQL API
