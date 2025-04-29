# Yoga App API

A Next.js application with API routes for managing admins, patients, and therapists.

## Features

- Authentication and authorization using JWT
- MongoDB integration with Mongoose
- Role-based access control
- API routes for:
  - Admin management
  - Patient management
  - Therapist management

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```

4. Run the development server:
```bash
npm run dev
```

## API Routes

### Admin Routes

- `POST /api/admin/login` - Admin login
- `POST /api/admin/signup` - Admin signup

### Patient Routes

- `POST /api/patient/login` - Patient login
- `POST /api/patient/signup` - Patient signup
- `GET /api/patient/get-all` - Get all patients (Admin/Therapist only)
- `GET /api/patient/get-by-id` - Get patient by ID
- `PUT /api/patient/update` - Update patient
- `DELETE /api/patient/delete` - Delete patient

### Therapist Routes

- `POST /api/therapist/login` - Therapist login
- `POST /api/therapist/signup` - Therapist signup
- `GET /api/therapist/get-all` - Get all therapists
- `GET /api/therapist/get-by-id` - Get therapist by ID
- `PUT /api/therapist/update` - Update therapist
- `DELETE /api/therapist/delete` - Delete therapist

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Models

### Admin
- email (unique)
- password (hashed)
- name
- role (default: 'admin')

### Patient
- email (unique)
- password (hashed)
- name
- age
- medicalHistory
- assignedTherapist (reference to Therapist)
- role (default: 'patient')

### Therapist
- email (unique)
- password (hashed)
- name
- specialization
- experience
- patients (array of references to Patient)
- role (default: 'therapist')

## Error Handling

All API routes include proper error handling and return appropriate HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

The application uses TypeScript for better type safety and development experience. Make sure to run type checks before deploying:

```bash
npm run build
``` 