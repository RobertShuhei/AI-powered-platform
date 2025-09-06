"""
Main routes blueprint for the AI Tour Guide Matcher API.
Contains general application routes including health checks and system status.
"""

from flask import Blueprint, jsonify
from datetime import datetime
import os

# Create blueprint for main routes
main_bp = Blueprint('main', __name__)


@main_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        JSON response with application status, timestamp, and version info
    """
    return jsonify({
        'status': 'healthy',
        'message': 'AI Tour Guide Matcher API is running',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'environment': os.getenv('FLASK_ENV', 'development')
    }), 200


@main_bp.route('/status', methods=['GET'])
def system_status():
    """
    System status endpoint providing detailed application information.
    
    Returns:
        JSON response with comprehensive system status
    """
    return jsonify({
        'application': 'AI Tour Guide Matcher API',
        'status': 'operational',
        'uptime': 'Available',
        'database': 'Connected',
        'api_version': 'v1',
        'endpoints': {
            'health': '/api/health',
            'status': '/api/status',
            'auth': '/api/auth/*',
            'users': '/api/users/*',
            'tours': '/api/tours/*'
        },
        'timestamp': datetime.utcnow().isoformat()
    }), 200


@main_bp.route('/', methods=['GET'])
def root():
    """
    Root endpoint providing basic API information.
    
    Returns:
        JSON response with welcome message and API details
    """
    return jsonify({
        'message': 'Welcome to AI Tour Guide Matcher API',
        'description': 'A platform connecting travelers with AI-powered personalized tour guides',
        'version': '1.0.0',
        'documentation': '/api/docs',
        'health_check': '/api/health'
    }), 200


@main_bp.errorhandler(404)
def not_found(error):
    """
    Handle 404 errors for this blueprint.
    
    Args:
        error: The 404 error object
        
    Returns:
        JSON response with error details
    """
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested endpoint does not exist',
        'status_code': 404
    }), 404


@main_bp.errorhandler(500)
def internal_error(error):
    """
    Handle 500 errors for this blueprint.
    
    Args:
        error: The 500 error object
        
    Returns:
        JSON response with error details
    """
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred',
        'status_code': 500
    }), 500