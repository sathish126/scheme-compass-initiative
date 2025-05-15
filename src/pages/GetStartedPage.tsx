
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { markdownToHtml } from "@/hooks/use-markdown";
import Loading from "@/components/ui/loading";

const GetStartedPage = () => {
  const [guide, setGuide] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetch of markdown content from backend
    // In a real app, this would fetch from the API
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockMarkdown = `# Healthcare Scheme Compass Integration Guide

This guide explains how to connect the Healthcare Scheme Compass frontend to the Python Flask backend.

## Backend Setup

1. **Install Dependencies**
\`\`\`bash
cd healthcare_backend
pip install -r requirements.txt
\`\`\`

2. **Configure Environment**
Create a \`.env\` file in the root directory with the following variables:
\`\`\`
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URI=sqlite:///healthcare.db  # or your preferred database
\`\`\`

3. **Initialize Database**
\`\`\`bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
\`\`\`

4. **Start Backend Server**
\`\`\`bash
flask run --port=5000
\`\`\`

## Frontend Configuration

1. **Update API Base URL**
   
   The frontend is already configured to connect to \`http://localhost:5000/api\` by default. If your backend runs on a different URL, update it in the \`src/api/index.ts\` file.

## Backend Implementation Notes

### Models

- **User Model**: Maps to different roles (facility, hospital, district, state, super)
- **Patient Model**: Stores patient demographics and medical info
- **Scheme Model**: Represents healthcare schemes
- **Recommendation Model**: Tracks approvals through the workflow

### Authentication Flow

1. Frontend calls \`/api/auth/login\` with credentials
2. Backend validates and returns user info with JWT token
3. Frontend stores token in localStorage
4. Subsequent API calls include token in Authorization header

### Approval Workflow

The backend implements a multi-level approval workflow:

1. Facility creates recommendation
2. Hospital admin approves/rejects
3. District admin approves/rejects
4. State admin gives final approval`;

      setGuide(mockMarkdown);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Get Started Guide</h1>
          </div>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList>
            <TabsTrigger value="guide">Integration Guide</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="models">Data Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Frontend-Backend Integration Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {isLoading ? (
                    <Loading size="large" text="Loading guide content..." />
                  ) : (
                    <div className="markdown-content" 
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(guide) }} 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-4">Authentication Endpoints</h3>
                <div className="space-y-4">
                  <ApiEndpoint 
                    method="POST" 
                    endpoint="/api/auth/login" 
                    description="Authenticate user and get JWT token" 
                    requestSample={`{
  "email": "user@example.com",
  "password": "password123"
}`}
                    responseSample={`{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "name": "Jane Smith",
      "email": "jane.smith@facility.com",
      "role": "facility"
    }
  }
}`}
                  />
                  
                  <ApiEndpoint 
                    method="POST" 
                    endpoint="/api/auth/logout" 
                    description="Invalidate current session"
                    responseCode={204}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Patient Endpoints</h3>
                <div className="space-y-4">
                  <ApiEndpoint 
                    method="GET" 
                    endpoint="/api/patients" 
                    description="Get all patients" 
                    responseSample={`{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "age": 45,
      "gender": "male"
    }
  ]
}`}
                  />
                  
                  <ApiEndpoint 
                    method="POST" 
                    endpoint="/api/patients" 
                    description="Create a new patient" 
                    requestSample={`{
  "name": "Patient Name",
  "age": 45,
  "gender": "female",
  "address": "123 Main St",
  "contact": "555-123-4567"
}`}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Approval Endpoints</h3>
                <div className="space-y-4">
                  <ApiEndpoint 
                    method="GET" 
                    endpoint="/api/approvals?role=hospital" 
                    description="Get pending approvals for specified role" 
                  />
                  
                  <ApiEndpoint 
                    method="POST" 
                    endpoint="/api/approvals/:id/approve" 
                    description="Approve a recommendation" 
                    requestSample={`{
  "comments": "Approved based on eligibility criteria"
}`}
                  />
                  
                  <ApiEndpoint 
                    method="POST" 
                    endpoint="/api/approvals/:id/reject" 
                    description="Reject a recommendation" 
                    requestSample={`{
  "reason": "Patient already enrolled in another scheme"
}`}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Statistics Endpoints</h3>
                <div className="space-y-4">
                  <ApiEndpoint 
                    method="GET" 
                    endpoint="/api/stats/dashboard?role=facility" 
                    description="Get role-specific dashboard statistics" 
                    responseSample={`{
  "totalPatients": 245,
  "registeredToday": 8,
  "pendingApprovals": 12,
  "patientFollowups": 5
}`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>Data Models Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">User Model</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
{`# models/user.py
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # facility, hospital, district, state, super
    facility = db.Column(db.String(100))
    hospital = db.Column(db.String(100))
    district = db.Column(db.String(100))
    state = db.Column(db.String(100))
    avatar = db.Column(db.String(200))`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Patient Model</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
{`# models/patient.py
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(200))
    contact = db.Column(db.String(20))
    medical_history = db.Column(db.Text)
    income = db.Column(db.Float)
    category = db.Column(db.String(20))  # general, obc, sc, st
    insurance_status = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey('user.id'))`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Scheme Model</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
{`# models/scheme.py
class Scheme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    eligibility_criteria = db.Column(db.JSON)
    benefits = db.Column(db.JSON)
    documents = db.Column(db.JSON)`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendation Model</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
{`# models/recommendation.py
class SchemeRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    scheme_id = db.Column(db.Integer, db.ForeignKey('scheme.id'))
    status = db.Column(db.String(20), default='suggested')  # suggested, hospital_approved, district_approved, state_approved, rejected
    hospital_approved_at = db.Column(db.DateTime)
    district_approved_at = db.Column(db.DateTime)
    state_approved_at = db.Column(db.DateTime)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Helper component to display API endpoints
const ApiEndpoint = ({ 
  method, 
  endpoint, 
  description, 
  requestSample, 
  responseSample,
  responseCode = 200
}: { 
  method: string; 
  endpoint: string; 
  description: string; 
  requestSample?: string; 
  responseSample?: string;
  responseCode?: number;
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded ${
          method === "GET" ? "bg-blue-100 text-blue-700" :
          method === "POST" ? "bg-green-100 text-green-700" :
          method === "PUT" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>
          {method}
        </span>
        <span className="font-mono text-sm">{endpoint}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      
      {requestSample && (
        <div className="mt-2">
          <h4 className="text-xs font-medium mb-1">Request Body</h4>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-auto">
            {requestSample}
          </pre>
        </div>
      )}
      
      {responseSample ? (
        <div className="mt-2">
          <h4 className="text-xs font-medium mb-1">Response ({responseCode})</h4>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-auto">
            {responseSample}
          </pre>
        </div>
      ) : (
        <div className="mt-2">
          <h4 className="text-xs font-medium">Response Code: {responseCode}</h4>
        </div>
      )}
    </div>
  );
};

export default GetStartedPage;
