from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint for the AI Tour Guide Matcher platform.
    
    Accepts email and password, validates input, checks for existing users,
    creates new user account with hashed password.
    
    Returns:
        201: User registered successfully with user ID and email
        400: Invalid input data
        409: User with email already exists
        500: Registration failed due to server error
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Basic email validation
        if '@' not in email or len(email) < 5:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Basic password validation
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Check if user with email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        user = User(email=email)
        user.set_password(password)
        
        # Add to database
        db.session.add(user)
        db.session.commit()
        
        # Return success response
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'email': user.email
            }
        }), 201
        
    except Exception as e:
        # Rollback database transaction on error
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint for the AI Tour Guide Matcher platform.
    
    Accepts email and password, validates credentials, and returns JWT token.
    
    Returns:
        200: Login successful with JWT access token
        400: Invalid input data
        401: Invalid credentials (user not found or incorrect password)
        500: Login failed due to server error
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create JWT access token
        access_token = create_access_token(identity=user.id)
        
        # Return success response with token
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500