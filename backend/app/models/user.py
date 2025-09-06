import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    """
    User model for the AI Tour Guide Matcher platform.
    
    Stores user authentication and basic profile information with secure password handling.
    """
    __tablename__ = 'users'
    
    # Primary key as UUID for better security and scalability
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Email - unique and indexed for efficient lookups
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    
    # Hashed password storage
    hashed_password = db.Column(db.String(255), nullable=False)
    
    # Timestamp for user creation
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def set_password(self, password):
        """
        Hash and store the user's password.
        
        Args:
            password (str): Plain text password to hash and store
        """
        self.hashed_password = generate_password_hash(password)
    
    def check_password(self, password):
        """
        Verify a password against the stored hash.
        
        Args:
            password (str): Plain text password to verify
            
        Returns:
            bool: True if password matches, False otherwise
        """
        return check_password_hash(self.hashed_password, password)
    
    def to_dict(self):
        """
        Convert user instance to dictionary for JSON serialization.
        
        Returns:
            dict: User data excluding sensitive information
        """
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        """
        String representation of User instance.
        
        Returns:
            str: User representation showing email
        """
        return f'<User {self.email}>'