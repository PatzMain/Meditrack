# MediTrack - Medical & Dental Clinic Management System

A comprehensive web-based system for managing medical and dental clinic operations, built with React, TypeScript, and Node.js.

## Features

- **Dashboard**: Overview of key metrics, charts, and recent activity
- **Medicine Inventory**: Track medicines with expiry dates, stock levels, and alerts
- **Patient Management**: Register and manage patient information
- **Consultations**: Create and track patient consultations
- **Real-time Updates**: Live data updates throughout the system
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query for data fetching
- Recharts for data visualization
- Lucide React for icons

### Backend
- Node.js with Express.js
- TypeScript
- Mock data for development
- CORS, Helmet, and other security middleware
- Rate limiting and compression

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone or extract the project:
   ```bash
   cd clinic-system
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) servers concurrently.

### Login Credentials
- **Email**: admin@clinic.com
- **Password**: password

## Development

### Running Individual Services

#### Frontend Only
```bash
cd apps/frontend
npm run dev
```

#### Backend Only
```bash
cd apps/backend
npm run dev
```

### Building for Production

#### Build All
```bash
npm run build
```

#### Build Frontend
```bash
npm run build:frontend
```

#### Build Backend
```bash
npm run build:backend
```

## Project Structure

```
clinic-system/
├── apps/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Page components
│   │   │   ├── lib/           # API client and utilities
│   │   │   └── hooks/         # Custom React hooks
│   │   └── package.json
│   └── backend/           # Express.js API
│       ├── src/
│       │   ├── controllers/   # Request handlers
│       │   ├── middleware/    # Express middleware
│       │   ├── routes/        # API routes
│       │   ├── services/      # Business logic
│       │   └── types/         # TypeScript types
│       └── package.json
├── packages/
│   └── shared-types/      # Shared TypeScript types
└── docs/                  # Documentation
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run install:all` - Install dependencies for all packages
- `npm run dev:frontend` - Start only the frontend development server
- `npm run dev:backend` - Start only the backend development server

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create new medicine
- `GET /api/medicines/:id` - Get medicine by ID
- `GET /api/medicines/low-stock` - Get low stock medicines
- `GET /api/medicines/expiring` - Get expiring medicines

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Register new patient
- `GET /api/patients/:id` - Get patient by ID

### Consultations
- `GET /api/consultations` - Get all consultations
- `POST /api/consultations` - Create new consultation
- `GET /api/consultations/:id` - Get consultation by ID

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

## Features Overview

### Dashboard
- Key performance indicators
- Monthly consultation trends
- Medication category distribution
- Recent activity feed
- Low stock and expiring medicine alerts

### Medicine Inventory
- Complete medicine database
- Expiry date tracking
- Low stock alerts
- Category-based organization
- Search and filtering

### Patient Management
- Patient registration
- Comprehensive patient profiles
- Student/Employee/Dependent categorization
- Contact information management

### Consultations
- Create new consultations
- Track consultation status
- Emergency case handling
- Physician assignment
- Time tracking

## Data Models

The system uses comprehensive data models for:
- Medicines (name, category, expiry, stock levels)
- Patients (demographics, contact info, medical history)
- Consultations (SOAP notes, vitals, diagnosis)
- Users (roles, permissions, profiles)

## Security Features

- JWT authentication
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- Error handling

## Development Notes

- Currently uses mock data for development
- Real database integration can be added by updating the API layer
- Responsive design works across all device sizes
- TypeScript provides full type safety
- Hot reloading enabled for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own clinic management needs.

## Support

For questions or issues, please check the documentation or create an issue in the project repository.