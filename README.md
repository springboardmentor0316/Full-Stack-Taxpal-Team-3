# 💰 TaxPal - Personal Finance & Tax Management System

A full-stack web application for comprehensive personal finance management with intelligent tax estimation capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.2.4-blue)
![MongoDB](https://img.shields.io/badge/mongodb-9.2.1-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## 🌟 Overview

TaxPal is a comprehensive financial management platform that helps users track their income and expenses, manage budgets, estimate taxes, and generate detailed financial reports. With multi-country tax support and intelligent categorization, TaxPal simplifies personal finance management.

---

## ✨ Features

### 🔐 Authentication & Security

- **User Registration** - Secure account creation with email verification
- **Email Verification** - OTP-based email verification system
- **Secure Login** - JWT token-based authentication with bcrypt password encryption
- **Forgot Password** - OTP-based password recovery
- **Reset Password** - Secure password reset functionality
- **Session Management** - Token-based authorization middleware

### 💳 Transaction Management

- **Income Tracking** - Record and manage all income sources
- **Expense Tracking** - Track daily expenses with detailed categorization
- **Transaction History** - View complete transaction history with sorting
- **CRUD Operations** - Create, read, update, and delete transactions
- **Category Assignment** - Organize transactions by custom categories
- **Date Tracking** - Maintain accurate transaction timelines
- **Notes & Descriptions** - Add detailed notes to each transaction

### 📊 Budget Management

- **Create Budgets** - Set monthly budgets for different categories
- **Budget Tracking** - Monitor spending against budgeted amounts
- **Budget Analytics** - Visualize budget utilization
- **Multi-Category Support** - Manage budgets across multiple expense categories
- **Monthly Planning** - Plan budgets on a monthly basis

### 🏷️ Category Management

- **Custom Categories** - Create personalized income and expense categories
- **Category Types** - Separate categories for income and expenses
- **Category Organization** - View and manage all categories in one place
- **Category Deletion** - Remove unused categories

### 💰 Tax Estimation

- **Quarterly Tax Calculation** - Calculate estimated quarterly taxes
- **Multi-Country Support** - Tax calculations for India and USA
- **Tax Slabs** - Country-specific tax bracket implementation
  - **India:** Progressive tax rates (0%, 5%, 20%, 30%)
  - **USA:** Progressive tax rates (10%, 12%, 22%, 24%)
- **Quarterly Due Dates** - Track tax payment deadlines by country
- **Income-Based Estimation** - Automatic tax calculation based on income data
- **Tax History** - View past tax estimates

### 📈 Report Generation

- **Expense Summary Reports** - Detailed breakdown of expenses by category
- **Income Summary Reports** - Comprehensive income analysis
- **Overall Summary Reports** - Complete financial overview
- **PDF Export** - Generate professional PDF reports with TaxPal branding
- **CSV Export** - Export data in CSV format for further analysis
- **Report History** - Access previously generated reports
- **Date Range Selection** - Generate reports for specific time periods
- **Visual Formatting** - Well-formatted reports with totals and currency formatting

### 📧 Email Service

- **OTP Delivery** - Send verification codes via email
- **SMTP Integration** - Nodemailer-powered email system
- **Purpose-Based Emails** - Context-specific email templates
- **Secure Configuration** - Environment-based email credentials

### 📱 User Interface

- **Dashboard** - Overview of financial status and key metrics
- **Responsive Design** - Mobile-friendly interface
- **Interactive Charts** - Visual representation of spending patterns using Chart.js and Recharts
- **Sidebar Navigation** - Easy access to all features
- **Modal Forms** - User-friendly data entry for transactions and budgets
- **Settings Management** - Configure profile, notifications, and security settings

### 🔧 Additional Features

- **User Profiles** - Manage personal information and preferences
- **Notifications** - Stay updated with financial alerts
- **Security Settings** - Control account security preferences
- **Income Bracket Tracking** - Categorize users by income levels (Low, Middle, High)
- **Country Selection** - Multi-country support for localized features
- **Timestamps** - Automatic tracking of creation and modification dates

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcrypt/bcryptjs** | Password hashing |
| **Nodemailer** | Email service |
| **PDFKit** | PDF generation |
| **dotenv** | Environment configuration |
| **CORS** | Cross-origin resource sharing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool and dev server |
| **React Router DOM** | Client-side routing |
| **Chart.js** | Data visualization |
| **Recharts** | React chart library |
| **React Icons** | Icon components |
| **ES Toolkit** | Utility functions |

---

## 📁 Project Structure

```
Full-Stack-Taxpal-Team-3/
│
├── Backend/
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   │
│   ├── controllers/                 # Business logic
│   │   ├── userController.js        # User auth & management
│   │   ├── transactionController.js # Income/Expense operations
│   │   ├── budgetController.js      # Budget CRUD operations
│   │   ├── categoryController.js    # Category management
│   │   ├── taxController.js         # Tax calculations
│   │   └── reportController.js      # Report generation
│   │
│   ├── models/                      # Database schemas
│   │   ├── User.js                  # User schema with OTP fields
│   │   ├── Transaction.js           # Transaction schema
│   │   ├── Budget.js                # Budget schema
│   │   ├── Category.js              # Category schema
│   │   ├── TaxEstimate.js           # Tax estimate schema
│   │   └── Report.js                # Report metadata schema
│   │
│   ├── routes/                      # API endpoints
│   │   ├── userRoutes.js            # /api/users
│   │   ├── transactionRoutes.js     # /api/transactions
│   │   ├── budgetRoutes.js          # /api/budgets
│   │   ├── categoryRoutes.js        # /api/categories
│   │   ├── taxRoutes.js             # /api/tax
│   │   └── reportRoutes.js          # /api/reports
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js        # JWT verification
│   │
│   ├── utils/                       # Helper functions
│   │   ├── auth.js                  # Password hashing utilities
│   │   ├── calculateTax.js          # Tax calculation logic
│   │   ├── config.js                # App configuration
│   │   ├── csvGenerator.js          # CSV file generation
│   │   ├── db.js                    # Database connection
│   │   ├── email.js                 # Email sending service
│   │   ├── pdfGenerator.js          # PDF report generation
│   │   ├── quarterlyDuedates.js     # Tax due dates by country
│   │   ├── reportAggreagations.js   # Report data aggregation
│   │   ├── reportPeriods.js         # Date range calculations
│   │   └── taxSlab.js               # Tax brackets by country
│   │
│   └── reports/                     # Generated report files
│
└── Frontend/
    ├── index.html                   # HTML entry point
    ├── vite.config.js               # Vite configuration
    ├── package.json                 # Frontend dependencies
    │
    ├── src/
    │   ├── App.jsx                  # Main app component with routing
    │   ├── main.jsx                 # React entry point
    │   │
    │   ├── pages/                   # Page components
    │   │   ├── login.jsx            # Login page
    │   │   ├── signup.jsx           # Registration page
    │   │   ├── forgetpassword.jsx   # Forgot password page
    │   │   ├── VerificationCode.jsx # OTP verification
    │   │   ├── VerifyOtp.jsx        # OTP verification (alternate)
    │   │   ├── resetpassword.jsx    # Password reset page
    │   │   ├── dashboard.jsx        # Main dashboard
    │   │   ├── transactions.jsx     # All transactions view
    │   │   ├── income.jsx           # Income management
    │   │   ├── expenses.jsx         # Expense management
    │   │   ├── budgets.jsx          # Budget management
    │   │   ├── categories.jsx       # Category settings
    │   │   ├── TaxEstimator.jsx     # Tax calculation tool
    │   │   ├── reports.jsx          # Report generation
    │   │   ├── profile.jsx          # User profile
    │   │   ├── notifications.jsx    # Notification settings
    │   │   └── security.jsx         # Security settings
    │   │
    │   ├── components/              # Reusable components
    │   │   ├── Sidebar.jsx          # Navigation sidebar
    │   │   ├── BudgetModal.jsx      # Budget creation modal
    │   │   ├── ExpenseModal.jsx     # Expense entry modal
    │   │   ├── IncomeModal.jsx      # Income entry modal
    │   │   ├── SettingsMenu.jsx     # Settings navigation
    │   │   └── SpendingChart.jsx    # Chart visualization
    │   │
    │   └── styles/                  # CSS stylesheets
    │       ├── dashboard.css
    │       ├── transactions.css
    │       ├── expenses.css
    │       ├── budgets.css
    │       ├── categories.css
    │       ├── taxestimator.css
    │       ├── reports.css
    │       ├── login.css
    │       ├── signup.css
    │       └── [other styles...]
    │
    └── public/
        └── assets/                  # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager
- SMTP credentials for email service

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Full-Stack-Taxpal-Team-3
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/taxpal
   JWT_SECRET=your_jwt_secret_key_here
   
   # SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

2. **Frontend Configuration**
   
   Update API endpoints in frontend if needed (typically in fetch calls)

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd Backend
   npm start
   # Server runs on http://localhost:4000
   ```

3. **Start Frontend Dev Server**
   ```bash
   cd Frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:4000`

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/users/register          - Register new user
POST   /api/users/login              - Login user
POST   /api/users/send-otp           - Send OTP for verification
POST   /api/users/verify-otp         - Verify OTP
POST   /api/users/forgot-password    - Initiate password reset
POST   /api/users/reset-password     - Reset password with OTP
GET    /api/users                    - Get all users (protected)
```

### Transaction Endpoints

```
POST   /api/transactions/income      - Add income
GET    /api/transactions/income      - Get all income
POST   /api/transactions/expense     - Add expense
GET    /api/transactions/expense     - Get all expenses
GET    /api/transactions             - Get all transactions
PUT    /api/transactions/:id         - Update transaction
DELETE /api/transactions/:id         - Delete transaction
```

### Budget Endpoints

```
POST   /api/budgets                  - Create budget
GET    /api/budgets                  - Get user budgets
PUT    /api/budgets/:id              - Update budget
DELETE /api/budgets/:id              - Delete budget
```

### Category Endpoints

```
GET    /api/categories               - Get categories (with type filter)
POST   /api/categories               - Add category
DELETE /api/categories/:id           - Delete category
```

### Tax Endpoints

```
POST   /api/tax/calculate            - Calculate quarterly tax
GET    /api/tax/estimates            - Get tax estimates
```

### Report Endpoints

```
POST   /api/reports/generate         - Generate report (PDF/CSV)
GET    /api/reports/recent           - Get recent reports
GET    /reports/:filename            - Download report file
```

---

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taxpal` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your_email@gmail.com` |
| `SMTP_PASS` | Email password | `your_app_password` |

---

## 🎯 Key Features Explained

### Tax Calculation Algorithm

TaxPal uses progressive tax slabs:

**India Tax Slabs:**
- Up to ₹250,000: 0%
- ₹250,001 - ₹500,000: 5%
- ₹500,001 - ₹1,000,000: 20%
- Above ₹1,000,000: 30%

**USA Tax Slabs:**
- Up to $11,000: 10%
- $11,001 - $44,725: 12%
- $44,726 - $95,375: 22%
- Above $95,375: 24%

### Report Generation

- **PDF Reports**: Professional formatted reports with headers, tables, and totals
- **CSV Reports**: Data exports for spreadsheet analysis
- **Report Types**:
  - Expense Summary (by category)
  - Income Summary (by category)
  - Overall Summary (combined view)

### Security Features

- **Password Encryption**: bcrypt with salt rounds
- **JWT Tokens**: Secure stateless authentication
- **OTP Verification**: 6-digit codes with 10-minute expiry
- **Protected Routes**: Middleware-based authorization

---

## 👥 Team

Developed by **Team 3** as part of the Full-Stack Development program.

### Team Members

- **Hanika**
- **Sairam**
- **Manasvi**
- **Shruthe**
- **Aditya**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📞 Support

For support, email your team lead or create an issue in the repository.

---

## 🙏 Acknowledgments

- Chart.js and Recharts for data visualization
- PDFKit for report generation
- MongoDB for database management
- The entire open-source community

---

**Made with ❤️ by Team 3**
