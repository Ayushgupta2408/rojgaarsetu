`readmeBackend.md`
```md
# Rojgaar Setu API Backend Documentation

## Overview
This is the backend API server for the Rojgaar Setu application, built with Node.js, Express, and MongoDB. It serves RESTful endpoints for authentication, user profiles, job postings, vehicle forms, applications, notifications, and recommendations.

---

## Table of Contents

- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth APIs](#auth-apis)
  - [Profile APIs](#profile-apis)
  - [Worker APIs](#worker-apis)
  - [Contractor APIs](#contractor-apis)
  - [Owner APIs](#owner-apis)
  - [Job APIs](#job-apis)
  - [Vehicle APIs](#vehicle-apis)
  - [Notification APIs](#notification-apis)
  - [PDF Generation](#pdf-generation)
  - [Recommendation APIs](#recommendation-apis)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Notes](#notes)

---

## Environment Setup

Create a `.env` file with the following important environment variables (based on `.env.sample`):

```text
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<JWT secret key>
EMAIL_SERVICE=<Email service provider e.g. gmail>
EMAIL_USER=<Email address used for sending OTP>
EMAIL_PASSWORD=<Password or app password for EMAIL_USER>
EMAIL_FROM=<From email address for OTP emails>
FRONTEND_URL=<Frontend application URL, e.g. http://localhost:5173>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
PORT=<Port for API server, default: 3000>
NODE_ENV=<development|production>
```

---

## Installation

1. Clone the repository and navigate into backend folder
2. Install dependencies:

```bash
npm install
```

3. Setup `.env` file as above

---

## Running the Server

Run locally in development mode:

```bash
npm run dev
```

Or to start normally:

```bash
npm start
```

The server runs by default on `http://localhost:3000`.

---

## Authentication

Authentication is based on JWT tokens:
- Tokens are generated on login/registration
- JWT tokens are sent as HttpOnly cookies named `token`
- Or can be sent as Bearer token in `Authorization` header

---

## API Endpoints

All API endpoints are under the `/api/v1` prefix.

### Auth APIs

#### Register User

- **URL:** `/api/v1/auth/register`
- **Method:** POST
- **Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "password123",
  "userType": "Worker"
}
```

- **Response:**

```json
{
  "message": "User registered successfully. Please verify your account with the OTP sent to your email.",
  "user": {
    "id": "userIdHere",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "userType": "Worker",
    "profileId": "profileIdHere",
    "otpVerified": false
  },
  "token": "jwt_token_here"
}
```

---

#### Login User

- **URL:** `/api/v1/auth/login`
- **Method:** POST
- **Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Response:**

```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "userIdHere",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "userType": "Worker",
    "profileId": "profileIdHere",
    "otpVerified": true
  },
  "token": "jwt_token_here"
}
```

---

#### Logout User

- **URL:** `/api/v1/auth/logout`
- **Method:** POST
- **Response:**

```json
{
  "message": "Logged out successfully"
}
```

---

#### Verify OTP

- **URL:** `/api/v1/auth/verify-otp`
- **Method:** POST
- **Body:**

```json
{
  "userId": "userIdHere",
  "otp": "123456"
}
```

_UserId or Email is required together with OTP._

- **Response:**

```json
{
  "message": "OTP verified successfully"
}
```

---

#### Resend OTP

- **URL:** `/api/v1/auth/resend-otp`
- **Method:** POST
- **Body:**

```json
{
  "userId": "userIdHere"
}
```

Or:

```json
{
  "email": "john.doe@example.com"
}
```

- **Response:**

```json
{
  "message": "OTP sent successfully to your email"
}
```

---

#### Get Current User

- **URL:** `/api/v1/auth/me`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>` or cookie with `token`
- **Response:**

```json
{
  "user": {
    "id": "userIdHere",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "userType": "Worker",
    "profileId": "profileIdHere",
    "otpVerified": true
  },
  "profile": {
    // profile data depending on userType
  }
}
```

---

### Profile APIs

#### Complete Profile

- **URL:** `/api/v1/profile/complete`
- **Method:** PUT
- **Headers:** Authentication required (token)
- **Body:** Fields depend on user type (Worker, Contractor, Owner)

Example for Worker:

```json
{
  "lookingFor": "construction work",
  "expectedSalary": 1000
}
```

- **Response:**

```json
{
  "message": "Profile updated successfully",
  "profile": {/* updated profile data */},
  "completionPercentage": 80
}
```

---

#### Get Profile

- **URL:** `/api/v1/profile`
- **Method:** GET
- **Headers:** Authentication required
- **Response:**

```json
{
  "profile": {
    // Profile data depending on user type
  }
}
```

---

#### Upload Profile Image

- **URL:** `/api/v1/profile/image`
- **Method:** POST
- **Headers:** Authentication required
- **Form Data:** `image` (image file)
- **Response:**

```json
{
  "message": "Profile image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/your_cloudinary/imagename.jpg",
  "profile": {/* updated profile data */}
}
```

---

#### Upload Resume (Worker only)

- **URL:** `/api/v1/profile/upload-resume`
- **Method:** POST
- **Headers:** Authentication required
- **Form Data:** `resume` (PDF/DOC file)
- **Response:**

```json
{
  "message": "Resume uploaded successfully",
  "resumeUrl": "https://res.cloudinary.com/your_cloudinary/resume.pdf",
  "profile": {/* updated profile data */}
}
```

---

### Worker APIs

#### Get Portfolio

- **URL:** `/api/v1/worker/portfolio/:id?`
- **Method:** GET
- **Response:**

```json
{
  "portfolio": {
    "id": "workerId",
    "name": "Worker Name",
    "currentStatus": "unemployed",
    "lookingFor": "...",
    "pastExperience": 5,
    "rating": 4.5,
    "image": "cloudinary_url"
  }
}
```

---

#### Apply for Job

- **URL:** `/api/v1/worker/job/:jobPostId/apply`
- **Method:** POST
- **Headers:** Authentication required, profile must be >= 90% complete
- **Body:**

```json
{
  "experience": 3,
  "availability": "2 months"
}
```

- **Response:**

```json
{
  "message": "Job application submitted successfully",
  "application": {
    "workerId": "workerId",
    "jobPostId": "jobPostId",
    "name": "Worker Name",
    "experience": 3,
    "email": "worker@example.com",
    "phone": "1234567890",
    "profileLink": "frontend_url/worker/workerId",
    "lookingFor": "...",
    "availability": "2 months",
    "status": "underreview",
    "appliedAt": "ISODate",
    "_id": "applicationId"
  }
}
```

---

#### Get Worker Dashboard

- **URL:** `/api/v1/worker/dashboard`
- **Method:** GET
- **Response:**

Categorized applications by status, recommended jobs array, etc.

---

#### Respond to Offer

- **URL:** `/api/v1/worker/application/:applicationId/respond`
- **Method:** PUT
- **Body:**

```json
{
  "action": "accept"
}
```

or

```json
{
  "action": "reject"
}
```

- **Response:**

```json
{
  "message": "Offer accepted successfully" // or "Offer rejected successfully"
}
```

---

#### Accept Joining Letter

- **URL:** `/api/v1/worker/application/:applicationId/accept-joining`
- **Method:** PUT
- **Response:**

```json
{
  "message": "Joining letter accepted successfully. Your status has been updated to \"working\""
}
```

---

#### Upload Resume

(Already described in Profile APIs)

---

### Contractor APIs

#### Job Posting Endpoints

- Create, Update, Delete, View Job Posts, View all Jobs

Example: Create Job Post

- **URL:** `/api/v1/contractor/job`
- **Method:** POST
- **Body:**

```json
{
  "title": "Construction Worker",
  "payscale": 1000,
  "requiredSkill": "carpentry",
  "experienceRequired": 2,
  "noOfWorkers": 5,
  "location": "New York",
  "duration": "3 months",
  "description": "Work on site"
}
```

- **Response:**

```json
{
  "message": "Job post created successfully",
  "jobPost": {/* job post data */}
}
```

---

#### Vehicle Form Endpoints

- Create, Update, Delete, View Vehicle/Instrument Forms

Example: Create Vehicle Form

- **URL:** `/api/v1/contractor/vehicle`
- **Method:** POST
- **Body:**

```json
{
  "title": "Large Excavator",
  "type": "vehicle",
  "payscale": 1500,
  "brand": "Caterpillar",
  "quantity": 1,
  "purchaseDate": "2020-05-10",
  "location": "New York",
  "organization": "Company A",
  "otherDetails": "Used for digging"
}
```

- **Response:**

```json
{
  "message": "Vehicle/instrument form created successfully",
  "vehicleForm": {/* vehicle form data */}
}
```

---

#### Application Processing (Job)

- **URL:** `/api/v1/contractor/application/:applicationId/process`
- **Method:** PUT
- **Body:**

```json
{
  "action": "consider" // or "reject", or "sendOffer"
}
```

- **Response:**

```json
{
  "message": "Application marked as considering"
}
```

or on sending offer:

```json
{
  "message": "Offer letter sent successfully",
  "offerLetterUrl": "https://..."
}
```

---

#### Send Joining Letter

- **URL:** `/api/v1/contractor/application/:applicationId/joining-letter`
- **Method:** POST
- **Response:**

```json
{
  "message": "Joining letter sent successfully",
  "joiningLetterUrl": "https://..."
}
```

---

#### Application Processing (Vehicle)

- **URL:** `/api/v1/contractor/vehicle-application/:applicationId/process`
- **Method:** PUT
- **Body:**

```json
{
  "action": "accept" // or "reject"
}
```

- **Response:**

```json
{
  "message": "Vehicle application accepted"
}
```

---

#### Send Invitation

- **URL:** `/api/v1/contractor/invite`
- **Method:** POST
- **Body:**

```json
{
  "userType": "Worker",
  "userId": "workerIdHere",
  "jobPostId": "jobIdHere",
  "message": "Invitation message..."
}
```

or for vehicle form:

```json
{
  "userType": "Owner",
  "userId": "ownerIdHere",
  "vehicleFormId": "vehicleFormIdHere",
  "message": "Invitation message..."
}
```

- **Response:**

```json
{
  "message": "Invitation sent successfully to worker",
  "notification": {/* notification data */}
}
```

---

#### Upload Project Image

- **URL:** `/api/v1/contractor/project/image`
- **Method:** POST
- **FormData:** `image` (image file), `projectIndex` (optional number)
- **Response:**

```json
{
  "message": "Project image uploaded successfully",
  "imageUrl": "https://...",
  "project": {/* updated project info if projectIndex provided */}
}
```

---

#### Dashboard

- **URL:** `/api/v1/contractor/dashboard`
- **Method:** GET
- **Response:** Contains jobs, vehicle forms, applications categorized by status, recommendations.

---

### Owner APIs

- Dashboard, apply for vehicle form, add/remove vehicles, upload vehicle images.

Example: Apply for Vehicle Form

- **URL:** `/api/v1/owner/vehicle/:vehicleFormId/apply`
- **Method:** POST
- **Body:**

```json
{
  "type": "vehicle",
  "brand": "Toyota",
  "quantity": 1,
  "purchaseDate": "2021-01-01",
  "location": "New York",
  "ownerDetails": "Experienced driver"
}
```

- **Response:**

```json
{
  "message": "Vehicle application submitted successfully",
  "application": {/* application data */}
}
```

---

### Job APIs (Public)

#### Get All Jobs

- **URL:** `/api/v1/jobs`
- **Method:** GET
- **Query Params:** `location`, `skill`, `minSalary`, `maxSalary`, `experience`, `page`, `limit`
- **Response:**

```json
{
  "jobPosts": [/* array of job posts */],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

---

#### Get Job By ID

- **URL:** `/api/v1/jobs/:id`
- **Method:** GET
- **Response:**

```json
{
  "jobPost": {/* job post data */}
}
```

---

### Vehicle APIs

#### Get All Vehicle Forms

- **URL:** `/api/v1/vehicles`
- **Method:** GET
- **Query Params:** `location`, `type`, `minSalary`, `maxSalary`, `page`, `limit`
- **Response:**

```json
{
  "vehicleForms": [/* array of vehicle forms */],
  "pagination": {
    "total": 30,
    "page": 1,
    "pages": 3
  }
}
```

---

#### Get Vehicle Form By ID

- **URL:** `/api/v1/vehicles/:id`
- **Method:** GET
- **Response:**

```json
{
  "vehicleForm": {/* vehicle form data */}
}
```

---

#### Apply for Vehicle Form (Worker or Owner)

- **URL:** `/api/v1/vehicles/:vehicleFormId/apply`
- **Method:** POST
- **Headers:** Authentication, profile completion >= 90%
- **Body:** FormData with optional vehicle images (`vehicles`), plus fields:

```json
{
  "type": "vehicle",
  "brand": "Toyota",
  "quantity": 1,
  "purchaseDate": "2021-01-01",
  "location": "New York",
  "ownerDetails": "Experienced driver"
}
```

- **Response:**

```json
{
  "message": "Vehicle application submitted successfully",
  "application": {/* application data */}
}
```

---

#### Get User Vehicle Applications

- **URL:** `/api/v1/vehicles/applications/me`
- **Method:** GET
- **Headers:** Authentication
- **Response:** List of vehicle applications for current user.

---

### Notification APIs

#### Get Notifications

- **URL:** `/api/v1/notifications`
- **Method:** GET
- **Headers:** Authentication
- **Query Params:** `page`, `limit`
- **Response:**

```json
{
  "notifications": [/* notification list */],
  "unreadCount": 5,
  "pagination": {
    "total": 20,
    "page": 1,
    "pages": 2
  }
}
```

---

#### Mark Notification As Read

- **URL:** `/api/v1/notifications/:id/read`
- **Method:** PUT
- **Headers:** Authentication
- **Response:**

```json
{
  "message": "Notification marked as read"
}
```

---

#### Mark All Notifications As Read

- **URL:** `/api/v1/notifications/read-all`
- **Method:** PUT
- **Headers:** Authentication
- **Response:**

```json
{
  "message": "All notifications marked as read"
}
```

---

### PDF Generation

- **URL:** `/api/v1/pdf/generate`
- **Method:** POST
- **Headers:** Authentication, Contractor only
- **Body:**

```json
{
  "templateType": "offer", // or "joining"
  "data": {
    "workerName": "John Doe",
    "contractorName": "Best Contractor",
    "organizationName": "XYZ Corp",
    "jobTitle": "Carpenter",
    "payscale": 1200,
    "location": "New York",
    "startDate": "2023-05-01",
    "duration": "3 months"
  }
}
```

- **Response:**

```json
{
  "message": "offer letter generated successfully",
  "url": "https://cloudinary.com/path/offer_letter.pdf"
}
```

---

### Recommendation APIs

- **URL:** `/api/v1/recommendations`
- **Method:** GET
- **Headers:** Authentication
- **Query Params:** Optional `jobId`, `vehicleFormId`
- **Response:**

```json
{
  "recommendations": [/* recommended jobs, workers, or vehicle forms based on user type */]
}
```

---

## Middleware

- **auth:** Validates JWT tokens
- **isWorker / isContractor / isOwner:** Role-based access control
- **isProfileComplete:** Checks user profile >= 90% completion
- **validateFields:** Validates required fields
- **validateNumeric:** Validates numeric fields with min/max constraints
- **uploadImage / uploadDocument:** For handling file uploads with multer and Cloudinary storage

---

## Error Handling

Errors return JSON with:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error if any"
}
```

---

## Additional Notes

- Passwords are securely hashed with bcryptjs.
- Transfers and storage of files and images are handled using Cloudinary.
- Real-time notifications are supported via socket.io.
- All date fields are ISO strings.
- API responses include success indicators and meaningful messages.
- Pagination is supported on list endpoints.

---

_Last updated: 2025-04_


```