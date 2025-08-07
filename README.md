# Smart Course Registration and Conflict Resolution System (SMART-CRS)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)

## 📋 Overview

SMART-CRS is a comprehensive course registration system designed for modern educational institutions. It streamlines the course registration process by automatically detecting and resolving scheduling conflicts, managing prerequisites, and facilitating student-advisor communication.

![SMART-CRS Dashboard](screenshot.png)

## ✨ Key Features

### For Students
- � Real-time course availability tracking
- 🚫 Automatic conflict detection and resolution
- � Visual schedule builder
- 📝 Prerequisites verification
- 📬 Instant registration status notifications

### For Advisors
- 👥 Student roster management
- 📊 Course load analysis
- ✅ Quick registration approval
- 📅 Advising session scheduler
- � Progress tracking dashboard

### For Administrators
- ⚙️ Course catalog management
- 👥 User role management
- � Registration analytics
- 🔧 System configuration
- 📑 Policy enforcement tools

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: React Context API
- **UI Components**: 
  - Material UI (MUI) v5
  - Headless UI
  - Hero Icons
- **Styling**: 
  - Tailwind CSS
  - Emotion (CSS-in-JS)
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript
- **ORM**: Sequelize 6.x
- **Authentication**: JSON Web Tokens (JWT)
- **API Documentation**: Swagger/OpenAPI

### Database
- **RDBMS**: MySQL 8.0+
- **Migrations**: Sequelize CLI
- **Backup**: Automated daily backups

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Dependencies

#### Frontend Dependencies
```json
{
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "@mui/icons-material": "^5.14.5",
    "@mui/material": "^5.14.5",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.20",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.4.1",
    "@typescript-eslint/parser": "^6.4.1",
    "@vitejs/plugin-react": "^4.0.4",
    "autoprefixer": "^10.4.15",
    "eslint": "^8.47.0",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.1.6",
    "vite": "^4.4.9"
  }
}
```

#### Backend Dependencies
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.1",
    "mysql2": "^3.6.0",
    "sequelize": "^6.32.1",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.1",
    "@typescript-eslint/eslint-plugin": "^6.4.1",
    "@typescript-eslint/parser": "^6.4.1",
    "eslint": "^8.47.0",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  }
}
```

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rajking69/Smart-Course-Registration-Conflict-Resolution-System.git
   cd Smart-Course-Registration-Conflict-Resolution-System
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database and other environment variables
   npm run dev
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

## 💻 Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

#### Backend
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run migrate` - Run database migrations

### Project Structure
```
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── tests/         # Test files
│   └── ...
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
│   └── ...
└── README.md
```

## 🧪 Testing

### Running Tests
```bash
# Frontend Tests
cd frontend
npm run test

# Backend Tests
cd backend
npm run test
```

## 📚 API Documentation

API documentation is available at `/api/docs` when running the backend server. It includes:
- Detailed endpoint descriptions
- Request/response examples
- Authentication requirements
- Schema definitions

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

Rajking69 - [GitHub Profile](https://github.com/rajking69)

Project Link: [https://github.com/rajking69/Smart-Course-Registration-Conflict-Resolution-System](https://github.com/rajking69/Smart-Course-Registration-Conflict-Resolution-System)
