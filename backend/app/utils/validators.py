"""
Validation utilities for user input
"""

import re


def validate_email(email: str) -> bool:
    """
    Validate email format using regex pattern.
    
    Args:
        email (str): Email address to validate
        
    Returns:
        bool: True if email format is valid, False otherwise
    """
    if not email or not isinstance(email, str):
        return False
    
    # Basic email regex pattern
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    return bool(re.match(email_pattern, email))


def validate_password(password: str) -> bool:
    """
    Validate password strength requirements.
    Currently requires minimum 8 characters.
    
    Args:
        password (str): Password to validate
        
    Returns:
        bool: True if password meets requirements, False otherwise
    """
    if not password or not isinstance(password, str):
        return False
    
    # Basic requirement: minimum 8 characters
    return len(password) >= 8