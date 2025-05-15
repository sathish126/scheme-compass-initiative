
# Healthcare Scheme Compass Integration Guide

This guide explains how to connect the Healthcare Scheme Compass frontend to the Python Flask backend.

## Backend Setup

1. **Install Dependencies**
```bash
cd healthcare_backend
pip install -r requirements.txt
```

2. **Configure Environment**
Create a `.env` file in the root directory with the following variables:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URI=sqlite:///healthcare.db  # or your preferred database
```

3. **Initialize Database**
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

4. **Start Backend Server**
```bash
flask run --port=5000
```

## Frontend Configuration

1. **Update API Base URL**
   
   The frontend is already configured to connect to `http://localhost:5000/api` by default. If your backend runs on a different URL, update it in the `src/api/index.ts` file.

2. **API Integration Points**

   | Frontend Feature | Backend Endpoint | Description |
   |------------------|-----------------|-------------|
   | User Authentication | `/api/auth/login`, `/api/auth/logout` | User login/logout |
   | Patient Management | `/api/patients` | List, create, update patients |
   | Approval Workflow | `/api/approvals` | Process scheme recommendations |
   | Dashboard Statistics | `/api/stats/dashboard` | Get role-specific dashboard data |

## Backend Implementation Notes

### Models

- **User Model**: Maps to different roles (facility, hospital, district, state, super)
- **Patient Model**: Stores patient demographics and medical info
- **Scheme Model**: Represents healthcare schemes
- **Recommendation Model**: Tracks approvals through the workflow

### Authentication Flow

1. Frontend calls `/api/auth/login` with credentials
2. Backend validates and returns user info with JWT token
3. Frontend stores token in localStorage
4. Subsequent API calls include token in Authorization header

### Approval Workflow

The backend implements a multi-level approval workflow:

1. Facility creates recommendation
2. Hospital admin approves/rejects
3. District admin approves/rejects
4. State admin gives final approval

## API Response Formats

All API endpoints return JSON responses with consistent formats:

**Success Response**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

## Testing the Integration

1. Start both backend and frontend servers
2. Use the test credentials provided on the login page
3. Backend authentication should establish a session
4. Dashboard should load with real data from the backend

## Troubleshooting

- Check browser console for API errors
- Verify CORS settings in Flask backend
- Ensure JWT token is properly set in localStorage
- Verify that backend server is running on the expected port
