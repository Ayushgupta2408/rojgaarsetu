```md
# Gig Worker Frontend Documentation

## Overview
This is the frontend application for the Gig Worker platform, built with React. It provides a user interface for Workers, Contractors, and Owners to interact with the backend API, manage profiles, apply for jobs, and handle vehicle forms.

---

## Table of Contents

- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Running the Frontend](#running-the-frontend)
- [Folder Structure](#folder-structure)
- [Main Features](#main-features)
- [Routing](#routing)
- [Components](#components)
- [API Integration](#api-integration)
- [User  Flows](#user-flows)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Environment Setup

Create a `.env` file in the root of the frontend directory with the following variables:

```text
REACT_APP_API_URL=<Backend API URL, e.g. http://localhost:3000/api/v1>
REACT_APP_CLOUDINARY_URL=<Cloudinary URL for image uploads>
```

---

## Installation

1. Clone the repository and navigate into the frontend folder.
2. Install dependencies:

```bash
npm install
```

---

## Running the Frontend

Run the application in development mode:

```bash
npm start
```

The application will be available at `http://localhost:5173`.

---

## Folder Structure

```
src/
├── components/          # Reusable components
├── pages/               # Page components for routing
├── redux/              # Redux slices and store configuration
├── api/                # API service calls
├── utils/              # Utility functions
├── App.jsx             # Main application component
├── index.js            # Entry point
└── styles/             # Global styles
```

---

## Main Features

- **User  Authentication:** Register, login, and OTP verification.
- **Profile Management:** Complete and update user profiles.
- **Job Management:** View, apply for jobs, and manage job applications.
- **Vehicle Management:** View, apply for vehicle forms, and manage vehicle applications.
- **Real-time Notifications:** Receive notifications for job applications and updates.

---

## Routing

The application uses React Router for navigation. The main routes include:

- `/login`: Login page
- `/register`: Registration page
- `/verify-otp`: OTP verification page
- `/dashboard`: User dashboard (different views for Workers, Contractors, and Owners)
- `/job/create`: Create a new job post (Contractor only)
- `/vehicle/create`: Create a new vehicle form (Contractor only)
- `/vehicle/applications`: View vehicle applications (Contractor only)
- `/job/applications`: View job applications (Contractor only)

---

## Components

### Auth Components

- **Login.jsx**: Handles user login.
- **Register.jsx**: Handles user registration.
- **OTPVerification.jsx**: Handles OTP verification.

### Dashboard Components

- **WorkerDashboard.jsx**: Displays the dashboard for Workers.
- **ContractorDashboard.jsx**: Displays the dashboard for Contractors.
- **OwnerDashboard.jsx**: Displays the dashboard for Owners.

### Application Components

- **ApplicationsOnJob.jsx**: Displays applications for a specific job.
- **ApplicationsOnVehicle.jsx**: Displays applications for a specific vehicle form.
- **SingleApplication.jsx**: Displays details of a single job application.
- **SingleVehicleApplication.jsx**: Displays details of a single vehicle application.

---

## API Integration

The frontend communicates with the backend API using Redux Toolkit's RTK Query. The API service is defined in `src/api/authApiSlice.js`, `src/api/contractorApiSlice.js`, and `src/api/ownerApiSlice.js`.

### Example API Call

To fetch job applications for a specific job:

```javascript
const { data: jobApplications, isLoading, error } = useGetJobApplicationsQuery(jobId);
```

---

## User Flows

### User Registration Flow

1. User navigates to the registration page.
2. User fills in the registration form and submits.
3. User receives an OTP via email.
4. User navigates to the OTP verification page and enters the OTP.
5. User is redirected to the dashboard upon successful verification.

### Job Application Flow

1. User views job listings on the dashboard.
2. User clicks on a job to view details.
3. User applies for the job by filling out the application form.
4. User receives a notification about the application status.

---

## Testing

To run tests, use the following command:

```bash
npm test
```

---

## Deployment

For production deployment, build the application using:

```bash
npm run build
```

The production-ready files will be available in the `build` directory. You can serve these files using any static file server.

---

_Last updated: 2025-04_
```