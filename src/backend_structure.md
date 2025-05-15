
# Healthcare Scheme Recommendation System - Backend Structure (Flask)

## Directory Structure

```
healthcare_backend/
├── app.py                  # Main Flask application entry point
├── config.py               # Configuration settings for different environments
├── requirements.txt        # Python dependencies
├── models/                 # Database models
│   ├── __init__.py
│   ├── user.py             # User model (facility, hospital, district, state, super)
│   ├── patient.py          # Patient model
│   ├── scheme.py           # Healthcare scheme model
│   └── recommendation.py   # Scheme recommendation model
├── routes/                 # API endpoints
│   ├── __init__.py
│   ├── auth.py             # Authentication routes
│   ├── patients.py         # Patient management routes
│   ├── approvals.py        # Approval workflow routes 
│   └── stats.py            # Statistics and dashboard data routes
├── services/               # Business logic
│   ├── __init__.py
│   ├── auth_service.py     # Authentication logic
│   ├── patient_service.py  # Patient-related business logic
│   ├── scheme_service.py   # Scheme management logic
│   └── approval_service.py # Approval workflow logic
├── utils/                  # Utility functions
│   ├── __init__.py
│   ├── security.py         # Security helpers (password hashing, etc.)
│   └── validators.py       # Input validation functions
└── tests/                  # Unit and integration tests
    ├── __init__.py
    ├── test_auth.py
    ├── test_patients.py
    └── test_approvals.py
```

## Key Implementation Files

### app.py
```python
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, supports_credentials=True)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.patients import patients_bp
    from routes.approvals import approvals_bp
    from routes.stats import stats_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(approvals_bp, url_prefix='/api/approvals')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
```

### config.py
```python
import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///healthcare.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
```

### models/user.py
```python
from models import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    facility = db.Column(db.String(100))
    hospital = db.Column(db.String(100))
    district = db.Column(db.String(100))
    state = db.Column(db.String(100))
    avatar = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
```

### routes/auth.py
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.auth_service import authenticate_user, get_user_by_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = authenticate_user(email, password)
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "facility": user.facility,
        "hospital": user.hospital,
        "district": user.district,
        "state": user.state,
        "avatar": user.avatar,
        "access_token": access_token
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = get_user_by_id(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "facility": user.facility,
        "hospital": user.hospital,
        "district": user.district,
        "state": user.state,
        "avatar": user.avatar
    })
```

### routes/approvals.py
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.approval_service import (
    get_pending_approvals_by_role,
    approve_recommendation,
    reject_recommendation
)

approvals_bp = Blueprint('approvals', __name__)

@approvals_bp.route('', methods=['GET'])
@jwt_required()
def get_approvals():
    current_user_id = get_jwt_identity()
    role = request.args.get('role')
    
    approvals = get_pending_approvals_by_role(current_user_id, role)
    return jsonify(approvals)

@approvals_bp.route('/<recommendation_id>/approve', methods=['POST'])
@jwt_required()
def approve(recommendation_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    comments = data.get('comments', '')
    
    result = approve_recommendation(recommendation_id, current_user_id, comments)
    if 'error' in result:
        return jsonify({"message": result['error']}), 400
    
    return jsonify(result)

@approvals_bp.route('/<recommendation_id>/reject', methods=['POST'])
@jwt_required()
def reject(recommendation_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    reason = data.get('reason', '')
    
    if not reason:
        return jsonify({"message": "Rejection reason is required"}), 400
    
    result = reject_recommendation(recommendation_id, current_user_id, reason)
    if 'error' in result:
        return jsonify({"message": result['error']}), 400
    
    return jsonify(result)
```

### services/approval_service.py
```python
from models.user import User
from models.recommendation import SchemeRecommendation
from models import db
from datetime import datetime

def get_pending_approvals_by_role(user_id, role):
    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}
    
    if user.role != role:
        return {'error': 'Unauthorized'}
    
    # Different approval stages for different roles
    if role == 'facility':
        # Facilities see their own submitted recommendations
        recommendations = SchemeRecommendation.query.filter(
            SchemeRecommendation.created_by == user_id
        ).all()
    elif role == 'hospital':
        # Hospitals see recommendations from their assigned facilities
        recommendations = SchemeRecommendation.query.filter(
            SchemeRecommendation.status == 'suggested',
            SchemeRecommendation.hospital_id == user.hospital_id
        ).all()
    elif role == 'district':
        # Districts see hospital approved recommendations from their district
        recommendations = SchemeRecommendation.query.filter(
            SchemeRecommendation.status == 'hospital_approved',
            SchemeRecommendation.district_id == user.district_id
        ).all()
    elif role == 'state':
        # States see district approved recommendations from their state
        recommendations = SchemeRecommendation.query.filter(
            SchemeRecommendation.status == 'district_approved',
            SchemeRecommendation.state_id == user.state_id
        ).all()
    else:
        recommendations = []
    
    return [r.to_dict() for r in recommendations]

def approve_recommendation(recommendation_id, user_id, comments):
    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}
    
    recommendation = SchemeRecommendation.query.get(recommendation_id)
    if not recommendation:
        return {'error': 'Recommendation not found'}
    
    # Check user role and update status accordingly
    if user.role == 'hospital' and recommendation.status == 'suggested':
        recommendation.status = 'hospital_approved'
        recommendation.hospital_approved_at = datetime.now()
        recommendation.hospital_approved_by = user_id
        recommendation.comments = comments
    elif user.role == 'district' and recommendation.status == 'hospital_approved':
        recommendation.status = 'district_approved'
        recommendation.district_approved_at = datetime.now()
        recommendation.district_approved_by = user_id
        recommendation.comments = comments
    elif user.role == 'state' and recommendation.status == 'district_approved':
        recommendation.status = 'state_approved'
        recommendation.state_approved_at = datetime.now()
        recommendation.state_approved_by = user_id
        recommendation.comments = comments
    else:
        return {'error': 'Invalid approval workflow or unauthorized'}
    
    recommendation.updated_at = datetime.now()
    db.session.commit()
    
    return recommendation.to_dict()

def reject_recommendation(recommendation_id, user_id, reason):
    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}
    
    recommendation = SchemeRecommendation.query.get(recommendation_id)
    if not recommendation:
        return {'error': 'Recommendation not found'}
    
    # Verify user can reject this recommendation
    if user.role == 'hospital' and recommendation.status == 'suggested':
        pass  # Hospital can reject facility recommendations
    elif user.role == 'district' and recommendation.status == 'hospital_approved':
        pass  # District can reject hospital recommendations
    elif user.role == 'state' and recommendation.status == 'district_approved':
        pass  # State can reject district recommendations
    else:
        return {'error': 'Invalid rejection workflow or unauthorized'}
    
    recommendation.status = 'rejected'
    recommendation.rejection_reason = reason
    recommendation.rejected_by = user_id
    recommendation.rejected_at = datetime.now()
    recommendation.updated_at = datetime.now()
    
    db.session.commit()
    
    return recommendation.to_dict()
```

### requirements.txt
```
Flask==2.3.3
Flask-Cors==4.0.0
Flask-JWT-Extended==4.5.3
Flask-SQLAlchemy==3.1.1
SQLAlchemy==2.0.23
pytest==7.4.3
python-dotenv==1.0.0
Werkzeug==2.3.8
gunicorn==21.2.0
```
